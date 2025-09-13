"""
User API routes with comprehensive CRUD operations and advanced features
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query, BackgroundTasks
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, or_
from sqlalchemy.orm import selectinload
import structlog

from app.database import get_db
from app.models.user import User
from app.schemas.user import (
    UserCreate, UserUpdate, UserResponse, UserListResponse, 
    UserLogin, TokenResponse, UserProfile
)
from app.services.auth_service import AuthService
from app.services.user_service import UserService
from app.services.email_service import EmailService
from app.utils.pagination import paginate
from app.utils.rate_limiting import rate_limit
from app.config import settings

logger = structlog.get_logger()
router = APIRouter()
security = HTTPBearer()

# Dependency injection
def get_auth_service() -> AuthService:
    return AuthService()

def get_user_service() -> UserService:
    return UserService()

def get_email_service() -> EmailService:
    return EmailService()


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
@rate_limit(requests=5, window=300)  # 5 requests per 5 minutes
async def register_user(
    user_data: UserCreate,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    user_service: UserService = Depends(get_user_service),
    email_service: EmailService = Depends(get_email_service)
):
    """
    Register a new user account
    
    - **email**: User's email address (must be unique)
    - **password**: Strong password (min 8 characters)
    - **first_name**: User's first name
    - **last_name**: User's last name
    """
    logger.info("User registration attempt", email=user_data.email)
    
    try:
        # Check if user already exists
        existing_user = await user_service.get_user_by_email(db, user_data.email)
        if existing_user:
            logger.warning("Registration failed - user exists", email=user_data.email)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this email already exists"
            )
        
        # Create new user
        new_user = await user_service.create_user(db, user_data)
        
        # Send welcome email in background
        background_tasks.add_task(
            email_service.send_welcome_email,
            user_email=new_user.email,
            user_name=new_user.first_name or "User"
        )
        
        logger.info("User registered successfully", user_id=new_user.id, email=new_user.email)
        return UserResponse.from_orm(new_user)
        
    except Exception as e:
        logger.error("User registration failed", error=str(e), email=user_data.email)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to register user"
        )


@router.post("/login", response_model=TokenResponse)
@rate_limit(requests=10, window=300)  # 10 login attempts per 5 minutes
async def login_user(
    login_data: UserLogin,
    db: AsyncSession = Depends(get_db),
    auth_service: AuthService = Depends(get_auth_service),
    user_service: UserService = Depends(get_user_service)
):
    """
    Authenticate user and return access token
    
    - **email**: User's email address
    - **password**: User's password
    """
    logger.info("Login attempt", email=login_data.email)
    
    try:
        # Authenticate user
        user = await auth_service.authenticate_user(
            db, login_data.email, login_data.password
        )
        
        if not user:
            logger.warning("Login failed - invalid credentials", email=login_data.email)
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        if not user.is_active:
            logger.warning("Login failed - inactive account", email=login_data.email)
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Account is deactivated"
            )
        
        # Generate tokens
        access_token = auth_service.create_access_token({"sub": str(user.id)})
        refresh_token = auth_service.create_refresh_token({"sub": str(user.id)})
        
        # Update last login timestamp
        await user_service.update_last_login(db, user.id)
        
        logger.info("Login successful", user_id=user.id, email=user.email)
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
            user=UserResponse.from_orm(user)
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Login failed", error=str(e), email=login_data.email)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Login failed"
        )


@router.get("/me", response_model=UserProfile)
async def get_current_user_profile(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db),
    auth_service: AuthService = Depends(get_auth_service),
    user_service: UserService = Depends(get_user_service)
):
    """Get current authenticated user's profile"""
    user = await auth_service.get_current_user(db, credentials.credentials)
    profile = await user_service.get_user_profile(db, user.id)
    return UserProfile.from_orm(profile)


@router.put("/me", response_model=UserResponse)
async def update_current_user(
    user_update: UserUpdate,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db),
    auth_service: AuthService = Depends(get_auth_service),
    user_service: UserService = Depends(get_user_service)
):
    """Update current authenticated user's profile"""
    current_user = await auth_service.get_current_user(db, credentials.credentials)
    
    logger.info("User profile update", user_id=current_user.id)
    
    try:
        updated_user = await user_service.update_user(db, current_user.id, user_update)
        logger.info("User profile updated", user_id=current_user.id)
        return UserResponse.from_orm(updated_user)
        
    except Exception as e:
        logger.error("User profile update failed", error=str(e), user_id=current_user.id)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update user profile"
        )


@router.get("/", response_model=UserListResponse)
async def list_users(
    page: int = Query(1, ge=1, description="Page number"),
    size: int = Query(20, ge=1, le=100, description="Page size"),
    search: Optional[str] = Query(None, description="Search in name or email"),
    is_active: Optional[bool] = Query(None, description="Filter by active status"),
    sort_by: str = Query("created_at", description="Sort field"),
    sort_order: str = Query("desc", regex="^(asc|desc)$", description="Sort order"),
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db),
    auth_service: AuthService = Depends(get_auth_service)
):
    """
    List users with pagination, filtering, and search
    
    - **page**: Page number (starts from 1)
    - **size**: Number of items per page (1-100)
    - **search**: Search term for name or email
    - **is_active**: Filter by active status
    - **sort_by**: Field to sort by
    - **sort_order**: Sort order (asc/desc)
    """
    # Verify admin access
    current_user = await auth_service.get_current_user(db, credentials.credentials)
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    logger.info("User list requested", 
               requester_id=current_user.id, 
               page=page, 
               size=size, 
               search=search)
    
    try:
        # Build query with filters
        query = select(User)
        
        # Apply filters
        filters = []
        if is_active is not None:
            filters.append(User.is_active == is_active)
        
        if search:
            search_term = f"%{search}%"
            filters.append(
                or_(
                    User.first_name.ilike(search_term),
                    User.last_name.ilike(search_term),
                    User.email.ilike(search_term),
                    User.username.ilike(search_term)
                )
            )
        
        if filters:
            query = query.where(and_(*filters))
        
        # Apply sorting
        sort_column = getattr(User, sort_by, User.created_at)
        if sort_order == "desc":
            query = query.order_by(sort_column.desc())
        else:
            query = query.order_by(sort_column.asc())
        
        # Get paginated results
        result = await paginate(
            db=db,
            query=query,
            page=page,
            size=size
        )
        
        return UserListResponse(
            items=[UserResponse.from_orm(user) for user in result.items],
            total=result.total,
            page=result.page,
            size=result.size,
            pages=result.pages
        )
        
    except Exception as e:
        logger.error("User list failed", error=str(e), requester_id=current_user.id)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve users"
        )


@router.get("/{user_id}", response_model=UserResponse)
async def get_user_by_id(
    user_id: int,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db),
    auth_service: AuthService = Depends(get_auth_service),
    user_service: UserService = Depends(get_user_service)
):
    """Get user by ID"""
    current_user = await auth_service.get_current_user(db, credentials.credentials)
    
    # Users can view their own profile or admins can view any profile
    if user_id != current_user.id and not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    user = await user_service.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return UserResponse.from_orm(user)


@router.put("/{user_id}", response_model=UserResponse)
async def update_user_by_id(
    user_id: int,
    user_update: UserUpdate,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db),
    auth_service: AuthService = Depends(get_auth_service),
    user_service: UserService = Depends(get_user_service)
):
    """Update user by ID (admin only)"""
    current_user = await auth_service.get_current_user(db, credentials.credentials)
    
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    logger.info("Admin user update", admin_id=current_user.id, target_user_id=user_id)
    
    try:
        updated_user = await user_service.update_user(db, user_id, user_update)
        if not updated_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        logger.info("User updated by admin", admin_id=current_user.id, target_user_id=user_id)
        return UserResponse.from_orm(updated_user)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Admin user update failed", error=str(e), 
                    admin_id=current_user.id, target_user_id=user_id)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update user"
        )


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    user_id: int,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db),
    auth_service: AuthService = Depends(get_auth_service),
    user_service: UserService = Depends(get_user_service)
):
    """Delete user by ID (admin only)"""
    current_user = await auth_service.get_current_user(db, credentials.credentials)
    
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    if user_id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete your own account"
        )
    
    logger.info("Admin user deletion", admin_id=current_user.id, target_user_id=user_id)
    
    try:
        success = await user_service.delete_user(db, user_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        logger.info("User deleted by admin", admin_id=current_user.id, target_user_id=user_id)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Admin user deletion failed", error=str(e),
                    admin_id=current_user.id, target_user_id=user_id)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete user"
        )


@router.post("/{user_id}/deactivate", response_model=UserResponse)
async def deactivate_user(
    user_id: int,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db),
    auth_service: AuthService = Depends(get_auth_service),
    user_service: UserService = Depends(get_user_service)
):
    """Deactivate user account (admin only)"""
    current_user = await auth_service.get_current_user(db, credentials.credentials)
    
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    if user_id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot deactivate your own account"
        )
    
    logger.info("Admin user deactivation", admin_id=current_user.id, target_user_id=user_id)
    
    try:
        deactivated_user = await user_service.deactivate_user(db, user_id)
        if not deactivated_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        logger.info("User deactivated by admin", admin_id=current_user.id, target_user_id=user_id)
        return UserResponse.from_orm(deactivated_user)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Admin user deactivation failed", error=str(e),
                    admin_id=current_user.id, target_user_id=user_id)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to deactivate user"
        )


@router.get("/stats/summary")
async def get_user_stats(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db),
    auth_service: AuthService = Depends(get_auth_service)
):
    """Get user statistics (admin only)"""
    current_user = await auth_service.get_current_user(db, credentials.credentials)
    
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    try:
        # Get various user statistics
        total_users = await db.scalar(select(func.count(User.id)))
        active_users = await db.scalar(
            select(func.count(User.id)).where(User.is_active == True)
        )
        verified_users = await db.scalar(
            select(func.count(User.id)).where(User.is_verified == True)
        )
        
        # Users registered in the last 30 days
        from datetime import datetime, timedelta
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        recent_users = await db.scalar(
            select(func.count(User.id)).where(User.created_at >= thirty_days_ago)
        )
        
        return {
            "total_users": total_users or 0,
            "active_users": active_users or 0,
            "inactive_users": (total_users or 0) - (active_users or 0),
            "verified_users": verified_users or 0,
            "recent_registrations": recent_users or 0,
            "verification_rate": round((verified_users / total_users * 100), 2) if total_users else 0
        }
        
    except Exception as e:
        logger.error("User stats retrieval failed", error=str(e), admin_id=current_user.id)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve user statistics"
        )
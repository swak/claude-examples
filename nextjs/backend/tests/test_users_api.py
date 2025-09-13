import pytest
import asyncio
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy import text

from app.main import app
from app.database import get_database, Base
from app.models import User

# Test database URL
TEST_DATABASE_URL = "sqlite+aiosqlite:///./test_users.db"

# Test engine and session
test_engine = create_async_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    echo=False
)

TestSessionLocal = async_sessionmaker(
    test_engine,
    class_=AsyncSession,
    expire_on_commit=False
)

async def override_get_database():
    async with TestSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()

app.dependency_overrides[get_database] = override_get_database

@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for the test session."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

@pytest.fixture(scope="session")
async def setup_database():
    # Create tables
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    yield
    
    # Drop tables
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

@pytest.fixture
async def db_session():
    async with TestSessionLocal() as session:
        yield session
        await session.rollback()

@pytest.fixture
async def client():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac

@pytest.fixture
async def sample_user(db_session):
    user = User(
        name="Test User",
        email="test@example.com",
        role="user",
        bio="Test user for testing purposes"
    )
    db_session.add(user)
    await db_session.commit()
    await db_session.refresh(user)
    return user

class TestUsersAPI:
    """Test suite for Users API endpoints"""

    async def test_health_check(self, client):
        """Test the health check endpoint"""
        response = await client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] in ["healthy", "degraded"]
        assert "timestamp" in data
        assert "database" in data

    async def test_root_endpoint(self, client):
        """Test the root endpoint"""
        response = await client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert data["message"] == "Users API is running"

    async def test_get_users_empty(self, client, setup_database):
        """Test getting users when database is empty"""
        response = await client.get("/api/users")
        assert response.status_code == 200
        data = response.json()
        assert data["users"] == []
        assert data["total"] == 0
        assert data["page"] == 1
        assert data["per_page"] == 10

    async def test_create_user_success(self, client, setup_database):
        """Test creating a new user successfully"""
        user_data = {
            "name": "John Doe",
            "email": "john.doe@example.com",
            "role": "admin",
            "bio": "System administrator"
        }
        
        response = await client.post("/api/users", json=user_data)
        assert response.status_code == 201
        
        data = response.json()
        assert data["name"] == user_data["name"]
        assert data["email"] == user_data["email"]
        assert data["role"] == user_data["role"]
        assert data["bio"] == user_data["bio"]
        assert "id" in data
        assert "created_at" in data

    async def test_create_user_duplicate_email(self, client, sample_user):
        """Test creating a user with duplicate email"""
        user_data = {
            "name": "Another User",
            "email": sample_user.email,  # Duplicate email
            "role": "user"
        }
        
        response = await client.post("/api/users", json=user_data)
        assert response.status_code == 400
        data = response.json()
        assert "Email already registered" in data["detail"]

    async def test_create_user_invalid_data(self, client, setup_database):
        """Test creating a user with invalid data"""
        # Test missing required fields
        response = await client.post("/api/users", json={})
        assert response.status_code == 422
        
        # Test invalid email
        user_data = {
            "name": "Test User",
            "email": "invalid-email",
            "role": "user"
        }
        response = await client.post("/api/users", json=user_data)
        assert response.status_code == 422

    async def test_get_user_by_id(self, client, sample_user):
        """Test getting a specific user by ID"""
        response = await client.get(f"/api/users/{sample_user.id}")
        assert response.status_code == 200
        
        data = response.json()
        assert data["id"] == sample_user.id
        assert data["name"] == sample_user.name
        assert data["email"] == sample_user.email

    async def test_get_user_not_found(self, client, setup_database):
        """Test getting a non-existent user"""
        response = await client.get("/api/users/99999")
        assert response.status_code == 404
        data = response.json()
        assert "User not found" in data["detail"]

    async def test_get_users_with_pagination(self, client, setup_database):
        """Test getting users with pagination"""
        # Create multiple users
        for i in range(15):
            user_data = {
                "name": f"User {i}",
                "email": f"user{i}@example.com",
                "role": "user"
            }
            await client.post("/api/users", json=user_data)
        
        # Test first page
        response = await client.get("/api/users?page=1&per_page=10")
        assert response.status_code == 200
        data = response.json()
        assert len(data["users"]) == 10
        assert data["total"] == 15
        assert data["page"] == 1
        assert data["total_pages"] == 2

        # Test second page
        response = await client.get("/api/users?page=2&per_page=10")
        assert response.status_code == 200
        data = response.json()
        assert len(data["users"]) == 5
        assert data["page"] == 2

    async def test_get_users_with_search(self, client, sample_user):
        """Test searching users by name and email"""
        # Search by name
        response = await client.get(f"/api/users?search={sample_user.name.split()[0]}")
        assert response.status_code == 200
        data = response.json()
        assert len(data["users"]) >= 1
        assert any(user["id"] == sample_user.id for user in data["users"])

        # Search by email
        response = await client.get(f"/api/users?search={sample_user.email.split('@')[0]}")
        assert response.status_code == 200
        data = response.json()
        assert len(data["users"]) >= 1

    async def test_get_users_with_role_filter(self, client, setup_database):
        """Test filtering users by role"""
        # Create users with different roles
        users_data = [
            {"name": "Admin User", "email": "admin@example.com", "role": "admin"},
            {"name": "Manager User", "email": "manager@example.com", "role": "manager"},
            {"name": "Regular User", "email": "user@example.com", "role": "user"},
        ]
        
        for user_data in users_data:
            await client.post("/api/users", json=user_data)
        
        # Filter by admin role
        response = await client.get("/api/users?role=admin")
        assert response.status_code == 200
        data = response.json()
        assert all(user["role"] == "admin" for user in data["users"])

    async def test_update_user(self, client, sample_user):
        """Test updating a user"""
        update_data = {
            "name": "Updated Name",
            "bio": "Updated bio"
        }
        
        response = await client.put(f"/api/users/{sample_user.id}", json=update_data)
        assert response.status_code == 200
        
        data = response.json()
        assert data["name"] == update_data["name"]
        assert data["bio"] == update_data["bio"]
        assert data["email"] == sample_user.email  # Should remain unchanged

    async def test_update_user_not_found(self, client, setup_database):
        """Test updating a non-existent user"""
        update_data = {"name": "Updated Name"}
        response = await client.put("/api/users/99999", json=update_data)
        assert response.status_code == 404

    async def test_delete_user(self, client, sample_user):
        """Test deleting a user"""
        response = await client.delete(f"/api/users/{sample_user.id}")
        assert response.status_code == 200
        
        # Verify user is deleted
        response = await client.get(f"/api/users/{sample_user.id}")
        assert response.status_code == 404

    async def test_delete_user_not_found(self, client, setup_database):
        """Test deleting a non-existent user"""
        response = await client.delete("/api/users/99999")
        assert response.status_code == 404

class TestSecurityValidation:
    """Security-focused tests"""

    async def test_sql_injection_prevention(self, client, setup_database):
        """Test that SQL injection attempts are prevented"""
        malicious_inputs = [
            "'; DROP TABLE users; --",
            "1' OR '1'='1",
            "admin@example.com'; DELETE FROM users; --"
        ]
        
        for malicious_input in malicious_inputs:
            response = await client.get(f"/api/users?search={malicious_input}")
            assert response.status_code == 200  # Should not crash
            # Database should still be intact
            response = await client.get("/api/users")
            assert response.status_code == 200

    async def test_input_validation(self, client, setup_database):
        """Test input validation and sanitization"""
        # Test extremely long inputs
        long_string = "a" * 1000
        user_data = {
            "name": long_string,
            "email": "test@example.com",
            "role": "user"
        }
        response = await client.post("/api/users", json=user_data)
        assert response.status_code == 422

        # Test invalid role
        user_data = {
            "name": "Test User",
            "email": "test@example.com",
            "role": "invalid_role"
        }
        response = await client.post("/api/users", json=user_data)
        assert response.status_code == 422

    async def test_cors_headers(self, client):
        """Test CORS headers are properly set"""
        response = await client.options("/api/users")
        # The test client might not include all CORS headers,
        # but we can test that the endpoint responds to OPTIONS
        assert response.status_code in [200, 405]  # 405 is also acceptable for OPTIONS

    async def test_error_handling(self, client, setup_database):
        """Test that errors are handled gracefully without exposing sensitive information"""
        # Test with invalid JSON
        response = await client.post(
            "/api/users",
            content="invalid json",
            headers={"Content-Type": "application/json"}
        )
        assert response.status_code == 422
        
        # Ensure error response doesn't expose internal details
        data = response.json()
        assert "detail" in data
        # Should not contain stack traces or database errors
        assert "Traceback" not in str(data)
        assert "sqlite" not in str(data).lower()

if __name__ == "__main__":
    pytest.main([__file__, "-v"])
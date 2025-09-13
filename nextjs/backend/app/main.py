from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import logging
import asyncio
from datetime import datetime

from .database import create_tables, AsyncSessionLocal
from .models import User
from .routers.users import router as users_router
from .schemas import HealthCheck

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def seed_database():
    """Seed the database with sample data"""
    async with AsyncSessionLocal() as session:
        try:
            # Check if users already exist
            from sqlalchemy import select
            result = await session.execute(select(User))
            existing_users = result.scalars().all()
            
            if not existing_users:
                logger.info("Seeding database with sample users...")
                
                sample_users = [
                    User(
                        name="John Doe",
                        email="john.doe@example.com",
                        role="admin",
                        bio="System administrator with 10+ years of experience."
                    ),
                    User(
                        name="Jane Smith",
                        email="jane.smith@example.com",
                        role="manager",
                        bio="Project manager specializing in agile methodologies."
                    ),
                    User(
                        name="Mike Johnson",
                        email="mike.johnson@example.com",
                        role="user",
                        bio="Frontend developer passionate about React and UX design."
                    ),
                    User(
                        name="Sarah Wilson",
                        email="sarah.wilson@example.com",
                        role="user",
                        bio="Data scientist working on machine learning projects."
                    ),
                    User(
                        name="David Brown",
                        email="david.brown@example.com",
                        role="manager",
                        bio="DevOps engineer focusing on cloud infrastructure."
                    ),
                    User(
                        name="Emily Davis",
                        email="emily.davis@example.com",
                        role="user",
                        bio="Backend developer with expertise in Python and APIs."
                    ),
                    User(
                        name="Alex Turner",
                        email="alex.turner@example.com",
                        role="user",
                        bio="Mobile app developer creating cross-platform solutions."
                    ),
                    User(
                        name="Lisa Garcia",
                        email="lisa.garcia@example.com",
                        role="admin",
                        bio="Security specialist ensuring application safety."
                    )
                ]
                
                for user in sample_users:
                    session.add(user)
                
                await session.commit()
                logger.info(f"Seeded database with {len(sample_users)} users")
            else:
                logger.info(f"Database already contains {len(existing_users)} users")
                
        except Exception as e:
            logger.error(f"Error seeding database: {str(e)}")
            await session.rollback()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting up FastAPI application...")
    await create_tables()
    await seed_database()
    logger.info("Database setup complete")
    yield
    # Shutdown
    logger.info("Shutting down FastAPI application...")

app = FastAPI(
    title="Users API",
    description="A demonstration API for managing users with SQLite backend",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(users_router)

@app.get("/", tags=["root"])
async def root():
    return {
        "message": "Users API is running",
        "docs": "/docs",
        "health": "/health"
    }

@app.get("/health", response_model=HealthCheck, tags=["health"])
async def health_check():
    try:
        # Test database connection
        async with AsyncSessionLocal() as session:
            from sqlalchemy import text
            await session.execute(text("SELECT 1"))
            database_status = "healthy"
    except Exception as e:
        logger.error(f"Database health check failed: {str(e)}")
        database_status = "unhealthy"
        
    return HealthCheck(
        status="healthy" if database_status == "healthy" else "degraded",
        timestamp=datetime.now(),
        database=database_status
    )

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(f"Global exception handler: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
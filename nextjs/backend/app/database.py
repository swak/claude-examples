from sqlalchemy import create_engine, pool
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
import os
import logging

logger = logging.getLogger(__name__)

# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./users.db")
DATABASE_ECHO = os.getenv("DATABASE_ECHO", "false").lower() == "true"

# Enhanced engine configuration with connection pooling
engine = create_async_engine(
    DATABASE_URL,
    connect_args={
        "check_same_thread": False,
        "timeout": 20,  # Connection timeout
    },
    echo=DATABASE_ECHO,
    pool_size=5,
    max_overflow=10,
    pool_timeout=30,
    pool_recycle=3600,  # Recycle connections after 1 hour
    pool_pre_ping=True,  # Validate connections before use
)

AsyncSessionLocal = async_sessionmaker(
    engine, 
    class_=AsyncSession, 
    expire_on_commit=False
)

Base = declarative_base()

async def get_database():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()

async def create_tables():
    """Create database tables with proper error handling"""
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        logger.info("Database tables created successfully")
    except Exception as e:
        logger.error(f"Failed to create database tables: {str(e)}")
        raise

async def health_check_database():
    """Check database connectivity and health"""
    try:
        async with AsyncSessionLocal() as session:
            from sqlalchemy import text
            result = await session.execute(text("SELECT 1"))
            result.scalar()
        return True
    except Exception as e:
        logger.error(f"Database health check failed: {str(e)}")
        return False

async def close_database():
    """Properly close database connections"""
    try:
        await engine.dispose()
        logger.info("Database connections closed")
    except Exception as e:
        logger.error(f"Error closing database connections: {str(e)}")
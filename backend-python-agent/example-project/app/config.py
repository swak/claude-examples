"""
Application configuration using Pydantic Settings
"""
from typing import List, Optional
from pydantic import Field, validator
from pydantic_settings import BaseSettings
import os


class Settings(BaseSettings):
    """Application settings with environment variable support"""
    
    # Application
    app_name: str = "Backend API"
    environment: str = Field(default="development", description="Environment: development, staging, production")
    debug: bool = Field(default=False, description="Enable debug mode")
    
    # Server
    host: str = Field(default="0.0.0.0", description="Server host")
    port: int = Field(default=8000, description="Server port")
    allowed_hosts: List[str] = Field(default=["localhost", "127.0.0.1"], description="Allowed hosts")
    cors_origins: List[str] = Field(default=["*"], description="CORS allowed origins")
    
    # Database
    database_url: str = Field(
        default="mysql+aiomysql://user:password@localhost/dbname",
        description="Database connection URL"
    )
    database_pool_size: int = Field(default=20, description="Database connection pool size")
    database_max_overflow: int = Field(default=0, description="Database max overflow connections")
    database_pool_timeout: int = Field(default=30, description="Database pool timeout seconds")
    database_pool_recycle: int = Field(default=3600, description="Database pool recycle seconds")
    
    # Redis
    redis_url: str = Field(default="redis://localhost:6379/0", description="Redis connection URL")
    redis_cache_ttl: int = Field(default=3600, description="Default cache TTL in seconds")
    
    # Security
    secret_key: str = Field(description="Secret key for JWT tokens")
    access_token_expire_minutes: int = Field(default=30, description="Access token expiry minutes")
    refresh_token_expire_days: int = Field(default=7, description="Refresh token expiry days")
    bcrypt_rounds: int = Field(default=12, description="BCrypt hashing rounds")
    
    # AWS
    aws_region: str = Field(default="us-east-1", description="AWS region")
    aws_access_key_id: Optional[str] = Field(default=None, description="AWS access key ID")
    aws_secret_access_key: Optional[str] = Field(default=None, description="AWS secret access key")
    s3_bucket: Optional[str] = Field(default=None, description="S3 bucket name")
    
    # Celery
    celery_broker_url: str = Field(default="redis://localhost:6379/1", description="Celery broker URL")
    celery_result_backend: str = Field(default="redis://localhost:6379/1", description="Celery result backend")
    
    # Logging
    log_level: str = Field(default="INFO", description="Log level")
    log_format: str = Field(default="json", description="Log format: json or text")
    
    # Rate Limiting
    rate_limit_requests: int = Field(default=100, description="Rate limit requests per minute")
    rate_limit_window: int = Field(default=60, description="Rate limit window in seconds")
    
    # Pagination
    default_page_size: int = Field(default=20, description="Default pagination page size")
    max_page_size: int = Field(default=100, description="Maximum pagination page size")
    
    # File Upload
    max_file_size: int = Field(default=10 * 1024 * 1024, description="Max file size in bytes (10MB)")
    allowed_file_types: List[str] = Field(
        default=["jpg", "jpeg", "png", "gif", "pdf", "doc", "docx"],
        description="Allowed file extensions"
    )
    
    @validator('environment')
    def validate_environment(cls, v):
        if v not in ['development', 'staging', 'production']:
            raise ValueError('Environment must be development, staging, or production')
        return v
    
    @validator('secret_key')
    def validate_secret_key(cls, v):
        if not v or len(v) < 32:
            raise ValueError('Secret key must be at least 32 characters long')
        return v
    
    @validator('log_level')
    def validate_log_level(cls, v):
        valid_levels = ['DEBUG', 'INFO', 'WARNING', 'ERROR', 'CRITICAL']
        if v.upper() not in valid_levels:
            raise ValueError(f'Log level must be one of {valid_levels}')
        return v.upper()
    
    @property
    def is_development(self) -> bool:
        return self.environment == "development"
    
    @property
    def is_production(self) -> bool:
        return self.environment == "production"
    
    @property
    def database_url_sync(self) -> str:
        """Get synchronous database URL for Alembic migrations"""
        return self.database_url.replace("+aiomysql", "+pymysql")
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False


# Create global settings instance
settings = Settings()


# Environment-specific configuration
if settings.is_production:
    # Production-specific settings
    settings.debug = False
    settings.cors_origins = []  # Restrict CORS in production
    settings.allowed_hosts = []  # Set specific allowed hosts
elif settings.environment == "staging":
    # Staging-specific settings
    settings.debug = False
else:
    # Development settings
    settings.debug = True


def get_settings() -> Settings:
    """Dependency injection for settings"""
    return settings
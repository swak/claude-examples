from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: str = Field(..., min_length=1, max_length=100)
    role: str = Field(default="user", pattern="^(admin|user|manager)$")
    bio: Optional[str] = Field(None, max_length=500)

class UserCreate(UserBase):
    pass

class UserUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    email: Optional[str] = Field(None, min_length=1, max_length=100)
    role: Optional[str] = Field(None, pattern="^(admin|user|manager)$")
    bio: Optional[str] = Field(None, max_length=500)

class UserResponse(UserBase):
    id: int
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True

class UserListResponse(BaseModel):
    users: List[UserResponse]
    total: int
    page: int
    per_page: int
    total_pages: int

class ErrorResponse(BaseModel):
    detail: str
    error_code: Optional[str] = None

class HealthCheck(BaseModel):
    status: str
    timestamp: datetime
    database: str
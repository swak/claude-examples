# Backend Python Developer Agent

A specialized Claude Code agent configuration optimized for backend development with Python, MySQL, and AWS integration. This agent is designed to help build production-ready, scalable backend systems.

## 🎯 Agent Capabilities

### Core Technologies
- **Python 3.9+** with modern async/await patterns
- **FastAPI & Flask** for REST API development
- **SQLAlchemy ORM** and raw SQL optimization
- **MySQL** database design and administration
- **Docker** containerization and orchestration
- **AWS Services** integration and deployment
- **Redis** for caching and session management
- **Celery** for background task processing

### Specialized Skills

#### Database Expertise
- MySQL schema design and normalization
- Complex query optimization and indexing
- Database migrations and version control
- Connection pooling and performance tuning
- Backup and recovery strategies
- MySQL replication and clustering
- Data modeling for scalable applications

#### AWS Cloud Services
- EC2 instances and auto-scaling groups
- RDS MySQL management and optimization
- Lambda functions for serverless architecture
- API Gateway for REST API management
- S3 for file storage and static assets
- CloudFormation for infrastructure as code
- IAM roles and security policies
- CloudWatch monitoring and logging
- ECS/EKS for container orchestration

#### Python Pipeline Development
- ETL pipeline design and implementation
- Apache Airflow for workflow orchestration
- Pandas for data processing and analysis
- Pydantic for data validation
- Pytest for comprehensive testing
- CI/CD pipeline setup with GitHub Actions
- Error handling and logging strategies

## 🚀 Quick Start

### Using This Agent Configuration

1. **Load the Configuration**
   ```bash
   # Reference the AGENT_CONFIG.md file when working with Claude Code
   # The agent will automatically adopt the specialized backend development context
   ```

2. **Project Structure Recommendations**
   ```
   backend-project/
   ├── app/
   │   ├── __init__.py
   │   ├── main.py              # FastAPI application
   │   ├── models/              # SQLAlchemy models
   │   ├── routers/             # API route definitions
   │   ├── services/            # Business logic layer
   │   ├── database.py          # Database configuration
   │   └── config.py            # Application settings
   ├── migrations/              # Alembic migrations
   ├── tests/                   # Test files
   ├── docker/                  # Docker configurations
   ├── aws/                     # CloudFormation templates
   ├── requirements.txt         # Python dependencies
   └── pyproject.toml          # Project configuration
   ```

3. **Environment Setup**
   ```bash
   # Create virtual environment
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   # or
   venv\Scripts\activate     # Windows
   
   # Install dependencies
   pip install -r requirements.txt
   
   # Set up pre-commit hooks
   pre-commit install
   ```

## 💡 Example Use Cases

### 1. API Development
The agent can help you build REST APIs with FastAPI, including:
- Automatic OpenAPI documentation
- Request/response validation with Pydantic
- Authentication and authorization
- Error handling and logging
- Database integration with SQLAlchemy

### 2. Database Design & Optimization
- Design normalized database schemas
- Create efficient indexes and optimize queries
- Set up database migrations with Alembic
- Implement connection pooling strategies
- Monitor and tune database performance

### 3. AWS Infrastructure
- Set up EC2 instances with auto-scaling
- Configure RDS MySQL with proper parameters
- Create Lambda functions for serverless processing
- Set up CloudFormation templates for infrastructure as code
- Implement monitoring and alerting with CloudWatch

### 4. Data Pipelines
- Design ETL processes for data transformation
- Set up Apache Airflow for workflow orchestration
- Create data validation and quality checks
- Implement error handling and retry mechanisms
- Monitor pipeline performance and data quality

## 🛠️ Development Patterns

### FastAPI Application Structure
```python
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession

app = FastAPI(title="Backend API", version="1.0.0")

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency injection for database
async def get_db() -> AsyncSession:
    async with SessionLocal() as session:
        yield session

# Route with dependency injection
@app.post("/users/", response_model=UserResponse)
async def create_user(
    user: UserCreate,
    db: AsyncSession = Depends(get_db)
):
    return await create_user_service(db, user)
```

### Database Model Design
```python
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    orders = relationship("Order", back_populates="user")
```

### AWS Lambda Integration
```python
import json
import boto3
from typing import Dict, Any

def lambda_handler(event: Dict[str, Any], context) -> Dict[str, Any]:
    """
    AWS Lambda function for processing events
    """
    try:
        # Process the event
        result = process_event(event)
        
        return {
            'statusCode': 200,
            'body': json.dumps(result),
            'headers': {
                'Content-Type': 'application/json'
            }
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
```

## 🧪 Testing Strategy

### Test Structure
```python
import pytest
import asyncio
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

@pytest.fixture
async def async_client():
    async with AsyncClient(app=app, base_url="http://test") as client:
        yield client

@pytest.fixture
async def db_session():
    # Create test database session
    async with test_session() as session:
        yield session

@pytest.mark.asyncio
async def test_create_user(async_client: AsyncClient, db_session: AsyncSession):
    user_data = {"email": "test@example.com", "name": "Test User"}
    response = await async_client.post("/users/", json=user_data)
    
    assert response.status_code == 201
    assert response.json()["email"] == user_data["email"]
```

## 📊 Monitoring & Observability

### Logging Configuration
```python
import logging
import structlog

# Configure structured logging
structlog.configure(
    processors=[
        structlog.dev.set_exc_info,
        structlog.processors.JSONRenderer()
    ],
    wrapper_class=structlog.make_filtering_bound_logger(logging.INFO),
    logger_factory=structlog.stdlib.LoggerFactory(),
)

logger = structlog.get_logger()

# Usage in application
logger.info("User created", user_id=user.id, email=user.email)
```

### Performance Monitoring
```python
import time
from functools import wraps

def monitor_performance(func):
    @wraps(func)
    async def wrapper(*args, **kwargs):
        start_time = time.time()
        try:
            result = await func(*args, **kwargs)
            duration = time.time() - start_time
            logger.info("Function executed", 
                       function=func.__name__, 
                       duration=duration)
            return result
        except Exception as e:
            logger.error("Function failed", 
                        function=func.__name__, 
                        error=str(e))
            raise
    return wrapper
```

## 🔒 Security Best Practices

### Authentication & Authorization
```python
from passlib.context import CryptContext
from jose import JWTError, jwt

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    return username
```

## 🚀 Deployment

### Docker Configuration
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### CloudFormation Template
```yaml
AWSTemplateFormatVersion: '2010-09-09'
Description: 'Backend API Infrastructure'

Resources:
  APIGateway:
    Type: AWS::ApiGateway::RestApi
    Properties:
      Name: BackendAPI
      Description: Backend API Gateway
      
  RDSInstance:
    Type: AWS::RDS::DBInstance
    Properties:
      DBInstanceClass: db.t3.micro
      Engine: mysql
      MasterUsername: !Ref DBUsername
      MasterUserPassword: !Ref DBPassword
      AllocatedStorage: 20
```

## 📚 Additional Resources

### Documentation
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [AWS Documentation](https://docs.aws.amazon.com/)
- [MySQL Documentation](https://dev.mysql.com/doc/)

### Tools & Libraries
- **API Development**: FastAPI, Flask, Pydantic
- **Database**: SQLAlchemy, Alembic, PyMySQL
- **Testing**: pytest, pytest-asyncio, httpx
- **Deployment**: Docker, AWS CDK, Terraform
- **Monitoring**: Prometheus, Grafana, AWS CloudWatch

## 🤝 Usage with Claude Code

When using this agent configuration with Claude Code:

1. **Reference the Configuration**: Point Claude Code to the `AGENT_CONFIG.md` file to activate specialized backend development capabilities
2. **Provide Context**: Share your specific requirements (API endpoints, database schema, AWS services needed)
3. **Iterative Development**: Work with Claude Code to implement features step by step, following the patterns defined in this configuration
4. **Testing & Deployment**: Leverage Claude Code's knowledge of testing strategies and deployment patterns for production-ready solutions

This agent configuration ensures that Claude Code will provide expert-level assistance for building scalable, maintainable backend systems using Python, MySQL, and AWS best practices.
from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
import time
import asyncio
from typing import Dict, List
import logging

logger = logging.getLogger(__name__)

class RateLimiter:
    def __init__(self, max_requests: int = 100, window_seconds: int = 60):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.requests: Dict[str, List[float]] = {}
    
    def is_allowed(self, identifier: str) -> bool:
        now = time.time()
        window_start = now - self.window_seconds
        
        # Get existing requests for this identifier
        if identifier not in self.requests:
            self.requests[identifier] = []
        
        # Remove old requests outside the window
        self.requests[identifier] = [
            req_time for req_time in self.requests[identifier] 
            if req_time > window_start
        ]
        
        # Check if under limit
        if len(self.requests[identifier]) >= self.max_requests:
            return False
        
        # Add current request
        self.requests[identifier].append(now)
        return True

# Global rate limiter instances
api_rate_limiter = RateLimiter(max_requests=100, window_seconds=60)  # 100 requests per minute
strict_rate_limiter = RateLimiter(max_requests=20, window_seconds=60)  # 20 requests per minute for sensitive endpoints

async def rate_limit_middleware(request: Request, call_next):
    """Rate limiting middleware"""
    # Get client IP
    client_ip = request.client.host if request.client else "unknown"
    
    # Use stricter limits for write operations
    if request.method in ["POST", "PUT", "DELETE"]:
        limiter = strict_rate_limiter
        limit_type = "strict"
    else:
        limiter = api_rate_limiter
        limit_type = "standard"
    
    # Check rate limit
    if not limiter.is_allowed(client_ip):
        logger.warning(f"Rate limit exceeded for IP {client_ip} on {limit_type} endpoint")
        return JSONResponse(
            status_code=429,
            content={
                "detail": "Too many requests. Please try again later.",
                "retry_after": limiter.window_seconds
            },
            headers={"Retry-After": str(limiter.window_seconds)}
        )
    
    response = await call_next(request)
    return response

class SecurityHeadersMiddleware:
    """Add security headers to all responses"""
    
    def __init__(self, app):
        self.app = app
    
    async def __call__(self, scope, receive, send):
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return
        
        async def send_with_headers(message):
            if message["type"] == "http.response.start":
                headers = dict(message.get("headers", []))
                
                # Add security headers
                security_headers = {
                    b"x-content-type-options": b"nosniff",
                    b"x-frame-options": b"DENY", 
                    b"x-xss-protection": b"1; mode=block",
                    b"referrer-policy": b"strict-origin-when-cross-origin",
                    b"permissions-policy": b"camera=(), microphone=(), geolocation=()",
                }
                
                for key, value in security_headers.items():
                    headers[key] = value
                
                message["headers"] = list(headers.items())
            
            await send(message)
        
        await self.app(scope, receive, send_with_headers)

async def logging_middleware(request: Request, call_next):
    """Request logging middleware"""
    start_time = time.time()
    client_ip = request.client.host if request.client else "unknown"
    
    # Log request
    logger.info(f"Request: {request.method} {request.url.path} from {client_ip}")
    
    response = await call_next(request)
    
    # Log response
    process_time = time.time() - start_time
    logger.info(
        f"Response: {response.status_code} for {request.method} {request.url.path} "
        f"from {client_ip} in {process_time:.4f}s"
    )
    
    return response
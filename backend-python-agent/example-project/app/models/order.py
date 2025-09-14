"""
Order model with SQLAlchemy
"""
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Numeric, Text, Enum, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from decimal import Decimal
from enum import Enum as PyEnum
from datetime import datetime

from app.database import Base


class OrderStatus(PyEnum):
    """Order status enumeration"""
    PENDING = "pending"
    CONFIRMED = "confirmed"
    PROCESSING = "processing"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"
    REFUNDED = "refunded"


class Order(Base):
    """
    Order model with comprehensive tracking and relationships
    """
    __tablename__ = "orders"
    
    # Primary key
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    
    # Order identification
    order_number = Column(String(50), unique=True, index=True, nullable=False)
    
    # Foreign keys
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    
    # Order details
    status = Column(Enum(OrderStatus), default=OrderStatus.PENDING, nullable=False, index=True)
    total_amount = Column(Numeric(10, 2), nullable=False)
    tax_amount = Column(Numeric(10, 2), default=Decimal('0.00'), nullable=False)
    shipping_amount = Column(Numeric(10, 2), default=Decimal('0.00'), nullable=False)
    discount_amount = Column(Numeric(10, 2), default=Decimal('0.00'), nullable=False)
    
    # Address information
    shipping_address = Column(Text, nullable=True)
    billing_address = Column(Text, nullable=True)
    
    # Payment information
    payment_method = Column(String(50), nullable=True)
    payment_status = Column(String(20), default="pending", nullable=False)
    payment_id = Column(String(100), nullable=True)
    
    # Tracking information
    tracking_number = Column(String(100), nullable=True)
    carrier = Column(String(50), nullable=True)
    
    # Notes and metadata
    notes = Column(Text, nullable=True)
    metadata = Column(Text, nullable=True)  # JSON string for additional data
    
    # Timestamps
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)
    shipped_at = Column(DateTime, nullable=True)
    delivered_at = Column(DateTime, nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="orders")
    
    # Indexes for performance
    __table_args__ = (
        Index('idx_order_user_status', 'user_id', 'status'),
        Index('idx_order_created_at', 'created_at'),
        Index('idx_order_status_updated', 'status', 'updated_at'),
        Index('idx_order_payment_status', 'payment_status'),
    )
    
    @property
    def subtotal(self) -> Decimal:
        """Calculate subtotal (total - tax - shipping + discount)"""
        return self.total_amount - self.tax_amount - self.shipping_amount + self.discount_amount
    
    @property
    def is_paid(self) -> bool:
        """Check if order is paid"""
        return self.payment_status in ["paid", "completed"]
    
    @property
    def is_shipped(self) -> bool:
        """Check if order is shipped"""
        return self.status in [OrderStatus.SHIPPED, OrderStatus.DELIVERED]
    
    @property
    def is_completed(self) -> bool:
        """Check if order is completed"""
        return self.status == OrderStatus.DELIVERED
    
    @property
    def is_cancelled(self) -> bool:
        """Check if order is cancelled"""
        return self.status in [OrderStatus.CANCELLED, OrderStatus.REFUNDED]
    
    def can_be_cancelled(self) -> bool:
        """Check if order can be cancelled"""
        return self.status in [OrderStatus.PENDING, OrderStatus.CONFIRMED]
    
    def can_be_shipped(self) -> bool:
        """Check if order can be shipped"""
        return self.status in [OrderStatus.CONFIRMED, OrderStatus.PROCESSING] and self.is_paid
    
    def update_status(self, new_status: OrderStatus) -> None:
        """Update order status with timestamp tracking"""
        old_status = self.status
        self.status = new_status
        
        # Update relevant timestamps
        now = datetime.utcnow()
        if new_status == OrderStatus.SHIPPED and not self.shipped_at:
            self.shipped_at = now
        elif new_status == OrderStatus.DELIVERED and not self.delivered_at:
            self.delivered_at = now
    
    def __repr__(self) -> str:
        return f"<Order(id={self.id}, number='{self.order_number}', status='{self.status.value}', total={self.total_amount})>"
    
    def to_dict(self) -> dict:
        """Convert order to dictionary"""
        return {
            "id": self.id,
            "order_number": self.order_number,
            "user_id": self.user_id,
            "status": self.status.value,
            "total_amount": float(self.total_amount),
            "tax_amount": float(self.tax_amount),
            "shipping_amount": float(self.shipping_amount),
            "discount_amount": float(self.discount_amount),
            "subtotal": float(self.subtotal),
            "shipping_address": self.shipping_address,
            "billing_address": self.billing_address,
            "payment_method": self.payment_method,
            "payment_status": self.payment_status,
            "payment_id": self.payment_id,
            "tracking_number": self.tracking_number,
            "carrier": self.carrier,
            "notes": self.notes,
            "is_paid": self.is_paid,
            "is_shipped": self.is_shipped,
            "is_completed": self.is_completed,
            "is_cancelled": self.is_cancelled,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "shipped_at": self.shipped_at.isoformat() if self.shipped_at else None,
            "delivered_at": self.delivered_at.isoformat() if self.delivered_at else None,
        }
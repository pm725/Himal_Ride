from sqlalchemy import Column, String, Float, Integer, DateTime, ForeignKey, JSON, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from .base import BaseModel
import uuid


class Order(BaseModel):
    __tablename__ = "orders"
    
    order_number = Column(String(50), unique=True, nullable=False, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    
    # Order details
    status = Column(String(50), default="pending")
    subtotal = Column(Float, nullable=False)
    delivery_fee = Column(Float, nullable=False)
    total_amount = Column(Float, nullable=False)
    payment_method = Column(String(50), nullable=False)
    payment_status = Column(String(50), default="pending")
    
    # Delivery details
    delivery_region_id = Column(UUID(as_uuid=True), ForeignKey("delivery_regions.id"))
    delivery_address = Column(JSON, nullable=False)
    estimated_delivery_date = Column(DateTime(timezone=True))
    
    # Configuration snapshot
    configuration_snapshot = Column(JSON, nullable=False)
    
    # Relationships
    user = relationship("User")
    delivery_region = relationship("DeliveryRegion")
    
    def __repr__(self):
        return f"<Order {self.order_number}>"
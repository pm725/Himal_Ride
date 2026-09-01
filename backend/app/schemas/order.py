from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from uuid import UUID
from datetime import datetime


class DeliveryAddress(BaseModel):
    full_name: str
    phone: str
    street: str
    city: str
    district: str
    notes: Optional[str] = None


class OrderCreate(BaseModel):
    delivery_region_id: UUID
    delivery_address: DeliveryAddress
    payment_method: str  # esewa, khalti, fonepay, cod
    configuration_snapshot: Dict[str, Any]
    subtotal: float
    delivery_fee: float
    total_amount: float


class OrderResponse(BaseModel):
    id: UUID
    order_number: str
    status: str
    subtotal: float
    delivery_fee: float
    total_amount: float
    payment_method: str
    payment_status: str
    delivery_address: Dict[str, Any]
    estimated_delivery_date: Optional[datetime]
    created_at: datetime
    
    class Config:
        from_attributes = True


class OrderListResponse(BaseModel):
    orders: List[OrderResponse]
    total: int
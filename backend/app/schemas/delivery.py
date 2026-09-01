from pydantic import BaseModel
from typing import Optional
from uuid import UUID


class DeliveryRegionResponse(BaseModel):
    id: UUID
    name: str
    region_type: str
    base_fee: float
    estimated_days: int
    districts: str
    is_active: bool
    
    class Config:
        from_attributes = True
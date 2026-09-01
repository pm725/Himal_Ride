from pydantic import BaseModel
from typing import Optional, Dict, Any
from uuid import UUID
from datetime import datetime


class ConfigurationCreate(BaseModel):
    name: str
    description: Optional[str] = None
    components: Dict[str, Any]
    total_price: float
    total_weight: float
    estimated_range: Optional[float] = None
    terrain_profile_id: Optional[UUID] = None


class ConfigurationUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None


class ConfigurationResponse(BaseModel):
    id: UUID
    name: str
    description: Optional[str]
    components: Dict[str, Any]
    total_price: float
    total_weight: float
    estimated_range: Optional[float]
    terrain_profile_id: Optional[UUID]
    is_saved: bool
    is_in_cart: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
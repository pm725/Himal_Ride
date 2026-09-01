from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from uuid import UUID


class ConfigurationItem(BaseModel):
    component_id: UUID
    quantity: int = 1


class ConfigurationCreate(BaseModel):
    component_ids: List[UUID] = Field(..., min_length=1)
    terrain_profile_id: Optional[UUID] = None


class ConfigurationValidationResponse(BaseModel):
    total_price: float
    total_weight: float
    estimated_range: float
    compatibility_score: int
    warnings: List[str]
    terrain_compatibility: Optional[Dict[str, float]] = None
    is_valid: bool
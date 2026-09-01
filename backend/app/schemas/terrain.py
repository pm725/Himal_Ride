from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime

class TerrainProfileBase(BaseModel):
    name: str
    description: str
    terrain_type: str
    difficulty: int
    average_grade: float
    surface_roughness: float
    elevation_gain: float
    terrain_factor: float
    elevation_factor: float
    icon: Optional[str] = None
    color: Optional[str] = None

class TerrainProfileResponse(TerrainProfileBase):
    id: UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
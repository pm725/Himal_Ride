from sqlalchemy import Column, String, Float, Integer, Text
from .base import BaseModel


class TerrainProfile(BaseModel):
    __tablename__ = "terrain_profiles"
    
    name = Column(String(100), unique=True, nullable=False, index=True)
    description = Column(Text)
    terrain_type = Column(String(50))  # urban, trail, offroad
    difficulty = Column(Integer, default=1)  # 1-5
    average_grade = Column(Float, default=0.0)  # percentage
    surface_roughness = Column(Float, default=0.0)  # 0-10
    elevation_gain = Column(Float, default=0.0)  # meters
    terrain_factor = Column(Float, default=1.0)  # Range calculation multiplier
    elevation_factor = Column(Float, default=1.0)  # Elevation impact
    icon = Column(String(50))  # emoji or icon name
    color = Column(String(20))  # UI color
    
    def __repr__(self):
        return f"<TerrainProfile {self.name}>"
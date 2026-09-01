from sqlalchemy import Column, String, Float, Boolean, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from .base import BaseModel


class Configuration(BaseModel):
    __tablename__ = "configurations"
    
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    name = Column(String(100), nullable=False)
    description = Column(String(500))
    is_saved = Column(Boolean, default=True)
    is_in_cart = Column(Boolean, default=False)
    
    # Snapshot of the configuration
    components = Column(JSON, nullable=False)  # {frame: {...}, motor: {...}, ...}
    total_price = Column(Float, nullable=False)
    total_weight = Column(Float, nullable=False)
    estimated_range = Column(Float, nullable=True)
    terrain_profile_id = Column(UUID(as_uuid=True), ForeignKey("terrain_profiles.id"), nullable=True)
    
    # Relationships
    user = relationship("User")
    terrain_profile = relationship("TerrainProfile")
    
    def __repr__(self):
        return f"<Configuration {self.name}>"
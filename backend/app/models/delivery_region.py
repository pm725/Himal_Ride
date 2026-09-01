from sqlalchemy import Column, String, Float, Boolean
from .base import BaseModel


class DeliveryRegion(BaseModel):
    __tablename__ = "delivery_regions"
    
    name = Column(String(100), unique=True, nullable=False, index=True)
    region_type = Column(String(50))  # metro, city, district
    base_fee = Column(Float, nullable=False)
    estimated_days = Column(Integer, nullable=False)
    is_active = Column(Boolean, default=True)
    districts = Column(String(500))  # Comma-separated list of districts
    
    def __repr__(self):
        return f"<DeliveryRegion {self.name}>"
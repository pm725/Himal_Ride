from sqlalchemy import Column, String, Float, Boolean, JSON, Integer
from sqlalchemy.dialects.postgresql import UUID
from .base import BaseModel


class Component(BaseModel):
    __tablename__ = "components"
    
    sku = Column(String(50), unique=True, nullable=False, index=True)
    category = Column(String(50), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    description = Column(String(1000))
    base_price = Column(Float, nullable=False)
    weight_kg = Column(Float, nullable=False)
    image_url = Column(String(500))
    inventory_count = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    specs = Column(JSON, default={})  # {wattage: 750, material: "Carbon", etc.}
    
    def __repr__(self):
        return f"<Component {self.name}>"
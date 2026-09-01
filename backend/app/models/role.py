from sqlalchemy import Column, String, Boolean
from sqlalchemy.orm import relationship
from .base import BaseModel


class Role(BaseModel):
    __tablename__ = "roles"
    
    name = Column(String(50), unique=True, nullable=False, index=True)
    description = Column(String(255))
    is_active = Column(Boolean, default=True)
    
    # Relationships - Add this back
    users = relationship("User", back_populates="role")
    
    def __repr__(self):
        return f"<Role {self.name}>"
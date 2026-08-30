from sqlalchemy import Column, String, DateTime, ForeignKey, Text, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from .base import BaseModel
import uuid


class AuditLog(BaseModel):
    __tablename__ = "audit_logs"
    
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    action = Column(String(100), nullable=False)
    resource = Column(String(100), nullable=False)
    resource_id = Column(String(100))
    details = Column(JSON, nullable=True)
    ip_address = Column(String(45))
    user_agent = Column(String(255))
    
    # Relationships
    user = relationship("User", back_populates="audit_logs")
    
    def __repr__(self):
        return f"<AuditLog {self.action} on {self.resource}>"
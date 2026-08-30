from datetime import datetime, timezone
from sqlalchemy import Column, DateTime, String, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declared_attr
from ..core.database import Base
import uuid


class TimestampMixin:
    """Mixin for created_at and updated_at timestamps"""
    
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )


class UUIDMixin:
    """Mixin for UUID primary key"""
    
    @declared_attr
    def id(cls):
        return Column(
            UUID(as_uuid=True),
            primary_key=True,
            default=uuid.uuid4,
            index=True,
        )


class BaseModel(Base, TimestampMixin, UUIDMixin):
    """Abstract base model with UUID id and timestamps"""
    
    __abstract__ = True
    
    @declared_attr
    def __tablename__(cls):
        return cls.__name__.lower()
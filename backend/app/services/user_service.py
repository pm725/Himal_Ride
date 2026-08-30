from typing import Optional
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from ..models.user import User


class UserService:
    """Service layer for user operations"""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def get_by_id(self, user_id: UUID) -> Optional[User]:
        """Get user by ID with role loaded"""
        stmt = select(User).where(
            User.id == user_id,
            User.is_active == True,
        ).options(selectinload(User.role))
        
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()
    
    async def get_by_email(self, email: str) -> Optional[User]:
        """Get user by email with role loaded"""
        stmt = select(User).where(
            User.email == email,
        ).options(selectinload(User.role))
        
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()
    
    async def create(self, **kwargs) -> User:
        """Create a new user"""
        user = User(**kwargs)
        self.db.add(user)
        await self.db.commit()
        await self.db.refresh(user)
        return user
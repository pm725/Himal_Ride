from typing import Optional
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from ..models.user import User


class UserService:
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def get_by_id(self, user_id: UUID) -> Optional[User]:
        stmt = select(User).where(
            User.id == user_id,
            User.is_active == True,
        ).options(selectinload(User.role))  # Eager load role
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()
    
    async def get_by_email(self, email: str) -> Optional[User]:
        stmt = select(User).where(
            User.email == email,
        ).options(selectinload(User.role))  # Eager load role
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()
    
    async def create(self, **kwargs) -> User:
        user = User(**kwargs)
        self.db.add(user)
        await self.db.commit()
        await self.db.refresh(user)
        return user
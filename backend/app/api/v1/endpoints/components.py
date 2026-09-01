from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional, List
from ....core.database import get_db
from ....models.component import Component
from ....schemas.component import ComponentResponse, ComponentListResponse

router = APIRouter(prefix="/components", tags=["components"])


@router.get("/", response_model=List[ComponentResponse])
async def list_components(
    category: Optional[str] = Query(None, description="Filter by category"),
    in_stock: Optional[bool] = Query(None, description="Filter by stock availability"),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db),
):
    """List all components with optional filters"""
    stmt = select(Component).where(Component.is_active == True)
    
    if category:
        stmt = stmt.where(Component.category == category)
    
    if in_stock:
        stmt = stmt.where(Component.inventory_count > 0)
    
    stmt = stmt.offset(offset).limit(limit)
    result = await db.execute(stmt)
    components = result.scalars().all()
    return components


@router.get("/categories")
async def list_categories(db: AsyncSession = Depends(get_db)):
    """List all component categories"""
    stmt = select(Component.category).distinct().where(Component.is_active == True)
    result = await db.execute(stmt)
    categories = result.scalars().all()
    return {"categories": categories}


@router.get("/{component_id}")
async def get_component(
    component_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Get a single component by ID"""
    stmt = select(Component).where(Component.id == component_id)
    result = await db.execute(stmt)
    component = result.scalar_one_or_none()
    if not component:
        return {"detail": "Component not found"}, 404
    return component
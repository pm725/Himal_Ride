from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from ....core.database import get_db
from ....models.delivery_region import DeliveryRegion
from ....schemas.delivery import DeliveryRegionResponse

router = APIRouter(prefix="/delivery", tags=["delivery"])


@router.get("/regions", response_model=List[DeliveryRegionResponse])
async def get_delivery_regions(
    db: AsyncSession = Depends(get_db),
):
    """Get all active delivery regions"""
    stmt = select(DeliveryRegion).where(DeliveryRegion.is_active == True)
    result = await db.execute(stmt)
    regions = result.scalars().all()
    return regions
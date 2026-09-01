from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from ....core.database import get_db
from ....models.terrain_profile import TerrainProfile
from ....schemas.terrain import TerrainProfileResponse

router = APIRouter(prefix="/terrain-profiles", tags=["terrain"])

@router.get("/", response_model=List[TerrainProfileResponse])
async def get_terrain_profiles(
    db: AsyncSession = Depends(get_db),
):
    """Get all terrain profiles"""
    stmt = select(TerrainProfile)
    result = await db.execute(stmt)
    profiles = result.scalars().all()
    return profiles

@router.get("/{profile_id}")
async def get_terrain_profile(
    profile_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Get a single terrain profile by ID"""
    stmt = select(TerrainProfile).where(TerrainProfile.id == profile_id)
    result = await db.execute(stmt)
    profile = result.scalar_one_or_none()
    if not profile:
        return {"detail": "Terrain profile not found"}, 404
    return profile
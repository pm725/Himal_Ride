from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from ....core.database import get_db
from ....core.dependencies import get_current_user
from ....models.user import User
from ....models.configuration import Configuration
from ....schemas.configuration import ConfigurationCreate, ConfigurationResponse, ConfigurationUpdate

router = APIRouter(prefix="/configurations", tags=["configurations"])


@router.post("/", response_model=ConfigurationResponse, status_code=status.HTTP_201_CREATED)
async def save_configuration(
    config_data: ConfigurationCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Save a bike configuration"""
    config = Configuration(
        user_id=current_user.id,
        name=config_data.name,
        description=config_data.description,
        components=config_data.components,
        total_price=config_data.total_price,
        total_weight=config_data.total_weight,
        estimated_range=config_data.estimated_range,
        terrain_profile_id=config_data.terrain_profile_id,
        is_saved=True,
    )
    db.add(config)
    await db.commit()
    await db.refresh(config)
    return config


@router.get("/", response_model=List[ConfigurationResponse])
async def get_configurations(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get all saved configurations for the current user"""
    stmt = select(Configuration).where(
        Configuration.user_id == current_user.id,
        Configuration.is_saved == True
    ).order_by(Configuration.created_at.desc())
    result = await db.execute(stmt)
    return result.scalars().all()


@router.get("/{config_id}")
async def get_configuration(
    config_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get a specific configuration"""
    stmt = select(Configuration).where(
        Configuration.id == config_id,
        Configuration.user_id == current_user.id
    )
    result = await db.execute(stmt)
    config = result.scalar_one_or_none()
    if not config:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Configuration not found"
        )
    return config


@router.put("/{config_id}")
async def update_configuration(
    config_id: str,
    config_update: ConfigurationUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update a configuration"""
    stmt = select(Configuration).where(
        Configuration.id == config_id,
        Configuration.user_id == current_user.id
    )
    result = await db.execute(stmt)
    config = result.scalar_one_or_none()
    if not config:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Configuration not found"
        )
    
    if config_update.name:
        config.name = config_update.name
    if config_update.description:
        config.description = config_update.description
    
    await db.commit()
    await db.refresh(config)
    return config


@router.delete("/{config_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_configuration(
    config_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete a configuration"""
    stmt = select(Configuration).where(
        Configuration.id == config_id,
        Configuration.user_id == current_user.id
    )
    result = await db.execute(stmt)
    config = result.scalar_one_or_none()
    if not config:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Configuration not found"
        )
    
    await db.delete(config)
    await db.commit()
    return None
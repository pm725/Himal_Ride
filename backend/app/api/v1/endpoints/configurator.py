from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from ....core.database import get_db
from ....models.component import Component
from ....models.terrain_profile import TerrainProfile
from ....schemas.configurator import ConfigurationCreate, ConfigurationValidationResponse
import math

router = APIRouter(prefix="/configurator", tags=["configurator"])


@router.post("/validate", response_model=ConfigurationValidationResponse)
async def validate_configuration(
    config: ConfigurationCreate,
    db: AsyncSession = Depends(get_db),
):
    """Validate a bike configuration"""
    
    # Fetch all components
    stmt = select(Component).where(
        Component.id.in_(config.component_ids),
        Component.is_active == True
    )
    result = await db.execute(stmt)
    components = result.scalars().all()
    
    if len(components) != len(config.component_ids):
        missing = set(config.component_ids) - {c.id for c in components}
        raise HTTPException(
            status_code=400,
            detail=f"Components not found: {missing}"
        )
    
    # Calculate totals
    total_price = sum(c.base_price for c in components)
    total_weight = sum(c.weight_kg for c in components)
    
    # Compatibility warnings
    warnings = []
    
    # Check for invalid combinations
    has_frame = any(c.category == "frame" for c in components)
    has_motor = any(c.category == "motor" for c in components)
    has_battery = any(c.category == "battery" for c in components)
    has_wheels = any(c.category == "wheels" for c in components)
    has_brakes = any(c.category == "brakes" for c in components)
    has_suspension = any(c.category == "suspension" for c in components)
    
    if not has_frame:
        warnings.append("No frame selected")
    if has_motor and not has_battery:
        warnings.append("Motor selected without battery")
    if not has_wheels:
        warnings.append("No wheels selected")
    if not has_brakes:
        warnings.append("No brakes selected")
    
    # Calculate compatibility score
    total_parts = len(components)
    warning_count = len(warnings)
    compatibility_score = max(0, min(100, 100 - (warning_count * 20)))
    
    # Calculate range estimate (simple model)
    estimated_range = 0
    terrain_compatibility = None
    
    if has_battery and has_motor:
        battery = next(c for c in components if c.category == "battery")
        motor = next(c for c in components if c.category == "motor")
        
        battery_capacity = battery.specs.get("capacity", 500)
        motor_wattage = motor.specs.get("wattage", 500)
        
        # Base range: battery_capacity / motor_wattage * efficiency factor
        base_range = (battery_capacity / motor_wattage) * 3.0
        
        # Weight penalty
        weight_penalty = 1 - (total_weight / 30)
        weight_penalty = max(0.5, min(1.0, weight_penalty))
        
        estimated_range = base_range * weight_penalty * 100  # Convert to km
        
        # Terrain compatibility
        if config.terrain_profile_id:
            stmt = select(TerrainProfile).where(
                TerrainProfile.id == config.terrain_profile_id
            )
            result = await db.execute(stmt)
            terrain = result.scalar_one_or_none()
            
            if terrain:
                terrain_compatibility = {
                    "range_on_terrain": estimated_range * terrain.terrain_factor,
                    "terrain_factor": terrain.terrain_factor,
                    "difficulty_rating": terrain.difficulty,
                }
                estimated_range = terrain_compatibility["range_on_terrain"]
    
    return ConfigurationValidationResponse(
        total_price=round(total_price, 2),
        total_weight=round(total_weight, 2),
        estimated_range=round(estimated_range, 2),
        compatibility_score=compatibility_score,
        warnings=warnings,
        terrain_compatibility=terrain_compatibility,
        is_valid=len(warnings) == 0 and len(components) >= 4
    )
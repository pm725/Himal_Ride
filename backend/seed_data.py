import asyncio
from app.core.database import AsyncSessionLocal
from app.models.component import Component
from app.models.terrain_profile import TerrainProfile
from app.models.role import Role
from sqlalchemy import select
import uuid

from backend.app.models.delivery_region import DeliveryRegion

# Component data
COMPONENTS = [
    # Frames
    {
        "sku": "FRM-001",
        "category": "frame",
        "name": "Alpine Carbon",
        "description": "Premium carbon fiber frame, lightweight and durable",
        "base_price": 85000,
        "weight_kg": 2.1,
        "image_url": "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7",
        "inventory_count": 10,
        "specs": {"material": "Carbon", "size": ["S", "M", "L", "XL"]}
    },
    {
        "sku": "FRM-002",
        "category": "frame",
        "name": "Himalayan Alloy",
        "description": "Strong aluminum frame built for Himalayan terrain",
        "base_price": 52000,
        "weight_kg": 2.8,
        "image_url": "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7",
        "inventory_count": 15,
        "specs": {"material": "Aluminum", "size": ["S", "M", "L"]}
    },
    {
        "sku": "FRM-003",
        "category": "frame",
        "name": "Trail Steel",
        "description": "Classic steel frame, reliable and comfortable",
        "base_price": 38000,
        "weight_kg": 3.4,
        "image_url": "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7",
        "inventory_count": 8,
        "specs": {"material": "Steel", "size": ["M", "L", "XL"]}
    },
    
    # Motors
    {
        "sku": "MTR-001",
        "category": "motor",
        "name": "Himal Torque X500",
        "description": "500W mid-drive motor, perfect for trail riding",
        "base_price": 68000,
        "weight_kg": 3.8,
        "image_url": "https://images.unsplash.com/photo-1571068316344-75bc76f77890",
        "inventory_count": 12,
        "specs": {"wattage": 500, "torque": 75, "type": "mid-drive"}
    },
    {
        "sku": "MTR-002",
        "category": "motor",
        "name": "Everest Pro 750",
        "description": "750W high-torque motor for demanding terrain",
        "base_price": 89000,
        "weight_kg": 4.2,
        "image_url": "https://images.unsplash.com/photo-1571068316344-75bc76f77890",
        "inventory_count": 8,
        "specs": {"wattage": 750, "torque": 95, "type": "mid-drive"}
    },
    {
        "sku": "MTR-003",
        "category": "motor",
        "name": "City Commute 350",
        "description": "350W efficient motor for urban riding",
        "base_price": 45000,
        "weight_kg": 3.2,
        "image_url": "https://images.unsplash.com/photo-1571068316344-75bc76f77890",
        "inventory_count": 20,
        "specs": {"wattage": 350, "torque": 50, "type": "hub"}
    },
    
    # Batteries
    {
        "sku": "BAT-001",
        "category": "battery",
        "name": "Range Extender 500Wh",
        "description": "500Wh battery for extended range",
        "base_price": 55000,
        "weight_kg": 2.8,
        "image_url": "https://images.unsplash.com/photo-1620293202515-342b9aa000b0",
        "inventory_count": 10,
        "specs": {"capacity": 500, "voltage": 48, "chemistry": "Lithium-ion"}
    },
    {
        "sku": "BAT-002",
        "category": "battery",
        "name": "Ultra Power 700Wh",
        "description": "700Wh battery for long-distance adventures",
        "base_price": 72000,
        "weight_kg": 3.5,
        "image_url": "https://images.unsplash.com/photo-1620293202515-342b9aa000b0",
        "inventory_count": 6,
        "specs": {"capacity": 700, "voltage": 52, "chemistry": "Lithium-ion"}
    },
    {
        "sku": "BAT-003",
        "category": "battery",
        "name": "Compact 300Wh",
        "description": "300Wh lightweight battery for city commuting",
        "base_price": 35000,
        "weight_kg": 1.8,
        "image_url": "https://images.unsplash.com/photo-1620293202515-342b9aa000b0",
        "inventory_count": 15,
        "specs": {"capacity": 300, "voltage": 36, "chemistry": "Lithium-ion"}
    },
    
    # Suspension
    {
        "sku": "SUS-001",
        "category": "suspension",
        "name": "Trail Pro 120mm",
        "description": "120mm front suspension for trail riding",
        "base_price": 42000,
        "weight_kg": 2.1,
        "image_url": "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7",
        "inventory_count": 8,
        "specs": {"travel": 120, "type": "air", "adjustment": "rebound"}
    },
    {
        "sku": "SUS-002",
        "category": "suspension",
        "name": "Enduro 150mm",
        "description": "150mm travel for rough terrain",
        "base_price": 58000,
        "weight_kg": 2.5,
        "image_url": "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7",
        "inventory_count": 5,
        "specs": {"travel": 150, "type": "air", "adjustment": "compression"}
    },
    {
        "sku": "SUS-003",
        "category": "suspension",
        "name": "Urban 80mm",
        "description": "80mm suspension for city comfort",
        "base_price": 28000,
        "weight_kg": 1.8,
        "image_url": "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7",
        "inventory_count": 12,
        "specs": {"travel": 80, "type": "coil", "adjustment": "preload"}
    },
    
    # Brakes
    {
        "sku": "BRK-001",
        "category": "brakes",
        "name": "Mountain Disc Pro",
        "description": "4-piston disc brakes for maximum stopping power",
        "base_price": 32000,
        "weight_kg": 0.8,
        "image_url": "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7",
        "inventory_count": 10,
        "specs": {"type": "hydraulic", "pistons": 4, "rotor": "203mm"}
    },
    {
        "sku": "BRK-002",
        "category": "brakes",
        "name": "Trail Hydraulic",
        "description": "2-piston hydraulic brakes for trail riding",
        "base_price": 22000,
        "weight_kg": 0.6,
        "image_url": "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7",
        "inventory_count": 15,
        "specs": {"type": "hydraulic", "pistons": 2, "rotor": "180mm"}
    },
    {
        "sku": "BRK-003",
        "category": "brakes",
        "name": "City Mechanical",
        "description": "Reliable mechanical disc brakes for commuting",
        "base_price": 15000,
        "weight_kg": 0.5,
        "image_url": "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7",
        "inventory_count": 20,
        "specs": {"type": "mechanical", "pistons": 1, "rotor": "160mm"}
    },
    
    # Wheels
    {
        "sku": "WHL-001",
        "category": "wheels",
        "name": "Trail Pro 29\"",
        "description": "29-inch tubeless wheels for trail riding",
        "base_price": 48000,
        "weight_kg": 3.2,
        "image_url": "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7",
        "inventory_count": 8,
        "specs": {"size": 29, "type": "tubeless", "rim": "carbon"}
    },
    {
        "sku": "WHL-002",
        "category": "wheels",
        "name": "Urban 27.5\"",
        "description": "27.5-inch wheels for city riding",
        "base_price": 35000,
        "weight_kg": 2.8,
        "image_url": "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7",
        "inventory_count": 12,
        "specs": {"size": 27.5, "type": "tubeless", "rim": "aluminum"}
    },
    {
        "sku": "WHL-003",
        "category": "wheels",
        "name": "Off-Road 27.5\"",
        "description": "27.5-inch wheels with rugged tires",
        "base_price": 42000,
        "weight_kg": 3.0,
        "image_url": "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7",
        "inventory_count": 6,
        "specs": {"size": 27.5, "type": "tubed", "rim": "aluminum"}
    },
]

# Terrain Profiles
TERRAIN_PROFILES = [
    {
        "name": "Kathmandu Commute",
        "description": "Urban riding through the streets of Kathmandu",
        "terrain_type": "urban",
        "difficulty": 2,
        "average_grade": 2.0,
        "surface_roughness": 2.0,
        "elevation_gain": 50.0,
        "terrain_factor": 0.95,
        "elevation_factor": 1.05,
        "icon": "🏙️",
        "color": "#4A90D9"
    },
    {
        "name": "Nagarkot Trails",
        "description": "Climbing trails with mixed terrain near Nagarkot",
        "terrain_type": "trail",
        "difficulty": 4,
        "average_grade": 8.0,
        "surface_roughness": 6.0,
        "elevation_gain": 400.0,
        "terrain_factor": 0.72,
        "elevation_factor": 1.35,
        "icon": "⛰️",
        "color": "#2ECC71"
    },
    {
        "name": "Mustang Off-Road",
        "description": "Demanding off-road terrain in Mustang region",
        "terrain_type": "offroad",
        "difficulty": 5,
        "average_grade": 12.0,
        "surface_roughness": 8.0,
        "elevation_gain": 800.0,
        "terrain_factor": 0.58,
        "elevation_factor": 1.65,
        "icon": "🏔️",
        "color": "#E74C3C"
    },
]# Add after TERRAIN_PROFILES
DELIVERY_REGIONS = [
    {
        "name": "Kathmandu Valley",
        "region_type": "metro",
        "base_fee": 150,
        "estimated_days": 1,
        "districts": "Kathmandu, Lalitpur, Bhaktapur",
        "is_active": True
    },
    {
        "name": "Pokhara",
        "region_type": "city",
        "base_fee": 200,
        "estimated_days": 2,
        "districts": "Pokhara, Kaski",
        "is_active": True
    },
    {
        "name": "Chitwan",
        "region_type": "city",
        "base_fee": 250,
        "estimated_days": 2,
        "districts": "Bharatpur, Chitwan",
        "is_active": True
    },
    {
        "name": "Dharan",
        "region_type": "city",
        "base_fee": 300,
        "estimated_days": 3,
        "districts": "Dharan, Sunsari",
        "is_active": True
    },
    {
        "name": "Other Districts",
        "region_type": "district",
        "base_fee": 400,
        "estimated_days": 4,
        "districts": "All other districts",
        "is_active": True
    },
]

# In seed_data function, add:



async def seed_data():
    async with AsyncSessionLocal() as db:
        # Check if data already exists
        stmt = select(Component).limit(1)
        result = await db.execute(stmt)
        if result.scalar_one_or_none():
            print("✅ Data already seeded!")
            return
        
        # Seed components
        for comp_data in COMPONENTS:
            component = Component(**comp_data)
            db.add(component)
            print(f"✅ Added component: {component.name}")
        
        # Seed terrain profiles
        for terrain_data in TERRAIN_PROFILES:
            terrain = TerrainProfile(**terrain_data)
            db.add(terrain)
            print(f"✅ Added terrain: {terrain.name}")
        
        await db.commit()
        print("\n✅ Seed data complete!")

        for region_data in DELIVERY_REGIONS:
            region = DeliveryRegion(**region_data)
            db.add(region)
            print(f"✅ Added delivery region: {region.name}")


if __name__ == "__main__":
    asyncio.run(seed_data())
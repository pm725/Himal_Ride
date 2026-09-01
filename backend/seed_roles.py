import asyncio
from app.core.database import AsyncSessionLocal
from app.models.role import Role
from sqlalchemy import select

async def create_roles():
    async with AsyncSessionLocal() as db:
        for role_name in ['customer', 'admin']:
            # Check if role exists
            stmt = select(Role).where(Role.name == role_name)
            result = await db.execute(stmt)
            existing = result.scalar_one_or_none()
            
            if not existing:
                role = Role(name=role_name, description=f'{role_name.capitalize()} role')
                db.add(role)
                print(f"✅ Created role: {role_name}")
            else:
                print(f"✅ Role already exists: {role_name}")
        
        await db.commit()
        print("✅ Roles setup complete!")

if __name__ == "__main__":
    asyncio.run(create_roles())

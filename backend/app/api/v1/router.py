from fastapi import APIRouter
from .endpoints import auth, health, components, configurator, terrain

api_router = APIRouter()

api_router.include_router(auth.router)
api_router.include_router(health.router)
api_router.include_router(components.router)
api_router.include_router(configurator.router)
api_router.include_router(terrain.router)  # Add this line
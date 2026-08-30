from fastapi import APIRouter
from .endpoints import auth, health

api_router = APIRouter()

# Include all v1 endpoints
api_router.include_router(auth.router)
api_router.include_router(health.router)

# We'll add more endpoints later:
# api_router.include_router(components.router)
# api_router.include_router(configurator.router)
# api_router.include_router(cart.router)
# api_router.include_router(orders.router)
# api_router.include_router(admin.router)
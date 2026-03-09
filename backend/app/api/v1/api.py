from fastapi import APIRouter
from backend.app.api.v1.endpoints import auth, vendor, public, analytics

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(vendor.router)
api_router.include_router(public.router)
api_router.include_router(analytics.router)

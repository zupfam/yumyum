from typing import Annotated, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select
from backend.app.core.db import get_session
from backend.app.api.v1.endpoints.auth import get_current_vendor
from backend.app.models.models import Vendor
from backend.app.schemas.schemas import BrandCreate, BrandRead, DishCreate, DishRead
from backend.app.schemas.auth import RegisterRequest
from backend.app.services.vendor_management import VendorManagementService
from uuid import UUID

router = APIRouter(prefix="/admin", tags=["admin"])

SessionDep = Annotated[AsyncSession, Depends(get_session)]

async def get_current_superadmin(
    vendor: Annotated[Vendor, Depends(get_current_vendor)]
) -> Vendor:
    if not vendor.is_superadmin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user does not have enough privileges"
        )
    return vendor

SuperAdminDep = Annotated[Vendor, Depends(get_current_superadmin)]

@router.get("/vendors", response_model=List[dict])
async def list_vendors(admin: SuperAdminDep, session: SessionDep):
    """
    Overview of all vendors and their brands for the YumYum Team.
    """
    vendors = await VendorManagementService.list_all_vendors_with_brands(session)
    # We manually construct the response to ensure nested brands are included if they exist
    results = []
    for v in vendors:
        # Fetch brand explicitly to ensure it's loaded in async context
        statement = select(Brand).where(Brand.vendor_id == v.id)
        # Wait, I should probably use selectinload or just fetch it
        from backend.app.models.models import Brand
        brand_stmt = select(Brand).where(Brand.vendor_id == v.id)
        brand_res = await session.execute(brand_stmt)
        brand = brand_res.scalars().first()
        
        results.append({
            "id": v.id,
            "mobile_number": v.mobile_number,
            "is_active": v.is_active,
            "is_superadmin": v.is_superadmin,
            "created_at": v.created_at,
            "brand": brand
        })
    return results

@router.post("/vendors", response_model=dict)
async def create_vendor_admin(request: RegisterRequest, admin: SuperAdminDep, session: SessionDep):
    vendor = await VendorManagementService.create_vendor(session, request.mobile_number, request.pin)
    return {"id": vendor.id, "mobile_number": vendor.mobile_number}

@router.post("/brands/{vendor_id}", response_model=BrandRead)
async def create_brand_admin(vendor_id: UUID, brand_in: BrandCreate, admin: SuperAdminDep, session: SessionDep):
    return await VendorManagementService.create_brand(session, vendor_id, brand_in)

@router.post("/dishes/{brand_id}", response_model=DishRead)
async def add_dish_admin(brand_id: int, dish_in: DishCreate, admin: SuperAdminDep, session: SessionDep):
    return await VendorManagementService.add_dish(session, brand_id, dish_in)

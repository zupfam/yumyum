from typing import Annotated, List
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select
from backend.app.core.db import get_session
from backend.app.api.v1.endpoints.auth import get_current_vendor
from backend.app.models.models import Vendor, Brand, Dish
from backend.app.schemas.schemas import BrandCreate, BrandRead, DishCreate, DishRead, VendorStatusUpdate
from backend.app.services.storage import upload_image
from backend.app.services.vendor_management import VendorManagementService
from datetime import datetime, timezone

router = APIRouter(prefix="/vendor", tags=["vendor"])

SessionDep = Annotated[AsyncSession, Depends(get_session)]
CurrentVendor = Annotated[Vendor, Depends(get_current_vendor)]

@router.get("/me/brand", response_model=BrandRead)
async def get_my_brand(vendor: CurrentVendor, session: SessionDep):
    statement = select(Brand).where(Brand.vendor_id == vendor.id)
    result = await session.execute(statement)
    brand = result.scalars().first()
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")
    return brand

@router.post("/me/status", response_model=BrandRead)
async def update_vendor_status(
    status_in: VendorStatusUpdate,
    vendor: CurrentVendor,
    session: SessionDep
):
    statement = select(Brand).where(Brand.vendor_id == vendor.id)
    result = await session.execute(statement)
    brand = result.scalars().first()
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")
    
    brand.is_active_now = status_in.is_active_now
    if status_in.latitude is not None:
        brand.latitude = status_in.latitude
    if status_in.longitude is not None:
        brand.longitude = status_in.longitude
    
    brand.last_pinged_at = datetime.now(timezone.utc)
    
    session.add(brand)
    await session.commit()
    await session.refresh(brand)
    return brand

@router.post("/me/brand", response_model=BrandRead)
async def create_brand(brand_in: BrandCreate, vendor: CurrentVendor, session: SessionDep):
    return await VendorManagementService.create_brand(session, vendor.id, brand_in)

@router.get("/me/dishes", response_model=List[DishRead])
async def get_my_dishes(vendor: CurrentVendor, session: SessionDep):
    statement = select(Brand).where(Brand.vendor_id == vendor.id)
    result = await session.execute(statement)
    brand = result.scalars().first()
    if not brand:
        return []
    
    statement = select(Dish).where(Dish.brand_id == brand.id)
    result = await session.execute(statement)
    return result.scalars().all()

@router.post("/me/dishes", response_model=DishRead)
async def add_dish(dish_in: DishCreate, vendor: CurrentVendor, session: SessionDep):
    statement = select(Brand).where(Brand.vendor_id == vendor.id)
    result = await session.execute(statement)
    brand = result.scalars().first()
    if not brand:
        raise HTTPException(status_code=400, detail="Create brand first")
    
    return await VendorManagementService.add_dish(session, brand.id, dish_in)

@router.post("/upload/image")
async def upload_vendor_image(
    vendor: CurrentVendor,
    file: UploadFile = File(...)
):
    """
    Upload an image to Cloudinary
    """
    url = upload_image(file.file)
    if not url:
        raise HTTPException(status_code=500, detail="Upload failed")
    return {"url": url}

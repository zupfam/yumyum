from uuid import UUID
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select
from backend.app.models.models import Vendor, Brand, Dish
from backend.app.core.security import get_password_hash
from backend.app.schemas.schemas import BrandCreate, DishCreate
from fastapi import HTTPException

class VendorManagementService:
    @staticmethod
    async def create_vendor(session: AsyncSession, mobile_number: str, pin: str, is_superadmin: bool = False) -> Vendor:
        """
        Creates a new vendor account with hashed PIN.
        """
        statement = select(Vendor).where(Vendor.mobile_number == mobile_number)
        result = await session.execute(statement)
        if result.scalars().first():
            raise HTTPException(status_code=400, detail="Mobile number already registered")
        
        vendor = Vendor(
            mobile_number=mobile_number,
            pin_hash=get_password_hash(pin),
            is_superadmin=is_superadmin
        )
        session.add(vendor)
        await session.commit()
        await session.refresh(vendor)
        return vendor

    @staticmethod
    async def create_brand(session: AsyncSession, vendor_id: UUID, brand_in: BrandCreate) -> Brand:
        """
        Links a professional brand to a vendor.
        """
        # Ensure vendor exists
        vendor = await session.get(Vendor, vendor_id)
        if not vendor:
            raise HTTPException(status_code=404, detail="Vendor not found")

        # Check if brand already exists for this vendor
        statement = select(Brand).where(Brand.vendor_id == vendor_id)
        result = await session.execute(statement)
        if result.scalars().first():
            raise HTTPException(status_code=400, detail="Brand already exists for this vendor")
        
        brand = Brand(**brand_in.model_dump(), vendor_id=vendor_id)
        session.add(brand)
        await session.commit()
        await session.refresh(brand)
        return brand

    @staticmethod
    async def add_dish(session: AsyncSession, brand_id: int, dish_in: DishCreate) -> Dish:
        """
        Adds a dish to a specific brand menu.
        """
        # Ensure brand exists
        brand = await session.get(Brand, brand_id)
        if not brand:
            raise HTTPException(status_code=404, detail="Brand not found")

        dish = Dish(**dish_in.model_dump(), brand_id=brand_id)
        session.add(dish)
        await session.commit()
        await session.refresh(dish)
        return dish

    @staticmethod
    async def list_all_vendors_with_brands(session: AsyncSession) -> List[Vendor]:
        """
        Returns all vendors including their linked brands for administrative overview.
        """
        statement = select(Vendor)
        result = await session.execute(statement)
        return result.scalars().all()

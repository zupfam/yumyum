import asyncio
import sys
import os
from uuid import UUID, uuid4
from datetime import datetime, timezone

# Add the project root to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from sqlmodel import select, SQLModel
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.core.db import engine
from backend.app.models.models import Vendor, Brand, Dish, StatusItem
from backend.app.core.security import get_password_hash

def get_now():
    return datetime.now(timezone.utc).replace(tzinfo=None)

async def seed():
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.drop_all) # Clear existing to be safe
        await conn.run_sync(SQLModel.metadata.create_all)
        print("Tables created")

    async with AsyncSession(engine) as session:
        # 1. Create a Test Vendor
        mobile = "9876543210"
        vendor = Vendor(
            id=uuid4(),
            mobile_number=mobile,
            pin_hash=get_password_hash("1234"),
            is_active=True,
            is_superadmin=True,
            created_at=get_now()
        )
        session.add(vendor)
        await session.flush() # Get ID if needed

        # 2. Create a Brand for the Vendor
        brand = Brand(
            vendor_id=vendor.id,
            name="Bangalore Biryani House",
            slug="bangalore-biryani",
            logo_url="https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?auto=format&fit=crop&q=80&w=200&h=200",
            cuisine="South Indian, Biryani",
            description="Authentic wood-fired biryani served with love.",
            whatsapp_number="919876543210",
            address="Indiranagar, Bangalore",
            city="Bangalore",
            is_active_now=True,
            latitude=12.9716,
            longitude=77.5946,
            created_at=get_now()
        )
        session.add(brand)
        await session.flush()

        # 3. Add Dishes
        dishes_data = [
            {"name": "Hyderabadi Chicken Biryani", "price": 280, "category": "Biryani", "is_veg": False, "image_url": "https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?auto=format&fit=crop&q=80&w=400"},
            {"name": "Paneer Tikka Biryani", "price": 240, "category": "Biryani", "is_veg": True, "image_url": "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&q=80&w=400"},
            {"name": "Chicken 65", "price": 180, "category": "Starters", "is_veg": False, "image_url": "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&q=80&w=400"},
            {"name": "Masala Coke", "price": 45, "category": "Beverages", "is_veg": True, "image_url": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=400"}
        ]
        
        for d in dishes_data:
            dish = Dish(brand_id=brand.id, created_at=get_now(), **d)
            session.add(dish)
        
        # 4. Add Status Updates
        status_data = [
            {"type": "image", "content": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=600", "is_active": True},
            {"type": "text", "content": "Fresh batch of Biryani ready at 1 PM!", "is_active": True}
        ]
        
        for s in status_data:
            status = StatusItem(brand_id=brand.id, created_at=get_now(), **s)
            session.add(status)

        await session.commit()
        print("\nSeeding completed successfully!")

if __name__ == "__main__":
    asyncio.run(seed())

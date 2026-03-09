from pydantic import BaseModel, EmailStr
from uuid import UUID
from typing import Optional, List
from datetime import datetime

class BrandCreate(BaseModel):
    name: str
    slug: str
    logo_url: str
    cuisine: str
    whatsapp_number: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class BrandRead(BrandCreate):
    id: int
    vendor_id: UUID
    is_active_now: bool
    last_pinged_at: Optional[datetime] = None
    view_count: int
    created_at: datetime

class BrandUpdate(BaseModel):
    name: Optional[str] = None
    logo_url: Optional[str] = None
    cuisine: Optional[str] = None
    whatsapp_number: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    is_active_now: Optional[bool] = None

class VendorStatusUpdate(BaseModel):
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    is_active_now: bool

class DishCreate(BaseModel):
    category: str
    name: str
    description: Optional[str] = None
    price: float
    image_url: Optional[str] = None
    is_veg: bool = True
    tag: Optional[str] = None

class DishRead(DishCreate):
    id: int
    brand_id: int
    created_at: datetime

class StatusCreate(BaseModel):
    type: str
    content: str

class StatusRead(StatusCreate):
    id: int
    brand_id: int
    created_at: datetime

class AnalyticsEventCreate(BaseModel):
    event_type: str
    vendor_slug: str
    dish_id: Optional[int] = None
    update_id: Optional[int] = None

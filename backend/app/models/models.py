from datetime import datetime, timezone
from typing import Optional
from sqlmodel import SQLModel, Field, Relationship
from uuid import UUID, uuid4

class VendorBase(SQLModel):
    mobile_number: str = Field(unique=True, index=True)
    is_active: bool = True

class Vendor(VendorBase, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    pin_hash: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    
    brand: Optional["Brand"] = Relationship(back_populates="vendor")

class BrandBase(SQLModel):
    name: str
    slug: str = Field(unique=True, index=True)
    logo_url: str
    cuisine: str
    description: Optional[str] = None
    whatsapp_number: str
    contact_number: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    instagram_url: Optional[str] = None
    facebook_url: Optional[str] = None
    youtube_url: Optional[str] = None
    payment_link: Optional[str] = None
    # Discovery Portal Fields
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    is_active_now: bool = Field(default=False)
    last_pinged_at: Optional[datetime] = None
    view_count: int = Field(default=0)

class Brand(BrandBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    vendor_id: UUID = Field(foreign_key="vendor.id")
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    
    vendor: Vendor = Relationship(back_populates="brand")
    dishes: list["Dish"] = Relationship(back_populates="brand")
    statuses: list["StatusItem"] = Relationship(back_populates="brand")

class DishBase(SQLModel):
    category: str
    name: str
    description: Optional[str] = None
    price: float
    image_url: Optional[str] = None
    video_url: Optional[str] = None
    is_available: bool = True
    is_veg: bool = True
    tag: Optional[str] = None

class Dish(DishBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    brand_id: int = Field(foreign_key="brand.id")
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    
    brand: Brand = Relationship(back_populates="dishes")

class StatusItemBase(SQLModel):
    type: str  # image, video, text
    content: str
    is_active: bool = True

class StatusItem(StatusItemBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    brand_id: int = Field(foreign_key="brand.id")
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    
    brand: Brand = Relationship(back_populates="statuses")

class MenuEventBase(SQLModel):
    event_type: str  # menu_view, dish_view, add_to_cart, order_click
    vendor_id: UUID
    dish_id: Optional[int] = None
    update_id: Optional[int] = None

class MenuEvent(MenuEventBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

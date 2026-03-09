from typing import Annotated
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select
from backend.app.core.db import get_session
from backend.app.models.models import Brand, MenuEvent
from backend.app.schemas.schemas import AnalyticsEventCreate

router = APIRouter(prefix="/analytics", tags=["analytics"])

SessionDep = Annotated[AsyncSession, Depends(get_session)]

@router.post("/event")
async def track_event(event_in: AnalyticsEventCreate, session: SessionDep):
    # Lookup vendor_id from slug
    statement = select(Brand).where(Brand.slug == event_in.vendor_slug)
    result = await session.execute(statement)
    brand = result.scalars().first()
    if not brand:
        return {"status": "ignored"} # Silent ignore if vendor doesn't exist
    
    event = MenuEvent(
        event_type=event_in.event_type,
        vendor_id=brand.vendor_id,
        dish_id=event_in.dish_id,
        update_id=event_in.update_id
    )
    session.add(event)
    await session.commit()
    return {"status": "ok"}

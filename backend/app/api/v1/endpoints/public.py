from typing import Annotated, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select, func, desc
from math import radians, cos, sin, asin, sqrt
from datetime import datetime, timezone
...
@router.get("/menu/{slug}")
async def get_public_menu(slug: str, session: SessionDep):
    statement = select(Brand).where(Brand.slug == slug)
    result = await session.execute(statement)
    brand = result.scalars().first()
    if not brand:
        raise HTTPException(status_code=404, detail="Vendor not found")
    
    # Increment view count
    brand.view_count += 1
    session.add(brand)
    await session.commit()
    
    statement_dishes = select(Dish).where(Dish.brand_id == brand.id, Dish.is_available == True)
...
@router.get("/portal")
async def get_discovery_portal(
    lat: Optional[float] = Query(None),
    lng: Optional[float] = Query(None),
    session: SessionDep = Depends(get_session)
):
    # 1. Fetch 3 most popular (all time view_count)
    statement_popular = select(Brand).where(Brand.is_active_now == True).order_by(desc(Brand.view_count)).limit(3)
    result_popular = await session.execute(statement_popular)
    popular = result_popular.scalars().all()
    
    # 2. Fetch all active for distance calculation
    statement_active = select(Brand).where(Brand.is_active_now == True)
    result_active = await session.execute(statement_active)
    active_brands = result_active.scalars().all()
    
    def calculate_distance(lat1, lon1, lat2, lon2):
        if None in [lat1, lon1, lat2, lon2]: return float('inf')
        # Haversine formula
        R = 6371 # km
        dLat = radians(lat2 - lat1)
        dLon = radians(lon2 - lon1)
        a = sin(dLat / 2) ** 2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dLon / 2) ** 2
        c = 2 * asin(sqrt(a))
        return R * c

    nearest = []
    if lat is not None and lng is not None:
        # Sort by distance
        active_with_dist = []
        for b in active_brands:
            dist = calculate_distance(lat, lng, b.latitude, b.longitude)
            active_with_dist.append((b, dist))
        
        active_with_dist.sort(key=lambda x: x[1])
        nearest = [
            {
                "brand": b,
                "distance_km": round(d, 2)
            } for b, d in active_with_dist[:5]
        ]
    
    # 3. Featured Reels (Random selection of active brands with videos)
    statement_reels = select(Dish, Brand.slug).join(Brand).where(
        Brand.is_active_now == True, 
        Dish.video_url != None
    ).limit(10)
    result_reels = await session.execute(statement_reels)
    reels_data = result_reels.all()
    
    reels = [
        {
            **d.model_dump(),
            "vendor_slug": slug
        } for d, slug in reels_data
    ]

    return {
        "popular": popular,
        "nearest": nearest,
        "reels": reels
    }

@router.get("/search")
async def search_partners(q: str, session: SessionDep):
    if len(q) < 2:
        return {"results": []}
    
    # Search in Brands (name, cuisine) and Dishes (name)
    # Using distinct to avoid multiple results for same brand if multiple dishes match
    statement = select(Brand).outerjoin(Dish).where(
        (Brand.name.ilike(f"%{q}%")) | 
        (Brand.cuisine.ilike(f"%{q}%")) |
        (Dish.name.ilike(f"%{q}%"))
    ).distinct(Brand.id).limit(10)
    
    result = await session.execute(statement)
    brands = result.scalars().all()
    
    return {
        "results": [
            {
                "vendor_name": b.name,
                "cuisine": b.cuisine,
                "vendor_slug": b.slug
            } for b in brands
        ]
    }

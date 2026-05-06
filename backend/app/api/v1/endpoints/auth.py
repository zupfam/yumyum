from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select
from backend.app.core.db import get_session
from backend.app.core.security import (
    verify_password,
    create_access_token
)
from backend.app.models.models import Vendor
from backend.app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse
from backend.app.services.vendor_management import VendorManagementService
from jose import jwt
from fastapi.security import OAuth2PasswordBearer
from backend.app.core.config import settings

router = APIRouter(prefix="/auth", tags=["auth"])

SessionDep = Annotated[AsyncSession, Depends(get_session)]

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login", auto_error=False)

async def get_current_vendor(
    session: SessionDep,
    token: Annotated[str, Depends(oauth2_scheme)]
) -> Vendor:
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        vendor_id: str = payload.get("sub")
        if vendor_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
            )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        )
    
    vendor = await session.get(Vendor, vendor_id)
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")
    return vendor

@router.post("/register", response_model=TokenResponse)
async def register(request: RegisterRequest, session: SessionDep):
    """
    Register a new vendor with mobile number and PIN (pattern).
    """
    vendor = await VendorManagementService.create_vendor(
        session=session,
        mobile_number=request.mobile_number,
        pin=request.pin
    )
    access_token = create_access_token(subject=vendor.id)
    return TokenResponse(access_token=access_token)

@router.post("/login", response_model=TokenResponse)
async def login(request: LoginRequest, session: SessionDep):
    """
    Login with mobile number and PIN.
    """
    statement = select(Vendor).where(Vendor.mobile_number == request.mobile_number)
    result = await session.execute(statement)
    vendor = result.scalars().first()
    
    if not vendor or not verify_password(request.pin, vendor.pin_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect mobile number or PIN"
        )
    
    access_token = create_access_token(subject=vendor.id)
    return TokenResponse(access_token=access_token)

@router.get("/me", response_model=dict)
async def get_me(vendor: Annotated[Vendor, Depends(get_current_vendor)]):
    """
    Returns current user info.
    """
    return {
        "id": vendor.id,
        "mobile_number": vendor.mobile_number,
        "is_superadmin": vendor.is_superadmin
    }

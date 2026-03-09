from pydantic import BaseModel
from uuid import UUID

class RegisterRequest(BaseModel):
    mobile_number: str
    pin: str

class LoginRequest(BaseModel):
    mobile_number: str
    pin: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class UserInfo(BaseModel):
    id: UUID
    mobile_number: str

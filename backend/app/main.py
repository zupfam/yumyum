from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.core.config import settings
from backend.app.core.db import engine
from sqlmodel import SQLModel

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set all HTT-capable origins
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

@app.on_event("startup")
def on_startup():
    # Create tables on startup (for development)
    SQLModel.metadata.create_all(engine)

@app.get("/")
def root():
    return {"message": "Welcome to YumYum API", "status": "healthy"}

# Include routers
from backend.app.api.v1.api import api_router
app.include_router(api_router, prefix=settings.API_V1_STR)

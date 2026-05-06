import time
import sentry_sdk
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from asgi_correlation_id import CorrelationIdMiddleware
from asgi_correlation_id.context import correlation_id

from backend.app.core.config import settings
from backend.app.core.db import engine
from backend.app.core.logging import setup_logging, log
from sqlmodel import SQLModel

# Initialize Sentry
if settings.SENTRY_DSN:
    sentry_sdk.init(
        dsn=settings.SENTRY_DSN,
        environment=settings.ENVIRONMENT,
        traces_sample_rate=1.0,
        profiles_sample_rate=1.0,
    )

# Setup Logging
setup_logging()

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Add Correlation ID Middleware
app.add_middleware(CorrelationIdMiddleware)

# Set all HTT-capable origins
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

@app.middleware("http")
async def logging_middleware(request: Request, call_next):
    request_id = correlation_id.get() or "N/A"
    
    # Bind request_id to the logger for this context
    with log.contextualize(request_id=request_id):
        method = request.method
        path = request.url.path
        
        log.info(
            event="incoming_request",
            method=method,
            path=path,
            client_host=request.client.host if request.client else None
        )
        
        start_time = time.time()
        try:
            response = await call_next(request)
            duration_ms = (time.time() - start_time) * 1000
            
            log.info(
                event="request_completed",
                method=method,
                path=path,
                status_code=response.status_code,
                duration_ms=round(duration_ms, 2)
            )
            return response
        except Exception as e:
            duration_ms = (time.time() - start_time) * 1000
            log.error(
                event="request_failed",
                method=method,
                path=path,
                error=str(e),
                duration_ms=round(duration_ms, 2)
            )
            raise e

@app.on_event("startup")
def on_startup():
    log.info(event="startup", message="Application starting up")
    # Create tables on startup (for development)
    SQLModel.metadata.create_all(engine)
    log.info(event="startup", message="Database tables created")

@app.on_event("shutdown")
def on_shutdown():
    log.info(event="shutdown", message="Application shutting down")

@app.get("/")
def root():
    log.debug(event="root_access", method="root", message="Root endpoint accessed")
    return {"message": "Welcome to YumYum API", "status": "healthy"}

# Include routers
from backend.app.api.v1.api import api_router
app.include_router(api_router, prefix=settings.API_V1_STR)

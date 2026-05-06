import sys
from loguru import logger
from backend.app.core.config import settings

def setup_logging():
    # Remove default logger
    logger.remove()

    # Shared format for logs
    log_format = (
        "<green>{time:YYYY-MM-DD HH:mm:ss.SSS}</green> | "
        "<level>{level: <8}</level> | "
        "<cyan>{extra[request_id]}</cyan> | "
        "<cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - "
        "<level>{message}</level> | "
        "{extra}"
    )

    # Console output
    logger.add(
        sys.stderr,
        format=log_format,
        level="DEBUG",
        enqueue=True,
        backtrace=True,
        diagnose=True,
    )

    # File output with rotation and retention
    logger.add(
        "logs/backend.log",
        rotation="10 MB",
        retention="1 month",
        compression="zip",
        format=log_format,
        level="INFO",
        serialize=True, # Structured JSON for production use cases
        enqueue=True,
    )

    return logger

# Singleton instance
log = logger.bind(request_id="N/A")

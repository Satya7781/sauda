"""
ASGI Application Entry Point for Sauda Backend

This module provides the ASGI application instance that should be used
by application servers like Uvicorn or Gunicorn.
"""

from main import app

__all__ = ["app"]

#!/bin/bash
# Production start — runs the backend which serves both API and frontend static files
cd "$(dirname "$0")/backend"
source venv/bin/activate 2>/dev/null || true
export ENV=production
exec uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}

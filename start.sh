#!/bin/bash
# Render start command
cd backend
pip install -r requirements.txt -q 2>/dev/null
exec uvicorn main:app --host 0.0.0.0 --port ${PORT:-10000}

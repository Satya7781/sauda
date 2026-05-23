#!/usr/bin/env python3
"""
Sauda — Local development launcher.
Starts both backend (port 8000) and frontend (port 8080).

For production deployment (Render, Railway, etc.):
  cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT
The backend serves the frontend static files automatically in production.
"""
import subprocess
import os
import sys

os.chdir('/home/rajverma/Documents/sauda-main')

print("=" * 50)
print("Sauda — Local Development Server")
print("=" * 50)

# Remove old database so fresh seed data is created on startup
db_path = os.path.join('backend', 'sauda.db')
if os.path.exists(db_path):
    os.remove(db_path)
    print("✓ Removed old database for fresh seed")

# Start backend
backend_env = os.environ.copy()
backend_env['PYTHONPATH'] = os.path.join(os.getcwd(), 'backend')
backend_env['ENV'] = 'development'

backend_proc = subprocess.Popen(
    [os.path.join('backend', 'venv', 'bin', 'python'), '-c',
     'import uvicorn; uvicorn.run("main:app", host="0.0.0.0", port=8000)'],
    cwd='backend',
    env=backend_env,
    stdout=subprocess.DEVNULL,
    stderr=subprocess.DEVNULL,
    start_new_session=True
)
print(f"✓ Backend started (PID: {backend_proc.pid}) — http://localhost:8000")

# Start frontend
frontend_proc = subprocess.Popen(
    [sys.executable, '-m', 'http.server', '8080'],
    stdout=subprocess.DEVNULL,
    stderr=subprocess.DEVNULL,
    start_new_session=True
)
print(f"✓ Frontend started (PID: {frontend_proc.pid}) — http://localhost:8080")

print("=" * 50)
print("Press Ctrl+C to stop both servers")
print("=" * 50)

try:
    backend_proc.wait()
except KeyboardInterrupt:
    print("\nStopping servers...")
    backend_proc.terminate()
    frontend_proc.terminate()
    print("Servers stopped.")

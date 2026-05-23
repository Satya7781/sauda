#!/usr/bin/env python3
import subprocess
import os
import time
import sys

os.chdir('/home/rajverma/Documents/sauda-main')

print("Starting Sauda servers...")
print("="*50)

# Remove old database so fresh seed data is created on startup
db_path = '/home/rajverma/Documents/sauda-main/backend/sauda.db'
if os.path.exists(db_path):
    os.remove(db_path)
    print("Removed old database for fresh seed")

# Start backend
backend_env = os.environ.copy()
backend_env['PYTHONPATH'] = '/home/rajverma/Documents/sauda-main/backend'

backend_proc = subprocess.Popen(
    ['/home/rajverma/Documents/sauda-main/backend/venv/bin/python', '-c',
     'import uvicorn; uvicorn.run("main:app", host="0.0.0.0", port=8000)'],
    cwd='/home/rajverma/Documents/sauda-main/backend',
    env=backend_env,
    stdout=subprocess.DEVNULL,
    stderr=subprocess.DEVNULL,
    start_new_session=True
)
print(f"Backend started (PID: {backend_proc.pid})")

# Start frontend
frontend_proc = subprocess.Popen(
    [sys.executable, '-m', 'http.server', '8080'],
    stdout=subprocess.DEVNULL,
    stderr=subprocess.DEVNULL,
    start_new_session=True
)
print(f"Frontend started (PID: {frontend_proc.pid})")
print("="*50)
print("Servers running:")
print("  Frontend: http://localhost:8080")
print("  Backend:  http://localhost:8000")
print("\nPress Ctrl+C to stop servers")
print("="*50)

try:
    backend_proc.wait()
except KeyboardInterrupt:
    print("\nStopping servers...")
    backend_proc.terminate()
    frontend_proc.terminate()
    print("Servers stopped")
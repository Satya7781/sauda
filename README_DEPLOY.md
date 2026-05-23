Deploying Sauda — Render & Capacitor notes
=========================================

This file contains concise instructions for deploying the backend to Render and packaging the web app with Capacitor for Android.

1) Render (FastAPI + static served by the app)
- Create a new **Web Service** on Render.
- Connect your GitHub repo and select the `main` branch.
- If you want Render to run your Dockerfile, select **Docker** as the environment.
- Build command (if not using Docker): `pip install -r backend/requirements.txt`
- Start command (non-Docker): `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
- Env vars to set:
  - `ENV=production`
  - `DATABASE_URL` — set to your managed Postgres URL (e.g. `postgres://USER:PASS@HOST:PORT/DB`). If you use Render Postgres, Render provides this.
  - `ALLOWED_ORIGINS` — set space/comma-separated origins (e.g. `https://your-frontend.vercel.app,https://your-service.onrender.com`), or `*` for development.
  - Persistent DB: do NOT use SQLite in production. Use Render Postgres and set `DATABASE_URL`.

  - NOTE: This repository supports local SQLite for development by default. To use SQLite in containers, set `DATABASE_URL=sqlite:///./sauda.db` and make sure the container's working directory is writable or mount a host volume to persist `sauda.db` across restarts. SQLite is not suitable for multi-instance production deployments.

Files of interest:
- `backend/main.py` — FastAPI app; static folders (`/css`, `/js`, `/images`) are mounted automatically.
- `backend/requirements.txt` — server dependencies (ensure `psycopg2-binary` is present for Postgres).

2) Docker (optional)
- Build locally: `docker build -t sauda-app:latest .`
- Run: `docker run --rm -p 8000:8000 -e ENV=production -e DATABASE_URL="postgresql://..." sauda-app:latest`
- Or use `docker-compose up --build` (compose includes a local Postgres service).

3) Capacitor (Android)
- Install Node & npm locally.
- From project root:
  - `npm install`
  - `npm run build:www` (copies `index.html`, `css`, `js`, `images` into `www/`)
  - `npx cap init sauda com.sauda.app --web-dir=www` (only once)
  - `npx cap add android`
  - `npx cap open android` (open Android Studio, build & run)
- Ensure your app uses the full backend URL (e.g. `https://your-service.onrender.com/api`) — update fetch calls or a config variable.
- Use HTTPS in production.

4) Quick notes
- CORS: backend uses `ALLOWED_ORIGINS` env var. Set it appropriately.
- Database migrations: this repo uses simple `Base.metadata.create_all` in `database.init_db()`. For production consider adding Alembic migrations.

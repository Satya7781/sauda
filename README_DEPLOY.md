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
  - `DATABASE_URL` — set this in Render to your Railway MySQL connection string (use `MYSQL_PUBLIC_URL` from Railway). Example format: `mysql://USER:PASSWORD@HOST:PORT/DB`.
    - The backend auto-normalizes `mysql://` into SQLAlchemy format (`mysql+pymysql://...`).
    - If you prefer, you can skip `DATABASE_URL` and set `MYSQL_PUBLIC_URL` directly in Render env vars.
  - `ALLOWED_ORIGINS` — include `capacitor://localhost`, `ionic://localhost`, and any web origins you deploy from. For development you can use `*`.
  - Persistent DB: Railway MySQL is fine for production. Avoid SQLite for production because data resets on redeploys.

  - NOTE: This repository supports local SQLite for development by default. To use SQLite in containers, set `DATABASE_URL=sqlite:///./sauda.db` and make sure the container's working directory is writable or mount a host volume to persist `sauda.db` across restarts. SQLite is not suitable for multi-instance production deployments.

Files of interest:
- `backend/main.py` — FastAPI app; static folders (`/css`, `/js`, `/images`) are mounted automatically.
- `backend/database.py` — resolves DB URL from `DATABASE_URL` / `MYSQL_PUBLIC_URL` / Railway MySQL part variables.
- `backend/requirements.txt` — server dependencies (`psycopg2-binary` for Postgres, `PyMySQL` for MySQL).

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
- APK builds: the web client resolves its API base URL from `js/runtime-config.js` and defaults to the Render backend at `https://sauda-backend.onrender.com/api`. If you use a different Render service URL, update that file or override `window.__SAUDA_CONFIG__.apiBaseUrl` before building `www/`.

Railway → Render quick mapping
------------------------------
- In Render backend service, set `DATABASE_URL` to Railway `MYSQL_PUBLIC_URL` value.
- Do not commit raw DB credentials in code, YAML, or git history.
- Keep APK pointed to Render backend URL (`https://sauda-backend.onrender.com/api`) so app traffic goes through your backend, which then talks to Railway MySQL.

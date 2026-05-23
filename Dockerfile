FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# copy project
COPY . /app

# system deps for possible packages
RUN apt-get update && apt-get install -y --no-install-recommends build-essential gcc libpq-dev && rm -rf /var/lib/apt/lists/*

RUN python3 -m pip install --upgrade pip

# install python deps if present
RUN if [ -f backend/requirements.txt ]; then pip install --no-cache-dir -r backend/requirements.txt; fi

ENV HOST=0.0.0.0 PORT=8000

EXPOSE 8000

# Run uvicorn serving the FastAPI app. The app mounts static files from the repo.
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]

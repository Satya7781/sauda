FROM python:3.11-slim AS builder

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y --no-install-recommends build-essential gcc libpq-dev && rm -rf /var/lib/apt/lists/*

WORKDIR /wheels

# Copy requirements and build wheels for faster, reproducible installs
COPY backend/requirements.txt /tmp/requirements.txt
RUN python3 -m pip install --upgrade pip setuptools wheel && \
	python3 -m pip wheel --wheel-dir=/wheels -r /tmp/requirements.txt

FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# runtime deps (libpq for postgres client)
RUN apt-get update && apt-get install -y --no-install-recommends libpq5 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# copy application code
COPY . /app

# copy built wheels from builder and install dependencies from them
COPY --from=builder /wheels /wheels
RUN python3 -m pip install --no-index --find-links=/wheels -r backend/requirements.txt || python3 -m pip install -r backend/requirements.txt

ENV HOST=0.0.0.0 PORT=8000
ENV PYTHONPATH=/app/backend

WORKDIR /app/backend

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

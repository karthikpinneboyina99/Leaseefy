FROM python:3.13-slim
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /app
COPY . /app

RUN uv sync --frozen --no-dev
EXPOSE 8000

# We launch the uvicorn server via uv run.
# Since we DO NOT mount a volume for /app/leaseefy.db in docker-compose,
# the SQLite database file will be created brand new and destroyed when the container stops.
CMD ["uv", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

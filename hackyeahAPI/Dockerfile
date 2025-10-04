# hackyeahAPI/Dockerfile

# Stage 1: Builder - instaluje zależności
FROM python:3.13-slim AS builder

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

RUN pip install --upgrade pip
COPY requirements.txt /app/
RUN pip wheel --no-cache-dir --wheel-dir /wheels -r requirements.txt

# Stage 2: Final - tworzy ostateczny obraz
FROM python:3.13-slim AS final

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

RUN addgroup --system app && adduser --system --ingroup app app

COPY --from=builder /wheels /wheels
COPY --from=builder /app/requirements.txt .
RUN pip install --no-cache-dir --no-index --find-links=/wheels -r requirements.txt && rm -rf /wheels

COPY . /app/

RUN chown -R app:app /app

# ==============================================================================
# POPRAWIONA SEKCJA - ZMIENNE TYLKO DLA PROCESU BUDOWANIA
# ==============================================================================
# Ustawiamy tymczasowe zmienne, aby komenda `collectstatic` mogła się wykonać.
# Zostaną one nadpisane przez te podane podczas wdrażania na Cloud Run.
ENV DJANGO_SECRET_KEY="build-secret-key"
ENV DATABASE_URL="sqlite://:memory:"
RUN python manage.py collectstatic --noinput --clear
# ==============================================================================

USER app

EXPOSE 8080

CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 --timeout 0 hackyeahAPI.wsgi:application

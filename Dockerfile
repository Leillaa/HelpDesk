# Single-container deploy image: nginx + the built React app + the
# Django API (SQLite, no external services needed). See README.md
# ("Deploying as one container") for how to run it.
#
# This sits alongside — and doesn't replace — the per-service
# help-desk_backend-main/Dockerfile used for local docker-compose dev
# with Postgres. That one mirrors how the project was actually built
# in 2023; this one is new, written specifically to make the whole
# thing deployable as a single image.

# ---- frontend build ------------------------------------------------
FROM node:18-alpine AS frontend-build
WORKDIR /frontend
COPY help-desk_frontend-main/package*.json ./
RUN npm install
COPY help-desk_frontend-main/ ./
# Left unset on purpose: with the frontend and the API served from the
# same origin (nginx proxies /api, /app, /admin, /webhook, /media to
# Django), axios's baseURL should stay relative rather than pointing
# at a separate host.
RUN npm run build

# ---- runtime ---------------------------------------------------------
FROM python:3.11
ENV PYTHONUNBUFFERED=1

RUN apt-get update \
    && apt-get install -y --no-install-recommends nginx gettext-base \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app/help-desk_backend-main

COPY help-desk_backend-main/requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

COPY help-desk_backend-main/ .
COPY deploy/wsgi.py wsgi_deploy.py
# Seeded demo data (see README) — BASE_DIR resolves to /app for this
# layout, same as it does one level above help-desk_backend-main/ locally.
COPY db.sqlite3 /app/db.sqlite3

# STATICFILES_DIRS points at <BASE_DIR>/static, which collectstatic
# expects to already exist.
RUN mkdir -p /app/static && python manage.py collectstatic --noinput

COPY --from=frontend-build /frontend/build /usr/share/nginx/html

RUN mkdir -p /etc/nginx/templates
COPY deploy/nginx.conf.template /etc/nginx/templates/nginx.conf.template
COPY deploy/start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 80
CMD ["/start.sh"]

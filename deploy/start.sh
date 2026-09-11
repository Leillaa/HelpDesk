#!/bin/sh
set -e

: "${PORT:=80}"
export PORT

envsubst '${PORT}' < /etc/nginx/templates/nginx.conf.template > /etc/nginx/sites-enabled/default

cd /app/help-desk_backend-main

echo "Applying database migrations..."
python manage.py migrate --noinput

echo "Starting gunicorn on 127.0.0.1:8000..."
gunicorn wsgi_deploy:application \
    --bind 127.0.0.1:8000 \
    --workers 2 \
    --timeout 120 &

echo "Starting nginx on port $PORT..."
exec nginx -g "daemon off;"

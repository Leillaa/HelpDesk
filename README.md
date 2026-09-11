# HelpDesk

A simple ticketing / help-desk system built with Django REST Framework and React + TypeScript, with a Telegram bot bolted on so tickets can be created and answered directly from a chat.

This was my first real full-stack project, started in 2023 while I was learning Django REST Framework and React. I'm keeping this repository close to how the project actually looked at the time — it has the rough edges of a first project (a couple of leftover files from trying different approaches, some settings that were never fully cleaned up), and I've deliberately left that in rather than rewriting it to look like something I'd build today. The one thing I did clean up before publishing is anything that shouldn't have been committed in the first place — credentials, keys, and stray files (see "A note on the code" below).

## What it does

- Register / log in as a user
- Create a support ticket, list tickets, open one to see details
- Comment on a ticket, with image attachments
- Close a ticket
- **Telegram bot**: create a ticket by messaging the bot, and get replies pushed back to Telegram when staff respond on the web — communication works in both directions

## Stack

**Backend**
- Django + Django REST Framework
- PostgreSQL (SQLite for local/dev)
- JWT / token authentication
- RabbitMQ (message queue) and MinIO (S3-compatible file storage)
- `python-telegram-bot` for the bot integration
- Docker / docker-compose for running the full stack

**Frontend**
- React 18 + TypeScript
- MobX for state
- React Router, React JSS, React Final Form, Bootstrap

## Project structure

```
help-desk_backend-main/    Django backend (API, Telegram bot, admin)
  ├─ application/          tickets, comments, attachments
  ├─ profile/, users/      auth & user management
  ├─ tests/                backend test suite
  └─ Help_dasks/           Django project package (settings/urls/wsgi for Docker)
help-desk_frontend-main/   React + TypeScript client
  └─ src/
     ├─ pages/             Auth, RequestList, Request, NewRequest, ...
     ├─ components/        shared UI components
     └─ store/, http/      MobX stores and API client
Dockerfile, deploy/         single-container deploy image (nginx + gunicorn)
```

## Running it locally

The pinned dependencies are from 2023, so use **Python 3.11** for the backend (newer Pythons can't build the old `Pillow`/`psycopg2` versions in `requirements.txt`).

### Backend

```bash
cd help-desk_backend-main
python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.template .env   # optional for local dev — everything has a sane default without it
python manage.py migrate
python manage.py runserver
```

### Frontend

```bash
cd help-desk_frontend-main
npm install
npm start
```

### With Docker

Runs just the API + PostgreSQL (no frontend container — run that with `npm start` as above).

```bash
cd help-desk_backend-main
cp .env.template .env   # docker-compose needs this file to exist, even if left mostly blank
docker compose up --build
docker compose exec app python manage.py migrate   # first run only
```

### Deploying as one container

The repo also has a `Dockerfile` at its root (separate from the one above) that builds a single, self-contained image: nginx serves the built React app and proxies API calls to gunicorn, both running in the same container, with the seeded SQLite database baked in — no separate services to wire up.

```bash
docker build -t helpdesk .
docker run -p 8080:80 helpdesk
# → http://localhost:8080
```

It also honors a `PORT` env var (`docker run -e PORT=5000 -p 5000:5000 helpdesk`), so the same image runs as-is on platforms like Render or Railway that inject their own port — build the image from the repo root and point the platform at the root `Dockerfile`.

### Try it without creating an account

The repo ships with a seeded `db.sqlite3` (two demo users, five sample tickets with comments) so it isn't empty on first run. Log in at `localhost:3000` with:

| User | Email | Password |
|------|-------|----------|
| Demo user | `anna.petrova@example.com` | `helpdesk2023` |
| Demo user | `ivan.sidorov@example.com` | `helpdesk2023` |
| Django admin (`/admin/`) | `admin` | `admin12345` |

## API overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/api/login/` | Log in, get an auth token |
| POST | `/api/register/` | Register a new user |
| POST | `/api/check/` | Validate a token |
| GET | `/app/applications_list/` | List tickets |
| GET | `/app/application_details/{id}/` | Ticket details |
| POST | `/app/create_application/` | Create a ticket |
| POST | `/app/delete/{id}/` | Close a ticket |
| GET | `/app/comment_list/{id}/` | List comments on a ticket |
| POST | `/app/comment_create/{id}/` | Add a comment (with attachments) |
| POST | `/webhook/telegram/` | Telegram bot webhook |

## A note on the code

A few things are worth knowing before you dig in, so they read as intentional history rather than bugs:

- **Two Django settings modules**: there's a `settings.py` / `urls.py` at the root of `help-desk_backend-main/` and a second, more "textbook" copy under `Help_dasks/` (the name Django generated when the project was first created). `manage.py` and the local dev scripts use the root one; the Dockerfile and `docker-compose.yaml` point at `Help_dasks.settings` for the containerized setup. They drifted apart as the project evolved — I left both rather than merging them after the fact. One side effect: `profile/` also has an older, second registration/login view pair (expecting a nested `{"user": {...}}` body) left over from the same split — the frontend and the API docs above point at the endpoint that's actually wired up (`/api/register/`, `/api/auth/api/login/`).
- **All secrets are read from environment variables** (see `.env.template`) and nothing real is committed. An earlier version of this repo had a live Telegram bot token and an SSH key checked in by mistake; both have been revoked/rotated and scrubbed from the codebase.
- **`BASE_DIR` is off by one level**: it's computed as if `settings.py` lived one directory deeper than it does, so `db.sqlite3` (and `MEDIA_ROOT`) land next to `help-desk_backend-main/`, not inside it. Left as-is rather than "fixed" — just don't go looking for the database file in the backend folder.
- The Telegram bot logic and a set of manual test/demo scripts live at the root of `help-desk_backend-main/` alongside a `tests/` folder with the more structured Django test suite.
- **The Docker setup didn't actually boot** until a couple of small fixes: `Help_dasks/settings.py` listed a `"static"` entry in `INSTALLED_APPS` that isn't a real app (gunicorn crashed on import), and the database `HOST`/`NAME` didn't match the `postgres` service in `docker-compose.yaml` (hardcoded to `127.0.0.1` / `helpDesk` instead of `postgres` / `db_helpDesk`). Both are fixed now — this is the one place I corrected actual runtime behavior rather than just documenting a quirk, since "doesn't start" isn't really a quirk. There's no frontend container/service; run the React app with `npm start` alongside `docker compose up` for the API.
- **The root `Dockerfile` and `deploy/` folder are new**, written later than the rest of the project specifically to make it deployable as one image — unlike everything else here, I'm not pretending they're from 2023. They point at the root `settings.py`/`urls.py` (not `Help_dasks`), since that's the URL scheme the frontend actually speaks. `DEBUG = True` is hardcoded in that settings file regardless of environment, which the container inherits — fine for a portfolio demo, not something to expose as-is for anything real.

## License

No license file yet — treat this as source-available for reading, not for reuse without asking.

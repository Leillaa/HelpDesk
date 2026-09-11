"""
WSGI entrypoint for the single-container deploy image.

Not one of the project's original 2023 files — the repo has two
existing wsgi.py copies, but both hardcode DJANGO_SETTINGS_MODULE to
Help_dasks.settings, which uses a different URL scheme than the one
the frontend actually talks to (see the README's "A note on the code"
section). This mirrors what `manage.py` does instead: point at the
plain `settings` module at the root of help-desk_backend-main/, which
is what's actually wired up end to end.
"""
import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "settings")

application = get_wsgi_application()

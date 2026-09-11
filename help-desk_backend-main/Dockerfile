FROM python:3.11

ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY requirements.txt requirements.txt

RUN pip install --upgrade pip
RUN pip install -r requirements.txt

COPY . /app

CMD ["gunicorn", "Help_dasks.wsgi:application", "-w", "2", "-b", "0.0.0.0:8000", "--timeout", "120"]

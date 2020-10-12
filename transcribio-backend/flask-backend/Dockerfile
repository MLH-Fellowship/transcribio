FROM python:3.8-slim

ENV PYTHONUNBUFFERED True

ENV APP_HOME /app
WORKDIR $APP_HOME
COPY . ./

RUN apt-get install ffmpeg
RUN pip install -r requirements.txt

# TODO: set environment variables for credential files

CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 --timeout 0 app:app
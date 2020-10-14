FROM python:3.8

ENV PYTHONUNBUFFERED True

ENV APP_HOME /app
WORKDIR $APP_HOME
COPY . ./

RUN export GOOGLE_APPLICATION_CREDENTIALS="${APP_HOME}/creds/speechToText.json"

RUN apt-get -y update
RUN apt-get -y upgrade
RUN apt-get install -y ffmpeg
RUN CFLAGS="-Wno-narrowing" pip install cld2-cffi
RUN pip install -r requirements.txt


# TODO: set environment variables for credential files

CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 --timeout 0 app:app
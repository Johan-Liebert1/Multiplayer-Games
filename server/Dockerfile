FROM python:3.8-slim

ENV PYTHONUNBUFFERED 1

WORKDIR /src

COPY ./src .
COPY requirements.txt .

RUN pip3 install -r requirements.txt

CMD [ "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000" ]
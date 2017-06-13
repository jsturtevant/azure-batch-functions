FROM python:2.7.13-alpine

WORKDIR /usr/src/app
COPY ./processing/ .

RUN pip install -r requirements.txt

ENTRYPOINT ["python","processing.py"]

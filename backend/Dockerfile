FROM python:3.9-slim-bookworm
WORKDIR /app

RUN pip install uv

COPY backend/requirements.txt backend/requirements.txt
RUN uv pip install --system -r backend/requirements.txt

COPY . .

EXPOSE 8000
CMD ["python", "server.py"]

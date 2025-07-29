# Use official slim image
FROM python:3.11-slim

WORKDIR /app

COPY . .

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8080

# 👇 Production WSGI server — 1 worker is fine for free plan
CMD ["gunicorn", "-w", "1", "-b", "0.0.0.0:8080", "backend.app:app"]

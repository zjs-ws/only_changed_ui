FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && \
    apt-get install -y --no-install-recommends curl && \
    rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app.py .

COPY config.json \
     generation_config.json \
     tokenizer.json \
     tokenizer_config.json \
     chat_template.jinja \
     model.safetensors.index.json \
     /app/model/

COPY model-00001-of-00002.safetensors /app/model/
COPY model-00002-of-00002.safetensors /app/model/

ENV MODEL_PATH=/app/model
ENV PYTHONUNBUFFERED=1

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]

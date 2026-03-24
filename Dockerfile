# Streamable Dockerfile for RAG Component Generator
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Install Ollama and pull models
RUN curl -fsSL https://ollama.ai/install.sh | sh
RUN ollama serve & \
    sleep 10 && \
    ollama pull llama3 && \
    ollama pull embeddinggemma && \
    pkill ollama

# Copy application code
COPY . .

# Set Python path
ENV PYTHONPATH=/app

# Create non-root user
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

# Start command
CMD ["python3", "mcp_tools/streamable_mcp_server.py"]

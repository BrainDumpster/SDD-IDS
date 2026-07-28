# Self-contained Design Spec Collab image (no git clone on the server).
#
# Build from monorepo root:
#   docker build -f apps/design-spec-collab/Dockerfile -t design-spec-collab:latest .
#
# Or from apps/design-spec-collab:
#   docker compose -f docker-compose.yml build

FROM python:3.12-slim

WORKDIR /app

COPY apps/design-spec-collab/backend/requirements.txt /app/backend/requirements.txt
RUN pip install --no-cache-dir -r /app/backend/requirements.txt

COPY apps/design-spec-collab/backend /app/backend
COPY apps/design-spec-collab/frontend /app/frontend

# Replace host symlink with a real copy of the portal intake stack
RUN rm -rf /app/backend/portal_app
COPY apps/design-spec-portal/backend/app /app/backend/portal_app

# Bake design-system tree into the image (server needs no repo checkout)
COPY config /workspace/config
COPY components /workspace/components
COPY data /workspace/data
COPY .cursor/skills /workspace/.cursor/skills
COPY storybook /workspace/storybook
COPY storybook-generated /workspace/storybook-generated
COPY scripts /workspace/scripts
COPY generation /workspace/generation
COPY utils /workspace/utils
COPY validation /workspace/validation
COPY ingestion /workspace/ingestion
COPY docs /workspace/docs

# /workspace so `import ingestion` / `import config` work for Figma packaging
ENV PYTHONPATH=/app/backend:/workspace
ENV REPO_ROOT=/workspace
ENV APP_ROOT=/app
ENV CATALOGUE_SOURCE=local

EXPOSE 8091

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8091"]

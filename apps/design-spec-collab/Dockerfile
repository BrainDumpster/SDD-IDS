# Self-contained Design Spec Collab image (no git clone on the server).
#
# Build from monorepo root:
#   docker build -f apps/design-spec-collab/Dockerfile -t design-spec-collab:latest .
#
# Or from apps/design-spec-collab:
#   docker compose -f docker-compose.yml build

# --- Stage: Storybook static (Spec Accurate Design iframe preview) ---
FROM node:22-bookworm-slim AS storybook-build
WORKDIR /src
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

# Paths needed for Vite resolve (themes + component sources + generated stories)
COPY storybook/package.json storybook/pnpm-lock.yaml storybook/package-lock.json ./storybook/
COPY storybook ./storybook
COPY storybook-generated ./storybook-generated
COPY components ./components

WORKDIR /src/storybook
ENV STORYBOOK_BASE_PATH=/storybook/
ENV CI=1
ENV STORYBOOK_DISABLE_TELEMETRY=1
RUN pnpm install --frozen-lockfile \
  && pnpm exec storybook build -o /out/storybook-static

# --- Stage: Collab API + SPA ---
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

# Spec Accurate Design static preview (iframe under /storybook/)
COPY --from=storybook-build /out/storybook-static /app/storybook-static

# /workspace so `import ingestion` / `import config` work for Figma packaging
ENV PYTHONPATH=/app/backend:/workspace
ENV REPO_ROOT=/workspace
ENV APP_ROOT=/app
ENV CATALOGUE_SOURCE=local
ENV STORYBOOK_STATIC_DIR=/app/storybook-static

EXPOSE 8091

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8091"]

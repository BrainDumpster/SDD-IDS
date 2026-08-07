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

# Paths needed for Vite resolve (themes + component sources + generated stories + icons)
COPY storybook/package.json storybook/pnpm-lock.yaml storybook/package-lock.json ./storybook/
COPY storybook ./storybook
COPY storybook-generated ./storybook-generated
COPY components ./components
COPY assets ./assets

WORKDIR /src/storybook
ENV STORYBOOK_BASE_PATH=/storybook/
ENV COLLAB_STORYBOOK_SPEC_ONLY=1
ENV CI=1
ENV STORYBOOK_DISABLE_TELEMETRY=1
# Prefer lockfile when in sync; allow refresh when package.json gained/lost deps
# (Scratchpad is now a local `.storybook/manager.tsx`, not an npm addon.)
RUN pnpm install --no-frozen-lockfile \
  && pnpm exec storybook build -o /out/storybook-static

# --- Stage: Collab API + SPA ---
FROM python:3.12-slim

WORKDIR /app

COPY apps/design-spec-collab/backend/requirements.txt /app/backend/requirements.txt
RUN pip install --no-cache-dir -r /app/backend/requirements.txt

COPY apps/design-spec-collab/backend /app/backend
COPY apps/design-spec-collab/frontend /app/frontend
COPY apps/design-spec-collab/bridge /app/bridge

# Bake design-system tree into the image (server needs no repo checkout)
COPY config /workspace/config
COPY components /workspace/components
COPY data /workspace/data
COPY .cursor/skills /workspace/.cursor/skills
COPY storybook /workspace/storybook
COPY storybook-generated /workspace/storybook-generated
# Required for in-container Storybook rebuild (stories import ../../../../assets/icons/…)
COPY assets /workspace/assets
COPY scripts /workspace/scripts
COPY generation /workspace/generation
COPY utils /workspace/utils
COPY validation /workspace/validation
COPY ingestion /workspace/ingestion
COPY docs /workspace/docs

# Spec Accurate Design static preview (iframe under /storybook/)
COPY --from=storybook-build /out/storybook-static /app/storybook-static

# In-container Storybook rebuild after accept (Generate → Storybook tab).
# Install Node beside Python without clobbering pip's /usr/local layout.
COPY --from=storybook-build /usr/local/bin/node /opt/node/bin/node
COPY --from=storybook-build /usr/local/lib/node_modules /opt/node/lib/node_modules
ENV PATH="/opt/node/bin:${PATH}"
RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates libstdc++6 \
  && ln -sf /opt/node/lib/node_modules/corepack/dist/corepack.js /opt/node/bin/corepack \
  && chmod +x /opt/node/bin/node \
  && corepack enable \
  && corepack prepare pnpm@9.15.0 --activate \
  && rm -rf /var/lib/apt/lists/*
COPY --from=storybook-build /src/storybook/node_modules /workspace/storybook/node_modules

# /workspace so `import ingestion` / `import config` work for Figma packaging
ENV PYTHONPATH=/app/backend:/workspace
ENV REPO_ROOT=/workspace
ENV APP_ROOT=/app
ENV CATALOGUE_SOURCE=local
ENV STORYBOOK_STATIC_DIR=/app/storybook-static
ENV STORYBOOK_REBUILD_ENABLED=true

EXPOSE 8091

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8091"]

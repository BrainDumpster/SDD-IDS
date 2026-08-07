#!/usr/bin/env bash
# Run Design Spec Collab with plain `docker` (no Compose required).
#
# On the server (after docker load):
#   mkdir -p data
#   cp .env.example .env   # edit secrets
#   chmod +x run-container.sh
#   ./run-container.sh
#
# Optional:
#   COLLAB_IMAGE=design-spec-collab:1.0 COLLAB_HOST_PORT=8091 ./run-container.sh

set -euo pipefail

DIR="$(cd "$(dirname "$0")" && pwd)"
IMAGE="${COLLAB_IMAGE:-design-spec-collab:latest}"
NAME="${COLLAB_CONTAINER_NAME:-design-spec-collab}"
PORT="${COLLAB_HOST_PORT:-8091}"
ENV_FILE="${COLLAB_ENV_FILE:-$DIR/.env}"
DATA_DIR="${COLLAB_DATA_DIR:-$DIR/data}"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing env file: $ENV_FILE" >&2
  echo "Copy .env.example to .env and set PUBLIC_BASE_URL, FIGMA_TOKEN, GITHUB_*" >&2
  exit 1
fi

mkdir -p "$DATA_DIR"

# Stop previous container with the same name (if any)
if docker ps -a --format '{{.Names}}' | grep -qx "$NAME"; then
  echo "Removing existing container: $NAME"
  docker rm -f "$NAME" >/dev/null
fi

echo "Starting $NAME from $IMAGE on port $PORT…"
docker run -d \
  --name "$NAME" \
  --restart unless-stopped \
  -p "${PORT}:8091" \
  --env-file "$ENV_FILE" \
  -e REPO_ROOT=/workspace \
  -e DESIGN_SYSTEMS_DIR=/workspace/config/design_systems \
  -e JOBS_DIR=/app/data/jobs \
  -e SESSIONS_DIR=/app/data/sessions \
  -e COLLAB_SESSIONS_DIR=/app/data/collab_sessions \
  -e AUDIT_LOG_PATH=/app/data/audit/audit.jsonl \
  -v "${DATA_DIR}:/app/data" \
  "$IMAGE"

echo
echo "Container: $NAME"
docker ps --filter "name=^/${NAME}$"
echo
echo "Health:  curl -s http://127.0.0.1:${PORT}/health"
echo "Logs:    docker logs -f $NAME"
echo "Stop:    docker rm -f $NAME"

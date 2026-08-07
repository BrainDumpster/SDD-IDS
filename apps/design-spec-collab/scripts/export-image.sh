#!/usr/bin/env bash
# Build a self-contained collab image locally and export it for a server
# that has Docker but no git clone of this repo.
#
# Usage (from monorepo root OR apps/design-spec-collab):
#   ./apps/design-spec-collab/scripts/export-image.sh
#   ./apps/design-spec-collab/scripts/export-image.sh design-spec-collab:1.0
#   COLLAB_IMAGE=ghcr.io/myorg/design-spec-collab:1.0 ./apps/design-spec-collab/scripts/export-image.sh --push
#
# Then on the server (tar path):
#   gunzip -c design-spec-collab-image.tar.gz | docker load
#   # copy docker-compose.deploy.yml + .env + mkdir data
#   docker compose -f docker-compose.deploy.yml up -d

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
TAG="${1:-${COLLAB_IMAGE:-design-spec-collab:latest}}"
PUSH=0
if [[ "${1:-}" == "--push" ]]; then
  PUSH=1
  TAG="${COLLAB_IMAGE:-design-spec-collab:latest}"
elif [[ "${2:-}" == "--push" ]]; then
  PUSH=1
fi

OUT="${ROOT}/apps/design-spec-collab/design-spec-collab-image.tar.gz"

echo "Building ${TAG} (context=${ROOT})…"
docker build \
  -f "${ROOT}/apps/design-spec-collab/Dockerfile" \
  -t "${TAG}" \
  "${ROOT}"

echo "Verifying Storybook static is baked into ${TAG}…"
docker run --rm "${TAG}" sh -c \
  'test -f /app/storybook-static/index.html && test -f /app/storybook-static/iframe.html && echo OK_storybook_static'

if [[ "${PUSH}" -eq 1 ]]; then
  echo "Pushing ${TAG}…"
  docker push "${TAG}"
  echo "Pushed. On server: export COLLAB_IMAGE=${TAG} COLLAB_PULL_POLICY=always"
  echo "  docker compose -f docker-compose.deploy.yml pull && docker compose -f docker-compose.deploy.yml up -d"
  exit 0
fi

echo "Saving ${TAG} → ${OUT}"
docker save "${TAG}" | gzip > "${OUT}"
ls -lh "${OUT}"
echo
echo "Copy to server, then:"
echo "  gzip -t design-spec-collab-image.tar.gz"
echo "  gzip -dc design-spec-collab-image.tar.gz > design-spec-collab-image.tar"
echo "  docker load -i design-spec-collab-image.tar"
echo "  # Do NOT use docker import"
echo "  # also scp docker-compose.deploy.yml .env.example → fill .env, mkdir -p data"
echo "  COLLAB_IMAGE=${TAG} docker compose -f docker-compose.deploy.yml up -d"

#!/usr/bin/env bash
# Build Storybook static assets for Design Spec Collab preview (/storybook/).
# From monorepo root:
#   ./apps/design-spec-collab/scripts/build_collab_storybook_static.sh
#
# Output default: apps/design-spec-collab/storybook-static
# Point the API at it with:
#   export STORYBOOK_STATIC_DIR=.../apps/design-spec-collab/storybook-static

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
OUT="${STORYBOOK_STATIC_OUT:-$ROOT/apps/design-spec-collab/storybook-static}"
SB="$ROOT/storybook"

cd "$SB"
export CI=1
export STORYBOOK_DISABLE_TELEMETRY=1
if command -v pnpm >/dev/null 2>&1; then
  pnpm install --frozen-lockfile
  STORYBOOK_BASE_PATH=/storybook/ pnpm exec storybook build -o "$OUT"
elif command -v npm >/dev/null 2>&1; then
  npm ci || npm install
  STORYBOOK_BASE_PATH=/storybook/ npx storybook build -o "$OUT"
else
  echo "Need pnpm or npm to build Storybook static" >&2
  exit 1
fi

echo "Wrote $OUT"
echo "Set STORYBOOK_STATIC_DIR=$OUT when running Collab locally."

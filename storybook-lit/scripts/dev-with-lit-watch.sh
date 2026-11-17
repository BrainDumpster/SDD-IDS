#!/usr/bin/env bash
# Start Rollup watch for @ids/core, then Storybook. Ctrl+C stops both.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
LIT_PKG="$(cd "$ROOT/../../lib/lit/ids" && pwd)"

cleanup() {
  if [[ -n "${WATCH_PID:-}" ]] && kill -0 "$WATCH_PID" 2>/dev/null; then
    kill "$WATCH_PID" 2>/dev/null || true
    wait "$WATCH_PID" 2>/dev/null || true
  fi
}
trap cleanup EXIT INT TERM

# Initial build so dist exists before Storybook consumers resolve package exports
(cd "$LIT_PKG" && npm run build)

(cd "$LIT_PKG" && npm run build:watch) &
WATCH_PID=$!

fuser -k 6008/tcp 2>/dev/null || true
# Drop stale Vite optimize-deps hashes (DocsRenderer-*-XXXX.js 404s)
rm -rf "$(cd "$ROOT/.." && pwd)/node_modules/.cache/storybook"
exec npx storybook dev -p 6008 --ci

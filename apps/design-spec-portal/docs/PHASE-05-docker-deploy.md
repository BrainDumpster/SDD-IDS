# Phase 5 — Docker / hosted deploy

**Goal:** Production-ready container for the **portal only**. Agents stay on Cursor Cloud (or dry-run).

## Status

Compose + Dockerfile work for local smoke tests. See root [README.md](../README.md) **Docker** section for build/run commands.

## Checklist

- [x] `Dockerfile` (Python 3.12 + uvicorn)
- [x] `docker compose` with monorepo mount + writable `./data`
- [x] Healthcheck on `/health`
- [ ] Horizontal scale / shared job store (Redis/Postgres) for multi-replica
- [ ] Secrets via orchestrator secret store (not baked into image)
- [ ] Reverse proxy + TLS
- [ ] Real SSO (replace auth placeholder)

## Image notes

- Build context is `apps/design-spec-portal/` only — monorepo is **not** copied into the image; it is mounted at runtime as `/workspace`.
- Do not put `.env` in the image (`.dockerignore` excludes it). Pass via `env_file` / `-e` / secret manager.

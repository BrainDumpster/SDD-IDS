# Phase 3 — Cursor Cloud agent + Figma MCP

**Goal:** On job submit, start a **Cursor Cloud** agent with inline Figma MCP and the prompt package from Phase 2.

## Status: Implemented

## Deliverables

- [x] `cursor-sdk` (Python) wired in `services/agent_runner.py`
- [x] `Agent.create` + cloud repos + `mcpServers.figma` (HTTP Bearer `FIGMA_TOKEN`)
- [x] `auto_create_pr=False` (Phase 4 enables PR)
- [x] Background thread: `pending` → `running` → `finished` | `error`
- [x] Persist `agent_id`, `run_id`, `result_summary`, `error_message`
- [x] Distinguish startup `CursorAgentError` vs run `status=error`
- [x] `CLOUD_AGENT_DRY_RUN` for local UI testing without keys
- [x] `POST /api/v1/intake/jobs/{id}/run` to retry / start manually
- [x] Frontend polls job status while running

## Env

| Variable | Required | Notes |
|----------|----------|-------|
| `CURSOR_API_KEY` | yes* | Dashboard → Integrations |
| `CLOUD_REPO_URL` | yes* | GitHub/Git URL Cursor can clone |
| `FIGMA_TOKEN` | yes* | Bearer for Figma MCP |
| `CLOUD_STARTING_REF` | no | default `main` |
| `CURSOR_MODEL` | no | default `composer-2.5` |
| `FIGMA_MCP_URL` | no | default `https://api.figma.com/mcp` |
| `CLOUD_AGENT_AUTO_START` | no | default `true` |
| `CLOUD_AGENT_DRY_RUN` | no | `true` = fake finish without Cursor |
| `CLOUD_AUTO_CREATE_PR` | no | keep `false` until Phase 4 |

\* Not required when `CLOUD_AGENT_DRY_RUN=true`.

## Local dry-run

```bash
export CLOUD_AGENT_DRY_RUN=true
PYTHONPATH=. REPO_ROOT="$(cd ../.. && pwd)" uvicorn backend.app.main:app --reload --port 8090
```

## Real cloud run

```bash
export CLOUD_AGENT_DRY_RUN=false
export CURSOR_API_KEY=cursor_...
export CLOUD_REPO_URL=https://github.com/org/SDD-IDS
export FIGMA_TOKEN=figd_...
export CLOUD_STARTING_REF=main
```

## Acceptance

1. Form → confirm → job → agent starts (`running`) → `finished` or `error`.
2. Dry-run finishes without API keys.
3. Missing env → job `error` with missing var names (or `400` on `/run`).
4. Startup failures labeled `CursorAgentError (startup): …`.

## Next

→ [PHASE-04-pr-and-zip.md](PHASE-04-pr-and-zip.md)

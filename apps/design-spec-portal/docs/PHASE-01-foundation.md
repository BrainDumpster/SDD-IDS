# Phase 1 — Foundation

**Goal:** Runnable portal with form + API that validates intake fields and **routes** to the correct skill. No Cursor agent, no PR, no zip yet.

## Deliverables (this phase)

- [x] Folder layout under `apps/design-spec-portal/`
- [x] Pydantic models matching wizard fields
- [x] Programme discovery from `config/design_systems/*.yaml`
- [x] Skill router: IDS-native / standalone / inheritance
- [x] `POST /api/v1/intake/preview` — dry-run summary (slug, paths, skill)
- [x] Static form UI
- [x] `.env.example`, `docker-compose.yml` skeleton
- [x] Phase docs 2–5 (planned only)

## Acceptance criteria

1. Submitting IDS + component + ≥1 main Figma URL with `node-id` returns `skillRoute: design-spec-intake-wizard`, `specPattern: ids-native`.
2. Submitting `dap` + `inheritsIds: yes` returns `skillRoute: design-spec-programme-inheritance`, `specPattern: ids-fork`.
3. Submitting `synapse` + `inheritsIds: no` returns intake / `standalone`.
4. URL without `node-id` → `400` with clear error.
5. Unknown programme → `400`.

## Out of scope

Agent calls, Figma MCP, GitHub PR, zip, auth, job queue.

## How to verify

```bash
cd apps/design-spec-portal
pip install -r backend/requirements.txt
uvicorn backend.app.main:app --reload --port 8090
curl -s http://localhost:8090/api/v1/programmes | jq
# use the form or POST /api/v1/intake/preview
```

## Next

→ [PHASE-02-intake-api.md](PHASE-02-intake-api.md)

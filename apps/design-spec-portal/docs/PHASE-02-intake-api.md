# Phase 2 — Intake API harden

**Goal:** Production-shaped intake: persist sessions, resolve design-system paths, build the **agent prompt package** (still no live agent).

## Status: Implemented

## Deliverables

- [x] Persist intake sessions under `data/design-spec-intake/sessions/` (YAML)
- [x] Job JSON under `apps/design-spec-portal/data/jobs/` (survives restart)
- [x] Resolve programme yaml paths + alias_path slug lookup
- [x] `mapEntrySketch` on preview + prompt package
- [x] `POST /api/v1/intake/jobs` → `status: pending` + `jobId`
- [x] `GET /api/v1/intake/jobs/{id}` + `GET /api/v1/intake/jobs`
- [x] `AgentPromptPackage` (skill path, confirmed JSON, checklist, prompt_text)
- [x] Frontend confirm checkbox before Create job
- [x] `inheritsIds: unknown` (unresolved) cannot create a job

## Acceptance criteria

1. Job JSON survives process restart (`data/jobs/<uuid>.json`).
2. Prompt package skill path matches inheritance vs intake routing.
3. Unresolved `inheritsIds=unknown` → `400` on create job.

## API

```http
POST /api/v1/intake/jobs
{ "intake": { …IntakeRequest }, "confirmed": true }

GET /api/v1/intake/jobs/{jobId}
GET /api/v1/intake/jobs?limit=50
```

## Out of scope

Calling Cursor Cloud agent (Phase 3).

## Next

→ [PHASE-03-cloud-agent.md](PHASE-03-cloud-agent.md)

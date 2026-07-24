# Design Spec Portal

Hosted intake UI + API that collects **design-spec-intake-wizard** fields, routes **IDS-native / programme-standalone / programme-inheritance**, then runs a **Cursor Cloud agent** to write the spec (PR + zip in Phase 4).

This app lives under `apps/design-spec-portal/` and does **not** replace IDE skills — it drives the same workflows programmatically.

## Architecture

```text
Browser form  →  Portal API (Docker or local)
                    ├─ validate + route skill (backend)
                    ├─ Cursor Cloud Agent + Figma MCP
                    ├─ autoCreatePR → GitHub PR   (Phase 4)
                    └─ zip artifacts from PR branch (Phase 4)
```

| Concern | Where |
|---------|--------|
| Collect fields | Frontend form |
| Inheritance vs standalone vs IDS | Backend `services/skill_router.py` |
| Spec authoring + Figma MCP | Cursor Cloud agent |
| Guardrails | [docs/GUARDRAILS.md](docs/GUARDRAILS.md) |

## Phases

| Phase | Status | Doc |
|-------|--------|-----|
| **1 — Foundation** | Implemented | [docs/PHASE-01-foundation.md](docs/PHASE-01-foundation.md) |
| **2 — Intake harden** | Implemented | [docs/PHASE-02-intake-api.md](docs/PHASE-02-intake-api.md) |
| **3 — Cloud agent** | Implemented | [docs/PHASE-03-cloud-agent.md](docs/PHASE-03-cloud-agent.md) |
| **Guardrails** | Implemented (+ auth placeholder) | [docs/GUARDRAILS.md](docs/GUARDRAILS.md) |
| **4 — PR + zip** | Implemented | [docs/PHASE-04-pr-and-zip.md](docs/PHASE-04-pr-and-zip.md) |
| **5 — Docker deploy** | In progress (compose works) | [docs/PHASE-05-docker-deploy.md](docs/PHASE-05-docker-deploy.md) |

---

## What you must set (env)

Copy the example file first:

```bash
cd apps/design-spec-portal
cp .env.example .env
```

Edit `.env`. **Never commit `.env`.**

### Minimum for UI / dry-run (recommended first test)

| Variable | Example | Why |
|----------|---------|-----|
| `CLOUD_AGENT_DRY_RUN` | `true` | No Cursor Cloud call; still exercises form → job → finish |
| `AUTH_MODE` | `disabled` | Open access until SSO |
| `CLOUD_REPO_URL` | `https://github.com/teddygraham/SDD-IDS.git` | Repo lock + prompt context (optional in dry-run) |
| `ALLOWED_CLOUD_REPO_URLS` | same as `CLOUD_REPO_URL` | Allowlist for repo lock |

Docker compose sets `REPO_ROOT`, `JOBS_DIR`, etc. for you (see below). You usually **do not** set those in `.env` for Docker.

### Required for a real Cursor Cloud run

| Variable | Where to get it |
|----------|-----------------|
| `CLOUD_AGENT_DRY_RUN=false` | — |
| `CURSOR_API_KEY` | [Cursor Dashboard → Integrations](https://cursor.com/dashboard/integrations) |
| `CLOUD_REPO_URL` | Git HTTPS URL Cursor can clone (this repo: `https://github.com/teddygraham/SDD-IDS.git`) |
| `FIGMA_TOKEN` | Figma personal access token (Bearer for Figma MCP) |
| `CLOUD_STARTING_REF` | Branch base, e.g. `master` (this repo’s default) or `main` |
| `ALLOWED_CLOUD_REPO_URLS` | Same URL(s), comma-separated |

Optional: `CURSOR_MODEL` (default `composer-2.5`), `FIGMA_MCP_URL`, `CLOUD_AGENT_AUTO_START`, `AUTH_MODE=placeholder` (+ Actor field in UI).

### Phase 4 — PR + artifact zip

| Variable | Example | Why |
|----------|---------|-----|
| `CLOUD_AUTO_CREATE_PR` | `true` | Cursor Cloud opens a PR; dry-run shows a sample PR URL |
| `GITHUB_TOKEN` | `ghp_…` / fine-grained PAT | Fallback PR create/find + zip file fetch from branch |
| `GITHUB_OWNER` / `GITHUB_REPO` | optional | Override when `CLOUD_REPO_URL` is not github.com |

After a finished job: open the **PR** link and/or **Download zip** (`GET /api/v1/intake/jobs/{id}/artifacts.zip`). Dry-run zips include `MANIFEST.txt` and a placeholder or local `design-spec.md` when present.

---

## Run locally (without Docker)

```bash
cd apps/design-spec-portal
cp -n .env.example .env
# set CLOUD_AGENT_DRY_RUN=true for a safe first pass

uv venv .venv && source .venv/bin/activate
uv pip install -r backend/requirements.txt

PYTHONPATH=. REPO_ROOT="$(cd ../.. && pwd)" \
  uvicorn backend.app.main:app --reload --port 8090
```

Open http://localhost:8090 → Preview → confirm → Create job.

Check health: http://localhost:8090/health

---

## Docker — prepare image and run

The image packages **only the portal** (API + static UI). Agents still run on **Cursor Cloud** (or dry-run inside the container process). The monorepo is **mounted read-only** so programmes / skills resolve for prompts.

### 1. Prerequisites

- Docker Engine + Docker Compose v2
- From this folder: `apps/design-spec-portal`
- A `.env` file (see above)

### 2. Build the image

```bash
cd apps/design-spec-portal

# Build (tags as design-spec-portal-portal by compose project name)
docker compose build

# Or build + tag explicitly
docker build -t design-spec-portal:local .
```

### 3. Run with Compose (recommended)

```bash
cd apps/design-spec-portal

# Dry-run smoke (default in compose if unset)
CLOUD_AGENT_DRY_RUN=true docker compose up --build

# Detached (use another host port if 8090 is busy)
CLOUD_AGENT_DRY_RUN=true PORTAL_HOST_PORT=8091 docker compose up --build -d
```

Compose will:

| Mount / setting | Purpose |
|-----------------|---------|
| `../..` → `/workspace:ro` | Monorepo (`config/design_systems`, `.cursor/skills`, …) |
| `./data` → `/app/data` | Writable jobs, sessions, audit |
| Port `8090` | UI + API |
| `env_file: .env` | Loads your secrets / flags |

Then:

- UI: http://localhost:8090  
- Health: http://localhost:8090/health  
- Audit: http://localhost:8090/api/v1/audit  

Stop:

```bash
docker compose down
```

### 4. Run the image without Compose

```bash
cd apps/design-spec-portal
docker build -t design-spec-portal:local .

docker run --rm -p 8090:8090 \
  --env-file .env \
  -e REPO_ROOT=/workspace \
  -e DESIGN_SYSTEMS_DIR=/workspace/config/design_systems \
  -e JOBS_DIR=/app/data/jobs \
  -e SESSIONS_DIR=/app/data/sessions \
  -e AUDIT_LOG_PATH=/app/data/audit/audit.jsonl \
  -e CLOUD_AGENT_DRY_RUN=true \
  -v "$(cd ../.. && pwd):/workspace:ro" \
  -v "$(pwd)/data:/app/data" \
  design-spec-portal:local
```

### 5. Quick verify after start

```bash
curl -s http://localhost:8090/health | python3 -m json.tool
curl -s http://localhost:8090/api/v1/programmes | python3 -m json.tool
```

Expect `phase: "4"`, `cloudAgentDryRun: true` (if dry-run), and programmes including `ids` / `dap` / `synapse`.

Check that `CLOUD_STARTING_REF` exists on the repo (needs `GITHUB_TOKEN`):

```bash
curl -s http://localhost:8090/health | python3 -c 'import sys,json; h=json.load(sys.stdin); print(h.get("cloudStartingRefStatus"))'
curl -s http://localhost:8090/api/v1/github/branches | python3 -m json.tool
```

Look for `startingRefExists: true` and that `master` (or your ref) appears under `branches`.

### 6. Real cloud run in Docker

In `.env`:

```bash
CLOUD_AGENT_DRY_RUN=false
CURSOR_API_KEY=cursor_...
FIGMA_TOKEN=figd_...
CLOUD_REPO_URL=https://github.com/teddygraham/SDD-IDS.git
ALLOWED_CLOUD_REPO_URLS=https://github.com/teddygraham/SDD-IDS.git
CLOUD_STARTING_REF=master   # or main — match your default branch
AUTH_MODE=disabled
```

Then:

```bash
docker compose up --build
```

Confirm `/health` shows `cloudAgentConfigured: true` and `cloudAgentMissing: []`.

---

## Skill mapping

| Form / API field | Wizard step |
|------------------|-------------|
| `programme` | 1 |
| `componentDisplayName` | 2 |
| `inheritsIds` | 3 (`yes` / `no` / `unknown`; skipped for `ids`) |
| `category` | 4 optional |
| `mainUrls` | 5 |
| `elementUrls` | 6 |
| `stateUrls` | 7 |
| `storybookExamples` | 8 |
| `themeFoundation` / `themeReuseProgramme` / `variablesLibraryUrl` | New programme only: reuse IDS (default) or another programme’s theme+root-spec, or generate from Figma variables library |
| `additionalNotes` | optional design/context (not a wizard step; validated + UNTRUSTED in prompt) |
| confirm | 9 |

Backend sets `skillRoute` + `specPattern`:

- `ids` → `design-spec-intake-wizard` / `ids-native`
- programme + `inheritsIds=no` → intake / `standalone`
- programme + `inheritsIds=yes` → **design-spec-programme-inheritance** / `ids-fork`
- `unknown` → blocked until yes/no or `sameAnatomyAsIds`

## Repo paths the agent uses

- Skills: `.cursor/skills/design-spec-intake-wizard/SKILL.md`, `.cursor/skills/design-spec-programme-inheritance/SKILL.md`
- Programmes: `config/design_systems/*.yaml`
- Specs: `components/<programme-dir>/<slug>/design-spec.md`

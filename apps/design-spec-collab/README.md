# Design Spec Collab (POC)

Dual-agent collaboration for design-spec **generate** and **update**:

1. **Dashboard home** — list programmes/components (local `components/` tree, or GitHub when configured). **Generate Spec** is always available; **Update** after selecting a component.
2. **Generate / Update pages** — forms with Back; same session URL flow.
3. **Server** packs Figma evidence (`FIGMA_MODE=rest` + `FIGMA_TOKEN`) **and a read-only context pack** (theme CSS, root-spec, programme yaml, map entry, authoring-contract excerpt; update baselines when applicable).
4. **Client agent** pastes the session URL once and writes artifacts with its **LLM only** — **no local filesystem search**, **no client Figma auth / MCP**. Supporting files come from `context_artifacts` in `/work`.
5. Server **rule-reviews** (optional Ollama soft check). On accept → GitHub PR + zip.

Operator UI may subscribe to **SSE** (`GET /api/v1/intake/jobs/{id}/events`) for live transcript; the client loop stays claim → `/work` → `/result`.

Collab prompt packages override “Live Figma MCP” checklist items so the client does not trigger Figma Authenticate. IDE skills / portal Cloud agents are unchanged.

**Deploy (build / push / run on a server without git clone):** see [`docs/design-spec-collab-deploy.md`](../../docs/design-spec-collab-deploy.md).

## Quick start (Docker — recommended)

The image is **self-contained**: `components/`, maps, programme yaml, skills, and Storybook trees are baked in. The server does **not** need a git clone.

### Build on your laptop

```bash
# From monorepo root — builds + writes design-spec-collab-image.tar.gz
./apps/design-spec-collab/scripts/export-image.sh design-spec-collab:1.0

# Or Compose on the build machine
cd apps/design-spec-collab && cp .env.example .env && docker compose build && docker compose up -d
```

### Deploy to server (no git clone)

**A) Copy tar (no registry)**

```bash
# Laptop → server
scp apps/design-spec-collab/design-spec-collab-image.tar.gz \
    apps/design-spec-collab/docker-compose.deploy.yml \
    apps/design-spec-collab/.env.example \
    user@server:~/collab/

# On server
cd ~/collab
gzip -t design-spec-collab-image.tar.gz
gzip -dc design-spec-collab-image.tar.gz > design-spec-collab-image.tar
docker load -i design-spec-collab-image.tar   # not docker import
cp .env.example .env   # PUBLIC_BASE_URL, FIGMA_TOKEN, GITHUB_*
mkdir -p data
COLLAB_IMAGE=design-spec-collab:1.0 docker compose -f docker-compose.deploy.yml up -d
curl -s http://127.0.0.1:8091/health
```

**B) Registry push/pull**

```bash
export COLLAB_IMAGE=ghcr.io/YOUR_ORG/design-spec-collab:1.0
./apps/design-spec-collab/scripts/export-image.sh --push
# Server: scp only docker-compose.deploy.yml + .env
COLLAB_PULL_POLICY=always docker compose -f docker-compose.deploy.yml pull && \
  docker compose -f docker-compose.deploy.yml up -d
```

Only `./data` is mounted on the server (jobs/sessions). When specs/maps change, rebuild and redeploy the image.

Production: HTTPS reverse proxy; `PUBLIC_BASE_URL` = public origin; `STUB_FORCE_REVISE_ONCE=false`; `GITHUB_PUBLISH_DRY_RUN=false`.

### Simulate the client

```bash
python3 apps/design-spec-collab/scripts/simulate_client.py 'http://127.0.0.1:8091/s/SESSION_ID?t=TOKEN'
```

## Quick start (local venv, no Docker)

```bash
cd apps/design-spec-collab
cp .env.example .env

# Reuse portal venv (or create your own)
uv pip install --python ../design-spec-portal/.venv/bin/python -r backend/requirements.txt

cd backend
../design-spec-portal/.venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8091 --reload
```

Open http://127.0.0.1:8091 — dashboard → Generate or Update → preview → confirm → **Start session** → **Copy session URL**.

### Stop the server

**Local uvicorn (CLI):** in the terminal where the server is running, press **Ctrl+C** (uvicorn prints `Press CTRL+C to quit`).

If that terminal is gone or Ctrl+C does not stop it:

```bash
# Find and stop whatever is listening on 8091
lsof -t -i:8091 | xargs -r kill
# If it still hangs:
lsof -t -i:8091 | xargs -r kill -9
```

**Docker Compose:**

```bash
cd apps/design-spec-collab && docker compose down
# Deploy compose file on a server:
# docker compose -f docker-compose.deploy.yml down
```

### Real PR

In `.env`:

```bash
GITHUB_PUBLISH_DRY_RUN=false
GITHUB_TOKEN=ghp_...
GITHUB_REPO_URL=https://github.com/org/repo.git
GITHUB_STARTING_REF=master
AUTO_CREATE_PR=true
```

## Architecture

```text
dashboard → generate|update form
     → server Figma pack (REST) + context_artifacts
     → session_url (once)
              │
              ▼
     client polls /work ⇄ POST /result   ← LLM only (no FS / no Figma)
              │
     server rule review (+ optional Ollama soft) accept | revise
              │
     on accept → GitHub branch+PR + zip

operator UI ← optional SSE /events (progress only)
```

### LLM-only client + context pack

- `/work` includes `context_artifacts` (theme, root-spec, yaml, map, contract excerpt; donors when foundation is missing).
- `clientGuidance.forbidLocalFilesystem=true` — client must not glob/read the workspace.
- Foundation **write** requests are omitted when those files already exist on the server (they are shipped read-only instead).
- Optional `SERVER_REVIEW_MODE=ollama` is a **soft quality check only** — never authors `design-spec.md`. Default remains `rules`.

### Catalogue

- `GET /api/v1/update/programmes`
- `GET /api/v1/update/programmes/{programme}/components`
- `GET /api/v1/update/programmes/{programme}/components/{slug}/bundle.zip` — download a **portable handoff zip** for an existing catalogue component (no collab session required). Includes design-spec source-of-truth files (themes, root-specs, nested composition dependency specs), Spec Accurate Design stories under `storybook-generated/`, Storybook reference sources when present, referenced icons, and `HANDOFF_MANIFEST.json`. Nested deps are resolved from path links in specs/maps (e.g. checkbox referenced by dropdown-multiselect). **IDS-fork / inherited deltas** also pull the baseline source component (`idsBaselineSpecPath`) with its supporting files, examples, `components/ids/root-spec.md`, and `ids-theme.css` alongside the programme delta + programme theme/root-spec.
- Default source: local `components/*/…/design-spec.md` (set `CATALOGUE_SOURCE=github` to force GitHub tree).
- Map enrichment from `data/*-component-figma-map.json` / yaml `figma_map_path`.
- Dashboard home: after selecting programme + component, use **Download bundle** (next to **Update**).

### Fidelity / robustness

- Packaging **fails the job** if Main Figma nodes all error (auth / access / bad node-id) — no weak client sessions.
- Evidence includes `completeness`, larger caps, and `boundVariableHints` / `tokenHints` on slot geometry.
- Session markdown + **Copy client prompt** spell out authoring checklist (slot geometry, Source Mapping, semantic tokens).
- Server review gates Slot geometry, Source Mapping, Codegen depth, and Storybook title/theme when Storybook is requested.
- Operator can **Download evidence** (`GET /api/v1/intake/jobs/{id}/figma-evidence`) and **Copy client prompt** (`…/client-prompt.md`).

### Popup selects

Programme/component pickers use IDS Dropdown single-select chrome (theme CSS from `/theme/ids-theme.css` or the programme theme when available).

### Security

- Session URL includes an unguessable `t=` access token (`401` without it).
- Optional first-client **claim** (`SESSION_REQUIRE_CLAIM=true`).
- TTL via `SESSION_TTL_HOURS`.
- Writes only to `write_path_allowlist` paths from the prompt package.

### Env

See [`.env.example`](.env.example).

| Var | Meaning |
|-----|---------|
| `SERVER_REVIEW_MODE` | `rules` (default) or `ollama` soft check only |
| `OLLAMA_HOST` / `OLLAMA_MODEL` | Used only when `SERVER_REVIEW_MODE=ollama` |
| `PUBLIC_BASE_URL` | Absolute session URLs |
| `FIGMA_MODE` | `rest` (recommended), `stub`, or `mcp` |
| `FIGMA_TOKEN` | Figma PAT for **server** REST packaging |
| `CATALOGUE_SOURCE` | `auto` (default, local first), `local`, or `github` |
| `GITHUB_PUBLISH_DRY_RUN` | `true` for local demo without GitHub writes |
| `AUTO_CREATE_PR` | Run publish after accept |

### Reuse

- Frontend SPA (hash routes `#/`, `#/generate`, `#/update?…`).
- Backend imports portal models/services via `backend/portal_app` → symlink to portal `app`.

Portal itself is unchanged for v1 (create Cloud path still uses live Figma MCP).

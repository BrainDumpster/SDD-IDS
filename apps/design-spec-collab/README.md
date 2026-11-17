# Design Spec Collab (POC)

Dual-agent collaboration for design-spec **generate** and **review revise**:

1. **Dashboard home** — list programmes/components (local `components/` tree, or GitHub when configured). **Generate Spec** for new work; **Update Spec** for catalogue components (new `update/…` branch + PR); **Review PRs** to preview/revise existing Collab PRs in place.
2. **Generate** / **Update** / **Review → Revise on this PR** — same Bridge session URL flow (Review publishes back onto the selected PR branch; Update always opens a **new** PR).
3. **Server** packs Figma evidence (`FIGMA_MODE=rest` + `FIGMA_TOKEN`) **and a read-only context pack** (theme CSS, root-spec, programme yaml, map entry, authoring-contract excerpt; **existing** `storybook/src/components/<Pascal>.*` + stories when present; catalogue/PR-head baselines). Catalogue Update skips Figma pack when the prompt does not ask to recheck design and no extra URLs are provided.
4. **Client agent** pastes the session URL once and writes artifacts with its **LLM only** — **no local filesystem / monorepo**, **no client Figma auth / MCP**, **no Storybook gate scripts**. Supporting files come from `context_artifacts` in `/work` (including existing runtime components when the server finds them). When Storybook is requested, submit **runtime component + CSS module + Spec Accurate Design CSF** as session artifacts (stories import the module — not an inline div mock).
5. Server **rule-reviews** (optional Ollama soft check). On accept → GitHub PR (new for Generate/Update; same branch for Review) + zip.

Operator UI may subscribe to **SSE** (`GET /api/v1/intake/jobs/{id}/events`) for live transcript; the client loop stays claim → `/work` → `/result`.

Collab prompt packages override “Live Figma MCP” checklist items so the client does not trigger Figma Authenticate. IDE skills / portal Cloud agents are unchanged.

**Deploy (build / push / run on a server without git clone):** see [`docs/design-spec-collab-deploy.md`](../../docs/design-spec-collab-deploy.md).

## Quick start (Docker — recommended)

The image is **self-contained**: `components/`, maps, programme yaml, skills, Storybook static, and the Bridge script are baked in. Runtime needs only Docker + a `.env` (secrets and toggles). Jobs/sessions persist under `./data`.

### 1. Configure `.env`

```bash
cd apps/design-spec-collab
cp .env.example .env
# Edit .env — at minimum set:
#   FIGMA_TOKEN=figd_...     # Figma PAT with File content Read
#   PUBLIC_BASE_URL=http://127.0.0.1:8091
# Optional: GITHUB_* for real PRs (set GITHUB_PUBLISH_DRY_RUN=false)
```

See [`.env.example`](.env.example) for the full list.

### 2. How `.env` is passed into Docker

[`docker-compose.yml`](docker-compose.yml) loads secrets two ways (both are intentional):

| Mechanism | What it does |
|-----------|----------------|
| `env_file: .env` | Injects **every** key from `./.env` into the container |
| `environment:` + `${VAR}` | Compose **interpolates** selected vars from the **host** shell / project `.env` when composing the service (overrides / defaults) |

**Default (recommended):** keep `apps/design-spec-collab/.env` next to the compose file. Compose picks it up automatically for both interpolation and `env_file`.

```bash
cd apps/design-spec-collab
docker compose up -d
# → uses ./ .env via env_file + ${FIGMA_TOKEN} etc.
```

**Use a different env file** (do not commit secrets):

```bash
cd apps/design-spec-collab

# A) Point Compose project env (interpolation) + tell the service which file to mount
docker compose --env-file ./my-secrets.env -f docker-compose.yml up -d

# B) Or symlink / copy into place
cp /path/to/collab.prod.env .env
docker compose up -d
```

If you use `--env-file` for Compose interpolation **and** want the container to receive the same file via `env_file`, either:

- name/copy it to `.env` in this directory, **or**
- temporarily edit `env_file:` in compose, **or**
- pass overrides on the CLI (below).

**Override individual variables** without editing the file:

```bash
cd apps/design-spec-collab
FIGMA_TOKEN=figd_... PUBLIC_BASE_URL=http://127.0.0.1:8091 \
  docker compose up -d

# Host port mapping (container always listens on 8091)
COLLAB_HOST_PORT=8092 docker compose up -d
# → http://127.0.0.1:8092
```

**Plain `docker run` (without Compose)** — pass `.env` with `--env-file` and mount writable `data` (+ certs if needed):

```bash
# From monorepo root (after image is built/loaded as design-spec-collab:latest)
cd /path/to/SDD-IDS   # or wherever the image + apps/design-spec-collab live
mkdir -p apps/design-spec-collab/data apps/design-spec-collab/certs

docker run --name design-spec-collab -d --restart unless-stopped \
  -p 8091:8091 \
  --env-file apps/design-spec-collab/.env \
  -e REPO_ROOT=/workspace \
  -e DESIGN_SYSTEMS_DIR=/workspace/config/design_systems \
  -e JOBS_DIR=/app/data/jobs \
  -e SESSIONS_DIR=/app/data/sessions \
  -e COLLAB_SESSIONS_DIR=/app/data/collab_sessions \
  -e AUDIT_LOG_PATH=/app/data/audit/audit.jsonl \
  -v "$(pwd)/apps/design-spec-collab/data:/app/data" \
  design-spec-collab:latest
```

**With corporate CA** (fixes `CERTIFICATE_VERIFY_FAILED` — mount certs + set paths **inside** the container):

```bash
# 1) Put ca-bundle.pem in apps/design-spec-collab/certs/ (see Corporate SSL below)
# 2) In .env uncomment / set:
#    REQUESTS_CA_BUNDLE=/certs/ca-bundle.pem
#    SSL_CERT_FILE=/certs/ca-bundle.pem
#    CURL_CA_BUNDLE=/certs/ca-bundle.pem

docker rm -f design-spec-collab 2>/dev/null || true
docker run --name design-spec-collab -d --restart unless-stopped \
  -p 8091:8091 \
  --env-file apps/design-spec-collab/.env \
  -e REPO_ROOT=/workspace \
  -e DESIGN_SYSTEMS_DIR=/workspace/config/design_systems \
  -e JOBS_DIR=/app/data/jobs \
  -e SESSIONS_DIR=/app/data/sessions \
  -e COLLAB_SESSIONS_DIR=/app/data/collab_sessions \
  -e AUDIT_LOG_PATH=/app/data/audit/audit.jsonl \
  -e REQUESTS_CA_BUNDLE=/certs/ca-bundle.pem \
  -e SSL_CERT_FILE=/certs/ca-bundle.pem \
  -e CURL_CA_BUNDLE=/certs/ca-bundle.pem \
  -v "$(pwd)/apps/design-spec-collab/data:/app/data" \
  -v "$(pwd)/apps/design-spec-collab/certs:/certs:ro" \
  design-spec-collab:latest

# Or mount the host trust store instead of ./certs:
#   -v /etc/ssl/certs:/certs:ro \
#   -e REQUESTS_CA_BUNDLE=/certs/ca-certificates.crt \
#   -e SSL_CERT_FILE=/certs/ca-certificates.crt \

curl -s http://127.0.0.1:8091/health
docker logs -f design-spec-collab
docker stop design-spec-collab    # stop
docker rm design-spec-collab      # remove
```

> `--env-file` only injects variables; it does **not** mount files. Paths like `/certs/...` in `.env` must exist **inside** the container via `-v …:/certs`.

> Do **not** commit `.env`. Prefer `FIGMA_TOKEN` / `GITHUB_TOKEN` only in env files or a secret store. Avoid `docker compose config` in shared logs — it prints resolved secrets.

### 3. Build

Build context is the **monorepo root** (Storybook stage needs `components/`, `assets/`, `storybook-generated/`, etc.). First build can take several minutes.

```bash
cd apps/design-spec-collab
mkdir -p data
docker compose build
```

Equivalent from monorepo root:

```bash
docker build -f apps/design-spec-collab/Dockerfile -t design-spec-collab:latest .
```

Optional export/tar for air-gapped servers:

```bash
# From monorepo root — builds + writes design-spec-collab-image.tar.gz
./apps/design-spec-collab/scripts/export-image.sh design-spec-collab:1.0
```

Rebuild whenever baked content changes (specs, Storybook sources, Bridge, backend/frontend):

```bash
cd apps/design-spec-collab && docker compose build --no-cache
```

### 4. Start / stop / status

```bash
cd apps/design-spec-collab

# Start (detached)
docker compose up -d

# Status + health
docker compose ps
curl -s http://127.0.0.1:8091/health

# Logs
docker compose logs -f collab

# Restart (after .env changes — env is read at container create/start)
docker compose up -d --force-recreate

# Stop (keeps ./data)
docker compose down

# Stop and remove anonymous volumes (rarely needed; ./data bind mount remains)
docker compose down -v
```

Open http://127.0.0.1:8091 — dashboard → Generate or Update → **Start session** → **Copy Bridge command**.

Ensure nothing else is bound to host port **8091** (or set `COLLAB_HOST_PORT`).

### Corporate SSL / proxy (`CERTIFICATE_VERIFY_FAILED`)

If packaging fails with:

```text
SSLCertVerificationError: self-signed certificate in certificate chain
```

the laptop (or network) is doing **TLS inspection**. The Docker image does not trust your org CA by default — this is **not** a bad `FIGMA_TOKEN`.

**Fix (recommended):** mount the corporate root CA and point Python/`requests` at it.

```bash
cd apps/design-spec-collab
mkdir -p certs

# Copy your org root CA (ask IT), OR export from the host trust store.
# Example: build a bundle = Mozilla defaults + corp CA
python3 - <<'PY'
import certifi, pathlib, sys
corp = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else "").expanduser()
out = pathlib.Path("certs/ca-bundle.pem")
parts = [pathlib.Path(certifi.where()).read_text()]
if corp.is_file():
    parts.append(corp.read_text())
out.write_text("\n".join(parts))
print("wrote", out.resolve())
PY
# Usage: python3 … /path/to/corp-root-ca.pem
```

Add to `.env`:

```bash
REQUESTS_CA_BUNDLE=/certs/ca-bundle.pem
SSL_CERT_FILE=/certs/ca-bundle.pem
CURL_CA_BUNDLE=/certs/ca-bundle.pem
```

Recreate the container (env + volume):

```bash
docker compose up -d --force-recreate
curl -s http://127.0.0.1:8091/health
# Retry Start session
```

**Alternate:** if the host already trusts the corp CA (browser works to figma.com):

```bash
# Debian/Ubuntu host
COLLAB_CERTS_DIR=/etc/ssl/certs \
REQUESTS_CA_BUNDLE=/certs/ca-certificates.crt \
SSL_CERT_FILE=/certs/ca-certificates.crt \
  docker compose up -d --force-recreate
```

Compose mounts `${COLLAB_CERTS_DIR:-./certs}` → `/certs` (see `docker-compose.yml`).

**Escape hatch (insecure):** if you cannot get the org CA into the image, disable TLS verify for Figma REST. **GitHub PR publish inherits the same setting** unless you set `GITHUB_SSL_VERIFY` explicitly:

```bash
# In .env:
FIGMA_SSL_VERIFY=false
# GITHUB_SSL_VERIFY=false   # only needed if you keep FIGMA_SSL_VERIFY=true
```

After fixing SSL, retry a failed publish without a new session:

```bash
curl -X POST "http://127.0.0.1:8091/api/v1/intake/jobs/JOB_ID/publish/retry"
```

Storybook iframe preview uses the **baked** `storybook-static` in the image (includes the local Scratchpad panel from `storybook/.storybook/manager.tsx`). After a session **accept**, Collab materializes `storybook-generated/…` and **auto-rebuilds** `/storybook` in the container when Node/pnpm are present (`STORYBOOK_REBUILD_ENABLED=true`, default). When Storybook was requested at intake, the Generate page **auto-opens the Storybook tab** and polls until the new Spec Accurate Design story appears (usually 1–3 minutes). If rebuild is unavailable, use **Download artifacts zip**, or rebuild/redeploy the image.

**Session delta vs preview runtime**

| Artifact | What it contains | Purpose |
|----------|------------------|---------|
| **Session delta** (artifacts zip / PR) | Accepted allowlisted files: `design-spec.md`, maps/foundation when required, and `storybook-generated/<programme>/src/components/<Pascal>.stories.tsx` | Git handoff and review of generated sources |
| **Preview runtime** | Full Collab image: themes, `storybook/src` implementations, Node toolchain, static `/storybook/` | Interactive Spec Accurate Design iframe in the UI |

A story file alone cannot boot Storybook. There is no `main.tsx` in this repo — config is `storybook/.storybook/main.ts`, and its globs already discover all programmes under `storybook-generated/*/`. Clients should **not** submit `main.ts` for a normal new story.

Catalogue **Download bundle** (`bundle.zip`) is a richer portable handoff (spec + deps + stories + reference sources) — still not a substitute for the in-app `/storybook/` preview.

### Remote Docker: `/storybook/` returns 404

On the **server** (same host/port as the Collab UI):

```bash
curl -sS "http://127.0.0.1:${COLLAB_HOST_PORT:-8091}/health" | python3 -m json.tool | head -40
# Expect: "app": "design-spec-collab"
# Expect: storybookPreview.staticReady == true, indexHtml == true

curl -sI "http://127.0.0.1:${COLLAB_HOST_PORT:-8091}/storybook/index.html"
# Expect: HTTP 200

docker exec "$(docker compose -f docker-compose.deploy.yml ps -q collab)" \
  ls -la /app/storybook-static/index.html iframe.html
```

If `/health` is not Collab JSON (or you see a Flask/Werkzeug “requested URL was not found” page), port **8080** (or whatever you opened) is **not** this app — check `COLLAB_HOST_PORT` / compose publish and `PUBLIC_BASE_URL`.

If `staticReady` is false: the loaded image was built without the Storybook stage (wrong build context, or `docker import` instead of `docker load`). Re-run `scripts/export-image.sh`, `docker load` the tar, recreate the container. Do **not** set `STORYBOOK_STATIC_DIR` in server `.env` to a laptop path.

Open Storybook links use `/storybook/index.html?…` (real file) so reverse proxies that skip directory indexes still work.

After changing Storybook manager/addons, rebuild static (or the image) so **Open Storybook** on port 8091 matches local `:6006`:

```bash
./apps/design-spec-collab/scripts/build_collab_storybook_static.sh
# then either docker cp into the running container, or:
cd apps/design-spec-collab && docker compose build && docker compose up -d --force-recreate
```

`docker run` example (absolute paths inside the container; do **not** set
`REQUESTS_CA_BUNDLE` unless you also `-v` a real CA file to that path):

```bash
# From apps/design-spec-collab (where .env and ./data live)
# Comment out or delete REQUESTS_CA_BUNDLE / SSL_CERT_FILE / CURL_CA_BUNDLE in .env
# unless you mount certs.

docker rm -f design-spec-collab 2>/dev/null || true
mkdir -p data

docker run --name design-spec-collab -d --restart unless-stopped \
  -p 8091:8091 \
  --env-file ./.env \
  -e FIGMA_SSL_VERIFY=false \
  -e REPO_ROOT=/workspace \
  -e DESIGN_SYSTEMS_DIR=/workspace/config/design_systems \
  -e JOBS_DIR=/app/data/jobs \
  -e SESSIONS_DIR=/app/data/sessions \
  -e COLLAB_SESSIONS_DIR=/app/data/collab_sessions \
  -e AUDIT_LOG_PATH=/app/data/audit/audit.jsonl \
  -v "$(pwd)/data:/app/data" \
  design-spec-collab:latest
```

Rebuild/reload the image after pulling this change (baked backend), then recreate the container.

### 5. Deploy to a server (no git clone)

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
cp .env.example .env   # set PUBLIC_BASE_URL, FIGMA_TOKEN, GITHUB_*
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

Only `./data` is mounted on the server (jobs/sessions). Production: HTTPS reverse proxy; `PUBLIC_BASE_URL` = public origin; `STUB_FORCE_REVISE_ONCE=false`; `GITHUB_PUBLISH_DRY_RUN=false`.

### Simulate the client

```bash
python3 apps/design-spec-collab/scripts/simulate_client.py 'http://127.0.0.1:8091/s/SESSION_ID?t=TOKEN'
# or Bridge with stub AI (no Devin):
python3 apps/design-spec-collab/bridge/collab_bridge.py run 'http://127.0.0.1:8091/s/SESSION?t=TOKEN' --ai-cli stub
```

## Quick start (local venv, no Docker)

```bash
cd apps/design-spec-collab
cp .env.example .env

uv pip install -r backend/requirements.txt
cd backend
PYTHONPATH=. uvicorn app.main:app --host 0.0.0.0 --port 8091 --reload
```

Open http://127.0.0.1:8091 — dashboard → Generate or Update → preview → confirm → **Start session** → **Copy Bridge command**.

### Stop the local uvicorn server

In the terminal where the server is running, press **Ctrl+C** (uvicorn prints `Press CTRL+C to quit`).

If that terminal is gone or Ctrl+C does not stop it:

```bash
# Find and stop whatever is listening on 8091
lsof -t -i:8091 | xargs -r kill
# If it still hangs:
lsof -t -i:8091 | xargs -r kill -9
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

Then recreate the container (or restart uvicorn) so the new values load:

```bash
cd apps/design-spec-collab && docker compose up -d --force-recreate
```

## Architecture

```text
dashboard → generate|update form
     → server Figma pack (REST) + context_artifacts
     → bridge_command (primary) / session_url (fallback)
              │
              ▼
     Bridge Agent (one-shot CLI on user machine, outbound HTTPS)
              │
              ▼
     local AI CLI (Devin, or --ai-cli stub) → POST /result
              │
     server rule review (+ optional Ollama soft) accept | revise
              │
     on accept → GitHub branch+PR + zip
     designer chat follow-ups → POST /chat → Bridge next turn

operator UI ← optional SSE /events (progress only)
```

### Collab Bridge (Server → Agent → local client)

No installer. Collab shows a **Copy Bridge command** that downloads [`bridge/collab_bridge.py`](bridge/collab_bridge.py) and runs it with the session URL:

```bash
curl -fsSL "http://127.0.0.1:8091/bridge/collab_bridge.py" -o /tmp/collab_bridge.py \
  && python3 /tmp/collab_bridge.py run 'http://127.0.0.1:8091/s/SESSION?t=TOKEN'
```

- **Requires:** Python 3 on PATH (stdlib only) + Devin CLI for real authorship (`--ai-cli stub` for demos).
- **Outbound HTTPS only** — claim → `/work` → invoke AI → `/result`; heartbeats for UI status. **Not** a local listen port / “listening mode” — the Bridge **polls** Collab.
- **One client only:** run Bridge **or** paste session URL into Devin — never both. Dual claim/POST causes `Invalid clientNonce`.
- Devin headless needs write permission: Bridge passes `--permission-mode dangerous` by default (`--devin-permission-mode accept-edits` if you prefer narrower auto-approve).
- Bridge puts Devin flags **before** `-p` (so `-p` does not swallow `--permission-mode` as a fake prompt) and streams Devin output + Collab heartbeats while waiting.
- After accept, Bridge **lingers** (~30m by default) for Collab chat follow-ups (`POST /api/v1/intake/jobs/{id}/chat`).
- Fallback: **Copy session URL** / client prompt into Devin manually (unchanged).
- **409 / session failed after turn 3:** the dead session will not accept another `/result`. Start a **new** Collab session and re-Copy Bridge. For Devin, set `STUB_FORCE_REVISE_ONCE=false` and `COLLAB_MAX_TURNS=6` (restart container). Bridge must POST **all** required paths (foundation theme/root-spec/yaml, registry, storybook) — not only `design-spec.md`; recent Bridge fills gaps from packaged donors when Devin omits them.

```bash
python3 /tmp/collab_bridge.py doctor
python3 /tmp/collab_bridge.py run '…' --ai-cli stub --once
# Devin (default permission-mode=dangerous for -p writes):
python3 /tmp/collab_bridge.py run '…' --ai-cli devin
```

### Simulate the client

```bash
python3 apps/design-spec-collab/scripts/simulate_client.py 'http://127.0.0.1:8091/s/SESSION_ID?t=TOKEN'
# or Bridge stub:
python3 apps/design-spec-collab/bridge/collab_bridge.py run 'http://…' --ai-cli stub
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

### Storybook Spec Accurate Design preview

Collab can iframe the **Spec Accurate Design** story for a catalogue component (no local `pnpm dev` on port 6006).

- **UI:** Home → select programme + component → **Storybook preview** card. Generate/Update job results → **Storybook** tab next to Spec/Source. After **accept** with Storybook requested, Generate auto-switches to that tab and polls rebuild status. **Switching Spec ↔ Storybook (or leaving and returning) does not rebuild** once that preview is loaded — the iframe is reused.
- **PR-branch cache (after publish):** When the job has a real GitHub PR, Collab builds Storybook once from the **PR head SHA** into `data/storybook_pr_builds/{pr}-{sha12}/`, served at `/storybook-pr/{pr}-{sha12}/`. Same PR commit = cache hit (no rebuild). A new commit on the PR gets a new cache key.
- **Review workspace (`#/review`):** Pick a Collab PR → import → Spec / Source / filtered Storybook. Enter **reviewer feedback** → **Revise on this PR** starts a Bridge job (`job_kind=review_revise`) with PR-head baselines; on accept, commits go to that PR’s `headBranch` (no new `update/…` branch).
  - Continuity: the client must **patch** `baseline_artifacts` (imported PR head), not regenerate from Figma. Map/registry rewrites are skipped on revise. Storybook files are normalized (`import React from "react"`) on publish **and** on Review import so `React is not defined` does not return after a revise.
- **Catalogue Update (`#/update?programme=&component=`):** Dashboard **Update Spec** → prompt (+ optional Figma URLs) → Bridge (`job_kind=update`) with catalogue baselines → new `update/{slug}-{sessionShort}` branch + **new** PR. Figma pack only when URLs are provided or the prompt asks to recheck design. Map on PR only when extra URLs were provided; inheritance registry never changed; theme/root-spec/yaml are context-only.
- **Operator UX:** Transcript is toggleable (default open, latest first). Follow-up / PR created / PR updated events appear in Transcript + banners. After accept, Storybook auto-refreshes a **filtered** preview (this component only). Idle timeout (`COLLAB_OPERATOR_IDLE_MINUTES`, default 10) after a finished job: Continue or End (B2 closes follow-ups on that session and returns to Dashboard; Bridge process is not killed).
- **Catalogue:** **View design-spec** reads the component’s `design-spec.md` (local or GitHub). Home Storybook preview auto-rebuilds when the story is on disk but missing from the static index (`static_stale`).
- **Session delta:** PR / artifacts zip includes the generated `.stories.tsx` (not a runnable Storybook). Review preview uses the filtered PR cache only; Generate/catalogue may still use baked `/storybook/` + in-container rebuild.
- **Client artifacts:** submit `storybook-generated/<programme>/src/components/<Pascal>.stories.tsx` only — do not require `storybook/.storybook/main.ts` (globs already cover all programmes). There is no `main.tsx`.
- **API:** `GET /api/v1/preview/storybook?programme=ids&slug=about`, job preview, and Review:
  - `GET /api/v1/review/pull-requests`
  - `POST /api/v1/review/pull-requests/{number}/import`
  - `GET /api/v1/review/sessions/{importId}/design-spec`
  - `GET /api/v1/review/sessions/{importId}/preview/storybook`
  - `GET /api/v1/update/programmes/{programme}/components/{slug}/design-spec`
- **Static assets:** baked preview at `/storybook/` (`STORYBOOK_BASE_PATH=/storybook/`); PR-commit / Review builds at `/storybook-pr/{pr}-{sha12}/`.
- **Docker:** multi-stage image builds `storybook-static` into `/app/storybook-static` and copies `assets/` into `/workspace`. **Review** builds a filtered PR cache and never mutates shared `/storybook`. Generate/accept can still rebuild shared `/storybook` when needed (`STORYBOOK_REBUILD_ENABLED`, Node+pnpm baked in).
- **Local (venv):**  
  `./apps/design-spec-collab/scripts/build_collab_storybook_static.sh`  
  then `export STORYBOOK_STATIC_DIR=…/apps/design-spec-collab/storybook-static` before starting uvicorn.
- `/health` includes `storybookPreview.staticReady`.

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
| `PUBLIC_BASE_URL` | Absolute session URLs + Bridge command host |
| `FIGMA_MODE` | `rest` (recommended), `stub`, or `mcp` |
| `FIGMA_TOKEN` | Figma PAT for **server** REST packaging |
| `CATALOGUE_SOURCE` | `auto` (default, local first), `local`, or `github` |
| `STORYBOOK_STATIC_DIR` | Path to Storybook static build (`iframe.html`); Docker default `/app/storybook-static` |
| `GITHUB_PUBLISH_DRY_RUN` | `true` for local demo without GitHub writes |
| `AUTO_CREATE_PR` | Run publish after accept |

### Architecture notes

- Frontend SPA (hash routes `#/`, `#/generate`, `#/update?programme=&component=`, `#/review`).
- Intake helpers live in Collab-owned `backend/intake_core/` (no runtime dependency on `design-spec-portal`).

# Design Spec Collab — Docker build, push, and run

Step-by-step guide to build a **self-contained** image on your laptop, move it to a server **without cloning the git repo**, and run it as a container.

The image includes:

- Collab app (API + frontend)
- Portal intake stack (`portal_app`)
- Baked design-system tree: `components/`, `data/` maps, `config/design_systems/`, `.cursor/skills/`, `storybook-generated/`, `scripts/`, `docs/design-spec-authoring-contract.md` (for session context pack)

On the server you only need Docker, a small compose file, and a `.env` file. Writable job/session data lives in a local `./data` volume.

---

## Prerequisites

### Docker Compose command

Use whichever works on your machine:

| Command | Typical install |
|---------|-----------------|
| `docker compose …` | Docker Compose **V2** plugin |
| `docker-compose …` | Older standalone Compose **V1** |

If `docker compose` says “not a command”, use the hyphenated form:

```bash
docker-compose -f docker-compose.deploy.yml up -d
```

Check what you have:

```bash
docker compose version    # V2
docker-compose version    # V1
```

Both work with the same YAML files in this repo.

### Build machine (laptop / CI)

- Docker Engine + Compose plugin
- Full checkout of this monorepo (`SDD-IDS`)
- Network to pull `python:3.12-slim` (first build)

### Server

- Docker Engine + Compose plugin
- Outbound HTTPS for Figma API and GitHub API (packaging + PRs)
- Open port `8091` (or put a reverse proxy in front)
- **No** git clone of `SDD-IDS` required

---

## Part 1 — Build the image locally

### 1.1 Open a terminal at the monorepo root

```bash
cd /path/to/SDD-IDS
```

Confirm the Dockerfile exists:

```bash
ls apps/design-spec-collab/Dockerfile
```

If you add more `COPY <folder>` lines to the Dockerfile, also remove that folder name from the monorepo-root [`.dockerignore`](../.dockerignore). Entries listed there are **excluded from the build context**, so Docker reports “not found” even when the folder exists on disk.

### 1.2 Choose an image tag

Examples:

| Tag | When to use |
|-----|-------------|
| `design-spec-collab:latest` | Local / informal |
| `design-spec-collab:1.0` | Versioned deploy via tar |
| `ghcr.io/YOUR_ORG/design-spec-collab:1.0` | Push to GitHub Container Registry |
| `registry.example.com/design-spec-collab:1.0` | Private registry |

### 1.3 Build (option A — helper script)

```bash
./apps/design-spec-collab/scripts/export-image.sh design-spec-collab:1.0
```

This will:

1. `docker build` from the **monorepo root**
2. Tag the image as `design-spec-collab:1.0`
3. Save a compressed archive:  
   `apps/design-spec-collab/design-spec-collab-image.tar.gz`

### 1.4 Build (option B — plain Docker)

```bash
docker build \
  -f apps/design-spec-collab/Dockerfile \
  -t design-spec-collab:1.0 \
  .
```

### 1.5 Build (option C — Compose on the build machine)

```bash
cd apps/design-spec-collab
cp .env.example .env   # fill tokens if you will also run locally
export COLLAB_IMAGE=design-spec-collab:1.0
docker compose build
```

### 1.6 Verify the image

```bash
docker images | grep design-spec-collab

docker run --rm design-spec-collab:1.0 \
  python -c "from pathlib import Path; print((Path('/workspace/components/ids')).is_dir())"
```

Expect `True` (baked `components/` present).

---

## Part 2 — Push the image to the server

Pick **one** method.

### Method A — Tar file (no container registry)

Best when you cannot or do not want a registry.

#### A.1 Export (if you used plain `docker build`)

```bash
# From monorepo root
docker save design-spec-collab:1.0 | gzip > apps/design-spec-collab/design-spec-collab-image.tar.gz
```

(The `export-image.sh` script already does this.)

#### A.2 Copy artifacts to the server

You need only these files on the server (not the full repo):

| File | Purpose |
|------|---------|
| `design-spec-collab-image.tar.gz` | Image |
| `.env` | Secrets and config (create from `.env.example`) |
| `run-container.sh` | Optional helper to start with plain `docker run` |
| `docker-compose.deploy.yml` | Optional — only if Compose is installed |

```bash
scp apps/design-spec-collab/design-spec-collab-image.tar.gz \
    apps/design-spec-collab/docker-compose.deploy.yml \
    apps/design-spec-collab/.env.example \
    user@YOUR_SERVER:~/collab/
```

#### A.3 Load the image on the server

Use **`docker load`** (not `docker import`). `import` expects a filesystem tree and fails with errors like `repositories: no such file or directory`.

**Recommended (decompress to a `.tar`, then load):**

```bash
ssh user@YOUR_SERVER
cd ~/collab

# Integrity check
ls -lh design-spec-collab-image.tar.gz
gzip -t design-spec-collab-image.tar.gz   # must exit 0; if not, re-copy the file

# Decompress, then load (most reliable)
gzip -dc design-spec-collab-image.tar.gz > design-spec-collab-image.tar
docker load -i design-spec-collab-image.tar

docker images | grep design-spec-collab
```

**Alternative (stream into load):**

```bash
gzip -dc design-spec-collab-image.tar.gz | docker load
```

You should see `design-spec-collab` with tag `1.0` (or whatever tag you built).

If load still fails:

1. Confirm you did **not** run `docker import`.
2. Re-transfer the `.tar.gz` (interrupted `scp` often truncates the archive).
3. Rebuild/export on the laptop and copy again.
4. Ensure the file is a gzip of `docker save` output (`file design-spec-collab-image.tar.gz` → `gzip compressed data`).

---

### Method B — Container registry (GHCR / Docker Hub / private)

Best for repeated deploys and CI.

#### B.1 Log in to the registry (build machine)

```bash
# GitHub Container Registry example
echo "$GITHUB_TOKEN" | docker login ghcr.io -u YOUR_GITHUB_USER --password-stdin
```

#### B.2 Tag and push

```bash
export COLLAB_IMAGE=ghcr.io/YOUR_ORG/design-spec-collab:1.0

# Build + push via helper
./apps/design-spec-collab/scripts/export-image.sh --push

# Or manually:
docker build -f apps/design-spec-collab/Dockerfile -t "$COLLAB_IMAGE" .
docker push "$COLLAB_IMAGE"
```

#### B.3 On the server — pull

```bash
# Login if the registry is private
echo "$GITHUB_TOKEN" | docker login ghcr.io -u YOUR_GITHUB_USER --password-stdin

export COLLAB_IMAGE=ghcr.io/YOUR_ORG/design-spec-collab:1.0
export COLLAB_PULL_POLICY=always
docker pull "$COLLAB_IMAGE"
```

Copy only `docker-compose.deploy.yml` and `.env` to the server (no tar needed).

---

## Part 3 — Configure and run the container

### 3.1 Create the deploy directory on the server

```bash
mkdir -p ~/collab/data
cd ~/collab
```

Ensure you have:

```text
~/collab/
  docker-compose.deploy.yml
  .env
  data/                    # empty is fine; Docker will write jobs/sessions here
  design-spec-collab-image.tar.gz   # only if using Method A
```

### 3.2 Create `.env`

```bash
cp .env.example .env
nano .env   # or vim
```

Minimum production settings:

```bash
AUTH_MODE=disabled

# Must match how users reach the app (HTTPS origin behind a proxy)
PUBLIC_BASE_URL=https://collab.example.com

FIGMA_MODE=rest
FIGMA_TOKEN=figd_xxxxxxxx

SERVER_REVIEW_MODE=rules
# Optional soft LLM review only (does not author the spec):
# SERVER_REVIEW_MODE=ollama
# OLLAMA_HOST=http://host.docker.internal:11434
# OLLAMA_MODEL=llama3
STUB_FORCE_REVISE_ONCE=false

SESSION_REQUIRE_CLAIM=true
SESSION_TTL_HOURS=24
COLLAB_MAX_TURNS=3

AUTO_CREATE_PR=true
GITHUB_PUBLISH_DRY_RUN=false
GITHUB_TOKEN=ghp_xxxxxxxx
GITHUB_REPO_URL=https://github.com/YOUR_ORG/SDD-IDS.git
GITHUB_STARTING_REF=master

CATALOGUE_SOURCE=local
```

Notes:

- `PUBLIC_BASE_URL` is used when generating **session URLs** for client agents. Wrong value → clients cannot reach `/s/...`.
- `FIGMA_TOKEN` is used **only on the server** to pack Figma evidence (clients do not authenticate Figma).
- `SERVER_REVIEW_MODE=ollama` is optional soft quality review via a host/sidecar Ollama — it never writes `design-spec.md`. Default `rules` needs no LLM.
- `GITHUB_*` is used after accept to open a PR with allowlisted artifacts.
- `CATALOGUE_SOURCE=local` reads the baked-in `/workspace` tree inside the image.
- Session `/work` includes **context_artifacts** (theme, root-spec, yaml, map) so client agents must not search the local filesystem.

### 3.3 Start the container

#### Option 1 — plain `docker run` (no Compose)

Copy `scripts/run-container.sh` to the server next to `.env`, or run the commands below.

```bash
cd ~/collab
mkdir -p data

# IMAGE tag must match what you loaded
export COLLAB_IMAGE=design-spec-collab:1.0

# Helper script (recommended)
chmod +x run-container.sh
./run-container.sh
```

Or equivalent one-liner (edit values as needed):

```bash
mkdir -p ~/collab/data
docker rm -f design-spec-collab 2>/dev/null || true

docker run -d \
  --name design-spec-collab \
  --restart unless-stopped \
  -p 8091:8091 \
  --env-file ~/collab/.env \
  -e REPO_ROOT=/workspace \
  -e DESIGN_SYSTEMS_DIR=/workspace/config/design_systems \
  -e JOBS_DIR=/app/data/jobs \
  -e SESSIONS_DIR=/app/data/sessions \
  -e COLLAB_SESSIONS_DIR=/app/data/collab_sessions \
  -e AUDIT_LOG_PATH=/app/data/audit/audit.jsonl \
  -v ~/collab/data:/app/data \
  design-spec-collab:1.0
```

Useful commands:

```bash
curl -s http://127.0.0.1:8091/health
docker logs -f design-spec-collab
docker rm -f design-spec-collab    # stop & remove
```

#### Option 2 — Docker Compose (if available)

**If you loaded a local tag (Method A):**

```bash
cd ~/collab
export COLLAB_IMAGE=design-spec-collab:1.0
export COLLAB_PULL_POLICY=never
docker-compose -f docker-compose.deploy.yml up -d
# or: docker compose -f docker-compose.deploy.yml up -d
```

**If you use a registry (Method B):**

```bash
cd ~/collab
export COLLAB_IMAGE=ghcr.io/YOUR_ORG/design-spec-collab:1.0
export COLLAB_PULL_POLICY=always
docker-compose -f docker-compose.deploy.yml pull
docker-compose -f docker-compose.deploy.yml up -d
```

### 3.4 Check health

```bash
docker compose -f docker-compose.deploy.yml ps
curl -s http://127.0.0.1:8091/health
```

Expected JSON includes `"status":"ok"` and `"app":"design-spec-collab"`.

### 3.5 Open the UI

- Direct: `http://YOUR_SERVER:8091`
- With reverse proxy: `https://collab.example.com` (must match `PUBLIC_BASE_URL`)

Flow: Dashboard → **Generate Spec** or select programme/component → **Update** → Preview → Start session → copy session URL into the client agent.

---

## Part 4 — Day-2 operations

### View logs

```bash
docker compose -f docker-compose.deploy.yml logs -f collab
```

### Stop / restart

```bash
docker compose -f docker-compose.deploy.yml stop
docker compose -f docker-compose.deploy.yml start
# or
docker compose -f docker-compose.deploy.yml restart
```

### Update to a new image version

1. On the build machine: rebuild with a new tag (e.g. `1.1`) and export or push.  
2. On the server: load/pull the new tag.  
3. Set `COLLAB_IMAGE=...:1.1` and:

```bash
docker compose -f docker-compose.deploy.yml up -d
```

Job/session files in `./data` are preserved across image updates.

### When design specs or Figma maps change

Rebuild the image on the laptop (Part 1) and redeploy (Part 2–3). The running container does not auto-sync from git.

---

## Optional — HTTPS reverse proxy (outline)

Example Nginx upstream:

```nginx
server {
  listen 443 ssl;
  server_name collab.example.com;
  # ssl_certificate ...;
  # ssl_certificate_key ...;

  location / {
    proxy_pass http://127.0.0.1:8091;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  }
}
```

Then set:

```bash
PUBLIC_BASE_URL=https://collab.example.com
```

and recreate the container so session URLs use HTTPS.

---

## Troubleshooting

| Symptom | Check |
|---------|--------|
| `docker compose: command not found` | Use `docker-compose` (hyphen) instead, or install the Compose V2 plugin |
| `repositories: no such file or directory` on load | Use `docker load -i …tar` (not `docker import`). Re-copy if `gzip -t` fails (truncated transfer). |
| `health` fails | `docker compose logs collab`; port conflict on 8091 |
| Session URL uses `127.0.0.1` for remote clients | Set `PUBLIC_BASE_URL` to the public HTTPS URL and recreate |
| Catalogue empty | Image missing bake step — rebuild from monorepo root; confirm `/workspace/components` in container |
| Figma packaging fails | `FIGMA_TOKEN` valid; `FIGMA_MODE=rest`; token can access mapped Figma files |
| PR not created | `GITHUB_TOKEN`, `GITHUB_REPO_URL`, `GITHUB_PUBLISH_DRY_RUN=false` |
| Client asked to Authenticate Figma | Collab work payload should forbid client Figma; use a session from this collab app, not the IDE skill path |

Inspect workspace inside a running container:

```bash
docker compose -f docker-compose.deploy.yml exec collab ls /workspace/components
```

---

## Quick reference

```bash
# BUILD (laptop, monorepo root)
./apps/design-spec-collab/scripts/export-image.sh design-spec-collab:1.0

# TRANSFER (tar)
scp apps/design-spec-collab/design-spec-collab-image.tar.gz \
    apps/design-spec-collab/docker-compose.deploy.yml \
    apps/design-spec-collab/.env.example \
    user@server:~/collab/

# LOAD + RUN (server)
cd ~/collab
gzip -t design-spec-collab-image.tar.gz
gzip -dc design-spec-collab-image.tar.gz > design-spec-collab-image.tar
docker load -i design-spec-collab-image.tar
# Do NOT use: docker import …
cp .env.example .env && $EDITOR .env
mkdir -p data
COLLAB_IMAGE=design-spec-collab:1.0 COLLAB_PULL_POLICY=never \
  docker-compose -f docker-compose.deploy.yml up -d
# If that fails, try: docker compose -f docker-compose.deploy.yml up -d
curl -s http://127.0.0.1:8091/health
```

Related files:

- [`apps/design-spec-collab/Dockerfile`](../apps/design-spec-collab/Dockerfile)
- [`apps/design-spec-collab/docker-compose.yml`](../apps/design-spec-collab/docker-compose.yml) — build/run on laptop
- [`apps/design-spec-collab/docker-compose.deploy.yml`](../apps/design-spec-collab/docker-compose.deploy.yml) — run on server
- [`apps/design-spec-collab/scripts/export-image.sh`](../apps/design-spec-collab/scripts/export-image.sh)
- [`apps/design-spec-collab/.env.example`](../apps/design-spec-collab/.env.example)

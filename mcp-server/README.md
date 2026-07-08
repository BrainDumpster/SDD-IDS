# SDD-IDS Centralized MCP Server

Internal engineering playbook for the network-hosted [Model Context Protocol](https://modelcontextprotocol.io/) server. It exposes design-system tools backed by this repository on **GitHub Enterprise Server (GHES)**.

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/mcp` | `POST` | MCP Streamable HTTP transport (tool calls) |
| `/health` | `GET` | Liveness + GHES configuration check |

| Tool | Description |
|------|-------------|
| `list_components` | Discovers UI component slugs under `components/<programme>/` |
| `get_component_context` | Full component deliverable bundle (see table below) |

### `get_component_context` deliverables

**IDS programme** (`programme: "ids"`):

| Section | Source path |
|---------|-------------|
| Design Specification | `components/ids/<component>/design-spec.md` |
| Programme Root Specification | `components/ids/root-spec.md` |
| Programme Theme CSS | `components/ids-theme.css` |
| Storybook Companion | Framework-specific story paths |

**Any other programme** (e.g. `synapse`, `DAP`) — full inheritance bundle per `design-spec-programme-inheritance`:

| Section | Source path |
|---------|-------------|
| IDS Baseline Design Specification | Resolved from `data/programme-inheritance-registry.json` (`idsBaselineSpecPath` / `idsBaselineSlug`), then fallback to `components/ids/<component>/design-spec.md` |
| IDS Baseline Root Specification | `components/ids/root-spec.md` |
| IDS Baseline Theme CSS | `components/ids-theme.css` |
| Programme Design Specification | `components/<programme>/<component>/design-spec.md` |
| Programme Root Specification | `components/<programme>/root-spec.md` |
| Programme Theme CSS | `components/<programme>-theme.css` |
| Storybook Companion | Framework-specific story paths |

Example: `synapse` + `left-nav` resolves IDS baseline to `components/ids/main-menu-left/design-spec.md` via the inheritance registry.

Programme folder names are case-sensitive (`ids`, `synapse`, `DAP`). Theme files use a lowercase slug (e.g. programme `DAP` → `components/dap-theme.css`).

Repository layout:

```
components/
├── ids-theme.css
├── dap-theme.css
├── synapse-theme.css
├── ids/
│   ├── root-spec.md
│   └── <component>/design-spec.md
├── DAP/
│   ├── root-spec.md
│   └── <component>/design-spec.md
└── synapse/
    ├── root-spec.md
    └── <component>/design-spec.md
```

---

## Quick start (deployment)

Run from the **repository root** (`SDD-IDS/`).

```bash
# 1. Ensure root .env is configured (see Prerequisites)
cp .env.example .env   # first time only — then edit values

# 2. Build the image
docker build -t sdd-ids-mcp-server -f mcp-server/Dockerfile .

# 3. Run the container (recommended: reuse root .env)
docker run -d \
  --name sdd-ids-mcp-server \
  --restart unless-stopped \
  -p 3000:3000 \
  --env-file .env \
  sdd-ids-mcp-server

# 4. Verify
curl -s http://localhost:3000/health | jq .
```

The server binds to `0.0.0.0:3000` and accepts intranet connections on port **3000**.

---

## Architecture

```
┌─────────────┐     POST /mcp      ┌──────────────────────┐
│  Cursor IDE │ ─────────────────► │  mcp-server (Docker) │
│  (dev team) │   or mcp-remote    │  Express + MCP SDK   │
└─────────────┘                    └──────────┬───────────┘
                                              │ Octokit REST
                                              ▼
                                 ┌────────────────────────────┐
                                 │  GitHub Enterprise (GHES)  │
                                 │  ${GITHUB_HOST}/api/v3     │
                                 │  repo: ${GITHUB_REPO}      │
                                 └────────────────────────────┘
```

Data read at runtime (no local repo clone required in the container):

- `components/<programme>/<component>/design-spec.md`
- `components/<programme>/root-spec.md`
- `components/<programme>-theme.css`
- For non-IDS programmes: IDS baseline bundle (`components/ids/<baseline-slug>/design-spec.md`, `components/ids/root-spec.md`, `components/ids-theme.css`) resolved via `data/programme-inheritance-registry.json`
- Storybook parity files (React or Angular, via `framework` parameter)

---

## Prerequisites

### 1. GitHub Enterprise environment variables

Uses the **same variables** as the rest of SDD-IDS (see root `.env.example`). Nothing is hardcoded in `server.ts`.

| Variable | Required | Description |
|----------|----------|-------------|
| `GITHUB_HOST` | Yes | GHES hostname **without** `/api/v3` (e.g. `https://eos2git.cec.lab.emc.com`) |
| `GITHUB_REPO` | Yes | Repository as `owner/repo` that hosts the **`components/`** tree (e.g. `EDGUI/Component-Specs` or `data-manager/SDD-IDS`). **Not** `ids-content` unless `components/ids/` exists there. |
| `GITHUB_PERSONAL_ACCESS_TOKEN` | Yes* | PAT with **repo read** / Contents read access |
| `GITHUB_REF` | No | Branch/tag/SHA for Contents API (`main` when unset; empty = repo default) |
| `GITHUB_TLS_VERIFY` | No | `true` to enforce TLS validation; **defaults to `false` for corporate GHES** (matches `github_loader.py`) |
| `PORT` | No | HTTP port inside container (default: `3000`) |

\* `GITHUB_TOKEN` is accepted as a fallback alias.

Example root `.env`:

```bash
GITHUB_HOST=https://eos2git.cec.lab.emc.com
GITHUB_REPO=your-org/SDD-IDS
GITHUB_PERSONAL_ACCESS_TOKEN=ghp_xxxxxxxx
GITHUB_REF=main
# GITHUB_TLS_VERIFY=false   # uncomment only if TLS handshake fails against GHES
```

Octokit resolves the API base URL to:

```
${GITHUB_HOST}/api/v3
```

### 2. GitHub Enterprise Personal Access Token (PAT)

Create the token on your **GitHub Enterprise** instance (not github.com):

1. Open `https://<your-ghe-host>/settings/tokens`
2. **Settings → Developer settings → Personal access tokens**
3. Generate a **classic** token with `repo` scope (or **Contents: Read** on fine-grained tokens if supported)
4. Store in your secrets manager — never commit to git

### 3. Docker

Docker 24+ with BuildKit (default on recent Docker Desktop / Engine).

---

## Deployment

All `docker` commands below assume your shell cwd is the **repository root**.

### Build image

```bash
docker build -t sdd-ids-mcp-server -f mcp-server/Dockerfile .
```

Multi-stage build summary:

| Stage | Base image | Output |
|-------|------------|--------|
| `builder` | `node:20-alpine` | Compiles `server.ts` → `dist/server.js` |
| `runner` | `node:20-alpine` | Production deps + `dist/` only, non-root `mcp` user |

### Run container — option A (env file, recommended)

Reuses the same `.env` as Python scripts and other SDD-IDS tooling:

```bash
docker run -d \
  --name sdd-ids-mcp-server \
  --restart unless-stopped \
  -p 3000:3000 \
  --env-file .env \
  sdd-ids-mcp-server
```

### Run container — option B (explicit flags)

```bash
docker run -d \
  --name sdd-ids-mcp-server \
  --restart unless-stopped \
  -p 3000:3000 \
  -e GITHUB_HOST="https://eos2git.cec.lab.emc.com" \
  -e GITHUB_REPO="your-org/SDD-IDS" \
  -e GITHUB_PERSONAL_ACCESS_TOKEN="ghp_xxxxxxxx" \
  -e GITHUB_REF="main" \
  sdd-ids-mcp-server
```

### Run container — option C (internal / self-signed GHES CA)

Use only on trusted corporate networks:

```bash
docker run -d \
  --name sdd-ids-mcp-server \
  --restart unless-stopped \
  -p 3000:3000 \
  -e GITHUB_HOST="https://eos2git.cec.lab.emc.com" \
  -e GITHUB_REPO="your-org/SDD-IDS" \
  -e GITHUB_PERSONAL_ACCESS_TOKEN="ghp_xxxxxxxx" \
  -e GITHUB_REF="main" \
  -e GITHUB_TLS_VERIFY="false" \
  sdd-ids-mcp-server
```

### Run container — option D (custom host port)

Map host port `8080` to container port `3000`:

```bash
docker run -d \
  --name sdd-ids-mcp-server \
  --restart unless-stopped \
  -p 8080:3000 \
  --env-file .env \
  sdd-ids-mcp-server
```

### Verify deployment

```bash
# Health check
curl -s http://localhost:3000/health

# Container logs
docker logs -f sdd-ids-mcp-server
```

Expected health response:

```json
{
  "status": "ok",
  "service": "sdd-ids-design-spec-mcp-server",
  "endpoint": "/mcp",
  "githubEnterprise": {
    "host": "https://eos2git.cec.lab.emc.com",
    "repo": "your-org/SDD-IDS",
    "ref": "main"
  }
}
```

From a developer workstation on the intranet, replace `localhost` with the central server IP or DNS name (e.g. `http://10.20.30.40:3000/health`).

### Update / redeploy

After pulling new code or changing configuration:

```bash
docker stop sdd-ids-mcp-server
docker rm sdd-ids-mcp-server

docker build -t sdd-ids-mcp-server -f mcp-server/Dockerfile .

docker run -d \
  --name sdd-ids-mcp-server \
  --restart unless-stopped \
  -p 3000:3000 \
  --env-file .env \
  sdd-ids-mcp-server
```

### Container lifecycle

```bash
docker ps                          # running?
docker logs sdd-ids-mcp-server     # tail logs
docker restart sdd-ids-mcp-server  # restart without rebuild
docker stop sdd-ids-mcp-server     # stop
docker rm sdd-ids-mcp-server       # remove (after stop)
```

### Optional: Docker Compose snippet

Save as `mcp-server/docker-compose.yml` if your team prefers Compose:

```yaml
services:
  mcp-server:
    build:
      context: ..
      dockerfile: mcp-server/Dockerfile
    image: sdd-ids-mcp-server
    container_name: sdd-ids-mcp-server
    restart: unless-stopped
    ports:
      - "3000:3000"
    env_file:
      - ../.env
```

Run from `mcp-server/`:

```bash
docker compose up -d --build
```

---

## Local development and testing

### Prerequisites

From the **repository root**, ensure `.env` is configured with GHES credentials (same variables as other SDD-IDS scripts — see [Prerequisites](#1-github-enterprise-environment-variables)):

```bash
cp .env.example .env   # first time only — then edit values
```

Required values:

```bash
GITHUB_HOST=https://eos2git.cec.lab.emc.com
GITHUB_REPO=your-org/SDD-IDS
GITHUB_PERSONAL_ACCESS_TOKEN=ghp_xxxxxxxx
GITHUB_REF=main
# GITHUB_TLS_VERIFY=false   # uncomment only if TLS handshake fails against GHES
```

### Start the server (without Docker)

```bash
cd mcp-server
npm ci

# Load GHES credentials from repository root (bash/zsh)
set -a && source ../.env && set +a

npm run dev        # tsx server.ts — runs server.ts directly
# or
npm run build && npm start
```

Expected console output:

```text
MCP server listening on http://0.0.0.0:3000/mcp
Health check available at http://0.0.0.0:3000/health
GitHub Enterprise: https://eos2git.cec.lab.emc.com
Repository: your-org/SDD-IDS
```

### Step 1 — Smoke test (health endpoint)

In a **second terminal**:

```bash
curl -s http://localhost:3000/health | jq .
```

Pass criteria: `"status": "ok"` and a populated `githubEnterprise` block (`host`, `repo`, `ref`).

If this fails, fix `.env` / GHES connectivity before testing MCP tools.

### Step 2 — Test MCP tools

#### Option A — Cursor (recommended)

Add to project `.cursor/mcp.json` (use `localhost` for local dev):

```json
{
  "mcpServers": {
    "sdd-ids-design-spec": {
      "url": "http://localhost:3000/mcp"
    }
  }
}
```

Reload MCP servers in Cursor, then try:

```text
Use sdd-ids-design-spec: call list_components for programme "ids"
```

```text
Call get_component_context for programme "ids", componentName "button", framework "react"
```

#### Option B — MCP Inspector

**Important:** This server speaks **Streamable HTTP**, not STDIO. Do **not** put `http://localhost:3000/mcp` in the STDIO **Command** field — that causes `spawn http://localhost:3000/mcp ENOENT`.

**Step 1 — Start the MCP server** (separate terminal):

```bash
cd mcp-server && set -a && source ../.env && set +a && npm run dev
```

**Step 2 — Launch Inspector** (opens proxy UI on port 6274):

```bash
npx @modelcontextprotocol/inspector
```

**Step 3 — Connect in the browser** using one of these:

**A. Pre-filled URL (easiest)** — copy the full URL from the Inspector terminal output (includes auth token), or open:

```
http://localhost:6274/?transport=streamable-http&serverUrl=http://localhost:3000/mcp
```

When Inspector starts it prints a URL with `MCP_PROXY_AUTH_TOKEN=...` — **use that URL** (required for the Inspector proxy).

**B. Inspector UI manually:**

1. Transport type: **Streamable HTTP** (not STDIO, not SSE)
2. Server URL: `http://localhost:3000/mcp`
3. **OAuth / Authentication: leave empty** — this server has no OAuth; GHES token is server-side only
4. Do **not** click **Authenticate** or **Re-authenticate**
5. Click **Connect**

**If you see `Cannot POST /register` or `Invalid OAuth error response`:** the client tried OAuth against this server. Clear OAuth settings, use Streamable HTTP with no auth, and connect via the Inspector **proxy** URL (port **6274**), not by pointing a browser OAuth flow at port **3000** directly.

**Step 4 — Run tools:** Tools tab → `list_components` or `get_component_context` → submit JSON → Run.

**CLI mode** (no browser UI):

```bash
npx @modelcontextprotocol/inspector --cli http://localhost:3000/mcp --transport http --method tools/list
```

Call a tool:

```bash
npx @modelcontextprotocol/inspector --cli http://localhost:3000/mcp --transport http \
  --method tools/call --tool-name list_components \
  --tool-arg programme=ids
```

**If you see `SSE error: Non-200 (500)`:** restart `npm run dev` with the latest `server.ts` (session-based transport fix).

**If you see `spawn http://localhost:3000/mcp ENOENT`:** you selected **STDIO** transport — switch to **Streamable HTTP** (steps above).

#### Option C — `mcp-remote` (stdio bridge)

```bash
npx -y mcp-remote http://localhost:3000/mcp
```

Confirms the HTTP transport works the same way Cursor uses via the proxy.

### Step 3 — Test via Docker locally

From the **repository root**:

```bash
docker build -t sdd-ids-mcp-server -f mcp-server/Dockerfile .
docker run --rm -p 3000:3000 --env-file .env sdd-ids-mcp-server
```

Repeat the health check and Cursor / Inspector steps against `http://localhost:3000/mcp`.

### Local validation checklist

| Check | Command / action | Pass criteria |
|-------|------------------|---------------|
| Server starts | `npm run dev` | No `FATAL` in logs |
| GHES config | `curl http://localhost:3000/health` | `githubEnterprise` block populated |
| List components | `list_components` → `{ "programme": "ids" }` | JSON list of component slugs |
| Component context | `get_component_context` → `{ "programme": "ids", "componentName": "button" }` | Markdown with design spec + theme CSS |
| Programme inheritance | `get_component_context` → `{ "programme": "synapse", "componentName": "modal" }` | IDS baseline + programme sections |

> The server is **read-only** against GHES — local testing fetches spec files only; it does not modify the repository.

### Common local issues

| Symptom | Fix |
|---------|-----|
| `FATAL: GITHUB_HOST...` on start | Run `set -a && source ../.env && set +a` before `npm run dev` |
| `SSE error: Non-200 status code (500)` in Inspector | Restart server with latest code; ensure only one instance on port 3000 (`fuser -k 3000/tcp`) |
| `spawn http://localhost:3000/mcp ENOENT` | Inspector is in **STDIO** mode — use **Streamable HTTP** and set Server URL (see Option B) |
| `Cannot POST /register` / `Invalid OAuth error response` | Disable OAuth in Inspector; leave auth empty; use proxy URL on port **6274** with `MCP_PROXY_AUTH_TOKEN` |
| Inspector connects but tools fail | Check GHES PAT and `GITHUB_REPO` / `GITHUB_REF` in `.env` |
| TLS errors to GHES | `export GITHUB_TLS_VERIFY=false` in your shell or `.env` |
| `401 Unauthorized` on tools | Regenerate PAT with `repo` read scope on GHES |
| `404` from tools | Verify `GITHUB_REPO` and `GITHUB_REF` point at the branch containing `components/` |
| `GET .../contents/components%2Fids - 500` | Run `curl http://localhost:3000/health?probe=github`; fix `GITHUB_REPO`, `GITHUB_REF`, or regenerate PAT |
| `Ignoring extra certs from ... load failed` | `unset NODE_EXTRA_CA_CERTS` or fix `/usr/local/...` typo |
| Port already in use | Stop the other process on 3000, or `PORT=3001 npm run dev` |

---

## Cursor IDE integration

Point developer machines at the central host: `http://<CENTRAL_SERVER_IP>:3000/mcp`.

### Option A — Direct HTTP URL

Project `.cursor/mcp.json` or **Settings → MCP**:

```json
{
  "mcpServers": {
    "sdd-ids-design-spec": {
      "url": "http://<CENTRAL_SERVER_IP>:3000/mcp"
    }
  }
}
```

### Option B — `mcp-remote` proxy (recommended for remote intranet hosts)

```json
{
  "mcpServers": {
    "sdd-ids-design-spec": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "http://<CENTRAL_SERVER_IP>:3000/mcp"
      ]
    }
  }
}
```

Restart Cursor or reload MCP servers after saving.

---

## Developer usage examples

The MCP server does **not** generate code itself — it supplies the authoritative spec bundle your agent needs. In Cursor, reference the connected server (`sdd-ids-design-spec`) and instruct the agent to call MCP tools **before** writing implementation code.

### Golden rule

> Always call `get_component_context` for every component you plan to implement or modify. Never codegen from memory or stale local files when the centralized server is available.

---

### Example 1 — Single component (IDS Button, React)

**Goal:** Implement or update `IdsButton` in React Storybook.

**Step 1 — Discover slug (optional if you already know it):**

Ask Cursor:

```text
Use the sdd-ids-design-spec MCP server. Call list_components for programme "ids"
and confirm the slug for Button.
```

**Step 2 — Fetch deliverable bundle:**

```text
Call get_component_context with:
  programme: "ids"
  componentName: "button"
  framework: "react"

Then implement IdsButton in storybook/src/components/ using only var(--...) tokens
from the returned theme CSS. Match the Storybook parity file where present.
```

**MCP tool input:**

```json
{
  "programme": "ids",
  "componentName": "button",
  "framework": "react"
}
```

**What you get back:** `design-spec.md`, `components/ids/root-spec.md`, `components/ids-theme.css`, and `IdsButton.stories.tsx` (if found).

**Step 3 — Generate in Cursor:**

```text
Using the MCP context above, update IdsButton.tsx and IdsButton.stories.tsx.
Import components/ids-theme.css in Storybook preview. No hardcoded colors.
```

---

### Example 2 — Single component (Synapse programme, IDS inheritance)

**Goal:** Implement Synapse Slider with programme deltas over IDS baseline.

```json
{
  "programme": "synapse",
  "componentName": "slider",
  "framework": "react"
}
```

**Cursor prompt:**

```text
Call get_component_context for programme "synapse", componentName "slider".

The response includes BOTH:
  - IDS baseline design spec + ids-theme.css
  - Synapse programme design spec + synapse-theme.css

Implement SynapseSlider as a thin wrapper over the shared IDS slider where anatomy
matches. Apply programme deltas only where the Synapse spec differs. Use
var(--...) from synapse-theme.css; fall back to ids-theme.css for shared tokens.
```

---

### Example 3 — Single component (Angular)

**Goal:** Angular Storybook parity for IDS Spinner.

```json
{
  "programme": "ids",
  "componentName": "spinner",
  "framework": "angular"
}
```

**Cursor prompt:**

```text
Call get_component_context with framework "angular" for ids/spinner.
Generate ids-spinner Angular component and stories under storybook-angular/
following the returned design spec and Angular story companion.
```

---

### Example 4 — Page composition (multiple components)

**Goal:** Build a **Settings panel page** composed of Button, Slider, and Spinner (IDS, React).

A page is not one MCP call — fetch context for **each** constituent component, then compose.

**Step 1 — List available components:**

```json
{ "programme": "ids" }
```

**Step 2 — Fetch each component bundle (run sequentially or ask Cursor to batch):**

```json
{ "programme": "ids", "componentName": "button",   "framework": "react" }
```

```json
{ "programme": "ids", "componentName": "slider",   "framework": "react" }
```

```json
{ "programme": "ids", "componentName": "spinner",  "framework": "react" }
```

**Step 3 — Compose in Cursor (single prompt after all contexts are loaded):**

```text
I am building a SettingsPanelPage that composes three IDS components:

1. button  — primary "Save" action in the footer
2. slider  — "Notification volume" control in the body
3. spinner — inline loading state on the Save button when isSaving=true

For EACH component above, call get_component_context (programme "ids", framework "react")
before writing any code.

Then create:
  - storybook/src/pages/SettingsPanelPage.tsx
  - storybook/src/pages/SettingsPanelPage.stories.tsx

Composition rules:
  - Import existing IdsButton, Slider, and Spinner — do not reimplement primitives
  - Use layout utilities / flex from the design system; no ad-hoc hex colors
  - Load components/ids-theme.css (already in Storybook preview)
  - Footer: right-aligned Save button; show Spinner inside button slot when loading
  - Body: labeled Slider row with spec-accurate spacing from each component's design-spec
```

**ASCII layout reference for the agent:**

```
┌─────────────────────────────────────────────┐
│  Settings Panel                             │
├─────────────────────────────────────────────┤
│  Notification volume                        │
│  [────────●────────] Slider                 │
│                                             │
├─────────────────────────────────────────────┤
│                        [ Save ] or [⟳ Save] │  ← Button + optional Spinner
└─────────────────────────────────────────────┘
```

---

### Example 5 — Programme page (Synapse dashboard strip)

**Goal:** Compose Synapse Tag, Badge, and Alert in a dashboard summary row.

```text
Call get_component_context for each:
  - synapse / tag    (framework react)
  - synapse / badge  (framework react)
  - synapse / alert  (framework react)

Build SynapseDashboardSummary.tsx that renders a horizontal strip:
  Badge (count) + Tag (status label) + Alert (informational banner below).
Use programme specs and synapse-theme.css; inherit IDS baseline behavior where
the Synapse spec says "same as IDS".
```

---

### Example 6 — DAP programme composition

**Goal:** DAP pagination embedded in a datagrid footer (DAP inherits IDS).

```text
Call get_component_context for:
  - programme "DAP", componentName "pagination", framework "react"

The bundle includes IDS baseline pagination spec + DAP pagination deltas.
Implement the footer pagination using IdsPagination with programme="dap" or the
DAP wrapper per the spec's shared implementation notes.
```

---

### Recommended agent workflow (checklist)

| Step | Action | MCP tool |
|------|--------|----------|
| 1 | Confirm programme folder name (`ids`, `synapse`, `DAP`) | — |
| 2 | Discover slugs if unknown | `list_components` |
| 3 | Fetch spec bundle per component | `get_component_context` |
| 4 | For pages/compositions, repeat step 3 for **every** primitive used | `get_component_context` × N |
| 5 | Implement using `var(--...)` from returned theme CSS | — |
| 6 | Validate against Storybook companion in the MCP response | — |

### Tips for compositions

- **One MCP call per component** — there is no `get_page_context` tool; compose by aggregating multiple `get_component_context` results.
- **Fetch programme root-spec once** — it is included in every `get_component_context` response for that programme; reuse token naming rules across components on the same page.
- **Prefer existing implementations** — the Storybook companion section points to reference `.stories.tsx` / `.stories.ts` files; wrap and compose rather than duplicating primitives.
- **Match `framework`** — pass `"angular"` when generating `storybook-angular` code, `"react"` (default) for `storybook/`.
- **Non-IDS programmes** — always read the IDS baseline sections first, then programme deltas, per `design-spec-programme-inheritance`.

### `framework` parameter (`get_component_context`)

| Value | Parity lookup roots |
|-------|---------------------|
| `react` (default) | `storybook/src/components/`, `storybook-generated/<programme>/src/components/` |
| `angular` | `storybook-angular/src/components/<programme>-<component>/` |

---

## Security notes

- Bind port `3000` only on trusted intranet interfaces (VPC / private subnet).
- Rotate `GITHUB_PERSONAL_ACCESS_TOKEN` regularly; scope to read-only repo access.
- Do not expose `/mcp` to the public internet without TLS termination and authentication.
- `programme` and `componentName` inputs are validated to block path traversal.
- `GITHUB_TLS_VERIFY=false` disables certificate verification — internal networks only.

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---------|----------------|-----|
| Container exits on start | Missing `GITHUB_HOST`, `GITHUB_REPO`, or PAT | Pass `--env-file .env` or all `-e` flags |
| `FATAL: GITHUB_HOST...` in logs | `.env` not loaded into container | Use `--env-file .env` from repo root |
| `self-signed certificate in certificate chain` | Restart server after pull; or add `GITHUB_TLS_VERIFY=false` to `.env` if host is not auto-detected |
| `401 Unauthorized` | Invalid or expired PAT | Regenerate token on GHES with `repo` read |
| `404` from tools | Wrong repo, branch, or path | Verify `GITHUB_REPO` and `GITHUB_REF` |
| Health OK but tools empty | Programme name case mismatch | Use exact folder names: `ids`, `synapse`, `DAP` |
| `GET .../contents/components%2Fids - 500` | Wrong repo/ref, expired PAT, or missing `components/ids` on GHES | Set `GITHUB_REPO` to the repo that contains `components/ids/`; run `curl http://localhost:3000/health?probe=github`; regenerate PAT |
| `Ignoring extra certs from ... load failed` | `NODE_EXTRA_CA_CERTS` points to missing file (typo `/user/local` vs `/usr/local`) | `unset NODE_EXTRA_CA_CERTS` or fix path; server clears invalid value on start |
| Cursor cannot connect | Firewall / wrong IP | `curl http://<CENTRAL_SERVER_IP>:3000/health` from dev machine |
| Port already in use | Another process on 3000 | Change mapping: `-p 8080:3000` |

---

## File reference

| File | Role |
|------|------|
| `server.ts` | Express app, MCP tools, Octokit GHES client |
| `Dockerfile` | Multi-stage production image |
| `package.json` | Node dependencies and build scripts |
| `tsconfig.json` | TypeScript compile config |

# Design Spec Collab (POC)

Dual-agent collaboration for design-spec intake:

1. **Operator** fills the same intake form as [design-spec-portal](../design-spec-portal) (validations + guardrails reused).
2. **Server** packs Figma evidence (REST or stub) and opens **one** session URL. Review is **rules-based** (no heavy server LLM).
3. **Client agent** (Devin, or `scripts/simulate_client.py`) pastes that URL **once**, then loops until accept.
4. On accept, **server** commits allowlisted artifacts via GitHub REST, opens a **PR**, and exposes **artifacts.zip**.

No per-turn re-paste. No Cursor Cloud / no server-side LLM authoring.

## Quick start (stub mode)

```bash
cd apps/design-spec-collab
cp .env.example .env

# Reuse portal venv (or create your own)
uv pip install --python ../design-spec-portal/.venv/bin/python -r backend/requirements.txt

cd backend
../design-spec-portal/.venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8091 --reload
```

Open http://127.0.0.1:8091 — preview → confirm → **Start collab session** → **Copy session URL**.

Simulate the client (revise-then-accept path):

```bash
python3 scripts/simulate_client.py 'http://127.0.0.1:8091/s/SESSION_ID?t=TOKEN'
```

After accept you get a transcript event `pr_dry_run` or `pr_created`, plus **Download artifacts zip** in the UI.

### Real PR

In `.env`:

```bash
GITHUB_PUBLISH_DRY_RUN=false
GITHUB_TOKEN=ghp_...
GITHUB_REPO_URL=https://github.com/org/repo.git
GITHUB_STARTING_REF=master
AUTO_CREATE_PR=true
```

Restart uvicorn. Server creates `collab/<slug>-<id>` branch, commits `design-spec.md` (allowlisted path only), opens PR.

## Architecture

```text
submit → server Figma pack (REST) → session_url (once)
              │
              ▼
     client polls /work ⇄ POST /result   ← LLM only here
              │
     server rule review accept | revise
              │
     on accept → GitHub branch+PR + zip download  ← no LLM
```

### Security

- Session URL includes an unguessable `t=` access token (`401` without it).
- Optional first-client **claim** (`SESSION_REQUIRE_CLAIM=true`): second writer gets `409`.
- TTL via `SESSION_TTL_HOURS`.
- Writes only to `write_path_allowlist` paths from the prompt package.

### Env

See [`.env.example`](.env.example).

| Var | Meaning |
|-----|---------|
| `PUBLIC_BASE_URL` | Absolute session URLs |
| `FIGMA_MODE` | `stub` or `live` |
| `SERVER_REVIEW_MODE` | Keep `rules` (avoid server LLM) |
| `GITHUB_PUBLISH_DRY_RUN` | `true` for local demo without GitHub writes |
| `AUTO_CREATE_PR` | Run publish after accept |

### Reuse

- Frontend copied from design-spec-portal (collab post-submit UX).
- Backend imports portal models/services via `backend/portal_app` → symlink to portal `app`.

Portal itself is unchanged.

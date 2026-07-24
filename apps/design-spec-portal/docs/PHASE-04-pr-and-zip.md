# Phase 4 — PR + zip download

**Status:** Implemented

**Goal:** Agent opens a PR (or portal ensures one); user downloads a zip of generated artifacts.

## What shipped

1. **`CLOUD_AUTO_CREATE_PR`** — passed to Cursor Cloud `Agent.create` (`auto_create_pr`). Dry-run synthesizes a sample PR URL when enabled.
2. **GitHub PR fallback** — after a finished cloud run with a `branch` but no `pr_url`, `job_runner` calls `ensure_pr_for_branch` when `GITHUB_TOKEN` is set.
3. **Job fields** — `branch`, `pr_url`, `ide_checkout_hint` persisted and returned (redacted) from job APIs.
4. **`GET /api/v1/intake/jobs/{id}/artifacts.zip`** — builds a zip from:
   - PR changed files (when `pr_url` + `GITHUB_TOKEN`), else candidate paths on the branch
   - Local monorepo / dry-run placeholder when GitHub fetch yields nothing
   - Always includes `MANIFEST.txt`
5. **Frontend** — PR link + **Download zip** when `status=finished`.
6. **`/health`** — `phase: "4"`, `cloudAutoCreatePr`, `github.configured` / `github.repo`.

## Env

| Variable | Purpose |
|----------|---------|
| `CLOUD_AUTO_CREATE_PR` | Ask Cursor Cloud to open a PR; dry-run shows sample PR URL |
| `GITHUB_TOKEN` | Create/find PR + fetch file blobs for zip |
| `GITHUB_OWNER` / `GITHUB_REPO` | Optional override if `CLOUD_REPO_URL` is not a github.com URL |
| `CLOUD_STARTING_REF` | PR base branch (default `main`) |

## Acceptance

- [x] Finished job can expose `pr_url` (cloud, GitHub ensure, or dry-run sample).
- [x] Zip endpoint returns `application/zip` for finished jobs (at least `MANIFEST.txt` + design-spec path or placeholder in dry-run).
- [x] UI shows PR link + Download zip on finished jobs.
- [ ] Real cloud run: zip contains live `design-spec.md` from the agent branch (verify with `CLOUD_AGENT_DRY_RUN=false`).

## Smoke (dry-run)

```bash
# health
curl -s http://localhost:8090/health | python3 -m json.tool | head

# create job → wait → zip
# (use UI, or POST /api/v1/intake/jobs then GET .../artifacts.zip)
curl -s -o /tmp/spec.zip -w "%{http_code} %{size_download}\n" \
  "http://localhost:8090/api/v1/intake/jobs/<JOB_ID>/artifacts.zip"
unzip -l /tmp/spec.zip
```

## Next

→ [PHASE-05-docker-deploy.md](PHASE-05-docker-deploy.md)

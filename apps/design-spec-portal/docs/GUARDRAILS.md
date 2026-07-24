# Guardrails

| Guardrail | Status | How |
|-----------|--------|-----|
| **Auth** | Placeholder | `AUTH_MODE=disabled\|placeholder\|enforced`. SSO TBD with stakeholders. |
| **Repo lock** | Implemented | Agent always uses server `CLOUD_REPO_URL`; optional `ALLOWED_CLOUD_REPO_URLS`. Clients cannot override. |
| **Secrets** | Implemented | Tokens never in `/health`; API job responses + audit redacted via `services/secrets.py`. |
| **Audit log** | Implemented | JSONL at `data/audit/audit.jsonl` — `GET /api/v1/audit`. |
| **Kill / cancel** | Implemented | `POST /api/v1/intake/jobs/{id}/cancel` + UI button; dry-run interruptible; SDK `run.cancel()` when supported. |
| **Prompt / agent** | Implemented | Skill-only + write-path allowlist + no secrets/no merge-to-main in prompt package. |
| **Additional notes** | Implemented | Optional `additionalNotes` (max 2000). Server rejects secrets, injection/override language, shell/exfil patterns, bidi tricks. Fenced as **UNTRUSTED** in agent prompt; cannot expand write paths. |
| **Theme foundation (new programme)** | Implemented | If programme `*-theme.css` + `root-spec.md` exist → skip. If missing: **reuse** creates programme files that `@import` donor theme + inherit donor root-spec; **generateFromFigma** builds both from variables library. Storybook imports programme `themeCssPath` only. |
| **Storybook discovery** | Implemented | When `storybookExamples`, allowlist includes `storybook/.storybook/main.ts` and prompt requires glob `storybook-generated/*/src/**/*.stories…` so new programmes appear under Spec Generated. |

## AUTH_MODE

| Value | Behavior |
|-------|----------|
| `disabled` | Open access (local default). Optional `X-Portal-Actor`. |
| `placeholder` | Requires `X-Portal-Actor` header (temporary identity). |
| `enforced` | Returns **501** until real SSO is implemented. |

## Env additions

```bash
AUTH_MODE=disabled
ALLOWED_CLOUD_REPO_URLS=https://github.com/teddygraham/SDD-IDS.git
AUDIT_LOG_PATH=   # default: apps/design-spec-portal/data/audit/audit.jsonl
```

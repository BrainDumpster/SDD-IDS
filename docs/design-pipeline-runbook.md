# Design Pipeline — Runbook

Repo: `BrainDumpster/SDD-IDS` (components + Storybook). The repo is the single source of truth;
Claude-side design edits flow back only through this pipeline.

**Programme-agnostic.** Every programme in `data/design-pipeline-registry.json` uses this one
pipeline — IDS, Synapse, DAP today, anything added later. Adding a programme is a registry entry,
not a code change. Programmes are separated by story **title prefix** (`Components/<Programme>`),
not by directory: `storybook/src` carries stories for more than one.

## Roles
- **Designer / teammate**: edits pages in the Claude design project, files a handoff issue. Never touches git.
- **Developer**: runs `/design-pipeline`, owns the PR.
- **Design reviewer** (designated): approves new-component PRs.
- **Anyone on team**: may run the post-merge resync.

## Pipeline

1. **Edit** — Teammate makes changes in the Claude design project (Edit on a page).
2. **File a handoff issue** — In the browser: *New issue → Design handoff*
   (`.github/ISSUE_TEMPLATE/design-handoff.yml`). Same fields as `handoffs/TEMPLATE.md`, rendered as
   a form; screenshots and extracts drag straight in and GitHub hosts them. No git, no branch, no
   checkout. The `Design system` answer is the routing key.
3. **Apply** — A developer runs `/design-pipeline apply #<issue>` in this repo. It validates the
   issue, resolves the programme from the registry, materializes the package into
   `handoffs/<package-name>/` as the branch's first commit, applies the change via
   `apply-design-handoff`, updates stories and the design spec, builds Storybook, and opens a PR
   that closes the issue on merge.
4. **Review & merge** — Normal PR review is the gate. New components additionally require the
   designated design reviewer's approval.
5. **Resync** — After merge, anyone runs `/design-pipeline resync <programme>`. It rebuilds the
   reference Storybook and the bundle, runs validate + compare, and hands off to `/design-sync`.
6. **`/design-sync`** — The operator runs it. See the constraint below.

## The one step that cannot be automated

`/design-sync` is permanently operator-run. The `DesignSync` tool authenticates through the user's
own claude.ai login (or a `/design-login` authorization), its writes are gated behind a
`finalize_plan` the user reviews path-by-path, and the skill is user-started by contract. There is
no API-key or service-account path. Any design that assumes a closed loop is wrong — the pipeline
takes the change as far as the bundle and stops there deliberately.

## What is version-controlled, and why

| Thing | Committed? | Why |
|---|---|---|
| `handoffs/<name>/` | **Yes** | The only durable record of design intent. Claude's Edit is one-way; without this, "who asked for what, and which PR was it" exists nowhere. Lands in `master` in the same merge as the code that implemented it, so `git log handoffs/<name>/` tells the whole story. Immutable once filed. |
| `.design-sync/config.json`, `NOTES.md`, `previews/` | **Yes** | Carry-forward for resyncs. Without them every sync is a cold start: re-derive `titleMap`, re-apply `overrides`, re-grade every component through the compare loop. |
| `data/design-pipeline-registry.json` | **Yes** | Programme routing. |
| `ds-bundle*/` | **No** | Regenerable build output, ~200MB. `.ds-sync/package-build.mjs` rebuilds it. |
| `.design-sync/sb-reference*/`, `*.log`, `.cache/` | **No** | Transient build and verification state. Cross-machine carry-forward comes from the uploaded project's `_ds_sync.json`. |
| The Claude design project's contents | **No** | Derived output, pushed up by `/design-sync`. Mirroring it creates a second source of truth to reconcile. |

## Conventions
- One ephemeral branch per handoff: `handoff/<package-name>`, created by the pipeline, deleted on
  merge. There is no long-lived handoffs branch — intent and implementation merge together.
- Commits `design-handoff(<programme>): <intent>`; the package commit comes first and is never amended.
- Tokens over hardcoded values, always. Never borrow another programme's tokens.
- Every touched component gets its stories updated in the same PR.
- If the programme has a `specRoot`, anatomy/state/token changes update `design-spec.md` too.
- Handoff packages are immutable — corrections go in a new package.

## Failure modes
- **Handoff too vague** → `/design-pipeline apply` comments on the issue naming what is missing and
  stops before opening a PR. Designer files a new issue; the original is closed unactioned.
- **`Design system` unrecognised** → the skill stops and lists known programmes. Never guessed.
- **Conflicting concurrent handoffs to one component** → process serially; the second branch rebases
  on the first PR's merge.
- **Resync forgotten** → drift between repo and design project. It is in the PR template checklist.
- **Resync surfaces a fix** → new handoff issue, not an edit to the merged one.
- **Handoff filed but never built** → the issue stays open, or is closed with a reason. Either way it
  remains searchable — nothing merged, so `master` has no trace, and the issue is the record.

## Open items
- **Handoff source (step 2)**: designers fill the issue form by hand. Whether the Claude-project side
  gets a "Handoff to Claude Code" skill that emits the same fields is deliberately deferred — file
  3–5 handoffs by hand first, then build the generator from what the real ones look like.
- **Issue-form / registry duplication**: the form's `Design system` dropdown lists the enabled
  programme labels, which GitHub issue forms cannot read from the registry. Enabling a programme
  means editing both files.
- **`designProject` UUIDs**: `null` for every programme in the registry. Resolve via `DesignSync`
  `list_projects` on the first resync and record them.
- **CI automation**: moving step 3 into a GitHub Action (`anthropics/claude-code-action` on the
  `design-handoff` label) is **blocked**. Confirmed via the API: this repo is `allowed_actions:
  selected` with `github_owned_allowed: true`, `verified_allowed: false`, `patterns_allowed: []` —
  only `actions/*` and `github/*` run here. There are also no repo secrets, so no `ANTHROPIC_API_KEY`.
  Unblocking means adding `anthropics/claude-code-action@*` to `patterns_allowed`; the decision was
  to leave the restriction in place. Step 6 stays operator-run regardless.

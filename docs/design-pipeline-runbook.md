# Synapse Design Pipeline — Runbook

Repo: `BrainDumpster/SDD-IDS` (components + Storybook). Design system: the "Synapse Design System" Claude project, synced from this repo via `/design-sync`. The repo is the single source of truth; Claude-side edits flow back only through this pipeline.

## Roles
- **Designer / teammate**: edits pages in Claude, initiates handoff.
- **Developer**: runs the skill in Claude Code, owns the PR.
- **Design reviewer** (designated): approves new-component PRs.
- **Anyone on team**: may run the post-merge resync.

## Pipeline (human-in-the-loop)

1. **Edit** — Teammate makes changes in their Claude project (Edit on a page).
2. **Handoff** — Teammate runs the "Handoff to Claude Code" skill in that project to produce the handoff package.
3. **File the package** — Commit the package to the `handoffs/` branch under `handoffs/<package-name>/`, including a filled-in `HANDOFF.md` (copy `handoffs/TEMPLATE.md`). Package name is kebab-case and becomes the PR branch name.
4. **Apply** — A developer opens Claude Code in this repo and runs `/apply-design-handoff` pointing at the package. Claude Code updates/creates components, updates Storybook stories, runs lint/tests, and opens a PR from `handoff/<package-name>` using the PR template.
5. **Review & merge** — Normal PR review is the gate. New components additionally require the designated design reviewer's approval before merge.
6. **Resync** — After merge to `main`, anyone on the team opens the Synapse Design System project in Claude and runs `/design-sync` (or clicks Sync). All consuming projects pick up the update.

## Conventions
- Branches: `handoff/<package-name>`; commits: `design-handoff: <intent>`.
- Tokens over hardcoded values, always.
- Every touched component gets its stories updated in the same PR.
- Handoff packages are immutable once filed — corrections go in a new package.

## Failure modes
- **Handoff too vague** → developer comments on the handoff commit/issue; designer refiles with a clearer `HANDOFF.md`.
- **Conflicting concurrent handoffs to one component** → process serially; second package rebases on the first PR's merge.
- **Resync forgotten** → drift between repo and design system; make resync part of the merge checklist (it's in the PR template).

## Later: automation (option B)
When ready, add a GitHub Action using `anthropics/claude-code-action` triggered by pushes to `handoffs/` (or a `design-handoff` issue label) that runs `/apply-design-handoff` headlessly and opens the PR. Requires an Anthropic API key in repo secrets. The final `/design-sync` step remains operator-run until validated unattended.

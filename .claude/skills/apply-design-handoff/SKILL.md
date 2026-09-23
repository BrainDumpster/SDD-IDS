---
name: apply-design-handoff
description: Apply a design handoff package (Claude-side design-system edits) to a component library and its Storybook, then open a PR. Design-system agnostic.
---

# Apply Design Handoff

You are applying a design change handed off from a Claude design-system project. Normally `/design-pipeline apply` has already materialized the package into `handoffs/<package-name>/` on the current `handoff/<package-name>` branch and calls you for the editing work; an operator may also point you at a package directly. This skill is design-system agnostic — the package's `HANDOFF.md` declares which design system / programme it belongs to.

## Inputs
- Handoff package folder: contains `HANDOFF.md` (filled from `handoffs/TEMPLATE.md`), changed markup/CSS extracts, and screenshots if provided.
- The component source and Storybook stories for the design system named in `HANDOFF.md`.

## Resolving the target design system
1. Read the `Design system` and `Source root` fields in `HANDOFF.md` (e.g. `Synapse — src/components/`, `IDS — packages/ids/src/`).
2. If `Source root` is missing, locate it: find the component named in `Affected components` (search for its file/export name). If multiple design systems in the repo could match, STOP and ask the operator — never guess across programmes.
3. All conventions below are relative to that design system: follow ITS naming prefix, file layout, token stylesheet, and story format — inferred from its nearest existing component, not from any other programme in the repo.

## Rules
1. **Read `HANDOFF.md` first.** It states the design system, intent, affected components, and whether this is an update or a new component.
2. **Existing component**: map the handoff's markup/style diffs onto the component source. Preserve the component's API unless the handoff explicitly changes props. Use the target design system's own design tokens — never hardcode values a token covers, and never borrow tokens from a different programme's stylesheet.
3. **New component**: scaffold it following the conventions of the nearest existing component in the SAME design system (file layout, naming prefix, token usage, exports). New components require design review — note this prominently in the PR description.
4. **Storybook**: for every component touched, update or create its stories in that design system's story location, covering the states shown in the handoff (default plus variants/severities/sizes/themes introduced). Stories must render from the updated component, not copied markup.
5. **Verify**: run the repo's lint, typecheck, tests, and a Storybook build if configured. Fix failures you introduced.
6. **Branch & PR**:
   - Branch: `handoff/<package-name>` off the repo's base branch (`master` here — see `defaults.baseBranch` in `data/design-pipeline-registry.json`). `/design-pipeline` has usually created it already.
   - Commit message: `design-handoff(<design-system>): <short intent>`, kept separate from the package commit, which is never amended.
   - Open the PR with `gh pr create`, using the repo PR template. Fill in the design system, affected components, Storybook updates, and `Closes #<issue>` for the originating handoff issue.
   - Gate: PR review approval for updates; new-component PRs need the designated design reviewer's approval before merge.
7. **Never** modify the handoff package itself, touch components of a different design system, delete components, or restructure folders — scope strictly to what the handoff describes.

## After merge (not your job, but state it in the PR)
Any team member runs `/design-pipeline resync <programme>` to rebuild the bundle, then `/design-sync` against the Claude design-system project named in `HANDOFF.md`, so consuming projects pick up the merged change. `/design-sync` is operator-run and cannot be automated.

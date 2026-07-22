---
name: update-storybook-examples-for-joe-generated-spec
description: >-
  Generate or regenerate Storybook examples for DAP joe-generated components from
  MDX specs and existing TSX/CSS, then verify and validate against the MDX.
  Use when the user names this skill, asks for joe-generated Storybook examples,
  regenerates after MDX/TSX updates under joe-generated, or validates
  Spec Generated/DAP/Joe-Generated stories against components/DAP/joe-generated.
---

# Update Storybook Examples for Joe-Generated Spec

## When to use

- User names **update-storybook-examples-for-joe-generated-spec**
- User asks to create / update / regenerate **joe-generated** Storybook examples
- User asks to verify/validate a joe-generated Storybook example against its MDX
- MDX and/or TSX under joe-generated was updated and stories need refresh

## Hard rules

1. **Stories only** — write/overwrite `*.stories.tsx`. Do **not** edit TSX or CSS (copied from another resource).
2. **No invent** — props, variants, tokens, copy, and assets must come from existing MDX + TSX + CSS only.
3. **Confirm files used** in the final response (list exact paths).
4. **Do not** invent folders, rename folders, or invent MDX/TSX/CSS.

## Expected input

Require a **component** name that matches the folder name on disk (PascalCase as present in the repo, e.g. `About`, `AppLauncher`, `AnchorMenu`).

If the user did not give a component name, ask for it and stop.

## Path contract

| Role | Path |
|------|------|
| Spec dir | `components/DAP/joe-generated/<Component>/` |
| Spec MDX | `components/DAP/joe-generated/<Component>/*.mdx` (usually kebab/lowercase, e.g. `about.mdx`) |
| Storybook dir | `storybook/src/components/dap/joe-generated/<Component>/` |
| TSX | `…/<Component>/<Component>.tsx` |
| CSS | `…/<Component>/<Component>.css` (imported by TSX) |
| Tokens | `storybook/src/components/dap/joe-generated/tokens.css` |
| Stories | `…/<Component>/<Component>.stories.tsx` |
| Story title | `Spec Generated/DAP/Joe-Generated/<Component>` |

`<Component>` must be identical for spec dir and Storybook dir.

## Step 0 — Folder / name validation (fail-fast)

1. Resolve `<Component>` from the user (exact folder spelling).
2. Check both directories exist:
   - `components/DAP/joe-generated/<Component>/`
   - `storybook/src/components/dap/joe-generated/<Component>/`
3. Check required files exist:
   - At least one `*.mdx` in the spec dir
   - `<Component>.tsx` and `<Component>.css` in the Storybook dir
   - `storybook/src/components/dap/joe-generated/tokens.css`
4. If any check fails:
   - **Stop**
   - Tell the user to verify **component name == folder name** on both sides
   - List what was found vs expected
   - Do not create folders or stories

Optional case hint: if the user passed a different casing (e.g. `about`) and a PascalCase folder exists (`About`), report the mismatch and ask them to restate the exact folder name — do not auto-correct.

## Step 1 — Read sources

Read all of:

- Spec MDX under `components/DAP/joe-generated/<Component>/`
- `<Component>.tsx` and `<Component>.css`
- `tokens.css`

Extract from MDX: anatomy, layout, tokens, light/dark states, interactions/a11y, variants.
Extract from TSX: exported props, defaults, variant union, slot structure.
Extract from CSS: measurements, token `var(--…)` usage, variant class hooks.

## Step 2 — Generate or regenerate stories

| Condition | Action |
|-----------|--------|
| `<Component>.stories.tsx` missing | **Generate** |
| MDX and/or TSX updated, or user asks regenerate | **Regenerate** (overwrite stories file) |

### Story file requirements

- Import `../tokens.css`
- Import the component from `./<Component>` (component already imports `./<Component>.css`)
- `title: "Spec Generated/DAP/Joe-Generated/<Component>"`
- `component` meta points at the real TSX export
- `argTypes` / `args` only from existing TSX props
- Stories should cover:
  - **Default** (representative defaults from TSX)
  - One story per **meaningful** variant that exists in both MDX and TSX (skip variants that are named in the union but have no CSS/content only if calling that out in the validation report — still allow control options that match the TSX union)
  - Prefer stories that exercise anatomy slots the Default would otherwise omit (e.g. close, links, system info) **using existing props only**
- **Icon / image paths:** joe-generated TSX often uses `/assets/icons/<slug>.svg`. Storybook serves repo-root `assets/` at `/assets` via `staticDirs` in `storybook/.storybook/main.ts`. When stories pass `logoSlug` / `iconSlug` / similar, use a slug that exists under `assets/icons/` (e.g. `logo-dell-circle-color`, `info-circ-solid`). Validate images are not broken.

Do not add Spec Accurate Design / TokenInspector scaffolding unless those patterns already exist for this joe-generated component.

## Step 3 — Verify and validate (against MDX)

Compare stories + existing TSX/CSS to the MDX. Produce a report:

### Pass / Partial / Fail table

Check at least:

- [ ] Folder name matches component name (spec + Storybook)
- [ ] Anatomy slots present in TSX / exercised by at least one story where props allow
- [ ] Layout & measurements (width, padding, radius, logo size, close size, gaps)
- [ ] Tokens referenced in CSS exist in `tokens.css` (or documented fallback-only gaps)
- [ ] Light state matrix (background / border / text / icon) for key elements
- [ ] Dark theme: semantic tokens (note missing token names)
- [ ] Interactions: close, links, Escape, focus-visible
- [ ] A11y: dialog role / aria, keyboard notes from MDX
- [ ] Variant matrix: MDX variants vs TSX union vs CSS hooks vs story coverage
- [ ] Stories import `tokens.css` and use only this component’s joe-generated TSX/CSS + shared `tokens.css`
- [ ] Icon/image URLs (`/assets/icons/<slug>.svg`) resolve; slugs used in stories exist under `assets/icons/`

### Verdict

- **Pass** — stories + impl align with MDX for checked items
- **Partial** — stories usable; list concrete gaps (impl or coverage)
- **Fail** — blocking mismatches (missing folders/files, stories not using required files, title wrong)

### On gaps

- Report only for **TSX/CSS** issues (do not edit them).
- May regenerate **stories** to improve coverage if props already support it.
- Ask the user if they want anything else after the report.

## Step 4 — Final response format

1. One-line verdict (Pass / Partial / Fail)
2. Mode used: Generate | Regenerate | Validate-only
3. **Files used** (exact paths)
4. Story title path
5. Validation table (Pass/Partial/Fail + short notes)
6. Gaps / next steps (stories-only fixes done vs TSX/CSS left to the user)

## Validate-only mode

If the user asks only to verify/validate and not regenerate:

1. Still run Step 0 folder validation
2. Skip overwrite unless stories are missing (then ask before generating)
3. Run Step 3 report against existing stories + TSX/CSS + MDX

## Invoke example

```text
Run update-storybook-examples-for-joe-generated-spec for Alert
```

Replace `Alert` with the exact folder name under both `components/DAP/joe-generated/<Component>/` and `storybook/src/components/dap/joe-generated/<Component>/`.

### Other triggers

- “Create joe-generated Storybook for Badge”
- “Regenerate Joe-Generated About stories after MDX update”
- “Validate Spec Generated/DAP/Joe-Generated/Accordion against its MDX”

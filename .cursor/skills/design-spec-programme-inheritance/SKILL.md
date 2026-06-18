---
name: design-spec-programme-inheritance
description: Generate any programme design-spec.md with IDS baseline + programme deltas — interview, live programme Figma MCP, full spec write. Use for inheritance, IDS-fork, programme deltas, or docs/design-spec-programme-inheritance.md base prompt. Programme-agnostic (Synapse, DAP, or any config in design_systems).
---

# Programme Inheritance Design-Spec Skill

**Single entry point** for any **programme layer** spec that inherits from IDS.

Use when a programme shares IDS component anatomy/API but its Figma file shows programme-specific token, layout, or chrome changes.

**Do not** blind-copy `components/ids/<slug>/design-spec.md`.  
**Do not** write a deltas-only file — always produce a **full** programme `design-spec.md` (10 required `##` sections).

| Resource | Path |
|----------|------|
| User-facing process | `docs/design-spec-programme-inheritance.md` |
| Registry | `data/programme-inheritance-registry.json` |
| Authoring contract | `docs/design-spec-authoring-contract.md` |
| Scaffold template | `scripts/design_spec_template.py` → `PROGRAMME_IDS_FORK_TEMPLATE` |

Pair with **design-spec-blueprint** for section hardening. Redirect to **design-spec-intake-wizard** for IDS-only or programme-standalone specs (no IDS counterpart).

---

## What counts as a programme?

A **programme** is any design system that **layers on IDS**, resolved from config — not a hardcoded list.

**Detect programmes:**

1. Read `config/design_systems/*.yaml` (exclude `ids.yaml`).
2. A file is a programme when it defines `baseline_components_dir: components/ids` (or another IDS baseline path) **and** a distinct `components_dir` / `program_components_dir`.
3. Cross-check `data/programme-inheritance-registry.json` → `programmes` for registered paths.
4. Load via `config/design_system_config.py` → `load_design_system("<slug>")`.

**Required config fields per programme** (from yaml):

| Field | Use |
|-------|-----|
| `name` / `display_name` | Metadata, deltas heading, Storybook group |
| `components_dir` | Output spec folder |
| `figma_map_path` | Programme component map |
| `theme_css_path` | Resolved token values |
| `baseline_components_dir` | IDS baseline specs (usually `components/ids`) |
| `alias_path` (optional) | Component name → slug aliases |
| `root_spec_path` (optional) | Programme-wide token catalog |
| `generated_storybook_dir` (optional) | Storybook output hint |

If the user names a programme with no yaml yet, stop and bootstrap `config/design_systems/<slug>.yaml` + registry entry before run phase.

---

## When to use (vs plain intake)

| Situation | Skill |
|-----------|-------|
| New IDS-only component | **design-spec-intake-wizard** |
| **Any programme** inherits IDS anatomy + API | **This skill** |
| Programme-native UI (no IDS counterpart) | **design-spec-intake-wizard** → `standalone` spec |

---

## Pattern decision (before run)

| Signal | Pattern | Notes |
|--------|---------|-------|
| Same Figma component-set / anatomy as IDS | `ids-fork` | Default for this skill |
| Programme-only composition (no IDS counterpart) | `standalone` | Use intake wizard instead |
| Mostly IDS; 1–2 verified inline overrides | `sparse-deltas` | Still full spec; deltas table may be short (registry may label `dap-style`) |

Register in `data/programme-inheritance-registry.json` (`status: draft` → `active` when checklist passes).

---

## Figma URL intake (three buckets)

Collect **programme** Figma links (never IDS-only evidence for finalization):

| Bucket | Purpose | MCP use |
|--------|---------|---------|
| **Main component** | Component set / composed frame | `get_metadata` + `get_design_context` — anatomy, axes, default size |
| **Elements** | Sub-component sets, slots | `get_design_context` + `get_variable_defs` — per-slot tokens |
| **States** | Variant/state rows | `get_variable_defs` (+ `get_design_context` if needed) — state matrix |

- **Multiple URLs per bucket** are normal; user may paste several at once or one-by-one until `done`.
- Parse `node-id` hyphen → colon for MCP (`43461-175960` → `43461:175960`).
- Parse `fileKey` from `/design/<fileKey>/`.
- If user pastes all three blocks in one message, skip interview and go to **summary → yes**.

---

## Interview phase (strict)

**Do not** call Figma or write files until the user confirms the summary with `yes`.

**One question per message** if any required field is missing:

| # | Ask | Notes |
|---|-----|--------|
| 1 | **Programme?** | Any slug with a programme yaml (e.g. `synapse`, `dap`, …). **IDS** → redirect to design-spec-intake-wizard |
| 2 | **Component display name?** | e.g. `Modal Dialog` |
| 3 | **IDS baseline component?** | e.g. `Modal` / `Main Menu/Left`; resolve from IDS map if `unknown` |
| 4 | **Main component URL(s)?** | At least one; multiple allowed; `done` when finished |
| 5 | **Element URL(s)?** | Repeat: “another element URL or `done`” |
| 6 | **State URL(s)?** | Repeat: “another state URL or `done`” |
| 7 | **Storybook?** | `yes` / `no` |
| 8 | **Confirm summary** | programme slug + display name, output path, IDS baseline, **node IDs by Main / Elements / States**, pattern |

After step 1, load programme config from `config/design_systems/<programme>.yaml`.

---

## Run phase (after `yes`)

### Step 1 — Resolve sources

1. **Programme config:** `load_design_system(programme)` → paths below.
2. **IDS baseline:** `{baseline_components_dir}/<ids-slug>/design-spec.md` (from `data/component-figma-map.json` or user path).
3. **Programme slug:** slugify display name; check `{alias_path}` if present.
4. **Output path:** `{components_dir}/{slug}/design-spec.md`.

### Step 2 — Live Figma MCP (mandatory)

On **programme nodes only** (never finalize from IDS nodes alone):

| Tool | Purpose |
|------|---------|
| `get_metadata` | Structure, variant axes, dimensions |
| `get_design_context` | Padding, radius, slot order (`disableCodeConnect: true` when needed) |
| `get_variable_defs` | Token bindings per variant/state |

Minimum nodes per component:

- Main component set
- One variant per axis edge case
- Shared element sets referenced in anatomy

Process order: **main → elements → states**. Record every checked node ID in **Metadata** + **Source Mapping**.

### Step 3 — Build programme deltas table

Heading: **`### {display_name} programme deltas (vs IDS)`** — use programme `display_name` from yaml.

Compare **row by row** against IDS spec:

| Category | Compare |
|----------|---------|
| Layout | width, height, min/max, padding per slot |
| Chrome | border sides, radius, shadow, gradient |
| Tokens | `var(--...)` per state cell (Background / Border / Text / Icon) |
| Anatomy | programme-only slots or removed slots |
| Typography | font token changes |
| API defaults | `aria-*`, story args, default labels |
| Sample data | Figma placeholder text/icons |

**Rules:**

- Omit rows **identical** to IDS — inherit by reference in prose.
- Never assume same token because component-set **name** matches — always `get_variable_defs` on programme nodes.
- Scenarios **not** verified in programme Figma → inherit IDS section by reference (do not copy IDS numbers without programme proof).

### Step 4 — Write spec file

Path: `{components_dir}/{slug}/design-spec.md`

#### Required opening (before `## Metadata`)

```markdown
## IDS baseline (layout, flow, contracts)
{DisplayName} **{Name}** shares the {IDS Name} component family. … match IDS unless **{DisplayName} programme deltas**.

- **IDS source of truth:** relative link to `{baseline_components_dir}/{ids-slug}/design-spec.md`
- **Shared implementation:** `{path}` + `programme="{programme-slug}"` (if applicable)
- **Programme wrapper (if any):** `{path}`
```

#### Metadata must include

- `Spec pattern: ids-fork` (or `sparse-deltas` / registry alias)
- `Design System: {display_name}` (from programme yaml)
- `IDS baseline slug: {ids-slug}`
- `Status: draft` until checklist passes
- Programme Figma file key + validated node IDs
- `Theme CSS: {theme_css_path}` (from programme yaml)

#### Section inheritance rules

| Section | Rule |
|---------|------|
| Anatomy | Full slot order; mark programme-only branches |
| Layout & Measurements | **Full programme values** where different; `(Same as IDS …)` for unchanged |
| Tokens | Programme-specific surfaces/borders; pointer to IDS for shared typography |
| States (Light) | **Full table for differing rows**; inherit IDS for identical scenario rows |
| States (Dark) | Boilerplate pointer if same `var(--...)` as Light (per authoring contract) |
| Interactions / API | IDS contract + programme-only behavior |
| Codegen Contract | **Complete** — gates require concrete checklist |
| Source Mapping | **Both** IDS parity ref + programme nodes + MCP evidence date |

Scaffold: `PROGRAMME_IDS_FORK_TEMPLATE` in `scripts/design_spec_template.py`. Substitute `{programmeDisplayName}`, `{programmeSlug}`, `{themeCssPath}`, `{figmaMapPath}`, `{storybookTitlePrefix}` from programme yaml (`storybookTitlePrefix` default: `Spec Generated/{display_name}`).

### Step 5 — Theme vs spec split

| Layer | Holds |
|-------|-------|
| Component spec | Semantic `var(--token-name)` per slot/state |
| Programme `theme_css_path` | Resolved Light/Dark values |
| Programme `root_spec_path` (if set) | Programme-wide catalog |

Do **not** duplicate the full global token list in every component spec.

### Step 6 — Map + registry

Update programme `{figma_map_path}`:

- `designSpecPath`, `specPattern: ids-fork`, `idsBaselineSpecPath`
- `mainComponentSetNodeId`, supplemental element/state `*NodeId` fields from URL buckets

Upsert `data/programme-inheritance-registry.json` under `programmes.<slug>` if missing, then `components[]`. Set `status: active` when checklist passes.

### Step 7 — Optional artifacts

- `storybook/src/spec-contracts/<programme>-<slug>.contract.ts` when useful.
- **Storybook** (when requested): `{storybookTitlePrefix}/<Display Name>` + **Spec Accurate Design**; import programme theme CSS; args match spec defaults.

### Step 8 — Implementation (optional; only when requested)

Prefer shared IDS component + `programme="{slug}"` CSS modifiers, or a thin programme wrapper. Never hardcode colors — use `var(--...)` from spec + programme theme CSS.

---

## Inheritance rules (non-negotiable)

1. **Full spec file** — never deltas-only markdown.
2. **Programme Figma evidence** — never finalize from IDS nodes alone.
3. **Unverified scenarios** inherit IDS by reference (do not copy IDS numbers without programme proof).
4. **Tokens** — `var(--...)` in spec; resolved values in programme theme CSS.
5. **Dark states** — dedupe per authoring contract when Light/Dark use same semantic tokens.

---

## Reference examples (not exhaustive)

These are **examples** of the same workflow — not the only supported programmes:

| Programme | Component | Programme spec | IDS baseline |
|-----------|-----------|----------------|--------------|
| synapse | Left Nav | `components/synapse/left-nav/design-spec.md` | `components/ids/main-menu-left/design-spec.md` |
| synapse | Modal | `components/synapse/modal/design-spec.md` | `components/ids/modal/design-spec.md` |
| dap | Pagination | `components/DAP/pagination/design-spec.md` | IDS pagination (`sparse-deltas`) |

More Synapse walkthrough detail: `docs/design-spec-synapse-ids-fork.md` (reference doc only).

---

## Completion checklist (before Status: active)

- [ ] Programme config loaded; IDS baseline linked in opening section
- [ ] `{display_name} programme deltas` table complete (**verified** diffs only; no TBD in behavior-critical rows)
- [ ] Live Figma MCP on programme nodes (not IDS-only evidence)
- [ ] All 10 `##` sections present; Codegen Contract + validation checklist complete
- [ ] Dark states deduped when Light/Dark use same semantic tokens
- [ ] Programme figma map + `programme-inheritance-registry.json` updated
- [ ] Storybook (if requested) under programme story prefix with programme theme CSS

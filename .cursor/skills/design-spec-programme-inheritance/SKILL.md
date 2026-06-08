---
name: design-spec-programme-inheritance
description: Generate programme design-spec.md inheriting from IDS (Synapse, DAP) — baseline pointer, programme deltas table, live programme Figma MCP. Use when user asks for inheritance, IDS-fork, programme deltas, Synapse from IDS base, DAP from IDS base, or paste docs/design-spec-programme-inheritance.md base prompt.
---

# Programme Inheritance Design-Spec Skill

Use when a **programme** (Synapse, DAP) shares IDS component anatomy/API but Figma shows programme-specific token, layout, or chrome changes.

**User-facing process:** `docs/design-spec-programme-inheritance.md`  
**Registry:** `data/programme-inheritance-registry.json`  
**Authoring contract:** `docs/design-spec-authoring-contract.md`

For Synapse-only detail after routing, also follow `design-spec-synapse-ids-fork` skill.

---

## Figma URL intake (user’s usual pattern)

Collect programme Figma links in **three buckets**:

| Bucket | Purpose | MCP use |
|--------|---------|---------|
| **Main component** | Component set / composed frame | `get_metadata` + `get_design_context` — anatomy, axes, default size |
| **Elements** | Sub-component sets, slots | `get_design_context` + `get_variable_defs` — per-slot tokens |
| **States** | Variant/state rows | `get_variable_defs` (+ `get_design_context` if needed) — state matrix |

- **Multiple URLs per bucket** are normal; user may paste several at once or one-by-one until `done`.
- Parse `node-id` hyphen → colon for MCP.
- If user pastes all three blocks in one message, skip interview and go to **summary → yes**.

---

## Interview phase (strict)

**Do not** call Figma or write files until the user confirms the summary with `yes`.

**One question per message** if any required field is missing:

| # | Ask | Notes |
|---|-----|--------|
| 1 | **Programme?** | `Synapse` or `DAP` (IDS-only → redirect to design-spec-intake-wizard) |
| 2 | **Component display name?** | e.g. `Modal Dialog` |
| 3 | **IDS baseline component?** | e.g. `Modal` / `Main Menu/Left`; resolve from map if `unknown` |
| 4 | **Main component URL(s)?** | At least one; multiple allowed; `done` when finished |
| 5 | **Element URL(s)?** | Repeat: “another element URL or `done`” |
| 6 | **State URL(s)?** | Repeat: “another state URL or `done`” |
| 7 | **Storybook?** | `yes` / `no` |
| 8 | **Confirm summary** | programme, slug, `designSpecPath`, IDS baseline, **node IDs grouped by Main / Elements / States**, pattern |

Load programme config: `config/design_systems/<programme>.yaml` → `components_dir`, `figma_map_path`, `theme_css_path`, `baseline_components_dir`.

---

## Run phase (after `yes`)

1. Read IDS `components/ids/<ids-slug>/design-spec.md` (or user-provided baseline).
2. **Live Figma MCP** on **all programme URLs** (main, then elements, then states):
   - `get_metadata`, `get_design_context` (`disableCodeConnect: true` if needed), `get_variable_defs`
   - Record which node IDs were checked in Metadata + Source Mapping
3. Build **`### <Programme> programme deltas (vs IDS)`** by comparing MCP output to IDS baseline — omit identical rows.
4. Write `components/<programme-dir>/<slug>/design-spec.md`:
   - Open with **`## IDS baseline (layout, flow, contracts)`**
   - All 10 required `##` sections
   - Scaffold: `scripts/design_spec_template.py` → `SYNAPSE_IDS_FORK_TEMPLATE` (rename deltas heading for DAP: `DAP programme deltas`)
   - `Status: draft` until checklist passes
5. Update programme figma map: `designSpecPath`, `specPattern: ids-fork`, `idsBaselineSpecPath`, `mainComponentSetNodeId`, supplemental element/state `*NodeId` fields from user URL buckets.
6. Upsert `data/programme-inheritance-registry.json`.
7. Add `storybook/src/spec-contracts/<programme>-<slug>.contract.ts` when useful.
8. If Storybook `yes`: `Spec Generated/<Programme>/<Name>` + **Spec Accurate Design**; import programme theme CSS.

---

## Pattern decision

| Signal | Pattern |
|--------|---------|
| Same Figma component-set / anatomy as IDS | `ids-fork` |
| Programme-only composition | `standalone` |
| DAP, few inline overrides | `dap-style` (still full spec; deltas may be short) |

---

## Inheritance rules (non-negotiable)

1. **Full spec file** — never deltas-only markdown.
2. **Programme Figma evidence** — never finalize from IDS nodes alone.
3. **Unverified scenarios** inherit IDS by reference (do not copy IDS numbers without programme proof).
4. **Tokens** — `var(--...)` in spec; values in programme theme CSS.
5. **Dark states** — dedupe per authoring contract when Light/Dark use same semantic tokens.

---

## Programme routing

| Programme | Delta section title | Theme | Storybook prefix |
|-----------|---------------------|-------|------------------|
| Synapse | `Synapse programme deltas (vs IDS)` | `synapse-theme.css` | `Spec Generated/Synapse` |
| DAP | `DAP programme deltas (vs IDS)` | `dap-theme.css` | `Spec Generated/DAP` |

---

## Examples in repo

| Programme | Component | Spec |
|-----------|-----------|------|
| Synapse | Left Nav | `components/synapse/left-nav/design-spec.md` |
| Synapse | Modal | `components/synapse/modal/design-spec.md` |
| DAP | Pagination | `components/DAP/pagination/design-spec.md` (dap-style) |

---

## Completion checklist

- [ ] IDS baseline linked
- [ ] Programme deltas table complete (verified diffs only)
- [ ] Live Figma MCP evidence in Metadata + Source Mapping
- [ ] Figma map + registry updated
- [ ] Codegen Contract + validation checklist present
- [ ] Storybook (if requested) under Spec Generated

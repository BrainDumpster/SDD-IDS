---
name: design-spec-synapse-ids-fork
description: Generate Synapse design-spec.md when IDS is the base — IDS baseline pointer, programme deltas table, live Synapse Figma verification. Use when Synapse reuses the same Figma component family as IDS with token/layout/chrome changes, or user mentions IDS-fork, programme deltas, or Synapse inheritance from IDS.
---

# Synapse IDS-Fork Design Spec Skill

Use when **Synapse** reuses the **same Figma component family** as **IDS** (same anatomy / component-set naming) but designers changed colors, spacing, border-radius, borders, or added programme slots.

**Prefer the parent skill first:** **design-spec-programme-inheritance** (`docs/design-spec-programme-inheritance.md`) — this skill adds Synapse-specific detail.

**Do not** blind-copy `components/ids/<slug>/design-spec.md`.  
**Do not** write a deltas-only file — always produce a **full** `components/synapse/<slug>/design-spec.md` (10 required `##` sections).

## References

| Resource | Path |
|----------|------|
| Workflow doc | `docs/design-spec-synapse-ids-fork.md` |
| Authoring contract | `docs/design-spec-authoring-contract.md` |
| Pattern registry | `data/programme-inheritance-registry.json` |
| Scaffold template | `scripts/design_spec_template.py` → `SYNAPSE_IDS_FORK_TEMPLATE` |
| Canonical example 1 | `components/synapse/left-nav/design-spec.md` ← `components/ids/main-menu-left/design-spec.md` |
| Canonical example 2 | `components/synapse/modal/design-spec.md` ← `components/ids/modal/design-spec.md` |

Pair with **design-spec-blueprint** for section hardening and **design-spec-intake-wizard** when the user has not supplied programme + component + Figma URL together.

---

## Step 0 — Decide pattern (30 seconds)

| Question | If yes → |
|----------|----------|
| Same Figma component-set / anatomy as IDS? | Continue IDS-fork |
| Synapse-only composition (no IDS counterpart)? | Use **standalone** spec (no baseline block) |
| Only 1–2 inline overrides on otherwise IDS spec? | IDS-fork or DAP-style notes |

Register in `data/programme-inheritance-registry.json` (`programme: synapse`, `pattern: ids-fork`, `status: draft` → `active`).

---

## Step 1 — Resolve sources

1. **IDS baseline:** `components/ids/<ids-slug>/design-spec.md` (from `data/component-figma-map.json` → `Dialog` maps to `modal`).
2. **Synapse Figma URLs** (three buckets — `docs/design-spec-programme-inheritance.md`):
   - **Main component** URL(s)
   - **Elements** URL(s)
   - **States** URL(s)
3. **Aliases:** `data/synapse-component-aliases.json` (e.g. `Modal Dialog` → `dialog`).
4. Parse URL: `fileKey` from `/design/<fileKey>/`; `node-id=43461-175960` → `43461:175960`.

---

## Step 2 — Live Figma MCP (mandatory)

On **Synapse nodes only** (never finalize from IDS nodes alone):

| Tool | Purpose |
|------|---------|
| `get_metadata` | Structure, variant axes, dimensions |
| `get_design_context` | Padding, radius, slot order (`disableCodeConnect: true` when needed) |
| `get_variable_defs` | Token bindings per variant/state |

Minimum nodes per component:

- Main component set (e.g. `ModalDialog-Main` `43461:175960`)
- One variant per axis edge case (e.g. `Type=Non-Alerting` `43461:175961`, `Type=Destructive` `43461:176040`)
- Shared element set if referenced (e.g. `.Modal-Element-Content`)

Record evidence in **Metadata** + **Source Mapping**.

---

## Step 3 — Build programme deltas table

Compare **row by row** against IDS spec. Categories:

| Category | Compare |
|----------|---------|
| Layout | width, height, min/max, padding per slot |
| Chrome | border sides, radius, shadow, gradient |
| Tokens | `var(--...)` per state cell (Background / Border / Text / Icon) |
| Anatomy | Synapse-only slots or removed slots |
| Typography | font token changes |
| API defaults | `aria-*`, story args, default labels |
| Sample data | Figma placeholder text/icons |

**Rule:** Omit rows **identical** to IDS — inherit by reference in prose.

**Rule:** Never assume same token because component-set **name** matches — always `get_variable_defs` on Synapse (Left Nav selected icon is a real divergence).

---

## Step 4 — Write spec file

Path: `components/synapse/<slug>/design-spec.md`

### Required opening (before `## Metadata`)

```markdown
## IDS baseline (layout, flow, contracts)
Synapse **{Name}** shares the {IDS Name} component family. … match IDS unless **Synapse programme deltas**.

- **IDS source of truth:** [`../ids/{ids-slug}/design-spec.md`](../ids/{ids-slug}/design-spec.md)
- **Shared implementation:** `{path}` + `programme="synapse"` (if applicable)
- **Synapse wrapper (if any):** `{path}`
```

### Metadata must include

- `Spec pattern: ids-fork`
- `IDS baseline slug: {ids-slug}`
- `Status: draft` until checklist passes
- Synapse Figma file key + validated node IDs
- `Theme CSS: components/synapse-theme.css`

### Section inheritance rules

| Section | IDS-fork rule |
|---------|---------------|
| Anatomy | Full slot order; mark Synapse-only branches |
| Layout & Measurements | **Full Synapse values** where different; `(Same as IDS …)` for unchanged |
| Tokens | Synapse-specific surfaces/borders; pointer to IDS for shared typography |
| States (Light) | **Full table for differing rows**; inherit IDS for identical scenario rows |
| States (Dark) | Boilerplate pointer if same `var(--...)` as Light |
| Interactions / API | IDS contract + Synapse-only behavior |
| Codegen Contract | **Complete** — gates require concrete checklist |
| Source Mapping | **Both** IDS parity ref + Synapse nodes + MCP evidence date |

Scaffold: `SYNAPSE_IDS_FORK_TEMPLATE` in `scripts/design_spec_template.py`.

---

## Step 5 — Theme vs spec split

| Layer | Holds |
|-------|-------|
| Component spec | Semantic `var(--token-name)` per slot/state |
| `components/synapse-theme.css` | Resolved Light/Dark values |
| `components/synapse/root-spec.md` | Programme-wide catalog |

Do **not** duplicate the full global token list in every component spec.

---

## Step 6 — Map + registry

Update `data/synapse-component-figma-map.json`:

- `designSpecPath`: `components/synapse/<slug>/design-spec.md`
- `specPattern`: `ids-fork`
- `idsBaselineSpecPath`: IDS spec path
- `mainComponentSetNodeId`, element/state node IDs from MCP

Update `data/programme-inheritance-registry.json` entry to `active` when checklist passes.

---

## Step 7 — Implementation (optional; only when requested)

Prefer:

1. Shared IDS component + `programme="synapse"` CSS modifiers, or
2. Thin Synapse wrapper component.

Never hardcode colors — use `var(--...)` from spec + `synapse-theme.css`.

---

## Step 8 — Storybook (when requested)

- Title: `Spec Generated/Synapse/<Display Name>`
- Primary story: **Spec Accurate Design**
- Import: `components/synapse-theme.css`
- Args must match **Spec Accurate Design story defaults** in spec

---

## Inheritance checklist (before Status: active)

- [ ] IDS baseline linked; deltas table has every **verified** difference
- [ ] No TBD in behavior-critical sections
- [ ] Live Figma MCP on Synapse nodes (not IDS-only evidence)
- [ ] All 10 `##` sections present; Codegen Contract complete
- [ ] Dark states deduped when Light/Dark use same semantic tokens
- [ ] Figma map + registry updated
- [ ] Validation checklist in spec marked pass/fail honestly

---

## Modal quick path (user URL example)

**Synapse:** `ModalDialog-Main` — node `43461:175960`  
**IDS baseline:** `components/ids/modal/design-spec.md` (`Modal-Main` / dialog matrix)

Verified Synapse dialog deltas vs IDS:

- Dialog uses **fixed 640px** width (“use small modal only” in Figma)
- Surface **radius `var(--corner-radius-radius-16)`** (IDS dialog baseline: `0`)
- Border **`var(--color-border-neutral-light)`** (IDS: `var(--color-border-accessible)`)
- Header padding **`padding-24` top / `padding-8` bottom** (IDS: `20` / `4`)
- Same dialog `type` axis: Non-Alerting, Informational, Warning, Major, Critical, Destructive

Full spec: `components/synapse/modal/design-spec.md`.

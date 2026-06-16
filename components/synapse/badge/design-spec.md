# Badge Design Spec

## IDS baseline (layout, flow, contracts)

Synapse **Badge** is an **ids-fork** of the IDS **Badge** family. Pill geometry (18×18), severity type variants, and presentational API **inherit IDS** unless listed in **Synapse programme deltas** below.

- **IDS source of truth:** [`components/ids/badge/design-spec.md`](../ids/badge/design-spec.md)
- **Shared implementation:** `storybook/src/components/Badge.tsx`, `Badge.module.css`
- **Theme CSS:** `components/synapse-theme.css` (no programme layout aliases)

**Figma scope:** Synapse Alerts board `11067:54637` embeds component set `11446:99238` (same variants as IDS).

## Metadata

| Property | Value |
|---|---|
| Component | Badge |
| Design system | Synapse |
| Category | Alerts |
| Spec pattern | **ids-fork (override-only)** |
| IDS baseline slug | `badge` |
| Status | **active** |
| Version | 1.0.0 |
| Figma board node | `11067:54637` — [Badge](https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components?node-id=11067-54637&m=dev) |
| Component set / matrix | `11446:99238` |
| Spec-accurate instance | `11446:99257` (`Type=Default, Background=White/Gray`) |
| IDS Figma node | `11446:99238` (file `VZJ48bbVYrIynw8DdSukWw`) |
| Theme CSS | `components/synapse-theme.css` |
| Verification method | Figma MCP (`get_metadata`, `get_variable_defs`) + IDS baseline |
| Last verified | 2026-06-05 |

### Synapse programme deltas (vs IDS)

| Topic | IDS | Synapse (Figma `11446:99257`) |
|---|---|---|
| Pill height / radius | 18px, `100px` (pill) | **Same** |
| Type variants | default / critical / warning / disabled / success | **Same** |
| Default background token | `var(--color-background-alerting-info)` | **`var(--color-background-alerting-info-1)`** (Synapse theme; same semantic role) |
| Typography | 12px, weight 400 | **Same** |
| Runtime API | IDS contract | **Same** (inherit IDS) |

**No programme layout aliases.** Blue/White-Gray background in Figma is showcase context only (not a runtime prop).

## Anatomy

Inherit IDS **Anatomy** — `BadgeRoot` → `BadgeContainer` → `BadgeContent`. See [`components/ids/badge/design-spec.md`](../ids/badge/design-spec.md).

## Layout & Measurements

Inherit IDS 18px height, pill radius, horizontal padding rules (single/two/three+ digits), and 12px typography from IDS **Layout & Measurements**.

## Tokens

Inherit IDS **Tokens** and **States (Light Theme)** type matrix. Default type resolves via `var(--color-background-alerting-info, var(--color-background-alerting-info-1))` in shared implementation.

## States (Light Theme)

Inherit IDS **States (Light Theme)** from [`components/ids/badge/design-spec.md`](../ids/badge/design-spec.md).

## States (Dark Theme)

Dark theme uses the same semantic tokens as **States (Light Theme)**. Resolved values for `[data-theme="dark"]` live in `components/synapse-theme.css`.

## Interactions

Inherit IDS **Interactions** — presentational by default; host-controlled interactivity.

## Composition & API (runtime)

### IDS inheritance resolution

Codegen **MUST** resolve `value`, `type`, `as`, and `ariaLabel` from IDS **Composition & API (runtime)**.

### Synapse-only runtime flags

None.

### Storybook defaults

Mirror IDS badge type matrix under **Spec Generated/Synapse/Badge** with `components/synapse-theme.css` imported.

## Codegen Contract (Framework-Agnostic Blueprint)

### IDS baseline resolution

Generators **MUST** load and merge the IDS baseline contract from [`components/ids/badge/design-spec.md`](../ids/badge/design-spec.md) (`## Codegen Contract`) before applying Synapse programme overrides below.

### Programme override rules

| Rule | IDS | Synapse |
|---|---|---|
| Geometry / type matrix | IDS contract | **Inherit IDS** |
| Default type fill token | `var(--color-background-alerting-info)` | **Same role** via theme (`--color-background-alerting-info-1` in Synapse CSS) |

### Deterministic structure

Inherit IDS: `BadgeRoot` → `BadgeContainer` → `BadgeContent`.

### Variant matrix

Inherit IDS: `type` × `value` (string | number).

### Per-slot style contract

Inherit IDS pill dimensions, border, typography, warning border host override token.

### Behavior contract

Inherit IDS presentational output; no internal state machine.

### Accessibility contract

Inherit IDS `span` default, `ariaLabel` for ambiguous numeric values.

### Asset resolution + bundling contract

No image assets for baseline badge.

### Fallback/error rules

Inherit IDS unknown type → `default`, empty value warning.

Programme additions:

- Import **`components/synapse-theme.css`** for Synapse targets.

### Validation checklist

- [x] IDS baseline linked; programme delta documents info token naming only
- [x] Codegen Contract subsections concrete
- [x] Figma MCP evidence on `11446:99257` (18×18, info-1 fill, white border/text)
- [x] Storybook `Spec Generated/Synapse/Badge` loads `components/synapse-theme.css`
- [x] Registry: `data/programme-inheritance-registry.json` → `synapse` / `badge`

## Source Mapping

| Property | Value |
|---|---|
| IDS baseline | `components/ids/badge/design-spec.md` — node `11446:99238` |
| Programme spec | `components/synapse/badge/design-spec.md` |
| Synapse Figma file | `Td1bnsvRj1PCGs9RVJkIvJ` |
| Board | `11067:54637` |
| Component set | `11446:99238` |
| Spec-accurate cell | `11446:99257` |
| Implementation | `storybook/src/components/Badge.tsx` |
| Programme wrapper | `storybook/src/components/SynapseBadge.tsx` |
| Spec contract | `storybook/src/spec-contracts/synapse-badge.contract.ts` |
| Storybook | `storybook/src/components/SynapseBadge.stories.tsx` |
| Verification | Figma MCP `get_variable_defs` on `11446:99257` (2026-06-12) |

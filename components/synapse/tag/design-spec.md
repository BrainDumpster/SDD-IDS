# Tag Design Spec

## IDS baseline (layout, flow, contracts)

Synapse **Tag** is a **thin ids-fork** of the IDS **Tag** chip (read-only, clickable, editable/dismissible, badge variants; alerting tones; pill geometry). Anatomy, size tracks, variant matrix, interaction contracts, and runtime API **inherit IDS** unless listed in **Synapse programme deltas** below.

- **IDS source of truth:** [`components/ids/tag/design-spec.md`](../ids/tag/design-spec.md)
- **Shared implementation:** `storybook/src/components/Tag.tsx`, `Tag.module.css`
- **Programme chrome:** `programme="synapse"` on shared `Tag` (no separate theme layout alias)
- **Theme CSS:** `components/synapse-theme.css` (Synapse semantic tokens for programme-only rows, e.g. `--color-text-tag-critical`)
- **Base UI mapping:** `data/synapse-baseui-mapping.json` → `tag` (custom chip)

**Figma scope:** IDS Figma (`42012:26686`) is authoritative for anatomy, sizes, and semantic tokens. Synapse Hi-Fi (`38910:57385`) verifies the **same variant axes**; programme differences are limited to the rows in **Synapse programme deltas** (focus offset, critical Light tone, close hover).

## Metadata

| Property | Value |
|---|---|
| Component | Tag |
| Design system | Synapse |
| Category | Form elements |
| Spec pattern | **ids-fork (override-only)** |
| IDS baseline slug | `tag` |
| Status | **active** |
| Version | 2.0.0 |
| Figma node (programme evidence) | `38910:57385` |
| IDS Figma (layout reference) | `42012:26686` |
| Theme CSS | `components/synapse-theme.css` |
| Verification method | IDS baseline spec + `programme="synapse"` CSS contract |
| Last verified | 2026-06-10 |

### Synapse programme deltas (vs IDS)

**No layout theme alias** (no `--tag-control-radius` or similar). Synapse chrome is applied via **`programme="synapse"`** on the shared `Tag` component.

| Topic | IDS | Synapse |
|---|---|---|
| Pill geometry / heights / padding | `radius-24`; small **20px**; large **28px** | **Same** (inherit IDS) |
| Variant axes (`type`, `size`, `tone`, …) | IDS contract | **Same** (inherit IDS) |
| Runtime API | IDS contract | **Same** (inherit IDS); emit `programme="synapse"` for Synapse targets |
| Focus outer ring `outline-offset` | **`3px`** | **`4px`** (`12715:251521`; `Tag.module.css` `.programmeSynapse[data-focus]`) |
| Alerting **Light** — **Critical** | `background-alerting-critical` + white text | **`background-alerting-critical-slate`** + **`text-tag-critical`** + `border-alerting-critical-base` (`50724:303493`) |
| `TagCloseButton` hover icon | inherits tag text color | **`icon-neutral-strong`** (`11666:90413`) |

All other state rows (clickable selected, editable, disabled, other alerting tones, badge anatomy) **inherit IDS** — see [`components/ids/tag/design-spec.md`](../ids/tag/design-spec.md).

## Anatomy

Inherit IDS **Anatomy** — see [`components/ids/tag/design-spec.md`](../ids/tag/design-spec.md).

Shared implementation slot order (`Tag.tsx`): `TagRoot` → optional count chip → label cluster / editable field → optional menu caret (`type=badge`) → optional close.

## Layout & Measurements

Inherit IDS padding, heights, pill radius, and icon sizes — see IDS **Layout & Measurements**.

Synapse-specific layout (programme-flag only):

- Keyboard focus ring: **`outline-offset: 4px`** when `programme="synapse"` (IDS: `3px`)

## Tokens

### Programme modifiers (not theme aliases)

Synapse deltas use existing semantic tokens; critical Light resolves via `components/synapse-theme.css`:

| Token | Usage (Synapse only) |
|---|---|
| `--color-background-alerting-critical-slate` | Critical **Light** shell |
| `--color-text-tag-critical` | Critical **Light** label |
| `--color-border-alerting-critical-base` | Critical **Light** border |
| `--color-icon-neutral-strong` | Close control hover |

### All other tokens

Inherit IDS **Tokens** — same `var(--...)` names; values from `components/synapse-theme.css` for Synapse targets.

## States (Light Theme)

Inherit IDS **States (Light Theme)** from [`components/ids/tag/design-spec.md`](../ids/tag/design-spec.md).

Apply **only** these Synapse overrides when `programme="synapse"`:

| Slot | State | Background | Border | Text/Icon |
|---|---|---|---|---|
| `TagRoot` | focus-visible | base state retained | outer ring `var(--color-border-brand-base)`; **`outline-offset: 4px`** | unchanged |
| `TagRoot` read-only alerting **Light** — **Critical** | default | `var(--color-background-alerting-critical-slate)` | `var(--color-border-alerting-critical-base)` | `var(--color-text-tag-critical)` |
| `TagCloseButton` | hover | transparent | none | `var(--color-icon-neutral-strong)` |

## States (Dark Theme)

Dark theme uses the same semantic tokens as **States (Light Theme)**. Resolved values for `[data-theme="dark"]` / Synapse dark scope live in `components/synapse-theme.css`.

Duplicate the full state matrix in this section only when a dark row genuinely uses different `var(--...)` references than the corresponding light row.

## Interactions

Inherit IDS **Interactions** and **Accessibility** from [`components/ids/tag/design-spec.md`](../ids/tag/design-spec.md).

## Composition & API (runtime)

### IDS inheritance resolution

Codegen **MUST** resolve props, events, and variant axes from IDS **Composition & API (runtime)** in [`components/ids/tag/design-spec.md`](../ids/tag/design-spec.md) (`type`, `size`, `tone`, `selected`, `disabled`, `error`, `focusOnText`, `label`, `badgeValue`, `onClick`, `onDismiss`, `onSelectionChange`, etc.).

### Synapse-only runtime flags

| Prop | Type | Default | Synapse note |
|---|---|---|---|
| `programme` | `"ids" \| "synapse"` | `"ids"` | **`"synapse"`** applies focus **4px** offset, critical **Light** slate tokens, and close hover **`icon-neutral-strong`** per **Programme override rules** |

All other props: **inherit IDS** (no Synapse renames).

### Storybook defaults

**Spec Accurate Design**: `type="read-only"`, `label="Tag"`, `tone="non-alerting"`, `size="sm"` under **Spec Generated/Synapse/Tag** with `components/synapse-theme.css` and `SynapseTag` wrapper (`programme="synapse"`).

## Codegen Contract (Framework-Agnostic Blueprint)

### IDS baseline resolution

Generators **MUST** load and merge the IDS baseline contract from [`components/ids/tag/design-spec.md`](../ids/tag/design-spec.md) (`## Codegen Contract`) before applying Synapse programme overrides below.

### Programme override rules

| Rule | IDS | Synapse |
|---|---|---|
| Focus `outline-offset` on `TagRoot` | `3px` (`.programmeIds`) | **`4px`** (`.programmeSynapse`) |
| Critical **Light** `TagRoot` | alerting critical fill + white text | **slate** bg + **`text-tag-critical`** (`.programmeSynapse.tone_critical.emphasis_light`) |
| `TagCloseButton` hover color | inherits | **`var(--color-icon-neutral-strong)`** |
| `programme` prop | optional; default `ids` | **`synapse`** for Synapse targets |
| Theme CSS | `components/ids-theme.css` | **`components/synapse-theme.css`** (+ IDS tokens as needed) |
| All other slots / variants | IDS contract | **Inherit IDS** |

### Deterministic structure

Inherit IDS slot order — see IDS **Codegen Contract → Deterministic structure**. Synapse adds **no** slots.

### Variant matrix

Inherit IDS: `type` × `size` × `tone` × state × `selected` × `focusOnText`. Add codegen axis `programme: ids | synapse` for target selection only.

### Per-slot style contract

| Slot | Property | Synapse override (when `programme="synapse"`) |
|---|---|---|
| `TagRoot` | `outline-offset` on focus | **`4px`** |
| `TagRoot` critical Light | bg / border / text | slate + `text-tag-critical` tokens |
| `TagCloseButton` | hover icon color | **`icon-neutral-strong`** |
| All other slots | per IDS | Inherit IDS **Codegen Contract → Per-slot style contract** |

### Behavior contract

Inherit IDS clickable toggle, editable focus-on-text, dismiss, and disabled blocking — see IDS **Codegen Contract → Behavior contract**.

### Accessibility contract

Inherit IDS button semantics, `aria-pressed`, close labels, and disabled handling — see IDS **Codegen Contract → Accessibility contract**.

### Asset resolution + bundling contract

Inherit IDS: `shape-x-thick` close, optional badge/alerting icons — see IDS **Codegen Contract → Asset resolution**.

Shared `type=badge` also renders `arrow-drop-tri-caret` (`10×10`) per shared `Tag.tsx` (both programmes).

### Fallback/error rules

Inherit IDS fallbacks (`unknown type` → `read-only`, etc.). Programme additions:

- Unknown `programme` → **`ids`** chrome (3px focus, IDS critical Light).
- Synapse targets **must** set `programme="synapse"` and import **`components/synapse-theme.css`** for critical Light token resolution.
- Do not introduce hardcoded `3px` / `4px` focus offsets outside `Tag.module.css` programme classes.

### Validation checklist

- [x] IDS baseline linked; programme deltas table lists **only verified Synapse differences**
- [x] No false “Same / different” duplication of IDS layout tables
- [x] `programme="synapse"` wired in `SynapseTag.tsx` wrapper
- [x] `Tag.module.css` programme classes: 4px focus, critical Light, close hover
- [x] Codegen Contract subsections concrete (IDS merge + programme overrides)
- [x] Storybook `Spec Generated/Synapse/Tag` loads `components/synapse-theme.css`
- [x] Registry: `data/programme-inheritance-registry.json` → `synapse` / `tag`

## Source Mapping

| Property | Value |
|---|---|
| IDS baseline | `components/ids/tag/design-spec.md` |
| Programme spec | `components/synapse/tag/design-spec.md` |
| Registry | `data/programme-inheritance-registry.json` → `synapse` / `tag` |
| Synapse Figma (main set) | `38910:57385` |
| Synapse focus evidence | `12715:251521` |
| Synapse critical Light | `50724:303493` |
| Synapse close hover | `11666:90413` |
| IDS Figma (layout reference) | `42012:26686` |
| Theme CSS | `components/synapse-theme.css` (semantic tokens; **no** tag layout alias) |
| Implementation | `storybook/src/components/Tag.tsx` |
| Programme wrapper | `storybook/src/components/SynapseTag.tsx` |
| Spec contract | `storybook/src/spec-contracts/synapse-tag.contract.ts` |
| Storybook | `storybook/src/components/SynapseTag.stories.tsx` |
| Verification | IDS baseline + programme CSS contract — 2026-06-10 |

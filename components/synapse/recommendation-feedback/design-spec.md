# Recommendation Feedback Design Spec

## Metadata

| Property | Value |
|---|---|
| Component | Recommendation Feedback |
| Design system | Synapse |
| Category | Components |
| Spec pattern | **standalone** |
| Status | **active** |
| Version | 1.0.0 |
| Figma file | `Td1bnsvRj1PCGs9RVJkIvJ` (Synapse Hi-Fi components) |
| Spec-accurate instance | `53259:126112` (`Chat System Response` / `Options=Recommendation Feedback`) |
| Variant frame | `48268:63981` |
| Actions row | `48084:43641` (`System response actions`) |
| Examples board | `53259:126090` |
| Theme CSS | `components/synapse-theme.css` |
| Verification method | Figma MCP |
| Last verified | 2026-06-10 |

### Live verification evidence

| Check | Node(s) | Method |
|---|---|---|
| Spec-accurate instance | `53259:126112` | Figma MCP `get_design_context` + `get_variable_defs` |
| Variant frame | `48268:63981` | Figma MCP `get_design_context` |
| System response actions | `48084:43641` | Figma MCP `get_design_context` |

Used inside **Chat System Response** as the recommendation feedback option (`53259:126130` section on examples board).

## Anatomy

Deterministic slot order (codegen **must** preserve):

1. **`RecommendationFeedbackRoot`** — column container.
2. **`PromptText`** — user-defined question (Body 1).
3. **`SystemResponseActions`** — horizontal action row.
4. **`CopyAction`** — icon button (`copy` 16px).
5. **`ThumbUpAction`** — icon button (`thumb-up` 16px).
6. **`ThumbDownAction`** — icon button (`thumb-down` 16px).
7. **`Timestamp`** — dynamic date/time label (Body 3).

## Layout & Measurements

### `RecommendationFeedbackRoot`

| Property | Token / value |
|---|---|
| Max width | `800px` |
| Direction | column |
| Gap (prompt ↔ actions) | `var(--spacing-space-12)` |
| Padding | `var(--padding-padding-8)` vertical; horizontal `0` |
| Sample frame width (reference) | `600px` — runtime `width: 100%` |

### `PromptText`

| Property | Token / value |
|---|---|
| Typography | Body 1 — `var(--font-size-body-1)` / `var(--font-line-height-line-height-24)` |
| Color | `var(--color-text-neutral)` |

Figma default: **"What did you think about this recommendation?"**

### `SystemResponseActions`

| Property | Token / value |
|---|---|
| Direction | row |
| Align items | center |
| Gap | `var(--spacing-space-8)` |
| Border radius | `var(--corner-radius-radius-6)` |

### `SystemResponseActionButton` (copy / thumb-up / thumb-down)

| Property | Token / value |
|---|---|
| Padding | `var(--padding-padding-6)` vertical, `var(--padding-padding-8)` horizontal |
| Border radius | `var(--corner-radius-radius-4)` |
| Icon size | **16×16px** |
| Icon color | `var(--color-icon-neutral)` |
| Background | transparent; hover → `var(--color-background-surface-1)` |

### `Timestamp`

| Property | Token / value |
|---|---|
| Typography | Body 3 — `var(--font-size-body-3)` / `var(--font-line-height-line-height-18)` |
| Color | `var(--color-text-disabled)` |
| White space | `nowrap` |

Figma sample: **"24 Sep, 11:30 PM"** (dynamic; host-formatted).

## Tokens

### Typography

| Role | Font size | Line height | Weight | Color |
|---|---|---|---|---|
| Prompt | `var(--font-size-body-1)` | `var(--font-line-height-line-height-24)` | 400 | `var(--color-text-neutral)` |
| Timestamp | `var(--font-size-body-3)` | `var(--font-line-height-line-height-18)` | 400 | `var(--color-text-disabled)` |

### Icons

| Slug | Usage |
|---|---|
| `copy` | Copy action 16px |
| `thumb-up` | Positive feedback 16px |
| `thumb-down` | Negative feedback 16px |

## States (Light Theme)

| Element | State | Background | Border | Text/Icon |
|---|---|---|---|---|
| Root | default | transparent | none | — |
| Prompt | default | transparent | none | `var(--color-text-neutral)` |
| Action button | default | transparent | none | `var(--color-icon-neutral)` |
| Action button | hover | `var(--color-background-surface-1)` | none | `var(--color-icon-neutral)` |
| Action button | focus-visible | transparent | `var(--color-border-brand-base)` outline | `var(--color-icon-neutral)` |
| Timestamp | default | transparent | none | `var(--color-text-disabled)` |

## States (Dark Theme)

Dark theme uses the same semantic tokens as **States (Light Theme)**. Resolved values for `[data-theme="dark"]` / Synapse dark scope live in `components/synapse-theme.css`.

## Interactions

| Trigger | Behavior |
|---|---|
| Click copy | Emit `onCopy`; host copies recommendation content to clipboard. |
| Click thumb-up | Emit `onThumbUp`; host records positive feedback. |
| Click thumb-down | Emit `onThumbDown`; host records negative feedback. |
| Hover action | Background → `var(--color-background-surface-1)`. |

Selected good/bad response chrome is documented on the Chat System Response action bar (`53259:126297`, `53259:126298`) — **out of scope** for this standalone block; host may style actions after selection.

### Accessibility

| Element | Requirement |
|---|---|
| Action buttons | `<button type="button">` with descriptive `aria-label` |
| Timestamp | `<time>` with `dateTime` when parseable; visible formatted string |
| Prompt | Plain text `<p>` |

## Composition & API (runtime)

### Inputs (props)

| Prop | Type | Default | Description |
|---|---|---|---|
| `prompt` | `string` | Figma sample copy | **User-defined** feedback question (Body 1). |
| `timestamp` | `string` | `"24 Sep, 11:30 PM"` | **Dynamic** formatted timestamp (Body 3). |
| `onCopy` | `() => void` | — | Copy action handler. |
| `onThumbUp` | `() => void` | — | Positive feedback handler. |
| `onThumbDown` | `() => void` | — | Negative feedback handler. |

### Outputs (events)

| Event | Payload | When |
|---|---|---|
| `onCopy` | — | Copy button activated. |
| `onThumbUp` | — | Thumb-up activated. |
| `onThumbDown` | — | Thumb-down activated. |

## Codegen Contract (Framework-Agnostic Blueprint)

### Deterministic structure

```
RecommendationFeedbackRoot
  PromptText
  SystemResponseActions
    CopyAction
    ThumbUpAction
    ThumbDownAction
    Timestamp
```

### Variant matrix

| Axis | Values |
|---|---|
| — | Single layout (no variant axis on `53259:126112`) |

### Per-slot style contract

| Slot | Key properties |
|---|---|
| `RecommendationFeedbackRoot` | column; gap `var(--spacing-space-12)`; max-width `800px` |
| `PromptText` | Body 1; `var(--color-text-neutral)` |
| `SystemResponseActions` | row; gap `var(--spacing-space-8)`; radius `var(--corner-radius-radius-6)` |
| `SystemResponseActionButton` | padding 6/8; radius `var(--corner-radius-radius-4)`; icon 16px |
| `Timestamp` | Body 3; `var(--color-text-disabled)` |

### Behavior contract

- All three action buttons are independent; no mutual-exclusion enforced in component (host may implement).
- `timestamp` is display-only; formatting is host responsibility.
- `prompt` required for UX; empty falls back to Figma default string.

### Accessibility contract

| Element | Requirement |
|---|---|
| Copy | `aria-label="Copy recommendation"` (or localized equivalent) |
| Thumb up | `aria-label="Good recommendation"` |
| Thumb down | `aria-label="Bad recommendation"` |
| Focus | `focus-visible` brand outline on action buttons |

### Asset resolution + bundling

| Slug | Size |
|---|---|
| `copy` | 16px |
| `thumb-up` | 16px |
| `thumb-down` | 16px |

Resolve from `assets/icons/<slug>.svg`.

### Fallback / error rules

| Condition | Behavior |
|---|---|
| Empty `prompt` | Use Figma default question string. |
| Missing `timestamp` | Use Figma sample or omit `<time>` if explicitly empty string. |
| Missing icon asset | Render empty 16px placeholder; do not substitute glyph. |
| Missing handler | Button still renders; no-op on click. |

### Validation checklist

- [x] Metadata includes Figma file key, node ids, verification method, date
- [x] Layout measurements match Figma MCP output
- [x] Prompt Body 1 + timestamp Body 3 tokens documented
- [x] Action button padding/radius/icon size match Figma
- [x] Composition API lists props and events
- [x] Codegen structure and per-slot styles documented
- [x] Asset slugs mapped
- [x] Storybook loads `components/synapse-theme.css`
- [x] Spec contract: `storybook/src/spec-contracts/synapse-recommendation-feedback.contract.ts`

## Source Mapping

| Property | Value |
|---|---|
| Programme spec | `components/synapse/recommendation-feedback/design-spec.md` |
| Figma file | `Td1bnsvRj1PCGs9RVJkIvJ` |
| Spec-accurate instance | `53259:126112` |
| Variant frame | `48268:63981` |
| Actions component | `48084:43641` |
| Examples board | `53259:126090` |
| Theme | `components/synapse-theme.css` |
| Implementation | `storybook/src/components/RecommendationFeedback.tsx`, `RecommendationFeedback.module.css` |
| Spec contract | `storybook/src/spec-contracts/synapse-recommendation-feedback.contract.ts` |
| Storybook | `storybook/src/components/RecommendationFeedback.stories.tsx` |
| Storybook group | `Spec Generated/Synapse/Chat and Layout/Recommendation Feedback` |
| Figma map | `data/synapse-component-figma-map.json` |
| Verification | Figma MCP — session 2026-06-10 |

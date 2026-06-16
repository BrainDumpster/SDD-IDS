# Suggested Prompt Design Spec

## Metadata

| Property | Value |
|---|---|
| Component | Suggested Prompt |
| Design system | Synapse |
| Category | Components |
| Spec pattern | **standalone** |
| Status | **active** |
| Version | 1.0.0 |
| Figma file | `Td1bnsvRj1PCGs9RVJkIvJ` (Synapse Hi-Fi components) |
| Main component set | `48467:26158` (`Suggested Prompt`) |
| Theme CSS | `components/synapse-theme.css` |
| Verification method | Figma MCP |
| Last verified | 2026-06-10 |

### Live verification evidence

| Check | Node(s) | Method |
|---|---|---|
| Component set + variant axis | `48467:26158` | Figma MCP `get_metadata` |
| `AI Gradient=false` | `48467:26157` | Figma MCP `get_design_context` + `get_variable_defs` |
| `AI Gradient=true` | `53325:277102` | Figma MCP `get_design_context` + `get_variable_defs` |
| Optional leading icon | `52141:31838` (`arrow-right` 16px) | Figma MCP `get_design_context` |

### Parent composition

Consumed by [`components/synapse/chatinputbox/design-spec.md`](../chatinputbox/design-spec.md) as `SuggestedPrompt` / `SuggestedPromptList`. List gaps and root spacing remain parent-owned.

## Anatomy

Deterministic slot order (codegen **must** preserve):

1. **`SuggestedPromptRoot`** — interactive chip (`<button type="button">`).
2. **`SuggestedPromptInner`** — horizontal row.
3. **`SuggestedPromptIcon`** (optional) — `arrow-right` **16×16px** when `icon=true`.
4. **`SuggestedPromptLabel`** — user-defined Body 2 text.

### `SuggestedPromptList` (composition helper)

| Slot | Description |
|---|---|
| `SuggestedPromptList` | Groups chips; `layout="vertical"` or `layout="wrap"`. |

## Layout & Measurements

### Sample frame width (reference only)

Figma variant frames use **280×28px** reference chips. **Runtime:** `width: fit-content`, `max-width: 100%`, `box-sizing: border-box`.

### `SuggestedPromptRoot`

| Property | Token / value |
|---|---|
| Padding | `var(--padding-padding-4)` vertical, `var(--padding-padding-12)` horizontal |
| Border | `var(--border-width-border-1)` solid `var(--color-border-neutral-light)` |
| Border radius | `var(--suggested-prompt-radius)` → `var(--corner-radius-radius-8)` |
| Background | transparent |
| Max width | `100%` of parent |

### `SuggestedPromptInner`

| Property | Token / value |
|---|---|
| Direction | row |
| Align items | center |
| Gap | `var(--spacing-space-8)` |

### `SuggestedPromptList`

| `layout` | Direction | Gap |
|---|---|---|
| `vertical` | column | `var(--spacing-space-12)` |
| `wrap` | flex-wrap row | `var(--spacing-space-12)` |

## Tokens

### Layout aliases (theme-resolvable)

| Alias | Synapse resolved value |
|---|---|
| `--suggested-prompt-radius` | `var(--corner-radius-radius-8)` |

`--chat-input-prompt-radius` in theme aliases resolves to `--suggested-prompt-radius` for Chat Input Box backward compatibility.

### Typography

| Role | Font size | Line height | Weight | Color |
|---|---|---|---|---|
| Label (Body 2) | `var(--font-size-body-2)` | `var(--font-line-height-line-height-20)` | 400 | `var(--color-text-neutral-strong)` |

## States (Light Theme)

### `SuggestedPromptRoot`

| State | Background | Border | Text/Icon |
|---|---|---|---|
| default | transparent | `var(--color-border-neutral-light)` | `var(--color-text-neutral-strong)` |
| hover | transparent | `var(--color-border-strong)` | `var(--color-text-neutral-strong)` |
| focus-visible | transparent | outer ring `var(--color-border-brand-base)`; `outline-offset: var(--scale-2)` | unchanged |
| disabled | transparent | `var(--color-border-neutral-light)` | `var(--color-text-neutral-strong)` at reduced opacity |

### Variant axis (`48467:26158`)

| `aiGradient` | Figma node | Notes |
|---|---|---|
| `false` | `48467:26157` | Default spec-accurate variant |
| `true` | `53325:277102` | Same semantic token bindings in live verification; `data-ai-gradient="true"` for programme gradient chrome when tokens are available |

| `icon` | Leading slot |
|---|---|
| `false` | Label only |
| `true` | `arrow-right` 16px + label |

## States (Dark Theme)

Dark theme uses the same semantic tokens as **States (Light Theme)**. Resolved values for `[data-theme="dark"]` / Synapse dark scope live in `components/synapse-theme.css`.

Duplicate the full state matrix in this section only when a dark row genuinely uses different `var(--...)` references than the corresponding light row.

## Interactions

| Trigger | Behavior |
|---|---|
| Click / Enter / Space | Emit `onClick` / `onSelect(label)` when not `disabled`. |
| Hover | Border → `var(--color-border-strong)`. |
| Keyboard focus | `focus-visible` ring per state table. |
| `disabled` | Suppress interaction; `cursor: not-allowed`; reduced opacity. |

`visualState` / `data-visual-state` are **Storybook and test overrides only**; runtime defaults derive from interaction.

### Accessibility

| Element | Requirement |
|---|---|
| Root | `<button type="button">`; visible label text |
| Icon | Decorative when present; label carries accessible name |
| Focus | Visible `focus-visible` outline |

## Composition & API (runtime)

### Inputs (props) — `SuggestedPrompt`

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | Figma sample copy | **User-defined** prompt text. |
| `aiGradient` | `boolean` | `false` | Figma `AI Gradient` variant (`48467:26157` / `53325:277102`). |
| `icon` | `boolean` | `false` | Leading `arrow-right` 16px when `true`. |
| `disabled` | `boolean` | `false` | Disables chip. |
| `visualState` | `"default"` \| `"hover"` \| `"focus"` | — | Demo-only chrome override. |

### Inputs (props) — `SuggestedPromptList`

| Prop | Type | Default | Description |
|---|---|---|---|
| `layout` | `"vertical"` \| `"wrap"` | `"vertical"` | List layout for grouped chips. |
| `children` | `SuggestedPrompt` nodes | — | One or more chips. |
| `className` | `string` | — | Optional host class. |

### Outputs (events)

| Event | Payload | When |
|---|---|---|
| `onClick` | — | Chip activated (not disabled). |
| `onSelect` | `string` (label) | Optional semantic alias for `onClick` in host wrappers. |

### Chat Input Box composition (parent)

| Parent prop | Maps to |
|---|---|
| `suggestedPrompts: string[]` | `SuggestedPrompt` per label |
| `onSuggestedPromptClick(prompt)` | Parent handler after chip select |
| `layout=withSuggestedPromptsV` | `SuggestedPromptList layout="vertical"` above input |
| `sessionMode=newChat` | `SuggestedPromptList layout="wrap"` below Try asking label |

## Codegen Contract (Framework-Agnostic Blueprint)

### Deterministic structure

```
SuggestedPromptList? (vertical | wrap)
  SuggestedPrompt+
    SuggestedPromptRoot (button)
      SuggestedPromptInner
        SuggestedPromptIcon? (icon=true)
        SuggestedPromptLabel
```

### Variant matrix

| Axis | Values |
|---|---|
| `aiGradient` | `false`, `true` |
| `icon` | `false`, `true` |
| `disabled` | `false`, `true` |
| `SuggestedPromptList.layout` | `vertical`, `wrap` |

Valid combinations: all `aiGradient` × `icon` × `disabled` are valid; `icon=true` adds leading slot.

### Per-slot style contract

| Slot | Key properties |
|---|---|
| `SuggestedPromptRoot` | padding, border, `border-radius: var(--suggested-prompt-radius)`, transparent background |
| `SuggestedPromptLabel` | Body 2 tokens; `word-break: break-word` |
| `SuggestedPromptIcon` | `arrow-right` 16px |
| `SuggestedPromptList` | column or flex-wrap; gap `var(--spacing-space-12)` |

### Behavior contract

- Chip is always interactive unless `disabled`.
- Label is required; empty label renders nothing (fallback).
- `aiGradient=true` sets `data-ai-gradient="true"`; base tokens match `false` until programme gradient tokens are bound.
- List helper does not own click handlers — each chip emits independently.

### Accessibility contract

| Element | Requirement |
|---|---|
| `SuggestedPromptRoot` | `<button type="button">` with label text |
| `SuggestedPromptIcon` | Decorative (`aria-hidden` on icon wrapper) |
| Focus | `focus-visible` outline using `var(--color-border-brand-base)` |

### Asset resolution + bundling

| Slug | Usage |
|---|---|
| `arrow-right` | Optional leading icon 16px |

Resolve from `assets/icons/<slug>.svg`.

### Fallback / error rules

| Condition | Behavior |
|---|---|
| Unknown `aiGradient` | Treat as `false`. |
| Unknown `layout` on list | Fall back to `vertical`. |
| Empty `label` | Do not render chip. |
| Missing theme alias | Fall back to `var(--corner-radius-radius-8)`. |
| Missing icon asset | Render label only; do not substitute glyph. |

### Validation checklist

- [x] Metadata includes Figma file key, node ids, verification method, date
- [x] Layout measurements match Figma MCP output
- [x] All colors/spacing/radius via semantic `var(--...)` tokens
- [x] Light state matrix complete; dark uses boilerplate
- [x] Interaction contract defines click, hover, focus, disabled
- [x] Composition API lists props, events, defaults from Figma copy
- [x] Codegen structure, variant matrix, per-slot styles documented
- [x] Asset slugs mapped with sizes
- [x] Fallback rules for unknown variants and missing tokens
- [x] Storybook loads `components/synapse-theme.css`
- [x] Spec contract: `storybook/src/spec-contracts/synapse-suggested-prompt.contract.ts`

## Source Mapping

| Property | Value |
|---|---|
| Programme spec | `components/synapse/suggested-prompt/design-spec.md` |
| Figma file | `Td1bnsvRj1PCGs9RVJkIvJ` |
| Main set | `48467:26158` |
| AI Gradient=false | `48467:26157` |
| AI Gradient=true | `53325:277102` |
| Parent consumer | `components/synapse/chatinputbox/design-spec.md` |
| Theme aliases | `components/synapse-theme.css` → `--suggested-prompt-radius` |
| Implementation | `storybook/src/components/SuggestedPrompt.tsx`, `SuggestedPrompt.module.css` |
| Spec contract | `storybook/src/spec-contracts/synapse-suggested-prompt.contract.ts` |
| Storybook | `storybook/src/components/SuggestedPrompt.stories.tsx` |
| Storybook group | `Spec Generated/Synapse/Chat and Layout/Suggested Prompt` |
| Figma map | `data/synapse-component-figma-map.json` |
| Verification | Figma MCP — session 2026-06-10 |

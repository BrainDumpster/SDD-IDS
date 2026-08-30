# IDS Tag Design Spec

## Metadata
- Component: Tag
- Design system: IDS
- Category: Formelements
- Spec path: `components/ids/tag/design-spec.md`
- Primary Figma (verified): https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=42012-26686&m=dev
- Figma file key: `0bHk3XhrjFhowgFkz9yLr4`
- Primary node id: `42012:26686`
- Verification method: Figma MCP (`get_metadata`, `get_design_context`, `get_variable_defs`)
- Verified at: 2026-04-20
## Anatomy
- `TagRoot`
- `TagLabel`
- `TagPrefixIcon?` (alerting state icon or badge-leading icon)
- `TagBadge?` (count or status chip)
- `TagDropdown?` (detached dropdown menu surfaced by `TagBadge` trigger)
- `TagCloseButton?` (tertiary icon-only button for dismiss/edit mode)
- `TagEditableField?` (text focus surface for editable mode)
## Layout & Measurements
- Two size tracks verified:
  - `small`: height `20px` (read-only baseline) - border included in height using box-sizing: border-box
  - `large`: height `28px` (read-non-alerting, clickable/editable/badge patterns) - border included in height using box-sizing: border-box
- Read-only sample width: `40px`.
- Read-only large sample width: `48px`.
- Clickable sample width: `48px`.
- Editable sample widths: `66px` and `70px` (error/focus-on-text).
- Badge sample width: `92px`.
- Non-alerting large sample width: `48px` (legacy chip) and `88px` (expanded examples).
- Close button size: `var(--sizing-size-18)` x `var(--sizing-size-18)` with `var(--padding-padding-4)` padding; icon asset remains `10px x 10px`.
- Dismissible tag right padding: `var(--padding-padding-8)`; label-to-close gap: `var(--spacing-space-4)`.
- Tag shape remains pill-like with fully rounded ends.
- Focus outline gap (outline offset from tag edge): `2px`.
- Text field focus ring height: `20px` for editable tags.
## Tokens
- Core neutral tokens:
  - `var(--color-background-surface-component)`
  - `var(--color-border-gray-neutral-base)`
  - `var(--color-text-gray-neutral)`
  - `var(--color-icon-gray-neutral-accessible)`
- Interactive/select tokens:
  - `var(--color-border-brand-base)`
  - `var(--color-background-controls-base)`
  - `var(--color-background-controls-lighter)`
  - `var(--color-background-controls-strong)`
  - `var(--color-border-brand-transparent-brand)`
- Disabled tokens:
  - `var(--color-background-gray-light)`
  - `var(--color-background-gray-lighter)`
  - `var(--color-text-gray-disabled)`
  - `var(--color-icon-gray-disabled)`
  - `var(--color-border-gray-disabled)`
- Alerting tokens:
  - `var(--color-background-alerting-info-base)`
  - `var(--color-background-alerting-success-base)`
  - `var(--color-background-alerting-major-base)`
  - `var(--color-background-alerting-minor-base)`
  - `var(--color-background-alerting-critical-base)`
  - `var(--color-border-alerting-critical-base)`
  - `var(--color-border-alerting-minor-base)`
- Inverse/content tokens:
  - `var(--color-text-gray-white)`
  - `var(--color-border-gray-white)`
- Typography:
  - `Body 2` for tag labels
  - `Body 2 - Medium` for emphasized/clickable states
- Custom text colors:
  - `var(--color-text-gray-black)` for Major and Minor tone text color
## States (Light Theme)
| Slot | State | Background | Border | Text/Icon |
|---|---|---|---|---|
| TagRoot (read-only, non-alerting) | default | `var(--color-background-surface-component)` | `var(--color-border-gray-neutral-base)` | text `var(--color-text-gray-neutral)`, icon `var(--color-icon-gray-neutral-accessible)` |
| TagRoot (read-only, non-alerting) | error | `var(--color-background-surface-component)` | `var(--color-border-alerting-critical-base)` | text `var(--color-text-gray-neutral)`, close icon critical |
| TagRoot (editable, non-alerting) | error | `var(--color-background-surface-component)` | `var(--color-border-alerting-critical-base)` | text `var(--color-text-gray-neutral)`, close icon critical |
| TagRoot (badge, non-alerting) | error | `var(--color-background-surface-component)` | `var(--color-border-alerting-critical-base)` | text `var(--color-text-gray-neutral)`, close icon critical |
| TagRoot (read-only/clickable/badge) | disabled | `var(--color-background-gray-light)` | `var(--color-border-gray-disabled)` | text/icon `var(--color-text-gray-disabled)` / `var(--color-icon-gray-disabled)` |
| TagRoot (clickable, selected=false) | default | `var(--color-background-controls-lighter)` | `var(--color-border-brand-base)` | text/icon brand-dark |
| TagRoot (clickable, selected=false) | hover | `var(--color-background-controls-lighter)` | `var(--color-border-brand-base)` | same as default (hover emphasis only) |
| TagRoot (clickable, selected=true) | default | `var(--color-background-controls-base)` | `var(--color-border-brand-transparent-brand)` | text/icon inverse (`var(--color-text-gray-white)`) |
| TagRoot (clickable, selected=true) | hover | `var(--color-background-controls-strong)` | `var(--color-border-brand-transparent-brand)` | text/icon inverse |
| TagRoot (focus-visible) | focus | keep base state | outer focus outline brand (`var(--color-border-brand-base)`) with `3px` gap | content unchanged |
| TagEditableField | focus-on-text=true | transparent | text field border `var(--color-border-brand-base)` | text neutral |
| TagBadge | default | `var(--color-background-controls-base)` | none | text `var(--color-text-gray-white)` |
## States (Dark Theme)
| Slot | State | Background | Border | Text/Icon |
|---|---|---|---|---|
| TagRoot (read-only, non-alerting) | default | `var(--color-background-surface-primary)`/semantic tag base | `var(--color-border-gray-neutral-base)` | text `var(--color-text-gray-white)` or semantic neutral-light |
| TagRoot (read-only, non-alerting) | error | semantic dark surface | `var(--color-border-alerting-critical-base)` | text semantic neutral-light, close icon critical |
| TagRoot (editable, non-alerting) | error | semantic dark surface | `var(--color-border-alerting-critical-base)` | text semantic neutral-light, close icon critical |
| TagRoot (badge, non-alerting) | error | semantic dark surface | `var(--color-border-alerting-critical-base)` | text semantic neutral-light, close icon critical |
| TagRoot (read-only/clickable/badge) | disabled | semantic disabled surface | `var(--color-border-gray-disabled)` | text/icon disabled |
| TagRoot (clickable, selected=false) | default | dark brand-slate token | `var(--color-border-brand-base)` | text/icon brand-light |
| TagRoot (clickable, selected=true) | default | `var(--color-background-controls-base)` | `var(--color-border-brand-transparent-brand)` | text/icon inverse |
| TagRoot (clickable, selected=true) | hover | `var(--color-background-controls-strong)` | `var(--color-border-brand-transparent-brand)` | text/icon inverse |
| TagRoot (focus-visible) | focus | keep base state | outer focus outline brand (`var(--color-border-brand-base)`) with `3px` gap | content unchanged |
| TagEditableField | focus-on-text=true | transparent | text field border `var(--color-border-brand-base)` | text semantic neutral-light |
| TagBadge | default | `var(--color-background-controls-base)` | none | text inverse |
## Interactions
- `read-only`: non-interactive label chip.
- `clickable`: toggles selection (`selected=true|false`).
- `editable/dismissible`: clicking the editable tag body behaves like an input activation surface and moves focus to the inner text field; close action removes tag.
- `badge`: supports optional leading info icon and badge count segment; the badge can trigger a detached dropdown menu (`TagDropdown`) with a full border.
- Hover states apply where interaction is enabled (clickable and close button).
- Focus-visible is keyboard-driven and uses outer ring.
- Disabled suppresses click, close, and selection transitions.
## Composition & API (runtime)
- `type: "read-only" | "clickable" | "editable" | "badge"`
- `size: "small" | "large"` (defaults: read-only -> small, others -> large; read-only also supports large for non-alerting tags)
- `tone: "none" | "informational" | "success" | "minor" | "major" | "critical"`
- `selected?: boolean` (clickable only; default `false`)
- `disabled?: boolean` (default `false`)
- `error?: boolean` (read-only/editable/badge variants)
- `focusVisible?: boolean` (demo/testing only; runtime driven by keyboard)
- `focusOnText?: boolean` (editable only)
- `label: string`
- `badgeValue?: string | number` (badge only)
- `leadingIconSlug?: string | null`
- `closeIconSlug?: string` (default `shape-x-thick`)
- `onClick?: () => void` (clickable)
- `onDismiss?: () => void` (editable/dismissible)
- `onSelectionChange?: (selected: boolean) => void` (clickable)
## Codegen Contract (Framework-Agnostic Blueprint)
- Deterministic slot order:
  1. `TagRoot`
  2. `TagPrefixIcon?`
  3. `TagLabel`
  4. `TagBadge?`
  5. `TagEditableField?`
  6. `TagCloseButton?`
- Variant matrix (all supported axes):
  - `type`: read-only | clickable | editable | badge
  - `size`: small | large
  - `tone`: none | informational | success | minor | major | critical
  - `state`: default | hover | focus-visible | error | disabled
  - `selected`: true | false (clickable only)
  - `focusOnText`: true | false (editable only)
- Per-slot style contract:
  - `TagRoot` owns pill geometry, border, surface, and padding.
  - `TagLabel` always uses Body 2 scale.
  - `TagCloseButton` is a tertiary icon-only button using `shape-x-thick`, sized `var(--sizing-size-18)`, with `var(--padding-padding-4)` padding, border-radius `var(--button-control-radius)`, icon color `var(--color-icon-gray-neutral-accessible)` (disabled uses `var(--color-icon-gray-disabled)`), hover/press backgrounds `var(--color-background-controls-lighter)` / `var(--color-background-controls-light)` with `var(--color-border-brand-base)` inset border, and a focus-visible outer ring `var(--color-border-brand-base)`.
  - `TagBadge` uses compact filled mini-chip treatment. When used as a dropdown trigger, the dropdown (`TagDropdown`) is a detached/standalone menu offset from `TagRoot` by `var(--spacing-space-1)` with a full border of `var(--border-width-border-default)` on all sides and `var(--dropdown-menu-radius)` corners.
- Behavior contract:
  - clickable toggles selected state and emits `onSelectionChange`.
  - editable tag body click focuses `TagEditableField` (input-like behavior) before text editing.
  - dismissible emits `onDismiss` and is removable by host list logic.
  - disabled state blocks all emitted events.
  - focus-visible ring appears for keyboard focus with `2px` outline gap.
- Accessibility contract:
  - interactive variants use `button` semantics (or role/button + keyboard parity).
  - selected clickable tags expose `aria-pressed`.
  - dismiss controls expose `aria-label` with tag text context.
  - disabled uses `disabled`/`aria-disabled` consistently.
- Asset resolution + bundling:
  - close icon defaults to `assets/icons/shape-x-thick.svg`.
  - badge-leading icon (if any) resolves from `assets/icons/<slug>.svg`.
  - alerting glyphs map to IDS alert icon assets (e.g., status critical/warn).
- Fallback/error rules:
  - unknown `type` -> `read-only`
  - unknown `size` -> `small` for read-only else `large`
  - unknown `tone` -> `none`
  - if `badgeValue` provided while `type !== "badge"`, ignore `badgeValue`
  - if `selected=true` while `type !== "clickable"`, ignore `selected`
- Validation checklist (pass/fail):
  - [ ] all type variants render valid slot order
  - [ ] clickable selected/unselected tokens match spec
  - [ ] disabled blocks click/dismiss/selection events
  - [ ] focus-visible ring appears in keyboard path only
  - [ ] editable focus-on-text path shows field border token
  - [ ] badge variant handles icon + count + label layout
## Source Mapping
- Map source: `data/component-figma-map.json` -> component `"Tag"`.
- IDS design library nodes verified:
  - Main example board: `42012:26686`
  - Main component board (light/dark container): `42012:26676`
  - Clickable set: `38910:51213`
  - Non-alerting large set: `38910:51195`
  - Editable/dismissible set: `38910:51235`
  - Tags-with-badge set: `38910:57339`
- Legacy exploration evidence also checked for close-icon states: file key `VZJ48bbVYrIynw8DdSukWw`, node `11067:54649`.

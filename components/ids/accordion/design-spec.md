<!-- ds:inherits root-spec -->
# Accordion Design Spec

## Metadata
- Component: Accordion
- Design System: IDS
- Category: Form Elements
- Figma URL: https://www.figma.com/design/VZJ48bbVYrIynw8DdSukWw/-Exploration-only--IDS-with-variables?node-id=16551-26036&m=dev
- File key: `VZJ48bbVYrIynw8DdSukWw`
- Primary node: `16551:26036` (library / layout contract)
- Related component-set nodes (same file): `.Accordion-Main` `10962:89111`; `.Accordion-Element-Left` `10962:89124`; `.Accordion-Element-Right` `10962:89134`; showcase `11067:54535`
- **Canonical IDS Design Library (colors / published accordion examples):** https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=42156-108639&m=dev — file key `0bHk3XhrjFhowgFkz9yLr4`, node `42156:108639` (`Content` frame: accordion states + Swap content).
- Includes scenarios: all collapsed, one expanded, multi expanded
## Anatomy
Main component:
- `AccordionRoot`

Child components (deterministic order):
1. `AccordionItem`
2. `AccordionHeader` — **same surface as the trigger:** the full header row is the interactive unit (title + chevron region, expand/collapse, focus ring, `aria-expanded`). Header content is **top-aligned**. The header row is a **non-button interactive surface** (pointer hit area + visual focus surface); the semantic focusable control inside it is the icon-button chevron — it must **not** be nested inside a second `<button>`.
3. `AccordionChevron` (left or right slot) — rendered as an **IDS Icon Button** (`variant: ghost neutral`, `size: small`, `shape: chev-down-thick`; see `components/ids/icon-button/design-spec.md`) in a **hug-content** frame, **no top offset** (top-aligned with the header row). It is the **focusable trigger control**: it carries the trigger `id`, `aria-expanded`, `aria-controls`, its accessible name, roving-focus participation, and the disabled state.
4. `AccordionBody` (framework alias: `AccordionPanel`)
5. `AccordionContent` — content is **top-aligned**

Optional child sub-slots:
- `AccordionMetaSlot` (optional helper text/metadata)
## Layout & Measurements
- Root `width` is fluid (`100%` of its container) by default, bounded only by `min-width: 240px`, and may be overridden via the `width` prop (number values are interpreted as pixels; string values are used as any CSS length).
- Root `max-width` is unset by default (fills its container); a cap may be applied via the `maxWidth` prop (number values are interpreted as pixels; string values are used as any CSS length).
- Item separators: `var(--border-width-border-1)` using accessible divider token.
- Trigger row uses IDS Figma contract: `min-height: 40px`, padding `10px 16px` (`var(--padding-padding-10)` `var(--padding-padding-16)`), `height: auto` to hug content.
- Header title wraps up to **2 lines**; text longer than 2 lines is truncated with ellipsis. Header title has a **max-width of 900px** and a **padding-2** top inset (`padding-top: var(--padding-padding-2)`).
- Truncated header titles expose the full text via a **native browser tooltip** (`title` attribute on the title element). The tooltip is set **only while the rendered text is actually truncated** (measured overflow), so untruncated titles show no redundant tooltip; tooltip text is the rendered text content.
- **Expanded body / header join:** The open **panel body** (first wrapper under `AccordionBody`; Storybook `.panel > .content`) must **not** use a `border-top` under the header—separation is **background contrast only** (header `brand-lighter` vs body `component` surface), per IDS expanded treatment.
- Open **item** left highlighter: **4px** brand strip `var(--color-border-brand-base)` aligned on the **open trigger** and **open panel** regions (implementation: left-edge `linear-gradient` on those surfaces). Do **not** rely on `inset` `box-shadow` on the item container alone—opaque trigger/panel fills paint above it and hide the bar.
- Selected/open state does **not** add a second item outline beyond shared row borders.
- Trigger/content gap and block rhythm follow `var(--spacing-space-8)` and body text line-height contracts.
- Chevron (IDS Icon Button) can be placed on:
  - `left` (leading; default)
  - `right` (trailing)
- The icon button sits in a **hug content** frame (`display: inline-flex`) with **no top offset** — the **padding-2** top inset lives on the title text instead
- Expanded item: left highlighter reads as **one** continuous **4px** strip through header and body (same token); render on surfaces that carry the row fill (trigger + panel slots), aligned so the bar does not stack into a seam.
- Expanded panel keeps contiguous border continuity with header (no visual break).
- Focus indicator must be visible on trigger row and not clipped by item container.
- Group rows follow Figma contiguous model (1px overlap/no vertical gaps).
- Expanded content container padding: `8px 24px 16px 40px` (implementations: `var(--padding-padding-40)` when present, otherwise `calc(var(--padding-padding-32) + var(--padding-padding-8))` so left inset is valid in Storybook themes).
- Expanded content container minimum size: `min-width: 50px` and `min-height: 50px` (apply with `box-sizing: border-box` so the 50px floor includes padding).
- Optional inner **content card**: **no background color**, **no border**, and **no padding**; it holds the body text. Content card text has a **max-width of 900px**.
## Tokens
- Surface:
  - `var(--color-background-surface-component)`
  - `var(--color-background-brand-lighter-slate)`
  - `var(--color-background-brand-light-slate)`
- Borders:
  - `var(--border-width-border-1)`
  - `var(--border-width-border-2)`
  - `var(--color-border-gray-neutral-base)`
  - `var(--color-border-brand-base)`
  - `var(--color-border-gray-neutral-strong)`
- Text/Icon:
  - `var(--color-text-gray-neutral-strong)`
  - `var(--color-text-gray-neutral)`
  - `var(--color-text-link-brand-base)`
  - `var(--color-icon-gray-neutral-accessible)`
  - `var(--color-icon-gray-neutral-strong)`
- Icon asset:
  - canonical chevron **shapeName**: `chev-down-thick` → `assets/icons/chev-down-thick.svg`, rendered **inside the IDS Icon Button** (ghost neutral · small — see `components/ids/icon-button/design-spec.md`), which itself draws the glyph via the shared icon mask primitive.
- Radius/spacing/type:
  - `var(--padding-padding-2)` (title top inset)
  - `var(--padding-padding-12)` (trigger vertical rhythm)
  - `var(--padding-padding-16)`
  - `var(--padding-padding-24)`
  - `var(--padding-padding-40)` or `calc(var(--padding-padding-32) + var(--padding-padding-8))` for 40px inset when `40` token is absent
  - `var(--font-size-body-2)`
  - `var(--font-line-height-line-height-20)`
### IDS Design Library color crosswalk (Light, node `42156:108639`)
Resolved fills from the canonical library frame (Figma REST `GET /v1/files/{key}/nodes`); pair with `components/ids-theme.css` **light** block.

| Visual role (Figma) | Approx. hex | Semantic token (`theme.css`) |
|---|---|---|
| Artboard / frame backdrop | `#F4F4F4` | `var(--color-background-surface-primary)` (or nearest doc backdrop token used in app shell) |
| Accordion row / collapsed surface | `#FFFFFF` | `var(--color-background-surface-component)` |
| Expanded **Panel** row (header tint) | `#EBF4FB` | `var(--color-background-brand-lighter-slate)` |
| **Swap content** inner card fill | `#EBF4FB` in file — **not applied** (spec: card has no fill) | none / transparent |
| Left **4px** selection rail (`Rectangle 1`) | `#0076CE` | `var(--color-border-brand-base)` |
| Primary label / body text | `#252525` | `var(--color-text-gray-neutral-strong)` |
| Inline link (“Learn how…”) | `#0062AB` | `var(--color-text-link-brand-base)` |
| Chevron (IDS Icon Button, ghost neutral) | ~`#4D4D4D` / `#252525` in samples | Ghost-neutral ladder: `var(--color-icon-gray-neutral-base)` default; `var(--color-icon-gray-neutral-strong)` hover/press/focus; `var(--color-icon-gray-disabled)` disabled |

**Note:** Dark theme values come from the same semantic names in `components/ids-theme.css` dark block (e.g. brand base / link shift to lighter blues for contrast)—re-validate against dark variants in Figma when available.
## States (Light Theme)
| Slot | State | Background | Border | Text/Icon |
|---|---|---|---|---|
| trigger | default (collapsed) | `var(--color-background-surface-component)` | item divider `var(--color-border-gray-neutral-base)` | title `var(--color-text-gray-neutral-strong)`, chevron icon button ghost-neutral default `var(--color-icon-gray-neutral-base)` |
| trigger | hover (collapsed) | `var(--color-background-brand-lighter-slate)` | unchanged divider | title `var(--color-text-gray-neutral-strong)`, chevron icon button hover `var(--color-icon-gray-neutral-strong)` + ghost-neutral hover fill |
| trigger | hover (expanded) | `var(--color-background-brand-lighter-slate)` | same expanded header chrome as `expanded (open)` | title `var(--color-text-gray-neutral-strong)`, chevron icon button hover `var(--color-icon-gray-neutral-strong)` + ghost-neutral hover fill |
| trigger | expanded (open) | `var(--color-background-brand-lighter-slate)` | left **4px** brand strip (e.g. leading-edge gradient), no trigger-only bottom border | title `var(--color-text-gray-neutral-strong)`, chevron icon button rotated 180deg, ghost-neutral default colors |
| trigger | focus-visible | `var(--color-background-brand-lighter-slate)` (tinted in both collapsed and expanded) | header draws its own `var(--border-width-border-1)` `var(--color-border-gray-neutral-base)` border (inset shadow, no layout shift) + `border-radius: var(--corner-radius-radius-4)`; double focus ring — `0 0 0 var(--scale-2) var(--color-background-surface-component)` inner band + `0 0 0 var(--scale-4) var(--color-border-brand-base)` outer ring; the inner band follows the component surface so it is white in light and `#111619` in dark; `z-index` so the ring paints above sibling panels; when the item is expanded the header **hides the left 4px brand strip** (`background-image: none` on the focused trigger — the focus ring is the indicator), while the panel body keeps its strip | title `var(--color-text-gray-neutral-strong)`, chevron `var(--color-icon-gray-neutral-strong)` |
| trigger | disabled | same as base state | unchanged | reduced emphasis (`opacity` contract) + non-interactive cursor; icon button renders its disabled state (`var(--color-icon-gray-disabled)` glyph, `disabled` attribute) |
| panel/content | expanded | `var(--color-background-surface-component)` | item perimeter `var(--color-border-gray-neutral-base)`; left **4px** brand strip aligned with header; **no** `border-top` on body wrapper | body `var(--color-text-gray-neutral)`, link `var(--color-text-link-brand-base)` |
| content-card | expanded (optional) | none / transparent | none | heading/body per content; link `var(--color-text-link-brand-base)` |

*Cascade note:* expanded-state rules should target the chevron **icon button** for the 180deg rotation (e.g. `.item[data-open="true"] .trigger .chevron`). Icon-button state colors come from the icon-button module (ghost-neutral ladder); accordion CSS only sets layout (`flex-shrink`, top offset) and the rotation — do not override glyph colors per accordion.
## States (Dark Theme)

Dark theme uses the same semantic tokens as **States (Light Theme)**. Resolved values for `[data-theme="dark"]` / `.ids-theme-dark` (and program overlays) live in theme CSS:

- `components/ids-theme.css`
- `components/<program>-theme.css` when a program overlays IDS (for example `components/dap-theme.css`)

Duplicate the full state matrix in this section only when a dark row genuinely uses different `var(--...)` references than the corresponding light row.

*(When Light and Dark tables would list identical `var(--...)` cells, keep the matrix under **States (Light Theme)** only and use this pointer section instead of a second table.)*

## Interactions
- Trigger activation toggles panel expansion.
- Single-expand mode (`multiple=false`) keeps max one open panel.
- Multi-expand mode (`multiple=true`) allows more than one open panel.
- Disabled item is non-interactive.
- The icon-button chevron rotates 180deg in expanded state for both left and right positions (transform on the icon button).
- Arrow key roving focus is supported between triggers.
- Home/End move focus to first/last trigger.
- Panel content participates in layout only when expanded.
- Hovering a truncated header title shows the full title text in a native browser tooltip (no tooltip when the title fits).
## Composition & API (runtime)
Canonical machine-readable mirror (Storybook + codegen QA; MDX is not executed by Storybook): `storybook/src/spec-contracts/ids-accordion.contract.tsx`.

Main inputs:
- `items: AccordionItemInput[]` (required)
- `multiple?: boolean` (default `false`)
- `defaultValue?: string[]`
- `chevronPosition?: "left" | "right"` (default `"left"` — positions the icon-button chevron)
- `width?: number | string` (default fluid `100%`; numbers are treated as px, strings as any CSS length)
- `maxWidth?: number | string` (default unset — no cap; numbers are treated as px, strings as any CSS length)
- `panelMaxHeight?: number | string` (default unset — panel grows with content; when set, overflowing body content scrolls vertically. Numbers are treated as px, strings as any CSS length)

Per-item inputs:
- `value: string` (required stable ID)
- `title: string` (required)
- `content: RenderableNode` (required; framework-native renderable/content type)
- `disabled?: boolean`
- `meta?: RenderableNode`

Outputs:
- `onValueChange?(openValues: string[])`
## Codegen Contract (Framework-Agnostic Blueprint)
Deterministic structure:
- `AccordionRoot`
  - repeated `AccordionItem`
    - `AccordionHeader` (trigger surface — single public slot; see **Anatomy**)
      - optional leading `AccordionChevron` (left variant — IDS Icon Button, ghost neutral · small)
      - `title`
      - optional trailing `AccordionChevron` (right variant — IDS Icon Button, ghost neutral · small)
      - *implementation detail:* the chevron icon button **is** the focusable trigger control; the header row is a non-button interactive surface — never nest the icon button inside another `<button>`/trigger element, and do not surface a second IDS peer component
    - `AccordionBody` (aka `AccordionPanel` for libraries that use panel naming)
      - `AccordionContent`
      - optional `AccordionMetaSlot`

Variant matrix:
- `chevronPosition`: `left | right`
- expand behavior: `single | multiple` (resolved from user input)
- item state: `collapsed | expanded | disabled`

Chevron control contract:
- `AccordionChevron` is rendered as an **IDS Icon Button**: `variant: ghost neutral`, `size: small`, `shape: chev-down-thick` (slug stable across frameworks; path rule in **Icon primitive & asset delivery**).
- The icon button is the **focusable trigger control**: it carries the trigger `id`, `aria-expanded`, `aria-controls`, an accessible name (`aria-labelledby` → header title when present, otherwise `aria-label`), roving-focus participation, and `disabled`. The header row remains the pointer hit area and visual focus surface — keyboard focus-visible on the icon button paints the spec focus ring on the row (light DOM: `:has(:focus-visible)`; when the button lives inside a shadow root: `:focus-within`).
- Never nest the icon button inside a second `<button>`/trigger element (invalid interactive nesting, double tab stop). Where a target primitive only exposes a "trigger" part, render that trigger **as** the icon button (e.g. Base UI `Accordion.Trigger render={<IconButton/>}`) or place the icon button inside a non-button row.
- If the icon-button primitive does not expose `aria-expanded`/`aria-controls` forwarding, forward them onto its inner `<button>` (see `lib/lit/ids` icon-button) so the attributes land on the actual focusable element.

Behavior contract:
- If `multiple=false`, opening one item closes the previously open item.
- If `multiple=true`, toggles item independently.
- `disabled` prevents toggle and focus activation by keyboard/pointer.
- Expanded header/panel border continuity must be preserved (no seam).
- Expanded open item must show a continuous **4px** left highlighter `var(--color-border-brand-base)` on header and body (aligned surfaces; avoid parent-only `inset` shadow hidden by opaque children). Panel body wrapper must **not** add `border-top` under the header. Implementations may key off library open markers (Base UI: `data-panel-open` on trigger, `data-open` on item/panel).

Accessibility contract:
- The chevron icon button is the focusable control carrying the trigger `id`, `aria-expanded`, `aria-controls`, and an accessible name (`aria-labelledby` → header title when present, else `aria-label`); the panel `role="region"` `aria-labelledby` resolves through that button.
- Panel carries `role="region"` and `aria-labelledby`.
- Keyboard support: `Enter`, `Space`, `Home`, `End`. (Arrow keys no longer move focus between accordion triggers.)

Fallback/error rules:
- Unknown `chevronPosition` -> fallback to `"left"`.
- Missing `value` or duplicate `value` entries are validation errors.

Validation checklist:
- [ ] Generated hierarchy is `Accordion -> AccordionItem -> AccordionHeader -> AccordionBody` (no separate public `AccordionTrigger` peer; header subsumes trigger).
- [ ] All state rows map to semantic tokens (light/dark parallel).
- [ ] Single and multi expand behavior both implemented.
- [ ] Chevron renders correctly in both left and right positions.
- [ ] `AccordionChevron` is implemented through **IdsIconButton** (`variant="ghostNeutral"`, `size="small"`, `shape="chev-down-thick"`) as the focusable trigger control — not nested inside another `<button>` — while the header row keeps pointer + focus visuals.
- [ ] Focus-visible ring is visible and not clipped.
- [ ] Disabled rows are non-interactive.
- [ ] Expanded open item shows a visible left highlighter on trigger and body (aligned; not hidden under opaque fills); expanded body has **no** `border-top` under the header.
- [ ] Optional inner content card has no background color, no border, and no padding.
### Icon primitive and asset delivery
Use this section whenever codegen targets a stack that already ships an **Icon** (or equivalent) layer. Names vary by framework (`Icon`, `CdsIcon`, `mat-icon` + registry, `SpriteIcon`, etc.); the contract is the same.

**When the target library exposes an Icon Button / glyph-button primitive**
- **Prefer it** for `AccordionChevron` (IDS Icon Button, ghost neutral · small) instead of hand-rolling `<img src>`, bare icon slots, or hard-coded file paths in the accordion module.
- Pass a **stable asset slug** (here: `chev-down-thick`) via whatever prop the library uses (`shape`, `shapeName`, `name`, `icon`, …). That slug must match the **asset contract** entry for this component (see below).
- Icon-button state colors come from the icon-button’s own variant ladder (ghost neutral); do not re-map accordion state colors onto the glyph — only layout offsets and the 180deg rotation belong to the accordion module.

**When no Icon Button primitive exists**
- Fallback keeps the same contract shape: a focusable button-styled control rendering the `chev-down-thick` glyph via the shared icon/mask pipeline, ghost-neutral visuals at the small size, carrying `aria-expanded`/`aria-controls`.

**Asset contract (accordion chevron)**
- Slug: `chev-down-thick` (passed as the icon button’s `shape`)
- File: `assets/icons/chev-down-thick.svg` (repo root; bundler resolves from app/storybook config)
- Control: IDS Icon Button — `variant: ghost neutral`, `size: small`
- Rotation: `180deg` when expanded (CSS transform on the icon button)

**IDS / Storybook reference implementation**
- Accordion uses **`IdsIconButton`** (`variant="ghostNeutral"`, `size="small"`, `shape="chev-down-thick"`) as the chevron/trigger control; the header row is a non-button surface and Base UI `Accordion.Trigger` renders the icon button via its `render` prop. See `storybook/src/components/IdsAccordion.tsx` / `IdsAccordion.module.css`.
## Source Mapping
| Source | Location |
|---|---|
| Root spec | `components/ids/root-spec.md` |
| Theme CSS | `components/ids-theme.css` (used by Storybook IDS and codegen outputs) |
| Component map | `data/component-figma-map.json` → `Accordion` (`16551:26036` + related node ids on entry) |
| Figma token/state notes | `accordion.mdx` (extracted matrix aligned to `11067:54535` / `10962:891xx`) |
| IDS Design Library (canonical colors / examples) | https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=42156-108639&m=dev (`42156:108639`) |
| Storybook implementation | `storybook/src/components/IdsAccordion.tsx`, `storybook/src/components/IdsAccordion.module.css`, `storybook/src/components/IdsAccordion.stories.tsx` |
| Lib React implementation (no Base UI) | `lib/react/ids/accordion/` (`IdsAccordion.tsx`, `IdsAccordion.module.css`; selectors `ids-accordion`, `ids-accordion-header`, …); stories: `storybook/src/components/lib-generated/Accordion.stories.tsx` |
| Lib Lit implementation | `lib/lit/ids/src/accordion/` (`ids-icon-button` chevron inside `ids-accordion-title`) |
| Icon-button primitive | `lib/react/ids/icon-button/` (`IdsIconButton`), `lib/lit/ids/src/icon-button/` (`ids-icon-button`), `storybook/src/components/IdsIconButton.tsx` (re-export) |
| Runtime story / codegen contract | `storybook/src/spec-contracts/ids-accordion.contract.tsx` (mirrors this spec’s API + anatomy constants; stories import it) |

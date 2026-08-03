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
2. `AccordionHeader` — **same surface as the trigger:** the full header row is the interactive unit (title + chevron region, expand/collapse, focus ring, `aria-expanded`). Implementations may use an inner native `button` or a library sub-component (e.g. Base UI `Accordion.Trigger`) **inside** this header for semantics; that inner node is **not** a separate public IDS slot or second generated component—codegen exposes one header/trigger API. Header content is **top-aligned**.
3. `AccordionChevron` (left or right slot) — wrapped in a frame with **hug content** sizing and **padding-2** top/bottom
4. `AccordionBody` (framework alias: `AccordionPanel`)
5. `AccordionContent` — content is **top-aligned**

Optional child sub-slots:
- `AccordionMetaSlot` (optional helper text/metadata)
## Layout & Measurements
- Root width is container-driven (`width: 100%`).
- Item separators: `var(--border-width-border-1)` using accessible divider token.
- Trigger row uses IDS Figma contract: `min-height: 40px`, padding `10px 16px` (`var(--padding-padding-10)` `var(--padding-padding-16)`), `height: auto` to hug content.
- Header title wraps up to **2 lines**; text longer than 2 lines is truncated with ellipsis. Header title has a **max-width of 900px**.
- **Expanded body / header join:** The open **panel body** (first wrapper under `AccordionBody`; Storybook `.panel > .content`) must **not** use a `border-top` under the header—separation is **background contrast only** (header `brand-lighter` vs body `component` surface), per IDS expanded treatment.
- Open **item** left highlighter: **4px** brand strip `var(--color-border-brand-base)` aligned on the **open trigger** and **open panel** regions (implementation: left-edge `linear-gradient` on those surfaces). Do **not** rely on `inset` `box-shadow` on the item container alone—opaque trigger/panel fills paint above it and hide the bar.
- Selected/open state does **not** add a second item outline beyond shared row borders.
- Trigger/content gap and block rhythm follow `var(--spacing-space-8)` and body text line-height contracts.
- Chevron can be placed on:
  - `left` (leading; default)
  - `right` (trailing)
- Chevron icon is wrapped in a frame with **hug content** sizing (`display: inline-flex`) and **padding-2** top/bottom (`var(--padding-padding-2)`)
- Expanded item: left highlighter reads as **one** continuous **4px** strip through header and body (same token); render on surfaces that carry the row fill (trigger + panel slots), aligned so the bar does not stack into a seam.
- Expanded panel keeps contiguous border continuity with header (no visual break).
- Focus indicator must be visible on trigger row and not clipped by item container.
- Group rows follow Figma contiguous model (1px overlap/no vertical gaps).
- Expanded content container padding: `8px 24px 16px 40px` (implementations: `var(--padding-padding-40)` when present, otherwise `calc(var(--padding-padding-32) + var(--padding-padding-8))` so left inset is valid in Storybook themes).
- Optional inner **content card**: **no background color**, **no border**, and **no padding**; it holds the body text. Content card text has a **max-width of 900px**.
## Tokens
- Surface:
  - `var(--color-background-component)`
  - `var(--color-background-brand-lighter)`
  - `var(--color-background-brand-light)`
- Borders:
  - `var(--border-width-border-1)`
  - `var(--border-width-border-2)`
  - `var(--color-border-accessible)`
  - `var(--color-border-brand-base)`
  - `var(--color-border-brand-dark)` (inner content card outline)
  - `var(--color-border-strong)`
- Text/Icon:
  - `var(--color-text-neutral-strong)`
  - `var(--color-text-neutral)`
  - `var(--color-text-link-brand-base)`
  - `var(--color-icon-neutral)`
  - `var(--color-icon-neutral-strong)`
- Icon asset:
  - canonical chevron **shapeName**: `chev-down-thick` → `assets/icons/chev-down-thick.svg` (see **Icon primitive & asset delivery (codegen)** for Icon-vs-fallback rules and Storybook reference).
- Radius/spacing/type:
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
| Artboard / frame backdrop | `#F4F4F4` | `var(--color-background-surface-1)` (or nearest doc backdrop token used in app shell) |
| Accordion row / collapsed surface | `#FFFFFF` | `var(--color-background-component)` |
| Expanded **Panel** row (header tint) | `#EBF4FB` | `var(--color-background-brand-lighter)` |
| **Swap content** inner card fill | `#EBF4FB` (same tint as expanded panel in file) | `var(--color-background-brand-lighter)` |
| Left **4px** selection rail (`Rectangle 1`) | `#0076CE` | `var(--color-border-brand-base)` |
| Primary label / body text | `#252525` | `var(--color-text-neutral-strong)` |
| Inline link (“Learn how…”) | `#0062AB` | `var(--color-text-link-brand-base)` |
| Chevron (IDS library) | ~`#4D4D4D` / `#252525` in samples | `var(--color-icon-accessible)` default, hover, and expanded |

**Note:** Dark theme values come from the same semantic names in `components/ids-theme.css` dark block (e.g. brand base / link shift to lighter blues for contrast)—re-validate against dark variants in Figma when available.
## States (Light Theme)
| Slot | State | Background | Border | Text/Icon |
|---|---|---|---|---|
| trigger | default (collapsed) | `var(--color-background-component)` | item divider `var(--color-border-accessible)` | title `var(--color-text-neutral-strong)`, chevron `var(--color-icon-accessible)` |
| trigger | hover (collapsed) | `var(--color-background-brand-lighter)` | unchanged divider | title `var(--color-text-neutral-strong)`, chevron `var(--color-icon-accessible)` |
| trigger | hover (expanded) | `var(--color-background-brand-light)` | same expanded header chrome as `expanded (open)` | title `var(--color-text-neutral-strong)`, chevron `var(--color-icon-accessible)` |
| trigger | expanded (open) | `var(--color-background-brand-lighter)` | left **4px** brand strip (e.g. leading-edge gradient), no trigger-only bottom border | title `var(--color-text-neutral-strong)`, chevron `var(--color-icon-accessible)` (rotated) |
| trigger | focus-visible | same as current open/closed state | outer focus ring `var(--border-width-border-1)` `var(--color-border-brand-base)`; `border-radius: var(--corner-radius-radius-4)`; `outline-offset: 0` (height equals item border) | same as default |
| trigger | disabled | same as base state | unchanged | reduced emphasis (`opacity` contract) + non-interactive cursor |
| panel/content | expanded | `var(--color-background-component)` | item perimeter `var(--color-border-accessible)`; left **4px** brand strip aligned with header; **no** `border-top` on body wrapper | body `var(--color-text-neutral)`, link `var(--color-text-link-brand-base)` |
| content-card | expanded (optional) | none / transparent | none | heading/body per content; link `var(--color-text-link-brand-base)` |
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
- Chevron rotates 180deg in expanded state for both left and right positions.
- Arrow key roving focus is supported between triggers.
- Home/End move focus to first/last trigger.
- Panel content participates in layout only when expanded.
## Composition & API (runtime)
Canonical machine-readable mirror (Storybook + codegen QA; MDX is not executed by Storybook): `storybook/src/spec-contracts/ids-accordion.contract.tsx`.

Main inputs:
- `items: AccordionItemInput[]` (required)
- `multiple?: boolean` (default `false`)
- `defaultValue?: string[]`
- `chevronPosition?: "left" | "right"` (default `"left"`)

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
      - optional leading `AccordionChevron` (left variant)
      - `title`
      - optional trailing `AccordionChevron` (right variant)
      - *implementation detail:* inner focusable control / library `Trigger` wrapper when required by the target primitive; must not surface as a second IDS peer component
    - `AccordionBody` (aka `AccordionPanel` for libraries that use panel naming)
      - `AccordionContent`
      - optional `AccordionMetaSlot`

Variant matrix:
- `chevronPosition`: `left | right`
- expand behavior: `single | multiple` (resolved from user input)
- item state: `collapsed | expanded | disabled`

Asset & icon primitive contract:
- `AccordionChevron` resolves asset by slug **`chev-down-thick`** (stable across frameworks; path rule in **Icon primitive & asset delivery**).
- If generated code targets a design system that provides **`Icon` (or equivalent)** → render chevron **through that component** with the slug/shape prop required by that library; apply state colors from this spec via that component’s tintable API.
- If no Icon exists → document chosen fallback (inline `currentColor` SVG, sprite, etc.) in generated module header and keep slug + token mapping identical.

Behavior contract:
- If `multiple=false`, opening one item closes the previously open item.
- If `multiple=true`, toggles item independently.
- `disabled` prevents toggle and focus activation by keyboard/pointer.
- Expanded header/panel border continuity must be preserved (no seam).
- Expanded open item must show a continuous **4px** left highlighter `var(--color-border-brand-base)` on header and body (aligned surfaces; avoid parent-only `inset` shadow hidden by opaque children). Panel body wrapper must **not** add `border-top` under the header. Implementations may key off library open markers (Base UI: `data-panel-open` on trigger, `data-open` on item/panel).

Accessibility contract:
- The header/trigger surface carries `aria-expanded` and `aria-controls` on the actual focusable control (if the header wraps an inner `button`, those attributes live on that element).
- Panel carries `role="region"` and `aria-labelledby`.
- Keyboard support: `Enter`, `Space`, `ArrowUp`, `ArrowDown`, `Home`, `End`.

Fallback/error rules:
- Unknown `chevronPosition` -> fallback to `"left"`.
- Missing `value` or duplicate `value` entries are validation errors.

Validation checklist:
- [ ] Generated hierarchy is `Accordion -> AccordionItem -> AccordionHeader -> AccordionBody` (no separate public `AccordionTrigger` peer; header subsumes trigger).
- [ ] All state rows map to semantic tokens (light/dark parallel).
- [ ] Single and multi expand behavior both implemented.
- [ ] Chevron renders correctly in both left and right positions.
- [ ] If the target library exposes an **Icon** (or equivalent), `AccordionChevron` is implemented **through** it with slug `chev-down-thick` (no ad-hoc asset paths in the accordion file); otherwise fallback is documented and still token-tinted per state tables.
- [ ] Focus-visible ring is visible and not clipped.
- [ ] Disabled rows are non-interactive.
- [ ] Expanded open item shows a visible left highlighter on trigger and body (aligned; not hidden under opaque fills); expanded body has **no** `border-top` under the header.
- [ ] Optional inner content card has no background color, no border, and no padding.
### Icon primitive and asset delivery
Use this section whenever codegen targets a stack that already ships an **Icon** (or equivalent) layer. Names vary by framework (`Icon`, `CdsIcon`, `mat-icon` + registry, `SpriteIcon`, etc.); the contract is the same.

**When the target library exposes an Icon / glyph component**
- **Prefer it** for `AccordionChevron` instead of hand-rolling `<img src>` or hard-coded file paths in the accordion module.
- Pass a **stable asset slug** (here: `chev-down-thick`) via whatever prop the library uses (`shapeName`, `name`, `icon`, `glyph`, …). That slug must match the **asset contract** entry for this component (see below).
- For **monochrome** chevrons, use the library’s **tintable** mode when offered (e.g. mask + semantic `color`, or SVG `currentColor`). Map states to tokens from this spec’s state tables (`var(--color-icon-neutral)`, `var(--color-icon-neutral-strong)` on hover, etc.).
- For **multi-color** SVGs only, use the library’s **non-tinted / raster** mode if required; accordion chevron is **not** in that category.

**When no Icon primitive exists**
- Fallback is still slug-driven: inline SVG with `fill="currentColor"`, sprite id, or framework asset pipeline, but the **same slug** and **same token → color** mapping must apply. Do not rely on `color` CSS on `<img>` for fixed-fill SVG assets.

**Asset contract (accordion chevron)**
- Slug: `chev-down-thick`
- File: `assets/icons/chev-down-thick.svg` (repo root; bundler resolves from app/storybook config)
- Rotation: `180deg` when expanded (CSS transform on the chevron slot wrapper is acceptable)

**IDS / Storybook reference implementation**
- `Icon` in `storybook/src/components/Icon.tsx`: `import.meta.glob` over `assets/icons/*.svg`, default **`variant` `mask`**, optional `variant` `img` for full-color glyphs. Accordion uses **`Icon` + `shapeName="chev-down-thick"`** + mask tint pattern (`color` + `background-color: currentColor` on the slot class). See `IdsAccordion.tsx` / `IdsAccordion.module.css`.
## Source Mapping
| Source | Location |
|---|---|
| Root spec | `components/ids/root-spec.md` |
| Theme CSS | `components/ids-theme.css` (used by Storybook IDS and codegen outputs) |
| Component map | `data/component-figma-map.json` → `Accordion` (`16551:26036` + related node ids on entry) |
| Figma token/state notes | `accordion.mdx` (extracted matrix aligned to `11067:54535` / `10962:891xx`) |
| IDS Design Library (canonical colors / examples) | https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=42156-108639&m=dev (`42156:108639`) |
| Storybook implementation | `storybook/src/components/IdsAccordion.tsx`, `storybook/src/components/IdsAccordion.module.css`, `storybook/src/components/IdsAccordion.stories.tsx` |
| Shared Icon primitive (Storybook) | `storybook/src/components/Icon.tsx` (`shapeName` → `assets/icons/*.svg`) |
| Runtime story / codegen contract | `storybook/src/spec-contracts/ids-accordion.contract.tsx` (mirrors this spec’s API + anatomy constants; stories import it) |

# Card Design Spec

## Metadata

| Property | Value |
|---|---|
| Component | Card |
| Design system | IDS |
| Spec pattern | `ids-native` |
| Category | Patterns |
| Status | draft |
| Version | 2.0.0 |
| Description | Surface container with required header (title + optional filters) and body; optional footer actions. Header kebab opens a Dropdown of **per-card user-defined** options. |
| Theme CSS | `components/ids-theme.css` |
| File key | `0bHk3XhrjFhowgFkz9yLr4` |
| Main (`Card-Main`) | https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=8381-14051&m=dev — **`8381:14051`** |
| Element overflow (kebab / Filter Menu) | https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=15718-197531&m=dev — **`15718:197531`** (`Filter Menu=Hide` closed trigger) |
| Element content | https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=15718-220135&m=dev — **`15718:220135`** (`.Card-Element-Content`) |
| Validated variant nodes | **`8381:14245`** (Buttons=Yes, Overflow=Yes), **`8381:14305`** (Buttons=Yes, Overflow=No), **`15718:197984`** (Buttons=No, Overflow=Yes), **`15718:197994`** (Buttons=No, Overflow=No), **`15718:219736`** (Content Type=Text), **`15718:220110`** (Content Type=Key Value Pair) |
| Verification method | Figma MCP (`get_screenshot`, `get_metadata`, `get_design_context`, `get_variable_defs`) — **2026-07-14** |
| Storybook | `storybook/src/components/IdsCard.stories.tsx` — title **`Spec Generated/IDS/Card`**, story **`Spec Accurate Design`** |
| Reference implementation | `storybook/src/components/Card.tsx`, `Card.module.css`, `CardHeaderMenu.tsx` |
| Composition dependencies | IDS Button (footer actions), IDS Dropdown menu / overlay pattern (kebab options), optional consumer Dropdown in `CardAdditionalFilter`, optional Key-value table instance in body |

### Parent composition

Card is a **page-level / panel surface**. Parents compose one or more Cards; each Card owns its own `menuOptions` list (options are **not** shared across cards).

## Anatomy

Render order (locked to Figma + intake composition):

1. `CardRoot` — **single wrapper** for header + body + footer; owns the outer border (square, no radius). Internal regions do **not** draw separate box frames.
2. `CardHeader` — required row (`Card Title` **`8381:14246`** / Dashboard-Element-Card **`14093:123117`**)
   1. `CardTitle` — Header 6 alone (Card-Main) **or** Body 1 when paired with secondary (Dashboard card **`14093:123119`**)
   2. `CardTitleDivider` — optional `\|` when secondary present (**`14093:123120`**)
   3. `CardSecondaryTitle` — **optional** inline Body 1 / `var(--color-text-neutral)` (**`14093:123121`**)
   4. `headerMeta` — **optional** trailing Body 2 (e.g. “Last 24 Hours”)
   5. `CardAdditionalFilter` — **optional**
   6. `CardFilter` — **optional** kebab
3. `CardBody` — required content region (`Card Content` **`14978:28002`**); `size` `span-1`\|`span-2`\|`span-3` for Dashboard grid
   - Body may host **Text** content (**`15718:219736`**), **Key Value Pair** table instance (**`15718:220110`**), or arbitrary consumer children
4. `CardFooter` — **optional** (`Card Footer` **`8381:14252`** when `showButtons=true`)
   1. `CardAction` — **one or more** action controls (Figma sample: tertiary/link-style Buttons labeled “Action”)

**Explicit inventory count (primary variant `8381:14245`):** `CardRoot` + `CardHeader` + `CardTitle` + `CardFilter` + `CardBody` + `CardFooter` + `CardAction`×N (≥1 when footer shown) = **7+** slots in render tree. Design-time “Swap content” placeholder inside body is **not** a runtime slot — delete / replace in production.

```mermaid
flowchart TD
  CardRoot --> CardHeader
  CardRoot --> CardBody
  CardRoot --> CardFooter
  CardHeader --> CardTitle
  CardHeader --> CardSecondaryTitle
  CardHeader --> CardAdditionalFilter
  CardHeader --> CardFilter
  CardFilter --> DropdownMenu
  CardFooter --> CardAction
```

## Layout & Measurements

| Region | Figma evidence | Runtime |
|---|---|---|
| Main board | `Card-Main` **`945×662`** (`8381:14051`) | Documentation board only |
| Card sample frame | **`430×313`** (with footer) / **`430×258`** (no footer) | Preferred **`min-width: min(100%, var(--card-min-width))`** → `430px` at large hosts for default `span-1`; never exceed parent (responsive). Token changeable later. `width: 100%`; height content-driven |
| CardRoot stack | One wrapper: `flex-direction: column`; **single outer border**; **`border-radius: 0`**. Header/body/footer are inner regions only. Seam: **`CardBody` `border-top` always** (header‖body). **`CardBody` `border-bottom` only when footer is present** (body‖footer). Without footer, root border is the bottom edge — do not double it. (Figma uses overlapping frames + −1px; CSS uses single-shell.) | One card outline, not three stacked boxes |
| CardHeader | `padding: 12px 8px 12px 24px` (`py-12`, `pl-24`, `pr-8`); `gap: 8px`; items center | Title grows; filters shrink-0 on the trailing side |
| CardTitle | height sample **32px**; Header 6 **18/25** | `min-width: 0`; ellipsis when overflowing |
| CardFilter trigger button | padding `8px 16px`; icon **16×16**; button radius **2px** (`15718:197453`) | Kebab uses `overflow-menu-dots` (vertical ellipsis) |
| CardBody | `padding: 16px 24px`; column; `gap: 10px`; `flex: 1` | Hosts children / content templates |
| CardFooter | `padding: 16px 24px`; action group `gap: 8px` | Omit entirely when no actions |
| Content Text | stack `gap: 4px`; section title Body 1 **16/24**; body Body 2 **14/20** (`15718:219736`) | Sample width ~390px — runtime `100%` |
| Content Key Value | hosts `Table - key value pair` instance (`15718:220110` / **`11677:161723`**) | Compose existing table pattern; do not re-implement cells in Card |

### Slot geometry (Figma-verified)

| Slot / layer | Property | Token / contract | Figma node | Live evidence |
| --- | --- | --- | --- | --- |
| `CardRoot` outer shell | `border-radius` | **`0`** / `var(--corner-radius-radius-none)` / `var(--card-control-radius)` → none | `8381:14245` (+ section nodes) | MCP `get_variable_defs` → `Corner Radius/radius-none` = 0 on header/body/footer |
| `CardRoot` outer shell | `border` | `var(--border-width-border-default)` × `var(--color-border-accessible)` | `8381:14245` | Single wrapper border (runtime alternative to Figma’s per-section frames) |
| `CardBody` fill | `background` | `var(--color-background-surface-2)` → `#ffffff` (light) | `14978:28002` | MCP `get_design_context` / `get_variable_defs` on Card Content |
| Header ‖ body seam | divider | `border-top` on `CardBody` — `var(--border-width-border-default)` × `var(--color-border-accessible)` | `14978:28002` | Always |
| Body ‖ footer seam | divider | `border-bottom` on `CardBody` **only when footer present** — same tokens | `14978:28002` / `8381:14252` | Omit when no footer (root border owns bottom edge) |
| `CardFilter` trigger button | `border-radius` | `var(--corner-radius-radius-2)` → **2px** | `15718:197453` | MCP `get_variable_defs` → `Corner Radius/radius-2` = 2 |

**Geometry authoring rules (mandatory):**
- Document **each** interactive shell separately: field/control, focus ring, menu/panel, inner action wrappers.
- Values must come from **live Figma** on the cited node (`get_variable_defs` preferred for radius bindings). Do **not** infer from `ids-theme.css`, sibling components, or programme fork tables alone.
- When Figma binds `Corner Radius/radius-none` (0px), record **0px / square**.
- Theme aliases document **implementation wiring** only after the Figma value is verified; alias resolved value must match the table.

## Tokens

### Typography

| Slot | Style / tokens | Evidence |
|---|---|---|
| `CardTitle` alone (Card-Main) | Header 6 — `var(--font-size-header-6)` / `var(--font-line-height-line-height-25)`, `var(--color-text-neutral-strong)` | `8381:14247` |
| `CardTitle` + `CardSecondaryTitle` (Dashboard card) | Body 1 — `var(--font-size-body-1)` / `var(--font-line-height-line-height-24)`, strong | `14093:123119` |
| `\|` divider | Body 1 — `var(--color-text-neutral-strong)` | `14093:123120` |
| `CardSecondaryTitle` | Body 1 — `var(--color-text-neutral)` `#4d4d4d` | `14093:123121` |
| `headerMeta` (e.g. Last 24 Hours) | Body 2 — `var(--color-text-neutral)` | `49163:96564` |
| Body text (Content Type=Text) section title | Body 1 | `15718:198223` |
| Body paragraph | Body 2 | `15718:198224` |
| `CardAction` label | Body 2 | Footer Button instances |

### Colors and surfaces

| Use | Token | Light resolved (evidence) |
|---|---|---|
| `CardRoot` / `CardHeader` / `CardFooter` fill | `var(--color-background-surface-2)` | `#ffffff` (`8381:14246`, `8381:14252`) |
| **`CardBody` fill** | **`var(--color-background-surface-2)`** | **`#ffffff`** — Card Content **`14978:28002`** (`get_design_context` / `get_variable_defs`) |
| Section / outer / body seam borders | `var(--color-border-accessible)` | `#757575` |
| Title / body text | `var(--color-text-neutral-strong)` | `#252525` |
| Kebab icon | `var(--color-icon-neutral)` | `#4d4d4d` |
| Footer action text | `var(--color-text-brand-strong)` | `#055fa9` |
| Design-time `.SwapContent` fill only (not `CardBody`) | `var(--color-background-brand-lighter)` | `#ebf4fb` — nested placeholder **`14978:28110`**; do **not** use as body chrome |
| Design-time `.SwapContent` border | `var(--color-border-brand-dark)` | `#055fa9` |
| Design-time help link | `var(--color-text-link-brand-base)` | `#055fa9` |

### Spacing

| Use | Token | Resolved |
|---|---|---|
| Header / body / footer horizontal padding (lead) | `var(--padding-padding-24)` | 24 |
| Header trailing padding | `var(--padding-padding-8)` | 8 |
| Header vertical padding | `var(--padding-padding-12)` | 12 |
| Body / footer vertical padding | `var(--padding-padding-16)` | 16 |
| Header / action gaps | `var(--spacing-space-8)` | 8 |
| Body internal gap | `var(--spacing-space-10)` | 10 |
| Text content stack gap | `var(--spacing-space-4)` | 4 |
| Contiguous section seams | Figma uses `space-minus-1` (−1) overlapping frames; **runtime** uses single `CardRoot` border + body `border-top` always + body `border-bottom` only with footer (no negative gap) | — |

### Borders / radius

| Use | Token |
|---|---|
| Section border width | `var(--border-width-border-default)` |
| Card shell radius | `var(--card-control-radius)` → `var(--corner-radius-radius-none)` |
| Filter trigger radius | `var(--corner-radius-radius-2)` |

### Shadows / elevation

No elevation / shadow bindings on `Card-Main` variants. Do **not** invent elevation for default Card. (Legacy `elevated` story flag is demo-only if retained.)

## States (Light Theme)

| Area | State | Background | Border | Text/Icon |
| --- | --- | --- | --- | --- |
| `CardRoot` | default | `var(--color-background-surface-2)` | `var(--color-border-accessible)` (outer only) | — |
| `CardBody` | default (no footer) | **`var(--color-background-surface-2)`** (`#ffffff` light) | `border-top` only `var(--color-border-accessible)` | `var(--color-text-neutral-strong)` |
| `CardBody` | with footer | same fill | `border-top` + `border-bottom` `var(--color-border-accessible)` | same |
| `CardHeader` / `CardFooter` | default | `var(--color-background-surface-2)` (or transparent over root fill) | none | `var(--color-text-neutral-strong)` / `var(--color-icon-neutral)` |
| `CardFilter` trigger | default | transparent | transparent | `var(--color-icon-neutral)` |
| `CardFilter` trigger | hover | (Button hover per IDS Button) | — | `var(--color-icon-neutral)` or Button icon hover token |
| `CardFilter` trigger | focus-visible | — | focus ring per IDS Button / focus tokens | — |
| `CardFilter` trigger | disabled | — | — | `var(--color-icon-accessible)` |
| Dropdown overlay items | default / hover / press / disabled | Per Dropdown menu contract (`components/ids/dropdown-single-select` / shared `DropdownMenu`) | — | — |
| `CardAction` | default | transparent | transparent | `var(--color-text-brand-strong)` |
| `CardAction` | hover / press / focus-visible / disabled | Per IDS Button tertiary / link action contract | — | — |

Card surface itself is **not** a selectable control in Figma `Card-Main` — do not apply selected / pressed chrome to `CardRoot` unless a future States URL proves it.

## States (Dark Theme)

Dark theme uses the same semantic tokens as **States (Light Theme)**. Resolved values for `[data-theme="dark"]` / `.ids-theme-dark` (and program overlays) live in theme CSS:

- `components/ids-theme.css`
- `components/<program>-theme.css` when a program overlays IDS (for example `components/dap-theme.css`)

Duplicate the full state matrix in this section only when a dark row genuinely uses different `var(--...)` references than the corresponding light row.

*(When Light and Dark tables would list identical `var(--...)` cells, keep the matrix under **States (Light Theme)** only and use this pointer section instead of a second table.)*

## Interactions

| Trigger | Behavior |
|---|---|
| Click / Activate `CardFilter` (kebab) | Toggle Dropdown overlay open/closed. Menu lists **`menuOptions` supplied for this Card instance only**. |
| Select Dropdown option | Fire `onOptionSelected(value)`; close menu. Do **not** mutate title or other Card chrome unless consumer handles the event. |
| Click outside / Escape (menu open) | Close Dropdown. |
| Activate `CardAction` | Fire that action’s handler (consumer-defined). Footer may contain multiple independent actions. |
| `CardAdditionalFilter` | Owned by consumer Dropdown/control; Card does not intercept. |
| Keyboard on `CardFilter` | `Enter` / `Space` toggles menu; arrow keys move within menu; `Escape` closes (align with IDS Dropdown menu a11y). |

### Accessibility

- `CardRoot`: landmark or `group` as appropriate; when `title` is set, associate via `aria-labelledby` on the title heading.
- `CardFilter` trigger: `button` with accessible name (e.g. “Card options” / “Options for {title}”); `aria-haspopup="menu"`; `aria-expanded`.
- Dropdown: `role="menu"` / `menuitem` (or listbox pattern already used by shared DropdownMenu) — **reuse** IDS menu a11y, do not invent a parallel one.
- `CardAction`: real buttons/links with visible labels; do not rely on color alone.

### Behavior & guidelines

- **Do** pass a distinct `menuOptions` array per Card instance.
- **Do** omit `CardFilter` when `showOverflowMenu=false` or when `menuOptions` is empty/undefined.
- **Do** omit `CardFooter` when `showButtons=false` or no actions.
- **Don’t** hardcode shared global overflow menus across cards.
- **Don’t** ship the Figma “Swap content” placeholder in production UIs.

## Composition & API (runtime)

### Variants

| Axis | Values | Figma / contract |
|---|---|---|
| `showButtons` | `true` \| `false` | `Show Buttons=Yes\|No` on `Card-Main` |
| `showOverflowMenu` | `true` \| `false` | `Show Overflow menu=Yes\|No` |
| Body content type (templates) | `children` (default) \| `text` \| `keyValue` | `.Card-Element-Content` `Content Type=Text\|Key Value Pair` |
| `size` | `span-1` (default) \| `span-2` \| `span-3` | Dashboard 3-column span (composition with [`dashboard/design-spec.md`](../dashboard/design-spec.md)) |

Valid combinations: all four products of `showButtons` × `showOverflowMenu`. Body templates and `size` are independent.

### Runtime API

#### Inputs

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | — | Primary title. Alone → Header 6 (Card-Main). With `secondaryTitle` → Body 1 inline (Dashboard-Element-Card) |
| `secondaryTitle` | `string` \| `node` \| `<CardSecondaryTitle>` | — | Inline after `\|` — Body 1 / `var(--color-text-neutral)` (Figma `14093:123121`) |
| `headerMeta` | `string` \| `node` | — | Optional trailing meta before kebab (e.g. “Last 24 Hours” — Body 2 / neutral, `49163:96564`) |
| `header` | `node` | — | Optional full custom header replace; when set with `showOverflowMenu`, kebab still pins trailing |
| `additionalFilter` | `node` | — | Optional `CardAdditionalFilter` slot (any Dropdown / filter) |
| `children` | `node` | **required** | `CardBody` content |
| `actions` / `footer` | `node` \| `CardAction[]` | — | Footer content; multiple `CardAction` allowed |
| `showButtons` | `boolean` | `false` | When `false`, hide `CardFooter` |
| `showOverflowMenu` | `boolean` | `false` | When `true` **and** `menuOptions.length > 0`, show kebab |
| `menuOptions` | `{ value: string; label: string; disabled?: boolean }[]` | — | Per-card Dropdown options |
| `onOptionSelected` | `(value: string) => void` | — | Kebab menu selection |
| `size` | `span-1` \| `span-2` \| `span-3` | `span-1` | Column span inside Dashboard grid. Default `span-1` also sets **`min-width: var(--card-min-width)`** (`430px`, Figma Card-Main). `span-2` / `span-3` scale min-width to 2× / 3× tracks (+ grid gaps). |

**Child component:** `CardSecondaryTitle` — render secondary text under `CardTitle` (also accepted via `secondaryTitle` prop).

**Alias note:** existing implementation may expose `showOverFlowMenu` (capital `F`) — treat as alias of `showOverflowMenu`; prefer camelCase `showOverflowMenu` in new codegen.

#### Outputs

| Event | Payload |
|---|---|
| `onOptionSelected` | `value: string` of selected `menuOptions` entry |
| Per-action handlers | Consumer-defined on each `CardAction` |

#### Demo-only (Storybook / QA)

| Prop | Notes |
|---|---|
| `elevated` / `outlined` | Not in Figma `Card-Main`; do not require for production. Prefer omit. |
| `forceOpenMenu` / `data-state` | QA only; must not block runtime open/close. |

### Spec Accurate Design story defaults

| Arg | Value |
|---|---|
| `title` | `"Card Title"` |
| `showOverflowMenu` | `true` |
| `menuOptions` | `[{ value: "edit", label: "Edit" }, { value: "duplicate", label: "Duplicate" }, { value: "delete", label: "Delete" }]` |
| `showButtons` | `true` |
| `children` | `CardTextContent` — section title `"Section Title"` + Figma Body 2 lorem (`15718:219736`); **not** the design-time Swap placeholder |
| `actions` | Two tertiary labels `"Action"` / `"Action"` |
| Host width | min `430px` (`--card-min-width`); Storybook host may use `430px` to match Figma sample |
| Theme import | `components/ids-theme.css` only |

Additional stories under **Spec Generated/IDS/Card**: `Figma Card-Main matrix` (2×2 buttons×overflow), `Content Type Text`, `Content Type Key Value Pair`, `With additional filter`.

## Codegen Contract (Framework-Agnostic Blueprint)

### Deterministic structure

```
CardRoot [data-card-size=span-1|span-2|span-3]
├── CardHeader
│   ├── CardTitleCluster
│   │   ├── CardTitle                          [optional when secondary alone]
│   │   └── CardSecondaryTitle                 [optional]
│   ├── CardAdditionalFilter                   [optional]
│   └── CardFilter (kebab Button)              [optional → DropdownMenu]
│       └── DropdownMenu (user options)
├── CardBody                                   [required]
│   └── children | TextTemplate | KeyValueTemplate
└── CardFooter                                 [optional]
    └── CardAction+                            [one or more]
```

### Variant matrix

| `showButtons` | `showOverflowMenu` | `menuOptions` | Result |
|---|---|---|---|
| false | false | — | Header title only + body |
| false | true | non-empty | Header title + kebab + body |
| true | false | — | Header + body + footer actions |
| true | true | non-empty | Full composition (Figma `8381:14245`) |
| * | true | empty/undefined | **No kebab** (fail closed) |

### Per-slot style contract

| Slot | Styles |
|---|---|
| `CardRoot` | column flex; `width: 100%`; **`min-width: var(--card-min-width)` → `430px`** (default / `span-1`); outer `1px` `var(--color-border-accessible)`; **`border-radius: 0`**; fills with `var(--color-background-surface-2)` |
| `CardHeader` | no section border; padding `12px 8px 12px 24px`; flex row; gap 8 |
| `CardTitle` | Header 6 when alone; Body 1 + strong when with secondary (Dashboard card) |
| `CardSecondaryTitle` | Inline after `\|`; Body 1; `var(--color-text-neutral)` |
| `headerMeta` | Body 2; `var(--color-text-neutral)`; before kebab |
| `CardAdditionalFilter` | shrink-0; consumer styles |
| `CardFilter` | Button padding `8px 16px`; icon 16×16; icon color `var(--color-icon-neutral)`; radius 2px |
| Dropdown | Shared IDS dropdown/overlay tokens — do not re-skin ad hoc |
| `CardBody` | fill **`var(--color-background-surface-2)`**; `border-top` always; `border-bottom` only when footer present; padding `16px 24px` |
| `CardFooter` | no section border; padding `16px 24px`; flex row; gap 8 |
| `size` | In Dashboard grid: `span-1` → 1 col + min-width `430px`; `span-2` / `span-3` → 2 / 3 cols with scaled min-width |
| `CardAction` | Body 2; `var(--color-text-brand-strong)`; IDS Button tertiary/link |

### Behavior contract

1. Mount: render header + body; footer/kebab per matrix.
2. Open kebab → Dropdown with this card’s `menuOptions`.
3. Select option → `onOptionSelected(value)` → close menu.
4. Action click → that action’s handler only.
5. One card shell: `CardRoot` wraps header/body/footer. Outer border only on root; square corners (`radius-none`). Internal seams: **`CardBody` `border-top` always**; **`border-bottom` only when footer is present**. Never paint three separate section boxes; never use negative CSS `gap`.

### Accessibility contract

- Title → heading (`h2`/`h3` as appropriate in page outline).
- Kebab → named button + menu semantics.
- Actions → named buttons.
- Focus order: title cluster → additional filter → kebab → body focusables → footer actions.

### Asset resolution + bundling contract

| Asset | Slug / source | Rule |
|---|---|---|
| Kebab icon | `overflow-menu-dots` (Figma **`48133:233331`**) | Bundle via IDS Icon / SVG map; 16×16 in trigger |
| Key-value icons | Per table/cell instances | Owned by Key-value / table dependency |

### Fallback/error rules

| Condition | Behavior |
|---|---|
| Unknown variant flag | Treat boolean as `false` |
| `showOverflowMenu=true` but empty `menuOptions` | Hide kebab; do not render empty menu |
| Missing `title` and no `header` | Render header only if filter/menu present; otherwise omit header |
| Missing tokens | Keep `var(--...)` references; do not substitute hex in codegen |
| Missing icon asset | Keep button chrome; omit glyph or use IDS Icon fallback |

### Validation checklist

- [ ] **Slot geometry (Figma-verified)** table complete; every border-radius row cites a Figma node + MCP method
- [ ] Theme alias `--card-control-radius` resolves to `radius-none` (matches geometry table)
- [ ] Anatomy order matches Deterministic structure (incl. optional AdditionalFilter + kebab)
- [ ] Kebab opens Dropdown with **per-card** `menuOptions`
- [ ] `showButtons` / `showOverflowMenu` matrix covers all four Figma variants
- [ ] Footer supports multiple `CardAction`s
- [ ] No design-time “Swap content” chrome in production output
- [ ] Spec Accurate Design story under `Spec Generated/IDS/Card` uses Runtime API + theme CSS import only
- [ ] Light state matrix present; Dark uses boilerplate when tokens match
- [ ] Screenshots taken for Main + both Element URLs during verification

## Source Mapping

| Bucket | URL | Node | MCP tools |
|---|---|---|---|
| Main | [Card-Main](https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=8381-14051&m=dev) | `8381:14051` (+ variants `8381:14245`, `8381:14305`, `15718:197984`, `15718:197994`) | `get_screenshot`, `get_metadata`, `get_design_context`, `get_variable_defs` |
| Elements | [Overflow / Filter Menu](https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=15718-197531&m=dev) | `15718:197531` | same |
| Elements | [Content](https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=15718-220135&m=dev) | `15718:220135` (+ `15718:219736`, `15718:220110`) | same |
| States | _(none provided)_ | — | — |

- Component map entry: `data/component-figma-map.json` → component `"Card"` (category `"Patterns"`; primary node `"8381-14051"`)
- Extraction path: Main board → primary variant `Show Buttons=Yes, Show Overflow menu=Yes` → header/body/footer shells → overflow element → content element templates

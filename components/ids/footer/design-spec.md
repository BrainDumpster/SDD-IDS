# Footer Design Spec

## Metadata
- **Component:** Footer
- **Category:** Navigation
- **Design System:** IDS
- **Version:** 1.0.0
- **Description:** Application status footer bar with optional host name, SWID (with copy), current date/time, and time-zone selector.
- **Status:** active
- **Created:** 2026-05-22
- **Updated:** 2026-05-25
- **Figma (validated):** https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=38908-5818&m=dev
- **Figma file key:** `0bHk3XhrjFhowgFkz9yLr4`
- **Primary node:** `38908:5818` (component instance `Footer`)
- **Child nodes (same file):** `38908:5819` Left; `38908:5820` Host Name; `38908:5821` SWID; `38908:5823` copy; `38908:5825` Time; `38908:5826` time-clock; `38908:5829` Time Zone; `38908:5830` world-globe
- **Figma variant axes (boolean toggles on component):** `hostname`, `currentDateAndTime`, `timeZone` (all default `true` in library sample)
- **Storybook examples requested:** yes
- **Storybook path (React):** `storybook/src/components/IdsFooter.stories.tsx`
- **Storybook path (Angular):** `storybook-angular/src/components/ids-footer/ids-footer.stories.js`
- **Storybook meta title:** `Spec Generated/IDS/Footer`
- **Live verification:** Figma MCP — `get_design_context` + `get_variable_defs` on `38908:5818` (session 2026-05-22)

## Anatomy
Deterministic slot order (left → right):

1. `FooterRoot` — full-width status bar container (`<footer>` or host-equivalent landmark)
2. `FooterLeftRegion` — grows to fill remaining horizontal space (`flex: 1`)
3. `FooterHostName` (optional) — label + value pair (`Host Name:` + hostname string)
4. `FooterSwidGroup` (optional when SWID shown) — label + value + `FooterCopyControl`
5. `FooterCopyControl` — icon-only control for SWID copy (`copy` icon, 14×14)
6. `FooterTimeGroup` (optional) — `FooterTimeIcon` + `FooterDateTimeLabel`
7. `FooterTimeZoneGroup` (optional) — `FooterTimeZoneIcon` + `FooterTimeZoneAction` (link-styled control)

## Layout & Measurements
- Root width is container-driven: `width: 100%`, `box-sizing: border-box`.
- Root height: **32px** (fixed bar height in Figma sample `38908:5818`).
- Root layout: horizontal flex, `align-items: center`, main axis packs optional right groups toward the **end** (`justify-content: flex-end`); left region still consumes free space on the start side.
- Root border: `var(--border-width-border-1)` solid `var(--color-border-light)` on all sides (Figma frame uses full perimeter stroke).
- Root padding: none on root; inner regions carry horizontal padding.
- **Left region:** `padding-left` / `padding-right` `var(--padding-padding-16)`; gap between host and SWID groups `var(--spacing-space-24)`; items vertically centered.
- **Host name block:** content-driven width; Figma sample text area ~277px — do not hardcode width at runtime unless product requires truncation.
- **SWID group:** inline flex, gap `var(--spacing-space-8)`; copy control **14×14px** hit target (expand focus ring per a11y contract).
- **Time group:** gap `var(--spacing-space-8)`; padding `var(--padding-padding-4)` top, `3px` bottom (Figma asymmetric), `var(--padding-padding-16)` left, `var(--padding-padding-8)` right; clock icon **16×16px**.
- **Time zone group:** gap `var(--spacing-space-8)`; padding `var(--padding-padding-4)` top, `3px` bottom, `var(--padding-padding-8)` left, `var(--padding-padding-16)` right; globe icon **16×16px**.
- Typography: **Body 2** medium — `var(--font-size-body-2)` / `var(--font-line-height-line-height-20)`; label prefixes use medium weight, values use regular/medium per Figma pairing.
- Sample frame width **1664px** in Figma is reference-only; runtime width follows application shell.

## Tokens
### Typography
- Label prefixes (`Host Name:`, `SWID:`): `var(--font-size-body-2)`, `var(--font-line-height-line-height-20)`, medium weight, `var(--color-text-neutral-strong)`
- Host/SWID values: same size/line-height, `var(--color-text-neutral)`
- Date/time label: Body 2 medium, `var(--color-text-neutral)`
- Time zone action label: Body 2 medium, `var(--color-text-brand-strong)`

### Colors and surfaces
- Bar background: `var(--color-background-surface-1)`
- Bar border: `var(--color-border-light)`
- Copy icon (default/interactive): `var(--color-icon-brand-base)`
- Time clock icon: `var(--color-icon-neutral)`
- World globe icon: `var(--color-icon-brand-base)` (matches brand treatment of time-zone group)

### Spacing
- `var(--spacing-space-24)` — gap between left-region groups
- `var(--spacing-space-8)` — inline gaps in SWID, Time, Time Zone groups
- `var(--spacing-space-4)` — time/time-zone vertical padding pairing with `3px` bottom inset from Figma

### Padding
- `var(--padding-padding-16)` — left region horizontal; time block left; time-zone block right
- `var(--padding-padding-8)` — time block right; time-zone block left
- `var(--padding-padding-4)` — time/time-zone top padding

## States (Light Theme)
| Slot | State | Background | Border | Text/Icon |
| --- | --- | --- | --- | --- |
| root | default | `var(--color-background-surface-1)` | `var(--border-width-border-1)` `var(--color-border-light)` | — |
| host label | default | transparent | none | `var(--color-text-neutral-strong)` |
| host value | default | transparent | none | `var(--color-text-neutral)` |
| swid label | default | transparent | none | `var(--color-text-neutral-strong)` |
| swid value | default | transparent | none | `var(--color-text-neutral)` |
| copy control | default | transparent | none | `var(--color-icon-brand-base)` |
| copy control | hover | transparent | none | `var(--color-icon-brand-base)` |
| copy control | focus-visible | transparent | focus ring `var(--border-width-border-2)` `var(--color-border-brand-base)` | `var(--color-icon-brand-base)` |
| copy control | disabled | transparent | none | `var(--color-icon-disabled)` |
| datetime label | default | transparent | none | `var(--color-text-neutral)` |
| timezone action | default | transparent | none | `var(--color-text-brand-strong)` |
| timezone action | hover | transparent | none | `var(--color-text-link-brand-base)` + underline |
| timezone action | focus-visible | transparent | focus ring `var(--border-width-border-2)` `var(--color-border-brand-base)` | inherits hover or default text token |
| timezone action | disabled | transparent | none | `var(--color-text-disabled)` |

## States (Dark Theme)

Dark theme uses the same semantic tokens as **States (Light Theme)**. Resolved values for `[data-theme="dark"]` / `.ids-theme-dark` (and program overlays) live in theme CSS:

- `components/ids-theme.css`
- `components/<program>-theme.css` when a program overlays IDS (for example `components/dap-theme.css`)

Duplicate the full state matrix in this section only when a dark row genuinely uses different `var(--...)` references than the corresponding light row.

*(When Light and Dark tables would list identical `var(--...)` cells, keep the matrix under **States (Light Theme)** only and use this pointer section instead of a second table.)*

## Interactions
- **SWID copy:** activating `FooterCopyControl` copies the SWID string to the system clipboard (when API available) and emits `onCopySwid` with the current SWID value; provide non-blocking confirmation in host app if required.
- **Time zone:** activating `FooterTimeZoneAction` opens the host time-zone picker or settings (`onTimeZoneClick`); control is a button styled as a link (not navigation away by default).
- **Visibility toggles:** `showHostname`, `showCurrentDateAndTime`, and `showTimeZone` mirror Figma boolean props; when false, remove the corresponding group without shifting bar height.
- Date/time string is **display-only** in the bar (no inline edit); host supplies formatted `currentDateTime` text.
- Pointer: copy and time-zone controls use `cursor: pointer`; bar background is not clickable.
- No drag, expand, or collapse behavior on the bar itself.

### Accessibility
- `FooterRoot`: landmark `footer` with `aria-label="Application status"` (or product-localized equivalent).
- `FooterCopyControl`: `type="button"`, `aria-label` includes SWID context (e.g. “Copy SWID”), `aria-disabled` when disabled.
- `FooterTimeZoneAction`: `type="button"`, visible focus ring; label text is the time-zone string (e.g. `Eastern Time (US & Canada)`).
- Keyboard: `Tab` order left → right (host → copy → time zone); `Enter` / `Space` activate copy and time-zone buttons.
- Host name and SWID values should be plain text (not headings); screen readers read label + value in document order.

### Behavior & guidelines
- Footer is a **persistent shell status strip**, not a marketing/site footer with link columns.
- Keep one line at 32px height; truncate long host/SWID strings with ellipsis rather than growing bar height.
- Time zone label should reflect the user’s active zone; update when host clock/zone changes.
- Do not embed primary actions (Save, Submit) in this bar.

## Composition & API (runtime)
### Variants
Visibility axes (boolean, default `true` — matches Figma `Footer` instance):

| Prop | Default | Effect |
| --- | --- | --- |
| `showHostname` | `true` | Renders `FooterHostName` |
| `showCurrentDateAndTime` | `true` | Renders `FooterTimeGroup` |
| `showTimeZone` | `true` | Renders `FooterTimeZoneGroup` |

### Runtime API
| Prop / event | Required | Notes |
| --- | --- | --- |
| `hostname` | No | Value after `Host Name:` label |
| `swid` | No | SWID string; when omitted, SWID group may still render empty or be hidden by host |
| `currentDateTime` | No | Pre-formatted date/time text (Figma sample: `Tue, 2023-04-23 12:30 AM`) |
| `timeZoneLabel` | No | Display string for zone action |
| `showHostname` | No | Default `true` |
| `showCurrentDateAndTime` | No | Default `true` |
| `showTimeZone` | No | Default `true` |
| `copyDisabled` | No | Disables copy control |
| `timeZoneDisabled` | No | Disables time-zone action |
| `onCopySwid?(swid: string)` | No | Fired after copy attempt |
| `onTimeZoneClick?()` | No | Fired when time-zone control activated |
| `className` | No | Host layout hook on root |

### Spec Accurate Design story defaults
Reference sample aligned to Figma node `38908:5818`:

```ts
{
  hostname: "short_name_first_domain_name",
  swid: "ELMCR00222GBPB",
  currentDateTime: "Tue, 2023-04-23 12:30 AM",
  timeZoneLabel: "Eastern Time (US & Canada)",
  showHostname: true,
  showCurrentDateAndTime: true,
  showTimeZone: true,
}
```

## Codegen Contract (Framework-Agnostic Blueprint)
### Deterministic structure
```
FooterRoot
  FooterLeftRegion
    [optional] FooterHostName → label + value text nodes
    [optional] FooterSwidGroup
      label + value text nodes
      FooterCopyControl
  [optional] FooterTimeGroup
    FooterTimeIcon
    FooterDateTimeLabel
  [optional] FooterTimeZoneGroup
    FooterTimeZoneIcon
    FooterTimeZoneAction
```

### Variant matrix
- Visibility: `showHostname` × `showCurrentDateAndTime` × `showTimeZone` (each `true | false`; eight combinations; empty left region allowed when all left content off).
- Interactive states apply only to `FooterCopyControl` and `FooterTimeZoneAction`.
- Root height remains **32px** for all visibility combinations.

### Per-slot style contract
- `FooterRoot`: background `var(--color-background-surface-1)`; border `var(--border-width-border-1)` `var(--color-border-light)`; height 32px; flex end alignment; width 100%.
- `FooterLeftRegion`: flex 1 0 0; gap `var(--spacing-space-24)`; horizontal padding `var(--padding-padding-16)`.
- `FooterHostName` / SWID labels: `var(--color-text-neutral-strong)`; values `var(--color-text-neutral)`.
- `FooterCopyControl`: 14px icon via Icon primitive slug `copy`, tint `var(--color-icon-brand-base)`.
- `FooterTimeIcon`: slug `time-clock`, 16px, `var(--color-icon-neutral)`.
- `FooterDateTimeLabel`: `var(--color-text-neutral)`, Body 2 medium.
- `FooterTimeZoneIcon`: slug `world-globe`, 16px, `var(--color-icon-brand-base)`.
- `FooterTimeZoneAction`: `var(--color-text-brand-strong)`; hover `var(--color-text-link-brand-base)` with underline.

### Behavior contract
- Copy writes `swid` prop to clipboard when enabled; always call `onCopySwid` on successful activation.
- Time zone button does not navigate by default; host handles picker via `onTimeZoneClick`.
- Hiding a group removes it from layout and tab order without reserving space.
- Long strings truncate with ellipsis; tooltips are host-defined (optional).

### Accessibility contract
- See **Interactions → Accessibility**; codegen must emit native buttons for copy and time-zone actions.
- Focus order follows visual left-to-right order among visible controls.
- `aria-live` is not required on clock text (static display); host may refresh `currentDateTime` on interval outside component.

### Asset resolution + bundling contract
| Slug | File | Size | Slot |
| --- | --- | --- | --- |
| `copy` | `assets/icons/copy.svg` | 14×14 | `FooterCopyControl` |
| `time-clock` | `assets/icons/time-clock.svg` | 16×16 | `FooterTimeIcon` |
| `world-globe` | `assets/icons/world-globe.svg` | 16×16 | `FooterTimeZoneIcon` |

Resolve through shared **Icon** primitive (`shapeName` + `variant="mask"` + semantic `color`). Unknown slug → hide icon slot and log validation warning.

### Fallback/error rules
- Unknown visibility prop values → treat as `true` if boolean coercion fails.
- Missing `swid` with `showSwid` implied by copy control → disable copy and set `aria-disabled="true"`.
- Missing `timeZoneLabel` with `showTimeZone=true` → render action with fallback label `"Time zone"` (localized by host).
- Clipboard API failure → still fire `onCopySwid`; host shows error toast.
- Unknown icon slug → omit icon; keep text/control usable.

### Validation checklist
- [ ] Bar height 32px and full-width container behavior match Figma `38908:5818`.
- [ ] All colors/spacing/typography use semantic `var(--...)` tokens (no hardcoded hex in generated styles).
- [ ] Three visibility toggles match Figma boolean axes.
- [ ] Copy and time-zone controls are keyboard-activatable with visible focus rings.
- [ ] Icon slugs `copy`, `time-clock`, `world-globe` resolve via Icon primitive.
- [ ] Spec Accurate Design story uses story defaults above under `Spec Generated/IDS/Footer`.
- [ ] Light state matrix complete; dark uses boilerplate (same semantic tokens).
- [ ] Source mapping lists MCP verification evidence.

## Source Mapping
| Source | Location |
| --- | --- |
| Component map | `data/component-figma-map.json` → `Footer` (`38908:5818`, file `0bHk3XhrjFhowgFkz9yLr4`) |
| Theme CSS | `components/ids-theme.css` |
| Root spec | `components/ids/root-spec.md` |
| Figma MCP (2026-05-22) | `get_design_context(fileKey=0bHk3XhrjFhowgFkz9yLr4, nodeId=38908:5818)`; `get_variable_defs(fileKey=0bHk3XhrjFhowgFkz9yLr4, nodeId=38908:5818)` |
| Storybook implementation (React) | `storybook/src/components/IdsFooter.tsx`, `storybook/src/components/IdsFooter.module.css` |
| Spec Generated story (React) | `storybook/src/components/IdsFooter.stories.tsx` |
| Runtime contract | `component-contracts/ids/footer.contract.ts` |
| Storybook implementation (Angular) | `storybook-angular/src/components/ids-footer/` |
| Spec Generated story (Angular) | `storybook-angular/src/components/ids-footer/ids-footer.stories.js` |

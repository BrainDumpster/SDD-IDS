## How to build with IDS

IDS is a **token-driven CSS Modules** design system. There are no utility classes and no styling
props — components own their internal styling, and you style *your own* layout with the CSS custom
properties below. Never hardcode a colour, spacing value, radius, or font size.

### Setup — one attribute, and it is load-bearing

Every IDS token is scoped to `data-design-system="ids"`, and the bundle additionally binds the light
theme to `:root`, so **light mode works with no setup**. Dark mode does not: it requires the
attribute explicitly.

```jsx
// Light (default) — nothing required.
// Dark — set BOTH attributes on <html> (or <body>):
document.documentElement.setAttribute('data-design-system', 'ids');
document.documentElement.setAttribute('data-theme', 'dark');
```

There is **no provider and no context** — components are plain React and can be rendered anywhere.
(Per-component `.prompt.md` files carry a generic note about `.storybook/preview` decorators
providing theme/i18n context. That is boilerplate and does not apply to IDS: the decorator only set
the two attributes above.)

Type is Roboto, shipped with the bundle. It applies to `html`/`body` automatically. Note that
`<button>` elements do **not** inherit it (no IDS rule sets `font-family: inherit` on buttons) — this
matches the upstream design system exactly, so leave it alone unless you are deliberately overriding.

### The styling idiom: `var(--token)`

Real token names, all defined in `styles.css`'s import closure (616 tokens):

| Family | Use for | Examples |
|---|---|---|
| `--color-background-*` | fills | `--color-background-surface-primary`, `--color-background-surface-secondary`, `--color-background-brand-base`, `--color-background-brand-strong` |
| `--color-text-*` | text | `--color-text-gray-neutral-strong`, `--color-text-gray-neutral`, `--color-text-gray-disabled`, `--color-text-gray-inverse` |
| `--color-border-*` | borders | `--color-border-gray-neutral-base`, `--color-border-gray-neutral-light`, `--color-border-brand-strong` |
| `--color-icon-*` | icon fills | `--color-icon-brand-base`, `--color-icon-alerting-critical-base` |
| `--spacing-space-N` | gaps, margins | `--spacing-space-4`, `--spacing-space-8`, `--spacing-space-16`, `--spacing-space-24` |
| `--padding-padding-N` | padding | `--padding-padding-8`, `--padding-padding-16` |
| `--corner-radius-radius-N` | radii | `--corner-radius-radius-2`, `--corner-radius-radius-4` |
| `--font-size-*` | type scale | `--font-size-body-1/2/3`, `--font-size-header-1`…`--font-size-header-5` |
| `--border-width-border-default` | 1px rules | borders on your own containers |

Alerting colours follow `--color-{background,text,border,icon}-alerting-{critical,major,minor,info,success}-{base,light,strong}`.

### Composition, not configuration

Most IDS components are **compound**: a root plus projected children you assemble, rather than a prop
bag. `IdsButton` takes `IdsButtonLeadingIcon` / `IdsButtonLabel`; `IdsCard`, `IdsModal`, `IdsWizard`,
`IdsAppShell`, `IdsDatagrid`, `IdsGetStarted`, `IdsWhatsNew` and `IdsDualListBox` all follow the same
shape. **Read the component's `.prompt.md` before using it** — it is the component's real design spec
(anatomy, variants, every state, and the exact subcomponent names), and `<Name>.d.ts` has the typed
props.

Icons are `<IdsIcon shape="..." />` where `shape` is a slug (`settings-gear`, `status-warn-tri-solid`,
`chev-down-thick`, …). Use `variant="mask"` (default) to tint via `color`; `variant="inline"` for
two-tone glyphs.

### Where the truth lives

- `styles.css` — the one stylesheet to link; `@import`s fonts and all component CSS.
- `components/<group>/<Name>/<Name>.prompt.md` — the authoritative per-component spec.
- `components/<group>/<Name>/<Name>.d.ts` — typed props (`<Name>Props`).

### Idiomatic example

```jsx
const { IdsCard, IdsButton, IdsButtonLabel, IdsBadge } = window.IdsReact;

<div style={{
  display: 'grid',
  gap: 'var(--spacing-space-16)',
  padding: 'var(--padding-padding-16)',
  background: 'var(--color-background-surface-secondary)',
}}>
  <IdsCard title="Storage pools">
    <p style={{
      margin: 0,
      color: 'var(--color-text-gray-neutral)',
      fontSize: 'var(--font-size-body-2)',
    }}>
      4 of 6 pools healthy <IdsBadge type="warning">2 warnings</IdsBadge>
    </p>
    <IdsButton variant="primary">
      <IdsButtonLabel>View details</IdsButtonLabel>
    </IdsButton>
  </IdsCard>
</div>
```

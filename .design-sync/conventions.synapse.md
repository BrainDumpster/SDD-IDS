## How to build with Synapse

Synapse is a **token-driven CSS Modules** design system. There are no utility classes and no styling
props — each component owns its internal styling, and you style *your own* layout with the CSS custom
properties below. Never hardcode a colour, spacing value, radius, or font size.

### Setup — there is none

There is **no provider and no context wrapper**. Components are plain React; import and render them
anywhere. Light-theme tokens are bound to `:root`, so **light mode works with zero setup**.

Dark mode is the one thing you must opt into — set `data-theme="dark"` on `<html>` or `<body>`:

```jsx
document.documentElement.setAttribute('data-theme', 'dark');
```

Type is **Roboto**, shipped with the bundle and applied to `html`/`body` automatically; unlike some
systems, Synapse buttons *do* inherit it. Per-component `.prompt.md` files carry a generic note about
`.storybook/preview` decorators providing theme context — that is boilerplate and does not apply here;
the decorator only set the attribute above.

### The styling idiom: `var(--token)`

Every value comes from a CSS custom property. The families, with real names:

| Family | Pattern | Examples |
|---|---|---|
| Text colour | `--color-text-*` | `--color-text-gray-neutral-strong`, `--color-text-gray-neutral`, `--color-text-gray-disabled`, `--color-text-gray-white` |
| Background | `--color-background-*` | `--color-background-surface-1`, `--color-background-surface-2`, `--color-background-surface-component`, `--color-background-brand-base`, `--color-background-alerting-critical-strong` |
| Border | `--color-border-*` | `--color-border-neutral`, `--color-border-neutral-light` |
| Icon | `--color-icon-*` | `--color-icon-brand-base`, `--color-icon-gray-neutral-base` |
| Spacing | `--spacing-space-<n>` | `--spacing-space-4`, `--spacing-space-8`, `--spacing-space-16`, `--spacing-space-24`, `--spacing-space-none` |
| Raw scale | `--scale-<n>` | `--scale-4`, `--scale-16`, `--scale-64` (primitives; prefer `--spacing-space-*` for layout) |
| Radius | `--corner-radius-radius-<n>` | `--corner-radius-radius-4`, `--corner-radius-radius-8`, `--corner-radius-radius-16`, `--corner-radius-radius-round` |
| Font size | `--font-size-body-<1..3>`, `--font-size-header-<1..6>` | `--font-size-body-2` (default body), `--font-size-header-3` |
| Line height | `--font-line-height-line-height-<n>` | `--font-line-height-line-height-20`, `--font-line-height-line-height-32` |
| Font family / weight | `--typography-font-style-primary`, `--typography-font-weight-{regular,medium}` | |

Severity colours follow `--color-{background,text,icon,border}-alerting-{critical,major,minor,info,success}-{base,light,slate,strong,stronger}`.
Brand colours follow the same shape with `-brand-`.

Two conventions worth knowing because they are easy to get wrong:

- **`--spacing-space-*` for layout, `--scale-*` only as a primitive.** Both are lengths; the spacing
  scale is the designed one.
- **Component-level aliases exist for control geometry** (`--button-control-radius`,
  `--card-control-radius`, `--modal-control-radius`, `--text-box-control-radius`, …). Components
  consume these themselves — you rarely set them, but overriding one on a container is the supported
  way to restyle a control's radius.

### Where the truth lives

Read these before styling — they are the authority, and they ship with this design system:

- `_ds/<folder>/styles.css` and its `@import` closure (`fonts/fonts.css`, `_ds_bundle.css`) — every
  token definition and every component's compiled CSS. Grep it for a token name to see real usage.
- `components/<group>/<Name>/<Name>.prompt.md` — per-component usage docs, generated from that
  component's Figma-aligned `design-spec.md` (anatomy, states, tokens, interactions).
- `components/<group>/<Name>/<Name>.d.ts` — the `<Name>Props` contract to code against.

Components are grouped as `components/synapse/*` and `components/dropdown/*` (the three dropdown
variants). All exports are on `window.SynapseReact`.

### One idiomatic example

A library component for the control; tokens for your own layout glue.

```jsx
import { SynapseCard, SynapseButton, SynapseBadge } from '@synapse/react';

function ServiceTile({ name, status }) {
  return (
    <SynapseCard title={name}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-space-8)',
        padding: 'var(--spacing-space-16)',
        background: 'var(--color-background-surface-2)',
        border: '1px solid var(--color-border-neutral-light)',
        borderRadius: 'var(--corner-radius-radius-8)',
        fontSize: 'var(--font-size-body-2)',
        color: 'var(--color-text-gray-neutral-strong)',
      }}>
        <SynapseBadge type={status === 'ok' ? 'success' : 'critical'}>{status}</SynapseBadge>
        <span>Last checked 2 minutes ago</span>
        <SynapseButton variant="tertiary">View details</SynapseButton>
      </div>
    </SynapseCard>
  );
}
```

Compound components (App Launcher, Left Nav, Datagrid, Wizard, What's New) expose their parts as
named exports alongside the root — e.g. `SynapseAppLauncher` with `SynapseAppLauncherTrigger`,
`SynapseAppLauncherSurface`, `SynapseAppLauncherProductRegion`. Check the component's `.prompt.md`
for the expected nesting before composing one.

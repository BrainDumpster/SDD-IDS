/**
 * Developer usage + Docs tab copy for IDS Lit App Launcher.
 * Spec: components/ids/app-launcher/design-spec.md
 * API: lib/react/ids/app-launcher · lib/lit/ids/src/app-launcher
 */

export const APP_LAUNCHER_DOCS_DESCRIPTION = `
## Overview

Lit \`ids-app-launcher\` — popover app switcher (product tiles + optional options
list) from \`components/ids/app-launcher/design-spec.md\`. Prop API aligned with
\`@ids/react/app-launcher\` (\`products\`, \`options\`, \`footerAction\`,
\`triggerVariant\`, \`panelOnly\`, …).

\`\`\`
ids-app-launcher
  Trigger → Surface (body portal)
    ProductRegion → ProductRowGroup[] → ProductTile[]
    OptionsRegion? → OptionRow[] → FooterAction?
\`\`\`

Standalone tile for state matrix: \`ids-app-launcher-product-tile\`.

## Props

| Prop | Type | Default |
|------|------|---------|
| \`programme\` | \`ids \\| synapse\` | \`ids\` |
| \`products\` | \`IdsAppLauncherProduct[]\` | \`[]\` |
| \`apps\` | deprecated alias of \`products\` | — |
| \`options\` | \`IdsAppLauncherOption[]\` | \`[]\` |
| \`footerAction\` | \`{ label }\` | \`null\` |
| \`columns\` | \`number\` | \`2\` |
| \`triggerVariant\` | \`default \\| masthead\` | \`default\` |
| \`sideOffset\` | \`number\` | \`8\` / \`1\` (masthead) |
| \`open\` | \`boolean\` (controlled) | — |
| \`defaultOpen\` | \`boolean\` | \`false\` |
| \`panelOnly\` | \`boolean\` | \`false\` |
| \`useIdsOptionTooltip\` | \`boolean\` | \`false\` |
| \`ariaLabel\` | \`string\` | \`App launcher\` |

### Product model

| Field | Notes |
|-------|-------|
| \`name\` | required |
| \`id?\` | stable key |
| \`icon: null\` | no-icon tile |
| \`shape?\` / \`iconSlug?\` | per-item icon (\`assets/icons/<slug>.svg\`); default \`shield-encrypt-alt\` |
| \`href?\` | renders \`<a>\` |

### Option model

| Field | Notes |
|-------|-------|
| \`label\` | required |
| \`id?\` | stable key |

\`\`\`ts
.products=\${[
  { id: "p1", name: "Protect", shape: "shield-encrypt-alt" },
  { id: "p2", name: "Apps", shape: "app-window" },
]}
.options=\${[
  { id: "o1", label: "Directory" },
]}
\`\`\`

## Events

| Event | Detail |
|-------|--------|
| \`ids-open-change\` | \`{ open: boolean }\` |
| \`ids-product-select\` | \`{ id, name }\` |
| \`ids-option-select\` | \`{ id, label }\` |
| \`ids-footer-action\` | \`{ label }\` |

## Theme

\`\`\`ts
import "@ids/core/ids-theme.css";
import { applyIdsTheme } from "@ids/core/theme";
applyIdsTheme({ theme: "light" });
\`\`\`

## Import

\`\`\`ts
import "@ids/core/app-launcher/register.js";
\`\`\`
`.trim();

export const APP_LAUNCHER_SOURCE_CODE = `<ids-app-launcher
  triggervariant="masthead"
  .products=\${[
    { id: "p1", name: "Protect", shape: "shield-encrypt-alt" },
    { id: "p2", name: "Apps", shape: "app-window" },
    { id: "p3", name: "VMs", shape: "app-group-vm" },
    { id: "p4", name: "Cloud", shape: "appic-dp-cloud-blue" },
  ]}
  .options=\${[
    { id: "o1", label: "Directory" },
    { id: "o2", label: "Option" },
  ]}
></ids-app-launcher>`;

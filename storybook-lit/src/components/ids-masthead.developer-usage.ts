/** Developer usage + Docs tab copy for IDS Lit Masthead. */

export const MASTHEAD_DOCS_DESCRIPTION = `
## Overview

Lit \`ids-masthead\` — application header from \`components/ids/masthead/design-spec.md\`.

API aligned with React \`@ids/react/masthead\` (\`productName\` + optional host slots).
Only \`productName\` is required. \`logo\`, \`icons\`, \`app-launcher\`, and \`avatar\`
slots are optional host composition — omit any unused slot.

\`\`\`
ids-masthead
  slot=logo?
  productName (required)
  slot=icons?
  slot=app-launcher?
  slot=avatar?
\`\`\`

Host primitives:

\`\`\`
ids-masthead-action-button-container
  ids-masthead-action-icon-button[]
ids-masthead-avatar
\`\`\`

## Props

| Prop | Attribute / binding | Type | Default |
|------|---------------------|------|---------|
| \`productName\` | \`productname\` | \`string\` | — |
| \`actionsAriaLabel\` | \`actionsarialabel\` | \`string\` | \`Masthead actions\` |

### \`ids-masthead-action-icon-button\`

| Prop | Attribute | Type | Default |
|------|-----------|------|---------|
| \`ariaLabel\` | \`arialabel\` / \`aria-label\` | \`string\` | — (required) |
| \`badgeCount\` | \`badgecount\` | \`number\` | — |
| \`badgeType\` | \`badgetype\` | badge type | \`critical\` |
| \`iconSlug\` | \`iconslug\` | \`string\` | — |
| \`expanded\` | \`ariaexpanded\` | \`boolean\` | \`false\` |
| default slot | — | icon markup | — |

### \`ids-masthead-avatar\`

| Prop | Attribute | Type | Default |
|------|-----------|------|---------|
| \`initials\` | \`initials\` | \`string\` | — |
| \`iconSlug\` | \`iconslug\` | \`string\` | — |
| \`imageSrc\` | \`imagesrc\` | \`string\` | — |
| \`imageAlt\` | \`imagealt\` | \`string\` | \`User avatar\` |
| \`ariaLabel\` | \`arialabel\` | \`string\` | — |
| \`expanded\` | \`ariaexpanded\` | \`boolean\` | \`false\` |
| \`slot="icon"\` | — | custom icon | — |

## Theme

\`\`\`ts
import "@ids/core/ids-theme.css";
import { applyIdsTheme } from "@ids/core/theme";
applyIdsTheme({ theme: "light" });
\`\`\`

## Figma

- Masthead-Main \`10130:29493\` (file \`0bHk3XhrjFhowgFkz9yLr4\`)
- Product Icon=No \`10130:29494\` · Yes \`10130:29512\`
`.trim();

export const MASTHEAD_SOURCE_CODE = `import "@ids/core/masthead/register.js";
import "@ids/core/icon/register.js";
import "@ids/core/app-launcher/register.js";

<ids-masthead productname="Product Name">
  <ids-icon
    slot="logo"
    shape="appic-dp-cloud-blue"
    variant="img"
    size="32"
    title="Product logo"
  ></ids-icon>

  <ids-masthead-action-button-container slot="icons">
    <ids-masthead-action-icon-button
      arialabel="Search"
      iconslug="search-16"
    ></ids-masthead-action-icon-button>
    <ids-masthead-action-icon-button
      arialabel="Alerts, 3 unread"
      iconslug="alert-bell-16"
      badgecount="3"
      badgetype="critical"
    ></ids-masthead-action-icon-button>
  </ids-masthead-action-button-container>

  <ids-app-launcher
    slot="app-launcher"
    triggervariant="masthead"
    .products=\${[{ id: "p1", name: "Product Name 1" }]}
  ></ids-app-launcher>

  <ids-masthead-avatar
    slot="avatar"
    initials="DT"
    arialabel="User settings"
  ></ids-masthead-avatar>
</ids-masthead>`;

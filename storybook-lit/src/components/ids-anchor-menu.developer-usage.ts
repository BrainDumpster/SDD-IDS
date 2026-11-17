/** Developer usage + Docs tab copy for IDS Lit Anchor Menu. */

export const ANCHOR_MENU_DOCS_DESCRIPTION = `
## Overview

Lit \`ids-anchor-menu\` — in-page section navigation from
\`components/ids/anchor-menu/design-spec.md\`.

API aligned with React \`lib/react/ids/anchor-menu\` (\`IdsAnchorMenu\`).
Uses Lit \`ids-tooltip\` for truncated label/header overflow (unless
\`nativeTooltip\` is true).

Live Figma (file \`VZJ48bbVYrIynw8DdSukWw\`): Element \`11955:229729\`,
Example \`11955:229709\`.

## Props

| Prop | Attribute | Type | Default |
|------|-----------|------|---------|
| \`items\` | — (property) | \`{ label: string; href: string; active?: boolean }[]\` | \`[]\` |
| \`title\` | \`title\` | \`string\` | \`"On this page"\` |
| \`header\` | — (property) | \`boolean\` | \`true\` |
| \`sticky\` | \`sticky\` | \`boolean\` | \`true\` |
| \`scrollOffset\` | \`scrolloffset\` | \`number\` | \`24\` |
| \`nativeTooltip\` | \`nativetooltip\` | \`boolean\` | \`false\` |

## Events

| Event | Detail |
|-------|--------|
| \`ids-item-click\` | \`{ href: string }\` |

## Theme

\`\`\`ts
import "@ids/core/ids-theme.css";
import { applyIdsTheme } from "@ids/core/theme";
applyIdsTheme({ theme: "light" });
\`\`\`
`.trim();

export const ANCHOR_MENU_SOURCE_CODE = `<ids-anchor-menu
  title="On this page"
  .header=\${false}
  .sticky=\${true}
  .items=\${[
    { label: "Overview", href: "#overview", active: true },
    { label: "Types", href: "#types" },
    { label: "Anatomy", href: "#anatomy" },
    { label: "Usage Rules", href: "#usage-rules" },
    { label: "States and Colors", href: "#states-and-colors" },
    { label: "Redlines", href: "#redlines" },
  ]}
></ids-anchor-menu>`;

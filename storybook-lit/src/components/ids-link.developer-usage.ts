/**
 * Developer usage for IDS Lit Link (design-spec + React API parity).
 */
export const LINK_DOCS_DESCRIPTION = `
## Overview

Lit \`ids-link\` — text link control from \`components/ids/link/design-spec.md\`.
API aligned with \`@ids/react/link\` (\`label\`, \`type\`, \`href\`,
\`showExternalLinkIcon\`, \`target\`, \`rel\`, \`disabled\`, \`dataState\`).

Renders native \`<a>\` when \`href\` is set; otherwise button semantics.

## Props

| Prop | Attribute | Type | Default |
|------|-----------|------|---------|
| \`label\` | \`label\` | \`string\` | required (empty → \`"Link"\`) |
| \`type\` | \`type\` | \`standalone \\| inline \\| dark-bg\` | \`standalone\` |
| \`href\` | \`href\` | \`string\` | — |
| \`showExternalLinkIcon\` | \`show-external-link-icon\` | \`boolean\` | \`false\` |
| \`target\` | \`target\` | \`_self \\| _blank \\| _parent \\| _top\` | \`_self\` |
| \`rel\` | \`rel\` | \`string\` | \`noopener noreferrer\` when \`target="_blank"\` |
| \`disabled\` | \`disabled\` | \`boolean\` | \`false\` |
| \`dataState\` | \`data-state\` | \`default \\| hover \\| press \\| focus-visible\` | — (demo only) |

Unknown \`type\` falls back to \`standalone\`. External icon uses
\`ids-icon\` shape \`pop-up-square-corner-big\` at 16px.

## Events

| Event | Detail |
|-------|--------|
| \`ids-link-click\` | \`{ originalEvent: MouseEvent }\` |

## Theme

\`\`\`ts
import "@ids/core/ids-theme.css";
import { applyIdsTheme } from "@ids/core/theme";
applyIdsTheme({ theme: "light" });
\`\`\`
`.trim();

export const LINK_SOURCE_CODE = `<ids-link
  label="This is a link"
  type="standalone"
  href="#"
></ids-link>`;

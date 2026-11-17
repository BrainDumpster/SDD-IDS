/**
 * Developer usage for IDS Lit Badge (design-spec + React API parity).
 */
export const BADGE_DOCS_DESCRIPTION = `
## Overview

Lit \`ids-badge\` — compact numeric / status indicator from
\`components/ids/badge/design-spec.md\`. API aligned with
\`@ids/react/badge\` (\`value\`, \`type\`, \`as\`, \`ariaLabel\`).

## Props

| Prop | Type | Default |
|------|------|---------|
| \`value\` | \`string \\| number\` | required (empty → hidden) |
| \`type\` | \`default \\| critical \\| warning \\| disabled \\| success\` | \`default\` |
| \`as\` | container tag name | \`span\` |
| \`ariaLabel\` | \`string\` | — |

Unknown \`type\` falls back to \`default\`. Numeric values \`> 999\` display as
\`1K\`; hover/focus reveals the full value via \`ids-tooltip\` (\`hugContent\`,
\`side="top"\`) — React \`IdsTooltip\` parity.

## Theme

\`\`\`ts
import "@ids/core/ids-theme.css";
import { applyIdsTheme } from "@ids/core/theme";
applyIdsTheme({ theme: "light" });
\`\`\`

Host showcase may override warning border:

\`\`\`css
--ids-badge-warning-border-color: var(--color-border-alerting-minor-base);
\`\`\`
`.trim();

export const BADGE_SOURCE_CODE = `<ids-badge value="8" type="default"></ids-badge>`;

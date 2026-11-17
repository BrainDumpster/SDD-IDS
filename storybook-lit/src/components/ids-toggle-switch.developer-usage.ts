/**
 * Developer usage for IDS Lit Toggle Switch (design-spec + React API parity).
 */
export const TOGGLE_SWITCH_DOCS_DESCRIPTION = `
## Overview

Lit \`ids-toggle-switch\` — binary on/off control from
\`components/ids/toggle-switch/design-spec.md\`. API aligned with
\`@ids/react/toggle-switch\` (\`checked\`, \`defaultChecked\`, \`disabled\`,
\`showStatus\`, \`label\`, \`ariaLabel\`, \`checked-change\`).

## Props

| Prop | Type | Default |
|------|------|---------|
| \`checked\` | \`boolean\` | — (controlled when set) |
| \`defaultChecked\` | \`boolean\` | \`false\` |
| \`disabled\` | \`boolean\` | \`false\` |
| \`showStatus\` | \`boolean\` | \`true\` (attr \`showstatus="false"\` to hide) |
| \`label\` | \`string\` | — (left form label) |
| \`labelRequired\` | \`boolean\` | \`false\` |
| \`labelShowInfoIcon\` | \`boolean\` | \`false\` |
| \`labelInfoLabel\` | \`string\` | — |
| \`id\` / \`name\` / \`value\` | \`string\` | — |
| \`ariaLabel\` | \`string\` | required accessible name |
| \`ariaDescribedBy\` | \`string\` | — |

## Events

| Event | Detail |
|-------|--------|
| \`checked-change\` | \`boolean\` |

## Theme

\`\`\`ts
import "@ids/core/ids-theme.css";
import { applyIdsTheme } from "@ids/core/theme";
applyIdsTheme({ theme: "light" });
\`\`\`
`.trim();

export const TOGGLE_SWITCH_SOURCE_CODE = `<ids-toggle-switch
  arialabel="Enable alerts"
  label="Enable alerts"
  showstatus="true"
></ids-toggle-switch>`;

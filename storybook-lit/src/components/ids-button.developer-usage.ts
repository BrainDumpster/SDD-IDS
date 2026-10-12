/**
 * Developer usage for IDS Lit Button (edf-core API + design-spec visuals).
 */
export const BUTTON_DOCS_DESCRIPTION = `
## Overview

Lit \`ids-button\` — tag/props aligned with **edf-core**, visuals from
\`components/ids/button/design-spec.md\`.

## edf-core props

| Prop | Type | Default |
|------|------|---------|
| \`kind\` | \`primary \\| secondary \\| tertiary \\| danger\` | \`primary\` |
| \`size\` | \`small \\| medium \\| large\` | \`large\` |
| \`type\` | \`button \\| submit \\| reset\` | \`button\` |
| \`disabled\` | \`boolean\` | \`false\` |
| \`fluid\` | \`boolean\` | \`false\` |
| \`name\` / \`value\` | \`string\` | — |
| default slot | label text | — |

\`kind="danger"\` maps to design-spec **destructive**.

## Design-spec props

| Prop | Type | Notes |
|------|------|-------|
| \`variant\` | alias of \`kind\` | \`destructive\` accepted |
| \`label\` | \`string\` | when not using slot |
| \`iconSlug\` / \`lineicon\` | icon slug | via \`ids-icon\` |
| \`iconOnly\` | \`boolean\` | |
| \`loading\` | \`boolean\` | |
| \`ariaLabel\` | \`string\` | |
| \`data-state\` | demo override | |

## Theme

\`\`\`ts
import "@ids/lit/ids-theme.css";
import { applyIdsTheme } from "@ids/lit/theme";
applyIdsTheme({ theme: "light" });
\`\`\`
`.trim();

export const BUTTON_SOURCE_CODE = `<ids-button kind="primary">Button</ids-button>`;

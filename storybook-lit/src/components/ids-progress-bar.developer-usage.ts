/**
 * Developer usage for IDS Lit Progress Bar (edf-core API + design-spec visuals).
 */
export const PROGRESS_BAR_DOCS_DESCRIPTION = `
## Overview

Lit \`ids-progress-bar\` — tag/props aligned with **edf-core**, visuals from
\`components/ids/progress-bar/design-spec.md\`.

## Design-spec props

| Prop | Type | Default |
|------|------|---------|
| \`value\` | \`number\` | \`0\` |
| \`label\` | \`string\` | — |
| \`type\` | \`inline \\| with-label \\| indeterminate\` | \`inline\` |
| \`thickness\` | \`thin \\| medium \\| thick\` | \`medium\` |
| \`state\` | \`in-progress \\| completed-success \\| completed-warning \\| failed-error\` | \`in-progress\` |
| \`helperText\` | \`string\` | — |
| \`showHelperText\` | \`boolean\` | \`false\` |

## edf-core aliases

| Prop | Maps to |
|------|---------|
| \`progressLabel\` | \`label\` |
| \`loop\` | indeterminate layout |
| \`size\` (\`sm\\|/md\\|/lg\`) | \`thickness\` thin/medium/thick |
| \`type\` success/warning/danger/info/neutral | \`state\` when not a layout type |
| \`displayValue\` / \`displayValuePosition\` | percentage text / layout hint |
| \`message\` / \`shape\` | helper row + icon |
| \`disabled\` | non-interactive |

## Theme

\`\`\`ts
import "@ids/lit/ids-theme.css";
import { applyIdsTheme } from "@ids/lit/theme";
applyIdsTheme({ theme: "light" });
\`\`\`
`.trim();

export const PROGRESS_BAR_SOURCE_CODE = `<ids-progress-bar
  value="30"
  label="Label"
  type="with-label"
  thickness="thin"
  state="in-progress"
  showHelperText
  helperText="Helper text (time estimate)"
></ids-progress-bar>`;

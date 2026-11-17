/**
 * Developer usage for IDS Lit Progress Bar (design-spec + React API parity).
 */
export const PROGRESS_BAR_DOCS_DESCRIPTION = `
## Overview

Lit \`ids-progress-bar\` from \`components/ids/progress-bar/design-spec.md\`.
API aligned with \`@ids/react/progress-bar\`.

Import: \`@ids/core/progress-bar/register\`.

## Props

| Prop | Type | Default |
|------|------|---------|
| \`value\` | \`number\` | \`0\` |
| \`label\` | \`string\` | — |
| \`helperText\` | \`string\` | — |
| \`showHelperText\` | \`boolean\` | \`false\` |
| \`type\` | \`inline \\| with-label \\| indeterminate\` | \`inline\` |
| \`thickness\` | \`thin \\| medium \\| thick\` | \`medium\` |
| \`state\` | \`in-progress \\| completed-success \\| completed-warning \\| failed-error\` | \`in-progress\` |

Unknown \`type\` / \`thickness\` / \`state\` fall back to the defaults above.
Helper row renders only when \`showHelperText\` and \`helperText\` are both set.
Status icons use \`ids-icon\` \`variant="img"\` (no icon for \`in-progress\`).

## Theme

\`\`\`ts
import "@ids/core/ids-theme.css";
import { applyIdsTheme } from "@ids/core/theme";
applyIdsTheme({ theme: "light" });
\`\`\`
`.trim();

export const PROGRESS_BAR_SOURCE_CODE = `<ids-progress-bar
  value="30"
  label="Label"
  type="with-label"
  thickness="medium"
  state="in-progress"
  showhelpertext
  helpertext="Helper text (time estimate)"
></ids-progress-bar>`;

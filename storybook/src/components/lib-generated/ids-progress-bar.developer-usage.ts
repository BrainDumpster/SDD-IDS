/** Developer usage + Docs tab copy for IDS ProgressBar (React). */

export const PROGRESS_BAR_DOCS_DESCRIPTION = `
## Overview

Determinate or indeterminate progress indicator with optional label.

Import from \`@ids/react/progress-bar\`.

## Props

### \`IdsProgressBarProps\`

| Prop | Type | Default |
|------|------|---------|
| \`value\` | \`number\` | — |
| \`label\` | \`string\` | — |
| \`helperText\` | \`string\` | — |
| \`showHelperText\` | \`boolean\` | — |
| \`type\` | \`IdsProgressBarType \\| string\` | — |
| \`thickness\` | \`IdsProgressBarThickness \\| string\` | — |
| \`state\` | \`IdsProgressBarState \\| string\` | — |
| \`className\` | \`string\` | — |

## Events

No dedicated callback props beyond standard DOM handlers on native elements.

## API

### Import

\`\`\`tsx
import { IdsProgressBar } from "@ids/react/progress-bar";
\`\`\`

### Usage

\`\`\`tsx
<IdsProgressBar>
  {/* project children / slots per anatomy */}
</IdsProgressBar>
\`\`\`
`.trim();

export const PROGRESS_BAR_SOURCE_CODE = `import { IdsProgressBar } from "@ids/react/progress-bar";

export function Example() {
  return (
    <IdsProgressBar>
      {/* project children / slots */}
    </IdsProgressBar>
  );
}`;

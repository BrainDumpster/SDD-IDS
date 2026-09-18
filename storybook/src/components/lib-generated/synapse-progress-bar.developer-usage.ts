/** Developer usage + Docs tab copy for IDS ProgressBar (React). */

export const SYNAPSE_PROGRESS_BAR_DOCS_DESCRIPTION = `
## Overview

Synapse Progress Bar is an IDS-fork façade over \`lib/react/ids/progress-bar\` (\`reexport\` strategy).
Load \`components/synapse-theme.css\` only — do not load \`ids-theme.css\`.

Import from \`@synapse/react/progress-bar\`.

Determinate or indeterminate progress indicator with optional label.

Import from \`@synapse/react/progress-bar\`.

## Props

### \`SynapseProgressBarProps\`

| Prop | Type | Default |
|------|------|---------|
| \`value\` | \`number\` | — |
| \`label\` | \`string\` | — |
| \`helperText\` | \`string\` | — |
| \`showHelperText\` | \`boolean\` | — |
| \`type\` | \`SynapseProgressBarType \\| string\` | — |
| \`thickness\` | \`SynapseProgressBarThickness \\| string\` | — |
| \`state\` | \`SynapseProgressBarState \\| string\` | — |
| \`className\` | \`string\` | — |

## Events

No dedicated callback props beyond standard DOM handlers on native elements.

## API

### Import

\`\`\`tsx
import { SynapseProgressBar } from "@synapse/react/progress-bar";
\`\`\`

### Usage

\`\`\`tsx
<SynapseProgressBar>
  {/* project children / slots per anatomy */}
</SynapseProgressBar>
\`\`\`
`.trim();

export const SYNAPSE_PROGRESS_BAR_SOURCE_CODE = `import { SynapseProgressBar } from "@synapse/react/progress-bar";

export function Example() {
  return (
    <SynapseProgressBar>
      {/* project children / slots */}
    </SynapseProgressBar>
  );
}`;

/** Developer usage + Docs tab copy for IDS SegmentedButton (React). */

export const SYNAPSE_SEGMENTED_BUTTON_DOCS_DESCRIPTION = `
## Overview

Synapse Segmented Button is an IDS-fork façade over \`lib/react/ids/segmented-button\` (\`reexport\` strategy).
Load \`components/synapse-theme.css\` only — do not load \`ids-theme.css\`.

Import from \`@synapse/react/segmented-button\`.

Grouped toggle buttons for mutually exclusive options (text or icon).

\`\`\`
SynapseSegmentedButton
  SynapseSegmentedText
  SynapseSegmentedIcon
\`\`\`

Import from \`@synapse/react/segmented-button\`.

## Props

### \`SynapseSegmentedTextProps\`

| Prop | Type | Default |
|------|------|---------|
| \`value\` | \`string\` | required |
| \`label\` | \`string\` | required |
| \`selected\` | \`boolean\` | — |
| \`title\` | \`string\` | — |
| \`ariaLabel\` | \`string\` | — |
| \`simulatedState\` | \`SynapseSegmentedSimulatedState\` | — |

### \`SynapseSegmentedIconProps\`

| Prop | Type | Default |
|------|------|---------|
| \`value\` | \`string\` | required |
| \`shape\` | \`string\` | — |
| \`icon\` | \`SynapseSegmentedIconSource\` | — |
| \`selected\` | \`boolean\` | — |
| \`title\` | \`string\` | — |
| \`ariaLabel\` | \`string\` | required |
| \`simulatedState\` | \`SynapseSegmentedSimulatedState\` | — |

### \`SynapseSegmentedButtonProps\`

| Prop | Type | Default |
|------|------|---------|
| \`type\` | \`"text" \\| "icon"\` | required |
| \`children\` | \`ReactNode\` | required |
| \`value\` | \`string\` | — |
| \`defaultValue\` | \`string\` | — |
| \`ariaLabel\` | \`string\` | — |
| \`ariaLabelledby\` | \`string\` | — |
| \`iconsBasePath\` | \`string\` | — |
| \`className\` | \`string\` | — |

## Events

| Callback | On | Signature |
|----------|----|-----------|
| \`onSelected\` | \`SynapseSegmentedButtonProps\` | \`(value: string, meta: SynapseSegmentedButtonChangeMeta) => void\` |
| \`onChange\` | \`SynapseSegmentedButtonProps\` | \`(value: string, meta: SynapseSegmentedButtonChangeMeta) => void\` |

## API

### Import

\`\`\`tsx
import {
  SynapseSegmentedButton,
  SynapseSegmentedText,
  SynapseSegmentedIcon,
} from "@synapse/react/segmented-button";
\`\`\`

### Usage

\`\`\`tsx
<SynapseSegmentedButton>
  {/* project children / slots per anatomy */}
</SynapseSegmentedButton>
\`\`\`
`.trim();

export const SYNAPSE_SEGMENTED_BUTTON_SOURCE_CODE = `import {
  SynapseSegmentedButton,
  SynapseSegmentedText,
  SynapseSegmentedIcon,
} from "@synapse/react/segmented-button";

export function Example() {
  return (
    <SynapseSegmentedButton>
      {/* project children / slots */}
    </SynapseSegmentedButton>
  );
}`;

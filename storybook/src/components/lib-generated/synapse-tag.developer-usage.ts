/** Developer usage + Docs tab copy for IDS Tag (React). */

export const SYNAPSE_TAG_DOCS_DESCRIPTION = `
## Overview

Synapse Tag is an IDS-fork façade over \`lib/react/ids/tag\` (\`reexport\` strategy).
Load \`components/synapse-theme.css\` only — do not load \`ids-theme.css\`.

Import from \`@synapse/react/tag\`.

Compact label chip for categories, filters, or metadata.

Import from \`@synapse/react/tag\`.

## Props

### \`SynapseTagProps\`

| Prop | Type | Default |
|------|------|---------|
| \`type\` | \`SynapseTagType \\| string\` | — |
| \`size\` | \`SynapseTagSize \\| string\` | — |
| \`tone\` | \`SynapseTagTone \\| string\` | — |
| \`selected\` | \`boolean\` | — |
| \`disabled\` | \`boolean\` | — |
| \`error\` | \`boolean\` | — |
| \`focusVisible\` | \`boolean\` | — |
| \`focusOnText\` | \`boolean\` | — |
| \`label\` | \`string\` | required |
| \`badgeValue\` | \`string \\| number\` | — |
| \`leadingIconSlug\` | \`string \\| null\` | — |
| \`closeIconSlug\` | \`string\` | — |

## Events

| Callback | On | Signature |
|----------|----|-----------|
| \`onClick\` | \`SynapseTagProps\` | \`() => void\` |
| \`onDismiss\` | \`SynapseTagProps\` | \`() => void\` |
| \`onSelectionChange\` | \`SynapseTagProps\` | \`(selected: boolean) => void\` |

## API

### Import

\`\`\`tsx
import { SynapseTag } from "@synapse/react/tag";
\`\`\`

### Usage

\`\`\`tsx
<SynapseTag>
  {/* project children / slots per anatomy */}
</SynapseTag>
\`\`\`
`.trim();

export const SYNAPSE_TAG_SOURCE_CODE = `import { SynapseTag } from "@synapse/react/tag";

export function Example() {
  return (
    <SynapseTag>
      {/* project children / slots */}
    </SynapseTag>
  );
}`;

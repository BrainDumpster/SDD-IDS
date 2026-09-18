/** Developer usage + Docs tab copy for IDS Badge (React). */

export const SYNAPSE_BADGE_DOCS_DESCRIPTION = `
## Overview

Synapse Badge is an IDS-fork façade over \`lib/react/ids/badge\` (\`reexport\` strategy).
Load \`components/synapse-theme.css\` only — do not load \`ids-theme.css\`.

Import from \`@synapse/react/badge\`.

Compact numeric or status indicator for counts and severity cues.

Import from \`@synapse/react/badge\`.

## Props

### \`SynapseBadgeProps\`

| Prop | Type | Default |
|------|------|---------|
| \`value\` | \`string \\| number\` | required |
| \`type\` | \`SynapseBadgeType \\| string\` | — |
| \`as\` | \`ElementType\` | — |
| \`ariaLabel\` | \`string\` | — |

## Events

No dedicated callback props beyond standard DOM handlers on native elements.

## API

### Import

\`\`\`tsx
import { SynapseBadge } from "@synapse/react/badge";
\`\`\`

### Usage

\`\`\`tsx
<SynapseBadge>
  {/* project children / slots per anatomy */}
</SynapseBadge>
\`\`\`
`.trim();

export const SYNAPSE_BADGE_SOURCE_CODE = `import { SynapseBadge } from "@synapse/react/badge";

export function Example() {
  return (
    <SynapseBadge>
      {/* project children / slots */}
    </SynapseBadge>
  );
}`;

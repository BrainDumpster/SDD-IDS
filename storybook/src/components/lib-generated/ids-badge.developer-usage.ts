/** Developer usage + Docs tab copy for IDS Badge (React). */

export const BADGE_DOCS_DESCRIPTION = `
## Overview

Compact numeric or status indicator for counts and severity cues.

Import from \`@ids/react/badge\`.

## Props

### \`IdsBadgeProps\`

| Prop | Type | Default |
|------|------|---------|
| \`value\` | \`string \\| number\` | required |
| \`type\` | \`IdsBadgeType \\| string\` | — |
| \`as\` | \`ElementType\` | — |
| \`ariaLabel\` | \`string\` | — |

## Events

No dedicated callback props beyond standard DOM handlers on native elements.

## API

### Import

\`\`\`tsx
import { IdsBadge } from "@ids/react/badge";
\`\`\`

### Usage

\`\`\`tsx
<IdsBadge>
  {/* project children / slots per anatomy */}
</IdsBadge>
\`\`\`
`.trim();

export const BADGE_SOURCE_CODE = `import { IdsBadge } from "@ids/react/badge";

export function Example() {
  return (
    <IdsBadge>
      {/* project children / slots */}
    </IdsBadge>
  );
}`;

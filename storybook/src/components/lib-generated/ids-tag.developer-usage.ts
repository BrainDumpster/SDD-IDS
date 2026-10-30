/** Developer usage + Docs tab copy for IDS Tag (React). */

export const TAG_DOCS_DESCRIPTION = `
## Overview

Compact label chip for categories, filters, or metadata.

Import from \`@ids/react/tag\`.

## Props

### \`IdsTagProps\`

| Prop | Type | Default |
|------|------|---------|
| \`type\` | \`IdsTagType \\| string\` | — |
| \`size\` | \`IdsTagSize \\| string\` | — |
| \`tone\` | \`IdsTagTone \\| string\` | — |
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
| \`onClick\` | \`IdsTagProps\` | \`() => void\` |
| \`onDismiss\` | \`IdsTagProps\` | \`() => void\` |
| \`onSelectionChange\` | \`IdsTagProps\` | \`(selected: boolean) => void\` |

## API

### Import

\`\`\`tsx
import { IdsTag } from "@ids/react/tag";
\`\`\`

### Usage

\`\`\`tsx
<IdsTag>
  {/* project children / slots per anatomy */}
</IdsTag>
\`\`\`
`.trim();

export const TAG_SOURCE_CODE = `import { IdsTag } from "@ids/react/tag";

export function Example() {
  return (
    <IdsTag>
      {/* project children / slots */}
    </IdsTag>
  );
}`;

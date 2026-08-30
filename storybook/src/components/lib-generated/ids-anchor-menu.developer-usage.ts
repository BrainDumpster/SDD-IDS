/** Developer usage + Docs tab copy for IDS AnchorMenu (React). */

export const ANCHOR_MENU_DOCS_DESCRIPTION = `
## Overview

In-page navigation list that highlights the active section as the user scrolls.

Import from \`@ids/react/anchor-menu\`.

## Props

### \`IdsAnchorMenuProps\`

| Prop | Type | Default |
|------|------|---------|
| \`items\` | \`IdsAnchorMenuItem[]\` | required |
| \`title\` | \`string\` | — |
| \`header\` | \`boolean\` | — |
| \`sticky\` | \`boolean\` | — |

## Events

| Callback | On | Signature |
|----------|----|-----------|
| \`onItemClick\` | \`IdsAnchorMenuProps\` | \`(href: string) => void\` |

## API

### Import

\`\`\`tsx
import { IdsAnchorMenu } from "@ids/react/anchor-menu";
\`\`\`

### Usage

\`\`\`tsx
<IdsAnchorMenu>
  {/* project children / slots per anatomy */}
</IdsAnchorMenu>
\`\`\`
`.trim();

export const ANCHOR_MENU_SOURCE_CODE = `import { IdsAnchorMenu } from "@ids/react/anchor-menu";

export function Example() {
  return (
    <IdsAnchorMenu>
      {/* project children / slots */}
    </IdsAnchorMenu>
  );
}`;

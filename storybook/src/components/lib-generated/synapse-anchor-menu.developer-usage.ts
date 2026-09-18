/** Developer usage + Docs tab copy for IDS AnchorMenu (React). */

export const SYNAPSE_ANCHOR_MENU_DOCS_DESCRIPTION = `
## Overview

Synapse Anchor Menu is an IDS-fork façade over \`lib/react/ids/anchor-menu\` (\`reexport\` strategy).
Load \`components/synapse-theme.css\` only — do not load \`ids-theme.css\`.

Import from \`@synapse/react/anchor-menu\`.

In-page navigation list that highlights the active section as the user scrolls.

Import from \`@synapse/react/anchor-menu\`.

## Props

### \`SynapseAnchorMenuProps\`

| Prop | Type | Default |
|------|------|---------|
| \`items\` | \`SynapseAnchorMenuItem[]\` | required |
| \`title\` | \`string\` | — |
| \`header\` | \`boolean\` | — |
| \`sticky\` | \`boolean\` | — |

## Events

| Callback | On | Signature |
|----------|----|-----------|
| \`onItemClick\` | \`SynapseAnchorMenuProps\` | \`(href: string) => void\` |

## API

### Import

\`\`\`tsx
import { SynapseAnchorMenu } from "@synapse/react/anchor-menu";
\`\`\`

### Usage

\`\`\`tsx
<SynapseAnchorMenu>
  {/* project children / slots per anatomy */}
</SynapseAnchorMenu>
\`\`\`
`.trim();

export const SYNAPSE_ANCHOR_MENU_SOURCE_CODE = `import { SynapseAnchorMenu } from "@synapse/react/anchor-menu";

export function Example() {
  return (
    <SynapseAnchorMenu>
      {/* project children / slots */}
    </SynapseAnchorMenu>
  );
}`;

/** Developer usage + Docs tab copy for IDS SynapseLeftNav (React). */

export const SYNAPSE_LEFT_NAV_DOCS_DESCRIPTION = `
## Overview

Synapse Left Nav is an IDS-fork façade over \`lib/react/ids/main-menu-left\` (\`wrapper\` strategy).
Load \`components/synapse-theme.css\` only — do not load \`ids-theme.css\`.

Import from \`@synapse/react/left-nav\`.

Left navigation rail with icon items, expansion, and active states.

Import from \`@synapse/react/left-nav\`.

## Props

### \`SynapseLeftNavProps\`

| Prop | Type | Default |
|------|------|---------|
| \`logo\` | \`SynapseLeftNavLogo\` | — |
| \`expanded\` | \`boolean\` | — |
| \`items\` | \`SynapseLeftNavPrimaryItem[]\` | required |
| \`defaultSelectedItemId\` | \`string\` | — |
| \`forceStates\` | \`boolean\` | — |
| \`ariaLabel\` | \`string\` | — |
| \`className\` | \`string\` | — |

## Events

| Callback | On | Signature |
|----------|----|-----------|
| \`onExpandedChange\` | \`SynapseLeftNavProps\` | \`(expanded: boolean) => void\` |
| \`onNavigate\` | \`SynapseLeftNavProps\` | \`(target: SynapseLeftNavNavigationTarget) => void\` |
| \`onSelected\` | \`SynapseLeftNavProps\` | \`(detail: SynapseLeftNavSelectionDetail) => void\` |

## API

### Import

\`\`\`tsx
import { SynapseLeftNav } from "@synapse/react/left-nav";
\`\`\`

### Usage

\`\`\`tsx
<SynapseLeftNav>
  {/* project children / slots per anatomy */}
</SynapseLeftNav>
\`\`\`
`.trim();

export const SYNAPSE_LEFT_NAV_SOURCE_CODE = `import { SynapseLeftNav } from "@synapse/react/left-nav";

export function Example() {
  return (
    <SynapseLeftNav>
      {/* project children / slots */}
    </SynapseLeftNav>
  );
}`;

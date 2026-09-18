/** Developer usage + Docs tab copy for IDS ToggleSwitch (React). */

export const SYNAPSE_TOGGLE_SWITCH_DOCS_DESCRIPTION = `
## Overview

Synapse Toggle Switch is an IDS-fork façade over \`lib/react/ids/toggle-switch\` (\`reexport\` strategy).
Load \`components/synapse-theme.css\` only — do not load \`ids-theme.css\`.

Import from \`@synapse/react/toggle-switch\`.

Binary on/off switch control.

Import from \`@synapse/react/toggle-switch\`.

## Props

### \`SynapseToggleSwitchProps\`

| Prop | Type | Default |
|------|------|---------|
| \`checked\` | \`boolean\` | — |
| \`defaultChecked\` | \`boolean\` | — |
| \`disabled\` | \`boolean\` | — |
| \`label\` | \`string\` | — |
| \`id\` | \`string\` | — |
| \`name\` | \`string\` | — |
| \`value\` | \`string\` | — |
| \`className\` | \`string\` | — |

## Events

| Callback | On | Signature |
|----------|----|-----------|
| \`onCheckedChange\` | \`SynapseToggleSwitchProps\` | \`(checked: boolean) => void\` |

## API

### Import

\`\`\`tsx
import { SynapseToggleSwitch } from "@synapse/react/toggle-switch";
\`\`\`

### Usage

\`\`\`tsx
<SynapseToggleSwitch>
  {/* project children / slots per anatomy */}
</SynapseToggleSwitch>
\`\`\`
`.trim();

export const SYNAPSE_TOGGLE_SWITCH_SOURCE_CODE = `import { SynapseToggleSwitch } from "@synapse/react/toggle-switch";

export function Example() {
  return (
    <SynapseToggleSwitch>
      {/* project children / slots */}
    </SynapseToggleSwitch>
  );
}`;

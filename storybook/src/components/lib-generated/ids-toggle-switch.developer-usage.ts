/** Developer usage + Docs tab copy for IDS ToggleSwitch (React). */

export const TOGGLE_SWITCH_DOCS_DESCRIPTION = `
## Overview

Binary on/off switch control.

Import from \`@ids/react/toggle-switch\`.

## Props

### \`IdsToggleSwitchProps\`

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
| \`onCheckedChange\` | \`IdsToggleSwitchProps\` | \`(checked: boolean) => void\` |

## API

### Import

\`\`\`tsx
import { IdsToggleSwitch } from "@ids/react/toggle-switch";
\`\`\`

### Usage

\`\`\`tsx
<IdsToggleSwitch>
  {/* project children / slots per anatomy */}
</IdsToggleSwitch>
\`\`\`
`.trim();

export const TOGGLE_SWITCH_SOURCE_CODE = `import { IdsToggleSwitch } from "@ids/react/toggle-switch";

export function Example() {
  return (
    <IdsToggleSwitch>
      {/* project children / slots */}
    </IdsToggleSwitch>
  );
}`;

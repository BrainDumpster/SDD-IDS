/** Developer usage + Docs tab copy for Synapse Button (React façade). */

export const SYNAPSE_BUTTON_DOCS_DESCRIPTION = `
## Overview

Synapse Button is an IDS-fork façade over \`lib/react/ids/button\` (\`reexport\` strategy).
Load \`components/synapse-theme.css\` only — do not load \`ids-theme.css\`.

\`\`\`
SynapseButton
  SynapseButtonLeadingIcon
  SynapseButtonLabel
\`\`\`

Import from \`@synapse/react/button\`.

## Props

### \`SynapseButtonProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |
| \`variant\` | \`SynapseButtonVariant\` | — |
| \`size\` | \`SynapseButtonSize\` | — |
| \`iconOnly\` | \`boolean\` | — |
| \`disabled\` | \`boolean\` | — |
| \`loading\` | \`boolean\` | — |
| \`type\` | \`"button" \\| "submit" \\| "reset"\` | — |
| \`ariaLabel\` | \`string\` | — |
| \`dataState\` | \`SynapseButtonDataState\` | — |

### \`SynapseButtonLeadingIconProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |
| \`className\` | \`string\` | — |
| \`hidden\` | \`boolean\` | — |

### \`SynapseButtonLabelProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |
| \`className\` | \`string\` | — |
| \`hidden\` | \`boolean\` | — |

## Events

| Callback | On | Signature |
|----------|----|-----------|
| \`onPressStart\` | \`SynapseButtonProps\` | \`(event: MouseEvent \\| KeyboardEvent)\` |
| \`onPressEnd\` | \`SynapseButtonProps\` | \`(event: MouseEvent \\| KeyboardEvent)\` |

## API

### Import

\`\`\`tsx
import {
  SynapseButton,
  SynapseButtonLeadingIcon,
  SynapseButtonLabel,
} from "@synapse/react/button";
\`\`\`

### Usage

\`\`\`tsx
import "components/synapse-theme.css";
import {
  SynapseButton,
  SynapseButtonLeadingIcon,
  SynapseButtonLabel,
} from "@synapse/react/button";
import { SynapseIcon } from "@synapse/react/icon";

export function Example() {
  return (
    <SynapseButton variant="primary" size="large">
      <SynapseButtonLeadingIcon>
        <SynapseIcon shape="settings-gear-detailed" size={16} />
      </SynapseButtonLeadingIcon>
      <SynapseButtonLabel>Button</SynapseButtonLabel>
    </SynapseButton>
  );
}
\`\`\`
`.trim();

export const SYNAPSE_BUTTON_SOURCE_CODE = `import "components/synapse-theme.css";
import {
  SynapseButton,
  SynapseButtonLeadingIcon,
  SynapseButtonLabel,
} from "@synapse/react/button";
import { SynapseIcon } from "@synapse/react/icon";

export function Example() {
  return (
    <SynapseButton variant="primary" size="large">
      <SynapseButtonLeadingIcon>
        <SynapseIcon shape="settings-gear-detailed" size={16} />
      </SynapseButtonLeadingIcon>
      <SynapseButtonLabel>Button</SynapseButtonLabel>
    </SynapseButton>
  );
}`;

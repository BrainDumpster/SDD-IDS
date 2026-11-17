/** Developer usage + Docs tab copy for IDS Button (React). */

export const BUTTON_DOCS_DESCRIPTION = `
## Overview

Primary interactive control with variants, sizes, loading, and leading-icon projection.

\`\`\`
IdsButton
  IdsButtonLeadingIcon?
  IdsButtonLabel
\`\`\`

Import from \`@ids/react/button\`. For icon-only controls use \`IdsIconButton\` (\`@ids/react/icon-button\`).

## Props

### \`IdsButtonProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |
| \`variant\` | \`primary \\| secondary \\| tertiary \\| destructive\` | \`primary\` |
| \`size\` | \`small \\| medium \\| large\` | \`large\` |
| \`showIcon\` | \`boolean\` | \`true\` |
| \`disabled\` | \`boolean\` | \`false\` |
| \`loading\` | \`boolean\` | \`false\` |
| \`type\` | \`"button" \\| "submit" \\| "reset"\` | \`button\` |
| \`ariaLabel\` | \`string\` | — |
| \`dataState\` | \`IdsButtonDataState\` | — |

## Usage

\`\`\`tsx
<IdsButton variant="primary">
  <IdsButtonLabel>Button</IdsButtonLabel>
</IdsButton>

<IdsButton variant="secondary">
  <IdsButtonLeadingIcon>
    <IdsIcon shape="settings-gear-detailed" size={16} />
  </IdsButtonLeadingIcon>
  <IdsButtonLabel>Settings</IdsButtonLabel>
</IdsButton>
\`\`\`
`.trim();

export const BUTTON_SOURCE_CODE = `import {
  IdsButton,
  IdsButtonLeadingIcon,
  IdsButtonLabel,
} from "@ids/react/button";
import { IdsIcon } from "@ids/react/icon";

export function Example() {
  return (
    <IdsButton variant="primary">
      <IdsButtonLeadingIcon>
        <IdsIcon shape="settings-gear-detailed" size={16} />
      </IdsButtonLeadingIcon>
      <IdsButtonLabel>Button</IdsButtonLabel>
    </IdsButton>
  );
}`;

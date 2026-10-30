/** Developer usage + Docs tab copy for IDS MainMenuLeft (React). */

export const MAIN_MENU_LEFT_DOCS_DESCRIPTION = `
## Overview

Left navigation rail with icon items, expansion, and active states.

Import from \`@ids/react/main-menu-left\`.

## Props

### \`IdsMainMenuLeftProps\`

| Prop | Type | Default |
|------|------|---------|
| \`logo\` | \`MainMenuLeftLogo\` | — |
| \`expanded\` | \`boolean\` | — |
| \`items\` | \`MainMenuLeftPrimaryItem[]\` | required |
| \`defaultSelectedItemId\` | \`string\` | — |
| \`forceStates\` | \`boolean\` | — |
| \`ariaLabel\` | \`string\` | — |
| \`className\` | \`string\` | — |

## Events

| Callback | On | Signature |
|----------|----|-----------|
| \`onExpandedChange\` | \`IdsMainMenuLeftProps\` | \`(expanded: boolean) => void\` |
| \`onNavigate\` | \`IdsMainMenuLeftProps\` | \`(target: MainMenuLeftNavigationTarget) => void\` |
| \`onSelected\` | \`IdsMainMenuLeftProps\` | \`(detail: MainMenuLeftSelectionDetail) => void\` |

## API

### Import

\`\`\`tsx
import { IdsMainMenuLeft } from "@ids/react/main-menu-left";
\`\`\`

### Usage

\`\`\`tsx
<IdsMainMenuLeft>
  {/* project children / slots per anatomy */}
</IdsMainMenuLeft>
\`\`\`
`.trim();

export const MAIN_MENU_LEFT_SOURCE_CODE = `import { IdsMainMenuLeft } from "@ids/react/main-menu-left";

export function Example() {
  return (
    <IdsMainMenuLeft>
      {/* project children / slots */}
    </IdsMainMenuLeft>
  );
}`;

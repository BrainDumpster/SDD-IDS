/** Developer usage + Docs tab copy for IDS Masthead (React). */

export const MASTHEAD_DOCS_DESCRIPTION = `
## Overview

Top application bar with brand, product name, icons, and avatar slots.

\`\`\`
IdsMasthead
  IdsMastheadBrandSlot
  IdsMastheadLogo
  IdsMastheadProductName
  IdsMastheadActionsRow
  IdsMastheadIconsSlot
  IdsMastheadAppLauncherSlot
  IdsMastheadAvatarSlot
  IdsMastheadActionButtonContainer
  IdsMastheadActionIconButton
  IdsMastheadAvatar
\`\`\`

Import from \`@ids/react/masthead\`.

## Props

### \`IdsMastheadProps\`

| Prop | Type | Default |
|------|------|---------|
| \`productName\` | \`ReactNode\` | — |
| \`logo\` | \`ReactNode\` | — |
| \`iconsSlot\` | \`ReactNode\` | — |
| \`appLauncherSlot\` | \`ReactNode\` | — |
| \`avatarSlot\` | \`ReactNode\` | — |
| \`children\` | \`ReactNode\` | — |

### \`IdsMastheadBrandSlotProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |

### \`IdsMastheadLogoProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |
| \`className\` | \`string\` | — |

### \`IdsMastheadProductNameProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |
| \`className\` | \`string\` | — |

### \`IdsMastheadActionsRowProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |

## Events

No dedicated callback props beyond standard DOM handlers on native elements.

## API

### Import

\`\`\`tsx
import {
  IdsMasthead,
  IdsMastheadBrandSlot,
  IdsMastheadLogo,
  IdsMastheadProductName,
  IdsMastheadActionsRow,
  IdsMastheadIconsSlot,
} from "@ids/react/masthead";
\`\`\`

### Usage

\`\`\`tsx
<IdsMasthead>
  {/* project children / slots per anatomy */}
</IdsMasthead>
\`\`\`
`.trim();

export const MASTHEAD_SOURCE_CODE = `import {
  IdsMasthead,
  IdsMastheadBrandSlot,
  IdsMastheadLogo,
  IdsMastheadProductName,
  IdsMastheadActionsRow,
  IdsMastheadIconsSlot,
} from "@ids/react/masthead";

export function Example() {
  return (
    <IdsMasthead>
      {/* project children / slots */}
    </IdsMasthead>
  );
}`;

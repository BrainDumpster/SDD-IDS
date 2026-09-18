/** Developer usage + Docs tab copy for IDS Masthead (React). */

export const SYNAPSE_MASTHEAD_DOCS_DESCRIPTION = `
## Overview

Synapse Masthead is an IDS-fork façade over \`lib/react/ids/masthead\` (\`reexport\` strategy).
Load \`components/synapse-theme.css\` only — do not load \`ids-theme.css\`.

Import from \`@synapse/react/masthead\`.

Top application bar with brand, product name, icons, and avatar slots.

\`\`\`
SynapseMasthead
  SynapseMastheadBrandSlot
  SynapseMastheadLogo
  SynapseMastheadProductName
  SynapseMastheadActionsRow
  SynapseMastheadIconsSlot
  SynapseMastheadAppLauncherSlot
  SynapseMastheadAvatarSlot
  SynapseMastheadActionButtonContainer
  SynapseMastheadActionIconButton
  SynapseMastheadAvatar
\`\`\`

Import from \`@synapse/react/masthead\`.

## Props

### \`SynapseMastheadProps\`

| Prop | Type | Default |
|------|------|---------|
| \`productName\` | \`ReactNode\` | — |
| \`logo\` | \`ReactNode\` | — |
| \`iconsSlot\` | \`ReactNode\` | — |
| \`appLauncherSlot\` | \`ReactNode\` | — |
| \`avatarSlot\` | \`ReactNode\` | — |
| \`children\` | \`ReactNode\` | — |

### \`SynapseMastheadBrandSlotProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |

### \`SynapseMastheadLogoProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |
| \`className\` | \`string\` | — |

### \`SynapseMastheadProductNameProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |
| \`className\` | \`string\` | — |

### \`SynapseMastheadActionsRowProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |

## Events

No dedicated callback props beyond standard DOM handlers on native elements.

## API

### Import

\`\`\`tsx
import {
  SynapseMasthead,
  SynapseMastheadBrandSlot,
  SynapseMastheadLogo,
  SynapseMastheadProductName,
  SynapseMastheadActionsRow,
  SynapseMastheadIconsSlot,
} from "@synapse/react/masthead";
\`\`\`

### Usage

\`\`\`tsx
<SynapseMasthead>
  {/* project children / slots per anatomy */}
</SynapseMasthead>
\`\`\`
`.trim();

export const SYNAPSE_MASTHEAD_SOURCE_CODE = `import {
  SynapseMasthead,
  SynapseMastheadBrandSlot,
  SynapseMastheadLogo,
  SynapseMastheadProductName,
  SynapseMastheadActionsRow,
  SynapseMastheadIconsSlot,
} from "@synapse/react/masthead";

export function Example() {
  return (
    <SynapseMasthead>
      {/* project children / slots */}
    </SynapseMasthead>
  );
}`;

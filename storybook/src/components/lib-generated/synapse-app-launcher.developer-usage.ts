/** Developer usage + Docs tab copy for IDS AppLauncher (React). */

export const SYNAPSE_APP_LAUNCHER_DOCS_DESCRIPTION = `
## Overview

Synapse App Launcher is an IDS-fork façade over \`lib/react/ids/app-launcher\` (\`wrapper\` strategy).
Load \`components/synapse-theme.css\` only — do not load \`ids-theme.css\`.

Import from \`@synapse/react/app-launcher\`.

Product switcher surface with tiles, option rows, and optional footer actions.

\`\`\`
SynapseAppLauncher
  SynapseAppLauncherTrigger
  SynapseAppLauncherSurface
  SynapseAppLauncherProductRegion
  SynapseAppLauncherProductRowGroup
  SynapseAppLauncherRowDivider
  SynapseAppLauncherProductRow
  SynapseAppLauncherColumnDivider
  SynapseAppLauncherProductTile
  SynapseAppLauncherLabelCluster
  SynapseAppLauncherTileDividerRail
  SynapseAppLauncherProductIcon
  SynapseAppLauncherProductLabel
  SynapseAppLauncherOptionsRegion
\`\`\`

Import from \`@synapse/react/app-launcher\`.

## Props

### \`SynapseAppLauncherProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |
| \`programme\` | \`SynapseAppLauncherProgramme \\| string\` | — |
| \`products\` | \`SynapseAppLauncherProduct[]\` | — |
| \`apps\` | \`SynapseAppLauncherProduct[]\` | — |
| \`options\` | \`SynapseAppLauncherOption[]\` | — |
| \`footerAction\` | \`SynapseAppLauncherFooterActionModel\` | — |
| \`columns\` | \`number\` | — |
| \`triggerVariant\` | \`SynapseAppLauncherTriggerVariant \\| string\` | — |
| \`sideOffset\` | \`number\` | — |
| \`open\` | \`boolean\` | — |
| \`defaultOpen\` | \`boolean\` | — |
| \`panelOnly\` | \`boolean\` | — |
| \`className\` | \`string\` | — |
| \`style\` | \`CSSProperties\` | — |
| \`id\` | \`string\` | — |

### \`SynapseAppLauncherColumnDividerProps\`

| Prop | Type | Default |
|------|------|---------|
| \`variant\` | \`SynapseAppLauncherDividerVariant\` | — |

### \`SynapseAppLauncherTileDividerRailProps\`

| Prop | Type | Default |
|------|------|---------|
| \`variant\` | \`Exclude<SynapseAppLauncherTileDivider, "none">\` | — |

### \`SynapseAppLauncherProductIconProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |
| \`shape\` | \`string\` | — |

### \`SynapseAppLauncherProductLabelProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |

## Events

| Callback | On | Signature |
|----------|----|-----------|
| \`onOpenChange\` | \`SynapseAppLauncherProps\` | \`(open: boolean) => void\` |
| \`onProductSelect\` | \`SynapseAppLauncherProps\` | \`(detail: SynapseAppLauncherProductSelectDetail) => void\` |
| \`onOptionSelect\` | \`SynapseAppLauncherProps\` | \`(detail: SynapseAppLauncherOptionSelectDetail) => void\` |
| \`onSelect\` | \`SynapseAppLauncherProductTileProps\` | \`() => void\` |

## API

### Import

\`\`\`tsx
import {
  SynapseAppLauncher,
  SynapseAppLauncherTrigger,
  SynapseAppLauncherSurface,
  SynapseAppLauncherProductRegion,
  SynapseAppLauncherProductRowGroup,
  SynapseAppLauncherRowDivider,
} from "@synapse/react/app-launcher";
\`\`\`

### Usage

\`\`\`tsx
<SynapseAppLauncher>
  {/* project children / slots per anatomy */}
</SynapseAppLauncher>
\`\`\`
`.trim();

export const SYNAPSE_APP_LAUNCHER_SOURCE_CODE = `import {
  SynapseAppLauncher,
  SynapseAppLauncherTrigger,
  SynapseAppLauncherSurface,
  SynapseAppLauncherProductRegion,
  SynapseAppLauncherProductRowGroup,
  SynapseAppLauncherRowDivider,
} from "@synapse/react/app-launcher";

export function Example() {
  return (
    <SynapseAppLauncher>
      {/* project children / slots */}
    </SynapseAppLauncher>
  );
}`;

/** Developer usage + Docs tab copy for IDS AppLauncher (React). */

export const APP_LAUNCHER_DOCS_DESCRIPTION = `
## Overview

Product switcher surface with tiles, option rows, and optional footer actions.

\`\`\`
IdsAppLauncher
  IdsAppLauncherTrigger
  IdsAppLauncherSurface
  IdsAppLauncherProductRegion
  IdsAppLauncherProductRowGroup
  IdsAppLauncherRowDivider
  IdsAppLauncherProductRow
  IdsAppLauncherColumnDivider
  IdsAppLauncherProductTile
  IdsAppLauncherLabelCluster
  IdsAppLauncherTileDividerRail
  IdsAppLauncherProductIcon
  IdsAppLauncherProductLabel
  IdsAppLauncherOptionsRegion
\`\`\`

Import from \`@ids/react/app-launcher\`.

## Props

### \`IdsAppLauncherProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |
| \`programme\` | \`IdsAppLauncherProgramme \\| string\` | — |
| \`products\` | \`IdsAppLauncherProduct[]\` | — |
| \`apps\` | \`IdsAppLauncherProduct[]\` | — |
| \`options\` | \`IdsAppLauncherOption[]\` | — |
| \`footerAction\` | \`IdsAppLauncherFooterActionModel\` | — |
| \`columns\` | \`number\` | — |
| \`triggerVariant\` | \`IdsAppLauncherTriggerVariant \\| string\` | — |
| \`sideOffset\` | \`number\` | — |
| \`open\` | \`boolean\` | — |
| \`defaultOpen\` | \`boolean\` | — |
| \`panelOnly\` | \`boolean\` | — |
| \`className\` | \`string\` | — |
| \`style\` | \`CSSProperties\` | — |
| \`id\` | \`string\` | — |

### \`IdsAppLauncherColumnDividerProps\`

| Prop | Type | Default |
|------|------|---------|
| \`variant\` | \`IdsAppLauncherDividerVariant\` | — |

### \`IdsAppLauncherTileDividerRailProps\`

| Prop | Type | Default |
|------|------|---------|
| \`variant\` | \`Exclude<IdsAppLauncherTileDivider, "none">\` | — |

### \`IdsAppLauncherProductIconProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |
| \`shape\` | \`string\` | — |

### \`IdsAppLauncherProductLabelProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |

## Events

| Callback | On | Signature |
|----------|----|-----------|
| \`onOpenChange\` | \`IdsAppLauncherProps\` | \`(open: boolean) => void\` |
| \`onProductSelect\` | \`IdsAppLauncherProps\` | \`(detail: IdsAppLauncherProductSelectDetail) => void\` |
| \`onOptionSelect\` | \`IdsAppLauncherProps\` | \`(detail: IdsAppLauncherOptionSelectDetail) => void\` |
| \`onSelect\` | \`IdsAppLauncherProductTileProps\` | \`() => void\` |

## API

### Import

\`\`\`tsx
import {
  IdsAppLauncher,
  IdsAppLauncherTrigger,
  IdsAppLauncherSurface,
  IdsAppLauncherProductRegion,
  IdsAppLauncherProductRowGroup,
  IdsAppLauncherRowDivider,
} from "@ids/react/app-launcher";
\`\`\`

### Usage

\`\`\`tsx
<IdsAppLauncher>
  {/* project children / slots per anatomy */}
</IdsAppLauncher>
\`\`\`
`.trim();

export const APP_LAUNCHER_SOURCE_CODE = `import {
  IdsAppLauncher,
  IdsAppLauncherTrigger,
  IdsAppLauncherSurface,
  IdsAppLauncherProductRegion,
  IdsAppLauncherProductRowGroup,
  IdsAppLauncherRowDivider,
} from "@ids/react/app-launcher";

export function Example() {
  return (
    <IdsAppLauncher>
      {/* project children / slots */}
    </IdsAppLauncher>
  );
}`;

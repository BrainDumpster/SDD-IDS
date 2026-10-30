/** Developer usage + Docs tab copy for IDS AppShell (React). */

export const APP_SHELL_DOCS_DESCRIPTION = `
## Overview

Application chrome layout: masthead, main menu, page header, content, and footer slots.

\`\`\`
IdsAppShell
  IdsAppShellMastheadSlot
  IdsAppShellBodyRow
  IdsAppShellMainMenuSlot
  IdsAppShellMainColumn
  IdsAppShellPageHeader
  IdsAppShellPageTitle
  IdsAppShellPageDescription
  IdsAppShellBodyViewport
  IdsAppShellBodyContentSlot
  IdsAppShellFooterSlot
  IdsAppShellHeaderActions
  IdsAppShellPagePanel
  IdsMastheadActionButtonContainer
\`\`\`

Import from \`@ids/react/app-shell\`.

## Props

### \`IdsAppShellProps\`

| Prop | Type | Default |
|------|------|---------|
| \`pages\` | \`AppShellPage[]\` | — |
| \`activePageId\` | \`string\` | — |
| \`defaultPageId\` | \`string\` | — |
| \`menuItems\` | \`MainMenuLeftPrimaryItem[]\` | — |
| \`menuLogo\` | \`MainMenuLeftLogo\` | — |
| \`menuAriaLabel\` | \`string\` | — |
| \`defaultMenuSelectedItemId\` | \`string\` | — |
| \`menuExpanded\` | \`boolean\` | — |
| \`defaultMenuExpanded\` | \`boolean\` | — |
| \`persistMenuExpanded\` | \`boolean\` | — |
| \`mastheadProductName\` | \`string\` | — |
| \`mastheadProductIconSlug\` | \`string\` | — |
| \`mastheadLogo\` | \`ReactNode\` | — |
| \`headerActions\` | \`ReactNode\` | — |
| \`appLauncherSlot\` | \`ReactNode\` | — |
| \`avatarSlot\` | \`ReactNode\` | — |
| \`footerHostname\` | \`string\` | — |
| \`footerSwid\` | \`string\` | — |

### \`IdsAppShellMastheadSlotProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |

### \`IdsAppShellBodyRowProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |

### \`IdsAppShellMainMenuSlotProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |

### \`IdsAppShellMainColumnProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |

## Events

| Callback | On | Signature |
|----------|----|-----------|
| \`onPageChange\` | \`IdsAppShellProps\` | \`(pageId: string, page: AppShellPage) => void\` |
| \`onMenuExpandedChange\` | \`IdsAppShellProps\` | \`(expanded: boolean) => void\` |
| \`onNavigate\` | \`IdsAppShellProps\` | \`(target: MainMenuLeftNavigationTarget) => void\` |
| \`onMenuSelected\` | \`IdsAppShellProps\` | \`(detail: MainMenuLeftSelectionDetail) => void\` |
| \`onCopySwid\` | \`IdsAppShellProps\` | \`(swid: string) => void\` |
| \`onTimeZoneClick\` | \`IdsAppShellProps\` | \`() => void\` |

## API

### Import

\`\`\`tsx
import {
  IdsAppShell,
  IdsAppShellMastheadSlot,
  IdsAppShellBodyRow,
  IdsAppShellMainMenuSlot,
  IdsAppShellMainColumn,
  IdsAppShellPageHeader,
} from "@ids/react/app-shell";
\`\`\`

### Usage

\`\`\`tsx
<IdsAppShell>
  {/* project children / slots per anatomy */}
</IdsAppShell>
\`\`\`
`.trim();

export const APP_SHELL_SOURCE_CODE = `import {
  IdsAppShell,
  IdsAppShellMastheadSlot,
  IdsAppShellBodyRow,
  IdsAppShellMainMenuSlot,
  IdsAppShellMainColumn,
  IdsAppShellPageHeader,
} from "@ids/react/app-shell";

export function Example() {
  return (
    <IdsAppShell>
      {/* project children / slots */}
    </IdsAppShell>
  );
}`;

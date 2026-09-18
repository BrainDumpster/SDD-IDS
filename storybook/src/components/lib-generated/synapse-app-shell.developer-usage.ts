/** Developer usage + Docs tab copy for IDS AppShell (React). */

export const SYNAPSE_APP_SHELL_DOCS_DESCRIPTION = `
## Overview

Synapse App Shell is an IDS-fork façade over \`lib/react/ids/app-shell\` (\`reexport\` strategy).
Load \`components/synapse-theme.css\` only — do not load \`ids-theme.css\`.

Import from \`@synapse/react/app-shell\`.

Application chrome layout: masthead, main menu, page header, content, and footer slots.

\`\`\`
SynapseAppShell
  SynapseAppShellMastheadSlot
  SynapseAppShellBodyRow
  SynapseAppShellMainMenuSlot
  SynapseAppShellMainColumn
  SynapseAppShellPageHeader
  SynapseAppShellPageTitle
  SynapseAppShellPageDescription
  SynapseAppShellBodyViewport
  SynapseAppShellBodyContentSlot
  SynapseAppShellFooterSlot
  SynapseAppShellHeaderActions
  SynapseAppShellPagePanel
  SynapseMastheadActionButtonContainer
\`\`\`

Import from \`@synapse/react/app-shell\`.

## Props

### \`SynapseAppShellProps\`

| Prop | Type | Default |
|------|------|---------|
| \`pages\` | \`AppShellPage[]\` | — |
| \`activePageId\` | \`string\` | — |
| \`defaultPageId\` | \`string\` | — |
| \`menuItems\` | \`SynapseLeftNavPrimaryItem[]\` | — |
| \`menuLogo\` | \`SynapseLeftNavLogo\` | — |
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

### \`SynapseAppShellMastheadSlotProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |

### \`SynapseAppShellBodyRowProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |

### \`SynapseAppShellMainMenuSlotProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |

### \`SynapseAppShellMainColumnProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |

## Events

| Callback | On | Signature |
|----------|----|-----------|
| \`onPageChange\` | \`SynapseAppShellProps\` | \`(pageId: string, page: AppShellPage) => void\` |
| \`onMenuExpandedChange\` | \`SynapseAppShellProps\` | \`(expanded: boolean) => void\` |
| \`onNavigate\` | \`SynapseAppShellProps\` | \`(target: SynapseLeftNavNavigationTarget) => void\` |
| \`onMenuSelected\` | \`SynapseAppShellProps\` | \`(detail: SynapseLeftNavSelectionDetail) => void\` |
| \`onCopySwid\` | \`SynapseAppShellProps\` | \`(swid: string) => void\` |
| \`onTimeZoneClick\` | \`SynapseAppShellProps\` | \`() => void\` |

## API

### Import

\`\`\`tsx
import {
  SynapseAppShell,
  SynapseAppShellMastheadSlot,
  SynapseAppShellBodyRow,
  SynapseAppShellMainMenuSlot,
  SynapseAppShellMainColumn,
  SynapseAppShellPageHeader,
} from "@synapse/react/app-shell";
\`\`\`

### Usage

\`\`\`tsx
<SynapseAppShell>
  {/* project children / slots per anatomy */}
</SynapseAppShell>
\`\`\`
`.trim();

export const SYNAPSE_APP_SHELL_SOURCE_CODE = `import {
  SynapseAppShell,
  SynapseAppShellMastheadSlot,
  SynapseAppShellBodyRow,
  SynapseAppShellMainMenuSlot,
  SynapseAppShellMainColumn,
  SynapseAppShellPageHeader,
} from "@synapse/react/app-shell";

export function Example() {
  return (
    <SynapseAppShell>
      {/* project children / slots */}
    </SynapseAppShell>
  );
}`;

/** Developer usage + Docs tab copy for IDS Alert (React). */

export const SYNAPSE_ALERT_DOCS_DESCRIPTION = `
## Overview

Synapse Alert is an IDS-fork façade over \`lib/react/ids/alert\` (\`reexport\` strategy).
Load \`components/synapse-theme.css\` only — do not load \`ids-theme.css\`.

Import from \`@synapse/react/alert\`.

Inline or stacked status messages for informational, success, warning, and critical feedback.

\`\`\`
SynapseAlert
  SynapseAlertGroup
\`\`\`

Import from \`@synapse/react/alert\`.

## Props

### \`SynapseAlertCarouselProps\`

| Prop | Type | Default |
|------|------|---------|
| \`currentItem\` | \`number\` | required |
| \`totalItems\` | \`number\` | required |

### \`SynapseAlertBaseProps\`

| Prop | Type | Default |
|------|------|---------|
| \`message\` | \`string\` | required |
| \`link\` | \`SynapseAlertLink\` | — |
| \`linkLabel\` | \`string\` | — |
| \`linkHref\` | \`string\` | — |
| \`actionLabel\` | \`string\` | — |
| \`dismissible\` | \`boolean\` | — |

### \`SynapseAlertGroupProps\`

| Prop | Type | Default |
|------|------|---------|
| \`items\` | \`SynapseAlertItem[]\` | required |
| \`defaultActiveIndex\` | \`number\` | — |
| \`activeIndex\` | \`number\` | — |
| \`wrap\` | \`boolean\` | — |

## Events

| Callback | On | Signature |
|----------|----|-----------|
| \`onPrevious\` | \`SynapseAlertCarouselProps\` | \`() => void\` |
| \`onNext\` | \`SynapseAlertCarouselProps\` | \`() => void\` |
| \`onLinkClick\` | \`SynapseAlertBaseProps\` | \`(event: MouseEvent<HTMLAnchorElement \\| HTMLButtonElement>) =…\` |
| \`onAction\` | \`SynapseAlertBaseProps\` | \`() => void\` |
| \`onDismiss\` | \`SynapseAlertBaseProps\` | \`() => void\` |
| \`onActiveIndexChange\` | \`SynapseAlertGroupProps\` | \`(index: number) => void\` |
| \`onItemsChange\` | \`SynapseAlertGroupProps\` | \`(items: SynapseAlertItem[]) => void\` |

## API

### Import

\`\`\`tsx
import {
  SynapseAlert,
  SynapseAlertGroup,
} from "@synapse/react/alert";
\`\`\`

### Usage

\`\`\`tsx
<SynapseAlert>
  {/* project children / slots per anatomy */}
</SynapseAlert>
\`\`\`
`.trim();

export const SYNAPSE_ALERT_SOURCE_CODE = `import {
  SynapseAlert,
  SynapseAlertGroup,
} from "@synapse/react/alert";

export function Example() {
  return (
    <SynapseAlert>
      {/* project children / slots */}
    </SynapseAlert>
  );
}`;

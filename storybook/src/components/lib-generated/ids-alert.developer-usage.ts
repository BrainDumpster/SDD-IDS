/** Developer usage + Docs tab copy for IDS Alert (React). */

export const ALERT_DOCS_DESCRIPTION = `
## Overview

Inline or stacked status messages for informational, success, warning, and critical feedback.

\`\`\`
IdsAlert
  IdsAlertGroup
\`\`\`

Import from \`@ids/react/alert\`.

## Props

### \`IdsAlertCarouselProps\`

| Prop | Type | Default |
|------|------|---------|
| \`currentItem\` | \`number\` | required |
| \`totalItems\` | \`number\` | required |

### \`IdsAlertBaseProps\`

| Prop | Type | Default |
|------|------|---------|
| \`message\` | \`string\` | required |
| \`link\` | \`IdsAlertLink\` | — |
| \`linkLabel\` | \`string\` | — |
| \`linkHref\` | \`string\` | — |
| \`actionLabel\` | \`string\` | — |
| \`dismissible\` | \`boolean\` | — |

### \`IdsAlertGroupProps\`

| Prop | Type | Default |
|------|------|---------|
| \`items\` | \`IdsAlertItem[]\` | required |
| \`defaultActiveIndex\` | \`number\` | — |
| \`activeIndex\` | \`number\` | — |
| \`wrap\` | \`boolean\` | — |

## Events

| Callback | On | Signature |
|----------|----|-----------|
| \`onPrevious\` | \`IdsAlertCarouselProps\` | \`() => void\` |
| \`onNext\` | \`IdsAlertCarouselProps\` | \`() => void\` |
| \`onLinkClick\` | \`IdsAlertBaseProps\` | \`(event: MouseEvent<HTMLAnchorElement \\| HTMLButtonElement>) =…\` |
| \`onAction\` | \`IdsAlertBaseProps\` | \`() => void\` |
| \`onDismiss\` | \`IdsAlertBaseProps\` | \`() => void\` |
| \`onActiveIndexChange\` | \`IdsAlertGroupProps\` | \`(index: number) => void\` |
| \`onItemsChange\` | \`IdsAlertGroupProps\` | \`(items: IdsAlertItem[]) => void\` |

## API

### Import

\`\`\`tsx
import {
  IdsAlert,
  IdsAlertGroup,
} from "@ids/react/alert";
\`\`\`

### Usage

\`\`\`tsx
<IdsAlert>
  {/* project children / slots per anatomy */}
</IdsAlert>
\`\`\`
`.trim();

export const ALERT_SOURCE_CODE = `import {
  IdsAlert,
  IdsAlertGroup,
} from "@ids/react/alert";

export function Example() {
  return (
    <IdsAlert>
      {/* project children / slots */}
    </IdsAlert>
  );
}`;

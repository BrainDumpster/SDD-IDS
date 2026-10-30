/** Developer usage + Docs tab copy for IDS Tooltip (React). */

export const TOOLTIP_DOCS_DESCRIPTION = `
## Overview

Contextual hover/focus tip with optional title, body, arrow, and close.

Import from \`@ids/react/tooltip\`.

## Props

### \`TooltipProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |
| \`side\` | \`TooltipSide\` | — |
| \`arrowAlign\` | \`TooltipArrowAlign\` | — |
| \`closable\` | \`boolean\` | — |
| \`open\` | \`boolean\` | — |
| \`defaultOpen\` | \`boolean\` | — |
| \`closeIconShapeName\` | \`string\` | — |
| \`hugContent\` | \`boolean\` | — |

### \`TooltipTriggerProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |
| \`display\` | \`"inline" \\| "block"\` | — |

### \`TooltipPanelProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |

### \`TooltipHeaderProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |

### \`TooltipBodyProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |

## Events

| Callback | On | Signature |
|----------|----|-----------|
| \`onOpenChange\` | \`TooltipProps\` | \`(open: boolean) => void\` |
| \`onClose\` | \`TooltipProps\` | \`(reason: TooltipCloseReason) => void\` |

## API

### Import

\`\`\`tsx
import { IdsTooltip } from "@ids/react/tooltip";
\`\`\`

### Usage

\`\`\`tsx
<IdsTooltip>
  {/* project children / slots per anatomy */}
</IdsTooltip>
\`\`\`
`.trim();

export const TOOLTIP_SOURCE_CODE = `import { IdsTooltip } from "@ids/react/tooltip";

export function Example() {
  return (
    <IdsTooltip>
      {/* project children / slots */}
    </IdsTooltip>
  );
}`;

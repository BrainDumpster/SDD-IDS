/** Developer usage + Docs tab copy for IDS Tooltip (React). */

export const SYNAPSE_TOOLTIP_DOCS_DESCRIPTION = `
## Overview

Synapse Tooltip is an IDS-fork façade over \`lib/react/ids/tooltip\` (\`reexport\` strategy).
Load \`components/synapse-theme.css\` only — do not load \`ids-theme.css\`.

Import from \`@synapse/react/tooltip\`.

Contextual hover/focus tip with optional title, body, arrow, and close.

Import from \`@synapse/react/tooltip\`.

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
import { SynapseTooltip } from "@synapse/react/tooltip";
\`\`\`

### Usage

\`\`\`tsx
<SynapseTooltip>
  {/* project children / slots per anatomy */}
</SynapseTooltip>
\`\`\`
`.trim();

export const SYNAPSE_TOOLTIP_SOURCE_CODE = `import { SynapseTooltip } from "@synapse/react/tooltip";

export function Example() {
  return (
    <SynapseTooltip>
      {/* project children / slots */}
    </SynapseTooltip>
  );
}`;

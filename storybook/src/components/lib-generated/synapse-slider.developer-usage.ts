/** Developer usage + Docs tab copy for IDS Slider (React). */

export const SYNAPSE_SLIDER_DOCS_DESCRIPTION = `
## Overview

Synapse Slider is an IDS-fork façade over \`lib/react/ids/slider\` (\`reexport\` strategy).
Load \`components/synapse-theme.css\` only — do not load \`ids-theme.css\`.

Import from \`@synapse/react/slider\`.

Numeric range input with single or dual thumbs.

Import from \`@synapse/react/slider\`.

## Props

### \`SynapseSliderProps\`

| Prop | Type | Default |
|------|------|---------|
| \`mode\` | \`SynapseSliderMode \\| string\` | — |
| \`min\` | \`number\` | required |
| \`max\` | \`number\` | required |
| \`step\` | \`number\` | — |
| \`value\` | \`SynapseSliderValue\` | — |
| \`defaultValue\` | \`SynapseSliderValue\` | — |
| \`disabled\` | \`boolean\` | — |
| \`showStepper\` | \`boolean\` | — |
| \`showTicks\` | \`boolean\` | — |
| \`stepperFrequency\` | \`number\` | — |
| \`showValueLabel\` | \`boolean\` | — |
| \`showValueInput\` | \`boolean\` | — |
| \`minLabel\` | \`string\` | — |
| \`maxLabel\` | \`string\` | — |
| \`className\` | \`string\` | — |
| \`id\` | \`string\` | — |

## Events

| Callback | On | Signature |
|----------|----|-----------|
| \`onValueChange\` | \`SynapseSliderProps\` | \`(value: SynapseSliderValue) => void\` |
| \`onValueCommit\` | \`SynapseSliderProps\` | \`(value: SynapseSliderValue) => void\` |

## API

### Import

\`\`\`tsx
import { SynapseSlider } from "@synapse/react/slider";
\`\`\`

### Usage

\`\`\`tsx
<SynapseSlider>
  {/* project children / slots per anatomy */}
</SynapseSlider>
\`\`\`
`.trim();

export const SYNAPSE_SLIDER_SOURCE_CODE = `import { SynapseSlider } from "@synapse/react/slider";

export function Example() {
  return (
    <SynapseSlider>
      {/* project children / slots */}
    </SynapseSlider>
  );
}`;

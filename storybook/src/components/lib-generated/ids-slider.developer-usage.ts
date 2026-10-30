/** Developer usage + Docs tab copy for IDS Slider (React). */

export const SLIDER_DOCS_DESCRIPTION = `
## Overview

Numeric range input with single or dual thumbs.

Import from \`@ids/react/slider\`.

## Props

### \`IdsSliderProps\`

| Prop | Type | Default |
|------|------|---------|
| \`mode\` | \`IdsSliderMode \\| string\` | — |
| \`min\` | \`number\` | required |
| \`max\` | \`number\` | required |
| \`step\` | \`number\` | — |
| \`value\` | \`IdsSliderValue\` | — |
| \`defaultValue\` | \`IdsSliderValue\` | — |
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
| \`onValueChange\` | \`IdsSliderProps\` | \`(value: IdsSliderValue) => void\` |
| \`onValueCommit\` | \`IdsSliderProps\` | \`(value: IdsSliderValue) => void\` |

## API

### Import

\`\`\`tsx
import { IdsSlider } from "@ids/react/slider";
\`\`\`

### Usage

\`\`\`tsx
<IdsSlider>
  {/* project children / slots per anatomy */}
</IdsSlider>
\`\`\`
`.trim();

export const SLIDER_SOURCE_CODE = `import { IdsSlider } from "@ids/react/slider";

export function Example() {
  return (
    <IdsSlider>
      {/* project children / slots */}
    </IdsSlider>
  );
}`;

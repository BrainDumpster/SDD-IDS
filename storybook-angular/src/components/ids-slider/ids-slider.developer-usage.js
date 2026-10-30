/** Developer usage + Docs tab copy for IDS Slider (Angular). */

export const SLIDER_DOCS_DESCRIPTION = `
## Overview

Numeric range input with single or dual thumbs.

## Props

### \`ids-slider\`

| Input | Type | Default |
|-------|------|---------|
| \`mode\` | \`IdsSliderMode \\| string\` | \`SLIDER_RUNTIME_DEFAULTS.mode\` |
| \`step\` | \`number\` | \`SLIDER_RUNTIME_DEFAULTS.step\` |
| \`disabled\` | \`—\` | \`SLIDER_RUNTIME_DEFAULTS.disabled\` |
| \`showStepper\` | \`—\` | \`SLIDER_RUNTIME_DEFAULTS.showStepper\` |
| \`showTicks\` | \`—\` | \`SLIDER_RUNTIME_DEFAULTS.showTicks\` |
| \`showValueLabel\` | \`—\` | \`SLIDER_RUNTIME_DEFAULTS.showValue…\` |
| \`showValueInput\` | \`—\` | \`SLIDER_RUNTIME_DEFAULTS.showValue…\` |

## Events

| Output | On | Payload |
|--------|----|---------|
| \`onValueChange\` | \`ids-slider\` | \`IdsSliderValue\` |
| \`onValueCommit\` | \`ids-slider\` | \`IdsSliderValue\` |

## API

Import \`IDS_SLIDER_IMPORTS\` from the component imports barrel (compiled \`lib/angular/ids/slider\`).

\`\`\`ts
import { IDS_SLIDER_IMPORTS } from "@ids/angular/slider";
\`\`\`
`.trim();

export const SLIDER_SOURCE_CODE = `import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideZoneChangeDetection } from "@angular/core";
import { IDS_SLIDER_IMPORTS } from "./slider";
import { SLIDER_SPEC_ACCURATE_DEFAULTS } from "@component-contracts/ids/slider.contract";

@Component({
  standalone: true,
  imports: [...IDS_SLIDER_IMPORTS],
  template: \`
    <ids-slider
      [mode]="mode"
      [min]="min"
      [max]="max"
      [defaultValue]="defaultValue"
      [minLabel]="minLabel"
      [maxLabel]="maxLabel"
      [showStepper]="showStepper"
      [showValueLabel]="showValueLabel"
    ></ids-slider>
  \`,
})
export class AppComponent {
  mode = SLIDER_SPEC_ACCURATE_DEFAULTS.mode;
  min = SLIDER_SPEC_ACCURATE_DEFAULTS.min;
  max = SLIDER_SPEC_ACCURATE_DEFAULTS.max;
  defaultValue = SLIDER_SPEC_ACCURATE_DEFAULTS.defaultValue;
  minLabel = SLIDER_SPEC_ACCURATE_DEFAULTS.minLabel;
  maxLabel = SLIDER_SPEC_ACCURATE_DEFAULTS.maxLabel;
  showStepper = SLIDER_SPEC_ACCURATE_DEFAULTS.showStepper;
  showValueLabel = SLIDER_SPEC_ACCURATE_DEFAULTS.showValueLabel;
}

bootstrapApplication(AppComponent, {
  providers: [provideZoneChangeDetection()],
});`;

export const SLIDER_STORY_SOURCE_CODE = `<ids-slider
  mode="single"
  [min]="0"
  [max]="100"
  [defaultValue]="50"
  minLabel="0"
  maxLabel="100"
  [showStepper]="false"
  [showValueLabel]="true"
></ids-slider>`;

export const SLIDER_COMPOSITION_DEMO_TEMPLATE = `
<div style="width: 360px;">
  <ids-slider
    [mode]="mode"
    [min]="min"
    [max]="max"
    [step]="step"
    [defaultValue]="defaultValue"
    [disabled]="disabled"
    [showStepper]="showStepper"
    [showTicks]="showTicks"
    [stepperFrequency]="stepperFrequency"
    [showValueLabel]="showValueLabel"
    [showValueInput]="showValueInput"
    [minLabel]="minLabel"
    [maxLabel]="maxLabel"
    (onValueChange)="onValueChange($event)"
    (onValueCommit)="onValueCommit($event)"
  ></ids-slider>
</div>`;

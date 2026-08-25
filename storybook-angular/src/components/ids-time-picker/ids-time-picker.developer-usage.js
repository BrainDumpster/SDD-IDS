/** Developer usage + Docs tab copy for IDS Time Picker (Angular). */

export const TIME_PICKER_DOCS_DESCRIPTION = `
## Overview

Time-of-day selection control.

## Props

### \`ids-time-picker\`

| Input | Type | Default |
|-------|------|---------|
| \`value\` | \`string \\| null\` | \`null\` |
| \`size\` | \`TimePickerSize\` | \`TIME_PICKER_SPEC_ACCURATE_DEFAULT…\` |
| \`placeholder\` | \`—\` | \`TIME_PICKER_SPEC_ACCURATE_DEFAULT…\` |
| \`required\` | \`—\` | \`TIME_PICKER_SPEC_ACCURATE_DEFAULT…\` |
| \`formatHint\` | \`string\` | \`TIME_PICKER_SPEC_ACCURATE_DEFAULT…\` |
| \`clockType\` | \`TimePickerClockType\` | \`TIME_PICKER_SPEC_ACCURATE_DEFAULT…\` |
| \`showSeconds\` | \`—\` | \`TIME_PICKER_SPEC_ACCURATE_DEFAULT…\` |
| \`disabled\` | \`—\` | \`TIME_PICKER_SPEC_ACCURATE_DEFAULT…\` |
| \`error\` | \`—\` | \`TIME_PICKER_SPEC_ACCURATE_DEFAULT…\` |

## Events

| Output | On | Payload |
|--------|----|---------|
| \`onChange\` | \`ids-time-picker\` | \`string \\| null\` |

## API

Import \`IDS_TIME_PICKER_IMPORTS\` from the component imports barrel (compiled \`lib/angular/ids/time-picker\`).

\`\`\`ts
import { IDS_TIME_PICKER_IMPORTS } from "@ids/angular/time-picker";
\`\`\`
`.trim();

export const TIME_PICKER_SOURCE_CODE = `import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideZoneChangeDetection } from "@angular/core";
import { IDS_TIME_PICKER_IMPORTS } from "./time-picker";

@Component({
  standalone: true,
  imports: [...IDS_TIME_PICKER_IMPORTS],
  template: \`
    <ids-time-picker
      size="large"
      label="Time"
      clockType="12h"
      value="09:30 PM"
      formatHint="HH:MM AM/PM"
      (onChange)="value = $event"
    />
  \`,
})
export class AppComponent {
  value = "09:30 PM";
}

bootstrapApplication(AppComponent, {
  providers: [provideZoneChangeDetection()],
});`;

export const TIME_PICKER_STORY_SOURCE_CODE = `<ids-time-picker size="large" label="Time" value="09:30 PM" formatHint="HH:MM AM/PM" />`;

export const TIME_PICKER_COMPOSITION_DEMO_TEMPLATE = `
<ids-time-picker
  [size]="size"
  [label]="label"
  [placeholder]="placeholder"
  [formatHint]="formatHint"
  [clockType]="clockType"
  [showSeconds]="showSeconds"
  [required]="required"
  [disabled]="disabled"
  [error]="error"
  [errorMessage]="errorMessage"
  [value]="state.value"
  (onChange)="onTimeChange($event)"
/>`;

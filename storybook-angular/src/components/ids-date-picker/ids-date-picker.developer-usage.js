/** Developer usage + Docs tab copy for IDS Date Picker (Angular). */

export const DATE_PICKER_DOCS_DESCRIPTION = `
## Overview

Calendar-based date selection control.

## Props

### \`ids-date-picker\`

| Input | Type | Default |
|-------|------|---------|
| \`value\` | \`Date \\| null\` | \`DATE_PICKER_SPEC_ACCURATE_DEFAULT…\` |
| \`size\` | \`DatePickerSize\` | \`DATE_PICKER_SPEC_ACCURATE_DEFAULT…\` |
| \`required\` | \`—\` | \`DATE_PICKER_SPEC_ACCURATE_DEFAULT…\` |
| \`dateFormat\` | \`string\` | \`DATE_PICKER_SPEC_ACCURATE_DEFAULT…\` |
| \`formatHint\` | \`string\` | \`DATE_PICKER_SPEC_ACCURATE_DEFAULT…\` |
| \`disabled\` | \`—\` | \`DATE_PICKER_SPEC_ACCURATE_DEFAULT…\` |
| \`error\` | \`—\` | \`DATE_PICKER_SPEC_ACCURATE_DEFAULT…\` |
| \`disabledDates\` | \`Date[]\` | \`[]\` |
| \`rangeMode\` | \`—\` | \`DATE_PICKER_SPEC_ACCURATE_DEFAULT…\` |
| \`popupPortal\` | \`—\` | \`DATE_PICKER_SPEC_ACCURATE_DEFAULT…\` |

## Events

| Output | On | Payload |
|--------|----|---------|
| \`onChange\` | \`ids-date-picker\` | \`Date \\| null\` |
| \`onRangeChange\` | \`ids-date-picker\` | \`{ start: Date \\| null; end: Date \\| null }\` |

## API

Import \`IDS_DATE_PICKER_IMPORTS\` from the component imports barrel (compiled \`lib/angular/ids/date-picker\`).

\`\`\`ts
import { IDS_DATE_PICKER_IMPORTS } from "@ids/angular/date-picker";
\`\`\`
`.trim();

export const DATE_PICKER_SOURCE_CODE = `import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideZoneChangeDetection } from "@angular/core";
import { IDS_DATE_PICKER_IMPORTS } from "./date-picker";

@Component({
  standalone: true,
  imports: [...IDS_DATE_PICKER_IMPORTS],
  template: \`
    <ids-date-picker
      size="large"
      label="Start date"
      placeholder="MM-DD-YYYY"
      [value]="value"
      (onChange)="value = $event"
    />
  \`,
})
export class AppComponent {
  value = null;
}

bootstrapApplication(AppComponent, {
  providers: [provideZoneChangeDetection()],
});`;

export const DATE_PICKER_STORY_SOURCE_CODE = `<ids-date-picker size="large" label="Start date" placeholder="MM-DD-YYYY" />`;

export const DATE_PICKER_COMPOSITION_DEMO_TEMPLATE = `
<ids-date-picker
  [size]="size"
  [label]="label"
  [placeholder]="placeholder"
  [dateFormat]="dateFormat"
  [formatHint]="formatHint"
  [required]="required"
  [disabled]="disabled"
  [error]="error"
  [errorMessage]="errorMessage"
  [value]="state.value"
  (onChange)="onDateChange($event)"
/>`;

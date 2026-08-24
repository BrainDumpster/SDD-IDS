/** Developer usage + Docs tab copy for IDS Time Picker (Angular). */

export const TIME_PICKER_DOCS_DESCRIPTION = `
IDS Time Picker — Angular 21 standalone (\`storybook-angular\`, port **6007**).

**Spec:** \`components/ids/time-picker/design-spec.md\`  
**Family map:** \`components/ids/date-and-time-picker/design-spec.md\`  
**Contract defaults:** \`component-contracts/ids/time-picker.contract.ts\`  
**React parity:** \`lib/react/ids/time-picker\`

Import \`IDS_TIME_PICKER_IMPORTS\` from \`lib/angular/ids/time-picker\`.

Load \`components/ids-theme.css\` on the app root (\`data-design-system="ids"\`).
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

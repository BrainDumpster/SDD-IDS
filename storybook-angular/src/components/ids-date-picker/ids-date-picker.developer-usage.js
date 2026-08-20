/** Developer usage + Docs tab copy for IDS Date Picker (Angular). */

export const DATE_PICKER_DOCS_DESCRIPTION = `
IDS Date Picker — Angular 21 standalone (\`storybook-angular\`, port **6007**).

**Spec:** \`components/ids/date-picker/design-spec.md\`  
**Contract defaults:** \`component-contracts/ids/date-picker.contract.ts\`  
**React parity:** \`lib/react/ids/date-picker\`

Import \`IDS_DATE_PICKER_IMPORTS\` from \`lib/angular/ids/date-picker\`.

Load \`components/ids-theme.css\` on the app root (\`data-design-system="ids"\`).
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

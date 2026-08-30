/** Developer usage + Docs tab copy for IDS Checkbox (Angular). */

export const CHECKBOX_DOCS_DESCRIPTION = `
## Overview

Binary or indeterminate selection control with group composition and helper/error text.

## Props

### \`ids-checkbox\`

| Input | Type | Default |
|-------|------|---------|
| \`label\` | \`string\` | \`CHECKBOX_SPEC_ACCURATE_DEFAULTS.l…\` |
| \`showLabel\` | \`—\` | \`CHECKBOX_SPEC_ACCURATE_DEFAULTS.s…\` |
| \`simulateFocusVisible\` | \`—\` | \`CHECKBOX_SPEC_ACCURATE_DEFAULTS.s…\` |
| \`defaultChecked\` | \`—\` | \`CHECKBOX_SPEC_ACCURATE_DEFAULTS.c…\` |
| \`disabled\` | \`—\` | \`CHECKBOX_SPEC_ACCURATE_DEFAULTS.d…\` |
| \`error\` | \`—\` | \`CHECKBOX_SPEC_ACCURATE_DEFAULTS.e…\` |
| \`density\` | \`CheckboxDensity\` | \`"default"\` |

### \`ids-checkbox-group\`

| Input | Type | Default |
|-------|------|---------|
| \`disabled\` | \`—\` | \`CHECKBOX_GROUP_SPEC_ACCURATE_DEFA…\` |
| \`orientation\` | \`CheckboxGroupOrientation\` | \`CHECKBOX_GROUP_SPEC_ACCURATE_DEFA…\` |

## Events

| Output | On | Payload |
|--------|----|---------|
| \`checkedChange\` | \`ids-checkbox\` | \`boolean\` |

## API

Import \`IDS_CHECKBOX_IMPORTS\` from the component imports barrel (compiled \`lib/angular/ids/checkbox\`).

\`\`\`ts
import { IDS_CHECKBOX_IMPORTS } from "@ids/angular/checkbox";
\`\`\`
`.trim();

export const CHECKBOX_SOURCE_CODE = `import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideZoneChangeDetection } from "@angular/core";
import { IDS_CHECKBOX_IMPORTS } from "./ids-checkbox/ids-checkbox.imports";
import { CHECKBOX_SPEC_ACCURATE_DEFAULTS } from "@component-contracts/ids/checkbox.contract";

@Component({
  standalone: true,
  imports: [...IDS_CHECKBOX_IMPORTS],
  template: \`
    <ids-checkbox-group>
      <ids-checkbox
        [label]="label"
        [checked]="checked"
        (checkedChange)="checked = $event"
      />
    </ids-checkbox-group>
  \`,
})
export class AppComponent {
  label = CHECKBOX_SPEC_ACCURATE_DEFAULTS.label;
  checked = CHECKBOX_SPEC_ACCURATE_DEFAULTS.checked;
}

bootstrapApplication(AppComponent, {
  providers: [provideZoneChangeDetection()],
});`;

export const CHECKBOX_STORY_SOURCE_CODE = `<ids-checkbox-group>
  <ids-checkbox label="Accept terms and conditions" />
</ids-checkbox-group>`;

export const CHECKBOX_COMPOSITION_DEMO_TEMPLATE = `
<ids-checkbox-group>
  <ids-checkbox
    [label]="label"
    [checked]="state.checked"
    [indeterminate]="state.indeterminate"
    [disabled]="disabled"
    [error]="error"
    [helperText]="helperText"
    (checkedChange)="onCheckedChange($event)"
  />
</ids-checkbox-group>`;

export const CHECKBOX_GROUP_DEMO_TEMPLATE = `<ids-checkbox-group>
  <ids-checkbox label="Email notifications" helperText="Receive weekly summary updates." />
  <ids-checkbox label="SMS alerts" [checked]="true" />
  <ids-checkbox label="Push notifications" />
</ids-checkbox-group>`;

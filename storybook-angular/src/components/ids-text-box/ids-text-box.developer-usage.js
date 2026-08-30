/** Developer usage + Docs tab copy for IDS Text Box (Angular). */

export const TEXT_BOX_DOCS_DESCRIPTION = `
## Overview

Text input with label, helper, and error composition support.

## Props

### \`ids-text-box\`

| Input | Type | Default |
|-------|------|---------|
| \`componentType\` | \`TextBoxComponentType\` | \`TEXT_BOX_SPEC_ACCURATE_DEFAULTS.c…\` |
| \`size\` | \`TextBoxSize\` | \`TEXT_BOX_SPEC_ACCURATE_DEFAULTS.size\` |
| \`state\` | \`TextBoxState\` | \`TEXT_BOX_SPEC_ACCURATE_DEFAULTS.s…\` |
| \`placeholder\` | \`string\` | \`TEXT_BOX_SPEC_ACCURATE_DEFAULTS.p…\` |
| \`defaultValue\` | \`—\` | \`""\` |
| \`disabled\` | \`boolean\` | \`TEXT_BOX_SPEC_ACCURATE_DEFAULTS.d…\` |
| \`invalid\` | \`boolean\` | \`TEXT_BOX_SPEC_ACCURATE_DEFAULTS.i…\` |
| \`helperText\` | \`—\` | \`TEXT_BOX_SPEC_ACCURATE_DEFAULTS.h…\` |
| \`errorText\` | \`—\` | \`TEXT_BOX_SPEC_ACCURATE_DEFAULTS.e…\` |
| \`showHelperText\` | \`boolean\` | \`TEXT_BOX_SPEC_ACCURATE_DEFAULTS.s…\` |
| \`showIcon\` | \`boolean\` | \`TEXT_BOX_SPEC_ACCURATE_DEFAULTS.s…\` |
| \`iconName\` | \`—\` | \`TEXT_BOX_SPEC_ACCURATE_DEFAULTS.i…\` |
| \`rows\` | \`—\` | \`TEXT_BOX_SPEC_ACCURATE_DEFAULTS.rows\` |
| \`inputType\` | \`string\` | \`TEXT_BOX_SPEC_ACCURATE_DEFAULTS.i…\` |

## Events

| Output | On | Payload |
|--------|----|---------|
| \`valueChange\` | \`ids-text-box\` | \`string\` |

## API

Import \`IDS_TEXT_BOX_IMPORTS\` from the component imports barrel (compiled \`lib/angular/ids/text-box\`).

\`\`\`ts
import { IDS_TEXT_BOX_IMPORTS } from "@ids/angular/text-box";
\`\`\`
`.trim();

export const TEXT_BOX_SOURCE_CODE = `import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideZoneChangeDetection } from "@angular/core";
import { IDS_TEXT_BOX_IMPORTS } from "./ids-text-box/ids-text-box.imports";
import { TEXT_BOX_SPEC_ACCURATE_DEFAULTS } from "@component-contracts/ids/text-box.contract";

@Component({
  standalone: true,
  imports: [...IDS_TEXT_BOX_IMPORTS],
  template: \`
    <ids-text-box
      [componentType]="componentType"
      [size]="size"
      [placeholder]="placeholder"
      [helperText]="helperText"
      [showIcon]="showIcon"
      [showHelperText]="showHelperText"
      (valueChange)="onValueChange($event)"
    />
  \`,
})
export class AppComponent {
  readonly componentType = TEXT_BOX_SPEC_ACCURATE_DEFAULTS.componentType;
  readonly size = TEXT_BOX_SPEC_ACCURATE_DEFAULTS.size;
  readonly placeholder = TEXT_BOX_SPEC_ACCURATE_DEFAULTS.placeholder;
  readonly helperText = TEXT_BOX_SPEC_ACCURATE_DEFAULTS.helperText;
  readonly showIcon = TEXT_BOX_SPEC_ACCURATE_DEFAULTS.showIcon;
  readonly showHelperText = TEXT_BOX_SPEC_ACCURATE_DEFAULTS.showHelperText;

  onValueChange(value: string): void {
    console.log("valueChange", value);
  }
}

bootstrapApplication(AppComponent, {
  providers: [provideZoneChangeDetection()],
});`;

export const TEXT_BOX_STORY_SOURCE_CODE = `<ids-text-box
  componentType="text-input"
  size="large"
  placeholder="Placeholder Text"
  helperText="Helper text"
  [showIcon]="true"
  [showHelperText]="true"
/>`;

export const TEXT_BOX_COMPOSITION_DEMO_TEMPLATE = `
<ids-text-box
  [componentType]="componentType"
  [size]="size"
  [state]="state"
  [placeholder]="placeholder"
  [value]="state.value"
  [disabled]="disabled"
  [invalid]="invalid"
  [helperText]="helperText"
  [errorText]="errorText"
  [showHelperText]="showHelperText"
  [showIcon]="showIcon"
  [iconName]="iconName"
  (valueChange)="onValueChange($event)"
/>
`.trim();

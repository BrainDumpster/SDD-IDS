/** Developer usage + Docs tab copy for IDS Radio Button (Angular). */

export const RADIO_BUTTON_DOCS_DESCRIPTION = `
## Overview

Single-choice selection within a radio group.

## Props

### \`ids-radio-button\`

| Input | Type | Default |
|-------|------|---------|
| \`value\` | \`string\` | required |
| \`label\` | \`string\` | required |
| \`disabled\` | \`boolean\` | \`false\` |
| \`error\` | \`boolean\` | \`false\` |
| \`helperText\` | \`string\` | — |
| \`simulatedState\` | \`"default" \\| "hover" \\| "focus-visible"\` | docs only |

### \`ids-radio-button-group\`

| Input | Type | Default |
|-------|------|---------|
| \`name\` | \`string\` | required shared group name |
| \`value\` / \`defaultValue\` | \`string\` | controlled / uncontrolled selection |
| \`label\` | \`string\` | — |
| \`showLabel\` | \`boolean\` | \`true\` |
| \`ariaLabel\` | \`string\` | — |
| \`labelPosition\` | \`"left" \\| "top"\` | \`"left"\` |
| \`required\` | \`boolean\` | \`false\` |
| \`labelIcon\` | truthy | shows form-label info icon |
| \`error\` / \`errorText\` | \`boolean\` / \`string\` | group validation |
| \`orientation\` | \`"vertical" \\| "horizontal"\` | \`"vertical"\` |
| \`disabled\` | \`boolean\` | cascades to children |

## Events

| Output | On | Payload |
|--------|----|---------|
| \`valueChange\` | \`ids-radio-button-group\` | \`string\` |

## API

Import \`IDS_RADIO_BUTTON_IMPORTS\` from the component imports barrel (compiled \`lib/angular/ids/radio-button\`).

\`\`\`ts
import { IDS_RADIO_BUTTON_IMPORTS } from "@ids/angular/radio-button";
\`\`\`
`.trim();

export const RADIO_BUTTON_SOURCE_CODE = `import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideZoneChangeDetection } from "@angular/core";
import { IDS_RADIO_BUTTON_IMPORTS } from "./ids-radio-button/ids-radio-button.imports";
import { RADIO_BUTTON_SPEC_ACCURATE_DEFAULTS } from "@component-contracts/ids/radio-button.contract";

@Component({
  standalone: true,
  imports: [...IDS_RADIO_BUTTON_IMPORTS],
  template: \`
    <ids-radio-button-group
      [name]="name"
      [value]="value"
      label="Radio Group:"
      labelPosition="left"
      (valueChange)="value = $event"
    >
      <ids-radio-button value="option1" label="Option 1" />
      <ids-radio-button value="option2" label="Option 2" />
      <ids-radio-button value="option3" label="Option 3" />
    </ids-radio-button-group>
  \`,
})
export class AppComponent {
  readonly name = RADIO_BUTTON_SPEC_ACCURATE_DEFAULTS.name;
  value = RADIO_BUTTON_SPEC_ACCURATE_DEFAULTS.defaultValue;
}

bootstrapApplication(AppComponent, {
  providers: [provideZoneChangeDetection()],
});`;

export const RADIO_BUTTON_STORY_SOURCE_CODE = `<ids-radio-button-group
  name="ids-radio-default"
  defaultValue="option1"
  label="Radio Group:"
  labelPosition="left"
>
  <ids-radio-button value="option1" label="Option 1" />
  <ids-radio-button value="option2" label="Option 2" />
  <ids-radio-button value="option3" label="Option 3" />
</ids-radio-button-group>`;

export const RADIO_BUTTON_COMPOSITION_DEMO_TEMPLATE = `
<ids-radio-button-group
  [name]="name"
  [value]="state.value"
  [disabled]="disabled"
  [orientation]="orientation"
  [label]="label"
  [labelPosition]="labelPosition"
  [required]="required"
  [labelIcon]="labelIcon"
  [error]="error"
  [errorText]="errorText"
  (valueChange)="onValueChange($event)"
>
  <ids-radio-button value="option1" label="Option 1" />
  <ids-radio-button value="option2" label="Option 2" />
  <ids-radio-button value="option3" label="Option 3" />
</ids-radio-button-group>`;

export const RADIO_BUTTON_GROUP_DEMO_TEMPLATE = `<ids-radio-button-group
  name="ids-radio-group-demo"
  defaultValue="email"
  label="Notifications:"
  labelPosition="left"
  orientation="vertical"
>
  <ids-radio-button value="email" label="Email"></ids-radio-button>
  <ids-radio-button value="sms" label="SMS"></ids-radio-button>
  <ids-radio-button value="push" label="Push notification"></ids-radio-button>
</ids-radio-button-group>`;

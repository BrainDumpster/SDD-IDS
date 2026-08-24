/** Developer usage + Docs tab copy for IDS Radio Button (Angular). */

export const RADIO_BUTTON_DOCS_DESCRIPTION = `
IDS Radio Button — Angular 21 standalone **composition** API (\`storybook-angular\`, port **6007**).

**Spec:** \`components/ids/radio-button/design-spec.md\`  
**Contract defaults:** \`component-contracts/ids/radio-button.contract.ts\`

### Anatomy (deterministic child order)

\`\`\`
ids-radio-button-group [name, value?, defaultValue?, disabled?, orientation?]
  ids-radio-button [value, label, disabled?, error?, helperText?, simulatedState?]
  ids-radio-button …
\`\`\`

Import \`IDS_RADIO_BUTTON_IMPORTS\` from \`ids-radio-button.imports.ts\`.

### Group API

| Input | Default | Notes |
|-------|---------|-------|
| \`name\` | — | **Required** shared group id for single-selection |
| \`value\` | — | Controlled selected value |
| \`defaultValue\` | \`option1\` | Uncontrolled initial selection |
| \`disabled\` | \`false\` | Disables entire group |
| \`orientation\` | \`vertical\` | \`vertical\` \| \`horizontal\` |

| Output | Notes |
|--------|-------|
| \`valueChange\` | Emits newly selected \`value\` |

### Item API (\`ids-radio-button\`)

| Input | Required | Notes |
|-------|----------|-------|
| \`value\` | Yes | Unique value within the group |
| \`label\` | Yes | Visible label |
| \`disabled\` | No | Per-option disable (merged with group) |
| \`error\` | No | Strong border + critical assistive text |
| \`helperText\` | No | Helper or error line |
| \`simulatedState\` | No | Storybook only: \`hover\` \| \`focus-visible\` |

\`ids-radio-button\` must be projected inside \`ids-radio-button-group\`.

Load \`components/ids-theme.css\` on the app root (\`data-design-system="ids"\`).
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

export const RADIO_BUTTON_STORY_SOURCE_CODE = `<ids-radio-button-group name="ids-radio-default" defaultValue="option1">
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
  (valueChange)="onValueChange($event)"
>
  <ids-radio-button value="option1" label="Option 1" />
  <ids-radio-button value="option2" label="Option 2" />
  <ids-radio-button value="option3" label="Option 3" />
</ids-radio-button-group>`;

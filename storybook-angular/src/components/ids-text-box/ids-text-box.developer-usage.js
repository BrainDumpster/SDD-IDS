/** Developer usage + Docs tab copy for IDS Text Box (Angular). */

export const TEXT_BOX_DOCS_DESCRIPTION = `
IDS Text Box — Angular 21 standalone (\`storybook-angular\`, port **6007**).

**Spec:** \`components/ids/text-box/design-spec.md\`  
**Contract defaults:** \`component-contracts/ids/text-box.contract.ts\`

### Anatomy (deterministic slot order)

\`\`\`
ids-text-box [componentType, size, placeholder?, value?, helperText?, …]
  TextBoxControl
    input | textarea
    ids-icon?              ← optional trailing suffix icon (default mail)
  helper/error row?
\`\`\`

Import \`IDS_TEXT_BOX_IMPORTS\` from \`ids-text-box.imports.ts\`.

### API

| Input | Default | Notes |
|-------|---------|-------|
| \`componentType\` | \`text-input\` | \`text-input\` \| \`text-area\` |
| \`size\` | \`large\` | \`large\` (40px) \| \`small\` (32px); small applies to text-input only |
| \`state\` | \`default\` | Demo override: \`hover\` \| \`selected\` \| \`focus\` \| \`error\` |
| \`placeholder\` | \`Placeholder Text\` | Empty-state hint |
| \`value\` | — | Controlled value |
| \`defaultValue\` | \`""\` | Uncontrolled initial value |
| \`disabled\` | \`false\` | Disables editing and applies disabled visuals |
| \`invalid\` | \`false\` | Activates error helper row |
| \`helperText\` | \`Helper text\` | Neutral assistive copy |
| \`errorText\` | \`Error message\` | Shown when \`invalid\` or \`state="error"\` |
| \`showHelperText\` | \`true\` | Suppresses helper/error row when \`false\` |
| \`showIcon\` | \`true\` | Trailing suffix icon |
| \`iconName\` | \`mail\` | Icon slug from \`assets/icons/\` |
| \`rows\` | \`4\` | Text-area row count |
| \`inputType\` | \`text\` | Native input \`type\` (text-input only) |

| Output | Notes |
|--------|-------|
| \`valueChange\` | Emits on every text change |

**Focus behavior:** pointer focus (click inside) shows active brand border only; keyboard \`Tab\` focus shows accessible border + outer focus ring (\`var(--text-box-focus-ring-radius)\`).

Load \`components/ids-theme.css\` on the app root (\`data-design-system="ids"\`).
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

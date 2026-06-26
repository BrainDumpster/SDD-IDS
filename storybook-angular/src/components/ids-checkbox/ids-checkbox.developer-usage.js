/** Developer usage + Docs tab copy for IDS Checkbox (Angular). */

export const CHECKBOX_DOCS_DESCRIPTION = `
IDS Checkbox — Angular 21 standalone **composition** API (\`storybook-angular\`, port **6007**).

**Spec:** \`components/ids/checkbox/design-spec.md\`  
**Contract defaults:** \`component-contracts/ids/checkbox.contract.ts\`

### Anatomy (deterministic child order)

\`\`\`
ids-checkbox-group [orientation?, disabled?, name?, idPrefix?]
  ids-checkbox [label, checked?, defaultChecked?, indeterminate?, disabled?, error?, helperText?]
  ids-checkbox …
\`\`\`

Import \`IDS_CHECKBOX_IMPORTS\` from \`ids-checkbox.imports.ts\`.

### Group API

| Input | Default | Notes |
|-------|---------|-------|
| \`orientation\` | \`vertical\` | \`vertical\` \| \`horizontal\` — \`spacing-space-16\` / \`spacing-space-8\` gap |
| \`disabled\` | \`false\` | Cascades to all child checkboxes |
| \`name\` | — | Optional shared form name |
| \`idPrefix\` | — | Optional id prefix for child controls |

### Item API (\`ids-checkbox\`)

| Input | Default | Notes |
|-------|---------|-------|
| \`label\` | — | **Required** visible, associated text |
| \`checked\` | — | Controlled selection state |
| \`defaultChecked\` | \`false\` | Uncontrolled initial value |
| \`indeterminate\` | \`false\` | Partial / mixed visual |
| \`disabled\` | \`false\` | Item-level disable (merged with group) |
| \`error\` | \`false\` | Validation styling on assistive text |
| \`helperText\` | — | Secondary or error message |
| \`simulateFocusVisible\` | \`false\` | Storybook/demo only |

| Output | Notes |
|--------|-------|
| \`checkedChange\` | Emits resolved boolean after toggle |

Standalone \`ids-checkbox\` (outside a group) remains supported for single-control demos.

Load \`components/ids-theme.css\` on the app root (\`data-design-system="ids"\`).
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

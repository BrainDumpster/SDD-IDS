/** Developer usage + Docs tab copy for IDS Toggle Switch (Angular). */

export const TOGGLE_SWITCH_DOCS_DESCRIPTION = `
IDS Toggle Switch — Angular 21 standalone **composition** API (\`storybook-angular\`, port **6007**).

**Spec:** \`components/ids/toggle-switch/design-spec.md\`  
**Contract defaults:** \`component-contracts/ids/toggle-switch.contract.ts\`

### Anatomy (deterministic child order)

\`\`\`
ids-toggle-switch [checked?, defaultChecked?, disabled?, label?, id?, name?, value?, className?, ariaLabel?, ariaDescribedBy?]
  ids-toggle-switch-input
  ids-toggle-switch-track
  ids-toggle-switch-thumb
  ids-toggle-switch-label
  ids-toggle-switch-assistive-text
\`\`\`

Import \`IDS_TOGGLE_SWITCH_IMPORTS\` from \`lib/angular/ids/toggle-switch\`.

### Root API (\`ids-toggle-switch\`)

| Input | Default | Notes |
|-------|---------|-------|
| \`checked\` | — | Controlled on/off value |
| \`defaultChecked\` | \`false\` | Uncontrolled initial value |
| \`disabled\` | \`false\` | Blocks pointer and keyboard toggles |
| \`label\` | — | Visible label when \`ids-toggle-switch-label\` is omitted |
| \`id\` | generated | Native input id / label association |
| \`name\` | — | Form integration |
| \`value\` | — | Form integration |
| \`className\` | — | Extra class on the root host |
| \`ariaLabel\` | — | Required accessible name when visible label is absent |
| \`ariaDescribedBy\` | — | Optional description id |

| Output | Notes |
|--------|-------|
| \`onCheckedChange\` | Emits resolved boolean after a successful toggle |

Load \`components/ids-theme.css\` on the app root (\`data-design-system="ids"\`).
`.trim();

export const TOGGLE_SWITCH_SOURCE_CODE = `import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideZoneChangeDetection } from "@angular/core";
import { IDS_TOGGLE_SWITCH_IMPORTS } from "./toggle-switch";
import { TOGGLE_SWITCH_SPEC_ACCURATE_DEFAULTS } from "@component-contracts/ids/toggle-switch.contract";

@Component({
  standalone: true,
  imports: [...IDS_TOGGLE_SWITCH_IMPORTS],
  template: \`
    <ids-toggle-switch
      [checked]="checked"
      (onCheckedChange)="checked = $event"
    >
      <ids-toggle-switch-input />
      <ids-toggle-switch-track />
      <ids-toggle-switch-thumb />
      <ids-toggle-switch-label>{{ label }}</ids-toggle-switch-label>
    </ids-toggle-switch>
  \`,
})
export class AppComponent {
  label = TOGGLE_SWITCH_SPEC_ACCURATE_DEFAULTS.label;
  checked = TOGGLE_SWITCH_SPEC_ACCURATE_DEFAULTS.checked;
}

bootstrapApplication(AppComponent, {
  providers: [provideZoneChangeDetection()],
});`;

export const TOGGLE_SWITCH_STORY_SOURCE_CODE = `<ids-toggle-switch>
  <ids-toggle-switch-input />
  <ids-toggle-switch-track />
  <ids-toggle-switch-thumb />
  <ids-toggle-switch-label>Enable alerts</ids-toggle-switch-label>
</ids-toggle-switch>`;

export const TOGGLE_SWITCH_COMPOSITION_DEMO_TEMPLATE = `
<ids-toggle-switch
  [checked]="state.checked"
  [disabled]="disabled"
  [id]="id"
  [name]="name"
  [value]="value"
  [className]="className"
  [ariaLabel]="ariaLabel"
  [ariaDescribedBy]="ariaDescribedBy"
  (onCheckedChange)="onToggle($event)"
>
  <ids-toggle-switch-input />
  <ids-toggle-switch-track />
  <ids-toggle-switch-thumb />
  <ids-toggle-switch-label>{{ label }}</ids-toggle-switch-label>
</ids-toggle-switch>`;

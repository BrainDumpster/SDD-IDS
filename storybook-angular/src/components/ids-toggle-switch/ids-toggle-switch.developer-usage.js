/** Developer usage + Docs tab copy for IDS Toggle Switch (Angular). */

export const TOGGLE_SWITCH_DOCS_DESCRIPTION = `
## Overview

Binary on/off switch control.

## Props

### \`ids-toggle-switch\`

| Input | Type | Default |
|-------|------|---------|
| \`defaultChecked\` | \`—\` | \`TOGGLE_SWITCH_SPEC_ACCURATE_DEFAU…\` |
| \`disabled\` | \`—\` | \`TOGGLE_SWITCH_SPEC_ACCURATE_DEFAU…\` |

## Events

| Output | On | Payload |
|--------|----|---------|
| \`onCheckedChange\` | \`ids-toggle-switch\` | \`boolean\` |

## API

Import \`IDS_TOGGLE_SWITCH_IMPORTS\` from the component imports barrel (compiled \`lib/angular/ids/toggle-switch\`).

\`\`\`ts
import { IDS_TOGGLE_SWITCH_IMPORTS } from "@ids/angular/toggle-switch";
\`\`\`
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

/** Developer usage + Docs tab copy for IDS Progress Bar (Angular). */

export const PROGRESS_BAR_DOCS_DESCRIPTION = `
## Overview

Determinate or indeterminate progress indicator with optional label.

## Props

### \`ids-progress-bar\`

| Input | Type | Default |
|-------|------|---------|
| \`value\` | \`number \\| string\` | \`PROGRESS_BAR_RUNTIME_DEFAULTS.value\` |
| \`showHelperText\` | \`boolean \\| string\` | \`PROGRESS_BAR_RUNTIME_DEFAULTS.sho…\` |
| \`type\` | \`IdsProgressBarType \\| string\` | \`PROGRESS_BAR_RUNTIME_DEFAULTS.type\` |
| \`thickness\` | \`IdsProgressBarThickness \\| string\` | \`PROGRESS_BAR_RUNTIME_DEFAULTS.thi…\` |
| \`state\` | \`IdsProgressBarState \\| string\` | \`PROGRESS_BAR_RUNTIME_DEFAULTS.state\` |

## Events

No dedicated \`@Output()\` events beyond standard DOM handlers.

## API

Import \`IDS_PROGRESS_BAR_IMPORTS\` from the component imports barrel (compiled \`lib/angular/ids/progress-bar\`).

\`\`\`ts
import { IDS_PROGRESS_BAR_IMPORTS } from "@ids/angular/progress-bar";
\`\`\`
`.trim();

export const PROGRESS_BAR_SOURCE_CODE = `import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideZoneChangeDetection } from "@angular/core";
import { IDS_PROGRESS_BAR_IMPORTS } from "./progress-bar";
import { PROGRESS_BAR_SPEC_ACCURATE_DEFAULTS } from "@component-contracts/ids/progress-bar.contract";

@Component({
  standalone: true,
  imports: [...IDS_PROGRESS_BAR_IMPORTS],
  template: \`
    <ids-progress-bar
      [value]="value"
      [label]="label"
      [type]="type"
      [thickness]="thickness"
      [state]="state"
      [showHelperText]="showHelperText"
      [helperText]="helperText"
    ></ids-progress-bar>
  \`,
})
export class AppComponent {
  value = PROGRESS_BAR_SPEC_ACCURATE_DEFAULTS.value;
  label = PROGRESS_BAR_SPEC_ACCURATE_DEFAULTS.label;
  type = PROGRESS_BAR_SPEC_ACCURATE_DEFAULTS.type;
  thickness = PROGRESS_BAR_SPEC_ACCURATE_DEFAULTS.thickness;
  state = PROGRESS_BAR_SPEC_ACCURATE_DEFAULTS.state;
  showHelperText = PROGRESS_BAR_SPEC_ACCURATE_DEFAULTS.showHelperText;
  helperText = PROGRESS_BAR_SPEC_ACCURATE_DEFAULTS.helperText;
}

bootstrapApplication(AppComponent, {
  providers: [provideZoneChangeDetection()],
});`;

export const PROGRESS_BAR_STORY_SOURCE_CODE = `<ids-progress-bar
  [value]="30"
  label="Label"
  type="with-label"
  thickness="medium"
  state="in-progress"
  [showHelperText]="true"
  helperText="Helper text (time estimate)"
></ids-progress-bar>`;

/** Resizable frame — width 100%, no max-width cap (design-spec); drag to verify min-widths. */
export const PROGRESS_BAR_FRAME_TEMPLATE = `
<div style="width: 320px; max-width: 100%; box-sizing: border-box; resize: horizontal; overflow: auto; border: 1px dashed var(--color-border-gray-neutral-base); padding: 8px;">
  <ids-progress-bar
    [value]="value"
    [label]="label"
    [type]="type"
    [thickness]="thickness"
    [state]="state"
    [showHelperText]="showHelperText"
    [helperText]="helperText"
  ></ids-progress-bar>
</div>
`.trim();

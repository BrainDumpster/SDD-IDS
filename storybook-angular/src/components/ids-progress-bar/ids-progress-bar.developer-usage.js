/** Developer usage + Docs tab copy for IDS Progress Bar (Angular). */

export const PROGRESS_BAR_DOCS_DESCRIPTION = `
IDS Progress Bar — Angular standalone API (\`storybook-angular\`).

**Spec:** \`components/ids/progress-bar/design-spec.md\`  
**Contract defaults:** \`component-contracts/ids/progress-bar.contract.ts\`  
**React parity:** \`lib/react/ids/progress-bar\`

### Anatomy (deterministic slot order)

\`\`\`
ids-progress-bar [value, label, helperText, showHelperText, type, thickness, state]
  ProgressMetaRow?          (with-label: label + %)
  ProgressTrackRow          (track ± inline %)
    ProgressTrack / trackBg / ProgressIndicator
  ProgressHelperRow?        (status icon + helper text)
\`\`\`

Import \`IDS_PROGRESS_BAR_IMPORTS\` from \`lib/angular/ids/progress-bar\`. Load \`components/ids-theme.css\` on the app root (\`data-design-system="ids"\`).
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
  thickness="thin"
  state="in-progress"
  [showHelperText]="true"
  helperText="Helper text (time estimate)"
></ids-progress-bar>`;

export const PROGRESS_BAR_FRAME_TEMPLATE = `
<div style="max-width: 300px; width: 100%;">
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

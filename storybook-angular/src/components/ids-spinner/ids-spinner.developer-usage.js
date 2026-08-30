/** Developer usage + Docs tab copy for IDS Spinner (Angular). */

export const SPINNER_DOCS_DESCRIPTION = `
## Overview

Loading indicator for in-progress operations.

## Props

### \`ids-spinner\`

| Input | Type | Default |
|-------|------|---------|
| \`size\` | \`IdsSpinnerSize \\| string\` | \`SPINNER_RUNTIME_DEFAULTS.size\` |
| \`mode\` | \`IdsSpinnerMode \\| string\` | \`SPINNER_RUNTIME_DEFAULTS.mode\` |
| \`label\` | \`string\` | \`SPINNER_RUNTIME_DEFAULTS.label\` |
| \`labelVisibility\` | \`IdsSpinnerLabelVisibility \\| string\` | \`SPINNER_RUNTIME_DEFAULTS.labelVis...\` |
| \`ariaLive\` | \`IdsSpinnerAriaLive \\| string\` | \`SPINNER_RUNTIME_DEFAULTS.ariaLive\` |
| \`tabIndex\` | \`number \\| string \\| null \\| undefined\` | - |

## Events

No dedicated \`@Output()\` events beyond standard DOM handlers.

## API

Import from \`@ids/angular/spinner\` (or the component imports barrel).

\`\`\`ts
import { IdsSpinnerComponent } from "@ids/angular/spinner";
\`\`\`
`.trim();

export const SPINNER_SOURCE_CODE = `import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideZoneChangeDetection } from "@angular/core";
import { IdsSpinnerComponent } from "@ids/angular/spinner";

@Component({
  standalone: true,
  imports: [IdsSpinnerComponent],
  template: \`<ids-spinner></ids-spinner>\`,
})
export class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: [provideZoneChangeDetection()],
});`;

export const SPINNER_STORY_SOURCE_CODE = `<ids-spinner></ids-spinner>`;

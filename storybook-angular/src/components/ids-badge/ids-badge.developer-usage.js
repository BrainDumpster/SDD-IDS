/** Developer usage + Docs tab copy for IDS Badge (Angular). */

export const BADGE_DOCS_DESCRIPTION = `
## Overview

Compact numeric or status indicator for counts and severity cues.

## Props

### \`ids-badge\`

| Input | Type | Default |
|-------|------|---------|
| \`value\` | \`string \\| number\` | \`BADGE_SPEC_ACCURATE_DEFAULTS.value\` |
| \`type\` | \`BadgeType\` | \`BADGE_SPEC_ACCURATE_DEFAULTS.type\` |

## Events

No dedicated \`@Output()\` events beyond standard DOM handlers.

## API

Import from \`@ids/angular/badge\` (or the component imports barrel).

\`\`\`ts
import { IdsBadgeComponent } from "@ids/angular/badge";
\`\`\`
`.trim();

export const BADGE_SOURCE_CODE = `import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideZoneChangeDetection } from "@angular/core";
import { IdsBadgeComponent } from "@ids/angular/badge";

@Component({
  standalone: true,
  imports: [IdsBadgeComponent],
  template: \`<ids-badge></ids-badge>\`,
})
export class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: [provideZoneChangeDetection()],
});`;

export const BADGE_STORY_SOURCE_CODE = `<ids-badge></ids-badge>`;

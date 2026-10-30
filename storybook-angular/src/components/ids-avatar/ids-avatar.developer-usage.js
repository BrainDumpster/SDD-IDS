/** Developer usage + Docs tab copy for IDS Avatar (Angular). */

export const AVATAR_DOCS_DESCRIPTION = `
## Overview

User or entity avatar with initials / image variants.

## Props

### \`ids-avatar\`

| Input | Type | Default |
|-------|------|---------|
| \`imageAlt\` | \`string\` | \`AVATAR_SPEC_ACCURATE_DEFAULTS.ima...\` |
| \`size\` | \`number \\| string\` | \`AVATAR_SPEC_ACCURATE_DEFAULTS.size\` |
| \`iconSize\` | \`number \\| string\` | \`AVATAR_SPEC_ACCURATE_DEFAULTS.ico...\` |

## Events

No dedicated \`@Output()\` events beyond standard DOM handlers.

## API

Import from \`@ids/angular/avatar\` (or the component imports barrel).

\`\`\`ts
import { IdsAvatarComponent } from "@ids/angular/avatar";
\`\`\`
`.trim();

export const AVATAR_SOURCE_CODE = `import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideZoneChangeDetection } from "@angular/core";
import { IdsAvatarComponent } from "@ids/angular/avatar";

@Component({
  standalone: true,
  imports: [IdsAvatarComponent],
  template: \`<ids-avatar></ids-avatar>\`,
})
export class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: [provideZoneChangeDetection()],
});`;

export const AVATAR_STORY_SOURCE_CODE = `<ids-avatar></ids-avatar>`;

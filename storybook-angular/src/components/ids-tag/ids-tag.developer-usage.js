/** Developer usage + Docs tab copy for IDS Tag (Angular). */

export const TAG_DOCS_DESCRIPTION = `
## Overview

Compact label chip for categories, filters, or metadata.

## Props

### \`ids-tag\`

| Input | Type | Default |
|-------|------|---------|
| \`label\` | \`-\` | \`TAG_SPEC_ACCURATE_DEFAULTS.label\` |
| \`tone\` | \`TagTone\` | \`TAG_SPEC_ACCURATE_DEFAULTS.tone\` |
| \`type\` | \`TagType\` | \`TAG_SPEC_ACCURATE_DEFAULTS.type\` |
| \`size\` | \`TagSize\` | \`TAG_SPEC_ACCURATE_DEFAULTS.size\` |
| \`selected\` | \`boolean \\| undefined\` | \`TAG_SPEC_ACCURATE_DEFAULTS.selected\` |
| \`disabled\` | \`-\` | \`TAG_SPEC_ACCURATE_DEFAULTS.disabled\` |
| \`error\` | \`-\` | \`TAG_SPEC_ACCURATE_DEFAULTS.error\` |
| \`focusVisible\` | \`-\` | \`TAG_SPEC_ACCURATE_DEFAULTS.focusV...\` |
| \`focusOnText\` | \`-\` | \`TAG_SPEC_ACCURATE_DEFAULTS.focusO...\` |
| \`demoHover\` | \`-\` | \`TAG_DEMO_HOVER_DEFAULT\` |
| \`showLabel\` | \`-\` | \`TAG_SPEC_ACCURATE_DEFAULTS.showLabel\` |
| \`labelPrefix\` | \`-\` | \`TAG_SPEC_ACCURATE_DEFAULTS.labelP...\` |
| \`leadingIconSlug\` | \`string \\| null\` | \`TAG_SPEC_ACCURATE_DEFAULTS.leadin...\` |
| \`closeIconSlug\` | \`-\` | \`TAG_SPEC_ACCURATE_DEFAULTS.closeI...\` |

### \`ids-tags\`

| Input | Type | Default |
|-------|------|---------|
| \`wrap\` | \`-\` | \`TAGS_GROUP_SPEC_ACCURATE_DEFAULTS...\` |
| \`ariaLabel\` | \`-\` | \`TAGS_GROUP_SPEC_ACCURATE_DEFAULTS...\` |

## Events

| Output | On | Payload |
|--------|----|---------|
| \`selectionChange\` | \`ids-tag\` | \`boolean\` |
| \`dismiss\` | \`ids-tag\` | \`void\` |
| \`tagClick\` | \`ids-tag\` | \`void\` |

## API

Import from \`@ids/angular/tag\` (or the component imports barrel).

\`\`\`ts
import { IdsTagComponent } from "@ids/angular/tag";
\`\`\`
`.trim();

export const TAG_SOURCE_CODE = `import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideZoneChangeDetection } from "@angular/core";
import { IdsTagComponent } from "@ids/angular/tag";

@Component({
  standalone: true,
  imports: [IdsTagComponent],
  template: \`<ids-tag></ids-tag>\`,
})
export class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: [provideZoneChangeDetection()],
});`;

export const TAG_STORY_SOURCE_CODE = `<ids-tag></ids-tag>`;

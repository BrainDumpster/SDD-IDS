/** Developer usage + Docs tab copy for IDS Link (Angular lib). */

export const LINK_DOCS_DESCRIPTION = `
## Overview

Text link control styled with IDS semantic tokens.

## Props

### \`ids-link\`

| Input | Type | Default |
|-------|------|---------|
| \`label\` | \`string\` | \`LINK_RUNTIME_DEFAULTS.label\` |
| \`type\` | \`IdsLinkType \\| string\` | \`LINK_RUNTIME_DEFAULTS.type\` |
| \`showExternalLinkIcon\` | \`—\` | \`LINK_RUNTIME_DEFAULTS.showExterna…\` |
| \`target\` | \`IdsLinkTarget\` | \`LINK_RUNTIME_DEFAULTS.target\` |
| \`disabled\` | \`—\` | \`LINK_RUNTIME_DEFAULTS.disabled\` |

## Events

| Output | On | Payload |
|--------|----|---------|
| \`clicked\` | \`ids-link\` | \`MouseEvent\` |

## API

Import \`IDS_LINK_IMPORTS\` from the component imports barrel (compiled \`lib/angular/ids/link\`).

\`\`\`ts
import { IDS_LINK_IMPORTS } from "@ids/angular/link";
\`\`\`
`.trim();

export const LINK_SOURCE_CODE = `import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideZoneChangeDetection } from "@angular/core";
import { IDS_LINK_IMPORTS } from "./link";
import { LINK_SPEC_ACCURATE_DEFAULTS } from "@component-contracts/ids/link.contract";

@Component({
  standalone: true,
  imports: [...IDS_LINK_IMPORTS],
  template: \`
    <ids-link
      [type]="type"
      [label]="label"
      [href]="href"
      [showExternalLinkIcon]="showExternalLinkIcon"
    ></ids-link>
  \`,
})
export class AppComponent {
  readonly type = LINK_SPEC_ACCURATE_DEFAULTS.type;
  readonly label = LINK_SPEC_ACCURATE_DEFAULTS.label;
  readonly href = LINK_SPEC_ACCURATE_DEFAULTS.href;
  readonly showExternalLinkIcon = LINK_SPEC_ACCURATE_DEFAULTS.showExternalLinkIcon;
}

bootstrapApplication(AppComponent, {
  providers: [provideZoneChangeDetection()],
});`;

export const LINK_STORY_SOURCE_CODE = `<ids-link
  type="standalone"
  label="This is a link"
  href="#"
></ids-link>`;

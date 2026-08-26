/** Developer usage + Docs tab copy for IDS Button (Angular, composition API). */

const DEMO_ICON = "settings-gear-detailed";

export const BUTTON_DOCS_DESCRIPTION = `
## Overview

Primary interactive control with variants, sizes, loading, and leading-icon projection.

## Props

### \`ids-button\`

| Input | Type | Default |
|-------|------|---------|
| \`variant\` | \`ButtonVariant\` | \`BUTTON_SPEC_ACCURATE_DEFAULTS.var…\` |
| \`size\` | \`ButtonSize\` | \`BUTTON_SPEC_ACCURATE_DEFAULTS.size\` |
| \`disabled\` | \`—\` | \`BUTTON_SPEC_ACCURATE_DEFAULTS.dis…\` |
| \`loading\` | \`—\` | \`BUTTON_SPEC_ACCURATE_DEFAULTS.loa…\` |
| \`iconOnly\` | \`boolean\` | \`BUTTON_SPEC_ACCURATE_DEFAULTS.ico…\` |
| \`ariaLabel\` | \`—\` | \`""\` |
| \`type\` | \`"button" \\| "submit" \\| "reset"\` | \`"button"\` |

## Events

| Output | On | Payload |
|--------|----|---------|
| \`clicked\` | \`ids-button\` | \`MouseEvent\` |

## API

Import \`IDS_BUTTON_IMPORTS\` from the component imports barrel (compiled \`lib/angular/ids/button\`).

\`\`\`ts
import { IDS_BUTTON_IMPORTS } from "@ids/angular/button";
\`\`\`
`.trim();

export const BUTTON_SOURCE_CODE = `import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideZoneChangeDetection } from "@angular/core";
import { IDS_BUTTON_IMPORTS } from "./ids-button/ids-button.imports";
import { BUTTON_SPEC_ACCURATE_DEFAULTS } from "@component-contracts/ids/button.contract";

@Component({
  standalone: true,
  imports: [...IDS_BUTTON_IMPORTS],
  template: \`
    <ids-button
      [variant]="variant"
      [size]="size"
      [disabled]="disabled"
      [loading]="loading"
    >
      <ids-icon shapeName="${DEMO_ICON}" variant="mask" />
      Button
    </ids-button>
  \`,
})
export class AppComponent {
  readonly variant = BUTTON_SPEC_ACCURATE_DEFAULTS.variant;
  readonly size = BUTTON_SPEC_ACCURATE_DEFAULTS.size;
  readonly disabled = BUTTON_SPEC_ACCURATE_DEFAULTS.disabled;
  readonly loading = BUTTON_SPEC_ACCURATE_DEFAULTS.loading;
}

bootstrapApplication(AppComponent, {
  providers: [provideZoneChangeDetection()],
});`;

export const BUTTON_STORY_SOURCE_CODE = `<ids-button variant="primary" size="lg">
  <ids-icon shapeName="${DEMO_ICON}" variant="mask" />
  Button
</ids-button>`;

export const BUTTON_COMPOSITION_DEMO_TEMPLATE = `
<ids-button
  [variant]="variant"
  [size]="size"
  [disabled]="disabled"
  [loading]="loading"
  [iconOnly]="iconOnly"
  [ariaLabel]="ariaLabel"
>
  @if (!iconOnly && variant !== 'destructive') {
    <ids-icon shapeName="${DEMO_ICON}" variant="mask" />
  }
  @if (!iconOnly) {
    Button
  } @else {
    <ids-icon shapeName="${DEMO_ICON}" variant="mask" />
  }
</ids-button>
`.trim();

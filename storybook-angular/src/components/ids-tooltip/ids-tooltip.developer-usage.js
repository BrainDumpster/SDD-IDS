/** Developer usage + Docs tab copy for IDS Tooltip (Angular, composition API). */

export const TOOLTIP_DOCS_DESCRIPTION = `
## Overview

Contextual hover/focus tip with optional title, body, arrow, and close.

## Props

### \`ids-tooltip\`

| Input | Type | Default |
|-------|------|---------|
| \`side\` | \`TooltipSide\` | \`TOOLTIP_API_DEFAULTS.side\` |
| \`arrowAlign\` | \`TooltipArrowAlign\` | \`TOOLTIP_API_DEFAULTS.arrowAlign\` |
| \`closable\` | \`—\` | \`TOOLTIP_API_DEFAULTS.closable\` |
| \`triggerDisplay\` | \`"inline" \\| "block"\` | \`TOOLTIP_API_DEFAULTS.triggerDisplay\` |
| \`hugContent\` | \`—\` | \`false\` |
| \`defaultOpen\` | \`—\` | \`false\` |
| \`closeIconShapeName\` | \`—\` | \`"ctrl-close-16"\` |

## Events

| Output | On | Payload |
|--------|----|---------|
| \`openChange\` | \`ids-tooltip\` | \`boolean\` |
| \`closed\` | \`ids-tooltip\` | \`TooltipCloseReason\` |

## API

Import \`IDS_TOOLTIP_IMPORTS\` from the component imports barrel (compiled \`lib/angular/ids/tooltip\`).

\`\`\`ts
import { IDS_TOOLTIP_IMPORTS } from "@ids/angular/tooltip";
\`\`\`
`.trim();

export const TOOLTIP_SOURCE_CODE = `import { Component } from "@angular/core";
import { provideZoneChangeDetection } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { IDS_TOOLTIP_IMPORTS } from "./tooltip";
import { TOOLTIP_SPEC_ACCURATE_DEFAULTS } from "@component-contracts/ids/tooltip.contract";

@Component({
  standalone: true,
  imports: [...IDS_TOOLTIP_IMPORTS],
  template: \`
    <ids-tooltip
      [side]="side"
      [arrowAlign]="arrowAlign"
      [closable]="closable"
    >
      <ids-tooltip-trigger>
        <ids-button variant="secondary" size="lg">Hover over me</ids-button>
      </ids-tooltip-trigger>
      <ids-tooltip-panel>
        <ids-tooltip-header>
          <ids-tooltip-title>{{ title }}</ids-tooltip-title>
        </ids-tooltip-header>
        <ids-tooltip-body>{{ content }}</ids-tooltip-body>
        @if (closable) {
          <ids-tooltip-close />
        }
        <ids-tooltip-arrow />
      </ids-tooltip-panel>
    </ids-tooltip>
  \`,
})
export class AppComponent {
  side = TOOLTIP_SPEC_ACCURATE_DEFAULTS.side;
  arrowAlign = TOOLTIP_SPEC_ACCURATE_DEFAULTS.arrowAlign;
  closable = TOOLTIP_SPEC_ACCURATE_DEFAULTS.closable;
  title = TOOLTIP_SPEC_ACCURATE_DEFAULTS.title;
  content = TOOLTIP_SPEC_ACCURATE_DEFAULTS.content;
}

bootstrapApplication(AppComponent, {
  providers: [provideZoneChangeDetection()],
});
`.trim();

export const TOOLTIP_STORY_SOURCE_CODE = `<ids-tooltip side="top" arrowAlign="start" [closable]="false">
  <ids-tooltip-trigger>
    <ids-button variant="secondary" size="lg">Hover over me</ids-button>
  </ids-tooltip-trigger>
  <ids-tooltip-panel>
    <ids-tooltip-header>
      <ids-tooltip-title>Tooltip Title</ids-tooltip-title>
    </ids-tooltip-header>
    <ids-tooltip-body>
      Morbi interdum mollis sapien. Sed ac risus. Phasellus lacinia, magna a sed ullamcorper laoreet, lectus arcu.
    </ids-tooltip-body>
    <ids-tooltip-arrow />
  </ids-tooltip-panel>
</ids-tooltip>`;

export const TOOLTIP_COMPOSITION_DEMO_TEMPLATE = `
<div style="display: flex; min-height: 180px; align-items: center; justify-content: center; padding: 32px; overflow: visible;">
  <ids-tooltip
    [side]="side"
    [arrowAlign]="arrowAlign"
    [closable]="closable"
    (closed)="onClose?.($event)"
  >
    <ids-tooltip-trigger>
      <ids-button variant="secondary" size="lg">{{ triggerLabel }}</ids-button>
    </ids-tooltip-trigger>
    <ids-tooltip-panel>
      @if (title) {
        <ids-tooltip-header>
          <ids-tooltip-title>{{ title }}</ids-tooltip-title>
        </ids-tooltip-header>
      }
      <ids-tooltip-body>{{ content }}</ids-tooltip-body>
      @if (closable) {
        <ids-tooltip-close />
      }
      <ids-tooltip-arrow />
    </ids-tooltip-panel>
  </ids-tooltip>
</div>
`.trim();

/** Docs / autodocs canvas — extra vertical padding so \`side=top\` popups fit without iframe scrollbars. */
export const TOOLTIP_DOCS_CANVAS_TEMPLATE = `
<div
  style="
    display: flex;
    min-height: 300px;
    align-items: center;
    justify-content: center;
    padding: 96px 32px 48px;
    overflow: visible;
    box-sizing: border-box;
  "
>
  <ids-tooltip
    [side]="side"
    [arrowAlign]="arrowAlign"
    [closable]="closable"
    (closed)="onClose?.($event)"
  >
    <ids-tooltip-trigger>
      <ids-button variant="secondary" size="lg">{{ triggerLabel }}</ids-button>
    </ids-tooltip-trigger>
    <ids-tooltip-panel>
      @if (title) {
        <ids-tooltip-header>
          <ids-tooltip-title>{{ title }}</ids-tooltip-title>
        </ids-tooltip-header>
      }
      <ids-tooltip-body>{{ content }}</ids-tooltip-body>
      @if (closable) {
        <ids-tooltip-close />
      }
      <ids-tooltip-arrow />
    </ids-tooltip-panel>
  </ids-tooltip>
</div>
`.trim();

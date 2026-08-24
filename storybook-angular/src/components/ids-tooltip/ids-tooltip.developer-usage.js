/** Developer usage + Docs tab copy for IDS Tooltip (Angular, composition API). */

export const TOOLTIP_DOCS_DESCRIPTION = `
IDS Tooltip — Angular 21 standalone **composition** API (\`storybook-angular\`, port **6007**).

**Spec:** \`components/ids/tooltip/design-spec.md\`  
**Contract defaults:** \`component-contracts/ids/tooltip.contract.ts\`

### Anatomy (deterministic child order)

\`\`\`
ids-tooltip [side, arrowAlign, closable, …]
  ids-tooltip-trigger
  ids-tooltip-panel
    ids-tooltip-header
      ids-tooltip-title
    ids-tooltip-body
    ids-tooltip-close
    ids-tooltip-arrow
\`\`\`

\`ids-tooltip-header\` / \`ids-tooltip-title\` are optional. \`ids-tooltip-close\` is required when \`closable=true\`. \`ids-tooltip-arrow\` is always required.

Import \`IDS_TOOLTIP_IMPORTS\` from \`lib/angular/ids/tooltip\`.

### Root API (\`ids-tooltip\`)

| Input | Default | Notes |
|-------|---------|-------|
| \`side\` | \`top\` | \`top\` \\| \`bottom\` \\| \`left\` \\| \`right\` |
| \`arrowAlign\` | \`center\` | \`start\` \\| \`center\` \\| \`end\` |
| \`closable\` | \`false\` | Persistent until close / Escape |
| \`triggerDisplay\` | \`inline\` | \`block\` for full-width row triggers |
| \`hugContent\` | \`false\` | Shrink popup to content width |

| Output | Notes |
|--------|-------|
| \`openChange\` | Visibility changed |
| \`closed\` | User dismiss (\`close-click\` \\| \`escape\`) |

Load \`components/ids-theme.css\` on the app root (\`data-design-system="ids"\`).
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

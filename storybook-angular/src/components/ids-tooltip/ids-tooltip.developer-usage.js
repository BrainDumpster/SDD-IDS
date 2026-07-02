/** Developer usage + Docs tab copy for IDS Tooltip (Angular, composition API). */

export const TOOLTIP_DOCS_DESCRIPTION = `
IDS Tooltip — Angular 21 standalone **composition** API (\`storybook-angular\`, port **6007**).

**Spec:** \`components/ids/tooltip/design-spec.md\`  
**Contract defaults:** \`component-contracts/ids/tooltip.contract.ts\`

### Anatomy (deterministic child order)

\`\`\`
ids-tooltip [side, arrowAlign, closable, …]
  ← trigger (default projected content, e.g. ids-button)
  ids-tooltip-title?     ← optional header (Body 2 Medium)
  ids-tooltip-body       ← required body copy / rich content
\`\`\`

Import \`IDS_TOOLTIP_IMPORTS\` from \`ids-tooltip.imports.ts\`.

String props (\`title\`, \`content\`) remain **shorthand** for Storybook controls when slots are not used.

### Root API (\`ids-tooltip\`)

| Input | Default | Notes |
|-------|---------|-------|
| \`side\` | \`top\` | \`top\` \\| \`bottom\` \\| \`left\` \\| \`right\` |
| \`arrowAlign\` | \`center\` | \`start\` \\| \`center\` \\| \`end\` |
| \`closable\` | \`false\` | Persistent until close icon / escape |
| \`triggerDisplay\` | \`inline\` | \`block\` for full-width row triggers |
| \`title\` | — | Shorthand when \`ids-tooltip-title\` absent |
| \`content\` | — | Shorthand when \`ids-tooltip-body\` absent |

| Output | Notes |
|--------|-------|
| \`openChange\` | Visibility changed |
| \`closed\` | User dismiss (\`close-click\` \\| \`escape\`) |

Load \`components/ids-theme.css\` on the app root (\`data-design-system="ids"\`).
`.trim();

export const TOOLTIP_SOURCE_CODE = `import { Component } from "@angular/core";
import { provideZoneChangeDetection } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { IDS_TOOLTIP_IMPORTS } from "./ids-tooltip/ids-tooltip.imports";
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
      <ids-button variant="secondary" size="lg">Hover over me</ids-button>
      <ids-tooltip-title>{{ title }}</ids-tooltip-title>
      <ids-tooltip-body>{{ content }}</ids-tooltip-body>
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
  <ids-button variant="secondary" size="lg">Hover over me</ids-button>
  <ids-tooltip-title>Tooltip Title</ids-tooltip-title>
  <ids-tooltip-body>
    Morbi interdum mollis sapien. Sed ac risus. Phasellus lacinia, magna a sed ullamcorper laoreet, lectus arcu.
  </ids-tooltip-body>
</ids-tooltip>`;

export const TOOLTIP_COMPOSITION_DEMO_TEMPLATE = `
<div style="display: flex; min-height: 180px; align-items: center; justify-content: center; padding: 32px; overflow: visible;">
  <ids-tooltip
    [side]="side"
    [arrowAlign]="arrowAlign"
    [closable]="closable"
    (closed)="onClose?.($event)"
  >
    <ids-button variant="secondary" size="lg">{{ triggerLabel }}</ids-button>
  @if (title) {
    <ids-tooltip-title>{{ title }}</ids-tooltip-title>
  }
    <ids-tooltip-body>{{ content }}</ids-tooltip-body>
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
    <ids-button variant="secondary" size="lg">{{ triggerLabel }}</ids-button>
  @if (title) {
    <ids-tooltip-title>{{ title }}</ids-tooltip-title>
  }
    <ids-tooltip-body>{{ content }}</ids-tooltip-body>
  </ids-tooltip>
</div>
`.trim();

export const TOOLTIP_RICH_CONTENT_TEMPLATE = `
<div style="display: flex; min-height: 180px; align-items: center; justify-content: center; padding: 32px;">
  <ids-tooltip side="right" arrowAlign="center">
    <ids-button variant="secondary" size="lg">Rich content</ids-button>
    <ids-tooltip-title>Custom Content</ids-tooltip-title>
    <ids-tooltip-body>
      <p style="margin: 0;">Any content can be rendered here.</p>
      <ul style="margin: 8px 0 0; padding-left: 18px;">
        <li>Text</li>
        <li>Lists</li>
        <li>Inline formatting</li>
      </ul>
    </ids-tooltip-body>
  </ids-tooltip>
</div>
`.trim();

export const TOOLTIP_ARROW_MATRIX_TEMPLATE = `
<div
  style="
    display: grid;
    grid-template-columns: repeat(3, minmax(220px, 1fr));
    gap: 20px;
    padding: 24px;
  "
>
  @for (placement of placements; track placement.key) {
    <div style="display: flex; justify-content: center;">
      <ids-tooltip
        [side]="placement.side"
        [arrowAlign]="placement.align"
        [closable]="true"
      >
        <ids-button variant="secondary" size="lg">{{ placement.key }}</ids-button>
        <ids-tooltip-title>Tooltip Title</ids-tooltip-title>
        <ids-tooltip-body>{{ placement.side }} - {{ placement.align }}</ids-tooltip-body>
      </ids-tooltip>
    </div>
  }
</div>
`.trim();

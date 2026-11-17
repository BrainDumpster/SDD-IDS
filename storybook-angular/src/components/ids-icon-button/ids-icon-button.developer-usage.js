/** Developer usage + Docs tab copy for IDS Icon Button (Angular). */

export const ICON_BUTTON_DOCS_DESCRIPTION = `
## Overview

Square icon-only control. Pass required \`shape\` (icon name); \`ids-icon-button\` renders internal \`ids-icon\`.

For text / icon+text use \`ids-button\`.

## Contract

- \`ariaLabel\` is **required**.
- \`shape\` is **required** (icon name) — forwarded to \`ids-icon\` \`[shape]\`.
- Sizes: \`sm\` 24×24 / \`md\` 32×32 / \`lg\` 40×40.
- Glyphs: 12 / 14 / 16 for all variants (incl. Ghost Neutral).
- Variants: primary | secondary | tertiary | ghostNeutral (alias ghost). No Destructive.

## Events

| Output | Spec name | Payload |
|--------|-----------|---------|
| \`(clicked)\` | \`onClick\` | \`MouseEvent\` — successful activation; blocked when disabled/loading |
`.trim();

export const ICON_BUTTON_SOURCE_CODE = `import { IDS_ICON_BUTTON_IMPORTS } from "@ids/angular/icon-button";

@Component({
  standalone: true,
  imports: [...IDS_ICON_BUTTON_IMPORTS],
  template: \`
    <ids-icon-button
      shape="shape-plus"
      variant="primary"
      size="lg"
      ariaLabel="Add"
      (clicked)="onAdd($event)"
    />
  \`,
})
export class Example {
  onAdd(event: MouseEvent) {
    console.log("icon-button click", event);
  }
}`;

export const ICON_BUTTON_STORY_SOURCE_CODE = `<ids-icon-button
  [shape]="shape"
  [variant]="variant"
  [size]="size"
  [disabled]="disabled"
  [loading]="loading"
  [ariaLabel]="ariaLabel"
  (clicked)="clicked($event)"
/>`;

export const ICON_BUTTON_COMPOSITION_DEMO_TEMPLATE = `
  <ids-icon-button
    [shape]="shape"
    [variant]="variant"
    [size]="size"
    [disabled]="disabled"
    [loading]="loading"
    [ariaLabel]="ariaLabel"
    (clicked)="clicked($event)"
  />
`;

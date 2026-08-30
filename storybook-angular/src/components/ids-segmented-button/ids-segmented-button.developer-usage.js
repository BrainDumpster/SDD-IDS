/** Developer usage + Docs tab copy for IDS Segmented Button (Angular). */

export const SEGMENTED_BUTTON_DOCS_DESCRIPTION = `
## Overview

Grouped toggle buttons for mutually exclusive options.

## Props

### \`ids-segmented-buttons\`

| Input | Type | Default |
|-------|------|---------|
| \`type\` | \`SegmentedButtonType\` | \`SEGMENTED_BUTTON_SPEC_ACCURATE_DE…\` |
| \`defaultSelected\` | \`string \\| number\` | \`SEGMENTED_BUTTON_SPEC_ACCURATE_DE…\` |
| \`disabled\` | \`—\` | \`SEGMENTED_BUTTON_SPEC_ACCURATE_DE…\` |
| \`ariaLabel\` | \`string\` | \`SEGMENTED_BUTTON_SPEC_ACCURATE_DE…\` |

### \`ids-segmented-icon\`

| Input | Type | Default |
|-------|------|---------|
| \`disabled\` | \`—\` | \`false\` |

### \`ids-segmented-text\`

| Input | Type | Default |
|-------|------|---------|
| \`disabled\` | \`—\` | \`false\` |

## Events

| Output | On | Payload |
|--------|----|---------|
| \`selectedChange\` | \`ids-segmented-buttons\` | \`string\` |
| \`change\` | \`ids-segmented-buttons\` | \`{
    value: string;
    meta: SegmentedButto…\` |

## API

Import \`IDS_SEGMENTED_BUTTON_IMPORTS\` from the component imports barrel (compiled \`lib/angular/ids/segmented-button\`).

\`\`\`ts
import { IDS_SEGMENTED_BUTTON_IMPORTS } from "@ids/angular/segmented-button";
\`\`\`
`.trim();

export const SEGMENTED_BUTTON_SOURCE_CODE = `import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideZoneChangeDetection } from "@angular/core";
import { IDS_SEGMENTED_BUTTON_IMPORTS } from "./ids-segmented-button/ids-segmented-button.imports";
import { SEGMENTED_BUTTON_SPEC_ACCURATE_DEFAULTS } from "@component-contracts/ids/segmented-button.contract";

@Component({
  standalone: true,
  imports: [...IDS_SEGMENTED_BUTTON_IMPORTS],
  template: \`
    <ids-segmented-buttons
      type="text"
      [selected]="selected"
      (selectedChange)="selected = $event"
      [ariaLabel]="ariaLabel"
    >
      <ids-segmented-text value="option1" label="Option 1" />
      <ids-segmented-text value="option2" label="Option 2" />
    </ids-segmented-buttons>
  \`,
})
export class AppComponent {
  readonly ariaLabel = SEGMENTED_BUTTON_SPEC_ACCURATE_DEFAULTS.ariaLabel;
  selected = SEGMENTED_BUTTON_SPEC_ACCURATE_DEFAULTS.selected;
}

bootstrapApplication(AppComponent, {
  providers: [provideZoneChangeDetection()],
});`;

export const SEGMENTED_BUTTON_STORY_SOURCE_CODE = `<ids-segmented-buttons type="text" defaultSelected="option1" ariaLabel="Segmented options">
  <ids-segmented-text value="option1" label="Option 1" />
  <ids-segmented-text value="option2" label="Option 2" />
</ids-segmented-buttons>`;

export const SEGMENTED_BUTTON_ICON_STORY_SOURCE_CODE = `<ids-segmented-buttons type="icon" defaultSelected="tree" ariaLabel="Content view">
  <ids-segmented-icon value="list" shape="view-hamburger" ariaLabel="List view" title="List view" />
  <ids-segmented-icon value="tree" shape="nav-tree" ariaLabel="Tree view" title="Tree view" />
  <ids-segmented-icon value="grid" shape="view-sort-grid-solid" ariaLabel="Grid view" title="Grid view" />
</ids-segmented-buttons>`;

export const SEGMENTED_BUTTON_COMPOSITION_DEMO_TEMPLATE = `
  <div style="width: 260px;">
    <ids-segmented-buttons
      type="text"
      [selected]="state.selected"
      (selectedChange)="onSelectedChange($event)"
      [ariaLabel]="ariaLabel"
      [disabled]="disabled"
    >
      <ids-segmented-text value="option1" label="Option 1" />
      <ids-segmented-text value="option2" label="Option 2" />
    </ids-segmented-buttons>
  </div>
`;

export const SEGMENTED_BUTTON_ICON_COMPOSITION_TEMPLATE = `
  <ids-segmented-buttons
    type="icon"
    [selected]="state.selected"
    (selectedChange)="state.selected = $event"
    ariaLabel="Content view"
  >
    <ids-segmented-icon value="list" shape="view-hamburger" ariaLabel="List view" title="List view" />
    <ids-segmented-icon value="tree" shape="nav-tree" ariaLabel="Tree view" title="Tree view" />
    <ids-segmented-icon value="grid" shape="view-sort-grid-solid" ariaLabel="Grid view" title="Grid view" />
  </ids-segmented-buttons>
`;

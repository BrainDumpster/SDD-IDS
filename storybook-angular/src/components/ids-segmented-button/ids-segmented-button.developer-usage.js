/** Developer usage + Docs tab copy for IDS Segmented Button (Angular). */

export const SEGMENTED_BUTTON_DOCS_DESCRIPTION = `
IDS Segmented Button — Angular 21 standalone **composition** API (\`storybook-angular\`, port **6007**).

**Spec:** \`components/ids/segmented-button/design-spec.md\`  
**Contract defaults:** \`component-contracts/ids/segmented-button.contract.ts\`

### Anatomy (deterministic child order)

\`\`\`
ids-segmented-buttons [type, selected?, defaultSelected?, disabled?, ariaLabel?]
  ids-segmented-text [value, label, ariaLabel?, title?]   (when type="text")
  ids-segmented-icon [value, shape, ariaLabel, title?, color?]   (when type="icon")
\`\`\`

Import \`IDS_SEGMENTED_BUTTON_IMPORTS\` from \`ids-segmented-button.imports.ts\`.

### Group API

| Input | Default | Notes |
|-------|---------|-------|
| \`type\` | \`text\` | \`text\` \| \`icon\` |
| \`selected\` | — | Controlled selected \`value\` (string or number) |
| \`defaultSelected\` | \`option1\` | Uncontrolled initial selection |
| \`disabled\` | \`false\` | Disables entire group |
| \`ariaLabel\` | \`Segmented options\` | Radiogroup accessible name |

| Output | Notes |
|--------|-------|
| \`selectedChange\` | Emits newly selected \`value\` (string) |
| \`change\` | Emits \`{ value, meta }\` — \`meta.label\` (text) or \`meta.ariaLabel\` (icon) |

### Item API (\`ids-segmented-text\`)

| Input | Required | Notes |
|-------|----------|-------|
| \`value\` | Yes | Unique segment id (string or number) |
| \`label\` | Yes | Visible label (Body 2) |
| \`ariaLabel\` | No | Overrides default accessible name |
| \`title\` | No | Native tooltip |
| \`disabled\` | No | Per-segment disable |
| \`simulatedState\` | No | Storybook only: \`hover\` \| \`press\` \| \`focus-visible\` |

### Item API (\`ids-segmented-icon\`)

| Input | Required | Notes |
|-------|----------|-------|
| \`value\` | Yes | Unique segment id |
| \`shape\` | Yes | Icon slug → \`assets/icons/<shape>.svg\` via \`ids-icon\` |
| \`ariaLabel\` | Yes | Accessible name (icon-only) |
| \`title\` | No | Native tooltip |
| \`color\` | No | Optional CSS color override; state tokens apply when omitted |
| \`disabled\` | No | Per-segment disable |
| \`simulatedState\` | No | Storybook only |

Load \`components/ids-theme.css\` on the app root (\`data-design-system="ids"\`).
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

/** Developer usage + Docs tab copy for IDS Dual List Box (Angular, composition-shaped runtime). */

export const DUAL_LIST_BOX_DOCS_DESCRIPTION = `
IDS Dual List Box — Angular 21 standalone runtime aligned to \`components/ids/dual-list-box/design-spec.md\`. Library: \`lib/angular/ids/dual-list-box/\`. Storybook: \`storybook-angular\`, port **6007**.

**Spec:** \`components/ids/dual-list-box/design-spec.md\`  
**Contract defaults:** \`component-contracts/ids/dual-list-box.contract.ts\`

### Anatomy (rendered selector hierarchy)

\`\`\`
ids-dual-list-box
  ids-dual-list-box-lists-parent
    ids-dual-list-box-available-pane
      ids-dual-list-box-available-pane-header
      ids-dual-list-box-available-list-group
        ids-dual-list-box-list-item
          ids-dual-list-box-drag-handle
          ids-dual-list-box-item-content
          ids-dual-list-box-selection-check
    ids-dual-list-box-transfer-button-group
      ids-dual-list-box-move-all-right
      ids-dual-list-box-move-selected-right
      ids-dual-list-box-move-selected-left
      ids-dual-list-box-move-all-left
    ids-dual-list-box-selected-pane
      ids-dual-list-box-selected-pane-header
      ids-dual-list-box-selected-list-group
\`\`\`

Import \`IDS_DUAL_LIST_BOX_IMPORTS\` from \`lib/angular/ids\`.

### Root API (\`ids-dual-list-box\`)

| Input | Default | Notes |
|-------|---------|-------|
| \`availableItems\` | \`[]\` | Available pane rows |
| \`selectedItems\` | \`[]\` | Selected pane rows |
| \`availableTitle\` | \`Available Items\` | Header label |
| \`selectedTitle\` | \`Selected Items\` | Header label |
| \`availablePlaceholder\` | Spec default | Empty available-pane copy |
| \`selectedPlaceholder\` | Spec default | Empty selected-pane copy |
| \`showMetrics\` | \`true\` | Header metrics |
| \`metricsFormat\` | \`total\` | \`total\` \\| \`total-and-selected\` |
| \`enableDragDrop\` | \`true\` | Drag from \`arrow-arrange\` only |

| Output | Notes |
|--------|-------|
| \`availableSelectionChange\` | Emits selected ids in available pane |
| \`selectedSelectionChange\` | Emits selected ids in selected pane |
| \`itemsChange\` | Emits updated pane collections |
| \`transfer\` | Emits action + moved ids |
| \`dragDrop\` | Emits item id, source pane, target pane, and target index |

Load \`components/ids-theme.css\` on the app root (\`data-design-system="ids"\`).
`.trim();

export const DUAL_LIST_BOX_SOURCE_CODE = `import { Component } from "@angular/core";
import { provideZoneChangeDetection } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { IDS_DUAL_LIST_BOX_IMPORTS } from "lib/angular/ids";
import { DUAL_LIST_BOX_SPEC_ACCURATE_DEFAULTS } from "@component-contracts/ids/dual-list-box.contract";

@Component({
  standalone: true,
  imports: [...IDS_DUAL_LIST_BOX_IMPORTS],
  template: \`
    <ids-dual-list-box
      [availableItems]="availableItems"
      [selectedItems]="selectedItems"
      [availableTitle]="availableTitle"
      [selectedTitle]="selectedTitle"
    />
  \`,
})
export class AppComponent {
  readonly availableItems = [...DUAL_LIST_BOX_SPEC_ACCURATE_DEFAULTS.availableItems];
  readonly selectedItems = [...DUAL_LIST_BOX_SPEC_ACCURATE_DEFAULTS.selectedItems];
  readonly availableTitle = DUAL_LIST_BOX_SPEC_ACCURATE_DEFAULTS.availableTitle;
  readonly selectedTitle = DUAL_LIST_BOX_SPEC_ACCURATE_DEFAULTS.selectedTitle;
}

bootstrapApplication(AppComponent, {
  providers: [provideZoneChangeDetection()],
});`;

export const DUAL_LIST_BOX_STORY_SOURCE_CODE = `<ids-dual-list-box
  [availableItems]="availableItems"
  [selectedItems]="selectedItems"
  availableTitle="Available Items"
  selectedTitle="Selected Items"
></ids-dual-list-box>`;

export const DUAL_LIST_BOX_SPEC_ACCURATE_TEMPLATE = `
<div
  style="
    width: 100%;
    max-width: 724px;
    padding: 16px;
    background: var(--color-background-surface-primary);
    box-sizing: border-box;
  "
>
  <ids-dual-list-box
    [availableItems]="availableItems"
    [selectedItems]="selectedItems"
    [availableTitle]="availableTitle"
    [selectedTitle]="selectedTitle"
    [availablePlaceholder]="availablePlaceholder"
    [selectedPlaceholder]="selectedPlaceholder"
    [availableSelection]="availableSelection"
    [selectedSelection]="selectedSelection"
    [showMetrics]="showMetrics"
    [metricsFormat]="metricsFormat"
    [enableDragDrop]="enableDragDrop"
    [moveSelectedRightTitle]="moveSelectedRightTitle"
    [moveSelectedLeftTitle]="moveSelectedLeftTitle"
    [moveAllRightTitle]="moveAllRightTitle"
    [moveAllLeftTitle]="moveAllLeftTitle"
    (transfer)="transfer($event)"
    (dragDrop)="dragDrop($event)"
    (itemsChange)="itemsChange($event)"
    (availableSelectionChange)="availableSelectionChange($event)"
    (selectedSelectionChange)="selectedSelectionChange($event)"
  ></ids-dual-list-box>
</div>
`.trim();

/** Developer usage + Docs tab copy for IDS Dual List Box (Angular, composition-shaped runtime). */

export const DUAL_LIST_BOX_DOCS_DESCRIPTION = `
## Overview

Transfer list for moving items between available and selected panes.

## Props

### \`ids-dual-list-box\`

| Input | Type | Default |
|-------|------|---------|
| \`availableItems\` | \`DualListBoxItem[]\` | \`[]\` |
| \`selectedItems\` | \`DualListBoxItem[]\` | \`[]\` |
| \`availableTitle\` | \`—\` | \`DUAL_LIST_BOX_DEFAULTS.availableT…\` |
| \`selectedTitle\` | \`—\` | \`DUAL_LIST_BOX_DEFAULTS.selectedTitle\` |
| \`availablePlaceholder\` | \`—\` | \`DUAL_LIST_BOX_DEFAULTS.availableP…\` |
| \`selectedPlaceholder\` | \`—\` | \`DUAL_LIST_BOX_DEFAULTS.selectedPl…\` |
| \`moveSelectedRightTitle\` | \`—\` | \`DUAL_LIST_BOX_DEFAULTS.moveSelect…\` |
| \`moveSelectedLeftTitle\` | \`—\` | \`DUAL_LIST_BOX_DEFAULTS.moveSelect…\` |
| \`availableSelection\` | \`string[]\` | \`[]\` |
| \`selectedSelection\` | \`string[]\` | \`[]\` |
| \`showMetrics\` | \`—\` | \`DUAL_LIST_BOX_DEFAULTS.showMetrics\` |
| \`metricsFormat\` | \`DualListBoxMetricsFormat\` | \`DUAL_LIST_BOX_DEFAULTS.metricsFormat\` |
| \`enableDragDrop\` | \`—\` | \`DUAL_LIST_BOX_DEFAULTS.enableDrag…\` |
| \`itemTooltipSide\` | \`DualListBoxTooltipSide\` | \`DUAL_LIST_BOX_DEFAULTS.itemToolti…\` |

### \`ids-dual-list-box-lists-parent\`

| Input | Type | Default |
|-------|------|---------|
| \`showMetrics\` | \`—\` | \`true\` |
| \`metricsFormat\` | \`DualListBoxMetricsFormat\` | \`"total"\` |
| \`totalCount\` | \`—\` | \`0\` |
| \`selectedCount\` | \`—\` | \`0\` |
| \`showMetrics\` | \`—\` | \`true\` |
| \`metricsFormat\` | \`DualListBoxMetricsFormat\` | \`"total"\` |
| \`totalCount\` | \`—\` | \`0\` |
| \`selectedCount\` | \`—\` | \`0\` |
| \`empty\` | \`—\` | \`false\` |
| \`dragOver\` | \`—\` | \`false\` |
| \`empty\` | \`—\` | \`false\` |
| \`dragOver\` | \`—\` | \`false\` |
| \`enabled\` | \`—\` | \`false\` |
| \`selected\` | \`—\` | \`false\` |

## Events

| Output | On | Payload |
|--------|----|---------|
| \`availableSelectionChange\` | \`ids-dual-list-box\` | \`string[]\` |
| \`selectedSelectionChange\` | \`ids-dual-list-box\` | \`string[]\` |
| \`itemsChange\` | \`ids-dual-list-box\` | \`DualListBoxItemsChangeDetail\` |
| \`transfer\` | \`ids-dual-list-box\` | \`DualListBoxTransferDetail\` |
| \`dragDrop\` | \`ids-dual-list-box\` | \`DualListBoxDragDropDetail\` |
| \`dragOverEvent\` | \`ids-dual-list-box-lists-parent\` | \`DragEvent\` |
| \`dropEvent\` | \`ids-dual-list-box-lists-parent\` | \`DragEvent\` |
| \`dragLeaveEvent\` | \`ids-dual-list-box-lists-parent\` | \`DragEvent\` |
| \`listKeydown\` | \`ids-dual-list-box-lists-parent\` | \`KeyboardEvent\` |
| \`listFocus\` | \`ids-dual-list-box-lists-parent\` | \`FocusEvent\` |
| \`dragOverEvent\` | \`ids-dual-list-box-lists-parent\` | \`DragEvent\` |
| \`dropEvent\` | \`ids-dual-list-box-lists-parent\` | \`DragEvent\` |
| \`dragLeaveEvent\` | \`ids-dual-list-box-lists-parent\` | \`DragEvent\` |
| \`listKeydown\` | \`ids-dual-list-box-lists-parent\` | \`KeyboardEvent\` |
| \`listFocus\` | \`ids-dual-list-box-lists-parent\` | \`FocusEvent\` |
| \`pressed\` | \`ids-dual-list-box-lists-parent\` | \`void\` |

## API

Import \`IDS_DUAL_LIST_BOX_IMPORTS\` from the component imports barrel (compiled \`lib/angular/ids/dual-list-box\`).

\`\`\`ts
import { IDS_DUAL_LIST_BOX_IMPORTS } from "@ids/angular/dual-list-box";
\`\`\`
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

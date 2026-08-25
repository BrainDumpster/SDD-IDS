/** Developer usage + Docs tab copy for IDS Dropdown (Angular). */

export const DROPDOWN_DOCS_DESCRIPTION = `
## Overview

Composition dropdown for combobox and select modes (single/multi).

## Props

### \`ids-dropdown\`

| Input | Type | Default |
|-------|------|---------|
| \`mode\` | \`IdsDropdownMode\` | \`"single-select"\` |
| \`disabled\` | \`—\` | \`false\` |
| \`showSingleSelectRadio\` | \`—\` | \`false\` |
| \`values\` | \`string[]\` | \`[]\` |
| \`defaultValues\` | \`string[]\` | \`[]\` |

### \`ids-dropdown-menu-item\`

| Input | Type | Default |
|-------|------|---------|
| \`disabled\` | \`—\` | \`false\` |

### \`ids-dropdown-menu\`

| Input | Type | Default |
|-------|------|---------|
| \`items\` | \`IdsDropdownMenuItemModel[]\` | \`[]\` |
| \`disabled\` | \`—\` | \`false\` |
| \`selectionMode\` | \`IdsDropdownSelectionMode\` | \`"none"\` |
| \`showSingleSelectRadio\` | \`—\` | \`false\` |
| \`showSelectAllClearAll\` | \`—\` | \`false\` |
| \`selectAllLabel\` | \`—\` | \`"Select All"\` |
| \`clearAllLabel\` | \`—\` | \`"Clear All"\` |
| \`selectAllChecked\` | \`—\` | \`false\` |
| \`selectAllIndeterminate\` | \`—\` | \`false\` |
| \`clearAllDisabled\` | \`—\` | \`false\` |
| \`selectedValues\` | \`string[]\` | \`[]\` |
| \`sideOffset\` | \`—\` | \`0\` |
| \`matchTriggerWidth\` | \`—\` | \`true\` |
| \`defaultOpen\` | \`—\` | \`false\` |

### \`ids-dropdown-trigger-shell\`

| Input | Type | Default |
|-------|------|---------|
| \`size\` | \`IdsDropdownSize\` | \`"large"\` |
| \`disabled\` | \`—\` | \`false\` |
| \`error\` | \`—\` | \`false\` |
| \`hover\` | \`—\` | \`false\` |
| \`focusVisible\` | \`—\` | \`false\` |

## Events

| Output | On | Payload |
|--------|----|---------|
| \`valueChange\` | \`ids-dropdown\` | \`string\` |
| \`valuesChange\` | \`ids-dropdown\` | \`string[]\` |
| \`selectionChange\` | \`ids-dropdown\` | \`string \\| string[]\` |
| \`action\` | \`ids-dropdown-menu-footer\` | \`void\` |
| \`openChange\` | \`ids-dropdown-menu\` | \`boolean\` |
| \`searchValueChange\` | \`ids-dropdown-menu\` | \`string\` |
| \`selectAllClick\` | \`ids-dropdown-menu\` | \`void\` |
| \`clearAllClick\` | \`ids-dropdown-menu\` | \`void\` |
| \`showSelectedExpandedChange\` | \`ids-dropdown-menu\` | \`boolean\` |
| \`removeSelectedTag\` | \`ids-dropdown-menu\` | \`string\` |
| \`showSelectedPanelClear\` | \`ids-dropdown-menu\` | \`void\` |
| \`dismiss\` | \`ids-dropdown-tag\` | \`void\` |

## API

Import \`IDS_DROPDOWN_IMPORTS\` from the component imports barrel (compiled \`lib/angular/ids/dropdown\`).

\`\`\`ts
import { IDS_DROPDOWN_IMPORTS } from "@ids/angular/dropdown";
\`\`\`
`.trim();

export const DROPDOWN_SOURCE_CODE = `import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideZoneChangeDetection } from "@angular/core";
import { IDS_DROPDOWN_IMPORTS } from "./ids-dropdown/ids-dropdown.imports";

@Component({
  standalone: true,
  imports: [...IDS_DROPDOWN_IMPORTS],
  template: \`
    <ids-dropdown mode="combobox-single" [value]="selected" (valueChange)="selected = $event">
      <ids-dropdown-menu [showSearch]="true" [maxHeight]="220">
        <ids-dropdown-trigger-shell>
          <span>{{ selected || 'Select product' }}</span>
        </ids-dropdown-trigger-shell>
        <ids-dropdown-menu-item value="Storage" label="Storage" />
        <ids-dropdown-menu-item value="Compute" label="Compute" />
      </ids-dropdown-menu>
      <ids-dropdown-helper>Choose one product</ids-dropdown-helper>
    </ids-dropdown>
  \`,
})
export class AppComponent {
  selected = "Compute";
}

bootstrapApplication(AppComponent, {
  providers: [provideZoneChangeDetection()],
});`;

export const DROPDOWN_STORY_SOURCE_CODE = `<ids-dropdown mode="combobox-single" [value]="selected" (valueChange)="selected = $event">
  <ids-dropdown-menu [showSearch]="true" [defaultOpen]="true">
    <ids-dropdown-trigger-shell>
      <span>{{ selected || 'Select' }}</span>
    </ids-dropdown-trigger-shell>
    <ids-dropdown-menu-item value="Storage" label="Storage" />
    <ids-dropdown-menu-item value="Compute" label="Compute" />
  </ids-dropdown-menu>
  <ids-dropdown-helper>Helper text</ids-dropdown-helper>
</ids-dropdown>`;

export const DROPDOWN_COMPOSITION_DEMO_TEMPLATE = `
<ids-dropdown mode="combobox-single" [value]="selected" (valueChange)="selected = $event">
  <ids-dropdown-menu [showSearch]="true" [defaultOpen]="true" [maxHeight]="220">
    <ids-dropdown-trigger-shell>
      <span>{{ selected || 'Select product' }}</span>
    </ids-dropdown-trigger-shell>
    <ids-dropdown-menu-item value="Storage" label="Storage" />
    <ids-dropdown-menu-item value="Compute" label="Compute" />
    <ids-dropdown-menu-item value="Network" label="Network" />
  </ids-dropdown-menu>
  <ids-dropdown-helper>Choose one product</ids-dropdown-helper>
</ids-dropdown>`;

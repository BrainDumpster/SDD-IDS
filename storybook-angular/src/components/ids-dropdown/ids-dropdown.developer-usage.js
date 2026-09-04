/** Developer usage + Docs tab copy for IDS Dropdown (Angular). */

export const DROPDOWN_DOCS_DESCRIPTION = `
## Overview

Composition dropdown for combobox and select modes (single/multi).

## Props

### \`ids-dropdown\`

| Input | Type | Default |
|-------|------|---------|
| \`mode\` | \`IdsDropdownMode\` | \`"single-select"\` |
| \`disabled\` | \`boolean\` | \`false\` |
| \`showRadio\` | \`boolean\` | \`false\` (React/spec; preferred) |
| \`showSingleSelectRadio\` | \`boolean\` | \`false\` (legacy alias of \`showRadio\`) |
| \`value\` | \`string\` | — |
| \`values\` | \`string[]\` | \`[]\` |
| \`defaultValue\` | \`string\` | — |
| \`defaultValues\` | \`string[]\` | \`[]\` |

### \`ids-dropdown-menu-item\`

| Input | Type | Default |
|-------|------|---------|
| \`value\` | \`string\` | required |
| \`label\` | \`string\` | required |
| \`disabled\` | \`boolean\` | \`false\` |

### \`ids-dropdown-menu\`

| Input | Type | Default |
|-------|------|---------|
| \`searchable\` | \`boolean\` | \`false\` (React/spec; preferred) |
| \`showSearch\` | \`boolean\` | \`false\` (legacy alias of \`searchable\`) |
| \`showClearAll\` | \`boolean\` | \`false\` (single-select Clear All below search) |
| \`showSelectAllClearAll\` | \`boolean\` | \`false\` (multiselect Select All / Clear All row) |
| \`selectAllLabel\` | \`string\` | \`"Select All"\` |
| \`clearAllLabel\` | \`string\` | \`"Clear All"\` |
| \`clearAllDisabled\` | \`boolean\` | \`false\` |
| \`maxVisibleItems\` | \`number\` | \`6\` (React/spec — rows before scroll) |
| \`noResultsLabel\` | \`string\` | \`"No results found"\` |
| \`searchPlaceholder\` | \`string\` | \`"Search"\` |
| \`ariaLabel\` | \`string\` | — (trigger aria-label) |
| \`ariaInvalid\` | \`boolean\` | \`false\` |
| \`listboxId\` | \`string\` | auto-generated |
| \`showRadio\` | \`boolean\` | \`false\` (React/spec; preferred) |
| \`showSingleSelectRadio\` | \`boolean\` | \`false\` (legacy alias of \`showRadio\`) |
| \`menuWidth\` | \`"trigger" \\| "content"\` | \`"trigger"\` (React/spec; preferred) |
| \`matchTriggerWidth\` | \`boolean\` | \`true\` (legacy alias of \`menuWidth\`) |
| \`items\` | \`IdsDropdownMenuItemModel[]\` | \`[]\` |
| \`disabled\` | \`boolean\` | \`false\` |
| \`selectionMode\` | \`IdsDropdownSelectionMode\` | \`"none"\` |
| \`selectAllChecked\` | \`boolean\` | \`false\` |
| \`selectAllIndeterminate\` | \`boolean\` | \`false\` |
| \`selectedValues\` | \`string[]\` | \`[]\` |
| \`sideOffset\` | \`number\` | \`-1\` |
| \`defaultOpen\` | \`boolean\` | \`false\` |
| \`showSelectedPanel\` | \`boolean\` | \`false\` |
| \`fullWidth\` | \`boolean\` | \`true\` |

### \`ids-dropdown-trigger-shell\`

| Input | Type | Default |
|-------|------|---------|
| \`size\` | \`IdsDropdownSize\` | \`"large"\` |
| \`disabled\` | \`boolean\` | \`false\` |
| \`error\` | \`boolean\` | \`false\` |
| \`hover\` | \`boolean\` | \`false\` |
| \`focusVisible\` | \`boolean\` | \`false\` |
| \`filled\` | \`boolean\` | \`false\` |
| \`showSelectedBadge\` | \`boolean\` | \`true\` (React/spec — count badge when selected) |
| \`showSelectedTooltip\` | \`boolean\` | \`true\` (React/spec — summary tooltip on badge) |
| \`selectedLabels\` | \`string[]\` | \`[]\` (drives badge count + tooltip body) |

## Events

| Output | On | Payload |
|--------|----|---------|
| \`valueChange\` | \`ids-dropdown\` | \`string\` |
| \`valuesChange\` | \`ids-dropdown\` | \`string[]\` |
| \`selectionChange\` | \`ids-dropdown\` | \`string \\| string[]\` |
| \`action\` | \`ids-dropdown-menu-footer\` | \`void\` |
| \`openChange\` | \`ids-dropdown-menu\` | \`boolean\` |
| \`searchValueChange\` | \`ids-dropdown-menu\` | \`string\` |
| \`selectAllClick\` | \`ids-dropdown-menu\` | \`string[] \\| undefined\` (visible values while filtering) |
| \`clearAllClick\` | \`ids-dropdown-menu\` | \`string[] \\| undefined\` (visible values while filtering) |
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
      <ids-dropdown-menu [searchable]="true" [maxHeight]="220">
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
  <ids-dropdown-menu [searchable]="true" [defaultOpen]="true">
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
  <ids-dropdown-menu [searchable]="true" [defaultOpen]="true" [maxHeight]="220">
    <ids-dropdown-trigger-shell>
      <span>{{ selected || 'Select product' }}</span>
    </ids-dropdown-trigger-shell>
    <ids-dropdown-menu-item value="Storage" label="Storage" />
    <ids-dropdown-menu-item value="Compute" label="Compute" />
    <ids-dropdown-menu-item value="Network" label="Network" />
  </ids-dropdown-menu>
  <ids-dropdown-helper>Choose one product</ids-dropdown-helper>
</ids-dropdown>`;

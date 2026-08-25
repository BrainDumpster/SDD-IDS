/** Developer usage + Docs tab copy for IDS Dropdown Button (Angular, composition API). */

export const DROPDOWN_BUTTON_DOCS_DESCRIPTION = `
## Overview

Button that opens a menu of actions via composition slots.

## Props

### \`ids-dropdown-button\`

| Input | Type | Default |
|-------|------|---------|
| \`buttonStyle\` | \`DropdownButtonStyle\` | \`DROPDOWN_BUTTON_SPEC_ACCURATE_DEF…\` |
| \`size\` | \`DropdownButtonSize\` | \`DROPDOWN_BUTTON_SPEC_ACCURATE_DEF…\` |
| \`disabled\` | \`boolean\` | \`DROPDOWN_BUTTON_SPEC_ACCURATE_DEF…\` |
| \`defaultOpen\` | \`boolean\` | \`DROPDOWN_BUTTON_SPEC_ACCURATE_DEF…\` |

### \`ids-dropdown-button-menu-item\`

| Input | Type | Default |
|-------|------|---------|
| \`disabled\` | \`—\` | \`false\` |

### \`ids-dropdown-button-trigger\`

| Input | Type | Default |
|-------|------|---------|
| \`label\` | \`—\` | \`DROPDOWN_BUTTON_SPEC_ACCURATE_DEF…\` |
| \`showLeadingIcon\` | \`—\` | \`DROPDOWN_BUTTON_SPEC_ACCURATE_DEF…\` |
| \`iconOnly\` | \`—\` | \`DROPDOWN_BUTTON_SPEC_ACCURATE_DEF…\` |
| \`ariaLabel\` | \`—\` | \`""\` |

## Events

| Output | On | Payload |
|--------|----|---------|
| \`openChange\` | \`ids-dropdown-button\` | \`boolean\` |
| \`selectionChange\` | \`ids-dropdown-button\` | \`IdsDropdownButtonSelection\` |

## API

Import \`IDS_DROPDOWN_BUTTON_IMPORTS\` from the component imports barrel (compiled \`lib/angular/ids/dropdown-button\`).

\`\`\`ts
import { IDS_DROPDOWN_BUTTON_IMPORTS } from "@ids/angular/dropdown-button";
\`\`\`
`.trim();

export const DROPDOWN_BUTTON_SOURCE_CODE = `import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideZoneChangeDetection } from "@angular/core";
import { IDS_DROPDOWN_BUTTON_IMPORTS } from "@ids-angular/dropdown-button";

@Component({
  standalone: true,
  imports: [...IDS_DROPDOWN_BUTTON_IMPORTS],
  template: \`
    <ids-dropdown-button buttonStyle="primary" size="medium" (selectionChange)="onSelection($event)">
      <ids-dropdown-button-trigger label="Dropdown Button" />
      <ids-dropdown-button-menu>
        <ids-dropdown-button-menu-item value="option-1" label="Option 1" />
        <ids-dropdown-button-menu-item value="option-2" label="Option 2" />
        <ids-dropdown-button-menu-item value="option-3" label="Option 3" />
      </ids-dropdown-button-menu>
    </ids-dropdown-button>
  \`,
})
export class AppComponent {
  onSelection(_item: { value: string; label: string }) {}
}

bootstrapApplication(AppComponent, {
  providers: [provideZoneChangeDetection()],
});`;

export const DROPDOWN_BUTTON_STORY_SOURCE_CODE = `<ids-dropdown-button buttonStyle="primary" size="medium">
  <ids-dropdown-button-trigger label="Dropdown Button" />
  <ids-dropdown-button-menu>
    <ids-dropdown-button-menu-item value="option-1" label="Option 1" />
    <ids-dropdown-button-menu-item value="option-2" label="Option 2" />
    <ids-dropdown-button-menu-item value="option-3" label="Option 3" />
  </ids-dropdown-button-menu>
</ids-dropdown-button>`;

export const DROPDOWN_BUTTON_SPEC_TEMPLATE = `
<ids-dropdown-button
  [buttonStyle]="buttonStyle"
  [size]="size"
  [disabled]="disabled"
  (openChange)="openChange($event)"
  (selectionChange)="selectionChange($event)"
>
  <ids-dropdown-button-trigger
    [label]="label"
    [showLeadingIcon]="showLeadingIcon"
    [iconOnly]="iconOnly"
    [ariaLabel]="ariaLabel"
  />
  <ids-dropdown-button-menu>
    <ids-dropdown-button-menu-item value="option-1" label="Option 1" />
    <ids-dropdown-button-menu-item value="option-2" label="Option 2" />
    <ids-dropdown-button-menu-item value="option-3" label="Option 3" />
  </ids-dropdown-button-menu>
</ids-dropdown-button>`;

export const DROPDOWN_BUTTON_WITH_ICON_TEMPLATE = `
<ids-dropdown-button
  [buttonStyle]="buttonStyle"
  [size]="size"
  [disabled]="disabled"
  (selectionChange)="selectionChange($event)"
>
  <ids-dropdown-button-trigger
    [label]="label"
    [showLeadingIcon]="true"
    [ariaLabel]="ariaLabel"
  />
  <ids-dropdown-button-menu>
    <ids-dropdown-button-menu-item value="option-1" label="Option 1" />
    <ids-dropdown-button-menu-item value="option-2" label="Option 2" />
    <ids-dropdown-button-menu-item value="option-3" label="Option 3" />
  </ids-dropdown-button-menu>
</ids-dropdown-button>`;

export const DROPDOWN_BUTTON_ICON_ONLY_TEMPLATE = `
<ids-dropdown-button
  [buttonStyle]="buttonStyle"
  [size]="size"
  [disabled]="disabled"
  (selectionChange)="selectionChange($event)"
>
  <ids-dropdown-button-trigger
    [iconOnly]="true"
    [showLeadingIcon]="true"
    [ariaLabel]="ariaLabel"
  />
  <ids-dropdown-button-menu>
    <ids-dropdown-button-menu-item value="option-1" label="Option 1" />
    <ids-dropdown-button-menu-item value="option-2" label="Option 2" />
    <ids-dropdown-button-menu-item value="option-3" label="Option 3" />
  </ids-dropdown-button-menu>
</ids-dropdown-button>`;

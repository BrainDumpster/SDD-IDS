/** Developer usage + Docs tab copy for IDS Dropdown Button (Angular, composition API). */

export const DROPDOWN_BUTTON_DOCS_DESCRIPTION = `
IDS Dropdown Button — Angular standalone **composition** API. Library: \`lib/angular/ids/dropdown-button/\`.

**Spec:** \`components/ids/dropdown-button/design-spec.md\`  
**Contract defaults:** \`component-contracts/ids/dropdown-button.contract.ts\`

### Anatomy (deterministic child order)

\`\`\`
ids-dropdown-button [buttonStyle?, size?, disabled?, open?, defaultOpen?]
  ids-dropdown-button-trigger [label?, showLeadingIcon?, iconOnly?, ariaLabel?]
  ids-dropdown-button-menu
    ids-dropdown-button-menu-item [value, label, disabled?]
    ids-dropdown-button-menu-item …
\`\`\`

Import \`IDS_DROPDOWN_BUTTON_IMPORTS\` from \`lib/angular/ids\`.

Load \`components/ids-theme.css\` on the app root (\`data-design-system="ids"\`).
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

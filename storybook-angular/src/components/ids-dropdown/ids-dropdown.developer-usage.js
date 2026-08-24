/** Developer usage + Docs tab copy for IDS Dropdown (Angular). */

export const DROPDOWN_DOCS_DESCRIPTION = `
IDS Dropdown — Angular 21 standalone **composition** API (\`storybook-angular\`, port **6007**).

**Specs:** \`components/ids/dropdown-combo-box/design-spec.md\`, \`dropdown-single-select\`, \`dropdown-multiselect\`

### Anatomy (deterministic child order)

\`\`\`
ids-dropdown [mode, value | values, disabled?]
  ids-dropdown-menu [showSearch?, defaultOpen?, maxHeight?, showSelectAllClearAll?, …]
    ids-dropdown-trigger-shell  → projected trigger (field + caret)
    ids-dropdown-menu-group [groupName]?  → section header row
      ids-dropdown-menu-item [value, label, disabled?]
    ids-dropdown-menu-item …
    ids-dropdown-menu-footer [actionLabel] (action)
  ids-dropdown-helper  → helper text below field
  ids-dropdown-error   → validation error below field
\`\`\`

Import \`IDS_DROPDOWN_IMPORTS\` from \`ids-dropdown.imports.ts\`.

### Modes

| \`mode\` | Selection | Search |
|----------|-----------|--------|
| \`combobox-single\` | single | optional \`[showSearch]\` on menu |
| \`combobox-multi\` | multi | optional \`[showSearch]\` + show-selected panel |
| \`single-select\` | single | — |
| \`multi-select\` | multi | — |

Load \`components/ids-theme.css\` on the app root (\`data-design-system="ids"\`).
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

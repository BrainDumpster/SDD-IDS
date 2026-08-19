import { IdsDropdownComponent } from "../../../compiled/lib/angular/ids/dropdown/ids-dropdown.component.js";
import {
  dropdownStoryArgTypes,
  dropdownStoryDecorators,
  dropdownStoryParameters,
  DROPDOWN_COMPOSITION_STORY_PARAMS,
} from "./ids-dropdown.stories-meta.js";

/** @type {import("@storybook/angular").Meta<IdsDropdownComponent>} */
const meta = {
  title: "Spec Generated/IDS/Dropdown/Combo Box",
  component: IdsDropdownComponent,
  tags: ["autodocs"],
  decorators: dropdownStoryDecorators,
  parameters: dropdownStoryParameters,
  argTypes: dropdownStoryArgTypes,
};
export default meta;

export const CompositionApi = {
  name: "Composition API",
  parameters: DROPDOWN_COMPOSITION_STORY_PARAMS,
  render: () => ({
    props: {
      selected: "Compute",
      searchQuery: "",
    },
    template: `
      <div style="width:300px">
        <ids-dropdown mode="combobox-single" [value]="selected" (valueChange)="selected = $event">
          <ids-dropdown-menu [showSearch]="true" [defaultOpen]="true" [maxHeight]="220">
            <ids-dropdown-trigger-shell>
              <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
                {{ selected || 'Select product' }}
              </span>
            </ids-dropdown-trigger-shell>
            <ids-dropdown-menu-item value="Storage" label="Storage" />
            <ids-dropdown-menu-item value="Compute" label="Compute" />
            <ids-dropdown-menu-item value="Network" label="Network" />
            <ids-dropdown-menu-item value="Security" label="Security" />
          </ids-dropdown-menu>
          <ids-dropdown-helper>Choose one product</ids-dropdown-helper>
        </ids-dropdown>
      </div>
    `,
  }),
};

export const ComboboxMultiComposition = {
  name: "Combobox Multi — Composition",
  render: () => ({
    props: {
      selected: ["Storage", "Compute"],
      searchQuery: "",
    },
    template: `
      <div style="width:300px">
        <ids-dropdown mode="combobox-multi" [values]="selected" (valuesChange)="selected = $event">
          <ids-dropdown-menu
            [showSearch]="true"
            [searchValue]="searchQuery"
            (searchValueChange)="searchQuery = $event"
            [showSelectAllClearAll]="true"
            [selectAllChecked]="selected.length === 4"
            [selectAllIndeterminate]="selected.length > 0 && selected.length < 4"
            (selectAllClick)="selected = ['Storage','Compute','Network','Security']"
            (clearAllClick)="selected = []"
            [clearAllDisabled]="selected.length === 0"
            [showSelectedPanel]="true"
            [defaultShowSelectedExpanded]="true"
            (removeSelectedTag)="selected = selected.filter(v => v !== $event)"
            (showSelectedPanelClear)="selected = []"
            [defaultOpen]="true"
            [maxHeight]="220"
          >
            <ids-dropdown-trigger-shell>
              <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
                {{ selected.length ? selected.join(', ') : 'Select products' }}
              </span>
            </ids-dropdown-trigger-shell>
            <ids-dropdown-menu-item value="Storage" label="Storage" />
            <ids-dropdown-menu-item value="Compute" label="Compute" />
            <ids-dropdown-menu-item value="Network" label="Network" />
            <ids-dropdown-menu-item value="Security" label="Security" />
          </ids-dropdown-menu>
          <ids-dropdown-helper>Choose one or more products</ids-dropdown-helper>
        </ids-dropdown>
      </div>
    `,
  }),
};

export const ErrorState = {
  name: "Error State",
  render: () => ({
    props: { selected: "" },
    template: `
      <div style="width:360px">
        <ids-dropdown mode="combobox-single" [value]="selected" (valueChange)="selected = $event">
          <ids-dropdown-menu [showSearch]="true">
            <ids-dropdown-trigger-shell [error]="true">
              <span>{{ selected || '-Type or Select-' }}</span>
            </ids-dropdown-trigger-shell>
            <ids-dropdown-menu-item value="Storage" label="Storage" />
            <ids-dropdown-menu-item value="Compute" label="Compute" />
          </ids-dropdown-menu>
          <ids-dropdown-error>Error message</ids-dropdown-error>
        </ids-dropdown>
      </div>
    `,
  }),
};

export const DisabledState = {
  name: "Disabled State",
  render: () => ({
    template: `
      <div style="width:360px">
        <ids-dropdown mode="combobox-single" [disabled]="true" value="Storage">
          <ids-dropdown-menu [showSearch]="true" [disabled]="true">
            <ids-dropdown-trigger-shell [disabled]="true">
              <span>Storage</span>
            </ids-dropdown-trigger-shell>
            <ids-dropdown-menu-item value="Storage" label="Storage" />
            <ids-dropdown-menu-item value="Compute" label="Compute" />
          </ids-dropdown-menu>
          <ids-dropdown-helper>Component is disabled</ids-dropdown-helper>
        </ids-dropdown>
      </div>
    `,
  }),
};

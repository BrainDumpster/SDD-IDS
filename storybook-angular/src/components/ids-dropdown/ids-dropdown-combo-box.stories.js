import { IdsDropdownComponent } from "../../../compiled/lib/angular/ids/dropdown/ids-dropdown.component.js";
import {
  dropdownStoryArgTypes,
  dropdownMenuStoryArgTypes,
  dropdownStoryArgs,
  dropdownStoryDecorators,
  dropdownStoryParameters,
  DROPDOWN_COMPOSITION_STORY_PARAMS,
} from "./ids-dropdown.stories-meta.js";

/** @type {import("@storybook/angular").Meta<IdsDropdownComponent>} */
const meta = {
  title: "Components/IDS/Dropdown/Combo Box",
  component: IdsDropdownComponent,
  tags: ["autodocs"],
  decorators: dropdownStoryDecorators,
  parameters: dropdownStoryParameters,
  argTypes: {
    ...dropdownStoryArgTypes,
    ...dropdownMenuStoryArgTypes,
    mode: { table: { disable: true } },
    showSelectAllClearAll: { table: { disable: true } },
    showSelectedBadge: { table: { disable: true } },
    showSelectedTooltip: { table: { disable: true } },
    showSelectedPanel: { table: { disable: true } },
    selectAllLabel: { table: { disable: true } },
  },
  args: {
    ...dropdownStoryArgs,
    searchable: true,
    showClearAll: true,
  },
};
export default meta;

export const CompositionApi = {
  name: "Composition API",
  parameters: DROPDOWN_COMPOSITION_STORY_PARAMS,
  render: (args) => ({
    props: {
      ...args,
      selected: "Compute",
    },
    template: `
      <div style="width:300px">
        <ids-dropdown
          mode="combobox-single"
          [value]="selected"
          (valueChange)="selected = $event"
          [disabled]="disabled"
          [showRadio]="showRadio"
        >
          <ids-dropdown-menu
            [searchable]="searchable"
            [showSearch]="searchable"
            [showClearAll]="showClearAll"
            [clearAllLabel]="clearAllLabel"
            [menuWidth]="menuWidth"
            [defaultOpen]="defaultOpen"
            [fullWidth]="fullWidth"
            [showRadio]="showRadio"
            [disabled]="disabled"
            [maxVisibleItems]="maxVisibleItems"
            [noResultsLabel]="noResultsLabel"
            [searchPlaceholder]="searchPlaceholder"
            [ariaLabel]="ariaLabel || null"
            [ariaInvalid]="ariaInvalid"
            (clearAllClick)="selected = ''"
          >
            <ids-dropdown-trigger-shell [size]="size" [disabled]="disabled" [filled]="!!selected">
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
  args: {
    ...dropdownStoryArgs,
    searchable: true,
    showSelectAllClearAll: true,
    showSelectedBadge: true,
    showSelectedTooltip: true,
    showSelectedPanel: true,
  },
  argTypes: {
    showClearAll: { table: { disable: true } },
  },
  render: (args) => ({
    props: {
      ...args,
      selected: ["Storage", "Compute"],
      searchQuery: "",
      products: ["Storage", "Compute", "Network", "Security"],
      onSelectAll(visible) {
        if (visible?.length) {
          this.selected = [...new Set([...this.selected, ...visible])];
        } else {
          this.selected = [...this.products];
        }
      },
      onClearAll(visible) {
        if (visible?.length) {
          const drop = new Set(visible);
          this.selected = this.selected.filter((v) => !drop.has(v));
        } else {
          this.selected = [];
        }
      },
    },
    template: `
      <div style="width:300px;padding-top:80px">
        <ids-dropdown
          mode="combobox-multi"
          [values]="selected"
          (valuesChange)="selected = $event"
          [disabled]="disabled"
        >
          <ids-dropdown-menu
            [searchable]="searchable" [showSearch]="searchable"
            [menuWidth]="menuWidth"
            [defaultOpen]="defaultOpen"
            [fullWidth]="fullWidth"
            [disabled]="disabled"
            [searchValue]="searchQuery"
            (searchValueChange)="searchQuery = $event"
            [showSelectAllClearAll]="showSelectAllClearAll"
            [selectAllLabel]="selectAllLabel"
            [clearAllLabel]="clearAllLabel"
            [clearAllDisabled]="clearAllDisabled"
            [maxVisibleItems]="maxVisibleItems"
            [noResultsLabel]="noResultsLabel"
            [searchPlaceholder]="searchPlaceholder"
            [ariaLabel]="ariaLabel || null"
            [ariaInvalid]="ariaInvalid"
            [selectAllChecked]="selected.length === 4"
            [selectAllIndeterminate]="selected.length > 0 && selected.length < 4"
            (selectAllClick)="onSelectAll($event)"
            (clearAllClick)="onClearAll($event)"
            [showSelectedPanel]="showSelectedPanel"
            [defaultShowSelectedExpanded]="true"
            (removeSelectedTag)="selected = selected.filter(v => v !== $event)"
            (showSelectedPanelClear)="selected = []"
          >
            <ids-dropdown-trigger-shell
              [size]="size"
              [disabled]="disabled"
              [filled]="selected.length > 0"
              [showSelectedBadge]="showSelectedBadge"
              [showSelectedTooltip]="showSelectedTooltip"
              [selectedLabels]="selected"
            >
              <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0">
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
  parameters: { controls: { disable: true } },
  render: () => ({
    props: { selected: "" },
    template: `
      <div style="width:360px">
        <ids-dropdown mode="combobox-single" [value]="selected" (valueChange)="selected = $event">
          <ids-dropdown-menu [searchable]="true">
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
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div style="width:360px">
        <ids-dropdown mode="combobox-single" [disabled]="true" value="Storage">
          <ids-dropdown-menu [searchable]="true" [disabled]="true">
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

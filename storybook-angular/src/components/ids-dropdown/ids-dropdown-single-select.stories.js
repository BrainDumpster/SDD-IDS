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
  title: "Components/IDS/Dropdown/Single Select",
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
    clearAllDisabled: { table: { disable: true } },
  },
  args: {
    ...dropdownStoryArgs,
    showRadio: true,
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
      selected: "Option 2",
      actionEvent: "None",
    },
    template: `
      <div style="width:1300px;display:flex;gap:18px;flex-wrap:wrap;align-items:flex-start">
        <div style="width:300px;display:grid;gap:6px">
          <div style="color:var(--annotation);font-size:24px">Small menu</div>
          <ids-dropdown
            mode="single-select"
            [value]="selected"
            (valueChange)="selected = $event"
            [disabled]="disabled"
            [showRadio]="showRadio"
          >
            <ids-dropdown-menu
              [defaultOpen]="defaultOpen"
              [maxVisibleItems]="maxVisibleItems"
              [noResultsLabel]="noResultsLabel"
              [searchPlaceholder]="searchPlaceholder"
              [showRadio]="showRadio"
              [searchable]="searchable" [showSearch]="searchable"
              [showClearAll]="showClearAll"
              [clearAllLabel]="clearAllLabel"
              [menuWidth]="menuWidth"
              [fullWidth]="fullWidth"
              [disabled]="disabled"
              [ariaLabel]="ariaLabel || null"
              [ariaInvalid]="ariaInvalid"
              (clearAllClick)="selected = ''"
            >
              <ids-dropdown-trigger-shell [size]="size" [disabled]="disabled">
                <span>{{ selected }}</span>
              </ids-dropdown-trigger-shell>
              <ids-dropdown-menu-item value="Option 1" label="Option 1" />
              <ids-dropdown-menu-item value="Option 2" label="Option 2" />
              <ids-dropdown-menu-item value="Option 3" label="Option 3" [disabled]="true" />
              <ids-dropdown-menu-item value="Option 4" label="Option 4" />
            </ids-dropdown-menu>
          </ids-dropdown>
        </div>

        <div style="width:300px;display:grid;gap:6px">
          <div style="color:var(--annotation);font-size:24px">Section header</div>
          <ids-dropdown
            mode="single-select"
            [value]="selected"
            (valueChange)="selected = $event"
            [disabled]="disabled"
            [showRadio]="showRadio"
          >
            <ids-dropdown-menu
              [defaultOpen]="defaultOpen"
              [maxVisibleItems]="maxVisibleItems"
              [noResultsLabel]="noResultsLabel"
              [searchPlaceholder]="searchPlaceholder"
              [showRadio]="showRadio"
              [searchable]="searchable" [showSearch]="searchable"
              [showClearAll]="showClearAll"
              [clearAllLabel]="clearAllLabel"
              [menuWidth]="menuWidth"
              [fullWidth]="fullWidth"
              [disabled]="disabled"
              [ariaLabel]="ariaLabel || null"
              [ariaInvalid]="ariaInvalid"
              (clearAllClick)="selected = ''"
            >
              <ids-dropdown-trigger-shell [size]="size" [disabled]="disabled">
                <span>{{ selected }}</span>
              </ids-dropdown-trigger-shell>
              <ids-dropdown-menu-group groupName="Section Title">
                <ids-dropdown-menu-item value="Option 1" label="Option 1" />
                <ids-dropdown-menu-item value="Option 2" label="Option 2" />
                <ids-dropdown-menu-item value="Option 3" label="Option 3" />
              </ids-dropdown-menu-group>
              <ids-dropdown-menu-group groupName="Section Title">
                <ids-dropdown-menu-item value="Option 4" label="Option 4" />
                <ids-dropdown-menu-item value="Option 5" label="Option 5" />
                <ids-dropdown-menu-item value="Option 6" label="Option 6" />
              </ids-dropdown-menu-group>
            </ids-dropdown-menu>
          </ids-dropdown>
        </div>

        <div style="width:300px;display:grid;gap:6px">
          <div style="color:var(--annotation);font-size:24px">Action button</div>
          <ids-dropdown
            mode="single-select"
            [value]="selected"
            (valueChange)="selected = $event"
            [disabled]="disabled"
            [showRadio]="showRadio"
          >
            <ids-dropdown-menu
              [defaultOpen]="defaultOpen"
              [maxVisibleItems]="maxVisibleItems"
              [noResultsLabel]="noResultsLabel"
              [searchPlaceholder]="searchPlaceholder"
              [showRadio]="showRadio"
              [searchable]="searchable" [showSearch]="searchable"
              [showClearAll]="showClearAll"
              [clearAllLabel]="clearAllLabel"
              [menuWidth]="menuWidth"
              [fullWidth]="fullWidth"
              [disabled]="disabled"
              [ariaLabel]="ariaLabel || null"
              [ariaInvalid]="ariaInvalid"
              (clearAllClick)="selected = ''"
            >
              <ids-dropdown-trigger-shell [size]="size" [disabled]="disabled">
                <span>{{ selected }}</span>
              </ids-dropdown-trigger-shell>
              <ids-dropdown-menu-item value="Option 1" label="Option 1" />
              <ids-dropdown-menu-item value="Option 2" label="Option 2" />
              <ids-dropdown-menu-item value="Option 3" label="Option 3" />
              <ids-dropdown-menu-footer actionLabel="Action" (action)="actionEvent = 'Action clicked'" />
            </ids-dropdown-menu>
            <ids-dropdown-helper>onActionClick: {{ actionEvent }}</ids-dropdown-helper>
          </ids-dropdown>
        </div>
      </div>
    `,
  }),
};

export const HelperError = {
  name: "Helper + Error",
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div style="width:332px;display:grid;gap:16px">
        <ids-dropdown mode="single-select" value="Option 2">
          <ids-dropdown-menu [defaultOpen]="true" [maxHeight]="220">
            <ids-dropdown-trigger-shell>
              <span>Option 2</span>
            </ids-dropdown-trigger-shell>
            <ids-dropdown-menu-item value="Option 1" label="Option 1" />
            <ids-dropdown-menu-item value="Option 2" label="Option 2" />
          </ids-dropdown-menu>
          <ids-dropdown-helper>Helper text</ids-dropdown-helper>
        </ids-dropdown>

        <ids-dropdown mode="single-select">
          <ids-dropdown-menu>
            <ids-dropdown-trigger-shell [error]="true">
              <span>-Select-</span>
            </ids-dropdown-trigger-shell>
            <ids-dropdown-menu-item value="Option 1" label="Option 1" />
          </ids-dropdown-menu>
          <ids-dropdown-error>Error message</ids-dropdown-error>
        </ids-dropdown>
      </div>
    `,
  }),
};

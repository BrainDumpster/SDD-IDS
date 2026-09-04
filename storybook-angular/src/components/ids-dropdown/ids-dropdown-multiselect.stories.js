import { IdsDropdownComponent } from "../../../compiled/lib/angular/ids/dropdown/ids-dropdown.component.js";
import {
  dropdownStoryArgTypes,
  dropdownMenuStoryArgTypes,
  dropdownStoryArgs,
  dropdownStoryDecorators,
  dropdownStoryParameters,
  DROPDOWN_COMPOSITION_STORY_PARAMS,
} from "./ids-dropdown.stories-meta.js";

const ALL_SIX = ["Option 1", "Option 2", "Option 3", "Option 4", "Option 5", "Option 6"];
const ALL_TWELVE = [
  "Option 1",
  "Option 2",
  "Option 3",
  "Option 4",
  "Option 5",
  "Option 6",
  "Option 7",
  "Option 8",
  "Option 9",
  "Option 10",
  "Option 11",
  "Option 12",
];

/** @type {import("@storybook/angular").Meta<IdsDropdownComponent>} */
const meta = {
  title: "Components/IDS/Dropdown/Multi Select",
  component: IdsDropdownComponent,
  tags: ["autodocs"],
  decorators: dropdownStoryDecorators,
  parameters: dropdownStoryParameters,
  argTypes: {
    ...dropdownStoryArgTypes,
    ...dropdownMenuStoryArgTypes,
    mode: { table: { disable: true } },
    showRadio: { table: { disable: true } },
    showClearAll: { table: { disable: true } },
    showSelectedPanel: { table: { disable: true } },
  },
  args: {
    ...dropdownStoryArgs,
    searchable: true,
    showSelectAllClearAll: true,
    showSelectedBadge: true,
    showSelectedTooltip: true,
  },
};
export default meta;

export const CompositionApi = {
  name: "Composition API",
  parameters: DROPDOWN_COMPOSITION_STORY_PARAMS,
  render: (args) => ({
    props: {
      ...args,
      smallSelected: ["Option 1", "Option 2"],
      sectionSelected: ["Option 2"],
      actionSelected: ["Option 2"],
      actionEvent: "None",
      onSelectAll(field, visible) {
        const all = field === "actionSelected" ? ALL_TWELVE : ALL_SIX;
        if (visible?.length) {
          const next = new Set([...this[field], ...visible]);
          this[field] = [...next];
        } else {
          this[field] = [...all];
        }
      },
      onClearAll(field, visible) {
        if (visible?.length) {
          const drop = new Set(visible);
          this[field] = this[field].filter((v) => !drop.has(v));
        } else {
          this[field] = [];
        }
      },
    },
    template: `
      <div style="width:1350px;display:flex;gap:18px;flex-wrap:wrap;align-items:flex-start;padding-top:80px">
        <div style="width:300px;display:grid;gap:6px">
          <div style="color:var(--annotation);font-size:24px">With selection</div>
          <ids-dropdown
            mode="multi-select"
            [values]="smallSelected"
            (valuesChange)="smallSelected = $event"
            [disabled]="disabled"
          >
            <ids-dropdown-menu
              [defaultOpen]="defaultOpen"
              [searchable]="searchable" [showSearch]="searchable"
              [menuWidth]="menuWidth"
              [fullWidth]="fullWidth"
              [disabled]="disabled"
              [showSelectAllClearAll]="showSelectAllClearAll"
              [selectAllLabel]="selectAllLabel"
              [clearAllLabel]="clearAllLabel"
              [clearAllDisabled]="clearAllDisabled"
              [maxVisibleItems]="maxVisibleItems"
              [noResultsLabel]="noResultsLabel"
              [searchPlaceholder]="searchPlaceholder"
              [ariaLabel]="ariaLabel || null"
              [ariaInvalid]="ariaInvalid"
              [selectAllChecked]="smallSelected.length === 6"
              [selectAllIndeterminate]="smallSelected.length > 0 && smallSelected.length < 6"
              (selectAllClick)="onSelectAll('smallSelected', $event)"
              (clearAllClick)="onClearAll('smallSelected', $event)"
            >
              <ids-dropdown-trigger-shell
                [size]="size"
                [disabled]="disabled"
                [filled]="smallSelected.length > 0"
                [showSelectedBadge]="showSelectedBadge"
                [showSelectedTooltip]="showSelectedTooltip"
                [selectedLabels]="smallSelected"
              >
                <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0">
                  {{ smallSelected.length ? smallSelected.join(', ') : '-Select-' }}
                </span>
              </ids-dropdown-trigger-shell>
              <ids-dropdown-menu-item value="Option 1" label="Option 1" />
              <ids-dropdown-menu-item value="Option 2" label="Option 2" />
              <ids-dropdown-menu-item value="Option 3" label="Option 3" />
              <ids-dropdown-menu-item value="Option 4" label="Option 4" />
              <ids-dropdown-menu-item value="Option 5" label="Option 5" />
              <ids-dropdown-menu-item value="Option 6" label="Option 6" />
            </ids-dropdown-menu>
          </ids-dropdown>
        </div>

        <div style="width:300px;display:grid;gap:6px">
          <div style="color:var(--annotation);font-size:24px">Section headers</div>
          <ids-dropdown
            mode="multi-select"
            [values]="sectionSelected"
            (valuesChange)="sectionSelected = $event"
            [disabled]="disabled"
          >
            <ids-dropdown-menu
              [defaultOpen]="defaultOpen"
              [searchable]="searchable" [showSearch]="searchable"
              [menuWidth]="menuWidth"
              [fullWidth]="fullWidth"
              [disabled]="disabled"
              [showSelectAllClearAll]="showSelectAllClearAll"
              [selectAllLabel]="selectAllLabel"
              [clearAllLabel]="clearAllLabel"
              [clearAllDisabled]="clearAllDisabled"
              [maxVisibleItems]="maxVisibleItems"
              [noResultsLabel]="noResultsLabel"
              [searchPlaceholder]="searchPlaceholder"
              [ariaLabel]="ariaLabel || null"
              [ariaInvalid]="ariaInvalid"
              (selectAllClick)="onSelectAll('sectionSelected', $event)"
              (clearAllClick)="onClearAll('sectionSelected', $event)"
            >
              <ids-dropdown-trigger-shell
                [size]="size"
                [disabled]="disabled"
                [filled]="sectionSelected.length > 0"
                [showSelectedBadge]="showSelectedBadge"
                [showSelectedTooltip]="showSelectedTooltip"
                [selectedLabels]="sectionSelected"
              >
                <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0">
                  {{ sectionSelected.join(', ') || '-Select-' }}
                </span>
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
            mode="multi-select"
            [values]="actionSelected"
            (valuesChange)="actionSelected = $event"
            [disabled]="disabled"
          >
            <ids-dropdown-menu
              [defaultOpen]="defaultOpen"
              [searchable]="searchable" [showSearch]="searchable"
              [menuWidth]="menuWidth"
              [fullWidth]="fullWidth"
              [disabled]="disabled"
              [showSelectAllClearAll]="showSelectAllClearAll"
              [selectAllLabel]="selectAllLabel"
              [clearAllLabel]="clearAllLabel"
              [clearAllDisabled]="clearAllDisabled"
              [maxVisibleItems]="maxVisibleItems"
              [noResultsLabel]="noResultsLabel"
              [searchPlaceholder]="searchPlaceholder"
              [ariaLabel]="ariaLabel || null"
              [ariaInvalid]="ariaInvalid"
              (selectAllClick)="onSelectAll('actionSelected', $event)"
              (clearAllClick)="onClearAll('actionSelected', $event)"
            >
              <ids-dropdown-trigger-shell
                [size]="size"
                [disabled]="disabled"
                [filled]="actionSelected.length > 0"
                [showSelectedBadge]="showSelectedBadge"
                [showSelectedTooltip]="showSelectedTooltip"
                [selectedLabels]="actionSelected"
              >
                <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0">
                  {{ actionSelected.join(', ') }}
                </span>
              </ids-dropdown-trigger-shell>
              <ids-dropdown-menu-item value="Option 1" label="Option 1" />
              <ids-dropdown-menu-item value="Option 2" label="Option 2" />
              <ids-dropdown-menu-item value="Option 3" label="Option 3" />
              <ids-dropdown-menu-item value="Option 4" label="Option 4" />
              <ids-dropdown-menu-item value="Option 5" label="Option 5" />
              <ids-dropdown-menu-item value="Option 6" label="Option 6" />
              <ids-dropdown-menu-item value="Option 7" label="Option 7" />
              <ids-dropdown-menu-item value="Option 8" label="Option 8" />
              <ids-dropdown-menu-item value="Option 9" label="Option 9" />
              <ids-dropdown-menu-item value="Option 10" label="Option 10" />
              <ids-dropdown-menu-item value="Option 11" label="Option 11" />
              <ids-dropdown-menu-item value="Option 12" label="Option 12" />
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
    props: { selected: ["Option 1", "Option 2"] },
    template: `
      <div style="width:640px;display:flex;gap:16px;padding-top:80px">
        <div style="width:300px">
          <ids-dropdown mode="multi-select" [values]="selected" (valuesChange)="selected = $event" [disabled]="true">
            <ids-dropdown-menu [showSelectAllClearAll]="true" [disabled]="true" (clearAllClick)="selected = []">
              <ids-dropdown-trigger-shell
                [disabled]="true"
                [filled]="true"
                [showSelectedBadge]="true"
                [showSelectedTooltip]="true"
                [selectedLabels]="selected"
              >
                <span>Items selected</span>
              </ids-dropdown-trigger-shell>
              <ids-dropdown-menu-item value="Option 1" label="Option 1" />
              <ids-dropdown-menu-item value="Option 2" label="Option 2" />
            </ids-dropdown-menu>
            <ids-dropdown-helper>Helper text</ids-dropdown-helper>
          </ids-dropdown>
        </div>
        <div style="width:300px">
          <ids-dropdown mode="multi-select" [values]="selected" (valuesChange)="selected = $event">
            <ids-dropdown-menu [showSelectAllClearAll]="true" [ariaInvalid]="true">
              <ids-dropdown-trigger-shell
                [error]="true"
                [filled]="true"
                [showSelectedBadge]="true"
                [showSelectedTooltip]="true"
                [selectedLabels]="selected"
              >
                <span>Items selected</span>
              </ids-dropdown-trigger-shell>
              <ids-dropdown-menu-item value="Option 1" label="Option 1" />
              <ids-dropdown-menu-item value="Option 2" label="Option 2" />
            </ids-dropdown-menu>
            <ids-dropdown-error>Error message</ids-dropdown-error>
          </ids-dropdown>
        </div>
      </div>
    `,
  }),
};

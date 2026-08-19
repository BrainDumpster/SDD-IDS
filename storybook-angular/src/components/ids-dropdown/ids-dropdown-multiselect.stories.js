import { IdsDropdownComponent } from "../../../compiled/lib/angular/ids/dropdown/ids-dropdown.component.js";
import {
  dropdownStoryArgTypes,
  dropdownStoryDecorators,
  dropdownStoryParameters,
  DROPDOWN_COMPOSITION_STORY_PARAMS,
} from "./ids-dropdown.stories-meta.js";

/** @type {import("@storybook/angular").Meta<IdsDropdownComponent>} */
const meta = {
  title: "Spec Generated/IDS/Dropdown/Multi Select",
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
      smallSelected: [],
      sectionSelected: ["Option 2"],
      actionSelected: ["Option 2"],
      actionEvent: "None",
    },
    template: `
      <div style="width:1350px;display:flex;gap:18px;flex-wrap:wrap;align-items:flex-start">
        <div style="width:300px;display:grid;gap:6px">
          <div style="color:var(--annotation);font-size:24px">No items selected</div>
          <ids-dropdown mode="multi-select" [values]="smallSelected" (valuesChange)="smallSelected = $event">
            <ids-dropdown-menu
              [defaultOpen]="true"
              [maxHeight]="220"
              [showSelectAllClearAll]="true"
              [selectAllChecked]="smallSelected.length === 6"
              [selectAllIndeterminate]="smallSelected.length > 0 && smallSelected.length < 6"
              (selectAllClick)="smallSelected = ['Option 1','Option 2','Option 3','Option 4','Option 5','Option 6']"
              (clearAllClick)="smallSelected = []"
              [clearAllDisabled]="smallSelected.length === 0"
            >
              <ids-dropdown-trigger-shell>
                <span>{{ smallSelected.length ? smallSelected.join(', ') : '-Select-' }}</span>
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
          <ids-dropdown mode="multi-select" [values]="sectionSelected" (valuesChange)="sectionSelected = $event">
            <ids-dropdown-menu [defaultOpen]="true" [maxHeight]="220" [showSelectAllClearAll]="true"
              (selectAllClick)="sectionSelected = ['Option 1','Option 2','Option 3','Option 4','Option 5','Option 6']"
              (clearAllClick)="sectionSelected = []"
              [clearAllDisabled]="sectionSelected.length === 0">
              <ids-dropdown-trigger-shell>
                <span>{{ sectionSelected.join(', ') || '-Select-' }}</span>
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
          <ids-dropdown mode="multi-select" [values]="actionSelected" (valuesChange)="actionSelected = $event">
            <ids-dropdown-menu [defaultOpen]="true" [maxHeight]="180" [showSelectAllClearAll]="true"
              (selectAllClick)="actionSelected = ['Option 1','Option 2','Option 3','Option 4','Option 5','Option 6','Option 7','Option 8','Option 9','Option 10','Option 11','Option 12']"
              (clearAllClick)="actionSelected = []"
              [clearAllDisabled]="actionSelected.length === 0">
              <ids-dropdown-trigger-shell>
                <span>{{ actionSelected.join(', ') }}</span>
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
  render: () => ({
    props: { selected: ["Option 1", "Option 2"] },
    template: `
      <div style="width:640px;display:flex;gap:16px">
        <div style="width:300px">
          <ids-dropdown mode="multi-select" [values]="selected" (valuesChange)="selected = $event" [disabled]="true">
            <ids-dropdown-menu [showSelectAllClearAll]="true" [disabled]="true" (clearAllClick)="selected = []">
              <ids-dropdown-trigger-shell [disabled]="true">
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
            <ids-dropdown-menu [showSelectAllClearAll]="true">
              <ids-dropdown-trigger-shell [error]="true">
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

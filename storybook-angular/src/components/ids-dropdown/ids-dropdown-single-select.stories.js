import { IdsDropdownComponent } from "../../../compiled/storybook-angular/src/components/ids-dropdown/ids-dropdown.component.js";
import {
  dropdownStoryArgTypes,
  dropdownStoryDecorators,
  dropdownStoryParameters,
  DROPDOWN_COMPOSITION_STORY_PARAMS,
} from "./ids-dropdown.stories-meta.js";

/** @type {import("@storybook/angular").Meta<IdsDropdownComponent>} */
const meta = {
  title: "Spec Generated/IDS/Dropdown/Single Select",
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
      selected: "Option 2",
      actionEvent: "None",
    },
    template: `
      <div style="width:1300px;display:flex;gap:18px;flex-wrap:wrap;align-items:flex-start">
        <div style="width:300px;display:grid;gap:6px">
          <div style="color:var(--annotation);font-size:24px">Small menu</div>
          <ids-dropdown mode="single-select" [value]="selected" (valueChange)="selected = $event" [showSingleSelectRadio]="true">
            <ids-dropdown-menu [defaultOpen]="true" [maxHeight]="220" [showSingleSelectRadio]="true">
              <ids-dropdown-trigger-shell>
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
          <ids-dropdown mode="single-select" [value]="selected" (valueChange)="selected = $event" [showSingleSelectRadio]="true">
            <ids-dropdown-menu [defaultOpen]="true" [maxHeight]="220" [showSingleSelectRadio]="true">
              <ids-dropdown-trigger-shell>
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
          <ids-dropdown mode="single-select" [value]="selected" (valueChange)="selected = $event" [showSingleSelectRadio]="true">
            <ids-dropdown-menu [defaultOpen]="true" [maxHeight]="180" [showSingleSelectRadio]="true">
              <ids-dropdown-trigger-shell>
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

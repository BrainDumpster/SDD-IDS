import { applicationConfig, moduleMetadata } from "@storybook/angular";
import { provideZoneChangeDetection } from "@angular/core";
import { SPEC_ACCURATE_DESIGN_STORY } from "../../../compiled/component-contracts/common/story-meta.js";
import { DROPDOWN_BUTTON_SPEC_ACCURATE_DEFAULTS } from "../../../compiled/component-contracts/ids/dropdown-button.contract.js";
import { IdsDropdownButtonComponent } from "../../../compiled/lib/angular/ids/dropdown-button/ids-dropdown-button.component.js";
import { IDS_DROPDOWN_BUTTON_IMPORTS } from "../../../compiled/lib/angular/ids/dropdown-button/index.js";
import {
  DROPDOWN_BUTTON_DOCS_DESCRIPTION,
  DROPDOWN_BUTTON_ICON_ONLY_TEMPLATE,
  DROPDOWN_BUTTON_SOURCE_CODE,
  DROPDOWN_BUTTON_SPEC_TEMPLATE,
  DROPDOWN_BUTTON_STORY_SOURCE_CODE,
  DROPDOWN_BUTTON_WITH_ICON_TEMPLATE,
} from "./ids-dropdown-button.developer-usage.js";

/** @type {import("@storybook/angular").Meta<IdsDropdownButtonComponent>} */
const meta = {
  title: "Spec Generated/IDS/Dropdown Button",
  component: IdsDropdownButtonComponent,
  tags: ["autodocs"],
  decorators: [
    applicationConfig({
      providers: [provideZoneChangeDetection()],
    }),
    moduleMetadata({
      imports: [...IDS_DROPDOWN_BUTTON_IMPORTS],
    }),
  ],
  parameters: {
    layout: "centered",
    docs: {
      canvas: { sourceState: "open" },
      description: { component: DROPDOWN_BUTTON_DOCS_DESCRIPTION },
      source: {
        type: "code",
        language: "typescript",
        code: DROPDOWN_BUTTON_SOURCE_CODE,
      },
    },
  },
  argTypes: {
    buttonStyle: { control: "select", options: ["primary", "secondary", "tertiary"] },
    size: { control: "select", options: ["small", "medium", "large"] },
    disabled: { control: "boolean" },
    label: { control: "text" },
    showLeadingIcon: { control: "boolean" },
    iconOnly: { control: "boolean" },
    ariaLabel: { control: "text" },
    openChange: { action: "openChange" },
    selectionChange: { action: "selectionChange" },
  },
};

export default meta;

/** @type {import("@storybook/angular").StoryObj<IdsDropdownButtonComponent>} */
export const SpecAccurateDesign = {
  name: SPEC_ACCURATE_DESIGN_STORY,
  parameters: {
    docs: {
      description: {
        story:
          "Spec Accurate Design: primary, medium, label-only trigger with three single-select menu items.",
      },
      source: {
        type: "code",
        language: "html",
        code: DROPDOWN_BUTTON_STORY_SOURCE_CODE,
      },
    },
  },
  render: (args) => ({
    props: args,
    template: DROPDOWN_BUTTON_SPEC_TEMPLATE,
  }),
  args: {
    buttonStyle: DROPDOWN_BUTTON_SPEC_ACCURATE_DEFAULTS.buttonStyle,
    size: DROPDOWN_BUTTON_SPEC_ACCURATE_DEFAULTS.size,
    disabled: DROPDOWN_BUTTON_SPEC_ACCURATE_DEFAULTS.disabled,
    label: DROPDOWN_BUTTON_SPEC_ACCURATE_DEFAULTS.label,
    showLeadingIcon: DROPDOWN_BUTTON_SPEC_ACCURATE_DEFAULTS.showLeadingIcon,
    iconOnly: DROPDOWN_BUTTON_SPEC_ACCURATE_DEFAULTS.iconOnly,
    ariaLabel: DROPDOWN_BUTTON_SPEC_ACCURATE_DEFAULTS.ariaLabel,
  },
};

/** @type {import("@storybook/angular").StoryObj<IdsDropdownButtonComponent>} */
export const WithLeadingIcon = {
  render: (args) => ({
    props: args,
    template: DROPDOWN_BUTTON_WITH_ICON_TEMPLATE,
  }),
  args: {
    buttonStyle: "primary",
    size: "medium",
    disabled: false,
    label: "Settings",
    ariaLabel: "Settings menu",
  },
};

/** @type {import("@storybook/angular").StoryObj<IdsDropdownButtonComponent>} */
export const IconOnly = {
  render: (args) => ({
    props: args,
    template: DROPDOWN_BUTTON_ICON_ONLY_TEMPLATE,
  }),
  args: {
    buttonStyle: "secondary",
    size: "medium",
    disabled: false,
    ariaLabel: "Dropdown actions",
  },
};

/** @type {import("@storybook/angular").StoryObj<IdsDropdownButtonComponent>} */
export const VariantMatrix = {
  render: () => ({
    template: `
      <div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap;">
        <ids-dropdown-button buttonStyle="primary" size="medium">
          <ids-dropdown-button-trigger label="Primary" />
          <ids-dropdown-button-menu>
            <ids-dropdown-button-menu-item value="option-1" label="Option 1" />
            <ids-dropdown-button-menu-item value="option-2" label="Option 2" />
          </ids-dropdown-button-menu>
        </ids-dropdown-button>

        <ids-dropdown-button buttonStyle="secondary" size="medium">
          <ids-dropdown-button-trigger label="Secondary" />
          <ids-dropdown-button-menu>
            <ids-dropdown-button-menu-item value="option-1" label="Option 1" />
            <ids-dropdown-button-menu-item value="option-2" label="Option 2" />
          </ids-dropdown-button-menu>
        </ids-dropdown-button>

        <ids-dropdown-button buttonStyle="tertiary" size="medium">
          <ids-dropdown-button-trigger label="Tertiary" />
          <ids-dropdown-button-menu>
            <ids-dropdown-button-menu-item value="option-1" label="Option 1" />
            <ids-dropdown-button-menu-item value="option-2" label="Option 2" />
          </ids-dropdown-button-menu>
        </ids-dropdown-button>
      </div>
    `,
  }),
};

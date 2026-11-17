import { applicationConfig, moduleMetadata } from "@storybook/angular";
import { provideZoneChangeDetection } from "@angular/core";
import { SPEC_ACCURATE_DESIGN_STORY } from "../../../compiled/component-contracts/common/story-meta.js";
import { ICON_BUTTON_SPEC_ACCURATE_DEFAULTS } from "../../../compiled/component-contracts/ids/icon-button.contract.js";
import { IdsIconButtonComponent } from "../../../compiled/lib/angular/ids/icon-button/ids-icon-button.component.js";
import { IDS_ICON_BUTTON_IMPORTS } from "../../../compiled/lib/angular/ids/icon-button/index.js";
import {
  ICON_BUTTON_COMPOSITION_DEMO_TEMPLATE,
  ICON_BUTTON_DOCS_DESCRIPTION,
  ICON_BUTTON_SOURCE_CODE,
  ICON_BUTTON_STORY_SOURCE_CODE,
} from "./ids-icon-button.developer-usage.js";

/** @type {import("@storybook/angular").Meta<IdsIconButtonComponent>} */
const meta = {
  title: "Components/IDS/Icon Button",
  component: IdsIconButtonComponent,
  tags: ["autodocs"],
  decorators: [
    applicationConfig({
      providers: [provideZoneChangeDetection()],
    }),
    moduleMetadata({
      imports: [...IDS_ICON_BUTTON_IMPORTS],
    }),
  ],
  parameters: {
    layout: "centered",
    docs: {
      canvas: { sourceState: "open" },
      description: { component: ICON_BUTTON_DOCS_DESCRIPTION },
      source: {
        type: "code",
        language: "typescript",
        code: ICON_BUTTON_SOURCE_CODE,
      },
    },
  },
  argTypes: {
    shape: { control: "text" },
    variant: {
      control: "select",
      options: ["primary", "secondary", "tertiary", "ghostNeutral"],
    },
    size: { control: "select", options: ["sm", "md", "lg"] },
    disabled: { control: "boolean" },
    loading: { control: "boolean" },
    ariaLabel: { control: "text" },
    /** Design-spec `onClick` → Angular `(clicked)`. */
    clicked: { action: "clicked" },
  },
};

export default meta;

/** @type {import("@storybook/angular").StoryObj<IdsIconButtonComponent>} */
export const SpecAccurateDesign = {
  name: SPEC_ACCURATE_DESIGN_STORY,
  parameters: {
    docs: {
      description: {
        story: "Spec Accurate Design: primary · large · shape-plus.",
      },
      source: {
        type: "code",
        language: "html",
        code: ICON_BUTTON_STORY_SOURCE_CODE,
      },
    },
  },
  render: (args) => ({
    props: args,
    template: ICON_BUTTON_COMPOSITION_DEMO_TEMPLATE,
  }),
  args: {
    shape: ICON_BUTTON_SPEC_ACCURATE_DEFAULTS.shape,
    variant: ICON_BUTTON_SPEC_ACCURATE_DEFAULTS.variant,
    size: ICON_BUTTON_SPEC_ACCURATE_DEFAULTS.size,
    disabled: ICON_BUTTON_SPEC_ACCURATE_DEFAULTS.disabled,
    loading: ICON_BUTTON_SPEC_ACCURATE_DEFAULTS.loading,
    ariaLabel: ICON_BUTTON_SPEC_ACCURATE_DEFAULTS.ariaLabel,
  },
};

/** @type {import("@storybook/angular").StoryObj<IdsIconButtonComponent>} */
export const Variants = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 12px; flex-wrap: wrap;">
        <ids-icon-button shape="shape-plus" variant="primary" size="lg" ariaLabel="Primary" />
        <ids-icon-button shape="shape-plus" variant="secondary" size="lg" ariaLabel="Secondary" />
        <ids-icon-button shape="shape-plus" variant="tertiary" size="lg" ariaLabel="Tertiary" />
        <ids-icon-button shape="shape-plus" variant="ghostNeutral" size="lg" ariaLabel="Ghost Neutral" />
      </div>
    `,
  }),
};

/** @type {import("@storybook/angular").StoryObj<IdsIconButtonComponent>} */
export const Sizes = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
        <ids-icon-button shape="shape-plus" variant="primary" size="sm" ariaLabel="Small" />
        <ids-icon-button shape="shape-plus" variant="primary" size="md" ariaLabel="Medium" />
        <ids-icon-button shape="shape-plus" variant="primary" size="lg" ariaLabel="Large" />
      </div>
    `,
  }),
};

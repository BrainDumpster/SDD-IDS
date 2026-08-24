import { applicationConfig, moduleMetadata } from "@storybook/angular";
import { provideZoneChangeDetection } from "@angular/core";
import { SPEC_ACCURATE_DESIGN_STORY } from "../../../compiled/component-contracts/common/story-meta.js";
import {
  IDS_SLIDER_DESIGN_SPEC_PATH,
  SLIDER_MODES,
  SLIDER_SPEC_ACCURATE_DEFAULTS,
} from "../../../compiled/component-contracts/ids/slider.contract.js";
import { IdsSliderComponent } from "../../../compiled/lib/angular/ids/slider/ids-slider.component.js";
import { IDS_SLIDER_IMPORTS } from "../../../compiled/lib/angular/ids/slider/index.js";
import {
  SLIDER_COMPOSITION_DEMO_TEMPLATE,
  SLIDER_DOCS_DESCRIPTION,
  SLIDER_SOURCE_CODE,
  SLIDER_STORY_SOURCE_CODE,
} from "./ids-slider.developer-usage.js";

/** @type {import("@storybook/angular").Meta<IdsSliderComponent>} */
const meta = {
  title: "Components/IDS/Slider",
  component: IdsSliderComponent,
  tags: ["autodocs"],
  decorators: [
    applicationConfig({
      providers: [provideZoneChangeDetection()],
    }),
    moduleMetadata({
      imports: [...IDS_SLIDER_IMPORTS],
    }),
  ],
  parameters: {
    layout: "padded",
    docs: {
      canvas: { sourceState: "open" },
      description: {
        component:
          SLIDER_DOCS_DESCRIPTION +
          ` Path: \`${IDS_SLIDER_DESIGN_SPEC_PATH}\`.`,
      },
      source: {
        type: "code",
        language: "typescript",
        code: SLIDER_SOURCE_CODE,
      },
    },
  },
  argTypes: {
    mode: { control: "select", options: [...SLIDER_MODES] },
    min: { control: "number" },
    max: { control: "number" },
    step: { control: "number" },
    disabled: { control: "boolean" },
    showStepper: { control: "boolean" },
    showTicks: { control: "boolean" },
    stepperFrequency: { control: "number" },
    showValueLabel: { control: "boolean" },
    showValueInput: { control: "boolean" },
    minLabel: { control: "text" },
    maxLabel: { control: "text" },
    onValueChange: { action: "onValueChange" },
    onValueCommit: { action: "onValueCommit" },
  },
};

export default meta;

/** @type {import("@storybook/angular").StoryObj<IdsSliderComponent>} */
export const SpecAccurateDesign = {
  name: SPEC_ACCURATE_DESIGN_STORY,
  parameters: {
    docs: {
      description: {
        story:
          "Spec Accurate Design: single mode, mid value, endpoint labels, value label on, stepper off.",
      },
      source: {
        type: "code",
        language: "html",
        code: SLIDER_STORY_SOURCE_CODE,
      },
    },
  },
  render: (args) => ({
    props: { ...args },
    template: SLIDER_COMPOSITION_DEMO_TEMPLATE,
  }),
  args: { ...SLIDER_SPEC_ACCURATE_DEFAULTS },
};

/** @type {import("@storybook/angular").StoryObj<IdsSliderComponent>} */
export const DefaultWithStepper = {
  name: "Default With Stepper",
  render: (args) => ({
    props: { ...args },
    template: SLIDER_COMPOSITION_DEMO_TEMPLATE,
  }),
  args: {
    ...SLIDER_SPEC_ACCURATE_DEFAULTS,
    showStepper: true,
    stepperFrequency: 10,
  },
};

/** @type {import("@storybook/angular").StoryObj<IdsSliderComponent>} */
export const DisabledWithAndWithoutStepper = {
  name: "Disabled With And Without Stepper",
  render: () => ({
    template: `
      <div style="display: grid; gap: 16px; max-width: 360px;">
        <ids-slider
          [min]="0"
          [max]="100"
          [defaultValue]="50"
          [disabled]="true"
          [showStepper]="false"
        ></ids-slider>
        <ids-slider
          [min]="0"
          [max]="100"
          [defaultValue]="50"
          [disabled]="true"
          [showStepper]="true"
          [stepperFrequency]="10"
        ></ids-slider>
      </div>
    `,
  }),
};

/** @type {import("@storybook/angular").StoryObj<IdsSliderComponent>} */
export const RangeWithInputsAndSteppers = {
  name: "Range With Inputs And Steppers",
  render: (args) => ({
    props: { ...args },
    template: SLIDER_COMPOSITION_DEMO_TEMPLATE,
  }),
  args: {
    mode: "range",
    min: 0,
    max: 100,
    step: 1,
    defaultValue: [25, 75],
    minLabel: "0",
    maxLabel: "100",
    showStepper: true,
    stepperFrequency: 10,
    showValueLabel: true,
    showValueInput: true,
    disabled: false,
    showTicks: false,
  },
};

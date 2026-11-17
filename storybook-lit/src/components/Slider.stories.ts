/**
 * Storybook: IDS Lit Slider from `lib/lit/ids/slider`
 *
 * Theme: components/ids-theme.css (via preview)
 * Spec: components/ids/slider/design-spec.md
 * API: lib/react/ids/slider + storybook/src/components/lib-generated/Slider.stories.tsx
 */
import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "@ids/core/slider/register.js";
import {
  SLIDER_DOCS_DESCRIPTION,
  SLIDER_SOURCE_CODE,
} from "./ids-slider.developer-usage";

const frameStyle = "max-width: 525px; width: 100%;";

const meta: Meta = {
  title: "Spec Generated/IDS/Slider",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: { component: SLIDER_DOCS_DESCRIPTION },
      source: { code: SLIDER_SOURCE_CODE, language: "html" },
    },
  },
  argTypes: {
    mode: { control: "select", options: ["single", "range"] },
    min: { control: "number" },
    max: { control: "number" },
    step: { control: "number" },
    disabled: { control: "boolean" },
    showStepper: { control: "boolean" },
    showTicks: { control: "boolean" },
    showValueLabel: { control: "boolean" },
    showValueInput: { control: "boolean" },
    stepperFrequency: { control: "number" },
    minLabel: { control: "text" },
    maxLabel: { control: "text" },
  },
  args: {
    mode: "single",
    min: 0,
    max: 100,
    defaultValue: 50,
    minLabel: "0",
    maxLabel: "100",
    showStepper: false,
    showValueLabel: true,
    showValueInput: true,
  },
};

export default meta;
type Story = StoryObj;

/** Figma `22459:39219` — Value=##, Default, stepper off + value input. */
export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  render: (args) => html`
    <div style=${frameStyle}>
      <ids-slider
        mode=${args.mode}
        .min=${args.min}
        .max=${args.max}
        .defaultValue=${args.defaultValue}
        ?disabled=${args.disabled}
        ?showstepper=${args.showStepper}
        ?showticks=${args.showTicks}
        .stepperFrequency=${args.stepperFrequency}
        .showValueLabel=${args.showValueLabel}
        ?showvalueinput=${args.showValueInput}
        minlabel=${args.minLabel ?? ""}
        maxlabel=${args.maxLabel ?? ""}
      ></ids-slider>
    </div>
  `,
};

/** Figma `22459:39047` — Default + stepper. */
export const DefaultWithStepper: Story = {
  name: "Default With Stepper",
  args: {
    mode: "single",
    min: 0,
    max: 100,
    defaultValue: 50,
    minLabel: "0",
    maxLabel: "100",
    showStepper: true,
    stepperFrequency: 10,
    showValueLabel: true,
    showValueInput: true,
  },
  render: (args) => html`
    <div style=${frameStyle}>
      <ids-slider
        mode=${args.mode}
        .min=${args.min}
        .max=${args.max}
        .defaultValue=${args.defaultValue}
        ?showstepper=${args.showStepper}
        .stepperFrequency=${args.stepperFrequency}
        .showValueLabel=${args.showValueLabel}
        ?showvalueinput=${args.showValueInput}
        minlabel=${args.minLabel ?? ""}
        maxlabel=${args.maxLabel ?? ""}
      ></ids-slider>
    </div>
  `,
};

export const ValueZeroAndHundred: Story = {
  name: "Value Zero And Hundred",
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 24px; max-width: 525px">
      <ids-slider
        .min=${0}
        .max=${100}
        .defaultValue=${0}
        minlabel="0"
        maxlabel="100"
        showvaluelabel
        showvalueinput
      ></ids-slider>
      <ids-slider
        .min=${0}
        .max=${100}
        .defaultValue=${100}
        minlabel="0"
        maxlabel="100"
        showvaluelabel
        showvalueinput
      ></ids-slider>
    </div>
  `,
};

export const DisabledWithAndWithoutStepper: Story = {
  name: "Disabled With And Without Stepper",
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 24px; max-width: 525px">
      <ids-slider
        .min=${0}
        .max=${100}
        .defaultValue=${50}
        minlabel="0"
        maxlabel="100"
        disabled
        showvaluelabel
        showvalueinput
      ></ids-slider>
      <ids-slider
        .min=${0}
        .max=${100}
        .defaultValue=${50}
        minlabel="0"
        maxlabel="100"
        disabled
        showstepper
        .stepperFrequency=${10}
        showvaluelabel
        showvalueinput
      ></ids-slider>
    </div>
  `,
};

/** Figma `22459:39145` — Range + stepper + dual inputs. */
export const RangeWithInputsAndSteppers: Story = {
  name: "Range With Inputs And Steppers",
  render: () => html`
    <div style=${frameStyle}>
      <ids-slider
        mode="range"
        .min=${0}
        .max=${100}
        .defaultValue=${[30, 60]}
        minlabel="0"
        maxlabel="100"
        showstepper
        .stepperFrequency=${10}
        showvaluelabel
        showvalueinput
      ></ids-slider>
    </div>
  `,
};

/** Figma state matrix `22459:40319` — default vs disabled × stepper. */
export const StateMatrix: Story = {
  name: "State Matrix",
  render: () => html`
    <div
      style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; max-width: 900px"
    >
      <div style="display: flex; flex-direction: column; gap: 16px">
        <strong>Default</strong>
        <ids-slider
          .min=${0}
          .max=${100}
          .defaultValue=${50}
          minlabel="0"
          maxlabel="100"
          showvaluelabel
        ></ids-slider>
        <ids-slider
          .min=${0}
          .max=${100}
          .defaultValue=${50}
          minlabel="0"
          maxlabel="100"
          showstepper
          .stepperFrequency=${10}
          showvaluelabel
        ></ids-slider>
        <ids-slider
          .min=${0}
          .max=${100}
          .defaultValue=${0}
          minlabel="0"
          maxlabel="100"
          showvaluelabel
        ></ids-slider>
        <ids-slider
          .min=${0}
          .max=${100}
          .defaultValue=${100}
          minlabel="0"
          maxlabel="100"
          showvaluelabel
        ></ids-slider>
      </div>
      <div style="display: flex; flex-direction: column; gap: 16px">
        <strong>Disabled</strong>
        <ids-slider
          .min=${0}
          .max=${100}
          .defaultValue=${50}
          minlabel="0"
          maxlabel="100"
          disabled
          showvaluelabel
        ></ids-slider>
        <ids-slider
          .min=${0}
          .max=${100}
          .defaultValue=${50}
          minlabel="0"
          maxlabel="100"
          disabled
          showstepper
          .stepperFrequency=${10}
          showvaluelabel
        ></ids-slider>
        <ids-slider
          .min=${0}
          .max=${100}
          .defaultValue=${0}
          minlabel="0"
          maxlabel="100"
          disabled
          showvaluelabel
        ></ids-slider>
        <ids-slider
          .min=${0}
          .max=${100}
          .defaultValue=${100}
          minlabel="0"
          maxlabel="100"
          disabled
          showvaluelabel
        ></ids-slider>
      </div>
    </div>
  `,
};

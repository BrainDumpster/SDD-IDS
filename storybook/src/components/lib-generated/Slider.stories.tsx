/**
 * Storybook: design-spec–generated Slider from `lib/react/ids/slider`
 * (React + CSS Modules, no @base-ui-components).
 *
 * Anatomy:
 *   SliderRoot → MinLabel? → Rail (+ segment, ticks, thumbs, value labels) → MaxLabel? → ValueInput(s)?
 *
 * Composition: value inputs use lib `IdsTextBox` (`size="small"`, 76×32).
 * Theme: components/ids-theme.css
 * Spec: components/ids/slider/design-spec.md
 */
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/ids-theme.css";
import {
  SLIDER_DOCS_DESCRIPTION,
  SLIDER_SOURCE_CODE,
} from "./ids-slider.developer-usage";
import {
  IdsSlider,
  type IdsSliderProps,
} from "@ids/react/slider";

const DESIGN_SPEC_PATH = "components/ids/slider/design-spec.md";

/** Figma `22459:39219` — Value=##, Default, stepper off + TextBox. */
const specAccurateArgs: IdsSliderProps = {
  mode: "single",
  min: 0,
  max: 100,
  defaultValue: 50,
  minLabel: "0",
  maxLabel: "100",
  showStepper: false,
  showValueLabel: true,
  showValueInput: true,
};

const frameStyle: React.CSSProperties = {
  maxWidth: 525,
  width: "100%",
};

const meta: Meta<IdsSliderProps> = {
  tags: ["autodocs"],
  title: "Components/IDS/Slider",
  component: IdsSlider,
  parameters: {
    layout: "padded",
    docs: {
      canvas: { sourceState: "open" },
      description: {
        component: SLIDER_DOCS_DESCRIPTION,
      },
      source: {
        type: "code",
        language: "tsx",
        code: SLIDER_SOURCE_CODE,
      },
    },
  },
  args: specAccurateArgs,
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
    onValueChange: { action: "onValueChange" },
    onValueCommit: { action: "onValueCommit" },
  },
};

export default meta;
type Story = StoryObj<IdsSliderProps>;

export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  args: specAccurateArgs,
  render: (args) => (
    <div style={frameStyle}>
      <IdsSlider {...args} />
    </div>
  ),
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
  render: (args) => (
    <div style={frameStyle}>
      <IdsSlider {...args} />
    </div>
  ),
};

export const ValueZeroAndHundred: Story = {
  name: "Value Zero And Hundred",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 525 }}>
      <IdsSlider
        min={0}
        max={100}
        defaultValue={0}
        minLabel="0"
        maxLabel="100"
        showValueLabel
        showValueInput
      />
      <IdsSlider
        min={0}
        max={100}
        defaultValue={100}
        minLabel="0"
        maxLabel="100"
        showValueLabel
        showValueInput
      />
    </div>
  ),
};

export const DisabledWithAndWithoutStepper: Story = {
  name: "Disabled With And Without Stepper",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 525 }}>
      <IdsSlider
        min={0}
        max={100}
        defaultValue={50}
        minLabel="0"
        maxLabel="100"
        disabled
        showStepper={false}
        showValueLabel
        showValueInput
      />
      <IdsSlider
        min={0}
        max={100}
        defaultValue={50}
        minLabel="0"
        maxLabel="100"
        disabled
        showStepper
        stepperFrequency={10}
        showValueLabel
        showValueInput
      />
    </div>
  ),
};

/** Figma `22459:39145` — Range + stepper + dual TextBox. */
export const RangeWithInputsAndSteppers: Story = {
  name: "Range With Inputs And Steppers",
  args: {
    mode: "range",
    min: 0,
    max: 100,
    defaultValue: [30, 60],
    minLabel: "0",
    maxLabel: "100",
    showStepper: true,
    stepperFrequency: 10,
    showValueLabel: true,
    showValueInput: true,
  },
  render: (args) => (
    <div style={frameStyle}>
      <IdsSlider {...args} />
    </div>
  ),
};

/** Figma state matrix `22459:40319` — default vs disabled × stepper. */
export const StateMatrix: Story = {
  name: "State Matrix",
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 24,
        maxWidth: 900,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <strong>Default</strong>
        <IdsSlider min={0} max={100} defaultValue={50} minLabel="0" maxLabel="100" showValueLabel />
        <IdsSlider
          min={0}
          max={100}
          defaultValue={50}
          minLabel="0"
          maxLabel="100"
          showStepper
          stepperFrequency={10}
          showValueLabel
        />
        <IdsSlider min={0} max={100} defaultValue={0} minLabel="0" maxLabel="100" showValueLabel />
        <IdsSlider
          min={0}
          max={100}
          defaultValue={100}
          minLabel="0"
          maxLabel="100"
          showValueLabel
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <strong>Disabled</strong>
        <IdsSlider
          min={0}
          max={100}
          defaultValue={50}
          minLabel="0"
          maxLabel="100"
          disabled
          showValueLabel
        />
        <IdsSlider
          min={0}
          max={100}
          defaultValue={50}
          minLabel="0"
          maxLabel="100"
          disabled
          showStepper
          stepperFrequency={10}
          showValueLabel
        />
        <IdsSlider
          min={0}
          max={100}
          defaultValue={0}
          minLabel="0"
          maxLabel="100"
          disabled
          showValueLabel
        />
        <IdsSlider
          min={0}
          max={100}
          defaultValue={100}
          minLabel="0"
          maxLabel="100"
          disabled
          showValueLabel
        />
      </div>
    </div>
  ),
};

export const Controlled: Story = {
  name: "Controlled",
  render: function ControlledStory() {
    const [value, setValue] = React.useState<number>(40);
    return (
      <div style={{ display: "grid", gap: 12, maxWidth: 525 }}>
        <IdsSlider
          min={0}
          max={100}
          value={value}
          minLabel="0"
          maxLabel="100"
          showValueLabel
          showValueInput
          onValueChange={(next) => {
            if (typeof next === "number") setValue(next);
          }}
        />
        <button type="button" onClick={() => setValue(0)}>
          Reset to 0
        </button>
      </div>
    );
  },
};

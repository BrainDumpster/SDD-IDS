/**
 * Storybook: design-spec–generated Slider from `lib/react/synapse/slider`
 * (IDS-fork reexport façade — React + CSS Modules).
 *
 * Anatomy:
 *   SliderRoot → MinLabel? → Rail (+ segment, ticks, thumbs, value labels) → MaxLabel? → ValueInput(s)?
 *
 * Composition: value inputs use lib `SynapseTextInput` (`size="small"`, 76×32).
 * Theme: components/synapse-theme.css
 * Spec: components/synapse/slider/design-spec.md
 */
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/synapse-theme.css";
import {
  SYNAPSE_SLIDER_DOCS_DESCRIPTION,
  SYNAPSE_SLIDER_SOURCE_CODE,
} from "./synapse-slider.developer-usage";
import {
  SynapseSlider,
  type SynapseSliderProps,
} from "@synapse/react/slider";

const DESIGN_SPEC_PATH = "components/synapse/slider/design-spec.md";

/** Figma `22459:39219` — Value=##, Default, stepper off + TextInput. */
const specAccurateArgs: SynapseSliderProps = {
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

const meta: Meta<SynapseSliderProps> = {
  tags: ["autodocs"],
  title: "Components/Synapse/Slider",
  component: SynapseSlider,
  parameters: {
    layout: "padded",
    docs: {
      canvas: { sourceState: "open" },
      description: {
        component: SYNAPSE_SLIDER_DOCS_DESCRIPTION,
      },
      source: {
        type: "code",
        language: "tsx",
        code: SYNAPSE_SLIDER_SOURCE_CODE,
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
type Story = StoryObj<SynapseSliderProps>;

export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  args: specAccurateArgs,
  render: (args) => (
    <div style={frameStyle}>
      <SynapseSlider {...args} />
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
      <SynapseSlider {...args} />
    </div>
  ),
};

export const ValueZeroAndHundred: Story = {
  name: "Value Zero And Hundred",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 525 }}>
      <SynapseSlider
        min={0}
        max={100}
        defaultValue={0}
        minLabel="0"
        maxLabel="100"
        showValueLabel
        showValueInput
      />
      <SynapseSlider
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
      <SynapseSlider
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
      <SynapseSlider
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

/** Figma `22459:39145` — Range + stepper + dual TextInput. */
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
      <SynapseSlider {...args} />
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
        <SynapseSlider min={0} max={100} defaultValue={50} minLabel="0" maxLabel="100" showValueLabel />
        <SynapseSlider
          min={0}
          max={100}
          defaultValue={50}
          minLabel="0"
          maxLabel="100"
          showStepper
          stepperFrequency={10}
          showValueLabel
        />
        <SynapseSlider min={0} max={100} defaultValue={0} minLabel="0" maxLabel="100" showValueLabel />
        <SynapseSlider
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
        <SynapseSlider
          min={0}
          max={100}
          defaultValue={50}
          minLabel="0"
          maxLabel="100"
          disabled
          showValueLabel
        />
        <SynapseSlider
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
        <SynapseSlider
          min={0}
          max={100}
          defaultValue={0}
          minLabel="0"
          maxLabel="100"
          disabled
          showValueLabel
        />
        <SynapseSlider
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
        <SynapseSlider
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

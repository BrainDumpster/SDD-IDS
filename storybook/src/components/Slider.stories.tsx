import type { Meta, StoryObj } from "@storybook/react";
import { Slider } from "./Slider";

const meta: Meta<typeof Slider> = {
  title: "IDS/Slider",
  component: Slider,
  argTypes: {
    min: { control: "number" },
    max: { control: "number" },
    step: { control: "number" },
    disabled: { control: "boolean" },
    showStepper: { control: "boolean" },
    showValueLabel: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Slider>;

export const DefaultNoStepper: Story = {
  args: {
    mode: "single",
    min: 0,
    max: 100,
    defaultValue: 50,
    minLabel: "0",
    maxLabel: "100",
    showStepper: false,
    showValueLabel: true,
  },
};

export const DefaultWithStepper: Story = {
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
  },
};

export const ValueZero: Story = {
  args: {
    mode: "single",
    min: 0,
    max: 100,
    defaultValue: 0,
    minLabel: "0",
    maxLabel: "100",
    showStepper: false,
    showValueLabel: true,
  },
};

export const ValueHundred: Story = {
  args: {
    mode: "single",
    min: 0,
    max: 100,
    defaultValue: 100,
    minLabel: "0",
    maxLabel: "100",
    showStepper: false,
    showValueLabel: true,
  },
};

export const DisabledNoStepper: Story = {
  args: {
    mode: "single",
    min: 0,
    max: 100,
    defaultValue: 50,
    minLabel: "0",
    maxLabel: "100",
    disabled: true,
    showStepper: false,
    showValueLabel: true,
  },
};

export const DisabledWithStepper: Story = {
  args: {
    mode: "single",
    min: 0,
    max: 100,
    defaultValue: 50,
    minLabel: "0",
    maxLabel: "100",
    disabled: true,
    showStepper: true,
    stepperFrequency: 10,
    showValueLabel: true,
  },
};

export const WithLabels: Story = {
  args: {
    mode: "single",
    min: 0,
    max: 100,
    defaultValue: 45,
    minLabel: "Min",
    maxLabel: "Max",
    showStepper: true,
    showValueLabel: true,
  },
};

export const RangeWithInputsAndSteppers: Story = {
  args: {
    mode: "range",
    min: 0,
    max: 100,
    defaultValue: [25, 75],
    minLabel: "0",
    maxLabel: "100",
    showStepper: true,
    stepperFrequency: 10,
    showValueLabel: true,
    showValueInput: true,
  },
};

export const IDSStateMatrix: Story = {
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, maxWidth: 900 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <strong>Default</strong>
        <Slider min={0} max={100} defaultValue={50} showStepper={false} />
        <Slider min={0} max={100} defaultValue={50} showStepper />
        <Slider min={0} max={100} defaultValue={0} showStepper={false} />
        <Slider min={0} max={100} defaultValue={0} showStepper />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <strong>Disabled</strong>
        <Slider min={0} max={100} defaultValue={50} disabled showStepper={false} />
        <Slider min={0} max={100} defaultValue={50} disabled showStepper />
        <Slider min={0} max={100} defaultValue={100} disabled showStepper={false} />
        <Slider min={0} max={100} defaultValue={100} disabled showStepper />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16, gridColumn: "1 / span 2" }}>
        <strong>Range</strong>
        <Slider
          mode="range"
          min={0}
          max={100}
          defaultValue={[20, 80]}
          minLabel="0"
          maxLabel="100"
          showStepper
          stepperFrequency={10}
          showValueLabel
          showValueInput
        />
      </div>
    </div>
  ),
};

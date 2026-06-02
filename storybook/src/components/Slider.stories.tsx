import type { Meta, StoryObj } from "@storybook/react";
import { IdsSlider } from "./IdsSlider";

const meta: Meta<typeof IdsSlider> = {
  title: "Spec Generated/IDS/Slider",
  component: IdsSlider,
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
type Story = StoryObj<typeof IdsSlider>;

export const DefaultNoStepperManual: Story = {
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

export const DefaultWithStepperManual: Story = {
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

export const RangeWithInputsAndSteppersManual: Story = {
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
        <IdsSlider min={0} max={100} defaultValue={50} showStepper={false} />
        <IdsSlider min={0} max={100} defaultValue={50} showStepper />
        <IdsSlider min={0} max={100} defaultValue={0} showStepper={false} />
        <IdsSlider min={0} max={100} defaultValue={0} showStepper />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <strong>Disabled</strong>
        <IdsSlider min={0} max={100} defaultValue={50} disabled showStepper={false} />
        <IdsSlider min={0} max={100} defaultValue={50} disabled showStepper />
        <IdsSlider min={0} max={100} defaultValue={100} disabled showStepper={false} />
        <IdsSlider min={0} max={100} defaultValue={100} disabled showStepper />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16, gridColumn: "1 / span 2" }}>
        <strong>Range</strong>
        <IdsSlider
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

import type { Meta, StoryObj } from "@storybook/react";
import { Slider } from "./Slider";

const meta: Meta<typeof Slider> = {
  title: "Synapse/Slider",
  component: Slider,
  argTypes: {
    min: { control: "number" },
    max: { control: "number" },
    step: { control: "number" },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Slider>;

export const Default: Story = {
  args: {
    min: 0,
    max: 100,
  },
};

export const WithDefaultValue: Story = {
  args: {
    min: 0,
    max: 100,
    defaultValue: 50,
  },
};

export const WithLabel: Story = {
  args: {
    label: "Volume",
    min: 0,
    max: 100,
    defaultValue: 75,
  },
};

export const Disabled: Story = {
  args: {
    label: "Brightness",
    min: 0,
    max: 100,
    defaultValue: 40,
    disabled: true,
  },
};

export const CustomRange: Story = {
  args: {
    label: "Temperature (°C)",
    min: -20,
    max: 50,
    step: 5,
    defaultValue: 20,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 360 }}>
      <Slider label="Default" min={0} max={100} />
      <Slider label="Midpoint" min={0} max={100} defaultValue={50} />
      <Slider label="Fine step" min={0} max={1} step={0.01} defaultValue={0.5} />
      <Slider label="Disabled" min={0} max={100} defaultValue={30} disabled />
    </div>
  ),
};

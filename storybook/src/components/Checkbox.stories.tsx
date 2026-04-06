import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "./Checkbox";

const meta: Meta<typeof Checkbox> = {
  title: "Synapse/Checkbox",
  component: Checkbox,
  argTypes: {
    disabled: { control: "boolean" },
    indeterminate: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: { label: "Accept terms and conditions" },
};

export const Checked: Story = {
  args: { label: "Checked", defaultChecked: true },
};

export const Indeterminate: Story = {
  args: { label: "Select all", indeterminate: true },
};

export const Disabled: Story = {
  args: { label: "Disabled option", disabled: true },
};

export const DisabledChecked: Story = {
  args: { label: "Disabled checked", disabled: true, checked: true },
};

export const DisabledPartial: Story = {
  args: { label: "Disabled partial", disabled: true, indeterminate: true },
};

export const StateMatrix: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "flex", gap: 24 }}>
        <Checkbox label="Option" />
        <Checkbox label="Option" checked />
        <Checkbox label="Option" indeterminate />
      </div>
      <div style={{ display: "flex", gap: 24 }}>
        <Checkbox label="Option" disabled />
        <Checkbox label="Option" checked disabled />
        <Checkbox label="Option" indeterminate disabled />
      </div>
    </div>
  ),
};

export const Group: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <Checkbox label="Option A" defaultChecked />
      <Checkbox label="Option B" />
      <Checkbox label="Option C" />
      <Checkbox label="Disabled" disabled />
    </div>
  ),
};

import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Checkbox } from "./Checkbox";

const meta: Meta<typeof Checkbox> = {
  title: "IDS/Checkbox",
  component: Checkbox,
  argTypes: {
    disabled: { control: "boolean" },
    indeterminate: { control: "boolean" },
    error: { control: "boolean" },
    helperText: { control: "text" },
    onChange: { action: "onChange" },
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: {
    label: "Accept terms and conditions",
  },
};

export const SelectionStates: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
      <Checkbox label="Unchecked" />
      <Checkbox label="Checked" checked />
      <Checkbox label="Indeterminate" indeterminate />
    </div>
  ),
};

export const DisabledStates: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
      <Checkbox label="Unchecked" disabled />
      <Checkbox label="Checked" checked disabled />
      <Checkbox label="Indeterminate" indeterminate disabled />
    </div>
  ),
};

export const ValidationAndHelperText: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16 }}>
      <Checkbox label="Email notifications" helperText="Receive weekly summary updates." />
      <Checkbox label="Required acknowledgement" error helperText="You must accept this option to continue." />
      <Checkbox label="Disabled option" disabled helperText="This option is unavailable for your role." />
    </div>
  ),
};

export const ControlledExample: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);

    return (
      <div style={{ display: "grid", gap: 12 }}>
        <Checkbox
          label="Controlled checkbox"
          checked={checked}
          helperText={`Current value: ${checked ? "checked" : "unchecked"}`}
          onChange={setChecked}
        />
      </div>
    );
  },
};

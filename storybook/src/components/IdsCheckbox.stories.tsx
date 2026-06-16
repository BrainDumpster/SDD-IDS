import "../../../components/ids-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Checkbox } from "./Checkbox";

const meta: Meta<typeof Checkbox> = {
  title: "Spec Generated/IDS/Checkbox",
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

export const SelectionStatesManual: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
      <Checkbox label="Unchecked" />
      <Checkbox label="Checked" checked />
      <Checkbox label="Indeterminate" indeterminate />
    </div>
  ),
};

/** Mirrors Figma `8505:14296` main matrix: selection × (default | focus-visible | disabled). */
export const FigmaMainMatrix: Story = {
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "120px repeat(3, minmax(140px, 1fr))",
        gap: "12px 16px",
        alignItems: "center",
        fontSize: 12,
        color: "var(--color-text-neutral-strong)",
      }}
    >
      <div />
      <div>Unselected</div>
      <div>Selected</div>
      <div>Indeterminate</div>
      <div>Default</div>
      <Checkbox label="Option" />
      <Checkbox label="Option" checked />
      <Checkbox label="Option" indeterminate />
      <div>Focus-visible (simulated)</div>
      <Checkbox label="Option" simulateFocusVisible />
      <Checkbox label="Option" checked simulateFocusVisible />
      <Checkbox label="Option" indeterminate simulateFocusVisible />
      <div>Disabled</div>
      <Checkbox label="Option" disabled />
      <Checkbox label="Option" checked disabled />
      <Checkbox label="Option" indeterminate disabled />
    </div>
  ),
};

export const DisabledStatesManual: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
      <Checkbox label="Unchecked" disabled />
      <Checkbox label="Checked" checked disabled />
      <Checkbox label="Indeterminate" indeterminate disabled />
    </div>
  ),
};

export const ValidationAndHelperTextManual: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16 }}>
      <Checkbox label="Email notifications" helperText="Receive weekly summary updates." />
      <Checkbox label="Required acknowledgement" error helperText="You must accept this option to continue." />
      <Checkbox label="Disabled option" disabled helperText="This option is unavailable for your role." />
    </div>
  ),
};

export const ControlledExampleManual: Story = {
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

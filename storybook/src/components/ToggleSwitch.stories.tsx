import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { ToggleSwitch } from "./ToggleSwitch";

const meta: Meta<typeof ToggleSwitch> = {
  title: "IDS/Toggle Switch",
  component: ToggleSwitch,
  argTypes: {
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof ToggleSwitch>;

export const Off: Story = {
  args: {
    label: "Enable alerts",
    defaultChecked: false,
  },
};

export const On: Story = {
  args: {
    label: "Enable alerts",
    defaultChecked: true,
  },
};

export const DisabledOff: Story = {
  args: {
    label: "Enable alerts",
    disabled: true,
    defaultChecked: false,
  },
};

export const DisabledOn: Story = {
  args: {
    label: "Enable alerts",
    disabled: true,
    defaultChecked: true,
  },
};

export const WithoutVisibleLabel: Story = {
  args: {
    ariaLabel: "Enable alerts",
    defaultChecked: false,
  },
};

export const Controlled: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <div style={{ display: "grid", gap: 8 }}>
        <ToggleSwitch
          label="Enable alerts"
          checked={checked}
          onCheckedChange={setChecked}
        />
        <span style={{ color: "var(--color-text-neutral)" }}>
          Checked: {checked ? "true" : "false"}
        </span>
      </div>
    );
  },
};

export const StateMatrix: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "flex", gap: 24 }}>
        <ToggleSwitch label="Off" defaultChecked={false} />
        <ToggleSwitch label="On" defaultChecked />
      </div>
      <div style={{ display: "flex", gap: 24 }}>
        <ToggleSwitch label="Disabled Off" disabled defaultChecked={false} />
        <ToggleSwitch label="Disabled On" disabled defaultChecked />
      </div>
    </div>
  ),
};

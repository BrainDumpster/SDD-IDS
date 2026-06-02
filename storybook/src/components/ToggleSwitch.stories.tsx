import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { IdsToggleSwitch } from "./IdsToggleSwitch";

const meta: Meta<typeof IdsToggleSwitch> = {
  title: "Spec Generated/IDS/Toggle Switch",
  component: IdsToggleSwitch,
  argTypes: {
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof IdsToggleSwitch>;

export const OffManual: Story = {
  args: {
    label: "Enable alerts",
    defaultChecked: false,
  },
};

export const OnManual: Story = {
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

export const ControlledManual: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <div style={{ display: "grid", gap: 8 }}>
        <IdsToggleSwitch
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
        <IdsToggleSwitch label="Off" defaultChecked={false} />
        <IdsToggleSwitch label="On" defaultChecked />
      </div>
      <div style={{ display: "flex", gap: 24 }}>
        <IdsToggleSwitch label="Disabled Off" disabled defaultChecked={false} />
        <IdsToggleSwitch label="Disabled On" disabled defaultChecked />
      </div>
    </div>
  ),
};

/** Aligns with Figma matrix frame `42848:100536` (dark surface + tokens). */
export const StateMatrixDarkManual: Story = {
  parameters: {
    globals: { theme: "dark" },
    backgrounds: { default: "dark" },
  },
  render: () => (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "flex", gap: 24 }}>
        <IdsToggleSwitch label="Off" defaultChecked={false} />
        <IdsToggleSwitch label="On" defaultChecked />
      </div>
      <div style={{ display: "flex", gap: 24 }}>
        <IdsToggleSwitch label="Disabled Off" disabled defaultChecked={false} />
        <IdsToggleSwitch label="Disabled On" disabled defaultChecked />
      </div>
    </div>
  ),
};

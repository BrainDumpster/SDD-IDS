import type { Meta, StoryObj } from "@storybook/react";
import { Switch } from "./Switch";

const meta: Meta<typeof Switch> = {
  title: "Synapse/Switch",
  component: Switch,
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  args: { label: "Enable notifications" },
};

export const On: Story = {
  args: { label: "Dark mode", defaultChecked: true },
};

export const Disabled: Story = {
  args: { label: "Unavailable", disabled: true },
};

export const Group: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Switch label="Wi-Fi" defaultChecked />
      <Switch label="Bluetooth" />
      <Switch label="Airplane mode" disabled />
    </div>
  ),
};

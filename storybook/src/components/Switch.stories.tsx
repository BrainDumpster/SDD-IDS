import type { Meta, StoryObj } from "@storybook/react";
import { Switch } from "./Switch";

const meta: Meta<typeof Switch> = {
  title: "Synapse/Switch",
  component: Switch,
  argTypes: {
    disabled: { control: "boolean" },
    showLabel: { control: "boolean" },
    showOnOffOption: { control: "boolean" },
    required: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  args: { label: "Label:", required: true, showLabel: true, showOnOffOption: true },
};

export const On: Story = {
  args: { label: "Label:", required: true, showLabel: true, showOnOffOption: true, defaultChecked: true },
};

export const DisabledOff: Story = {
  args: { label: "Label:", required: true, showLabel: true, showOnOffOption: true, disabled: true },
};

export const DisabledOn: Story = {
  args: { label: "Label:", required: true, showLabel: true, showOnOffOption: true, disabled: true, defaultChecked: true },
};

export const FocusStateDemo: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 12 }}>
      <Switch label="Label:" />
      <Switch label="Label:" defaultChecked />
      <Switch label="Label:" disabled />
      <Switch label="Label:" defaultChecked disabled />
    </div>
  ),
};

export const HideSlots: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 12 }}>
      <Switch showLabel={false} showOnOffOption={false} />
      <Switch showLabel={false} showOnOffOption={false} defaultChecked />
    </div>
  ),
};

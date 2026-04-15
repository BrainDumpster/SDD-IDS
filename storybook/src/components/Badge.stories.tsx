import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./Badge";

const meta: Meta<typeof Badge> = {
  title: "IDS/Badge",
  component: Badge,
  argTypes: {
    type: {
      control: "select",
      options: ["default", "critical", "warning", "disabled", "success"],
    },
    value: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {
    value: "1",
    type: "default",
  },
};

export const Critical: Story = {
  args: {
    value: "1",
    type: "critical",
  },
};

export const Warning: Story = {
  args: {
    value: "1",
    type: "warning",
  },
};

export const Disabled: Story = {
  args: {
    value: "1",
    type: "disabled",
  },
};

export const Success: Story = {
  args: {
    value: "1",
    type: "success",
  },
};

export const VariantMatrix: Story = {
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "140px", gap: 16 }}>
      <Badge value="1" type="default" />
      <Badge value="1" type="critical" />
      <Badge value="1" type="warning" />
      <Badge value="1" type="disabled" />
      <Badge value="1" type="success" />
    </div>
  ),
};

export const CountSizing: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
      <Badge value="1" type="default" />
      <Badge value="12" type="default" />
      <Badge value="123" type="default" />
    </div>
  ),
};

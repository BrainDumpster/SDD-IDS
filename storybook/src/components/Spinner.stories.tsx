import type { Meta, StoryObj } from "@storybook/react";
import { Spinner } from "./Spinner";

const meta: Meta<typeof Spinner> = {
  title: "Synapse/Spinner",
  component: Spinner,
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
  },
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Small: Story = {
  args: { size: "sm" },
};

export const Medium: Story = {
  args: { size: "md" },
};

export const Large: Story = {
  args: { size: "lg" },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
      <div style={{ textAlign: "center" }}>
        <Spinner size="sm" />
        <p style={{ marginTop: 8, fontSize: 12, color: "var(--color-text-neutral)" }}>Small</p>
      </div>
      <div style={{ textAlign: "center" }}>
        <Spinner size="md" />
        <p style={{ marginTop: 8, fontSize: 12, color: "var(--color-text-neutral)" }}>Medium</p>
      </div>
      <div style={{ textAlign: "center" }}>
        <Spinner size="lg" />
        <p style={{ marginTop: 8, fontSize: 12, color: "var(--color-text-neutral)" }}>Large</p>
      </div>
    </div>
  ),
};

export const WithCustomLabel: Story = {
  args: { size: "md", label: "Fetching data" },
};

import type { Meta, StoryObj } from "@storybook/react";
import { Spinner } from "./Spinner";

const meta: Meta<typeof Spinner> = {
  title: "IDS/Spinner",
  component: Spinner,
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    labelVisibility: { control: "select", options: ["sr-only", "inline", "below"] },
  },
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Small: Story = {
  args: { size: "sm", labelVisibility: "inline", label: "Loading..." },
};

export const Medium: Story = {
  args: { size: "md", labelVisibility: "below", label: "Loading..." },
};

export const Large: Story = {
  args: { size: "lg", labelVisibility: "sr-only", label: "Loading..." },
};

export const FigmaUsageFrame: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 24, alignItems: "center", padding: 16 }}>
      <div>
        <Spinner size="sm" labelVisibility="inline" label="Loading..." />
      </div>
      <div>
        <Spinner size="md" labelVisibility="below" label="Loading..." />
      </div>
      <div>
        <Spinner size="lg" labelVisibility="sr-only" label="Loading..." />
      </div>
    </div>
  ),
};

export const WithCustomLabel: Story = {
  args: { size: "md", labelVisibility: "below", label: "Fetching data..." },
};

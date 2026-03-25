import type { Meta, StoryObj } from "@storybook/react";
import { SkeletonLoader } from "./SkeletonLoader";

const meta: Meta<typeof SkeletonLoader> = {
  title: "Synapse/SkeletonLoader",
  component: SkeletonLoader,
  argTypes: {
    variant: { control: "select", options: ["text", "circle", "rectangle"] },
  },
};

export default meta;
type Story = StoryObj<typeof SkeletonLoader>;

export const TextLines: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 360 }}>
      <SkeletonLoader variant="text" />
      <SkeletonLoader variant="text" width="80%" />
      <SkeletonLoader variant="text" width="60%" />
    </div>
  ),
};

export const Circle: Story = {
  args: { variant: "circle" },
};

export const CircleLarge: Story = {
  args: { variant: "circle", width: 64, height: 64 },
};

export const Rectangle: Story = {
  args: { variant: "rectangle" },
};

export const CardComposition: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        maxWidth: 320,
        padding: 16,
        border: "1px solid var(--color-border-light)",
        borderRadius: 8,
      }}
    >
      <SkeletonLoader variant="rectangle" height={160} />
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <SkeletonLoader variant="circle" width={36} height={36} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
          <SkeletonLoader variant="text" width="60%" />
          <SkeletonLoader variant="text" width="40%" />
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <SkeletonLoader variant="text" />
        <SkeletonLoader variant="text" />
        <SkeletonLoader variant="text" width="75%" />
      </div>
    </div>
  ),
};

import type { Meta, StoryObj } from "@storybook/react";
import { ScrollBar } from "./ScrollBar";

const meta: Meta<typeof ScrollBar> = {
  title: "Synapse/ScrollBar",
  component: ScrollBar,
};

export default meta;
type Story = StoryObj<typeof ScrollBar>;

export const LongContent: Story = {
  args: {
    height: 240,
    children: (
      <div style={{ padding: 16 }}>
        {Array.from({ length: 30 }, (_, i) => (
          <p key={i} style={{ margin: "0 0 8px", fontSize: 14, color: "#4d4d4d" }}>
            Line {i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        ))}
      </div>
    ),
  },
};

export const ShortContent: Story = {
  args: {
    height: 240,
    children: (
      <div style={{ padding: 16 }}>
        <p style={{ margin: 0, fontSize: 14, color: "#4d4d4d" }}>
          This content fits within the container, so no scrollbar should appear.
        </p>
      </div>
    ),
  },
};

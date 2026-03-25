import type { Meta, StoryObj } from "@storybook/react";
import { GlobalSearch } from "./GlobalSearch";

const meta: Meta<typeof GlobalSearch> = {
  title: "Synapse/GlobalSearch",
  component: GlobalSearch,
  argTypes: {
    expanded: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof GlobalSearch>;

export const Collapsed: Story = {
  args: {
    expanded: false,
  },
  decorators: [
    (Story) => (
      <div
        style={{
          background: "var(--color-background-masthead-brand-base)",
          padding: "8px 16px",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export const Expanded: Story = {
  args: {
    expanded: true,
    placeholder: "Search pages, components, docs...",
  },
};

export const InMasthead: Story = {
  render: () => (
    <div
      style={{
        background: "var(--color-background-masthead-brand-base)",
        padding: "8px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 48,
      }}
    >
      <span style={{ color: "#fff", fontWeight: 500, fontSize: 16 }}>
        Synapse
      </span>
      <GlobalSearch placeholder="Search..." />
    </div>
  ),
  parameters: {
    layout: "fullscreen",
  },
};

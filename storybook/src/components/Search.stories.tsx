import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Search } from "./Search";

const meta: Meta<typeof Search> = {
  title: "Synapse/Search",
  component: Search,
  argTypes: {
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Search>;

export const Default: Story = {
  args: {
    placeholder: "Search...",
  },
};

export const WithValue: Story = {
  render: () => {
    const [value, setValue] = useState("design tokens");
    return (
      <div style={{ maxWidth: 360 }}>
        <Search
          value={value}
          onChange={setValue}
          onClear={() => setValue("")}
          placeholder="Search..."
        />
      </div>
    );
  },
};

export const Disabled: Story = {
  args: {
    placeholder: "Search is disabled",
    disabled: true,
  },
};

export const AllStates: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 360 }}>
      <Search placeholder="Empty search" />
      <Search value="With text" onChange={() => {}} onClear={() => {}} />
      <Search placeholder="Disabled" disabled />
    </div>
  ),
};

import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Search } from "./Search";

const meta: Meta<typeof Search> = {
  title: "Synapse/Search",
  component: Search,
};

export default meta;
type Story = StoryObj<typeof Search>;

export const Default: Story = {
  args: {
    placeholder: "Search",
  },
};

export const Focus: Story = {
  args: {
    placeholder: "Search",
    autoFocus: true,
  },
};

export const Typing: Story = {
  render: () => {
    const [value, setValue] = useState("key");
    return (
      <div style={{ maxWidth: 360 }}>
        <Search
          value={value}
          onChange={setValue}
          onClear={() => setValue("")}
          placeholder="Search"
        />
      </div>
    );
  },
};

export const Filled: Story = {
  render: () => {
    const [value, setValue] = useState("design tokens");
    return (
      <div style={{ maxWidth: 360 }}>
        <Search
          value={value}
          onChange={setValue}
          onClear={() => setValue("")}
          placeholder="Search"
        />
      </div>
    );
  },
};

export const AllStates: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 360 }}>
      <Search placeholder="Search" />
      <Search placeholder="Search" autoFocus />
      <Search value="key" onChange={() => {}} onClear={() => {}} />
      <Search value="keyword" onChange={() => {}} onClear={() => {}} />
    </div>
  ),
};

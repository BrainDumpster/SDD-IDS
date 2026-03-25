import type { Meta, StoryObj } from "@storybook/react";
import { DropdownMenu } from "./DropdownMenu";
import { Button } from "./Button";

const meta: Meta<typeof DropdownMenu> = {
  title: "Synapse/DropdownMenu",
  component: DropdownMenu,
};

export default meta;
type Story = StoryObj<typeof DropdownMenu>;

export const Basic: Story = {
  args: {
    trigger: <Button variant="secondary">Actions</Button>,
    items: [
      { label: "Edit" },
      { label: "Duplicate" },
      { label: "Delete" },
    ],
  },
};

export const WithSeparator: Story = {
  args: {
    trigger: <Button variant="secondary">More Options</Button>,
    items: [
      { label: "View details" },
      { label: "Edit" },
      { label: "separator", separator: true },
      { label: "Export as CSV" },
      { label: "Export as PDF" },
      { label: "separator", separator: true },
      { label: "Delete" },
    ],
  },
};

export const WithDisabled: Story = {
  args: {
    trigger: <Button>File Menu</Button>,
    items: [
      { label: "New" },
      { label: "Open" },
      { label: "Save" },
      { label: "Save As..." },
      { label: "separator", separator: true },
      { label: "Print", disabled: true },
      { label: "Export", disabled: true },
      { label: "separator", separator: true },
      { label: "Close" },
    ],
  },
};

export const SimpleList: Story = {
  args: {
    trigger: <Button variant="ghost">Sort By</Button>,
    items: [
      { label: "Name (A-Z)" },
      { label: "Name (Z-A)" },
      { label: "Date (Newest)" },
      { label: "Date (Oldest)" },
      { label: "Size" },
    ],
  },
};

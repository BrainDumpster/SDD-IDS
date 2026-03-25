import type { Meta, StoryObj } from "@storybook/react";
import { Breadcrumb } from "./Breadcrumb";

const meta: Meta<typeof Breadcrumb> = {
  title: "Synapse/Breadcrumb",
  component: Breadcrumb,
  argTypes: {
    separator: { control: "select", options: ["/", ">"] },
  },
};

export default meta;
type Story = StoryObj<typeof Breadcrumb>;

export const ThreeItems: Story = {
  args: {
    items: [
      { label: "Home", href: "/" },
      { label: "Products", href: "/products" },
      { label: "Widget Pro" },
    ],
  },
};

export const FiveItems: Story = {
  args: {
    items: [
      { label: "Home", href: "/" },
      { label: "Library", href: "/library" },
      { label: "Components", href: "/library/components" },
      { label: "Navigation", href: "/library/components/navigation" },
      { label: "Breadcrumb" },
    ],
  },
};

export const ChevronSeparator: Story = {
  args: {
    items: [
      { label: "Dashboard", href: "/" },
      { label: "Settings", href: "/settings" },
      { label: "Profile" },
    ],
    separator: ">",
  },
};

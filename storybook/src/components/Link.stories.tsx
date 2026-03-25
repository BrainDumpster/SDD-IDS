import type { Meta, StoryObj } from "@storybook/react";
import { Link } from "./Link";

const meta: Meta<typeof Link> = {
  title: "Synapse/Link",
  component: Link,
  argTypes: {
    external: { control: "boolean" },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Link>;

export const Default: Story = {
  args: {
    href: "#",
    children: "Internal link",
  },
};

export const External: Story = {
  args: {
    href: "https://example.com",
    children: "Open in new tab",
    external: true,
  },
};

export const Disabled: Story = {
  args: {
    href: "#",
    children: "Disabled link",
    disabled: true,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Link href="#">Default link</Link>
      <Link href="https://example.com" external>External link</Link>
      <Link href="#" disabled>Disabled link</Link>
      <p style={{ fontSize: 14, color: "var(--color-text-neutral)" }}>
        This is a paragraph with an <Link href="#">inline link</Link> inside it.
      </p>
    </div>
  ),
};

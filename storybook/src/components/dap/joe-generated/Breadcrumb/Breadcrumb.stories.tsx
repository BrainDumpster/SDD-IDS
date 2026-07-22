import type { Meta, StoryObj } from "@storybook/react";
import "../tokens.css";
import Breadcrumb from "./Breadcrumb";
import type { BreadcrumbItem } from "./Breadcrumb";

/**
 * Joe-Generated Breadcrumb — uses only:
 * - storybook/src/components/dap/joe-generated/Breadcrumb/Breadcrumb.tsx
 * - storybook/src/components/dap/joe-generated/Breadcrumb/Breadcrumb.css (imported by Breadcrumb.tsx)
 * - storybook/src/components/dap/joe-generated/tokens.css
 * Spec MDX: components/DAP/joe-generated/Breadcrumb/breadcrumb.mdx
 */

const sampleItems: BreadcrumbItem[] = [
  { label: "Home", href: "#" },
  { label: "Products", href: "#products" },
  { label: "Servers", href: "#servers" },
  { label: "PowerEdge R760", href: "#current", current: true },
];

const meta: Meta<typeof Breadcrumb> = {
  title: "Spec Generated/DAP/Joe-Generated/Breadcrumb",
  component: Breadcrumb,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Joe-generated DAP Breadcrumb. Implementation: `storybook/src/components/dap/joe-generated/Breadcrumb/Breadcrumb.tsx` + `Breadcrumb.css`. Tokens: `storybook/src/components/dap/joe-generated/tokens.css`. Spec MDX: `components/DAP/joe-generated/Breadcrumb/breadcrumb.mdx`.",
      },
    },
  },
  argTypes: {
    variant: { control: "select", options: ["default", "compact"] },
  },
  args: {
    items: sampleItems,
    variant: "default",
  },
};

export default meta;
type Story = StoryObj<typeof Breadcrumb>;

export const Default: Story = {
  args: {
    items: sampleItems,
    variant: "default",
  },
};

export const Compact: Story = {
  args: {
    items: sampleItems,
    variant: "compact",
  },
};

export const TwoLevels: Story = {
  args: {
    items: [
      { label: "Home", href: "#" },
      { label: "Current page", href: "#current", current: true },
    ],
    variant: "default",
  },
};

export const WithDisabledItem: Story = {
  args: {
    items: [
      { label: "Home", href: "#" },
      { label: "Restricted", href: "#restricted", disabled: true },
      { label: "Section", href: "#section" },
      { label: "Current page", current: true },
    ],
    variant: "default",
  },
};

export const LongPath: Story = {
  args: {
    items: [
      { label: "Home", href: "#" },
      { label: "Organization", href: "#org" },
      { label: "Infrastructure", href: "#infra" },
      { label: "Compute", href: "#compute" },
      { label: "Hosts", href: "#hosts" },
      { label: "host-01.example.com", current: true },
    ],
    variant: "default",
  },
};

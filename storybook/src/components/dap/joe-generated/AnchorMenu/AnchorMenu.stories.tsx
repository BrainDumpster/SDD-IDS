import type { Meta, StoryObj } from "@storybook/react";
import "../tokens.css";
import AnchorMenu from "./AnchorMenu";
import type { AnchorMenuItem } from "./AnchorMenu";

/**
 * Joe-Generated AnchorMenu — uses only:
 * - storybook/src/components/dap/joe-generated/AnchorMenu/AnchorMenu.tsx
 * - storybook/src/components/dap/joe-generated/AnchorMenu/AnchorMenu.css (imported by AnchorMenu.tsx)
 * - storybook/src/components/dap/joe-generated/tokens.css
 * Spec MDX: components/DAP/joe-generated/AnchorMenu/anchor-menu.mdx
 */

const sampleItems: AnchorMenuItem[] = [
  { label: "Overview", href: "#overview" },
  { label: "Getting started", href: "#getting-started" },
  { label: "Configuration", href: "#configuration" },
  { label: "Reference", href: "#reference" },
];

const meta: Meta<typeof AnchorMenu> = {
  title: "Spec Generated/DAP/Joe-Generated/AnchorMenu",
  component: AnchorMenu,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Joe-generated DAP AnchorMenu. Implementation: `storybook/src/components/dap/joe-generated/AnchorMenu/AnchorMenu.tsx` + `AnchorMenu.css`. Tokens: `storybook/src/components/dap/joe-generated/tokens.css`. Spec MDX: `components/DAP/joe-generated/AnchorMenu/anchor-menu.mdx`.",
      },
    },
  },
  argTypes: {
    sticky: { control: "boolean" },
    title: { control: "text" },
    onItemClick: { action: "onItemClick" },
  },
  args: {
    items: sampleItems,
    title: "On this page",
    sticky: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: 280, minHeight: 320 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof AnchorMenu>;

export const Default: Story = {
  args: {
    items: sampleItems,
    title: "On this page",
    sticky: true,
  },
};

export const WithActiveItem: Story = {
  args: {
    items: [
      { label: "Overview", href: "#overview" },
      { label: "Getting started", href: "#getting-started", active: true },
      { label: "Configuration", href: "#configuration" },
      { label: "Reference", href: "#reference" },
    ],
    title: "On this page",
    sticky: true,
  },
};

export const WithoutTitle: Story = {
  args: {
    items: sampleItems,
    title: undefined,
    sticky: true,
  },
};

export const NonSticky: Story = {
  args: {
    items: sampleItems,
    title: "On this page",
    sticky: false,
  },
};

export const EmptyItems: Story = {
  args: {
    items: [],
    title: "On this page",
    sticky: true,
  },
};

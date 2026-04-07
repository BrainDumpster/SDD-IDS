import type { Meta, StoryObj } from "@storybook/react";
import { AppLauncher } from "./AppLauncher";

const meta: Meta<typeof AppLauncher> = {
  title: "Synapse/AppLauncher",
  component: AppLauncher,
};

export default meta;
type Story = StoryObj<typeof AppLauncher>;

/** Default icon per Figma: `shield-encrypt-alt` when `icon` is omitted. */
export const DefaultShieldIcons: Story = {
  args: {
    products: [
      { name: "Product Name 1", href: "#" },
      { name: "Product Name 2", href: "#" },
      { name: "Product Name 3", href: "#" },
    ],
  },
};

/** Two columns with vertical column borders between cells (Figma-aligned). */
export const FourProducts: Story = {
  args: {
    products: [
      { name: "Product Name 1", href: "#" },
      { name: "Product Name", href: "#" },
      { name: "Product Name", href: "#" },
      { name: "Product Name", href: "#" },
    ],
  },
};

/** Separator parity check: 4 products shows column dividers + center row divider together. */
export const SeparatorParityFourProducts: Story = {
  args: {
    products: [
      { name: "Product Name 1", href: "#" },
      { name: "Product Name", href: "#" },
      { name: "Product Name", href: "#" },
      { name: "Product Name", href: "#" },
    ],
  },
};

/** Figma "3 products" shape: verifies odd last row and divider alignment. */
export const ThreeProductsOddRow: Story = {
  args: {
    products: [
      { name: "Product Name 1", href: "#" },
      { name: "Product Name", href: "#" },
      { name: "Product Name", href: "#" },
    ],
  },
};

export const WithOptionsAndFooter: Story = {
  args: {
    products: [
      { name: "Product Name 1", href: "#" },
      { name: "Product Name", href: "#" },
    ],
    options: [
      { id: "1", label: "Option" },
      { id: "2", label: "Option" },
      { id: "3", label: "Option" },
    ],
    footerAction: { label: "Action", onClick: () => {} },
  },
};

/** Mixed layout: product grid separators + options region separator. */
export const MixedGridAndOptions: Story = {
  args: {
    products: [
      { name: "Product Name 1", href: "#" },
      { name: "Product Name", href: "#" },
      { name: "Product Name", href: "#" },
      { name: "Product Name", href: "#" },
    ],
    options: [
      { id: "1", label: "Option" },
      { id: "2", label: "Option" },
      { id: "3", label: "Option" },
      { id: "4", label: "Option" },
    ],
  },
};

export const OptionsOnly: Story = {
  args: {
    products: [],
    options: [
      { id: "1", label: "Option" },
      { id: "2", label: "Option" },
    ],
  },
};

export const WithCustomIcons: Story = {
  args: {
    products: [
      {
        name: "Mail",
        icon: (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
            <path d="M3 7L12 13L21 7" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        ),
        href: "#",
      },
      {
        name: "Calendar",
        href: "#",
      },
    ],
  },
};

/** Backward compatibility: `apps` maps to `products`. */
export const LegacyAppsProp: Story = {
  args: {
    apps: [
      { name: "Dashboard", href: "#" },
      { name: "Analytics", href: "#" },
    ],
  },
};

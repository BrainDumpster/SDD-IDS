import type { Meta, StoryObj } from "@storybook/react";
import "../tokens.css";
import AppLauncher from "./AppLauncher";
import type { AppLauncherOption, AppLauncherProduct } from "./AppLauncher";

/**
 * Joe-Generated AppLauncher — uses only:
 * - storybook/src/components/dap/joe-generated/AppLauncher/AppLauncher.tsx
 * - storybook/src/components/dap/joe-generated/AppLauncher/AppLauncher.css (imported by AppLauncher.tsx)
 * - storybook/src/components/dap/joe-generated/tokens.css
 * Spec MDX: components/DAP/joe-generated/AppLauncher/app-launcher.mdx
 */

const twoProducts: AppLauncherProduct[] = [
  { id: "p1", name: "Product One", iconSlug: "shield-encrypt-alt" },
  { id: "p2", name: "Product Two", iconSlug: "cloud" },
];

const fourProducts: AppLauncherProduct[] = [
  { id: "p1", name: "Product One", iconSlug: "shield-encrypt-alt" },
  { id: "p2", name: "Product Two", iconSlug: "cloud" },
  { id: "p3", name: "Product Three", iconSlug: "storage-array-solid" },
  { id: "p4", name: "Product Four", iconSlug: "volumes" },
];

const eightProducts: AppLauncherProduct[] = [
  ...fourProducts,
  { id: "p5", name: "Product Five", iconSlug: "user-single" },
  { id: "p6", name: "Product Six", iconSlug: "virtual-machine" },
  { id: "p7", name: "Product Seven", iconSlug: "workflow" },
  { id: "p8", name: "Product Eight", iconSlug: "widget" },
];

const sampleOptions: AppLauncherOption[] = [
  { id: "opt-1", label: "Manage products" },
  { id: "opt-2", label: "View all apps" },
];

const meta: Meta<typeof AppLauncher> = {
  title: "Spec Generated/DAP/Joe-Generated/AppLauncher",
  component: AppLauncher,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Joe-generated DAP AppLauncher. Implementation: `storybook/src/components/dap/joe-generated/AppLauncher/AppLauncher.tsx` + `AppLauncher.css`. Tokens: `storybook/src/components/dap/joe-generated/tokens.css`. Spec MDX: `components/DAP/joe-generated/AppLauncher/app-launcher.mdx`.",
      },
    },
  },
  argTypes: {
    triggerVariant: { control: "select", options: ["default", "masthead"] },
    columns: { control: { type: "number", min: 1, max: 4 } },
    defaultOpen: { control: "boolean" },
    onOpenChange: { action: "onOpenChange" },
    onProductSelect: { action: "onProductSelect" },
    onOptionSelect: { action: "onOptionSelect" },
  },
  args: {
    products: twoProducts,
    options: sampleOptions,
    columns: 2,
    triggerVariant: "default",
    defaultOpen: true,
  },
  decorators: [
    (Story) => (
      <div
        style={{
          minHeight: 420,
          display: "flex",
          justifyContent: "flex-end",
          padding: 24,
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof AppLauncher>;

/** Products + options (open) */
export const Default: Story = {
  args: {
    products: twoProducts,
    options: sampleOptions,
    columns: 2,
    triggerVariant: "default",
    defaultOpen: true,
  },
};

export const Closed: Story = {
  args: {
    products: twoProducts,
    options: sampleOptions,
    defaultOpen: false,
  },
};

export const ProductsOnly: Story = {
  args: {
    products: twoProducts,
    options: [],
    defaultOpen: true,
  },
};

export const OptionsOnly: Story = {
  args: {
    products: [],
    options: sampleOptions,
    defaultOpen: true,
  },
};

export const ProductsOptionsFooter: Story = {
  args: {
    products: twoProducts,
    options: sampleOptions,
    footerAction: {
      label: "Go to app catalog",
      onClick: () => undefined,
    },
    defaultOpen: true,
  },
};

export const OneProduct: Story = {
  args: {
    products: [{ id: "p1", name: "Product One", iconSlug: "shield-encrypt-alt" }],
    options: [],
    columns: 2,
    defaultOpen: true,
  },
};

export const FourProducts: Story = {
  args: {
    products: fourProducts,
    options: [],
    columns: 2,
    defaultOpen: true,
  },
};

export const EightProducts: Story = {
  args: {
    products: eightProducts,
    options: sampleOptions,
    columns: 2,
    defaultOpen: true,
  },
};

export const MastheadTrigger: Story = {
  args: {
    products: twoProducts,
    options: sampleOptions,
    triggerVariant: "masthead",
    defaultOpen: true,
  },
};

/** Backward-compatible `apps` alias when `products` is omitted */
export const AppsAlias: Story = {
  args: {
    products: undefined,
    apps: twoProducts,
    options: sampleOptions,
    defaultOpen: true,
  },
};

/** Default icon slug when `iconSlug` omitted (`shield-encrypt-alt`) */
export const DefaultProductIcon: Story = {
  args: {
    products: [
      { id: "p1", name: "Default icon" },
      { id: "p2", name: "Cloud", iconSlug: "cloud" },
    ],
    options: [],
    defaultOpen: true,
  },
};

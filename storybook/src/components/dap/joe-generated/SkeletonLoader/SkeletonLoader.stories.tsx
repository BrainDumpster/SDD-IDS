import type { Meta, StoryObj } from "@storybook/react";
import "../tokens.css";
import SkeletonLoader from "./SkeletonLoader";

/**
 * Joe-Generated SkeletonLoader — uses only:
 * - storybook/src/components/dap/joe-generated/SkeletonLoader/SkeletonLoader.tsx
 * - storybook/src/components/dap/joe-generated/SkeletonLoader/SkeletonLoader.css (imported by SkeletonLoader.tsx)
 * - storybook/src/components/dap/joe-generated/tokens.css
 * Spec MDX: components/DAP/joe-generated/SkeletonLoader/skeleton-loader.mdx
 */

const meta: Meta<typeof SkeletonLoader> = {
  title: "Spec Generated/DAP/Joe-Generated/SkeletonLoader",
  component: SkeletonLoader,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Joe-generated DAP SkeletonLoader. Implementation: `storybook/src/components/dap/joe-generated/SkeletonLoader/SkeletonLoader.tsx` + `SkeletonLoader.css`. Tokens: `storybook/src/components/dap/joe-generated/tokens.css`. Spec MDX: `components/DAP/joe-generated/SkeletonLoader/skeleton-loader.mdx`.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["text", "avatar", "image", "card", "button", "list", "table", "form"],
    },
    lines: { control: { type: "number", min: 1, max: 8 } },
    count: { control: { type: "number", min: 1, max: 8 } },
    width: { control: "text" },
    height: { control: "text" },
  },
  args: {
    variant: "text",
    lines: 3,
  },
  decorators: [
    (Story) => (
      <div style={{ width: "100%", maxWidth: 480 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SkeletonLoader>;

export const Default: Story = {
  args: {
    variant: "text",
    lines: 3,
  },
};

export const Text: Story = {
  args: {
    variant: "text",
    lines: 4,
    width: "100%",
  },
};

export const Avatar: Story = {
  args: {
    variant: "avatar",
  },
};

export const Image: Story = {
  args: {
    variant: "image",
    height: 120,
  },
};

export const Button: Story = {
  args: {
    variant: "button",
  },
};

export const Card: Story = {
  args: {
    variant: "card",
  },
};

export const List: Story = {
  args: {
    variant: "list",
    count: 3,
  },
};

export const Table: Story = {
  args: {
    variant: "table",
    count: 4,
  },
};

export const Form: Story = {
  args: {
    variant: "form",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 24 }}>
      <div>
        <div style={{ marginBottom: 8, fontSize: 12 }}>text</div>
        <SkeletonLoader variant="text" lines={3} />
      </div>
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <div>
          <div style={{ marginBottom: 8, fontSize: 12 }}>avatar</div>
          <SkeletonLoader variant="avatar" />
        </div>
        <div>
          <div style={{ marginBottom: 8, fontSize: 12 }}>button</div>
          <SkeletonLoader variant="button" />
        </div>
      </div>
      <div>
        <div style={{ marginBottom: 8, fontSize: 12 }}>image</div>
        <SkeletonLoader variant="image" />
      </div>
      <div>
        <div style={{ marginBottom: 8, fontSize: 12 }}>card</div>
        <SkeletonLoader variant="card" />
      </div>
      <div>
        <div style={{ marginBottom: 8, fontSize: 12 }}>list</div>
        <SkeletonLoader variant="list" count={2} />
      </div>
      <div>
        <div style={{ marginBottom: 8, fontSize: 12 }}>table</div>
        <SkeletonLoader variant="table" count={2} />
      </div>
      <div>
        <div style={{ marginBottom: 8, fontSize: 12 }}>form</div>
        <SkeletonLoader variant="form" />
      </div>
    </div>
  ),
};

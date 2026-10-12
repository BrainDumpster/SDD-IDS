import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "@ids/lit/icon/register.js";

const meta: Meta = {
  title: "Spec Generated/IDS/Icon",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
Reusable Lit icon (React \`IdsIcon\` parity). Glyphs resolve from \`assets/icons/<shape>.svg\`.

| Prop | Notes |
|------|--------|
| \`shape\` / \`shape-name\` | slug under \`assets/icons\` |
| \`variant\` | \`mask\` (default, tintable) · \`img\` · \`inline\` |
| \`color\` / \`size\` | semantic token color + box size |
`,
      },
    },
  },
  argTypes: {
    shape: { control: "text" },
    variant: { control: "select", options: ["mask", "img", "inline"] },
    color: { control: "text" },
    size: { control: "number" },
  },
  args: {
    shape: "chev-down-thick",
    variant: "mask",
    color: "var(--color-icon-gray-neutral-base)",
    size: 24,
  },
};

export default meta;
type Story = StoryObj;

export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  render: (args) => html`
    <ids-icon
      shape=${args.shape}
      variant=${args.variant}
      color=${args.color}
      size=${String(args.size)}
    ></ids-icon>
  `,
};

export const MaskTint: Story = {
  name: "Mask (tintable)",
  render: () => html`
    <div style="display:flex;gap:16px;align-items:center;color:var(--color-icon-gray-neutral-strong)">
      <ids-icon shape="chev-down-thick" size="16"></ids-icon>
      <ids-icon shape="settings-gear" size="24" color="var(--color-icon-brand-base)"></ids-icon>
      <ids-icon shape="home" size="32"></ids-icon>
    </div>
  `,
};

export const ImgVariant: Story = {
  name: "Img (full color)",
  render: () => html`
    <ids-icon shape="status-critical-square-solid" variant="img" size="24"></ids-icon>
  `,
};

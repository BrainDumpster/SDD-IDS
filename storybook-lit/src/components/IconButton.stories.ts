import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { action } from "@storybook/addon-actions";
import "@ids/lit/icon-button/register.js";

/** Design-spec `onClick` → Lit `ids-icon-button-click`. */
const onClickAction = action("onClick");

const meta: Meta = {
  title: "Spec Generated/IDS/Icon Button",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Lit `ids-icon-button` from `components/ids/icon-button/design-spec.md`. Required `shape` → `ids-icon`. Activation: `ids-icon-button-click` (design-spec `onClick`). Glyphs 12 / 14 / 16.",
      },
      source: {
        code: `<ids-icon-button
  shape="shape-plus"
  variant="primary"
  size="large"
  ariaLabel="Add"
></ids-icon-button>
<script>
  document.querySelector("ids-icon-button")
    ?.addEventListener("ids-icon-button-click", (e) => console.log(e));
</script>`,
        language: "html",
      },
    },
  },
  argTypes: {
    shape: { control: "text" },
    variant: {
      control: "select",
      options: ["primary", "secondary", "tertiary", "ghostNeutral"],
    },
    size: {
      control: "select",
      options: ["small", "medium", "large"],
    },
    disabled: { control: "boolean" },
    loading: { control: "boolean" },
  },
  args: {
    shape: "shape-plus",
    variant: "primary",
    size: "large",
    disabled: false,
    loading: false,
    ariaLabel: "Add",
  },
};

export default meta;
type Story = StoryObj;

export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  render: (args) => html`
    <ids-icon-button
      shape=${args.shape || "shape-plus"}
      variant=${args.variant}
      size=${args.size}
      ?disabled=${Boolean(args.disabled)}
      ?loading=${Boolean(args.loading)}
      .ariaLabel=${args.ariaLabel || "Add"}
      @ids-icon-button-click=${onClickAction}
    ></ids-icon-button>
  `,
};

export const Variants: Story = {
  render: () => html`
    <div style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center">
      <ids-icon-button
        shape="shape-plus"
        variant="primary"
        ariaLabel="Primary"
        @ids-icon-button-click=${onClickAction}
      ></ids-icon-button>
      <ids-icon-button
        shape="shape-plus"
        variant="secondary"
        ariaLabel="Secondary"
        @ids-icon-button-click=${onClickAction}
      ></ids-icon-button>
      <ids-icon-button
        shape="shape-plus"
        variant="tertiary"
        ariaLabel="Tertiary"
        @ids-icon-button-click=${onClickAction}
      ></ids-icon-button>
      <ids-icon-button
        shape="shape-plus"
        variant="ghostNeutral"
        ariaLabel="Ghost Neutral"
        @ids-icon-button-click=${onClickAction}
      ></ids-icon-button>
    </div>
  `,
};

export const Sizes: Story = {
  render: () => html`
    <div style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center">
      <ids-icon-button
        shape="shape-plus"
        size="small"
        ariaLabel="Small"
        @ids-icon-button-click=${onClickAction}
      ></ids-icon-button>
      <ids-icon-button
        shape="shape-plus"
        size="medium"
        ariaLabel="Medium"
        @ids-icon-button-click=${onClickAction}
      ></ids-icon-button>
      <ids-icon-button
        shape="shape-plus"
        size="large"
        ariaLabel="Large"
        @ids-icon-button-click=${onClickAction}
      ></ids-icon-button>
    </div>
  `,
};

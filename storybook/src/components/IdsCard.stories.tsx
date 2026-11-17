import "../../../components/ids-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import { Card } from "./Card";

const meta: Meta<typeof Card> = {
  title: "Spec Generated/IDS/Card",
  component: Card,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "IDS Card — `border-radius: var(--card-control-radius)` resolves to 8px via `components/ids-theme.css`. Source: `components/ids/card/design-spec.md`.",
      },
    },
  },
  args: {
    title: "Card title",
    children: "Card body content uses Body 1 typography and semantic surface tokens.",
    elevated: false,
    outlined: false,
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

/** IDS default — 8px corners (`--card-control-radius` → `radius-8`). */
export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  args: {
    title: "Configuration",
    children:
      "IDS card shell uses var(--card-control-radius). With ids-theme.css this resolves to var(--corner-radius-radius-8) (8px).",
    footer: (
      <button
        type="button"
        style={{
          padding: "10px 16px",
          borderRadius: "var(--button-control-radius, 2px)",
          border: "1px solid transparent",
          background: "var(--color-background-controls-brand-base)",
          color: "var(--color-text-white)",
          cursor: "pointer",
        }}
      >
        Action
      </button>
    ),
    showButtons: true,
  },
};

export const Elevated: Story = {
  args: {
    title: "Elevated card",
    children: "Level 1 elevation shadow on card surface.",
    elevated: true,
  },
};

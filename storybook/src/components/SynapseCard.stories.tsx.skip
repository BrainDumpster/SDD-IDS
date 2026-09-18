import "../../../components/synapse-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import { Card } from "./Card";

const SYNAPSE_CARD_SPEC = "components/synapse/card/design-spec.md";
const SYNAPSE_CARD_NODE = "50419:259141";

const meta: Meta<typeof Card> = {
  title: "Components/Synapse/Card",
  component: Card,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          `Synapse Card (IDS fork). Source: \`${SYNAPSE_CARD_SPEC}\`.`,
          `Figma node \`${SYNAPSE_CARD_NODE}\`. Theme override: \`--card-control-radius\` → \`var(--corner-radius-radius-10)\` (10px).`,
        ].join(" "),
      },
    },
  },
  args: {
    title: "Card title",
    children: "Synapse card body.",
    elevated: false,
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

/** Synapse override — 10px corners via theme alias (not component CSS). */
export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  args: {
    title: "Synapse card",
    children:
      "Same Card component as IDS. Synapse theme sets --card-control-radius to var(--corner-radius-radius-10) (10px).",
    footer: (
      <button
        type="button"
        style={{
          padding: "10px 16px",
          borderRadius: "var(--button-control-radius)",
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

/** Side-by-side proof: theme alias drives radius without forking component CSS. */
export const CornerRadiusOverride: Story = {
  name: "Corner Radius Override (10px)",
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        padding: 24,
        maxWidth: 360,
        background: "var(--color-background-surface-1)",
      }}
    >
      <p style={{ margin: 0, fontSize: 12, color: "var(--color-text-neutral)" }}>
        Synapse programme: <code>--card-control-radius</code> ={" "}
        <code>var(--corner-radius-radius-10)</code> (10px). IDS baseline is 8px.
      </p>
      <Card
        title="10px corner radius"
        elevated
      >
        Inspect computed <code>border-radius</code> on the card root — should be 10px when
        synapse-theme.css is active.
      </Card>
    </div>
  ),
};

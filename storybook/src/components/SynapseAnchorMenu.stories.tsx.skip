import "../../../components/synapse-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import { SynapseAnchorMenu } from "./SynapseAnchorMenu";
import {
  SYNAPSE_ANCHOR_MENU_DESIGN_SPEC_PATH,
  SYNAPSE_ANCHOR_MENU_SAMPLE_ITEMS,
  SYNAPSE_ANCHOR_MENU_SPEC_ACCURATE_NODE_ID,
} from "../spec-contracts/synapse-anchor-menu.contract";

const meta: Meta<typeof SynapseAnchorMenu> = {
  title: "Components/Synapse/Anchor Menu",
  component: SynapseAnchorMenu,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          `Spec-driven Synapse Anchor Menu (IDS-fork). Source: \`${SYNAPSE_ANCHOR_MENU_DESIGN_SPEC_PATH}\`.`,
          `Primary story: Figma example \`${SYNAPSE_ANCHOR_MENU_SPEC_ACCURATE_NODE_ID}\`.`,
        ].join(" "),
      },
    },
  },
  args: {
    items: [...SYNAPSE_ANCHOR_MENU_SAMPLE_ITEMS],
  },
};

export default meta;
type Story = StoryObj<typeof SynapseAnchorMenu>;

export const SpecAccurateExample: Story = {
  name: "Spec Accurate / Five Sections",
};

export const MiddleActive: Story = {
  args: {
    items: SYNAPSE_ANCHOR_MENU_SAMPLE_ITEMS.map((item, index) => ({
      ...item,
      active: index === 2,
    })),
  },
};

export const WithPageContent: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 32, padding: 24 }}>
      <div style={{ flex: 1, color: "var(--color-text-neutral-strong)" }}>
        {SYNAPSE_ANCHOR_MENU_SAMPLE_ITEMS.map((item) => (
          <h2
            key={item.href}
            id={item.href.replace("#", "")}
            style={{ marginBottom: 120 }}
          >
            {item.label}
          </h2>
        ))}
      </div>
      <SynapseAnchorMenu items={[...SYNAPSE_ANCHOR_MENU_SAMPLE_ITEMS]} />
    </div>
  ),
};

/* Spec Generated — Synapse Topology Element shapes */
import "../../../../components/synapse-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import { TopologyElementShell } from "./TopologyElementShell";
import {
  SYNAPSE_TOPOLOGY_ELEMENT_BOARD_NODE_ID,
  SYNAPSE_TOPOLOGY_ELEMENT_SPEC_PATH,
  SYNAPSE_TOPOLOGY_ELEMENT_TYPE_LIST,
  type TopologyElementInteractionState,
} from "../../spec-contracts/topology/synapse-topology-element.contract";
import { SYNAPSE_TOPOLOGY_ELEMENT_TYPE_LABELS, type TopologyElementType } from "../../spec-contracts/topology/synapse-topology.contract";

const meta: Meta<typeof TopologyElementShell> = {
  title: "Spec Generated/Synapse/Topology Element",
  component: TopologyElementShell,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          `Figma \`.Topology Element\` board (\`${SYNAPSE_TOPOLOGY_ELEMENT_BOARD_NODE_ID}\`).`,
          `Design spec: \`${SYNAPSE_TOPOLOGY_ELEMENT_SPEC_PATH}\`.`,
          "Each type uses a shape-matched container; hover outline follows container geometry with `4px` spacing.",
        ].join(" "),
      },
    },
  },
  decorators: [
    (Story) => (
      <div data-design-system="synapse" style={{ padding: 24, background: "var(--color-background-surface-1)" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof TopologyElementShell>;

function ElementMatrix({ state }: { state: TopologyElementInteractionState }) {
  const hovered = state === "hover";
  const selected = state === "selected";

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(120px, 1fr))",
        gap: 32,
        alignItems: "start",
        justifyItems: "center",
      }}
    >
      {SYNAPSE_TOPOLOGY_ELEMENT_TYPE_LIST.map((elementType) => (
        <div key={elementType} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <TopologyElementShell elementType={elementType} hovered={hovered} selected={selected} />
          <span style={{ fontSize: 12, color: "var(--color-text-neutral)", textAlign: "center" }}>
            {SYNAPSE_TOPOLOGY_ELEMENT_TYPE_LABELS[elementType as TopologyElementType]}
          </span>
        </div>
      ))}
    </div>
  );
}

export const AllTypesDefault: Story = {
  name: "All Types / Default",
  render: () => <ElementMatrix state="default" />,
};

export const AllTypesHover: Story = {
  name: "All Types / Hover",
  render: () => <ElementMatrix state="hover" />,
};

export const AllTypesSelected: Story = {
  name: "All Types / Selected",
  render: () => <ElementMatrix state="selected" />,
};

export const ApplicationServiceVioletBorder: Story = {
  name: "Application Service (violet default border)",
  args: {
    elementType: "applicationService",
  },
};

export const HypervisorPentagon: Story = {
  name: "Hypervisor (pentagon)",
  args: {
    elementType: "hypervisor",
    hovered: true,
  },
};

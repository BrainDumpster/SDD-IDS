import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { SPEC_ACCURATE_DESIGN_STORY } from "../../../component-contracts/common/story-meta";
import {
  SYNAPSE_DETAIL_PANEL_API_DEFAULTS,
  SYNAPSE_DETAIL_PANEL_DESIGN_SPEC_PATH,
  SYNAPSE_DETAIL_PANEL_IDS_BASELINE_SPEC_PATH,
} from "../spec-contracts/synapse-detail-panel.contract";
import {
  SynapseDetailPanel,
  SynapseDetailPanelBody,
  SynapseDetailPanelHeader,
  type SynapseDetailPanelAttachMode,
} from "./SynapseDetailPanel";
import "../../../components/synapse-theme.css";

const meta: Meta<typeof SynapseDetailPanel> = {
  title: "Spec Generated/Synapse/Detail Panel",
  component: SynapseDetailPanel,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: [
          `Spec-driven Synapse Detail Panel (IDS-fork, shared \`IdsDetailPanel\`).`,
          `Source: \`${SYNAPSE_DETAIL_PANEL_DESIGN_SPEC_PATH}\`.`,
          `IDS baseline: \`${SYNAPSE_DETAIL_PANEL_IDS_BASELINE_SPEC_PATH}\`.`,
        ].join(" "),
      },
    },
  },
  args: {
    attachMode: SYNAPSE_DETAIL_PANEL_API_DEFAULTS.attachMode,
    isExpanded: SYNAPSE_DETAIL_PANEL_API_DEFAULTS.expanded,
  },
};

export default meta;
type Story = StoryObj<typeof SynapseDetailPanel>;

function logEvent(name: string) {
  return () => {
    // eslint-disable-next-line no-console
    console.log(`[Synapse Detail Panel event] ${name}`);
  };
}

function ExampleBody() {
  return (
    <div style={{ display: "grid", gap: 12, color: "var(--color-text-neutral)" }}>
      <div style={{ fontWeight: 500, color: "var(--color-text-neutral-strong)" }}>Section Header</div>
      <div>Label: Single line content</div>
      <div>Status: Warning</div>
    </div>
  );
}

function PanelFrame({
  attachMode,
  initialExpanded,
}: {
  attachMode: SynapseDetailPanelAttachMode;
  initialExpanded: boolean;
}) {
  const [expanded, setExpanded] = useState(initialExpanded);

  return (
    <div
      style={{
        height: "100vh",
        background: "var(--color-background-surface-1)",
        padding: 16,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          height: 768,
          border: "1px solid var(--color-border-accessible)",
          background: "var(--color-background-component)",
        }}
      >
        <main style={{ flex: 1, minWidth: 0, padding: 16, overflow: "auto" }}>Host content</main>
        <SynapseDetailPanel
          attachMode={attachMode}
          isExpanded={expanded}
          onExpandedChange={setExpanded}
          onOpened={logEvent("opened")}
          onClosed={logEvent("closed")}
        >
          <SynapseDetailPanelHeader>{SYNAPSE_DETAIL_PANEL_API_DEFAULTS.title}</SynapseDetailPanelHeader>
          <SynapseDetailPanelBody>
            <ExampleBody />
          </SynapseDetailPanelBody>
        </SynapseDetailPanel>
      </div>
    </div>
  );
}

export const SpecAccurateDesign: Story = {
  name: SPEC_ACCURATE_DESIGN_STORY,
  render: () => <PanelFrame attachMode="datagrid" initialExpanded={true} />,
};

export const DatagridAttached: Story = {
  render: () => <PanelFrame attachMode="datagrid" initialExpanded={true} />,
};

export const PageAttached: Story = {
  render: () => <PanelFrame attachMode="page" initialExpanded={true} />,
};

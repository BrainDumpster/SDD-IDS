import "../../../components/synapse-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { SynapseDetailPanel } from "./SynapseDetailPanel";
import {
  SYNAPSE_DETAIL_PANEL_SAMPLE_ROWS,
} from "../spec-contracts/synapse-detail-panel.contract";

const meta: Meta<typeof SynapseDetailPanel> = {
  title: "Spec Generated/Synapse/Detail Panel",
  component: SynapseDetailPanel,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Synapse Detail Panel — ids-fork of IDS Detail Panel. Topology attach mode uses rich header + close; datagrid/page delegate to IdsDetailPanel.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof SynapseDetailPanel>;

function TopologyAttachFrame() {
  const [open, setOpen] = useState(true);

  return (
    <div
      data-design-system="synapse"
      style={{
        height: "100vh",
        padding: 24,
        boxSizing: "border-box",
        background: "var(--color-background-surface-1)",
      }}
    >
      <div
        style={{
          display: "flex",
          height: 720,
          maxWidth: 1200,
          margin: "0 auto",
          border: "1px solid var(--color-border-light)",
          background: "var(--color-background-surface-2)",
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <main style={{ flex: 1, minWidth: 0, padding: 24, boxSizing: "border-box" }}>
          <h3 style={{ marginTop: 0 }}>Topology canvas host</h3>
          <p style={{ color: "var(--color-text-neutral)" }}>
            Main column shrinks when the detail panel is open (Figma <code>54012:298595</code>).
          </p>
          <button type="button" onClick={() => setOpen((value) => !value)}>
            {open ? "Close panel" : "Open panel"}
          </button>
        </main>
        <SynapseDetailPanel
          attachMode="topology"
          isExpanded={open}
          onExpandedChange={setOpen}
          title="Node Name"
          subtitle="Hardware Node"
          iconSlug="objects-square"
          rows={SYNAPSE_DETAIL_PANEL_SAMPLE_ROWS}
          primaryAction={{ label: "Primary Action" }}
          secondaryAction={{ label: "Secondary Action" }}
        />
      </div>
    </div>
  );
}

function IdsDelegateFrame({
  attachMode,
  initialExpanded,
}: {
  attachMode: "datagrid" | "page";
  initialExpanded: boolean;
}) {
  const [expanded, setExpanded] = useState(initialExpanded);

  return (
    <div
      data-design-system="synapse"
      style={{ height: "100vh", padding: 16, boxSizing: "border-box", background: "var(--color-background-surface-1)" }}
    >
      <div
        style={{
          display: "flex",
          height: 640,
          border: "1px solid var(--color-border-accessible)",
          background: "var(--color-background-component)",
        }}
      >
        <div style={{ flex: 1, padding: 16 }}>Host content</div>
        <SynapseDetailPanel
          attachMode={attachMode}
          isExpanded={expanded}
          onExpandedChange={setExpanded}
          title="Details"
          body={
            <div style={{ display: "grid", gap: 12 }}>
              <strong>Section header</strong>
              <span>Label: Single line content</span>
            </div>
          }
        />
      </div>
    </div>
  );
}

export const TopologyAttachMode: Story = {
  name: "Topology Attach Mode",
  render: () => <TopologyAttachFrame />,
};

export const DatagridAttachMode: Story = {
  name: "Datagrid Attach Mode (IDS delegate)",
  render: () => <IdsDelegateFrame attachMode="datagrid" initialExpanded />,
};

export const PageAttachMode: Story = {
  name: "Page Attach Mode (IDS delegate)",
  render: () => <IdsDelegateFrame attachMode="page" initialExpanded />,
};

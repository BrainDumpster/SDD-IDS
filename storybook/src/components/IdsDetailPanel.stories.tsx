import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { IdsDetailPanel, type IdsDetailPanelAttachMode } from "./IdsDetailPanel";
import "../../../components/ids-theme.css";

const meta: Meta<typeof IdsDetailPanel> = {
  title: "Spec Generated/IDS/Detail Panel",
  component: IdsDetailPanel,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "IDS Detail Panel examples for datagrid-attached and page-attached modes with deterministic expand/collapse behavior.",
      },
    },
  },
  args: {
    attachMode: "datagrid",
    isExpanded: true,
    title: "Details",
  },
};

export default meta;
type Story = StoryObj<typeof IdsDetailPanel>;

function ExampleContent() {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ fontSize: "var(--font-size-body-2)", lineHeight: "var(--font-line-height-line-height-20)", color: "var(--color-text-gray-neutral-strong)", fontWeight: 500 }}>
        Section Header
      </div>
      <div style={{ fontSize: "var(--font-size-body-2)", lineHeight: "var(--font-line-height-line-height-20)", color: "var(--color-text-gray-neutral)" }}>
        Label: Single line content
      </div>
      <div style={{ fontSize: "var(--font-size-body-2)", lineHeight: "var(--font-line-height-line-height-20)", color: "var(--color-text-gray-neutral)" }}>
        Status: Warning
      </div>
      <div style={{ height: 600, border: "1px dashed var(--color-border-gray-neutral-base)", padding: 12, boxSizing: "border-box" }}>
        Overflow sample content area
      </div>
    </div>
  );
}

function PanelFrame({ attachMode, initialExpanded }: { attachMode: IdsDetailPanelAttachMode; initialExpanded: boolean }) {
  const [expanded, setExpanded] = useState(initialExpanded);
  const frameHeight = attachMode === "datagrid" ? 792 : 768;

  return (
    <div style={{ height: "100vh", background: "var(--color-background-surface-primary)", padding: 16, boxSizing: "border-box" }}>
      <div style={{ marginBottom: 12, fontSize: 14, color: "var(--color-text-gray-neutral-strong)" }}>
        Attach mode: <strong>{attachMode}</strong> | State: <strong>{expanded ? "expanded" : "collapsed"}</strong>
      </div>
      <div style={{ display: "flex", height: frameHeight, border: "1px solid var(--color-border-gray-neutral-base)", background: "var(--color-background-surface-component)" }}>
        <main style={{ flex: 1, minWidth: 0, padding: 16, boxSizing: "border-box", overflow: "auto" }}>
          <h3 style={{ marginTop: 0 }}>Host content</h3>
          <p>Panel is attached to this host region and toggles between 398px and 40px widths.</p>
          <div style={{ height: 900, border: "1px dashed var(--color-border-gray-neutral-base)", padding: 12 }}>
            Scrollable host content
          </div>
        </main>
        <div style={{ margin: "-1px -1px -1px 0", flexShrink: 0, display: "flex" }}>
          <IdsDetailPanel
            attachMode={attachMode}
            isExpanded={expanded}
            onExpandedChange={setExpanded}
            title="Details"
            body={<ExampleContent />}
          />
        </div>
      </div>
    </div>
  );
}

export const DatagridAttachedManual: Story = {
  render: () => <PanelFrame attachMode="datagrid" initialExpanded={true} />,
};

export const PageAttachedManual: Story = {
  render: () => <PanelFrame attachMode="page" initialExpanded={true} />,
};

export const CollapsedStates: Story = {
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, height: "100vh", padding: 16, boxSizing: "border-box", background: "var(--color-background-surface-primary)" }}>
      <div style={{ border: "1px solid var(--color-border-gray-neutral-base)", background: "var(--color-background-surface-component)", display: "flex" }}>
        <div style={{ flex: 1, padding: 12 }}>Datagrid host</div>
        <div style={{ margin: "-1px -1px -1px 0", flexShrink: 0, display: "flex" }}>
            <IdsDetailPanel attachMode="datagrid" isExpanded={false} body={<ExampleContent />} />
          </div>
      </div>
      <div style={{ border: "1px solid var(--color-border-gray-neutral-base)", background: "var(--color-background-surface-component)", display: "flex" }}>
        <div style={{ flex: 1, padding: 12 }}>Page host</div>
        <div style={{ margin: "-1px -1px -1px 0", flexShrink: 0, display: "flex" }}>
            <IdsDetailPanel attachMode="page" isExpanded={false} body={<ExampleContent />} />
          </div>
      </div>
    </div>
  ),
};

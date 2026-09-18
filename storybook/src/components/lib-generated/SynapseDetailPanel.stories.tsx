/**
 * Storybook: design-spec–generated Detail Panel from `lib/react/synapse/detail-panel`
 * (IDS-fork reexport façade — React + CSS Modules).
 *
 * Theme: components/synapse-theme.css
 * Spec: components/synapse/detail-panel/design-spec.md
 *
 * Composition:
 *   SynapseDetailPanel
 *     SynapseDetailPanelContent
 *       Header+Body (datagrid) | Body+Footer (page)
 *     SynapseDetailPanelCollapsedRail
 *       SynapseDetailPanelToggleButton
 */
import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/synapse-theme.css";
import {
  SYNAPSE_DETAIL_PANEL_DOCS_DESCRIPTION,
  SYNAPSE_DETAIL_PANEL_SOURCE_CODE,
} from "./synapse-detail-panel.developer-usage";
import {
  SynapseDetailPanel,
  SynapseDetailPanelBody,
  SynapseDetailPanelCollapsedRail,
  SynapseDetailPanelContent,
  SynapseDetailPanelFooter,
  SynapseDetailPanelHeader,
  SynapseDetailPanelToggleButton,
  type SynapseDetailPanelAttachMode,
  type SynapseDetailPanelProps,
} from "@synapse/react/detail-panel";

const meta: Meta<SynapseDetailPanelProps> = {
  tags: ["autodocs"],
  title: "Components/Synapse/Detail Panel",
  component: SynapseDetailPanel,
  parameters: {
    layout: "fullscreen",
    docs: {
      canvas: { sourceState: "open" },
      description: {
        component: SYNAPSE_DETAIL_PANEL_DOCS_DESCRIPTION,
      },
      source: {
        type: "code",
        language: "tsx",
        code: SYNAPSE_DETAIL_PANEL_SOURCE_CODE,
      },
    },
  },
  args: {
    attachMode: "datagrid",
    isExpanded: true,
  },
  argTypes: {
    attachMode: { control: "select", options: ["datagrid", "page"] },
    isExpanded: { control: "boolean" },
    onExpandedChange: { action: "onExpandedChange" },
  },
};

export default meta;
type Story = StoryObj<SynapseDetailPanelProps>;

function ExampleContent() {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div
        style={{
          fontSize: "var(--font-size-body-2)",
          lineHeight: "var(--font-line-height-line-height-20)",
          color: "var(--color-text-gray-neutral-strong)",
          fontWeight: 500,
        }}
      >
        Section Header
      </div>
      <div
        style={{
          fontSize: "var(--font-size-body-2)",
          lineHeight: "var(--font-line-height-line-height-20)",
          color: "var(--color-text-gray-neutral)",
        }}
      >
        Label: Single line content
      </div>
      <div
        style={{
          fontSize: "var(--font-size-body-2)",
          lineHeight: "var(--font-line-height-line-height-20)",
          color: "var(--color-text-gray-neutral)",
        }}
      >
        Status: Warning
      </div>
      <div
        style={{
          height: 600,
          border: "1px dashed var(--color-border-gray-neutral-base)",
          padding: 12,
          boxSizing: "border-box",
        }}
      >
        Overflow sample content area
      </div>
    </div>
  );
}

function DetailPanelTree({
  attachMode,
  isExpanded,
  onExpandedChange,
}: {
  attachMode: SynapseDetailPanelAttachMode;
  isExpanded: boolean;
  onExpandedChange?: (next: boolean) => void;
}) {
  return (
    <SynapseDetailPanel
      attachMode={attachMode}
      isExpanded={isExpanded}
      onExpandedChange={onExpandedChange}
    >
      <SynapseDetailPanelContent>
        {attachMode === "datagrid" ? (
          <SynapseDetailPanelHeader>
            Details
            <SynapseDetailPanelToggleButton />
          </SynapseDetailPanelHeader>
        ) : null}
        <SynapseDetailPanelBody>
          <ExampleContent />
        </SynapseDetailPanelBody>
        {attachMode === "page" ? (
          <SynapseDetailPanelFooter>
            <SynapseDetailPanelToggleButton />
          </SynapseDetailPanelFooter>
        ) : null}
      </SynapseDetailPanelContent>
      <SynapseDetailPanelCollapsedRail>
        <SynapseDetailPanelToggleButton />
      </SynapseDetailPanelCollapsedRail>
    </SynapseDetailPanel>
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
  const frameHeight = attachMode === "datagrid" ? 792 : 768;

  return (
    <div
      style={{
        height: "100vh",
        background: "var(--color-background-surface-primary)",
        padding: 16,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          marginBottom: 12,
          fontSize: 14,
          color: "var(--color-text-gray-neutral-strong)",
        }}
      >
        Attach mode: <strong>{attachMode}</strong> | State:{" "}
        <strong>{expanded ? "expanded" : "collapsed"}</strong>
      </div>
      <div
        style={{
          display: "flex",
          height: frameHeight,
          border: "1px solid var(--color-border-gray-neutral-base)",
          background: "var(--color-background-surface-component)",
        }}
      >
        <main
          style={{
            flex: 1,
            minWidth: 0,
            padding: 16,
            boxSizing: "border-box",
            overflow: "auto",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Host content</h3>
          <p>
            Panel is attached to this host region and toggles between 398px and 40px
            widths.
          </p>
          <div
            style={{
              height: 900,
              border: "1px dashed var(--color-border-gray-neutral-base)",
              padding: 12,
            }}
          >
            Scrollable host content
          </div>
        </main>
        <div style={{ margin: "-1px -1px -1px 0", flexShrink: 0, display: "flex" }}>
          <DetailPanelTree
            attachMode={attachMode}
            isExpanded={expanded}
            onExpandedChange={setExpanded}
          />
        </div>
      </div>
    </div>
  );
}

export const DatagridAttachedManual: Story = {
  name: "Datagrid Attached Manual",
  render: () => <PanelFrame attachMode="datagrid" initialExpanded={true} />,
};

export const PageAttachedManual: Story = {
  name: "Page Attached Manual",
  render: () => <PanelFrame attachMode="page" initialExpanded={true} />,
};

export const CollapsedStates: Story = {
  name: "Collapsed States",
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 16,
        height: "100vh",
        padding: 16,
        boxSizing: "border-box",
        background: "var(--color-background-surface-primary)",
      }}
    >
      <div
        style={{
          border: "1px solid var(--color-border-gray-neutral-base)",
          background: "var(--color-background-surface-component)",
          display: "flex",
        }}
      >
        <div style={{ flex: 1, padding: 12 }}>Datagrid host</div>
        <div style={{ margin: "-1px -1px -1px 0", flexShrink: 0, display: "flex" }}>
          <DetailPanelTree attachMode="datagrid" isExpanded={false} />
        </div>
      </div>
      <div
        style={{
          border: "1px solid var(--color-border-gray-neutral-base)",
          background: "var(--color-background-surface-component)",
          display: "flex",
        }}
      >
        <div style={{ flex: 1, padding: 12 }}>Page host</div>
        <div style={{ margin: "-1px -1px -1px 0", flexShrink: 0, display: "flex" }}>
          <DetailPanelTree attachMode="page" isExpanded={false} />
        </div>
      </div>
    </div>
  ),
};

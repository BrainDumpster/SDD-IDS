import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { SPEC_ACCURATE_DESIGN_STORY } from "../../../component-contracts/common/story-meta";
import {
  DETAIL_PANEL_SPEC_ACCURATE_DEFAULTS,
  IDS_DETAIL_PANEL_DESIGN_SPEC_PATH,
} from "../../../component-contracts/ids/detail-panel.contract";
import {
  IdsDetailPanel,
  IdsDetailPanelBody,
  IdsDetailPanelHeader,
  type IdsDetailPanelAttachMode,
} from "./IdsDetailPanel";
import "../../../components/ids-theme.css";

const meta: Meta<typeof IdsDetailPanel> = {
  title: "Spec Generated/IDS/Detail Panel",
  component: IdsDetailPanel,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `IDS Detail Panel per \`${IDS_DETAIL_PANEL_DESIGN_SPEC_PATH}\`. Composition: \`IdsDetailPanel.Header\` + \`IdsDetailPanel.Body\`.`,
      },
    },
  },
  args: {
    attachMode: DETAIL_PANEL_SPEC_ACCURATE_DEFAULTS.attachMode,
    isExpanded: DETAIL_PANEL_SPEC_ACCURATE_DEFAULTS.expanded,
  },
};

export default meta;
type Story = StoryObj<typeof IdsDetailPanel>;

function logEvent(name: string) {
  return () => {
    // eslint-disable-next-line no-console
    console.log(`[IDS Detail Panel event] ${name}`);
  };
}

function ExampleBody() {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div
        style={{
          fontSize: "var(--font-size-body-2)",
          lineHeight: "var(--font-line-height-line-height-20)",
          color: "var(--color-text-neutral-strong)",
          fontWeight: 500,
        }}
      >
        Section Header
      </div>
      <div
        style={{
          fontSize: "var(--font-size-body-2)",
          lineHeight: "var(--font-line-height-line-height-20)",
          color: "var(--color-text-neutral)",
        }}
      >
        Label: Single line content
      </div>
      <div
        style={{
          fontSize: "var(--font-size-body-2)",
          lineHeight: "var(--font-line-height-line-height-20)",
          color: "var(--color-text-neutral)",
        }}
      >
        Status: Warning
      </div>
      <div
        style={{
          height: 600,
          border: "1px dashed var(--color-border-accessible)",
          padding: 12,
          boxSizing: "border-box",
        }}
      >
        Overflow sample content area
      </div>
    </div>
  );
}

function PanelFrame({
  attachMode,
  initialExpanded,
}: {
  attachMode: IdsDetailPanelAttachMode;
  initialExpanded: boolean;
}) {
  const [expanded, setExpanded] = useState(initialExpanded);
  const frameHeight = attachMode === "datagrid" ? 792 : 768;

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
          marginBottom: 12,
          fontSize: 14,
          color: "var(--color-text-neutral-strong)",
        }}
      >
        Attach mode: <strong>{attachMode}</strong> | State:{" "}
        <strong>{expanded ? "expanded" : "collapsed"}</strong>
      </div>
      <div
        style={{
          display: "flex",
          height: frameHeight,
          border: "1px solid var(--color-border-accessible)",
          background: "var(--color-background-component)",
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
          <p>Panel toggles between 398px and 40px widths.</p>
        </main>
        <IdsDetailPanel
          attachMode={attachMode}
          isExpanded={expanded}
          onExpandedChange={setExpanded}
          onOpened={logEvent("opened")}
          onClosed={logEvent("closed")}
        >
          <IdsDetailPanelHeader>{DETAIL_PANEL_SPEC_ACCURATE_DEFAULTS.title}</IdsDetailPanelHeader>
          <IdsDetailPanelBody>
            <ExampleBody />
          </IdsDetailPanelBody>
        </IdsDetailPanel>
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

export const CollapsedStates: Story = {
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 16,
        height: "100vh",
        padding: 16,
        boxSizing: "border-box",
        background: "var(--color-background-surface-1)",
      }}
    >
      <div
        style={{
          border: "1px solid var(--color-border-accessible)",
          background: "var(--color-background-component)",
          display: "flex",
        }}
      >
        <div style={{ flex: 1, padding: 12 }}>Datagrid host</div>
        <IdsDetailPanel
          attachMode="datagrid"
          isExpanded={false}
          onOpened={logEvent("opened")}
          onClosed={logEvent("closed")}
        >
          <IdsDetailPanelBody>
            <ExampleBody />
          </IdsDetailPanelBody>
        </IdsDetailPanel>
      </div>
      <div
        style={{
          border: "1px solid var(--color-border-accessible)",
          background: "var(--color-background-component)",
          display: "flex",
        }}
      >
        <div style={{ flex: 1, padding: 12 }}>Page host</div>
        <IdsDetailPanel
          attachMode="page"
          isExpanded={false}
          onOpened={logEvent("opened")}
          onClosed={logEvent("closed")}
        >
          <IdsDetailPanelBody>
            <ExampleBody />
          </IdsDetailPanelBody>
        </IdsDetailPanel>
      </div>
    </div>
  ),
};

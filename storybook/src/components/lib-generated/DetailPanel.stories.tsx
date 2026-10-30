/**
 * Storybook: design-spec–generated Detail Panel from `lib/react/ids/detail-panel`
 * (React + CSS Modules, no @base-ui-components).
 *
 * Theme: components/ids-theme.css
 * Spec: components/ids/detail-panel/design-spec.md
 *
 * Composition:
 *   IdsDetailPanel
 *     IdsDetailPanelContent
 *       Header+Body (datagrid) | Body+Footer (page)
 *         Body: IdsDetailPanelSection > IdsDetailPanelField | IdsDetailPanelBlock | tabs
 *     IdsDetailPanelCollapsedRail
 *       IdsDetailPanelToggleButton
 */
import React, { useState, type ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/ids-theme.css";
import {
  DETAIL_PANEL_DOCS_DESCRIPTION,
  DETAIL_PANEL_SOURCE_CODE,
} from "./ids-detail-panel.developer-usage";
import {
  IdsDetailPanel,
  IdsDetailPanelBlock,
  IdsDetailPanelBody,
  IdsDetailPanelCollapsedRail,
  IdsDetailPanelContent,
  IdsDetailPanelDetachButton,
  IdsDetailPanelField,
  IdsDetailPanelFooter,
  IdsDetailPanelHeader,
  IdsDetailPanelSection,
  IdsDetailPanelToggleButton,
  type IdsDetailPanelAttachMode,
  type IdsDetailPanelProps,
} from "@ids/react/detail-panel";
import { IdsAlert } from "@ids/react/alert";
import {
  IdsDatagrid,
  type IdsDatagridColumnDef,
  type IdsDatagridRowDef,
} from "@ids/react/datagrid";
import { IdsTabs } from "@ids/react/tab";

const meta: Meta<IdsDetailPanelProps> = {
  tags: ["autodocs"],
  title: "Components/IDS/Detail Panel",
  component: IdsDetailPanel,
  parameters: {
    layout: "fullscreen",
    docs: {
      canvas: { sourceState: "open" },
      description: {
        component: DETAIL_PANEL_DOCS_DESCRIPTION,
      },
      source: {
        type: "code",
        language: "tsx",
        code: DETAIL_PANEL_SOURCE_CODE,
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
    onDetachedChange: { action: "onDetachedChange" },
  },
};

export default meta;
type Story = StoryObj<IdsDetailPanelProps>;

/** Figma "Detail Panel Template": section headers with label / value rows, ruled apart. */
function TemplateContent() {
  return (
    <>
      <IdsDetailPanelSection title="Section Header">
        <IdsDetailPanelField label="Label:">Single line content</IdsDetailPanelField>
        <IdsDetailPanelField label="Label:">
          Multiple line content that wraps onto the next line when it is longer than the
          panel width
        </IdsDetailPanelField>
        <IdsDetailPanelField label="Label:">Single line content</IdsDetailPanelField>
      </IdsDetailPanelSection>
      <IdsDetailPanelSection title="Section Header">
        <IdsDetailPanelField label="Label:">Single line content</IdsDetailPanelField>
        <IdsDetailPanelField label="Label:">Single line content</IdsDetailPanelField>
        <IdsDetailPanelField label="Label:">Single line content</IdsDetailPanelField>
      </IdsDetailPanelSection>
    </>
  );
}

function TabsContent() {
  return (
    <IdsTabs
      type="secondary"
      surface="transparent"
      overflow={false}
      items={[
        { id: "overview", label: "Overview", content: <TemplateContent /> },
        {
          id: "activity",
          label: "Activity",
          content: (
            <IdsDetailPanelSection title="Recent activity">
              <IdsDetailPanelField label="Updated:">2 hours ago</IdsDetailPanelField>
              <IdsDetailPanelField label="Updated by:">Operations</IdsDetailPanelField>
            </IdsDetailPanelSection>
          ),
        },
      ]}
    />
  );
}

function AlertContent() {
  return (
    <>
      <IdsDetailPanelBlock>
        <IdsAlert
          display="inline"
          density="compact"
          severity="warning-minor"
          message="This item has unsaved changes."
          dismissible
        />
      </IdsDetailPanelBlock>
      <TemplateContent />
    </>
  );
}

function DetailPanelTree({
  attachMode,
  isExpanded,
  onExpandedChange,
  detachable = false,
  children = <TemplateContent />,
}: {
  attachMode: IdsDetailPanelAttachMode;
  isExpanded: boolean;
  onExpandedChange?: (next: boolean) => void;
  /** Adds the pop-out control (datagrid only). */
  detachable?: boolean;
  children?: ReactNode;
}) {
  return (
    <IdsDetailPanel
      attachMode={attachMode}
      isExpanded={isExpanded}
      onExpandedChange={onExpandedChange}
    >
      <IdsDetailPanelContent>
        {attachMode === "datagrid" ? (
          <IdsDetailPanelHeader>
            Details
            {detachable ? <IdsDetailPanelDetachButton /> : null}
            <IdsDetailPanelToggleButton />
          </IdsDetailPanelHeader>
        ) : null}
        <IdsDetailPanelBody>{children}</IdsDetailPanelBody>
        {attachMode === "page" ? (
          <IdsDetailPanelFooter>
            <IdsDetailPanelToggleButton />
          </IdsDetailPanelFooter>
        ) : null}
      </IdsDetailPanelContent>
      <IdsDetailPanelCollapsedRail>
        <IdsDetailPanelToggleButton />
      </IdsDetailPanelCollapsedRail>
    </IdsDetailPanel>
  );
}

function PanelFrame({
  attachMode,
  initialExpanded,
  detachable,
  children,
}: {
  attachMode: IdsDetailPanelAttachMode;
  initialExpanded: boolean;
  detachable?: boolean;
  children?: ReactNode;
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
            {attachMode === "datagrid"
              ? "Datagrid panels size to their content between 240px and 480px and collapse to a 40px rail."
              : "Page panels are 384px wide (the guideline maximum) and collapse to a 40px rail."}
            {detachable
              ? " Use the pop-out control to float the panel; drag its corner to resize (up to 480 × 1280)."
              : null}
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
            detachable={detachable}
          >
            {children}
          </DetailPanelTree>
        </div>
      </div>
    </div>
  );
}

export const DatagridAttachedManual: Story = {
  name: "Datagrid Attached Manual",
  render: () => <PanelFrame attachMode="datagrid" initialExpanded={true} />,
};

export const DatagridWithTabs: Story = {
  name: "Datagrid With Tabs",
  render: () => (
    <PanelFrame attachMode="datagrid" initialExpanded={true}>
      <TabsContent />
    </PanelFrame>
  ),
};

export const DatagridWithInlineAlert: Story = {
  name: "Datagrid With Inline Alert",
  render: () => (
    <PanelFrame attachMode="datagrid" initialExpanded={true}>
      <AlertContent />
    </PanelFrame>
  ),
};

export const DatagridPopOut: Story = {
  name: "Datagrid Pop-out",
  render: () => <PanelFrame attachMode="datagrid" initialExpanded={true} detachable />,
};

export const PageAttachedManual: Story = {
  name: "Page Attached Manual",
  render: () => <PanelFrame attachMode="page" initialExpanded={true} />,
};

const PAGE_COLUMNS: IdsDatagridColumnDef[] = [
  { key: "name", title: "Name", minWidth: 90, width: 240 },
  { key: "type", title: "Type", minWidth: 90, width: 120 },
  { key: "status", title: "Status", minWidth: 90, width: 120 },
  { key: "owner", title: "Owner", minWidth: 90, width: 140 },
  { key: "region", title: "Region", minWidth: 90, width: 100 },
];

const PAGE_ROWS: IdsDatagridRowDef[] = [
  { id: "na-control", values: { name: "North America Control Plane", type: "Service", status: "Healthy", owner: "Platform", region: "NA" } },
  { id: "emea-edge", values: { name: "EMEA Edge Cluster", type: "Cluster", status: "Warning", owner: "SRE", region: "EU" } },
  { id: "apac-obs", values: { name: "APAC Observability", type: "Service", status: "Healthy", owner: "Observability", region: "APAC" } },
  { id: "billing", values: { name: "Billing Ledger", type: "Database", status: "Healthy", owner: "Finance", region: "NA" } },
  { id: "identity", values: { name: "Identity Gateway", type: "Service", status: "Critical", owner: "Security", region: "EU" } },
  { id: "partner", values: { name: "Partner Portal", type: "Application", status: "Healthy", owner: "Product", region: "NA" } },
];

/**
 * Page-level panel beside a data grid (IDS guideline "For Page"): always present and
 * only collapsible, full content-area height, at most 384px wide. One row is always
 * highlighted (the first by default) and drives the panel content.
 */
function PageWithDatagridLayout() {
  const [activeRowId, setActiveRowId] = useState(PAGE_ROWS[0].id);
  const [expanded, setExpanded] = useState(true);
  const activeRow = PAGE_ROWS.find((row) => row.id === activeRowId) ?? PAGE_ROWS[0];

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "var(--color-background-surface-primary)",
      }}
    >
      <main
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          gap: 16,
          padding: 16,
          boxSizing: "border-box",
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: "var(--font-size-body-1)",
            color: "var(--color-text-gray-neutral-strong)",
          }}
        >
          Production Engine
        </h3>
        <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
          <IdsDatagrid
            columns={PAGE_COLUMNS}
            rows={PAGE_ROWS}
            activeRowId={activeRowId}
            onRowClick={setActiveRowId}
            rowVerticalIndicator
          />
        </div>
      </main>
      <DetailPanelTree attachMode="page" isExpanded={expanded} onExpandedChange={setExpanded}>
        <IdsDetailPanelSection title={activeRow.values.name}>
          {PAGE_COLUMNS.filter((column) => column.key !== "name").map((column) => (
            <IdsDetailPanelField key={column.key} label={`${column.title}:`}>
              {activeRow.values[column.key]}
            </IdsDetailPanelField>
          ))}
        </IdsDetailPanelSection>
      </DetailPanelTree>
    </div>
  );
}

export const PageWithDatagrid: Story = {
  name: "Page With Datagrid",
  render: () => <PageWithDatagridLayout />,
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

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
 *     IdsDetailPanelCollapsedRail
 *       IdsDetailPanelToggleButton
 */
import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/ids-theme.css";
import {
  IdsDetailPanel,
  IdsDetailPanelBody,
  IdsDetailPanelCollapsedRail,
  IdsDetailPanelContent,
  IdsDetailPanelFooter,
  IdsDetailPanelHeader,
  IdsDetailPanelToggleButton,
  type IdsDetailPanelAttachMode,
  type IdsDetailPanelProps,
} from "../../../../lib/react/ids/detail-panel";

const meta: Meta<IdsDetailPanelProps> = {
  title: "Lib Generated/IDS/Detail Panel",
  component: IdsDetailPanel,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "React IDS Detail Panel from `components/ids/detail-panel/design-spec.md`. " +
          "Compound composition: Content / Header / Body / Footer / CollapsedRail / ToggleButton. " +
          "`attachMode: datagrid | page`, expanded `398px` / collapsed `40px`. " +
          "Theme: `components/ids-theme.css`. No `@base-ui-components`.",
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
type Story = StoryObj<IdsDetailPanelProps>;

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
  attachMode: IdsDetailPanelAttachMode;
  isExpanded: boolean;
  onExpandedChange?: (next: boolean) => void;
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
            <IdsDetailPanelToggleButton />
          </IdsDetailPanelHeader>
        ) : null}
        <IdsDetailPanelBody>
          <ExampleContent />
        </IdsDetailPanelBody>
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

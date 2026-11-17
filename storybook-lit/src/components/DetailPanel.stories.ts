/**
 * Storybook: IDS Lit Detail Panel from `lib/lit/ids/detail-panel`
 *
 * Theme: components/ids-theme.css (via preview)
 * Spec: components/ids/detail-panel/design-spec.md
 * API: lib/react/ids/detail-panel + Angular composition children
 * Examples: storybook/src/components/lib-generated/DetailPanel.stories.tsx
 */
import type { Meta, StoryObj } from "@storybook/web-components";
import { html, nothing } from "lit";
import { useArgs } from "@storybook/preview-api";
import "@ids/core/detail-panel/register.js";
import "@ids/core/tab/register.js";
import {
  DETAIL_PANEL_DOCS_DESCRIPTION,
  DETAIL_PANEL_SOURCE_CODE,
} from "./ids-detail-panel.developer-usage";

type AttachMode = "datagrid" | "page";

type DetailPanelArgs = {
  attachMode: AttachMode;
  isExpanded: boolean;
  detachable?: boolean;
  onExpandedChange?: (next: boolean) => void;
  onDetachedChange?: (next: boolean) => void;
};

const meta: Meta<DetailPanelArgs> = {
  title: "Spec Generated/IDS/Detail Panel",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: { component: DETAIL_PANEL_DOCS_DESCRIPTION },
      source: { code: DETAIL_PANEL_SOURCE_CODE, language: "html" },
    },
  },
  argTypes: {
    attachMode: { control: "select", options: ["datagrid", "page"] },
    isExpanded: { control: "boolean" },
    onExpandedChange: { action: "onExpandedChange" },
    onDetachedChange: { action: "onDetachedChange" },
  },
  args: {
    attachMode: "datagrid",
    isExpanded: true,
  },
};

export default meta;
type Story = StoryObj<DetailPanelArgs>;

const templateContent = html`
  <ids-detail-panel-section title="Section Header">
    <ids-detail-panel-field label="Label:"
      >Single line content</ids-detail-panel-field
    >
    <ids-detail-panel-field label="Label:"
      >Multiple line content that wraps onto the next line when it is longer
      than the panel width</ids-detail-panel-field
    >
    <ids-detail-panel-field label="Label:"
      >Single line content</ids-detail-panel-field
    >
  </ids-detail-panel-section>
  <ids-detail-panel-section title="Section Header">
    <ids-detail-panel-field label="Label:"
      >Single line content</ids-detail-panel-field
    >
    <ids-detail-panel-field label="Label:"
      >Single line content</ids-detail-panel-field
    >
    <ids-detail-panel-field label="Label:"
      >Single line content</ids-detail-panel-field
    >
  </ids-detail-panel-section>
`;

function detailPanelTree(
  attachMode: AttachMode,
  isExpanded: boolean,
  options: {
    detachable?: boolean;
    body?: unknown;
    onExpandedChange?: (next: boolean) => void;
    onDetachedChange?: (next: boolean) => void;
  } = {},
) {
  const body = options.body ?? templateContent;
  return html`
    <ids-detail-panel
      attachmode=${attachMode}
      .isExpanded=${isExpanded}
      .onExpandedChange=${options.onExpandedChange}
      .onDetachedChange=${options.onDetachedChange}
    >
      <ids-detail-panel-content>
        ${attachMode === "datagrid"
          ? html`
              <ids-detail-panel-header>
                Details
                ${options.detachable
                  ? html`<ids-detail-panel-detach-button></ids-detail-panel-detach-button>`
                  : nothing}
                <ids-detail-panel-toggle-button></ids-detail-panel-toggle-button>
              </ids-detail-panel-header>
            `
          : nothing}
        <ids-detail-panel-body>${body}</ids-detail-panel-body>
        ${attachMode === "page"
          ? html`
              <ids-detail-panel-footer>
                <ids-detail-panel-toggle-button></ids-detail-panel-toggle-button>
              </ids-detail-panel-footer>
            `
          : nothing}
      </ids-detail-panel-content>
      <ids-detail-panel-collapsed-rail>
        <ids-detail-panel-toggle-button></ids-detail-panel-toggle-button>
      </ids-detail-panel-collapsed-rail>
    </ids-detail-panel>
  `;
}

function panelFrame(
  attachMode: AttachMode,
  isExpanded: boolean,
  options: {
    detachable?: boolean;
    body?: unknown;
    onExpandedChange?: (next: boolean) => void;
    onDetachedChange?: (next: boolean) => void;
  } = {},
) {
  const frameHeight = attachMode === "datagrid" ? 792 : 768;
  return html`
    <div
      style="height:100vh;background:var(--color-background-surface-primary);padding:16px;box-sizing:border-box;"
    >
      <div
        style="margin-bottom:12px;font-size:14px;color:var(--color-text-gray-neutral-strong);"
      >
        Attach mode: <strong>${attachMode}</strong> | State:
        <strong>${isExpanded ? "expanded" : "collapsed"}</strong>
      </div>
      <div
        style="display:flex;height:${frameHeight}px;border:1px solid var(--color-border-gray-neutral-base);background:var(--color-background-surface-component);"
      >
        <main
          style="flex:1;min-width:0;padding:16px;box-sizing:border-box;overflow:auto;"
        >
          <h3 style="margin-top:0;">Host content</h3>
          <p>
            ${attachMode === "datagrid"
              ? "Datagrid panels size to their content between 240px and 480px and collapse to a 40px rail."
              : "Page panels are 384px wide (the guideline maximum) and collapse to a 40px rail."}
            ${options.detachable
              ? " Use the pop-out control to float the panel; drag its corner to resize (up to 480 × 1280)."
              : nothing}
          </p>
          <div
            style="height:900px;border:1px dashed var(--color-border-gray-neutral-base);padding:12px;"
          >
            Scrollable host content
          </div>
        </main>
        <div style="margin:-1px -1px -1px 0;flex-shrink:0;display:flex;">
          ${detailPanelTree(attachMode, isExpanded, options)}
        </div>
      </div>
    </div>
  `;
}

export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  args: { attachMode: "datagrid", isExpanded: true },
  render: (args) => {
    const [, updateArgs] = useArgs();
    return panelFrame(args.attachMode, args.isExpanded, {
      onExpandedChange: (next) => {
        args.onExpandedChange?.(next);
        updateArgs({ isExpanded: next });
      },
      onDetachedChange: args.onDetachedChange,
    });
  },
};

export const DatagridAttachedManual: Story = {
  name: "Datagrid Attached Manual",
  render: () => {
    const [{ isExpanded = true }, updateArgs] = useArgs();
    return panelFrame("datagrid", isExpanded, {
      onExpandedChange: (next) => updateArgs({ isExpanded: next }),
    });
  },
};

export const DatagridWithTabs: Story = {
  name: "Datagrid With Tabs",
  render: () => {
    const [{ isExpanded = true }, updateArgs] = useArgs();
    return panelFrame("datagrid", isExpanded, {
      onExpandedChange: (next) => updateArgs({ isExpanded: next }),
      body: html`
        <ids-tabs
          type="secondary"
          surface="transparent"
          .overflow=${false}
          .items=${[
            {
              id: "overview",
              label: "Overview",
              content: "Overview content — see Spec Accurate Design template.",
            },
            {
              id: "activity",
              label: "Activity",
              content: "Updated: 2 hours ago · Updated by: Operations",
            },
          ]}
        ></ids-tabs>
        ${templateContent}
      `,
    });
  },
};

export const DatagridWithInlineAlert: Story = {
  name: "Datagrid With Inline Alert",
  render: () => {
    const [{ isExpanded = true }, updateArgs] = useArgs();
    return panelFrame("datagrid", isExpanded, {
      onExpandedChange: (next) => updateArgs({ isExpanded: next }),
      body: html`
        <ids-detail-panel-block>
          <div
            role="status"
            style="padding:8px 12px;border:1px solid var(--color-border-gray-neutral-base);background:var(--color-background-surface-primary);color:var(--color-text-gray-neutral-strong);font-size:var(--font-size-body-2);"
          >
            This item has unsaved changes.
          </div>
        </ids-detail-panel-block>
        ${templateContent}
      `,
    });
  },
};

export const DatagridPopOut: Story = {
  name: "Datagrid Pop-out",
  render: () => {
    const [{ isExpanded = true }, updateArgs] = useArgs();
    return panelFrame("datagrid", isExpanded, {
      detachable: true,
      onExpandedChange: (next) => updateArgs({ isExpanded: next }),
    });
  },
};

export const PageAttachedManual: Story = {
  name: "Page Attached Manual",
  render: () => {
    const [{ isExpanded = true }, updateArgs] = useArgs();
    return panelFrame("page", isExpanded, {
      onExpandedChange: (next) => updateArgs({ isExpanded: next }),
    });
  },
};

export const CollapsedStates: Story = {
  name: "Collapsed States",
  render: () => html`
    <div
      style="display:grid;grid-template-columns:1fr 1fr;gap:16px;height:100vh;padding:16px;box-sizing:border-box;background:var(--color-background-surface-primary);"
    >
      <div
        style="border:1px solid var(--color-border-gray-neutral-base);background:var(--color-background-surface-component);display:flex;"
      >
        <div style="flex:1;padding:12px;">Datagrid host</div>
        <div style="margin:-1px -1px -1px 0;flex-shrink:0;display:flex;">
          ${detailPanelTree("datagrid", false)}
        </div>
      </div>
      <div
        style="border:1px solid var(--color-border-gray-neutral-base);background:var(--color-background-surface-component);display:flex;"
      >
        <div style="flex:1;padding:12px;">Page host</div>
        <div style="margin:-1px -1px -1px 0;flex-shrink:0;display:flex;">
          ${detailPanelTree("page", false)}
        </div>
      </div>
    </div>
  `,
};

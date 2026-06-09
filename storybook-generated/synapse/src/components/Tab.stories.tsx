import React, { useState, type ComponentProps } from "react";
import "../../../../components/synapse-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import { Icon } from "../../../../storybook/src/components/Icon";
import { SynapseTabs } from "../../../../storybook/src/components/SynapseTabs";
import {
  SYNAPSE_NAV_TAB_GROUP_FOUR_NODE_ID,
  SYNAPSE_NAV_TAB_GROUP_OVERFLOW_NODE_ID,
  SYNAPSE_TAB_DEFAULT_NODE_ID,
  SYNAPSE_TAB_DESIGN_SPEC_PATH,
  SYNAPSE_TAB_MAX_WIDTH_NODE_ID,
  SYNAPSE_TAB_MAX_WIDTH_PX,
  SYNAPSE_TAB_MIN_WIDTH_NODE_ID,
  SYNAPSE_TAB_MIN_WIDTH_PX,
  SYNAPSE_TAB_NO_ICON_NODE_ID,
} from "../../../../storybook/src/spec-contracts/synapse-tab.contract";

const navTabPanel = (name: string) => `${name} panel content.`;

const fourTabItems: ComponentProps<typeof SynapseTabs>["items"] = [
  { id: "tab-1", label: "Tab name", panel: navTabPanel("Tab 1") },
  { id: "tab-2", label: "Tab name", panel: navTabPanel("Tab 2") },
  { id: "tab-3", label: "Tab name", panel: navTabPanel("Tab 3") },
  { id: "tab-4", label: "Tab name", panel: navTabPanel("Tab 4") },
];

const overflowTabItems: ComponentProps<typeof SynapseTabs>["items"] = Array.from(
  { length: 12 },
  (_, index) => ({
    id: `overflow-${index + 1}`,
    label: "Tab name",
    panel: navTabPanel(`Overflow tab ${index + 1}`),
  }),
);

const specAccurateArgs: ComponentProps<typeof SynapseTabs> = {
  items: fourTabItems,
  defaultActiveTabId: "tab-1",
  showAddTab: true,
  minTabWidth: SYNAPSE_TAB_MIN_WIDTH_PX,
  maxTabWidth: SYNAPSE_TAB_MAX_WIDTH_PX,
};

const meta: Meta<typeof SynapseTabs> = {
  title: "Spec Generated/Synapse/Tab",
  component: SynapseTabs,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          `Spec-driven Synapse Nav Tab (IDS Tab contract). Source: \`${SYNAPSE_TAB_DESIGN_SPEC_PATH}\`.`,
          `Primary story: **4 tabs + add** (Figma \`${SYNAPSE_NAV_TAB_GROUP_FOUR_NODE_ID}\`).`,
          `Chrome: 32px height, min ${SYNAPSE_TAB_MIN_WIDTH_PX}px / max ${SYNAPSE_TAB_MAX_WIDTH_PX}px, closable tabs, \`shape-plus\` add, overflow \`More\` menu.`,
          "Theme: `components/synapse-theme.css`.",
        ].join(" "),
      },
    },
  },
  args: specAccurateArgs,
};

export default meta;
type Story = StoryObj<typeof SynapseTabs>;

function TabFrame({
  width = 492,
  children,
}: {
  width?: number | string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        width,
        maxWidth: "100%",
        boxSizing: "border-box",
        background: "var(--color-background-surface-1)",
        padding: 16,
      }}
    >
      {children}
    </div>
  );
}

/** Resizable host for overflow stories — drag the right edge or resize the viewport. */
function ResponsiveOverflowTabFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        width: "100%",
        minHeight: "100dvh",
        boxSizing: "border-box",
        background: "var(--color-background-surface-1)",
        padding: 16,
      }}
    >
      <div
        style={{
          width: "min(100%, 900px)",
          minWidth: 240,
          maxWidth: "100%",
          resize: "horizontal",
          overflow: "hidden",
          boxSizing: "border-box",
          border: "1px dashed var(--color-border-light)",
        }}
      >
        {children}
      </div>
      <p
        style={{
          margin: "8px 0 0",
          fontSize: "var(--font-size-body-2)",
          lineHeight: "var(--font-line-height-line-height-20)",
          color: "var(--color-text-neutral)",
        }}
      >
        Drag the dashed container edge or resize the Storybook canvas to show the More overflow
        menu.
      </p>
    </div>
  );
}

/** Figma `47835:4947` — Nav Tab Group, 4 tabs + add (`492×33` row). */
export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  render: (args) => (
    <TabFrame width={492}>
      <SynapseTabs {...args} />
    </TabFrame>
  ),
  args: specAccurateArgs,
};

/** Figma `52922:70327` — default tab, label + close only (no leading icon). */
export const DefaultNoIcon: Story = {
  name: "Default No Icon",
  render: () => (
    <TabFrame width={114}>
      <SynapseTabs
        items={[{ id: "solo", label: "Tab name", panel: navTabPanel("Solo") }]}
        defaultActiveTabId="solo"
        minTabWidth={SYNAPSE_TAB_MIN_WIDTH_PX}
        maxTabWidth={SYNAPSE_TAB_MAX_WIDTH_PX}
      />
    </TabFrame>
  ),
  parameters: {
    docs: {
      description: {
        story: `Figma \`${SYNAPSE_TAB_NO_ICON_NODE_ID}\` / default \`${SYNAPSE_TAB_DEFAULT_NODE_ID}\`.`,
      },
    },
  },
};

/** Figma `52920:61689` — optional leading `16×16` tab icon. */
export const WithTabIcon: Story = {
  name: "With Tab Icon",
  render: () => (
    <TabFrame width={160}>
      <SynapseTabs
        items={[
          {
            id: "workspace",
            label: "Tab name",
            panel: navTabPanel("Workspace"),
            icon: <Icon shapeName="grid-square-9" style={{ width: 16, height: 16 }} />,
          },
        ]}
        defaultActiveTabId="workspace"
      />
    </TabFrame>
  ),
};

/** Figma `50431:32236` — minimum width 80px (incl. close). */
export const MinWidth: Story = {
  name: "Min Width 80px",
  render: () => (
    <TabFrame width={80}>
      <SynapseTabs
        items={[{ id: "min", label: "Tab name", panel: navTabPanel("Min") }]}
        defaultActiveTabId="min"
        minTabWidth={SYNAPSE_TAB_MIN_WIDTH_PX}
        maxTabWidth={SYNAPSE_TAB_MAX_WIDTH_PX}
      />
    </TabFrame>
  ),
  parameters: {
    docs: {
      description: { story: `Figma \`${SYNAPSE_TAB_MIN_WIDTH_NODE_ID}\`.` },
    },
  },
};

/** Figma `50454:81701` — max width 250px with ellipsis on long label. */
export const MaxWidthTruncation: Story = {
  name: "Max Width 250px",
  render: () => (
    <TabFrame width={250}>
      <SynapseTabs
        items={[
          {
            id: "max",
            label: "Tab name example long tab name and more text",
            panel: navTabPanel("Max"),
          },
        ]}
        defaultActiveTabId="max"
        minTabWidth={SYNAPSE_TAB_MIN_WIDTH_PX}
        maxTabWidth={SYNAPSE_TAB_MAX_WIDTH_PX}
      />
    </TabFrame>
  ),
  parameters: {
    docs: {
      description: { story: `Figma \`${SYNAPSE_TAB_MAX_WIDTH_NODE_ID}\` — label ellipsizes at 250px.` },
    },
  },
};

/** Figma `47835:4949` / `47806:419` — overflow row with `More` + add tab. */
export const NavTabGroupOverflow: Story = {
  name: "Nav Tab Group Overflow",
  render: () => (
    <ResponsiveOverflowTabFrame>
      <SynapseTabs
        items={overflowTabItems}
        defaultActiveTabId="overflow-1"
        showAddTab
        minTabWidth={SYNAPSE_TAB_MIN_WIDTH_PX}
        maxTabWidth={SYNAPSE_TAB_MAX_WIDTH_PX}
      />
    </ResponsiveOverflowTabFrame>
  ),
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story: `Figma \`${SYNAPSE_NAV_TAB_GROUP_OVERFLOW_NODE_ID}\` — drag the dashed container edge or resize the canvas to see the overflow \`More\` menu.`,
      },
    },
  },
};

/** Dynamic add tab — appends a new closable nav tab. */
export const AddTabDynamic: Story = {
  name: "Add Tab Dynamic",
  render: () => {
    const [items, setItems] = useState(fourTabItems);

    return (
      <TabFrame width={560}>
        <SynapseTabs
          items={items}
          defaultActiveTabId={items[0]?.id}
          showAddTab
          onAddTab={() => {
            const nextIndex = items.length + 1;
            const id = `new-${nextIndex}`;
            setItems((prev) => [
              ...prev,
              {
                id,
                label: `Tab name`,
                panel: navTabPanel(`New ${nextIndex}`),
              },
            ]);
          }}
        />
      </TabFrame>
    );
  },
};

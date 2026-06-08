import React, { type ComponentProps } from "react";
import "../../../../components/synapse-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import {
  SynapseLeftNav,
  type SynapseLeftNavPrimaryItem,
} from "../../../../storybook/src/components/SynapseLeftNav";
import styles from "../../../../storybook/src/components/MainMenuLeft.module.css";
import {
  SYNAPSE_LEFT_NAV_OVERFLOW_BUTTON_NODE_ID,
  SYNAPSE_LEFT_NAV_SECONDARY_HOVER_NODE_ID,
  SYNAPSE_LEFT_NAV_SECONDARY_SELECTED_NODE_ID,
} from "../../../../storybook/src/spec-contracts/synapse-left-nav.contract";
import { Icon } from "../../../../storybook/src/components/Icon";

const DESIGN_SPEC_PATH = "components/synapse/left-nav/design-spec.md";

/** Figma `47807:8153` expanded sample — same tree shape as IDS Main Menu Left stories. */
const specAccurateItems: SynapseLeftNavPrimaryItem[] = [
  { id: "home", name: "Home", iconName: "home", routeRef: "/home" },
  { id: "recommendations", name: "Recommendations", iconName: "light-bulb", routeRef: "/recommendations" },
  {
    id: "workspace",
    name: "Workspace",
    iconName: "grid-square-9",
    routeRef: "/workspace",
    childrenMenu: "collapsed",
    children: [
      { id: "ws-a", name: "Secondary Item", routeRef: "/workspace/a" },
      { id: "ws-b", name: "Secondary Item", routeRef: "/workspace/b" },
    ],
  },
  { id: "favorites", name: "Favorites", iconName: "star-fav", routeRef: "/favorites" },
  { id: "recent", name: "Recent", iconName: "time-clock", routeRef: "/recent" },
];

const specAccurateArgs: ComponentProps<typeof SynapseLeftNav> = {
  expanded: true,
  defaultSelectedItemId: "home",
  items: specAccurateItems,
  newChat: { label: "New Chat", onAction: () => undefined },
};

const meta: Meta<typeof SynapseLeftNav> = {
  title: "Spec Generated/Synapse/Left Nav",
  component: SynapseLeftNav,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: [
          `Spec-driven Synapse Left Nav (IDS Main Menu/Left contract). Source: \`${DESIGN_SPEC_PATH}\`.`,
          "Primary story: expanded **250px** rail (Figma `47807:8153`); New Chat is the first row inside `MainMenuList`, then Home (selected), etc.",
          "Stories: **Spec Accurate Design**, **Collapsed**, primary/secondary matrices, **SecondarySelectedRecent**, **SecondaryContextMenuRecent** (`50514:23038`), **SecondaryContextButtonStateMatrix** (`50516:35461`). Theme: `components/synapse-theme.css`.",
        ].join(" "),
      },
    },
  },
  args: specAccurateArgs,
};

export default meta;
type Story = StoryObj<typeof SynapseLeftNav>;

function SpecAccurateFrame(props: ComponentProps<typeof SynapseLeftNav>) {
  return (
    <div
      style={{
        height: "100vh",
        boxSizing: "border-box",
        display: "flex",
        background: "var(--color-background-surface-1)",
        minHeight: 0,
      }}
    >
      <SynapseLeftNav {...props} />
      <div
        style={{
          flex: 1,
          minWidth: 0,
          padding: 24,
          color: "var(--color-text-neutral-strong)",
          fontSize: 14,
        }}
      >
        <p style={{ margin: 0, opacity: 0.85 }}>
          Main content area — use the rail collapse control to verify **64px** icon-only mode (New Chat as icon-only `shape-plus`).
        </p>
      </div>
    </div>
  );
}

/** Canonical reference: expanded left nav (Figma `47807:8153`); Workspace row has `children` with `childrenMenu: "collapsed"`. */
export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  render: (args) => <SpecAccurateFrame {...args} />,
  args: specAccurateArgs,
};

/** Collapsed icon-only rail (**64px**); New Chat remains as icon-only `shape-plus` (Figma `47807:8168`). */
export const Collapsed: Story = {
  render: (args) => <SpecAccurateFrame {...args} />,
  args: { ...specAccurateArgs, expanded: false },
};

/** Collapsed icon-only primary states — Figma `47807:8043` (`MainMenu-Left-Element-PrimaryIcon`). */
export const CollapsedPrimaryStateSnapshotMatrix: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        padding: 16,
        background: "var(--color-background-surface-1)",
      }}
    >
      <SynapseLeftNav
        expanded={false}
        forceStates
        items={[
          { id: "default", name: "Default", iconName: "home", state: "default" },
          { id: "hover", name: "Hover", iconName: "home", state: "hover" },
          { id: "press", name: "Press", iconName: "home", state: "press" },
          { id: "selected", name: "Selected", iconName: "home", state: "selected" },
          {
            id: "default-focus",
            name: "Default focus",
            iconName: "home",
            state: "default-focus",
          },
          {
            id: "selected-focus",
            name: "Selected focus",
            iconName: "home",
            state: "selected-focus",
          },
        ]}
      />
    </div>
  ),
};

const recentChatChildren = Array.from({ length: 6 }, (_, index) => ({
  id: `recent-chat-${index + 1}`,
  name: "Recent chat item",
  routeRef: `/recent/${index + 1}`,
}));

/** Figma `50512:84338` — Recent expanded; fifth secondary row selected (`controls-brand-lighter`, `neutral-strong` text, no inset). */
export const SecondarySelectedRecent: Story = {
  name: "Secondary Selected Recent",
  render: () => (
    <SpecAccurateFrame
      expanded
      defaultExpandedChildrenItemId="recent"
      defaultSelectedSecondaryItemId={{ parentItemId: "recent", childId: "recent-chat-5" }}
      items={[
        { id: "home", name: "Home", iconName: "home", routeRef: "/home" },
        {
          id: "recent",
          name: "Recent",
          iconName: "time-clock",
          routeRef: "/recent",
          children: recentChatChildren,
        },
      ]}
      newChat={{ label: "New Chat", onAction: () => undefined }}
    />
  ),
};

/** Figma `50514:23038` — Recent expanded with `childrenContextMenu`; hover row shows overflow trigger. */
export const SecondaryContextMenuRecent: Story = {
  name: "Secondary Context Menu Recent",
  render: () => (
    <SpecAccurateFrame
      expanded
      defaultExpandedChildrenItemId="recent"
      defaultSelectedItemId="home"
      onSecondaryContextMenu={(detail) => {
        // eslint-disable-next-line no-console
        console.log("secondary context menu", detail);
      }}
      items={[
        { id: "home", name: "Home", iconName: "home", routeRef: "/home" },
        {
          id: "recent",
          name: "Recent",
          iconName: "time-clock",
          routeRef: "/recent",
          childrenContextMenu: true,
          children: recentChatChildren,
        },
      ]}
      newChat={{ label: "New Chat", onAction: () => undefined }}
    />
  ),
};

/** Figma `50516:35461` — `Left Nav Button` overflow trigger states. */
export const SecondaryContextButtonStateMatrix: Story = {
  name: "Secondary Context Button States",
  render: () => (
    <div
      className={`${styles.root} ${styles.expanded} ${styles.programmeSynapse}`}
      style={{
        display: "flex",
        gap: 16,
        padding: 16,
        background: "var(--color-background-surface-1)",
        alignItems: "center",
        width: "auto",
        minWidth: 0,
        maxWidth: "none",
        height: "auto",
        border: "none",
      }}
    >
      {(
        [
          { label: "Default", className: styles.secondaryContextButtonForceVisible },
          { label: "Hover", className: `${styles.secondaryContextButtonForceVisible} ${styles.secondaryContextButtonStateHover}` },
          { label: "Press", className: `${styles.secondaryContextButtonForceVisible} ${styles.secondaryContextButtonStatePress}` },
          { label: "Disabled", className: `${styles.secondaryContextButtonForceVisible} ${styles.secondaryContextButtonStateDisabled}`, disabled: true },
          { label: "Focus", className: `${styles.secondaryContextButtonForceVisible} ${styles.secondaryContextButtonStateFocus}` },
        ] as const
      ).map((state) => (
        <div key={state.label} style={{ textAlign: "center" }}>
          <button
            type="button"
            className={`${styles.secondaryContextButton} ${state.className}`}
            disabled={"disabled" in state ? state.disabled : false}
            aria-label={`${state.label} overflow trigger`}
          >
            <Icon shapeName="overflow-menu-dots" style={{ width: 16, height: 16 }} />
          </button>
          <p style={{ margin: "8px 0 0", fontSize: 12 }}>{state.label}</p>
        </div>
      ))}
      <p style={{ margin: 0, fontSize: 12, opacity: 0.8 }}>
        Node `{SYNAPSE_LEFT_NAV_OVERFLOW_BUTTON_NODE_ID}`
      </p>
    </div>
  ),
};

/** Figma `50514:23038` — secondary default / hover / selected chrome (no left inset on secondary). */
export const SecondaryStateSnapshot: Story = {
  name: "Secondary State Snapshot",
  render: () => (
    <div
      style={{
        width: 250,
        padding: 8,
        background: "var(--color-background-surface-1)",
        boxSizing: "border-box",
      }}
    >
      <div className={`${styles.root} ${styles.expanded} ${styles.programmeSynapse}`}>
        <div className={styles.secondarySection}>
          <button type="button" className={`${styles.secondaryRow} ${styles.secondaryInteractive}`}>
            Recent chat item
          </button>
          <div
            className={`${styles.secondaryRowWrap} ${styles.secondaryRowWrapSnapshotHover}`}
          >
            <span className={styles.secondaryRowLabel}>Recent chat item (hover)</span>
            <button
              type="button"
              className={`${styles.secondaryContextButton} ${styles.secondaryContextButtonForceVisible}`}
              aria-label="More actions for Recent chat item"
            >
              <Icon shapeName="overflow-menu-dots" style={{ width: 16, height: 16 }} />
            </button>
          </div>
          <button
            type="button"
            className={`${styles.secondaryRow} ${styles.secondaryInteractive} ${styles.secondaryRowSelected}`}
          >
            Recent chat item (selected)
          </button>
        </div>
      </div>
      <p style={{ margin: "12px 0 0", fontSize: 12, opacity: 0.8 }}>
        Reference nodes: selected `{SYNAPSE_LEFT_NAV_SECONDARY_SELECTED_NODE_ID}`, hover{" "}
        `{SYNAPSE_LEFT_NAV_SECONDARY_HOVER_NODE_ID}`.
      </p>
    </div>
  ),
};

/** Fixed primary-row states for visual QA (`forceStates`) — parity with IDS `PrimaryStateSnapshotMatrix`. */
export const PrimaryStateSnapshotMatrix: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        padding: 16,
        background: "var(--color-background-surface-1)",
      }}
    >
      <SynapseLeftNav
        expanded
        forceStates
        items={[
          { id: "default", name: "Default", iconName: "home", state: "default" },
          { id: "hover", name: "Hover", iconName: "home", state: "hover" },
          { id: "press", name: "Press", iconName: "home", state: "press" },
          { id: "selected", name: "Selected", iconName: "home", state: "selected" },
          {
            id: "default-focus",
            name: "Default focus",
            iconName: "home",
            state: "default-focus",
          },
          {
            id: "selected-focus",
            name: "Selected focus",
            iconName: "home",
            state: "selected-focus",
          },
        ]}
      />
    </div>
  ),
};

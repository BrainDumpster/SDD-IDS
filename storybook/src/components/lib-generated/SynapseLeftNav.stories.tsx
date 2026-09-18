/**
 * Storybook: design-spec–generated Main Menu/Left from `lib/react/synapse/main-menu-left`
 * (IDS-fork reexport façade — React + CSS Modules).
 *
 * Anatomy:
 *   SynapseLeftNavRoot → PrimaryMenuLogo? → MainMenuList →
 *     MainMenuPrimaryItem (PrimaryIcon · PrimaryLabel · PrimaryChevron · SelectedInset · FocusRing)
 *     MainMenuSecondaryList? → MainMenuSecondaryItem[]
 *   ExpandCollapse
 *
 * Child components: none (slots internal; icons via SynapseIcon).
 * Theme: components/synapse-theme.css
 * Spec: components/synapse/left-nav/design-spec.md
 */
import React, { type ComponentProps, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/synapse-theme.css";
import {
  SYNAPSE_LEFT_NAV_DOCS_DESCRIPTION,
  SYNAPSE_LEFT_NAV_SOURCE_CODE,
} from "./synapse-left-nav.developer-usage";
import {
  SynapseLeftNav,
  type SynapseLeftNavNavigationTarget,
  type SynapseLeftNavPrimaryItem,
  type SynapseLeftNavSelectionDetail,
} from "@synapse/react/left-nav";

const DESIGN_SPEC_PATH = "components/synapse/left-nav/design-spec.md";

/** Sample nav from Figma MainMenu-Left-Main expanded (`11099:56218`). */
const specAccurateItems: SynapseLeftNavPrimaryItem[] = [
  { id: "dashboard", name: "Dashboard", iconName: "home", routeRef: "/dashboard" },
  {
    id: "infrastructure",
    name: "Infrastructure",
    iconName: "network-share",
    routeRef: "/infrastructure",
    childrenMenu: "collapsed",
    children: [
      { id: "secondary-a", name: "Secondary Item", routeRef: "/infrastructure/a" },
      { id: "secondary-b", name: "Secondary Item", routeRef: "/infrastructure/b" },
    ],
  },
  { id: "protection", name: "Protection", iconName: "shield-encrypt-alt", routeRef: "/protection" },
  { id: "recovery", name: "Recovery", iconName: "arrows-spin", routeRef: "/recovery" },
  { id: "alerts", name: "Alerts and Events", iconName: "alert-bell", routeRef: "/alerts" },
  { id: "reports", name: "Reports", iconName: "productivity-alt", routeRef: "/reports" },
  {
    id: "administration",
    name: "Administration",
    iconName: "user-settings",
    routeRef: "/administration",
  },
  { id: "jobs", name: "Jobs", iconName: "time-detail", routeRef: "/jobs" },
];

const onNavigate = (target: SynapseLeftNavNavigationTarget) => {
  console.log("onNavigate", target);
};

const onSelected = (detail: SynapseLeftNavSelectionDetail) => {
  console.log("onSelected", detail);
};

const specAccurateArgs: ComponentProps<typeof SynapseLeftNav> = {
  expanded: true,
  defaultSelectedItemId: "dashboard",
  items: specAccurateItems,
  onNavigate,
  onSelected,
};

const meta: Meta<typeof SynapseLeftNav> = {
  tags: ["autodocs"],
  title: "Components/Synapse/Left Nav",
  component: SynapseLeftNav,
  parameters: {
    layout: "fullscreen",
    docs: {
      canvas: { sourceState: "open" },
      description: {
        component: SYNAPSE_LEFT_NAV_DOCS_DESCRIPTION,
      },
      source: {
        type: "code",
        language: "tsx",
        code: SYNAPSE_LEFT_NAV_SOURCE_CODE,
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
        background: "var(--color-background-surface-primary)",
        minHeight: 0,
      }}
    >
      <div
        style={{
          width: 278,
          height: "100%",
          flexShrink: 0,
        }}
      >
        <SynapseLeftNav {...props} />
      </div>
      <div
        style={{
          flex: 1,
          minWidth: 0,
          padding: 24,
          color: "var(--color-text-gray-neutral-strong)",
          fontSize: 14,
        }}
      >
        <p style={{ margin: 0, opacity: 0.85 }}>
          Main content area — use the rail collapse control to verify **64px** icon-only mode.
        </p>
      </div>
    </div>
  );
}

/** Figma `11099:56218` — expanded rail; Dashboard selected; Infrastructure has children collapsed. */
export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  render: (args) => <SpecAccurateFrame {...args} />,
  args: specAccurateArgs,
};

/** Primary row with a long label that wraps to two lines and then truncates. */
export const LongPrimaryLabel: Story = {
  name: "Long Primary Label",
  render: (args) => <SpecAccurateFrame {...args} />,
  args: {
    ...specAccurateArgs,
    items: specAccurateItems.map((item) =>
      item.id === "alerts"
        ? {
            ...item,
            name: "Alerts and Events with an unusually long and descriptive label that should wrap to two lines and then truncate",
          }
        : item,
    ),
  },
};

/** Secondary rows with long labels under an expanded primary parent. */
export const LongSecondaryLabels: Story = {
  name: "Long Secondary Labels",
  render: (args) => <SpecAccurateFrame {...args} />,
  args: {
    ...specAccurateArgs,
    items: specAccurateItems.map((item) =>
      item.id === "infrastructure"
        ? {
            ...item,
            childrenMenu: "expanded" as const,
            children: (item.children ?? []).map((child, index) => ({
              ...child,
              name: `Very long secondary item label ${index + 1} that also wraps to two lines and may truncate if it is too long`,
            })),
          }
        : item,
    ),
  },
};

/** Collapsed icon-only rail (**64px**, Figma `11099:56206`). */
export const Collapsed: Story = {
  render: (args) => <SpecAccurateFrame {...args} />,
  args: { ...specAccurateArgs, expanded: false },
};

/** Controlled expand/collapse via `expanded` + `onExpandedChange`. */
export const ControlledExpanded: Story = {
  render: (args) => {
    const [expanded, setExpanded] = useState(true);
    return (
      <SpecAccurateFrame
        {...args}
        expanded={expanded}
        onExpandedChange={setExpanded}
      />
    );
  },
  args: specAccurateArgs,
};

/** Fixed primary-row states for visual QA (`forceStates`, Figma `11099:56244`). */
export const PrimaryStateSnapshotMatrix: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        padding: 16,
        height: "100vh",
        boxSizing: "border-box",
        background: "var(--color-background-surface-primary)",
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

/** Secondary-row states for visual QA (`forceStates`, Figma `12016:227537` / `12016:227542`). */
export const SecondaryStateSnapshotMatrix: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        padding: 16,
        height: "100vh",
        boxSizing: "border-box",
        background: "var(--color-background-surface-primary)",
      }}
    >
      <SynapseLeftNav
        expanded
        forceStates
        items={[
          {
            id: "infrastructure",
            name: "Infrastructure",
            iconName: "network-share",
            childrenMenu: "expanded",
            children: [
              { id: "sec-default", name: "Default", routeRef: "#" },
              { id: "sec-hover", name: "Hover", routeRef: "#" },
              { id: "sec-press", name: "Press", routeRef: "#" },
              { id: "sec-selected", name: "Selected", routeRef: "#" },
              { id: "sec-default-focus", name: "Default focus", routeRef: "#" },
              { id: "sec-selected-focus", name: "Selected focus", routeRef: "#" },
            ],
          },
        ]}
      />
    </div>
  ),
};

/** Parent with `children` expanded (`childrenMenu: "expanded"` under `forceStates`). */
export const SecondaryChildrenExpanded: Story = {
  render: (args) => <SpecAccurateFrame {...args} />,
  args: {
    ...specAccurateArgs,
    forceStates: true,
    defaultSelectedItemId: undefined,
    items: [
      {
        id: "infrastructure",
        name: "Infrastructure",
        iconName: "network-share",
        state: "selected",
        childrenMenu: "expanded",
        children: [
          { id: "secondary-a", name: "Secondary Item", routeRef: "/infrastructure/a" },
          { id: "secondary-b", name: "Secondary Item", routeRef: "/infrastructure/b" },
        ],
      },
      { id: "dashboard", name: "Dashboard", iconName: "home", state: "default" },
    ],
  },
};

/**
 * Storybook: design-spec–generated Main Menu/Left from `lib/react/ids/main-menu-left`
 * (React + CSS Modules, no @base-ui-components).
 *
 * Anatomy:
 *   MainMenuLeftRoot → PrimaryMenuLogo? → MainMenuList →
 *     MainMenuPrimaryItem (PrimaryIcon · PrimaryLabel · PrimaryChevron · SelectedInset · FocusRing)
 *     MainMenuSecondaryList? → MainMenuSecondaryItem[]
 *   ExpandCollapse
 *
 * Child components: none (slots internal; icons via IdsIcon).
 * Theme: components/ids-theme.css
 * Spec: components/ids/main-menu-left/design-spec.md
 */
import React, { type ComponentProps, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/ids-theme.css";
import {
  MAIN_MENU_LEFT_DOCS_DESCRIPTION,
  MAIN_MENU_LEFT_SOURCE_CODE,
} from "./ids-main-menu-left.developer-usage";
import {
  IdsMainMenuLeft,
  type MainMenuLeftNavigationTarget,
  type MainMenuLeftPrimaryItem,
  type MainMenuLeftSelectionDetail,
} from "@ids/react/main-menu-left";
import {
  MainMenuLeft as CompositionMainMenuLeft,
  MainMenuLeftChildren,
  MainMenuLeftGroup,
  MainMenuLeftItem,
  MainMenuLeftItemIcon,
} from "../MainMenuLeft";
import composeStyles from "../MainMenuLeft.module.css";

const DESIGN_SPEC_PATH = "components/ids/main-menu-left/design-spec.md";

/** Sample nav from Figma MainMenu-Left-Main expanded (`11099:56218`). */
const specAccurateItems: MainMenuLeftPrimaryItem[] = [
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

const onNavigate = (target: MainMenuLeftNavigationTarget) => {
  console.log("onNavigate", target);
};

const onSelected = (detail: MainMenuLeftSelectionDetail) => {
  console.log("onSelected", detail);
};

const specAccurateArgs: ComponentProps<typeof IdsMainMenuLeft> = {
  expanded: true,
  defaultSelectedItemId: "dashboard",
  items: specAccurateItems,
  onNavigate,
  onSelected,
};

const meta: Meta<typeof IdsMainMenuLeft> = {
  tags: ["autodocs"],
  title: "Components/IDS/Main Menu Left",
  component: IdsMainMenuLeft,
  parameters: {
    layout: "fullscreen",
    docs: {
      canvas: { sourceState: "open" },
      description: {
        component: MAIN_MENU_LEFT_DOCS_DESCRIPTION,
      },
      source: {
        type: "code",
        language: "tsx",
        code: MAIN_MENU_LEFT_SOURCE_CODE,
      },
    },
  },
  args: specAccurateArgs,
};

export default meta;
type Story = StoryObj<typeof IdsMainMenuLeft>;

function SpecAccurateFrame(props: ComponentProps<typeof IdsMainMenuLeft>) {
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
        <IdsMainMenuLeft {...props} />
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
      <IdsMainMenuLeft
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
      <CompositionMainMenuLeft expanded forceStates>
        <MainMenuLeftGroup groupId="secondary-focus-matrix" defaultExpanded={true}>
          <MainMenuLeftItem itemId="secondary-parent">
            <a href="#">
              <MainMenuLeftItemIcon shapeName="network-share" />
              <span className={composeStyles.primaryLabel}>Infrastructure</span>
            </a>
          </MainMenuLeftItem>
          <MainMenuLeftChildren>
            <MainMenuLeftItem itemId="sec-default" level="secondary" forceState="default">
              <a href="#">Default</a>
            </MainMenuLeftItem>
            <MainMenuLeftItem itemId="sec-hover" level="secondary" forceState="hover">
              <a href="#">Hover</a>
            </MainMenuLeftItem>
            <MainMenuLeftItem itemId="sec-press" level="secondary" forceState="press">
              <a href="#">Press</a>
            </MainMenuLeftItem>
            <MainMenuLeftItem itemId="sec-selected" level="secondary" forceState="selected">
              <a href="#">Selected</a>
            </MainMenuLeftItem>
            <MainMenuLeftItem itemId="sec-default-focus" level="secondary" forceState="default-focus">
              <a href="#">Default focus</a>
            </MainMenuLeftItem>
            <MainMenuLeftItem itemId="sec-selected-focus" level="secondary" forceState="selected-focus">
              <a href="#">Selected focus</a>
            </MainMenuLeftItem>
          </MainMenuLeftChildren>
        </MainMenuLeftGroup>
      </CompositionMainMenuLeft>
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

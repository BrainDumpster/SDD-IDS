import "../../../../components/synapse-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import React, { useState, type ComponentProps } from "react";
import {
  SynapseAppShell,
  SynapseAppShellHeaderActions,
  SynapseAppShellSpecAccurateAppLauncher,
  SynapseAppShellSpecAccurateChatBody,
  SynapseAppShellSpecAccurateHeaderActions,
  SynapseAppShellSpecAccuratePageHeaderActions,
  SynapseAppShellSpecAccurateTabBar,
  SynapseChatTrackerPanel,
  SynapseMastheadAvatar,
  type SynapseAppShellPage,
} from "../../../../storybook/src/components/SynapseAppShell";
import type { SynapseLeftNavPrimaryItem } from "../../../../storybook/src/components/SynapseLeftNav";

const DESIGN_SPEC_PATH = "components/synapse/app-shell/design-spec.md";
const FIGMA_DEFAULT_NODE = "48463:143536";

/** Figma `47807:8153` — same tree as Left Nav Spec Accurate Design. */
const specAccurateMenuItems: SynapseLeftNavPrimaryItem[] = [
  { id: "home", name: "Home", iconName: "home", routeRef: "/home" },
  {
    id: "recommendations",
    name: "Recommendations",
    iconName: "light-bulb",
    routeRef: "/recommendations",
  },
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

function buildSpecPages(): SynapseAppShellPage[] {
  return [
    {
      id: "home",
      title: "Page Title",
      menuItemId: "home",
      content: <SynapseAppShellSpecAccurateChatBody />,
    },
    ...specAccurateMenuItems.slice(1).map((item) => ({
      id: item.id ?? item.name ?? "page",
      title: item.name ?? "Page Title",
      menuItemId: item.id,
      content: (
        <div style={{ padding: "var(--padding-padding-16) var(--padding-padding-24)" }}>
          <p style={{ margin: 0, color: "var(--color-text-neutral)" }}>
            Body content for <strong>{item.name}</strong> — swap with product views.
          </p>
        </div>
      ),
    })),
  ];
}

const specAccurateArgs: ComponentProps<typeof SynapseAppShell> = {
  pages: buildSpecPages(),
  defaultPageId: "home",
  menuItems: specAccurateMenuItems,
  defaultMenuExpanded: true,
  newChat: { label: "New Chat", onAction: () => undefined },
  mastheadProductName: "Synapse",
  headerActions: <SynapseAppShellSpecAccurateHeaderActions />,
  appLauncherSlot: <SynapseAppShellSpecAccurateAppLauncher />,
  avatarSlot: <SynapseMastheadAvatar initials="YK" />,
  showTabBar: true,
  tabBarSlot: <SynapseAppShellSpecAccurateTabBar />,
  pageHeaderActionsSlot: <SynapseAppShellSpecAccuratePageHeaderActions />,
  showChatTracker: true,
  chatTrackerSlot: <SynapseChatTrackerPanel />,
  showFooter: false,
  showPageDescription: false,
};

const meta: Meta<typeof SynapseAppShell> = {
  title: "Spec Generated/Synapse/App Shell",
  component: SynapseAppShell,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: [
          `Spec-driven Synapse Page Layout (App Shell). Source: \`${DESIGN_SPEC_PATH}\`.`,
          `Primary story aligns to Figma **Options=Default** (\`${FIGMA_DEFAULT_NODE}\`): Masthead + Left Nav (250px) + Nav Tabs + page header actions + chat body + Chat Tracker rail.`,
          "Compose masthead utilities via `headerActions` + `<SynapseAppShellHeaderActions>` — same IDS composition contract.",
          "Theme: `components/synapse-theme.css`.",
        ].join(" "),
      },
    },
  },
  args: specAccurateArgs,
};

export default meta;
type Story = StoryObj<typeof SynapseAppShell>;

/** Canonical reference: Default Page Layout (`48463:143536`). */
export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  render: (args) => <SynapseAppShell {...args} />,
  args: specAccurateArgs,
};

export const CollapsedMenu: Story = {
  name: "Collapsed Menu",
  render: (args) => <SynapseAppShell {...args} />,
  args: { ...specAccurateArgs, defaultMenuExpanded: false },
};

export const WithoutChatTracker: Story = {
  name: "Without Chat Tracker",
  render: (args) => <SynapseAppShell {...args} />,
  args: { ...specAccurateArgs, showChatTracker: false },
};

export const WithoutTabBar: Story = {
  name: "Without Tab Bar",
  render: (args) => <SynapseAppShell {...args} />,
  args: { ...specAccurateArgs, showTabBar: false },
};

export const NavigationDemo: Story = {
  render: (args) => {
    const [lastNav, setLastNav] = useState("—");
    const [lastPage, setLastPage] = useState("home");
    return (
      <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
        <SynapseAppShell
          {...args}
          onNavigate={(target) => setLastNav(`${target.name} (${target.itemId})`)}
          onPageChange={(pageId) => setLastPage(pageId)}
        />
        <div
          style={{
            position: "fixed",
            bottom: 16,
            right: 16,
            zIndex: 10,
            padding: "8px 12px",
            fontSize: 12,
            background: "var(--color-background-component)",
            border: "1px solid var(--color-border-accessible)",
            borderRadius: 4,
            pointerEvents: "none",
          }}
        >
          Active page: {lastPage} · Last navigate: {lastNav}
        </div>
      </div>
    );
  },
  args: specAccurateArgs,
};

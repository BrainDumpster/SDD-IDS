import "../../../../components/ids-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import React, { useState, type ComponentProps } from "react";
import {
  AppShell,
  AppShellHeaderActions,
  AppShellPagePanel,
  AppShellSpecAccurateAppLauncher,
  AppShellSpecAccurateHeaderActions,
  IdsMastheadActionButtonContainer,
  IdsMastheadActionIconButton,
  IdsMastheadAvatar,
  type AppShellPage,
} from "../../../../storybook/src/components/AppShell";
import { Icon } from "../../../../storybook/src/components/Icon";
import type { MainMenuLeftPrimaryItem } from "../../../../storybook/src/components/MainMenuLeft";
import { AppLauncher } from "../../../../storybook/src/components/AppLauncher";
import {
  APP_SHELL_DEVELOPER_USAGE_SOURCE,
  DeveloperUsageAppShellHeaderActions,
  DeveloperUsageStatusHint,
  MyDashboard,
  developerUsageAppLauncherProducts,
} from "../../../../storybook/src/components/MastheadDeveloperUsageDemo";

const DESIGN_SPEC_PATH = "components/ids/app-shell/design-spec.md";
const README_PATH = "components/ids/app-shell/README.md";

const icon16 = { width: 16, height: 16 } as const;

const DEVELOPER_USAGE_SOURCE = APP_SHELL_DEVELOPER_USAGE_SOURCE;

const COMPOSED_HEADER_ACTIONS_SOURCE = `import {
  AppShell,
  AppShellHeaderActions,
  IdsMastheadActionButtonContainer,
  IdsMastheadActionIconButton,
} from "storybook/src/components/AppShell";
import { Icon } from "storybook/src/components/Icon";

// Angular analogue: <ids-app-shell-header-actions> with projected children
<AppShell
  headerActions={
    <AppShellHeaderActions>
      <search-input />
    <IdsMastheadActionIconButton
      aria-label="What's New, 5 new"
      badgeCount={5}
      badgeType="critical"
      icon={<Icon shapeName="alert-bell-16" style={{ width: 18, height: 18 }} />}
      onClick={() => setWhatsNewOpen(true)}
    />
      <MySettingsDropdown open={settingsOpen} onOpenChange={setSettingsOpen} />
    </AppShellHeaderActions>
  }
  appLauncherSlot={<AppLauncher triggerVariant="masthead" products={products} />}
  avatarSlot={<IdsMastheadAvatar initials="DT" onClick={openUserMenu} />}
  {...shellProps}
/>`;

const PAGE_DESCRIPTION =
  "This subtitle is meant for instructional text that outlines the purpose of this page. It's advisable to include such text unless the page is a dashboard or self-explanatory.";

const specAccurateMenuItems: MainMenuLeftPrimaryItem[] = [
  { id: "dashboard", name: "Dashboard", iconName: "home", routeRef: "/dashboard" },
  {
    id: "infrastructure",
    name: "Infrastructure",
    iconName: "network-share",
    routeRef: "/infrastructure",
    childrenMenu: "collapsed",
    children: [
      { id: "infra-a", name: "Clusters", routeRef: "/infrastructure/clusters" },
      { id: "infra-b", name: "Storage", routeRef: "/infrastructure/storage" },
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

function buildSpecPages(): AppShellPage[] {
  return specAccurateMenuItems.map((item) => ({
    id: item.id ?? item.name ?? "page",
    title: item.name ?? "Page Title",
    description: PAGE_DESCRIPTION,
    content: (
      <AppShellPagePanel title={`${item.name} content`}>
        <p style={{ margin: 0 }}>
          Body content for <strong>{item.name}</strong> — swap this slot with product views.
        </p>
      </AppShellPagePanel>
    ),
  }));
}

const specAccurateArgs: ComponentProps<typeof AppShell> = {
  pages: buildSpecPages(),
  defaultPageId: "dashboard",
  menuItems: specAccurateMenuItems,
  defaultMenuExpanded: true,
  mastheadProductName: "Product Name",
  mastheadProductIconSlug: "shield-cloud",
  headerActions: <AppShellSpecAccurateHeaderActions />,
  appLauncherSlot: <AppShellSpecAccurateAppLauncher />,
  avatarSlot: <IdsMastheadAvatar initials="DT" />,
  footer: {
    hostname: "short_name_first_domain_name",
    swid: "ELMCR00222GBPB",
    currentDateTime: "Tue, 2023-04-23 12:30 AM",
    timeZoneLabel: "Eastern Time (US & Canada)",
    showHostname: true,
    showCurrentDateAndTime: true,
    showTimeZone: true,
  },
};

const meta: Meta<typeof AppShell> = {
  title: "Spec Generated/IDS/App Shell",
  component: AppShell,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: [
          `Spec-driven IDS application shell. Source: \`${DESIGN_SPEC_PATH}\`. Guide: \`${README_PATH}\`.`,
          "Compose masthead actions via `headerActions` + `<AppShellHeaderActions>` — wire `onClick` on each child (no icon config array).",
          "See **Developer usage** and **Composed header actions** for code panels.",
        ].join(" "),
      },
    },
  },
  args: specAccurateArgs,
};

export default meta;
type Story = StoryObj<typeof AppShell>;

export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  render: (args) => <AppShell {...args} />,
  args: specAccurateArgs,
};

const codePanelStyle: React.CSSProperties = {
  margin: 0,
  padding: "12px 16px",
  fontSize: 12,
  lineHeight: 1.5,
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
  background: "var(--color-background-component)",
  color: "var(--color-text-neutral-strong)",
  borderBottom: "1px solid var(--color-border-accessible)",
  overflow: "auto",
  maxHeight: "38vh",
  whiteSpace: "pre",
};

export const DeveloperUsage: Story = {
  name: "Developer usage",
  render: () => {
    const [whatsNewOpen, setWhatsNewOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [lastClick, setLastClick] = useState("—");

    const developerMenuItems = specAccurateMenuItems.slice(0, 3);
    const developerPages: AppShellPage[] = [
      {
        id: "dashboard",
        title: "Dashboard",
        description: "Overview of system health and recent activity.",
        content: <MyDashboard />,
      },
      ...buildSpecPages().slice(1, 3),
    ];

    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100vh", minHeight: 0 }}>
        <pre style={codePanelStyle} aria-label="AppShell integration source">
          {DEVELOPER_USAGE_SOURCE}
        </pre>
        <div style={{ flex: 1, minHeight: 0, position: "relative" }}>
          <AppShell
            pages={developerPages}
            menuItems={developerMenuItems}
            defaultPageId="dashboard"
            defaultMenuExpanded
            mastheadProductName="Product Name"
            mastheadProductIconSlug="shield-cloud"
            headerActions={
              <DeveloperUsageAppShellHeaderActions
                settingsOpen={settingsOpen}
                onWhatsNewClick={() => {
                  setWhatsNewOpen(true);
                  setLastClick("whats-new");
                }}
                onSettingsClick={() => {
                  setSettingsOpen((open) => !open);
                  setLastClick("settings-toggle");
                }}
              />
            }
            appLauncherSlot={
              <AppLauncher
                triggerVariant="masthead"
                sideOffset={0}
                products={[...developerUsageAppLauncherProducts]}
              />
            }
            avatarSlot={
              <IdsMastheadAvatar
                initials="DT"
                onClick={() => setLastClick("avatar")}
              />
            }
            footer={specAccurateArgs.footer}
          />
          <DeveloperUsageStatusHint
            lastClick={lastClick}
            whatsNewOpen={whatsNewOpen}
            settingsOpen={settingsOpen}
            style={{ position: "absolute", top: 8, right: 16, zIndex: 10 }}
          />
        </div>
      </div>
    );
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story:
          "Compose `headerActions` with `<AppShellHeaderActions>`; each button/control owns its `onClick`. Optional `appLauncherSlot` and `avatarSlot`.",
      },
      source: { code: DEVELOPER_USAGE_SOURCE, language: "tsx" },
    },
  },
};

/** Flexible composition — search stub + icon buttons + dropdown-style control. */
export const ComposedHeaderActions: Story = {
  name: "Composed header actions",
  render: () => {
    const [whatsNewOpen, setWhatsNewOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [lastClick, setLastClick] = useState("—");

    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100vh", minHeight: 0 }}>
        <pre style={codePanelStyle} aria-label="Composed header actions source">
          {COMPOSED_HEADER_ACTIONS_SOURCE}
        </pre>
        <div style={{ flex: 1, minHeight: 0, position: "relative" }}>
          <AppShell
            pages={buildSpecPages().slice(0, 3)}
            menuItems={specAccurateMenuItems.slice(0, 3)}
            defaultPageId="dashboard"
            mastheadProductName="Product Name"
            headerActions={
              <AppShellHeaderActions>
                <input
                  type="search"
                  placeholder="Search..."
                  aria-label="Search"
                  style={{
                    height: 32,
                    marginRight: 8,
                    padding: "0 8px",
                    border: "1px solid var(--color-border-accessible)",
                    borderRadius: 4,
                    fontSize: 14,
                  }}
                />
                <IdsMastheadActionButtonContainer>
                  <IdsMastheadActionIconButton
                    aria-label="What's New, 5 new"
                    badgeCount={5}
                    badgeType="critical"
                    icon={<Icon shapeName="alert-bell-16" style={icon16} />}
                    onClick={() => {
                      setWhatsNewOpen(true);
                      setLastClick("whats-new");
                    }}
                  />
                  <IdsMastheadActionIconButton
                    aria-label="Settings"
                    aria-expanded={settingsOpen}
                    icon={<Icon shapeName="setting-gear-16" style={icon16} />}
                    onClick={() => {
                      setSettingsOpen((open) => !open);
                      setLastClick("settings-toggle");
                    }}
                  />
                </IdsMastheadActionButtonContainer>
                {settingsOpen ? (
                  <div
                    role="menu"
                    style={{
                      position: "absolute",
                      top: 48,
                      right: 120,
                      zIndex: 20,
                      background: "var(--color-background-component)",
                      border: "1px solid var(--color-border-accessible)",
                      borderRadius: 4,
                      padding: 8,
                      fontSize: 14,
                    }}
                  >
                    <button
                      type="button"
                      style={{ display: "block", width: "100%", textAlign: "left", padding: 6 }}
                      onClick={() => setLastClick("launch-getting-started")}
                    >
                      Launch Getting Started
                    </button>
                  </div>
                ) : null}
              </AppShellHeaderActions>
            }
            appLauncherSlot={<AppShellSpecAccurateAppLauncher />}
            avatarSlot={
              <IdsMastheadAvatar
                initials="DT"
                onClick={() => setLastClick("avatar")}
              />
            }
            footer={specAccurateArgs.footer}
          />
          <div
            style={{
              position: "absolute",
              top: 8,
              right: 16,
              zIndex: 10,
              padding: "6px 10px",
              fontSize: 12,
              background: "var(--color-background-component)",
              border: "1px solid var(--color-border-accessible)",
              borderRadius: 4,
              pointerEvents: "none",
            }}
          >
            Last click: {lastClick}
            {whatsNewOpen ? " · What's New open" : ""}
            {settingsOpen ? " · Settings menu open" : ""}
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story:
          "Mirrors a product `HeaderActions` child: mix search, icon buttons, and dropdown panels. Clicks are wired on each composed control — AppShell does not dispatch a central action handler.",
      },
      source: { code: COMPOSED_HEADER_ACTIONS_SOURCE, language: "tsx" },
    },
  },
};

export const CollapsedMenu1366: Story = {
  name: "Collapsed Menu (1366)",
  render: (args) => <AppShell {...args} />,
  args: { ...specAccurateArgs, defaultMenuExpanded: false },
};

export const Breakpoint1024: Story = {
  name: "Breakpoint 1024",
  render: (args) => <AppShell {...args} />,
  args: { ...specAccurateArgs, defaultMenuExpanded: false },
};

export const NavigationDemo: Story = {
  render: (args) => {
    const [lastNav, setLastNav] = useState("—");
    const [lastPage, setLastPage] = useState("dashboard");
    return (
      <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
        <AppShell
          {...args}
          onNavigate={(target) => setLastNav(`${target.name} (${target.itemId})`)}
          onPageChange={(pageId) => setLastPage(pageId)}
        />
        <div
          style={{
            position: "fixed",
            bottom: 40,
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

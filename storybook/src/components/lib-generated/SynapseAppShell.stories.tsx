/**
 * Storybook: design-spec–generated App Shell from `lib/react/synapse/app-shell`
 * (IDS-fork reexport façade — React + CSS Modules).
 *
 * Anatomy (deterministic child order — root is SynapseAppShell, not AppShellRoot):
 *   SynapseAppShell
 *     SynapseAppShellMastheadSlot → SynapseMasthead (composed)
 *     SynapseAppShellBodyRow
 *       SynapseAppShellMainMenuSlot → SynapseLeftNav (composed)
 *       SynapseAppShellMainColumn (`main#main-content`)
 *         SynapseAppShellPageHeader
 *           SynapseAppShellPageTitle
 *           SynapseAppShellPageDescription?
 *         SynapseAppShellBodyViewport
 *           SynapseAppShellBodyContentSlot
 *         SynapseAppShellFooterSlot → SynapseFooter (composed)
 *
 * Theme: components/synapse-theme.css
 * Spec: components/synapse/app-shell/design-spec.md
 */
import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/synapse-theme.css";
import {
  SYNAPSE_APP_SHELL_DOCS_DESCRIPTION,
  SYNAPSE_APP_SHELL_SOURCE_CODE,
} from "./synapse-app-shell.developer-usage";
import { SynapseAppLauncher } from "@synapse/react/app-launcher";
import { SynapseFooter } from "@synapse/react/footer";
import { SynapseIcon } from "@synapse/react/icon";
import {
  SynapseLeftNav,
  type SynapseLeftNavPrimaryItem,
} from "@synapse/react/left-nav";
import {
  SynapseMasthead,
  SynapseMastheadActionButtonContainer,
  SynapseMastheadActionIconButton,
  SynapseMastheadActionsRow,
  SynapseMastheadAppLauncherSlot,
  SynapseMastheadAvatar,
  SynapseMastheadAvatarSlot,
  SynapseMastheadBrandSlot,
  SynapseMastheadIconsSlot,
  SynapseMastheadLogo,
  SynapseMastheadProductName,
} from "@synapse/react/masthead";
import {
  SynapseAppShellSpecAccurateAppLauncher,
  SynapseAppShellSpecAccurateHeaderActions,
  SynapseAppShell,
  SynapseAppShellBodyContentSlot,
  SynapseAppShellBodyRow,
  SynapseAppShellBodyViewport,
  SynapseAppShellFooterSlot,
  SynapseAppShellHeaderActions,
  SynapseAppShellMainColumn,
  SynapseAppShellMainMenuSlot,
  SynapseAppShellMastheadSlot,
  SynapseAppShellPageDescription,
  SynapseAppShellPageHeader,
  SynapseAppShellPagePanel,
  SynapseAppShellPageTitle,
  type SynapseAppShellPage,
  type SynapseAppShellProps,
} from "@synapse/react/app-shell";

const DESIGN_SPEC_PATH = "components/synapse/app-shell/design-spec.md";

const PAGE_DESCRIPTION =
  "This subtitle is meant for instructional text that outlines the purpose of this page. It's advisable to include such text unless the page is a dashboard or self-explanatory.";

const specAccurateMenuItems: SynapseLeftNavPrimaryItem[] = [
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

const productLogo = (
  <SynapseIcon shape="shield-cloud" variant="img" size={32} title="Product logo" />
);

function buildSpecPages(): SynapseAppShellPage[] {
  return specAccurateMenuItems.map((item) => ({
    id: item.id ?? item.name ?? "page",
    title: item.name ?? "Page Title",
    description: PAGE_DESCRIPTION,
    content: (
      <SynapseAppShellPagePanel title={`${item.name} content`}>
        <p style={{ margin: 0 }}>
          Body content for <strong>{item.name}</strong> — swap this slot with product views.
        </p>
      </SynapseAppShellPagePanel>
    ),
  }));
}

const specFooter = {
  hostname: "short_name_first_domain_name",
  swid: "ELMCR00222GBPB",
  currentDateTime: "Tue, 2023-04-23 12:30 AM",
  timeZoneLabel: "Eastern Time (US & Canada)",
};

const specAccurateProps: SynapseAppShellProps = {
  pages: buildSpecPages(),
  defaultPageId: "dashboard",
  menuItems: specAccurateMenuItems,
  defaultMenuSelectedItemId: "dashboard",
  defaultMenuExpanded: true,
  persistMenuExpanded: false,
  breakpointPreset: "1920",
  mastheadProductName: "Product Name",
  mastheadProductIconSlug: "shield-cloud",
  headerActions: <SynapseAppShellSpecAccurateHeaderActions />,
  appLauncherSlot: <SynapseAppShellSpecAccurateAppLauncher />,
  avatarSlot: <SynapseMastheadAvatar initials="DT" aria-label="User settings" />,
  footer: specFooter,
};

function NestedAppShell(props: SynapseAppShellProps) {
  return (
    <SynapseAppShell {...props}>
      <SynapseAppShellMastheadSlot>
        <SynapseMasthead>
          <SynapseMastheadBrandSlot>
            <SynapseMastheadLogo>{productLogo}</SynapseMastheadLogo>
            <SynapseMastheadProductName>
              {props.mastheadProductName ?? "Product Name"}
            </SynapseMastheadProductName>
          </SynapseMastheadBrandSlot>
          <SynapseMastheadActionsRow>
            <SynapseMastheadIconsSlot>
              {props.headerActions ?? <SynapseAppShellSpecAccurateHeaderActions />}
            </SynapseMastheadIconsSlot>
            <SynapseMastheadAppLauncherSlot>
              {props.appLauncherSlot ?? <SynapseAppShellSpecAccurateAppLauncher />}
            </SynapseMastheadAppLauncherSlot>
            <SynapseMastheadAvatarSlot>
              {props.avatarSlot ?? (
                <SynapseMastheadAvatar initials="DT" aria-label="User settings" />
              )}
            </SynapseMastheadAvatarSlot>
          </SynapseMastheadActionsRow>
        </SynapseMasthead>
      </SynapseAppShellMastheadSlot>
      <SynapseAppShellBodyRow>
        <SynapseAppShellMainMenuSlot>
          <SynapseLeftNav items={props.menuItems ?? specAccurateMenuItems} />
        </SynapseAppShellMainMenuSlot>
        <SynapseAppShellMainColumn>
          <SynapseAppShellPageHeader>
            <SynapseAppShellPageTitle />
            <SynapseAppShellPageDescription />
          </SynapseAppShellPageHeader>
          <SynapseAppShellBodyViewport>
            <SynapseAppShellBodyContentSlot />
          </SynapseAppShellBodyViewport>
          <SynapseAppShellFooterSlot>
            <SynapseFooter />
          </SynapseAppShellFooterSlot>
        </SynapseAppShellMainColumn>
      </SynapseAppShellBodyRow>
    </SynapseAppShell>
  );
}

const meta: Meta<SynapseAppShellProps> = {
  tags: ["autodocs"],
  title: "Components/Synapse/App Shell",
  component: SynapseAppShell,
  parameters: {
    layout: "fullscreen",
    docs: {
      canvas: { sourceState: "open" },
      description: {
        component: SYNAPSE_APP_SHELL_DOCS_DESCRIPTION,
      },
      source: {
        type: "code",
        language: "tsx",
        code: SYNAPSE_APP_SHELL_SOURCE_CODE,
      },
    },
  },
};

export default meta;
type Story = StoryObj<SynapseAppShellProps>;

/** Figma `Screen size=1920` — `43478:46307` — nested anatomy, every slot present. */
export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  render: function SpecAccurateDesignRender() {
    return <NestedAppShell {...specAccurateProps} />;
  },
};

export const NestedHierarchy: Story = {
  name: "Nested Hierarchy",
  render: function NestedHierarchyRender() {
    return <NestedAppShell {...specAccurateProps} breakpointPreset="fluid" />;
  },
};

export const ConvenienceProps: Story = {
  name: "Convenience props",
  render: () => <SynapseAppShell {...specAccurateProps} breakpointPreset="fluid" />,
};

export const CollapsedMenu1366: Story = {
  name: "Collapsed Menu (1366)",
  render: () => (
    <SynapseAppShell
      {...specAccurateProps}
      breakpointPreset="1366"
      defaultMenuExpanded={false}
    />
  ),
};

export const Breakpoint1024: Story = {
  name: "Breakpoint 1024",
  render: () => (
    <SynapseAppShell
      {...specAccurateProps}
      breakpointPreset="1024"
      defaultMenuExpanded={false}
    />
  ),
};

export const ComposedHeaderActions: Story = {
  name: "Composed header actions",
  render: function ComposedHeaderActionsRender() {
    const [lastClick, setLastClick] = useState("—");
    return (
      <div style={{ height: "100vh", position: "relative" }}>
        <SynapseAppShell
          {...specAccurateProps}
          breakpointPreset="fluid"
          headerActions={
            <SynapseAppShellHeaderActions>
              <SynapseMastheadActionButtonContainer>
                <SynapseMastheadActionIconButton
                  aria-label="What's New, 5 new"
                  badgeCount={5}
                  badgeType="critical"
                  icon={<SynapseIcon shape="alert-bell-16" size={16} />}
                  onClick={() => setLastClick("whats-new")}
                />
                <SynapseMastheadActionIconButton
                  aria-label="Settings"
                  icon={<SynapseIcon shape="setting-gear-16" size={16} />}
                  onClick={() => setLastClick("settings")}
                />
              </SynapseMastheadActionButtonContainer>
            </SynapseAppShellHeaderActions>
          }
          appLauncherSlot={
            <SynapseAppLauncher
              triggerVariant="masthead"
              sideOffset={0}
              products={[
                { id: "p1", name: "Product Name 1" },
                { id: "p2", name: "Product Name 2" },
              ]}
            />
          }
          avatarSlot={
            <SynapseMastheadAvatar
              initials="DT"
              aria-label="User settings"
              onClick={() => setLastClick("avatar")}
            />
          }
        />
        <div
          style={{
            position: "absolute",
            top: 8,
            right: 16,
            zIndex: 10,
            padding: "6px 10px",
            fontSize: 12,
            background: "var(--color-background-surface-component)",
            border: "1px solid var(--color-border-gray-neutral-base)",
            borderRadius: 4,
            pointerEvents: "none",
          }}
        >
          Last click: {lastClick}
        </div>
      </div>
    );
  },
};

export const NavigationDemo: Story = {
  render: function NavigationDemoRender() {
    const [lastNav, setLastNav] = useState("—");
    const [lastPage, setLastPage] = useState("dashboard");
    return (
      <div style={{ height: "100vh", position: "relative" }}>
        <SynapseAppShell
          {...specAccurateProps}
          breakpointPreset="fluid"
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
            background: "var(--color-background-surface-component)",
            border: "1px solid var(--color-border-gray-neutral-base)",
            borderRadius: 4,
            pointerEvents: "none",
          }}
        >
          Active page: {lastPage} · Last navigate: {lastNav}
        </div>
      </div>
    );
  },
};

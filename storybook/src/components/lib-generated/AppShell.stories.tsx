/**
 * Storybook: design-spec–generated App Shell from `lib/react/ids/app-shell`
 * (React + CSS Modules, no @base-ui-components).
 *
 * Anatomy (deterministic child order — root is IdsAppShell, not AppShellRoot):
 *   IdsAppShell
 *     IdsAppShellMastheadSlot → IdsMasthead (composed)
 *     IdsAppShellBodyRow
 *       IdsAppShellMainMenuSlot → IdsMainMenuLeft (composed)
 *       IdsAppShellMainColumn (`main#main-content`)
 *         IdsAppShellPageHeader
 *           IdsAppShellPageTitle
 *           IdsAppShellPageDescription?
 *         IdsAppShellBodyViewport
 *           IdsAppShellBodyContentSlot
 *         IdsAppShellFooterSlot → IdsFooter (composed)
 *
 * Theme: components/ids-theme.css
 * Spec: components/ids/app-shell/design-spec.md
 */
import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/ids-theme.css";
import { AppLauncher } from "../../../../lib/react/ids/app-launcher";
import { IdsFooter } from "../../../../lib/react/ids/footer";
import { IdsIcon } from "../../../../lib/react/ids/icon";
import {
  IdsMainMenuLeft,
  type MainMenuLeftPrimaryItem,
} from "../../../../lib/react/ids/main-menu-left";
import {
  IdsMasthead,
  IdsMastheadActionButtonContainer,
  IdsMastheadActionIconButton,
  IdsMastheadActionsRow,
  IdsMastheadAppLauncherSlot,
  IdsMastheadAvatar,
  IdsMastheadAvatarSlot,
  IdsMastheadBrandSlot,
  IdsMastheadIconsSlot,
  IdsMastheadLogo,
  IdsMastheadProductName,
} from "../../../../lib/react/ids/masthead";
import {
  AppShellSpecAccurateAppLauncher,
  AppShellSpecAccurateHeaderActions,
  IdsAppShell,
  IdsAppShellBodyContentSlot,
  IdsAppShellBodyRow,
  IdsAppShellBodyViewport,
  IdsAppShellFooterSlot,
  IdsAppShellHeaderActions,
  IdsAppShellMainColumn,
  IdsAppShellMainMenuSlot,
  IdsAppShellMastheadSlot,
  IdsAppShellPageDescription,
  IdsAppShellPageHeader,
  IdsAppShellPagePanel,
  IdsAppShellPageTitle,
  type AppShellPage,
  type IdsAppShellProps,
} from "../../../../lib/react/ids/app-shell";

const DESIGN_SPEC_PATH = "components/ids/app-shell/design-spec.md";

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

const productLogo = (
  <IdsIcon shape="shield-cloud" variant="img" size={32} title="Product logo" />
);

function buildSpecPages(): AppShellPage[] {
  return specAccurateMenuItems.map((item) => ({
    id: item.id ?? item.name ?? "page",
    title: item.name ?? "Page Title",
    description: PAGE_DESCRIPTION,
    content: (
      <IdsAppShellPagePanel title={`${item.name} content`}>
        <p style={{ margin: 0 }}>
          Body content for <strong>{item.name}</strong> — swap this slot with product views.
        </p>
      </IdsAppShellPagePanel>
    ),
  }));
}

const specFooter = {
  hostname: "short_name_first_domain_name",
  swid: "ELMCR00222GBPB",
  currentDateTime: "Tue, 2023-04-23 12:30 AM",
  timeZoneLabel: "Eastern Time (US & Canada)",
};

const specAccurateProps: IdsAppShellProps = {
  pages: buildSpecPages(),
  defaultPageId: "dashboard",
  menuItems: specAccurateMenuItems,
  defaultMenuSelectedItemId: "dashboard",
  defaultMenuExpanded: true,
  persistMenuExpanded: false,
  breakpointPreset: "1920",
  mastheadProductName: "Product Name",
  mastheadProductIconSlug: "shield-cloud",
  headerActions: <AppShellSpecAccurateHeaderActions />,
  appLauncherSlot: <AppShellSpecAccurateAppLauncher />,
  avatarSlot: <IdsMastheadAvatar initials="DT" aria-label="User settings" />,
  footer: specFooter,
};

function NestedAppShell(props: IdsAppShellProps) {
  return (
    <IdsAppShell {...props}>
      <IdsAppShellMastheadSlot>
        <IdsMasthead>
          <IdsMastheadBrandSlot>
            <IdsMastheadLogo>{productLogo}</IdsMastheadLogo>
            <IdsMastheadProductName>
              {props.mastheadProductName ?? "Product Name"}
            </IdsMastheadProductName>
          </IdsMastheadBrandSlot>
          <IdsMastheadActionsRow>
            <IdsMastheadIconsSlot>
              {props.headerActions ?? <AppShellSpecAccurateHeaderActions />}
            </IdsMastheadIconsSlot>
            <IdsMastheadAppLauncherSlot>
              {props.appLauncherSlot ?? <AppShellSpecAccurateAppLauncher />}
            </IdsMastheadAppLauncherSlot>
            <IdsMastheadAvatarSlot>
              {props.avatarSlot ?? (
                <IdsMastheadAvatar initials="DT" aria-label="User settings" />
              )}
            </IdsMastheadAvatarSlot>
          </IdsMastheadActionsRow>
        </IdsMasthead>
      </IdsAppShellMastheadSlot>
      <IdsAppShellBodyRow>
        <IdsAppShellMainMenuSlot>
          <IdsMainMenuLeft items={props.menuItems ?? specAccurateMenuItems} />
        </IdsAppShellMainMenuSlot>
        <IdsAppShellMainColumn>
          <IdsAppShellPageHeader>
            <IdsAppShellPageTitle />
            <IdsAppShellPageDescription />
          </IdsAppShellPageHeader>
          <IdsAppShellBodyViewport>
            <IdsAppShellBodyContentSlot />
          </IdsAppShellBodyViewport>
          <IdsAppShellFooterSlot>
            <IdsFooter />
          </IdsAppShellFooterSlot>
        </IdsAppShellMainColumn>
      </IdsAppShellBodyRow>
    </IdsAppShell>
  );
}

const meta: Meta<IdsAppShellProps> = {
  title: "Components/IDS/App Shell",
  component: IdsAppShell,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          `React IDS App Shell from \`${DESIGN_SPEC_PATH}\`. ` +
          "Root is `IdsAppShell` — not `AppShellRoot`. " +
          "Public names are `Ids` camelCase (`IdsAppShellMastheadSlot`), not dotted compounds (`AppShell.MastheadSlot`). " +
          "Deterministic anatomy: IdsAppShellMastheadSlot → IdsAppShellBodyRow → " +
          "IdsAppShellMainMenuSlot + IdsAppShellMainColumn " +
          "(IdsAppShellPageHeader → IdsAppShellPageTitle + IdsAppShellPageDescription?, " +
          "IdsAppShellBodyViewport → IdsAppShellBodyContentSlot, IdsAppShellFooterSlot). " +
          "Selectors: `data-ids=\"IdsAppShell\"`. " +
          "Composes IdsMasthead, IdsMainMenuLeft, and IdsFooter — does not re-implement child chrome. " +
          "Theme: `components/ids-theme.css`. No `@base-ui-components`.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<IdsAppShellProps>;

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
  render: () => <IdsAppShell {...specAccurateProps} breakpointPreset="fluid" />,
};

export const CollapsedMenu1366: Story = {
  name: "Collapsed Menu (1366)",
  render: () => (
    <IdsAppShell
      {...specAccurateProps}
      breakpointPreset="1366"
      defaultMenuExpanded={false}
    />
  ),
};

export const Breakpoint1024: Story = {
  name: "Breakpoint 1024",
  render: () => (
    <IdsAppShell
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
        <IdsAppShell
          {...specAccurateProps}
          breakpointPreset="fluid"
          headerActions={
            <IdsAppShellHeaderActions>
              <IdsMastheadActionButtonContainer>
                <IdsMastheadActionIconButton
                  aria-label="What's New, 5 new"
                  badgeCount={5}
                  badgeType="critical"
                  icon={<IdsIcon shape="alert-bell-16" size={16} />}
                  onClick={() => setLastClick("whats-new")}
                />
                <IdsMastheadActionIconButton
                  aria-label="Settings"
                  icon={<IdsIcon shape="setting-gear-16" size={16} />}
                  onClick={() => setLastClick("settings")}
                />
              </IdsMastheadActionButtonContainer>
            </IdsAppShellHeaderActions>
          }
          appLauncherSlot={
            <AppLauncher
              triggerVariant="masthead"
              sideOffset={0}
              products={[
                { id: "p1", name: "Product Name 1" },
                { id: "p2", name: "Product Name 2" },
              ]}
            />
          }
          avatarSlot={
            <IdsMastheadAvatar
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
        <IdsAppShell
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

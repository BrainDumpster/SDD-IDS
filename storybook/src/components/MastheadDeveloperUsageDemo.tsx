import type { ComponentProps, ReactNode } from "react";

import { AppShellHeaderActions } from "./AppShell";
import { Icon } from "./Icon";
import {
  IdsMastheadActionButtonContainer,
  IdsMastheadActionIconButton,
} from "./IdsMasthead";

const icon16 = { width: 16, height: 16 } as const;

const headerActionsRowStyle = {
  display: "flex",
  alignItems: "center",
  height: "100%",
} as const;

const searchInputStyle: React.CSSProperties = {
  height: 32,
  marginRight: 8,
  padding: "0 8px",
  border: "1px solid var(--color-border-accessible)",
  borderRadius: 4,
  fontSize: 14,
  boxSizing: "border-box",
};

/** Product-owned search control — stub for Storybook developer usage demos. */
export function MySearchInput({
  className,
  style,
  ...rest
}: ComponentProps<"input">) {
  return (
    <input
      type="search"
      placeholder="Search..."
      aria-label="Search"
      className={className}
      style={{ ...searchInputStyle, ...style }}
      {...rest}
    />
  );
}

export interface DeveloperUsageActionButtonsProps {
  settingsOpen?: boolean;
  onWhatsNewClick?: () => void;
  onSettingsClick?: () => void;
}

/** Shared action cluster: search + icon buttons (used in Masthead and App Shell demos). */
export function DeveloperUsageActionButtons({
  settingsOpen = false,
  onWhatsNewClick,
  onSettingsClick,
}: DeveloperUsageActionButtonsProps) {
  return (
    <>
      <MySearchInput />
      <IdsMastheadActionButtonContainer>
        <IdsMastheadActionIconButton
          aria-label="What's New, 5 new"
          badgeCount={5}
          badgeType="critical"
          icon={<Icon shapeName="alert-bell-16" style={icon16} />}
          onClick={onWhatsNewClick}
        />
        <IdsMastheadActionIconButton
          aria-label="Settings"
          aria-expanded={settingsOpen}
          icon={<Icon shapeName="setting-gear-16" style={icon16} />}
          onClick={onSettingsClick}
        />
      </IdsMastheadActionButtonContainer>
    </>
  );
}

/** Composed `iconsSlot` for standalone Masthead developer usage. */
export function DeveloperUsageMastheadIconsSlot(props: DeveloperUsageActionButtonsProps) {
  return (
    <div className="masthead-header-actions" style={headerActionsRowStyle}>
      <DeveloperUsageActionButtons {...props} />
    </div>
  );
}

/** Composed `headerActions` for App Shell developer usage. */
export function DeveloperUsageAppShellHeaderActions(props: DeveloperUsageActionButtonsProps) {
  return (
    <AppShellHeaderActions>
      <DeveloperUsageActionButtons {...props} />
    </AppShellHeaderActions>
  );
}

/** Product page stub for App Shell developer usage. */
export function MyDashboard() {
  return (
    <p style={{ margin: 0 }}>
      Dashboard content — replace with your product view (e.g. <code>MyDashboard</code>).
    </p>
  );
}

export const developerUsageAppLauncherProducts = [
  { id: "p1", name: "Product Name 1", href: "#" },
  { id: "p2", name: "Product Name 2", href: "#" },
] as const;

/** Source snippet helpers — shown in Storybook code panels. */
export const MASTHEAD_DEVELOPER_USAGE_SOURCE = `import "components/ids-theme.css";
import { useState } from "react";
import {
  IdsMasthead,
  IdsMastheadActionButtonContainer,
  IdsMastheadActionIconButton,
  IdsMastheadAvatar,
} from "storybook/src/components/IdsMasthead";
import { AppLauncher } from "storybook/src/components/AppLauncher";
import { Icon } from "storybook/src/components/Icon";

/** Product-owned search field — swap with your design-system search component. */
function MySearchInput() {
  return (
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
  );
}

export function AppMasthead() {
  const [whatsNewOpen, setWhatsNewOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <IdsMasthead
      logo={
        <Icon
          shapeName="appic-dp-cloud-blue"
          variant="img"
          title="Product logo"
          style={{ width: 32, height: 32 }}
        />
      }
      productName="Product Name"
      iconsSlot={
        <div className="masthead-header-actions" style={{ display: "flex", alignItems: "center", height: "100%" }}>
          <MySearchInput />
          <IdsMastheadActionButtonContainer>
            <IdsMastheadActionIconButton
              aria-label="What's New, 5 new"
              badgeCount={5}
              badgeType="critical"
              icon={<Icon shapeName="alert-bell-16" style={{ width: 16, height: 16 }} />}
              onClick={() => setWhatsNewOpen(true)}
            />
            <IdsMastheadActionIconButton
              aria-label="Settings"
              aria-expanded={settingsOpen}
              icon={<Icon shapeName="setting-gear-16" style={{ width: 16, height: 16 }} />}
              onClick={() => setSettingsOpen((open) => !open)}
            />
          </IdsMastheadActionButtonContainer>
        </div>
      }
      appLauncherSlot={
        <AppLauncher
          triggerVariant="masthead"
          products={[
            { id: "p1", name: "Product Name 1", href: "#" },
            { id: "p2", name: "Product Name 2", href: "#" },
          ]}
        />
      }
      avatarSlot={
        <IdsMastheadAvatar initials="DT" onClick={() => openUserMenu()} />
      }
    />
  );
}`;

export const APP_SHELL_DEVELOPER_USAGE_SOURCE = `import "components/ids-theme.css";
import { useState } from "react";
import {
  AppShell,
  AppShellHeaderActions,
  IdsMastheadActionButtonContainer,
  IdsMastheadActionIconButton,
  IdsMastheadAvatar,
  type AppShellPage,
} from "storybook/src/components/AppShell";
import { AppLauncher } from "storybook/src/components/AppLauncher";
import { Icon } from "storybook/src/components/Icon";
import type { MainMenuLeftPrimaryItem } from "storybook/src/components/MainMenuLeft";
import { MyDashboard } from "./pages/MyDashboard";

function MySearchInput() {
  return (
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
  );
}

const menuItems: MainMenuLeftPrimaryItem[] = [
  { id: "dashboard", name: "Dashboard", iconName: "home", routeRef: "/dashboard" },
];

const pages: AppShellPage[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    description: "Overview of system health and recent activity.",
    content: <MyDashboard />,
  },
];

export function App() {
  const [whatsNewOpen, setWhatsNewOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const headerActions = (
    <AppShellHeaderActions>
      <MySearchInput />
      <IdsMastheadActionButtonContainer>
        <IdsMastheadActionIconButton
          aria-label="What's New, 5 new"
          badgeCount={5}
          badgeType="critical"
          icon={<Icon shapeName="alert-bell-16" style={{ width: 16, height: 16 }} />}
          onClick={() => setWhatsNewOpen(true)}
        />
        <IdsMastheadActionIconButton
          aria-label="Settings"
          aria-expanded={settingsOpen}
          icon={<Icon shapeName="setting-gear-16" style={{ width: 16, height: 16 }} />}
          onClick={() => setSettingsOpen((open) => !open)}
        />
      </IdsMastheadActionButtonContainer>
    </AppShellHeaderActions>
  );

  return (
    <AppShell
      pages={pages}
      menuItems={menuItems}
      defaultPageId="dashboard"
      mastheadProductName="Product Name"
      headerActions={headerActions}
      appLauncherSlot={
        <AppLauncher triggerVariant="masthead" products={[...]} />
      }
      avatarSlot={
        <IdsMastheadAvatar initials="DT" onClick={() => openUserMenu()} />
      }
    />
  );
}`;

export function DeveloperUsageStatusHint({
  lastClick,
  whatsNewOpen,
  settingsOpen,
  style,
}: {
  lastClick: string;
  whatsNewOpen?: boolean;
  settingsOpen?: boolean;
  style?: React.CSSProperties;
}) {
  const hint: ReactNode = (
    <>
      Last click: {lastClick}
      {whatsNewOpen ? " · What's New open" : ""}
      {settingsOpen ? " · Settings menu open" : ""}
    </>
  );

  return (
    <div
      style={{
        padding: "6px 10px",
        fontSize: 12,
        background: "var(--color-background-component)",
        border: "1px solid var(--color-border-accessible)",
        borderRadius: 4,
        pointerEvents: "none",
        ...style,
      }}
    >
      {hint}
    </div>
  );
}

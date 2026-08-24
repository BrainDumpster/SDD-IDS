/**
 * Hand-maintained Masthead integration demos (not overwritten by strict-spec-storybook-gate).
 * Keeps stable story ids such as `spec-generated-ids-masthead--developer-usage`.
 */
import React, { useState } from "react";
import "../../../components/ids-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import {
  IdsMasthead,
  IdsMastheadActionButtonContainer,
  IdsMastheadActionIconButton,
  IdsMastheadAvatar,
} from "./IdsMasthead";
import { AppLauncher } from "./AppLauncher";
import { Icon } from "./Icon";
import {
  DeveloperUsageMastheadIconsSlot,
  DeveloperUsageStatusHint,
  MASTHEAD_DEVELOPER_USAGE_SOURCE,
  developerUsageAppLauncherProducts,
} from "./MastheadDeveloperUsageDemo";

const icon16 = { width: 16, height: 16 } as const;

const productLogo = (
  <Icon
    shapeName="appic-dp-cloud-blue"
    variant="img"
    title="Product logo"
    style={{ width: 32, height: 32 }}
  />
);

const DEVELOPER_USAGE_SOURCE = MASTHEAD_DEVELOPER_USAGE_SOURCE;

const COMPOSED_ICONS_SLOT_SOURCE = `import {
  IdsMasthead,
  IdsMastheadActionButtonContainer,
  IdsMastheadActionIconButton,
  IdsMastheadAvatar,
} from "storybook/src/components/IdsMasthead";
import { Icon } from "storybook/src/components/Icon";

// Angular analogue: project into <ids-masthead iconsSlot> / HeaderActions child
<IdsMasthead
  productName="Product Name"
  iconsSlot={
  <div className="masthead-header-actions">
    <search-input />
    <IdsMastheadActionIconButton
      aria-label="Alerts, 3 unread"
      badgeCount={3}
      badgeType="critical"
      icon={<Icon shapeName="alert-bell-16" />}
      onClick={openAlerts}
    />
    <MySettingsDropdown />
  </div>
  }
  appLauncherSlot={<AppLauncher triggerVariant="masthead" products={products} />}
  avatarSlot={<IdsMastheadAvatar initials="DT" onClick={openUserMenu} />}
/>`;

const codePanelStyle: React.CSSProperties = {
  margin: 0,
  padding: "12px 16px",
  fontSize: 12,
  lineHeight: 1.5,
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
  background: "var(--color-background-surface-component)",
  color: "var(--color-text-gray-neutral-strong)",
  borderBottom: "1px solid var(--color-border-gray-neutral-base)",
  overflow: "auto",
  maxHeight: "38vh",
  whiteSpace: "pre",
};

const headerActionsWrapperStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  height: "100%",
};

const meta: Meta<typeof IdsMasthead> = {
  title: "Components/IDS/Masthead",
  component: IdsMasthead,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof IdsMasthead>;

export const WithNotificationBadges: Story = {
  name: "With notification badges",
  args: {
    productName: "Product Name",
    iconsSlot: (
      <IdsMastheadActionButtonContainer>
        <IdsMastheadActionIconButton aria-label="Search" icon={<Icon shapeName="search-16" style={icon16} />} />
        <IdsMastheadActionIconButton
          aria-label="Alerts, 3 unread"
          badgeCount={3}
          badgeType="critical"
          icon={<Icon shapeName="alert-bell-16" style={icon16} />}
        />
        <IdsMastheadActionIconButton
          aria-label="Jobs queue, 2 active"
          badgeCount={2}
          badgeType="success"
          icon={<Icon shapeName="jobs-queue-stack" style={icon16} />}
        />
      </IdsMastheadActionButtonContainer>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Optional `iconsSlot` only — search + badged Alerts/Jobs. Avatar and App Launcher omitted to show independent composition.",
      },
    },
  },
};

/** Back-compat for Storybook deep links / HMR (`spec-generated-ids-masthead--developer-usage`). */
export const DeveloperUsage: Story = {
  name: "Developer usage",
  render: () => {
    const [whatsNewOpen, setWhatsNewOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [lastClick, setLastClick] = useState("—");

    return (
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <pre style={codePanelStyle} aria-label="Masthead integration source">
          {DEVELOPER_USAGE_SOURCE}
        </pre>
        <div style={{ position: "relative" }}>
          <IdsMasthead
            logo={productLogo}
            productName="Product Name"
            iconsSlot={
              <DeveloperUsageMastheadIconsSlot
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
          />
          <DeveloperUsageStatusHint
            lastClick={lastClick}
            whatsNewOpen={whatsNewOpen}
            settingsOpen={settingsOpen}
            style={{ position: "absolute", top: 64, right: 16, zIndex: 10 }}
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
          "Only `productName` is required. Compose optional `logo`, `iconsSlot` (search/action icons), `appLauncherSlot`, and `avatarSlot` — each control owns its `onClick`.",
      },
      source: { code: DEVELOPER_USAGE_SOURCE, language: "tsx" },
    },
  },
};

/** Flexible composition — search stub + badge icon buttons + settings toggle. */
export const ComposedIconsSlot: Story = {
  name: "Composed icons slot",
  render: () => {
    const [whatsNewOpen, setWhatsNewOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [lastClick, setLastClick] = useState("—");

    return (
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <pre style={codePanelStyle} aria-label="Composed icons slot source">
          {COMPOSED_ICONS_SLOT_SOURCE}
        </pre>
        <div style={{ position: "relative" }}>
          <IdsMasthead
            logo={productLogo}
            productName="Product Name"
            iconsSlot={
              <div className="masthead-header-actions" style={headerActionsWrapperStyle}>
                <input
                  type="search"
                  placeholder="Search..."
                  aria-label="Search"
                  style={{
                    height: 32,
                    marginRight: 8,
                    padding: "0 8px",
                    border: "1px solid var(--color-border-gray-neutral-base)",
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
              </div>
            }
            appLauncherSlot={
              <AppLauncher
                triggerVariant="masthead"
                sideOffset={0}
                products={[{ id: "p1", name: "Product Name 1", href: "#" }]}
              />
            }
            avatarSlot={
              <IdsMastheadAvatar
                initials="DT"
                onClick={() => setLastClick("avatar")}
              />
            }
          />
          {settingsOpen ? (
            <div
              role="menu"
              style={{
                position: "absolute",
                top: 56,
                right: 120,
                zIndex: 20,
                background: "var(--color-background-surface-component)",
                border: "1px solid var(--color-border-gray-neutral-base)",
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
          <div
            style={{
              position: "absolute",
              top: 64,
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
          "Host-composed `iconsSlot` sample: mix search, badge icon buttons, and dropdown panels. Logo, App Launcher, and avatar are also optional host slots — Masthead does not dispatch a central handler.",
      },
      source: { code: COMPOSED_ICONS_SLOT_SOURCE, language: "tsx" },
    },
  },
};

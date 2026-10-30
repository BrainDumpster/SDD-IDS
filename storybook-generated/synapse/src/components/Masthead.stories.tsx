import React, { useState } from "react";
import "../../../../components/synapse-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import { SynapseAppLauncher } from "../../../../storybook/src/components/SynapseAppLauncher";
import { Icon } from "../../../../storybook/src/components/Icon";
import {
  SynapseMasthead,
  SynapseMastheadActionButtonContainer,
  SynapseMastheadActionIconButton,
  SynapseMastheadAvatar,
  SynapseMastheadHelpMenu,
  SynapseMastheadUserMenu,
  SynapseMastheadUserMenuDefaultIcon,
} from "../../../../storybook/src/components/SynapseMasthead";
import userIcon from "../../../../assets/icons/user-single-16.svg";

const DESIGN_SPEC_PATH = "components/synapse/masthead/design-spec.md";
const FIGMA_SPEC_ACCURATE_NODE = "47807:7569";

const searchIcon = <Icon shapeName="search-16" style={{ width: 16, height: 16 }} />;
const alertsIcon = <Icon shapeName="alert-bell-16" style={{ width: 16, height: 16 }} />;
const jobsIcon = <Icon shapeName="jobs-queue-stack" style={{ width: 16, height: 16 }} />;
const settingsIcon = <Icon shapeName="setting-gear-16" style={{ width: 16, height: 16 }} />;

const defaultHelpSlot = (
  <SynapseMastheadActionButtonContainer>
    <SynapseMastheadHelpMenu />
  </SynapseMastheadActionButtonContainer>
);

const defaultAppLauncher = (
  <SynapseAppLauncher
    triggerVariant="masthead"
    sideOffset={0}
    products={[
      { id: "dap", name: "Dell Automation Platform", href: "#" },
      { id: "aiops", name: "Dell AIOps", href: "#" },
    ]}
  />
);

const defaultUserMenu = (
  <SynapseMastheadUserMenu
    userName="User Name"
    email="user.name@example.com"
    initials="YK"
    onLogout={() => undefined}
  />
);

const fullIconsSlot = (
  <SynapseMastheadActionButtonContainer>
    <SynapseMastheadActionIconButton aria-label="Search" icon={searchIcon} />
    <SynapseMastheadActionIconButton aria-label="Alerts" icon={alertsIcon} />
    <SynapseMastheadActionIconButton aria-label="Jobs" icon={jobsIcon} />
    <SynapseMastheadActionIconButton aria-label="System settings" icon={settingsIcon} />
    <SynapseMastheadHelpMenu />
  </SynapseMastheadActionButtonContainer>
);

const fullIconsWithBadgesSlot = (
  <SynapseMastheadActionButtonContainer>
    <SynapseMastheadActionIconButton aria-label="Search" icon={searchIcon} />
    <SynapseMastheadActionIconButton
      aria-label="Alerts, 3 notifications"
      icon={alertsIcon}
      badgeCount={3}
      badgeType="critical"
    />
    <SynapseMastheadActionIconButton
      aria-label="Jobs, 12 items"
      icon={jobsIcon}
      badgeCount={12}
      badgeType="success"
    />
    <SynapseMastheadActionIconButton aria-label="System settings" icon={settingsIcon} />
    <SynapseMastheadHelpMenu />
  </SynapseMastheadActionButtonContainer>
);

const meta: Meta<typeof SynapseMasthead> = {
  title: "Components/Synapse/Masthead",
  component: SynapseMasthead,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: [
          `Spec-driven Synapse Masthead (IDS-fork). Source: \`${DESIGN_SPEC_PATH}\`.`,
          `Primary story: **Spec Accurate Design** (Figma \`${FIGMA_SPEC_ACCURATE_NODE}\`) — Synapse + Help + App Launcher + user menu.`,
          "Compose utilities via `iconsSlot`; no root action callback. Theme: `components/synapse-theme.css`.",
        ].join(" "),
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof SynapseMasthead>;

/** Canonical spec-driven example — variant `default` with user menu dropdown. */
export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  args: {
    productName: "Synapse",
    iconsSlot: defaultHelpSlot,
    appLauncherSlot: defaultAppLauncher,
    avatarSlot: defaultUserMenu,
  },
};

/** Variant `default` — alias for primary Storybook gate story. */
export const Default: Story = {
  args: SpecAccurateDesign.args,
};

/** Variant `user-icon` — Figma `50024:244160` / `50024:244158`; icon avatar, plain email row. */
export const UserIconAvatar: Story = {
  args: {
    productName: "Synapse",
    iconsSlot: defaultHelpSlot,
    appLauncherSlot: defaultAppLauncher,
    avatarSlot: (
      <SynapseMastheadUserMenu
        userName="User Name"
        email="user.name@example.com"
        onLogout={() => undefined}
      />
    ),
  },
};

/** Photo avatar via `imageSrc` with user menu. */
export const UserPhotoAvatar: Story = {
  args: {
    productName: "Synapse",
    iconsSlot: defaultHelpSlot,
    appLauncherSlot: defaultAppLauncher,
    avatarSlot: (
      <SynapseMastheadUserMenu
        userName="User Name"
        email="user.name@example.com"
        imageSrc={userIcon}
        imageAlt="User profile"
        onLogout={() => undefined}
      />
    ),
  },
};

/** User menu with custom options between email and Log Out. */
export const UserMenuWithCustomOptions: Story = {
  render: () => {
    const [lastAction, setLastAction] = useState("No selection yet");
    return (
      <div>
        <SynapseMasthead
          productName="Synapse"
          iconsSlot={defaultHelpSlot}
          appLauncherSlot={defaultAppLauncher}
          avatarSlot={
            <SynapseMastheadUserMenu
              userName="Yuki Kobayashi"
              email="yuki.kobayashi@example.com"
              initials="YK"
              options={[
                { id: "profile", label: "My Profile", onSelect: () => setLastAction("My Profile") },
                { id: "settings", label: "Account Settings", onSelect: () => setLastAction("Account Settings") },
              ]}
              onLogout={() => setLastAction("Log Out")}
            />
          }
        />
        <div
          style={{
            padding: 16,
            color: "var(--color-text-neutral-strong)",
            fontSize: "var(--font-size-body-2)",
          }}
        >
          Last action: {lastAction}
        </div>
      </div>
    );
  },
};

/** Variant `full-actions` — full utility strip per Figma `50154:68499`. */
export const FullActionStrip: Story = {
  args: {
    productName: "Synapse",
    iconsSlot: fullIconsSlot,
    appLauncherSlot: defaultAppLauncher,
    avatarSlot: (
      <SynapseMastheadUserMenu
        userName="User Name"
        email="user.name@example.com"
        initials="DT"
        onLogout={() => undefined}
      />
    ),
  },
};

/** Variant `with-badges` — full strip with Alerts (critical) and Jobs (success) badges. */
export const WithBadges: Story = {
  args: {
    productName: "Synapse",
    iconsSlot: fullIconsWithBadgesSlot,
    appLauncherSlot: defaultAppLauncher,
    avatarSlot: defaultUserMenu,
  },
};

/** Badge overflow — counts above 99 render as `99+`. */
export const BadgeOverflow: Story = {
  args: {
    productName: "Synapse",
    iconsSlot: (
      <SynapseMastheadActionButtonContainer>
        <SynapseMastheadActionIconButton
          aria-label="Alerts, 99+ notifications"
          icon={alertsIcon}
          badgeCount={120}
          badgeType="critical"
        />
        <SynapseMastheadHelpMenu />
      </SynapseMastheadActionButtonContainer>
    ),
    appLauncherSlot: defaultAppLauncher,
    avatarSlot: defaultUserMenu,
  },
};

/** Help menu open — Figma `51829:85983` (About, Get Started). */
export const HelpMenuOpen: Story = {
  args: {
    productName: "Synapse",
    iconsSlot: (
      <SynapseMastheadActionButtonContainer>
        <SynapseMastheadHelpMenu defaultOpen />
      </SynapseMastheadActionButtonContainer>
    ),
    appLauncherSlot: defaultAppLauncher,
    avatarSlot: defaultUserMenu,
  },
};

/** Variant `with-search` — search action added to reduced default strip. */
export const WithSearch: Story = {
  args: {
    productName: "Synapse",
    iconsSlot: (
      <SynapseMastheadActionButtonContainer>
        <SynapseMastheadActionIconButton aria-label="Search" icon={searchIcon} />
        <SynapseMastheadHelpMenu />
      </SynapseMastheadActionButtonContainer>
    ),
    appLauncherSlot: defaultAppLauncher,
    avatarSlot: defaultUserMenu,
  },
};

/** Consumer layout variant `sticky` — masthead remains fixed at top while content scrolls. */
export const Sticky: Story = {
  render: (args) => (
    <div style={{ minHeight: "120vh", background: "var(--color-background-surface-1)" }}>
      <div style={{ position: "sticky", top: 0, zIndex: 10 }}>
        <SynapseMasthead {...args} />
      </div>
      <div
        style={{
          padding: 24,
          color: "var(--color-text-neutral-strong)",
          fontSize: "var(--font-size-body-2)",
        }}
      >
        Scroll to verify sticky masthead behavior.
      </div>
    </div>
  ),
  args: {
    productName: "Synapse",
    iconsSlot: defaultHelpSlot,
    appLauncherSlot: defaultAppLauncher,
    avatarSlot: defaultUserMenu,
  },
};

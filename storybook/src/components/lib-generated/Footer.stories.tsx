/**
 * Storybook: design-spec–generated Footer from `lib/react/ids/footer`
 * (React + CSS Modules, no @base-ui-components).
 *
 * Anatomy:
 *   FooterRoot → LeftRegion (HostName? + SwidGroup?) → TimeGroup? → TimeZoneGroup?
 *
 * Composition: lib `IdsIcon`, `IdsButton` (tertiary/small), `IdsTooltip` (hostname truncate).
 * Theme: components/ids-theme.css
 * Spec: components/ids/footer/design-spec.md
 */
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/ids-theme.css";
import {
  FOOTER_DOCS_DESCRIPTION,
  FOOTER_SOURCE_CODE,
} from "./ids-footer.developer-usage";
import {
  IdsFooter,
  type IdsFooterProps,
} from "@ids/react/footer";
import {
  IdsMainMenuLeft,
  type MainMenuLeftPrimaryItem,
} from "@ids/react/main-menu-left";

const DESIGN_SPEC_PATH = "components/ids/footer/design-spec.md";

/** Spec Accurate Design story defaults — Figma `38908:5818`. */
const specAccurateArgs: IdsFooterProps = {
  hostname: "short_name_first_domain_name",
  swid: "ELMCR00222GBPB",
  currentDateTime: "Tue, 2023-04-23 12:30 AM",
  timeZoneLabel: "Eastern Time (US & Canada)",
  showHostname: true,
  showCurrentDateAndTime: true,
  showTimeZone: true,
};

/** Sample nav from Figma MainMenu-Left-Main expanded (`11099:56218`). */
const leftNavItems: MainMenuLeftPrimaryItem[] = [
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

const frameStyle: React.CSSProperties = {
  width: "100%",
  minHeight: 120,
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  background: "var(--color-background-surface-component)",
};

const meta: Meta<IdsFooterProps> = {
  tags: ["autodocs"],
  title: "Components/IDS/Footer",
  component: IdsFooter,
  parameters: {
    layout: "fullscreen",
    docs: {
      canvas: { sourceState: "open" },
      description: {
        component: FOOTER_DOCS_DESCRIPTION,
      },
      source: {
        type: "code",
        language: "tsx",
        code: FOOTER_SOURCE_CODE,
      },
    },
  },
  args: specAccurateArgs,
  argTypes: {
    hostname: { control: "text" },
    swid: { control: "text" },
    currentDateTime: { control: "text" },
    timeZoneLabel: { control: "text" },
    showHostname: { control: "boolean" },
    showCurrentDateAndTime: { control: "boolean" },
    showTimeZone: { control: "boolean" },
    copyDisabled: { control: "boolean" },
    timeZoneDisabled: { control: "boolean" },
    onCopySwid: { action: "onCopySwid" },
    onTimeZoneClick: { action: "onTimeZoneClick" },
  },
};

export default meta;
type Story = StoryObj<IdsFooterProps>;

function SpecAccurateFrame(props: IdsFooterProps) {
  return (
    <div style={frameStyle}>
      <IdsFooter {...props} />
    </div>
  );
}

export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  args: specAccurateArgs,
  render: (args) => <SpecAccurateFrame {...args} />,
};

export const VisibilityMatrix: Story = {
  name: "Visibility Matrix",
  render: () => (
    <div style={{ display: "grid", gap: 16 }}>
      <IdsFooter {...specAccurateArgs} />
      <IdsFooter {...specAccurateArgs} showHostname={false} />
      <IdsFooter {...specAccurateArgs} showCurrentDateAndTime={false} />
      <IdsFooter {...specAccurateArgs} showTimeZone={false} />
      <IdsFooter
        {...specAccurateArgs}
        showHostname={false}
        showCurrentDateAndTime={false}
        showTimeZone={false}
      />
    </div>
  ),
};

export const HostnameTruncation: Story = {
  name: "Hostname Truncation",
  render: () => (
    <div style={frameStyle}>
      <IdsFooter
        {...specAccurateArgs}
        hostname="this_hostname_exceeds_forty_eight_characters_abcde_extra"
      />
    </div>
  ),
};

export const DisabledControls: Story = {
  name: "Disabled Controls",
  render: () => (
    <div style={frameStyle}>
      <IdsFooter
        {...specAccurateArgs}
        copyDisabled
        timeZoneDisabled
      />
    </div>
  ),
};

export const WithoutSwid: Story = {
  name: "Without SWID",
  render: () => (
    <div style={frameStyle}>
      <IdsFooter {...specAccurateArgs} swid={undefined} />
    </div>
  ),
};

/** App-shell layout: IDS Main Menu/Left rail on the left, footer filling the remaining width beside it. */
function FooterWithLeftNavFrame(props: IdsFooterProps) {
  const [navExpanded, setNavExpanded] = React.useState(true);
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        boxSizing: "border-box",
        background: "var(--color-background-surface-primary)",
        minHeight: 0,
      }}
    >
      <div
        style={{
          width: navExpanded ? 278 : 64,
          height: "100%",
          flexShrink: 0,
        }}
      >
        <IdsMainMenuLeft
          expanded={navExpanded}
          onExpandedChange={setNavExpanded}
          items={leftNavItems}
          defaultSelectedItemId="dashboard"
        />
      </div>
      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "stretch",
          background: "var(--color-background-surface-component)",
        }}
      >
        <IdsFooter {...props} style={{ width: "100%" }} />
      </div>
    </div>
  );
}

export const WithLeftNavigation: Story = {
  name: "With Left Navigation",
  render: (args) => <FooterWithLeftNavFrame {...args} />,
  args: specAccurateArgs,
};

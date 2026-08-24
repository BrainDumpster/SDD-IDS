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
  IdsFooter,
  type IdsFooterProps,
} from "../../../../lib/react/ids/footer";

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
  title: "Components/IDS/Footer",
  component: IdsFooter,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          `React IDS Footer from \`${DESIGN_SPEC_PATH}\`. ` +
          "Anatomy: FooterRoot → LeftRegion (HostName? / SwidGroup?) → TimeGroup? → TimeZoneGroup?. " +
          "Composes lib `IdsIcon`, `IdsButton` (tertiary/small + world-globe), and `IdsTooltip` for hostname truncation. " +
          "Theme: `components/ids-theme.css`. No `@base-ui-components`.",
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

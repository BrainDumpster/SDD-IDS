/**
 * Storybook: design-spec–generated Footer from `lib/react/synapse/footer`
 * (IDS-fork reexport façade — React + CSS Modules).
 *
 * Anatomy:
 *   FooterRoot → LeftRegion (HostName? + SwidGroup?) → TimeGroup? → TimeZoneGroup?
 *
 * Composition: lib `SynapseIcon`, `SynapseButton` (tertiary/small), `SynapseTooltip` (hostname truncate).
 * Theme: components/synapse-theme.css
 * Spec: components/synapse/footer/design-spec.md
 */
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/synapse-theme.css";
import {
  SYNAPSE_FOOTER_DOCS_DESCRIPTION,
  SYNAPSE_FOOTER_SOURCE_CODE,
} from "./synapse-footer.developer-usage";
import {
  SynapseFooter,
  type SynapseFooterProps,
} from "@synapse/react/footer";

const DESIGN_SPEC_PATH = "components/synapse/footer/design-spec.md";

/** Spec Accurate Design story defaults — Figma `38908:5818`. */
const specAccurateArgs: SynapseFooterProps = {
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

const meta: Meta<SynapseFooterProps> = {
  tags: ["autodocs"],
  title: "Components/Synapse/Footer",
  component: SynapseFooter,
  parameters: {
    layout: "fullscreen",
    docs: {
      canvas: { sourceState: "open" },
      description: {
        component: SYNAPSE_FOOTER_DOCS_DESCRIPTION,
      },
      source: {
        type: "code",
        language: "tsx",
        code: SYNAPSE_FOOTER_SOURCE_CODE,
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
type Story = StoryObj<SynapseFooterProps>;

function SpecAccurateFrame(props: SynapseFooterProps) {
  return (
    <div style={frameStyle}>
      <SynapseFooter {...props} />
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
      <SynapseFooter {...specAccurateArgs} />
      <SynapseFooter {...specAccurateArgs} showHostname={false} />
      <SynapseFooter {...specAccurateArgs} showCurrentDateAndTime={false} />
      <SynapseFooter {...specAccurateArgs} showTimeZone={false} />
      <SynapseFooter
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
      <SynapseFooter
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
      <SynapseFooter
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
      <SynapseFooter {...specAccurateArgs} swid={undefined} />
    </div>
  ),
};

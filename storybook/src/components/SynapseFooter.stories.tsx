import "../../../components/synapse-theme.css";
import type { ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { SPEC_ACCURATE_DESIGN_STORY } from "@component-contracts/common/story-meta";
import { SynapseFooter } from "./SynapseFooter";
import {
  SYNAPSE_FOOTER_DESIGN_SPEC_PATH,
  SYNAPSE_FOOTER_IDS_BASELINE_SPEC_PATH,
  SYNAPSE_FOOTER_IDS_MAIN_NODE_ID,
  SYNAPSE_FOOTER_SPEC_ACCURATE_DEFAULTS,
} from "../spec-contracts/synapse-footer.contract";

const FOOTER_STORY_FRAME_STYLE = {
  width: "100%",
  minHeight: "120px",
  boxSizing: "border-box" as const,
  display: "flex",
  flexDirection: "column" as const,
  justifyContent: "flex-end",
  background: "var(--color-background-component)",
};

const specAccurateArgs: ComponentProps<typeof SynapseFooter> = {
  hostname: SYNAPSE_FOOTER_SPEC_ACCURATE_DEFAULTS.hostname,
  swid: SYNAPSE_FOOTER_SPEC_ACCURATE_DEFAULTS.swid,
  currentDateTime: SYNAPSE_FOOTER_SPEC_ACCURATE_DEFAULTS.currentDateTime,
  timeZoneLabel: SYNAPSE_FOOTER_SPEC_ACCURATE_DEFAULTS.timeZoneLabel,
  showHostname: SYNAPSE_FOOTER_SPEC_ACCURATE_DEFAULTS.showHostname,
  showCurrentDateAndTime: SYNAPSE_FOOTER_SPEC_ACCURATE_DEFAULTS.showCurrentDateAndTime,
  showTimeZone: SYNAPSE_FOOTER_SPEC_ACCURATE_DEFAULTS.showTimeZone,
};

const meta: Meta<typeof SynapseFooter> = {
  title: "Components/Synapse/Footer",
  component: SynapseFooter,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: [
          `Spec-driven Synapse application status footer (IDS-fork). Source: \`${SYNAPSE_FOOTER_DESIGN_SPEC_PATH}\`.`,
          `IDS baseline: \`${SYNAPSE_FOOTER_IDS_BASELINE_SPEC_PATH}\` (Figma \`${SYNAPSE_FOOTER_IDS_MAIN_NODE_ID}\`).`,
          "No programme layout deltas — geometry and API inherit IDS; tokens resolve via `components/synapse-theme.css`.",
        ].join(" "),
      },
    },
  },
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
  },
  args: specAccurateArgs,
};

export default meta;
type Story = StoryObj<typeof SynapseFooter>;

function SpecAccurateFrame(props: ComponentProps<typeof SynapseFooter>) {
  return (
    <div style={FOOTER_STORY_FRAME_STYLE}>
      <SynapseFooter {...props} />
    </div>
  );
}

export const SpecAccurateDesign: Story = {
  name: SPEC_ACCURATE_DESIGN_STORY,
  parameters: {
    docs: {
      description: {
        story:
          "IDS baseline `38908:5818` — full 32px bar with host, SWID (+ copy), date/time, and time zone.",
      },
    },
  },
  render: (args) => <SpecAccurateFrame {...args} />,
};

export const HostAndSwidOnly: Story = {
  parameters: {
    docs: {
      description: {
        story: "Figma `hostname=true`, `currentDateAndTime=false`, `timeZone=false`.",
      },
    },
  },
  render: () => (
    <div style={FOOTER_STORY_FRAME_STYLE}>
      <SynapseFooter
        hostname="prod-cluster-01.example.com"
        swid="ELMCR00222GBPB"
        showHostname
        showCurrentDateAndTime={false}
        showTimeZone={false}
      />
    </div>
  ),
};

export const TimeAndZoneOnly: Story = {
  parameters: {
    docs: {
      description: {
        story: "Right-side groups only — host/SWID hidden.",
      },
    },
  },
  render: () => (
    <div style={FOOTER_STORY_FRAME_STYLE}>
      <SynapseFooter
        currentDateTime="Wed, 2024-11-06 3:45 PM"
        timeZoneLabel="Pacific Time (US & Canada)"
        showHostname={false}
        showCurrentDateAndTime
        showTimeZone
      />
    </div>
  ),
};

export const DisabledControls: Story = {
  parameters: {
    docs: {
      description: {
        story: "Copy and time-zone actions disabled (`copyDisabled`, `timeZoneDisabled`).",
      },
    },
  },
  render: () => (
    <div style={FOOTER_STORY_FRAME_STYLE}>
      <SynapseFooter
        hostname={SYNAPSE_FOOTER_SPEC_ACCURATE_DEFAULTS.hostname}
        swid={SYNAPSE_FOOTER_SPEC_ACCURATE_DEFAULTS.swid}
        currentDateTime={SYNAPSE_FOOTER_SPEC_ACCURATE_DEFAULTS.currentDateTime}
        timeZoneLabel={SYNAPSE_FOOTER_SPEC_ACCURATE_DEFAULTS.timeZoneLabel}
        copyDisabled
        timeZoneDisabled
      />
    </div>
  ),
};

export const LongHostNameTruncation: Story = {
  parameters: {
    docs: {
      description: {
        story: "Long host/SWID strings truncate with ellipsis; bar height stays 32px.",
      },
    },
  },
  render: () => (
    <div style={FOOTER_STORY_FRAME_STYLE}>
      <SynapseFooter
        hostname="very-long-host-name-that-should-truncate-in-the-status-bar.example.internal"
        swid="ELMCR00222GBPB-EXTENDED-SWID-IDENTIFIER"
        currentDateTime="Tue, 2023-04-23 12:30 AM"
        timeZoneLabel="Eastern Time (US & Canada)"
      />
    </div>
  ),
};

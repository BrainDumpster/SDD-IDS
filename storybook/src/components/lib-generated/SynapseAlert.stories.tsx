/**
 * Storybook: design-spec–generated Alert from `lib/react/synapse/alert`
 * (IDS-fork reexport façade — React + CSS Modules).
 *
 * Theme: components/synapse-theme.css
 * Spec: components/synapse/alert/design-spec.md
 */
import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/synapse-theme.css";
import {
  SYNAPSE_ALERT_DOCS_DESCRIPTION,
  SYNAPSE_ALERT_SOURCE_CODE,
} from "./synapse-alert.developer-usage";
import {
  SynapseAlert,
  SynapseAlertGroup,
  type SynapseAlertItem,
  type SynapseAlertProps,
} from "@synapse/react/alert";

const meta: Meta<SynapseAlertProps> = {
  tags: ["autodocs"],
  title: "Components/Synapse/Alert",
  component: SynapseAlert,
  parameters: {
    layout: "padded",
    docs: {
      canvas: { sourceState: "open" },
      description: {
        component: SYNAPSE_ALERT_DOCS_DESCRIPTION,
      },
      source: {
        type: "code",
        language: "tsx",
        code: SYNAPSE_ALERT_SOURCE_CODE,
      },
    },
  },
  args: {
    display: "global",
    severity: "critical",
    message: "Service interruption in region us-east-1.",
    dismissible: true,
  },
  argTypes: {
    display: { control: "select", options: ["global", "inline"] },
    severity: {
      control: "select",
      options: [
        "critical",
        "warning-major",
        "warning-minor",
        "informational",
        "success",
      ],
    },
    density: { control: "select", options: ["compact", "detailed"] },
    message: { control: "text" },
    title: { control: "text" },
    linkLabel: { control: "text" },
    linkHref: { control: "text" },
    actionLabel: { control: "text" },
    dismissible: { control: "boolean" },
    onAction: { action: "onAction" },
    onDismiss: { action: "onDismiss" },
    onLinkClick: { action: "onLinkClick" },
  },
};

export default meta;
type Story = StoryObj<SynapseAlertProps>;

export const Playground: Story = {
  render: (args: SynapseAlertProps) => <SynapseAlert {...args} />,
};

export const GlobalSeverities: Story = {
  name: "Global Severities",
  render: () => (
    <div style={{ display: "grid", gap: 16 }}>
      <SynapseAlert
        display="global"
        severity="critical"
        message="Critical outage: immediate action required."
        linkLabel="View status page"
        linkHref="#"
        actionLabel="Retry"
        dismissible
      />
      <SynapseAlert
        display="global"
        severity="warning-major"
        message="Major degradation detected for alerting service."
        linkLabel="Learn more"
        linkHref="#"
        dismissible
      />
      <SynapseAlert
        display="global"
        severity="warning-minor"
        message="Minor warning: configuration drift found."
        dismissible
      />
      <SynapseAlert
        display="global"
        severity="informational"
        message="Informational maintenance notice."
        linkLabel="Open schedule"
        linkHref="#"
        dismissible
      />
    </div>
  ),
};

export const GlobalCarouselScenario: Story = {
  name: "Global Carousel Scenario",
  render: () => (
    <SynapseAlert
      display="global"
      severity="informational"
      message="Multiple active alerts are available."
      carousel={{ currentItem: 2, totalItems: 5 }}
      linkLabel="Open alert center"
      linkHref="#"
      actionLabel="Acknowledge"
      dismissible
    />
  ),
};

export const GlobalAlertGroup: Story = {
  name: "Global Alert Group",
  render: function Render() {
    const [items] = useState<SynapseAlertItem[]>([
      {
        severity: "critical",
        message: "Critical: region failover in progress.",
        linkLabel: "Status",
        linkHref: "#",
      },
      {
        severity: "warning-major",
        message: "Major: elevated error rates on API gateway.",
        actionLabel: "Acknowledge",
      },
      {
        severity: "informational",
        message: "Info: scheduled maintenance window starts at 02:00 UTC.",
        linkLabel: "Schedule",
        linkHref: "#",
      },
    ]);
    return <SynapseAlertGroup items={items} />;
  },
};

export const InlineCompactStates: Story = {
  name: "Inline Compact States",
  parameters: {
    docs: {
      description: {
        story:
          "Compact inline matrix including Figma `11946:230315` warning-minor row with outlined action + dismiss.",
      },
    },
  },
  render: () => (
    <div style={{ display: "grid", gap: 16 }}>
      <SynapseAlert
        display="inline"
        density="compact"
        severity="informational"
        message="Informational inline alert."
        dismissible
      />
      <SynapseAlert
        display="inline"
        density="compact"
        severity="success"
        message="Success inline alert."
        dismissible
      />
      <SynapseAlert
        display="inline"
        density="compact"
        severity="warning-minor"
        message="This is an page-level alert that communicates a warning (minor) message. It may include actions."
        actionLabel="Action"
        dismissible
      />
      <SynapseAlert
        display="inline"
        density="compact"
        severity="warning-major"
        message="Warning major inline alert."
        dismissible
      />
      <SynapseAlert
        display="inline"
        density="compact"
        severity="critical"
        message="Critical inline alert."
        dismissible
      />
    </div>
  ),
};

export const InlineDetailedAllDetails: Story = {
  name: "Inline Detailed All Details",
  parameters: {
    docs: {
      description: {
        story:
          "Figma `11946:230988`: detailed title + message; outlined action in the title row; dismiss alone in trailing (16px top, 17px right, 12×12 glyph).",
      },
    },
  },
  render: () => (
    <SynapseAlert
      display="inline"
      density="detailed"
      severity="warning-minor"
      title="Alert Title"
      message="This is an page-level alert that communicates a warning (minor) message. It may include actions or a "
      linkLabel="link to another page."
      linkHref="#"
      actionLabel="Action"
      dismissible
    />
  ),
};

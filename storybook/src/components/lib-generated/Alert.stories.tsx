/**
 * Storybook: design-spec–generated Alert from `lib/react/ids/alert`
 * (React + CSS Modules, no @base-ui-components).
 *
 * Theme: components/ids-theme.css
 * Spec: components/ids/alert/design-spec.md
 */
import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/ids-theme.css";
import {
  ALERT_DOCS_DESCRIPTION,
  ALERT_SOURCE_CODE,
} from "./ids-alert.developer-usage";
import {
  IdsAlert,
  IdsAlertGroup,
  type IdsAlertItem,
  type IdsAlertProps,
} from "@ids/react/alert";

const meta: Meta<IdsAlertProps> = {
  tags: ["autodocs"],
  title: "Components/IDS/Alert",
  component: IdsAlert,
  parameters: {
    layout: "padded",
    docs: {
      canvas: { sourceState: "open" },
      description: {
        component: ALERT_DOCS_DESCRIPTION,
      },
      source: {
        type: "code",
        language: "tsx",
        code: ALERT_SOURCE_CODE,
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
type Story = StoryObj<IdsAlertProps>;

export const Playground: Story = {
  render: (args: IdsAlertProps) => <IdsAlert {...args} />,
};

export const GlobalSeverities: Story = {
  name: "Global Severities",
  render: () => (
    <div style={{ display: "grid", gap: 16 }}>
      <IdsAlert
        display="global"
        severity="critical"
        message="Critical outage: immediate action required."
        linkLabel="View status page"
        linkHref="#"
        actionLabel="Retry"
        dismissible
      />
      <IdsAlert
        display="global"
        severity="warning-major"
        message="Major degradation detected for alerting service."
        linkLabel="Learn more"
        linkHref="#"
        dismissible
      />
      <IdsAlert
        display="global"
        severity="warning-minor"
        message="Minor warning: configuration drift found."
        dismissible
      />
      <IdsAlert
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
    <IdsAlert
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
    const [items] = useState<IdsAlertItem[]>([
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
    return <IdsAlertGroup items={items} />;
  },
};

export const InlineCompactStates: Story = {
  name: "Inline Compact States",
  render: () => (
    <div style={{ display: "grid", gap: 16 }}>
      <IdsAlert
        display="inline"
        density="compact"
        severity="informational"
        message="Informational inline alert."
        dismissible
      />
      <IdsAlert
        display="inline"
        density="compact"
        severity="success"
        message="Success inline alert."
        dismissible
      />
      <IdsAlert
        display="inline"
        density="compact"
        severity="warning-minor"
        message="Warning minor inline alert."
        actionLabel="Resolve"
        dismissible
      />
      <IdsAlert
        display="inline"
        density="compact"
        severity="warning-major"
        message="Warning major inline alert."
        dismissible
      />
      <IdsAlert
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
  render: () => (
    <IdsAlert
      display="inline"
      density="detailed"
      severity="critical"
      title="Sync failed for workspace records"
      message="The latest sync attempt did not complete. Review connection settings and retry."
      linkLabel="Open diagnostics"
      linkHref="#"
      actionLabel="Retry sync"
      dismissible
    />
  ),
};

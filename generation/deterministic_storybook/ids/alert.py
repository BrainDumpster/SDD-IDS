from __future__ import annotations

from pathlib import Path
from typing import Optional

from generation.deterministic_storybook.helpers import prefixed_component_export_name
from generation.deterministic_storybook.models import DeterministicStorybookOptions
from validation.spec_contract_parser import SpecContract


def generate_ids_alert_story(
    *,
    repo_root: Path,
    story_path: Path,
    contract: SpecContract,
    options: Optional[DeterministicStorybookOptions] = None,
) -> str:
    options = options or DeterministicStorybookOptions()
    component_name = prefixed_component_export_name("alert", options.component_prefix)
    alert_import = "../../../../storybook/src/components/Alert"
    group_import = "../../../../storybook/src/components/AlertGroup"
    contract_import = "../../../../storybook/src/spec-contracts/ids-alert.contract"

    return f"""import type {{ Meta, StoryObj }} from "@storybook/react";
import {{ SPEC_ACCURATE_DESIGN_STORY }} from "{contract_import}";
import {{
  ALERT_SPEC_ACCURATE_DEFAULTS,
  AlertAction,
  AlertLink,
  AlertMessage,
  AlertTitle,
}} from "{contract_import}";
import {{
  Alert as {component_name},
  type AlertGlobalSeverity,
  type AlertInlineSeverity,
}} from "{alert_import}";
import {{ AlertGroup, AlertItem }} from "{group_import}";

type AlertControlArgs = {{
  display: "global" | "inline";
  severity?: string;
  density?: "compact" | "detailed";
  message?: string;
  title?: string;
  linkLabel?: string;
  linkHref?: string;
  actionLabel?: string;
  dismissible?: boolean;
}};

function renderAlertFromControls(args: AlertControlArgs) {{
  const messageSlot = args.message ? <AlertMessage>{{args.message}}</AlertMessage> : null;
  const globalSeverity = (
    args.severity === "success" ? "informational" : args.severity ?? "informational"
  ) as AlertGlobalSeverity;
  const inlineSeverity = (args.severity ?? "informational") as AlertInlineSeverity;

  if (args.display === "global") {{
    return (
      <{component_name}
        display="global"
        severity={{globalSeverity}}
        dismissible={{args.dismissible}}
        linkLabel={{args.linkLabel || undefined}}
        linkHref={{args.linkHref || undefined}}
        actionLabel={{args.actionLabel || undefined}}
      >
        {{messageSlot}}
      </{component_name}>
    );
  }}

  return (
    <{component_name}
      display="inline"
      severity={{inlineSeverity}}
      density={{args.density ?? "compact"}}
      title={{args.title || undefined}}
      dismissible={{args.dismissible}}
      linkLabel={{args.linkLabel || undefined}}
      linkHref={{args.linkHref || undefined}}
      actionLabel={{args.actionLabel || undefined}}
    >
      {{messageSlot}}
    </{component_name}>
  );
}}

const specAccurateArgs: AlertControlArgs = {{
  display: "inline",
  severity: "informational",
  density: "compact",
  message: ALERT_SPEC_ACCURATE_DEFAULTS.message,
  dismissible: true,
  title: "",
  linkLabel: "",
  linkHref: "",
  actionLabel: "",
}};

const meta: Meta<typeof {component_name}> = {{
  title: "{options.title_prefix}/Alert",
  component: {component_name},
  parameters: {{ layout: "padded" }},
  argTypes: {{
    display: {{ control: "select", options: ["global", "inline"] }},
    severity: {{
      control: "select",
      options: ["critical", "warning-major", "warning-minor", "informational", "success"],
    }},
    density: {{ control: "select", options: ["compact", "detailed"] }},
    message: {{ control: "text", name: "message (slot)" }},
    title: {{ control: "text" }},
    linkLabel: {{ control: "text" }},
    linkHref: {{ control: "text" }},
    actionLabel: {{ control: "text" }},
    dismissible: {{ control: "boolean" }},
  }},
  args: specAccurateArgs,
}};

export default meta;
type Story = StoryObj<typeof {component_name}>;

export const SpecAccurateDesign: Story = {{
  name: SPEC_ACCURATE_DESIGN_STORY,
  render: (args) => renderAlertFromControls(args as AlertControlArgs),
  args: specAccurateArgs,
}};

export const MultipleAlerts: Story = {{
  name: "Multiple Alerts (Global Carousel)",
  parameters: {{ layout: "fullscreen" }},
  render: () => (
    <AlertGroup defaultActiveIndex={{1}}>
      <AlertItem severity="critical">
        <AlertMessage>
          Critical outage: immediate action required in region us-east-1.
        </AlertMessage>
        <AlertLink label="View status page" href="#" />
        <AlertAction label="Retry" />
      </AlertItem>
      <AlertItem severity="warning-major">
        <AlertMessage>Major degradation detected for alerting service.</AlertMessage>
        <AlertLink label="Learn more" href="#" />
      </AlertItem>
      <AlertItem severity="warning-minor">
        <AlertMessage>Minor warning: configuration drift found in workspace sync.</AlertMessage>
      </AlertItem>
      <AlertItem severity="informational">
        <AlertMessage>
          Multiple active alerts are available. Review the alert center.
        </AlertMessage>
        <AlertLink label="Open alert center" href="#" />
        <AlertAction label="Acknowledge" />
      </AlertItem>
      <AlertItem severity="informational">
        <AlertMessage>Scheduled maintenance window starts at 02:00 UTC.</AlertMessage>
        <AlertLink label="Open schedule" href="#" />
      </AlertItem>
    </AlertGroup>
  ),
}};

export const InlineCompactStates: Story = {{
  render: () => (
    <div style={{{{ display: "grid", gap: 16 }}}}>
      <{component_name} display="inline" density="compact" severity="informational" dismissible>
        <AlertMessage>Informational inline alert.</AlertMessage>
      </{component_name}>
      <{component_name} display="inline" density="compact" severity="success" dismissible>
        <AlertMessage>Success inline alert.</AlertMessage>
      </{component_name}>
      <{component_name} display="inline" density="compact" severity="warning-minor" dismissible actionLabel="Resolve">
        <AlertMessage>Warning minor inline alert.</AlertMessage>
      </{component_name}>
      <{component_name} display="inline" density="compact" severity="critical" dismissible>
        <AlertMessage>Critical inline alert.</AlertMessage>
      </{component_name}>
    </div>
  ),
}};

export const InlineDetailedAllDetails: Story = {{
  render: () => (
    <{component_name} display="inline" density="detailed" severity="critical" dismissible>
      <AlertTitle>Sync failed for workspace records</AlertTitle>
      <AlertMessage>
        The latest sync attempt did not complete. Review connection settings and retry.
      </AlertMessage>
      <AlertLink label="Open diagnostics" href="#" />
      <AlertAction label="Retry sync" />
    </{component_name}>
  ),
}};

"""

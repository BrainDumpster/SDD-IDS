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
    import_path = "../../../../storybook/src/components/Alert"

    return f"""import type {{ Meta, StoryObj }} from "@storybook/react";
import {{ Alert as {component_name} }} from "{import_path}";

const meta: Meta<typeof {component_name}> = {{
  title: "{options.title_prefix}/Alert",
  component: {component_name},
  parameters: {{ layout: "padded" }},
  args: {{
    display: "global",
    severity: "critical",
    message: "Service interruption in region us-east-1.",
    dismissible: true,
  }},
  argTypes: {{
    display: {{ control: "select", options: ["global", "inline"] }},
    severity: {{
      control: "select",
      options: ["critical", "warning-major", "warning-minor", "informational", "success"],
    }},
    density: {{ control: "select", options: ["compact", "detailed"] }},
    message: {{ control: "text" }},
    title: {{ control: "text" }},
    linkLabel: {{ control: "text" }},
    linkHref: {{ control: "text" }},
    actionLabel: {{ control: "text" }},
    dismissible: {{ control: "boolean" }},
  }},
}};

export default meta;
type Story = StoryObj<typeof {component_name}>;

export const Playground: Story = {{
  render: (args) => <{component_name} {{...args}} />,
}};

export const GlobalSeverities: Story = {{
  render: () => (
    <div style={{{{ display: "grid", gap: 16 }}}}>
      <{component_name}
        display="global"
        severity="critical"
        message="Critical outage: immediate action required."
        linkLabel="View status page"
        linkHref="#"
        actionLabel="Retry"
        dismissible
      />
      <{component_name}
        display="global"
        severity="warning-major"
        message="Major degradation detected for alerting service."
        linkLabel="Learn more"
        linkHref="#"
        dismissible
      />
      <{component_name}
        display="global"
        severity="warning-minor"
        message="Minor warning: configuration drift found."
        dismissible
      />
      <{component_name}
        display="global"
        severity="informational"
        message="Informational maintenance notice."
        linkLabel="Open schedule"
        linkHref="#"
        dismissible
      />
    </div>
  ),
}};

export const GlobalCarouselScenario: Story = {{
  render: () => (
    <{component_name}
      display="global"
      severity="informational"
      message="Multiple active alerts are available."
      carousel={{{{ currentItem: 2, totalItems: 5 }}}}
      linkLabel="Open alert center"
      linkHref="#"
      actionLabel="Acknowledge"
      dismissible
    />
  ),
}};

export const InlineCompactStates: Story = {{
  render: () => (
    <div style={{{{ display: "grid", gap: 16 }}}}>
      <{component_name}
        display="inline"
        density="compact"
        severity="informational"
        message="Informational inline alert."
        dismissible
      />
      <{component_name}
        display="inline"
        density="compact"
        severity="success"
        message="Success inline alert."
        dismissible
      />
      <{component_name}
        display="inline"
        density="compact"
        severity="warning-minor"
        message="Warning minor inline alert."
        actionLabel="Resolve"
        dismissible
      />
      <{component_name}
        display="inline"
        density="compact"
        severity="critical"
        message="Critical inline alert."
        dismissible
      />
    </div>
  ),
}};

export const InlineDetailedAllDetails: Story = {{
  render: () => (
    <{component_name}
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
}};

"""

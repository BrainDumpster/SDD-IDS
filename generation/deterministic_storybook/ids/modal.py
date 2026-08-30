from __future__ import annotations

from pathlib import Path
from typing import Optional

from generation.deterministic_storybook.helpers import prefixed_component_export_name
from generation.deterministic_storybook.models import DeterministicStorybookOptions
from validation.spec_contract_parser import SpecContract


def generate_ids_modal_story(
    *,
    repo_root: Path,
    story_path: Path,
    contract: SpecContract,
    options: Optional[DeterministicStorybookOptions] = None,
) -> str:
    options = options or DeterministicStorybookOptions()
    component_name = prefixed_component_export_name("modal", options.component_prefix)
    dialog_import_path = "../../../../storybook/src/components/Dialog"
    button_import_path = "../../../../storybook/src/components/Button"
    tabs_import_path = "../../../../storybook/src/components/Tabs"

    return f"""import type {{ Meta, StoryObj }} from "@storybook/react";
import {{ Dialog as {component_name} }} from "{dialog_import_path}";
import {{ Button }} from "{button_import_path}";
import {{ Tabs }} from "{tabs_import_path}";

const meta: Meta<typeof {component_name}> = {{
  title: "{options.title_prefix}/Modal",
  component: {component_name},
  parameters: {{ layout: "centered" }},
}};

export default meta;
type Story = StoryObj<typeof {component_name}>;

function logEvent(name: string) {{
  return () => console.log(`[Dialog event] ${{name}}`);
}}

export const NonAlerting: Story = {{
  render: () => (
    <{component_name}
      trigger={{<Button>Open Dialog</Button>}}
      dialogTitle="Non-Alerting"
      dialogType="Non-Alerting"
      dialogSize="lg"
      dialogClosable
      openDidalog={{false}}
      description="Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint."
      primaryButtonName="Close"
      enableActionButton
      enableTertiaryButtton={{false}}
      onClose={{logEvent("onClose")}}
      onPrimaryButtonClick={{logEvent("onPrimaryButtonClick")}}
    />
  ),
}};

export const WarningAndCritical: Story = {{
  render: () => (
    <div style={{{{ display: "grid", gap: 16 }}}}>
      <{component_name}
        trigger={{<Button variant="secondary">Open Warning Dialog</Button>}}
        dialogTitle="Warning"
        dialogType="Warning"
        dialogSize="lg"
        dialogClosable
        openDidalog={{false}}
        description="Warning modal content."
        primaryButtonName="Continue"
        enableActionButton
        tertiaryButtonName="Cancel"
        enableTertiaryButtton
      />
      <{component_name}
        trigger={{<Button variant="secondary">Open Critical Dialog</Button>}}
        dialogTitle="Critical"
        dialogType="Critical"
        dialogSize="lg"
        dialogClosable
        openDidalog={{false}}
        description="Critical modal content."
        primaryButtonName="Continue"
        enableActionButton
        tertiaryButtonName="Cancel"
        enableTertiaryButtton
      />
    </div>
  ),
}};

export const SingleAndMultiPageUsage: Story = {{
  render: () => (
    <div style={{{{ display: "grid", gap: 16 }}}}>
      <{component_name}
        trigger={{<Button variant="secondary">Open Single-Page Modal</Button>}}
        dialogTitle="Header"
        dialogType="Non-Alerting"
        dialogSize="xl"
        dialogClosable
        openDidalog={{false}}
        description="Single-page modal usage."
        primaryButtonName="Apply"
        enableActionButton
        tertiaryButtonName="Cancel"
        enableTertiaryButtton
      >
        <div style={{{{ minHeight: 120, border: "1px solid var(--color-border-brand-base)", background: "var(--color-background-brand-lighter-slate)", padding: 16 }}}}>
          single page modal swap content
        </div>
      </{component_name}>
      <{component_name}
        trigger={{<Button variant="secondary">Open Multi-Page Modal</Button>}}
        dialogTitle="Header"
        dialogType="Non-Alerting"
        dialogSize="xl"
        dialogClosable
        openDidalog={{false}}
        description="multi page modal usage with tabs/pages"
        primaryButtonName="Apply"
        enableActionButton
        tertiaryButtonName="Cancel"
        enableTertiaryButtton
      >
        <Tabs
          variant="secondary"
          items={{[
            {{ id: "summary", label: "Summary", panel: <div style={{{{ padding: 8 }}}}>Summary content</div> }},
            {{ id: "details", label: "Details", panel: <div style={{{{ padding: 8 }}}}>Details content</div> }},
            {{ id: "activity", label: "Activity", panel: <div style={{{{ padding: 8 }}}}>Activity content</div> }},
          ]}}
          showAddTab={{false}}
          minTabWidth={{80}}
          maxTabWidth={{220}}
          moreLabel="More"
        />
      </{component_name}>
    </div>
  ),
}};
"""

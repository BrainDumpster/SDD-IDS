from __future__ import annotations

from pathlib import Path
from typing import Optional

from generation.deterministic_storybook.helpers import prefixed_component_export_name
from generation.deterministic_storybook.models import DeterministicStorybookOptions
from validation.spec_contract_parser import SpecContract


def generate_ids_wizard_story(
    *,
    repo_root: Path,
    story_path: Path,
    contract: SpecContract,
    options: Optional[DeterministicStorybookOptions] = None,
) -> str:
    options = options or DeterministicStorybookOptions()
    component_name = prefixed_component_export_name("wizard", options.component_prefix)
    import_path = "../../../../storybook/src/components/IdsWizard"
    button_import_path = "../../../../storybook/src/components/Button"

    return f"""import type {{ Meta, StoryObj }} from "@storybook/react";
import {{ useCallback, useState }} from "react";
import {{ IdsWizard as {component_name}, type IdsWizardStep }} from "{import_path}";
import {{ Button }} from "{button_import_path}";

const meta: Meta<typeof {component_name}> = {{
  title: "{options.title_prefix}/Wizard",
  component: {component_name},
  parameters: {{ layout: "fullscreen" }},
}};

export default meta;
type Story = StoryObj<typeof {component_name}>;

const baseStepContentStyle = {{
  border: "1px solid var(--color-border-brand-base)",
  background: "var(--color-background-brand-lighter-slate)",
  padding: 16,
  minHeight: 120,
  color: "var(--color-text-gray-neutral)",
}} as const;

export const InlineDefault: Story = {{
  render: () => {{
    const [lastEvent, setLastEvent] = useState("No event");
    const steps: IdsWizardStep[] = [
      {{ id: "welcome", label: "Welcome", pageTitle: "Welcome", content: <div style={{baseStepContentStyle}}>Intro page content.</div>, status: "success" }},
      {{ id: "configure", label: "Configure", pageTitle: "Configure", content: <div style={{baseStepContentStyle}}>Configuration content.</div>, status: "warning" }},
      {{ id: "review", label: "Review", pageTitle: "Review", content: <div style={{baseStepContentStyle}}>Review content.</div>, status: "error" }},
      {{ id: "finish", label: "Finish", pageTitle: "Finish", content: <div style={{baseStepContentStyle}}>Final content.</div>, status: "success" }},
    ];
    const handleStepChange = useCallback((evt: {{ stepCode: string; stepId: string }}) => setLastEvent(`step change ${{evt.stepCode}} (${{evt.stepId}})`), []);
    return (
      <div style={{{{ padding: 24, background: "var(--color-background-surface-primary)", minHeight: 700 }}}}>
        <{component_name}
          mode="inline"
          size="large"
          steps={{steps}}
          onStepChange={{handleStepChange}}
        />
        <p style={{{{ marginTop: 16, color: "var(--color-text-gray-neutral-strong)" }}}}>Last event: {{lastEvent}}</p>
      </div>
    );
  }},
}};

export const ModalMode: Story = {{
  render: () => {{
    const [lastEvent, setLastEvent] = useState("No event");
    const steps: IdsWizardStep[] = [
      {{ id: "m1", label: "Step One", pageTitle: "Modal Step One", content: <div style={{baseStepContentStyle}}>Simple modal page content.</div> }},
      {{ id: "m2", label: "Step Two", pageTitle: "Modal Step Two", content: <div style={{baseStepContentStyle}}>Simple modal page content.</div> }},
    ];
    return (
      <div style={{{{ padding: 24, minHeight: 300 }}}}>
        <{component_name}
          mode="modal"
          size="medium"
          trigger={{<Button>Open Wizard</Button>}}
          steps={{steps}}
          onCancel={{(evt) => setLastEvent(`cancel ${{evt.stepCode}}`) }}
          onNext={{(evt) => setLastEvent(`next ${{evt.stepCode}}`) }}
          onFinish={{(evt) => setLastEvent(`finish ${{evt.stepCode}}`) }}
        />
        <p style={{{{ marginTop: 16 }}}}>Last event: {{lastEvent}}</p>
      </div>
    );
  }},
}};
"""

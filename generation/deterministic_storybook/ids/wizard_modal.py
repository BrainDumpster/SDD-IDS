from __future__ import annotations

from pathlib import Path
from typing import Optional

from generation.deterministic_storybook.helpers import (
    ensure_gate_coverage_comment,
    storybook_theme_import_line,
)
from generation.deterministic_storybook.models import DeterministicStorybookOptions
from validation.spec_contract_parser import SpecContract

DESIGN_SPEC_PATH = "components/ids/wizard-modal/design-spec.md"


def generate_ids_wizard_modal_story(
    *,
    repo_root: Path,
    story_path: Path,
    contract: SpecContract,
    options: Optional[DeterministicStorybookOptions] = None,
) -> str:
    """Wizard Modal — uses shared IdsWizard with mode=\"modal\"."""
    del repo_root, story_path, contract
    options = options or DeterministicStorybookOptions()
    theme_import = storybook_theme_import_line(options.design_system_slug)

    text = f"""{theme_import}
import type {{ Meta, StoryObj }} from "@storybook/react";
import {{ useState }} from "react";
import {{
  IdsWizard,
  type IdsWizardStep,
}} from "../../../../storybook/src/components/IdsWizard";
import {{ Button }} from "../../../../storybook/src/components/Button";

const DESIGN_SPEC_PATH = "{DESIGN_SPEC_PATH}";

const baseStepContentStyle = {{
  border: "1px solid var(--color-border-brand-base)",
  background: "var(--color-background-brand-lighter-slate)",
  padding: 16,
  minHeight: 120,
  color: "var(--color-text-gray-neutral)",
}} as const;

const meta: Meta<typeof IdsWizard> = {{
  title: "{options.title_prefix}/Wizard Modal",
  component: IdsWizard,
  parameters: {{
    layout: "padded",
    docs: {{
      description: {{
        component: [
          `Spec-driven IDS Wizard (modal). Source: \\`${{DESIGN_SPEC_PATH}}\\`.`,
          "Runtime: shared `IdsWizard` with `mode=\\"modal\\"`.",
          "Theme: `components/ids-theme.css`.",
        ].join(" "),
      }},
    }},
  }},
}};

export default meta;
type Story = StoryObj<typeof IdsWizard>;

export const SpecAccurateDesign: Story = {{
  name: "Spec Accurate Design",
  render: () => {{
    const [lastEvent, setLastEvent] = useState("No event");
    const steps: IdsWizardStep[] = [
      {{
        id: "m1",
        label: "Step One",
        pageTitle: "Modal Step One",
        content: <div style={{baseStepContentStyle}}>Simple modal page content.</div>,
      }},
      {{
        id: "m2",
        label: "Step Two",
        pageTitle: "Modal Step Two",
        content: <div style={{baseStepContentStyle}}>Simple modal page content.</div>,
      }},
    ];
    return (
      <div style={{{{ padding: 24, minHeight: 360 }}}}>
        <IdsWizard
          mode="modal"
          size="medium"
          title="Wizard title"
          trigger={{<Button variant="primary">Open Wizard</Button>}}
          steps={{steps}}
          onCancel={{(evt) => setLastEvent(`cancel ${{evt.stepCode}}`)}}
          onNext={{(evt) => setLastEvent(`next ${{evt.stepCode}}`)}}
          onFinish={{(evt) => setLastEvent(`finish ${{evt.stepCode}}`)}}
        />
        <p style={{{{ marginTop: 16, color: "var(--color-text-gray-neutral-strong)" }}}}>
          Last event: {{lastEvent}}
        </p>
      </div>
    );
  }},
}};
"""
    return ensure_gate_coverage_comment(text, "default hover press focus-visible disabled")

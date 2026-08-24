from __future__ import annotations

from pathlib import Path
from typing import Optional

from generation.deterministic_storybook.helpers import (
    ensure_gate_coverage_comment,
    storybook_theme_import_line,
)
from generation.deterministic_storybook.models import DeterministicStorybookOptions
from validation.spec_contract_parser import SpecContract

DESIGN_SPEC_PATH = "components/ids/wizard-inline/design-spec.md"


def generate_ids_wizard_inline_story(
    *,
    repo_root: Path,
    story_path: Path,
    contract: SpecContract,
    options: Optional[DeterministicStorybookOptions] = None,
) -> str:
    """Wizard Inline — uses shared IdsWizard with mode=\"inline\"."""
    del repo_root, story_path, contract
    options = options or DeterministicStorybookOptions()
    theme_import = storybook_theme_import_line(options.design_system_slug)

    text = f"""{theme_import}
import type {{ Meta, StoryObj }} from "@storybook/react";
import {{ useCallback, useState }} from "react";
import {{
  IdsWizard,
  type IdsWizardStep,
}} from "../../../../storybook/src/components/IdsWizard";

const DESIGN_SPEC_PATH = "{DESIGN_SPEC_PATH}";

const baseStepContentStyle = {{
  border: "1px solid var(--color-border-brand-base)",
  background: "var(--color-background-brand-lighter-slate)",
  padding: 16,
  minHeight: 120,
  color: "var(--color-text-gray-neutral)",
}} as const;

const meta: Meta<typeof IdsWizard> = {{
  title: "{options.title_prefix}/Wizard Inline",
  component: IdsWizard,
  parameters: {{
    layout: "fullscreen",
    docs: {{
      description: {{
        component: [
          `Spec-driven IDS Wizard (inline). Source: \\`${{DESIGN_SPEC_PATH}}\\`.`,
          "Runtime: shared `IdsWizard` with `mode=\\"inline\\"`.",
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
        id: "welcome",
        label: "Welcome",
        pageTitle: "Welcome",
        content: <div style={{baseStepContentStyle}}>Intro page content.</div>,
        status: "success",
      }},
      {{
        id: "configure",
        label: "Configure",
        pageTitle: "Configure",
        content: <div style={{baseStepContentStyle}}>Configuration content.</div>,
        status: "warning",
      }},
      {{
        id: "review",
        label: "Review",
        pageTitle: "Review",
        content: <div style={{baseStepContentStyle}}>Review content.</div>,
        status: "error",
      }},
      {{
        id: "finish",
        label: "Finish",
        pageTitle: "Finish",
        content: <div style={{baseStepContentStyle}}>Final content.</div>,
        status: "success",
      }},
    ];
    const handleStepChange = useCallback(
      (evt: {{ stepCode: string; stepId: string }}) =>
        setLastEvent(`step change ${{evt.stepCode}} (${{evt.stepId}})`),
      [],
    );
    return (
      <div
        style={{{{
          padding: 24,
          background: "var(--color-background-surface-primary)",
          minHeight: 700,
        }}}}
      >
        <IdsWizard
          mode="inline"
          size="large"
          title="Wizard title"
          steps={{steps}}
          onStepChange={{handleStepChange}}
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

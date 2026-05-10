from __future__ import annotations

from pathlib import Path
from typing import Optional

from generation.deterministic_storybook.helpers import prefixed_component_export_name
from generation.deterministic_storybook.models import DeterministicStorybookOptions
from validation.spec_contract_parser import SpecContract


def generate_ids_slider_story(
    *,
    repo_root: Path,
    story_path: Path,
    contract: SpecContract,
    options: Optional[DeterministicStorybookOptions] = None,
) -> str:
    options = options or DeterministicStorybookOptions()
    component_name = prefixed_component_export_name("slider", options.component_prefix)
    import_path = "../../../../storybook/src/components/IdsSlider"

    return f"""import type {{ Meta, StoryObj }} from "@storybook/react";
import {{ IdsSlider as {component_name} }} from "{import_path}";

const meta: Meta<typeof {component_name}> = {{
  title: "{options.title_prefix}/Slider",
  component: {component_name},
  parameters: {{ layout: "centered" }},
  argTypes: {{
    min: {{ control: "number" }},
    max: {{ control: "number" }},
    step: {{ control: "number" }},
    disabled: {{ control: "boolean" }},
    showStepper: {{ control: "boolean" }},
    showValueLabel: {{ control: "boolean" }},
  }},
}};

export default meta;
type Story = StoryObj<typeof {component_name}>;

export const DefaultNoStepper: Story = {{
  args: {{
    mode: "single",
    min: 0,
    max: 100,
    defaultValue: 50,
    minLabel: "0",
    maxLabel: "100",
    showStepper: false,
    showValueLabel: true,
  }},
}};

export const DefaultWithStepper: Story = {{
  args: {{
    mode: "single",
    min: 0,
    max: 100,
    defaultValue: 50,
    minLabel: "0",
    maxLabel: "100",
    showStepper: true,
    stepperFrequency: 10,
    showValueLabel: true,
  }},
}};

export const DisabledWithAndWithoutStepper: Story = {{
  render: () => (
    <div style={{{{ display: "grid", gap: 16, maxWidth: 360 }}}}>
      <{component_name} min={{0}} max={{100}} defaultValue={{50}} disabled showStepper={{false}} />
      <{component_name} min={{0}} max={{100}} defaultValue={{50}} disabled showStepper stepperFrequency={{10}} />
    </div>
  ),
}};

export const RangeWithInputsAndSteppers: Story = {{
  args: {{
    mode: "range",
    min: 0,
    max: 100,
    defaultValue: [25, 75],
    minLabel: "0",
    maxLabel: "100",
    showStepper: true,
    stepperFrequency: 10,
    showValueLabel: true,
    showValueInput: true,
  }},
}};
"""

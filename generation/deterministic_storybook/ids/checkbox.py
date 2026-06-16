from __future__ import annotations

from pathlib import Path
from typing import Optional

from generation.deterministic_storybook.helpers import pascal_from_slug, prefixed_component_export_name
from generation.deterministic_storybook.models import DeterministicStorybookOptions
from validation.spec_contract_parser import SpecContract


def generate_ids_checkbox_story(
    *,
    repo_root: Path,
    story_path: Path,
    contract: SpecContract,
    options: Optional[DeterministicStorybookOptions] = None,
) -> str:
    options = options or DeterministicStorybookOptions()
    component_name = prefixed_component_export_name("checkbox", options.component_prefix)
    import_path = "../../../../storybook/src/components/Checkbox"
    # Story module exports `Checkbox`, not `Ids…` / `IdsAi…` / `IDSAI…` prefixed names.
    source_export = pascal_from_slug("checkbox")

    return f"""import type {{ Meta, StoryObj }} from "@storybook/react";
import {{ useState }} from "react";
import {{ {source_export} as {component_name} }} from "{import_path}";

const meta: Meta<typeof {component_name}> = {{
  title: "{options.title_prefix}/Checkbox",
  component: {component_name},
  parameters: {{ layout: "centered" }},
  argTypes: {{
    disabled: {{ control: "boolean" }},
    indeterminate: {{ control: "boolean" }},
    error: {{ control: "boolean" }},
    helperText: {{ control: "text" }},
    label: {{ control: "text" }},
  }},
  args: {{
    label: "Accept terms and conditions",
    disabled: false,
    indeterminate: false,
    error: false,
  }},
}};

export default meta;
type Story = StoryObj<typeof {component_name}>;

export const Playground: Story = {{
  render: (args) => <{component_name} {{...args}} />,
}};

export const SelectionStates: Story = {{
  render: () => (
    <div className="sbCheckboxRow">
      <{component_name} label="Unchecked" />
      <{component_name} label="Checked" checked />
      <{component_name} label="Indeterminate" indeterminate />
    </div>
  ),
}};

export const DisabledStates: Story = {{
  render: () => (
    <div className="sbCheckboxRow">
      <{component_name} label="Unchecked" disabled />
      <{component_name} label="Checked" checked disabled />
      <{component_name} label="Indeterminate" indeterminate disabled />
    </div>
  ),
}};

export const ValidationAndHelperText: Story = {{
  render: () => (
    <div className="sbCheckboxCol">
      <{component_name} label="Email notifications" helperText="Receive weekly summary updates." />
      <{component_name} label="Required acknowledgement" error helperText="You must accept this option to continue." />
      <{component_name} label="Disabled option" disabled helperText="This option is unavailable for your role." />
    </div>
  ),
}};

export const ControlledExample: Story = {{
  render: () => {{
    const [checked, setChecked] = useState(false);
    return (
      <div className="sbCheckboxCol">
        <{component_name}
          label="Controlled checkbox"
          checked={{checked}}
          helperText={{`Current value: ${{checked ? "checked" : "unchecked"}}`}}
          onChange={{setChecked}}
        />
      </div>
    );
  }},
}};

export const StateHarness: Story = {{
  render: () => (
    <div className="sbHarness">
      <div className="sbHarnessLegend">Interaction references: default | hover | focus-visible | disabled</div>

      <div className="sbHarnessTitle">Unchecked</div>
      <div className="sbHarnessControl"><{component_name} label="Default" /></div>
      <div className="sbHarnessControl"><{component_name} label="Error" error /></div>
      <div className="sbHarnessControl"><{component_name} label="Disabled" disabled /></div>

      <div className="sbHarnessTitle">Checked</div>
      <div className="sbHarnessControl"><{component_name} label="Default" checked /></div>
      <div className="sbHarnessControl"><{component_name} label="Error (selected uses selected tokens)" checked error /></div>
      <div className="sbHarnessControl"><{component_name} label="Disabled" checked disabled /></div>

      <div className="sbHarnessTitle">Indeterminate</div>
      <div className="sbHarnessControl"><{component_name} label="Default" indeterminate /></div>
      <div className="sbHarnessControl"><{component_name} label="Error (mixed uses mixed tokens)" indeterminate error /></div>
      <div className="sbHarnessControl"><{component_name} label="Disabled" indeterminate disabled /></div>
    </div>
  ),
}};

export const LayoutTokens: Story = {{
  render: () => (
    <style>{{
      `
      .sbCheckboxRow {{
        display: flex;
        gap: 24px;
        flex-wrap: wrap;
      }}
      .sbCheckboxCol {{
        display: grid;
        gap: 16px;
      }}
      .sbHarness {{
        display: grid;
        grid-template-columns: 132px repeat(3, minmax(160px, max-content));
        gap: 16px 28px;
        align-items: start;
      }}
      .sbHarnessLegend {{
        grid-column: 1 / -1;
        font-size: 13px;
        line-height: 20px;
        margin-bottom: 4px;
      }}
      .sbHarnessTitle {{
        font-size: 12px;
        opacity: 0.8;
        padding-top: 4px;
      }}
      .sbHarnessControl {{
        padding-right: 8px;
      }}
      `
    }}</style>
  ),
}};
"""

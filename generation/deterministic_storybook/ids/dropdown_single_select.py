from __future__ import annotations

from pathlib import Path
from typing import Optional

from generation.deterministic_storybook.helpers import prefixed_component_export_name
from generation.deterministic_storybook.models import DeterministicStorybookOptions
from validation.spec_contract_parser import SpecContract


def generate_ids_dropdown_single_select_story(
    *,
    repo_root: Path,
    story_path: Path,
    contract: SpecContract,
    options: Optional[DeterministicStorybookOptions] = None,
) -> str:
    options = options or DeterministicStorybookOptions()
    component_name = prefixed_component_export_name("dropdown-single-select", options.component_prefix)
    import_path = "../../../../storybook/src/components/DropdownMenu"

    return f"""import type {{ Meta, StoryObj }} from "@storybook/react";
import {{ useMemo, useState }} from "react";
import {{ DropdownMenu as {component_name} }} from "{import_path}";

type Option = {{ id: string; label: string; disabled?: boolean }};

const options: Option[] = [
  {{ id: "o1", label: "Option 1" }},
  {{ id: "o2", label: "Option 2" }},
  {{ id: "o3", label: "Option 3", disabled: true }},
  {{ id: "o4", label: "Option 4" }},
  {{ id: "o5", label: "Option 5" }},
];

const meta: Meta<typeof {component_name}> = {{
  title: "{options.title_prefix}/Dropdown Single Select",
  component: {component_name},
  parameters: {{ layout: "centered" }},
  argTypes: {{
    showSingleSelectRadio: {{ control: "boolean" }},
  }},
}};

export default meta;
type Story = StoryObj<typeof {component_name}>;

function Trigger({{ value, placeholder = "Select", disabled = false, error = false }}: {{
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
}}) {{
  return (
    <div
      style={{{{
        width: 300,
        padding: "10px 16px",
        border: `1px solid ${{error ? "var(--color-border-alerting-critical-base)" : "var(--color-border-gray-neutral-base)"}}`,
        background: disabled ? "var(--color-background-gray-light)" : "var(--color-background-surface-component)",
        color: disabled ? "var(--color-text-gray-disabled)" : "var(--color-text-gray-neutral)",
        boxSizing: "border-box",
      }}}}
    >
      {{value ?? placeholder}}
    </div>
  );
}}

export const Playground: Story = {{
  args: {{ showSingleSelectRadio: true }},
  render: (args) => {{
    const [selected, setSelected] = useState("Option 2");
    const items = useMemo(
      () =>
        options.map((option) => ({{
          id: option.id,
          value: option.label,
          label: option.label,
          selectable: true,
          disabled: option.disabled,
          onClick: () => !option.disabled && setSelected(option.label),
        }})),
      [],
    );
    return (
      <{component_name}
        trigger={{<Trigger value={{selected}} />}}
        items={{items}}
        selectionMode="single"
        selectedValues={{[selected]}}
        showSingleSelectRadio={{args.showSingleSelectRadio}}
        defaultOpen
        maxHeight={{220}}
      />
    );
  }},
}};

export const States: Story = {{
  args: {{ showSingleSelectRadio: true }},
  render: (args) => (
    <div style={{{{ display: "grid", gap: 16, width: 320 }}}}>
      <{component_name}
        trigger={{<Trigger value="Option 2" />}}
        items={{options.map((o) => ({{ id: o.id, value: o.label, label: o.label, selectable: true, disabled: o.disabled }}))}}
        selectionMode="single"
        selectedValues={{["Option 2"]}}
        showSingleSelectRadio={{args.showSingleSelectRadio}}
      />
      <{component_name}
        trigger={{<Trigger value="Option 2" disabled />}}
        items={{options.map((o) => ({{ id: o.id, value: o.label, label: o.label, selectable: true, disabled: o.disabled }}))}}
        selectionMode="single"
        selectedValues={{["Option 2"]}}
        showSingleSelectRadio={{args.showSingleSelectRadio}}
        disabled
      />
      <{component_name}
        trigger={{<Trigger placeholder="-Type or Select-" error />}}
        items={{options.map((o) => ({{ id: o.id, value: o.label, label: o.label, selectable: true, disabled: o.disabled }}))}}
        selectionMode="single"
        showSingleSelectRadio={{args.showSingleSelectRadio}}
      />
    </div>
  ),
}};
"""

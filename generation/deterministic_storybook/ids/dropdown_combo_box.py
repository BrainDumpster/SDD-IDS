from __future__ import annotations

from pathlib import Path
from typing import Optional

from generation.deterministic_storybook.helpers import prefixed_component_export_name
from generation.deterministic_storybook.models import DeterministicStorybookOptions
from validation.spec_contract_parser import SpecContract


def generate_ids_dropdown_combo_box_story(
    *,
    repo_root: Path,
    story_path: Path,
    contract: SpecContract,
    options: Optional[DeterministicStorybookOptions] = None,
) -> str:
    options = options or DeterministicStorybookOptions()
    component_name = prefixed_component_export_name("dropdown-combo-box", options.component_prefix)
    import_path = "../../../../storybook/src/components/DropdownMenu"
    trigger_shell_import_path = "../../../../storybook/src/components/IdsDropdownTriggerShell"

    return f"""import React from "react";
import "../../../../components/ids-theme.css";
import type {{ Meta, StoryObj }} from "@storybook/react";
import {{ useMemo, useState }} from "react";
import {{ DropdownMenu as {component_name} }} from "{import_path}";
import {{ IdsDropdownTriggerShell }} from "{trigger_shell_import_path}";

const meta: Meta<typeof {component_name}> = {{
  title: "{options.title_prefix}/Dropdown/Combo Box",
  component: {component_name},
  parameters: {{ layout: "centered" }},
}};

export default meta;
type Story = StoryObj<typeof {component_name}>;

const options = [
  {{ id: "app-1", label: "Storage" }},
  {{ id: "app-2", label: "Compute" }},
  {{ id: "app-3", label: "Network" }},
  {{ id: "app-4", label: "Security" }},
];

function Trigger({{ value, placeholder = "-Select-" }}: {{ value?: string; placeholder?: string }}) {{
  return (
    <IdsDropdownTriggerShell
      filled={{Boolean(value)}}
      left={{
        <span style={{{{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}}}>
          {{value || placeholder}}
        </span>
      }}
    />
  );
}}

export const SingleSelectContract: Story = {{
  render: () => {{
    const [selected, setSelected] = useState("Compute");
    const items = useMemo(
      () =>
        options.map((option) => ({{
          id: option.id,
          value: option.label,
          label: option.label,
          selectable: true,
          onClick: () => setSelected(option.label),
        }})),
      [],
    );
    return (
      <div style={{{{ width: 300, display: "grid", gap: 8 }}}}>
        <{component_name}
          selectionMode="single"
          selectedValues={{[selected]}}
          trigger={{<Trigger value={{selected}} />}}
          items={{items}}
          showSearch
          matchTriggerWidth
          defaultOpen
        />
      </div>
    );
  }},
}};

export const MultiSelectContract: Story = {{
  render: () => {{
    const [selected, setSelected] = useState<string[]>(["Storage", "Compute"]);
    const items = useMemo(
      () =>
        options.map((option) => ({{
          id: option.id,
          value: option.label,
          label: option.label,
          selectable: true,
          onClick: () =>
            setSelected((prev) =>
              prev.includes(option.label)
                ? prev.filter((entry) => entry !== option.label)
                : [...prev, option.label],
            ),
        }})),
      [],
    );
    return (
      <div style={{{{ width: 300, display: "grid", gap: 8 }}}}>
        <{component_name}
          selectionMode="multi"
          selectedValues={{selected}}
          trigger={{<Trigger value={{selected.join(", ")}} placeholder="-Select-" />}}
          items={{items}}
          showSearch
          matchTriggerWidth
          defaultOpen
        />
      </div>
    );
  }},
}};
"""

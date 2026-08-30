from __future__ import annotations

from pathlib import Path
from typing import Optional

from generation.deterministic_storybook.helpers import prefixed_component_export_name
from generation.deterministic_storybook.models import DeterministicStorybookOptions
from validation.spec_contract_parser import SpecContract


def generate_ids_dropdown_multiselect_story(
    *,
    repo_root: Path,
    story_path: Path,
    contract: SpecContract,
    options: Optional[DeterministicStorybookOptions] = None,
) -> str:
    options = options or DeterministicStorybookOptions()
    component_name = prefixed_component_export_name("dropdown-multiselect", options.component_prefix)
    import_path = "../../../../storybook/src/components/DropdownMenu"
    trigger_shell_import_path = "../../../../storybook/src/components/IdsDropdownTriggerShell"

    return f"""import type {{ Meta, StoryObj }} from "@storybook/react";
import {{ useMemo, useState }} from "react";
import {{ DropdownMenu as {component_name} }} from "{import_path}";
import {{ IdsDropdownTriggerShell }} from "{trigger_shell_import_path}";

type Option = {{ id: string; label: string; disabled?: boolean }};

const options: Option[] = [
  {{ id: "o1", label: "Option 1" }},
  {{ id: "o2", label: "Option 2" }},
  {{ id: "o3", label: "Option 3", disabled: true }},
  {{ id: "o4", label: "Option 4" }},
  {{ id: "o5", label: "Option 5" }},
  {{ id: "o6", label: "Option 6" }},
];

const meta: Meta<typeof {component_name}> = {{
  title: "{options.title_prefix}/Dropdown Multi Select",
  component: {component_name},
  parameters: {{ layout: "centered" }},
}};

export default meta;
type Story = StoryObj<typeof {component_name}>;

function Trigger({{ selected, disabled = false }}: {{ selected: string[]; disabled?: boolean }}) {{
  const text = selected.length ? selected.join(", ") : "-Select-";
  return (
    <IdsDropdownTriggerShell
      disabled={{disabled}}
      filled={{selected.length > 0}}
      left={{
        <span style={{{{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}}}>
          {{text}}
        </span>
      }}
    />
  );
}}

export const Playground: Story = {{
  render: () => {{
    const [selected, setSelected] = useState<string[]>(["Option 2"]);
    const items = useMemo(
      () =>
        options.map((option) => ({{
          id: option.id,
          value: option.label,
          label: option.label,
          selectable: true,
          disabled: option.disabled,
          onClick: () => {{
            if (option.disabled) return;
            setSelected((prev) =>
              prev.includes(option.label)
                ? prev.filter((entry) => entry !== option.label)
                : [...prev, option.label],
            );
          }},
        }})),
      [],
    );
    const enabled = options.filter((option) => !option.disabled).map((option) => option.label);
    const selectedEnabled = enabled.filter((label) => selected.includes(label)).length;
    const selectAllChecked = enabled.length > 0 && selectedEnabled == enabled.length;
    const selectAllIndeterminate = selectedEnabled > 0 && selectedEnabled < enabled.length;
    return (
      <{component_name}
        trigger={{<Trigger selected={{selected}} />}}
        items={{items}}
        selectionMode="multi"
        selectedValues={{selected}}
        showSelectAllClearAll
        selectAllChecked={{selectAllChecked}}
        selectAllIndeterminate={{selectAllIndeterminate}}
        onSelectAllClick={{() => setSelected(enabled)}}
        onClearAllClick={{() => setSelected([])}}
        clearAllDisabled={{selected.length === 0}}
        defaultOpen
      />
    );
  }},
}};

export const Disabled: Story = {{
  render: () => (
    <{component_name}
      trigger={{<Trigger selected={{["Option 2", "Option 4"]}} disabled />}}
      items={{options.map((o) => ({{ id: o.id, value: o.label, label: o.label, selectable: true, disabled: o.disabled }}))}}
      selectionMode="multi"
      selectedValues={{["Option 2", "Option 4"]}}
      disabled
    />
  ),
}};

export const Overflowing: Story = {{
  render: () => {{
    const [selected, setSelected] = useState<string[]>(["Option 10"]);
    const manyOptions = Array.from({{ length: 12 }}, (_, index) => ({{
      id: `o${{index + 1}}`,
      label: `Option ${{index + 1}}`,
    }}));
    const items = manyOptions.map((option) => ({{
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
    }}));
    return (
      <{component_name}
        trigger={{<Trigger selected={{selected}} />}}
        items={{items}}
        selectionMode="multi"
        selectedValues={{selected}}
        defaultOpen
      />
    );
  }},
}};

export const Sectioned: Story = {{
  render: () => {{
    const [selected, setSelected] = useState<string[]>(["Option 2"]);
    const items = [
      {{ id: "h-1", label: "Section Title", kind: "section" as const }},
      ...options.slice(0, 3).map((option) => ({{
        id: option.id,
        value: option.label,
        label: option.label,
        selectable: true,
        disabled: option.disabled,
        onClick: () =>
          !option.disabled &&
          setSelected((prev) =>
            prev.includes(option.label)
              ? prev.filter((entry) => entry !== option.label)
              : [...prev, option.label],
          ),
      }})),
      {{ id: "h-2", label: "Section Title", kind: "section" as const }},
      ...options.slice(3).map((option) => ({{
        id: option.id,
        value: option.label,
        label: option.label,
        selectable: true,
        disabled: option.disabled,
        onClick: () =>
          !option.disabled &&
          setSelected((prev) =>
            prev.includes(option.label)
              ? prev.filter((entry) => entry !== option.label)
              : [...prev, option.label],
          ),
      }})),
    ];
    return (
      <{component_name}
        trigger={{<Trigger selected={{selected}} />}}
        items={{items}}
        selectionMode="multi"
        selectedValues={{selected}}
        defaultOpen
      />
    );
  }},
}};

export const WithAction: Story = {{
  render: () => {{
    const [selected, setSelected] = useState<string[]>(["Option 2"]);
    const [actionEvent, setActionEvent] = useState("none");
    const items = options.map((option) => ({{
      id: option.id,
      value: option.label,
      label: option.label,
      selectable: true,
      disabled: option.disabled,
      onClick: () =>
        !option.disabled &&
        setSelected((prev) =>
          prev.includes(option.label)
            ? prev.filter((entry) => entry !== option.label)
            : [...prev, option.label],
        ),
    }}));
    return (
      <div style={{{{ display: "grid", gap: 8 }}}}>
        <{component_name}
          trigger={{<Trigger selected={{selected}} />}}
          items={{items}}
          selectionMode="multi"
          selectedValues={{selected}}
          footerActionLabel="Action"
          onFooterActionClick={{() => setActionEvent("action clicked")}}
          defaultOpen
        />
        <div style={{{{ fontSize: 12 }}}}>with-action: {{actionEvent}}</div>
      </div>
    );
  }},
}};

export const StateHarness: Story = {{
  render: () => (
    <div style={{{{ display: "grid", gap: 8, width: 320 }}}}>
      <div style={{{{ fontSize: 12 }}}}>hover</div>
      <div style={{{{ fontSize: 12 }}}}>focus-visible</div>
      <{component_name}
        trigger={{<Trigger selected={{["Option 2"]}} />}}
        items={{options.map((o) => ({{ id: o.id, value: o.label, label: o.label, selectable: true, disabled: o.disabled }}))}}
        selectionMode="multi"
        selectedValues={{["Option 2"]}}
      />
    </div>
  ),
}};
"""

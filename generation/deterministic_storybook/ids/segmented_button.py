from __future__ import annotations

from pathlib import Path
from typing import Optional

from generation.deterministic_storybook.helpers import prefixed_component_export_name
from generation.deterministic_storybook.models import DeterministicStorybookOptions
from validation.spec_contract_parser import SpecContract


def generate_ids_segmented_button_story(
    *,
    repo_root: Path,
    story_path: Path,
    contract: SpecContract,
    options: Optional[DeterministicStorybookOptions] = None,
) -> str:
    options = options or DeterministicStorybookOptions()
    component_name = prefixed_component_export_name("segmented-button", options.component_prefix)
    import_path = "../../../../storybook/src/components/SegmentedButton"

    return f"""import {{ useState }} from "react";
import type {{ Meta, StoryObj }} from "@storybook/react";
import {{ SegmentedButton as {component_name} }} from "{import_path}";

const meta: Meta<typeof {component_name}> = {{
  title: "{options.title_prefix}/Segmented Button",
  component: {component_name},
  parameters: {{ layout: "centered" }},
}};

export default meta;
type Story = StoryObj<typeof {component_name}>;

export const TextTwoOptions: Story = {{
  render: () => {{
    const [value, setValue] = useState("daily");
    return (
      <{component_name}
        type="text"
        ariaLabel="Report period"
        items={{[
          {{ value: "daily", label: "Daily" }},
          {{ value: "weekly", label: "Weekly" }},
        ]}}
        value={{value}}
        onChange={{setValue}}
      />
    );
  }},
}};

export const TextThreeToFiveOptions: Story = {{
  render: () => {{
    const [three, setThree] = useState("weekly");
    const [five, setFive] = useState("c");
    return (
      <div style={{{{ display: "grid", gap: 20 }}}}>
        <{component_name}
          type="text"
          ariaLabel="3 options"
          items={{[
            {{ value: "daily", label: "Daily" }},
            {{ value: "weekly", label: "Weekly" }},
            {{ value: "monthly", label: "Monthly" }},
          ]}}
          value={{three}}
          onChange={{setThree}}
        />
        <{component_name}
          type="text"
          ariaLabel="5 options"
          items={{[
            {{ value: "a", label: "Option 1" }},
            {{ value: "b", label: "Option 2" }},
            {{ value: "c", label: "Option 3" }},
            {{ value: "d", label: "Option 4" }},
            {{ value: "e", label: "Option 5" }},
          ]}}
          value={{five}}
          onChange={{setFive}}
        />
      </div>
    );
  }},
}};

export const IconModes: Story = {{
  render: () => {{
    const [value, setValue] = useState("list");
    return (
      <{component_name}
        type="icon"
        ariaLabel="Icon segmented"
        items={{[
          {{ value: "list", icon: "view-hamburger", ariaLabel: "List view" }},
          {{ value: "tree", icon: "nav-tree", ariaLabel: "Tree view" }},
          {{ value: "grid", icon: "view-sort-grid-solid", ariaLabel: "Grid view" }},
        ]}}
        value={{value}}
        onChange={{setValue}}
      />
    );
  }},
}};

export const DisabledStates: Story = {{
  render: () => {{
    const [value, setValue] = useState("a");
    return (
      <div style={{{{ display: "grid", gap: 16 }}}}>
        <{component_name}
          type="text"
          ariaLabel="Disabled segment"
          items={{[
            {{ value: "a", label: "Available" }},
            {{ value: "b", label: "Locked", disabled: true }},
            {{ value: "c", label: "Available" }},
          ]}}
          value={{value}}
          onChange={{setValue}}
        />
        <{component_name}
          type="text"
          ariaLabel="Root disabled"
          items={{[
            {{ value: "x", label: "One" }},
            {{ value: "y", label: "Two" }},
          ]}}
          defaultValue="x"
          disabled
        />
      </div>
    );
  }},
}};
"""

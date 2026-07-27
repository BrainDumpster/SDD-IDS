from __future__ import annotations

from pathlib import Path
from typing import Optional

from generation.deterministic_storybook.helpers import storybook_theme_import_line
from generation.deterministic_storybook.models import DeterministicStorybookOptions
from validation.spec_contract_parser import SpecContract


def generate_powerflex_button_dropdown_story(
    *,
    repo_root: Path,
    story_path: Path,
    contract: SpecContract,
    options: Optional[DeterministicStorybookOptions] = None,
) -> str:
    """Emit Spec Accurate Design stories for Powerflex Button-Dropdown."""
    options = options or DeterministicStorybookOptions()
    theme_import = storybook_theme_import_line(options.design_system_slug or "powerflex")
    _ = (repo_root, story_path, contract)
    return f"""/* Spec Accurate Design — Powerflex Button-Dropdown (standalone) */
import React from "react";
{theme_import}
import type {{ Meta, StoryObj }} from "@storybook/react";
import {{
  ButtonDropdown,
  type ButtonDropdownItem,
}} from "../../../../storybook/src/components/ButtonDropdown";

const DESIGN_SPEC_PATH = "components/powerflex/button-dropdown/design-spec.md";

const sampleItems: ButtonDropdownItem[] = [
  {{ id: "action-1", label: "Action" }},
  {{ id: "action-2", label: "Action", hasSubmenu: true }},
];

const meta: Meta<typeof ButtonDropdown> = {{
  title: "Spec Generated/Powerflex/Button-Dropdown",
  component: ButtonDropdown,
  parameters: {{
    layout: "padded",
    docs: {{
      description: {{
        component: [
          `Spec-driven Powerflex Button-Dropdown (standalone). Source: \\`${{DESIGN_SPEC_PATH}}\\`.`,
          "Figma Main `2591:1696` (button-dropdown-icon).",
          "Runtime: `ButtonDropdown` + `components/powerflex-theme.css`.",
        ].join(" "),
      }},
    }},
  }},
  args: {{
    label: "button",
    variant: "primary",
    size: "lg",
    open: true,
    disabled: false,
    leadingIconSlug: "settings-gear-detailed",
    trailingIconSlug: "arrow-tri-down-solid",
    items: sampleItems,
  }},
  argTypes: {{
    variant: {{ control: "select", options: ["primary", "secondary", "tertiary"] }},
    size: {{ control: "inline-radio", options: ["lg", "md", "sm"] }},
    open: {{ control: "boolean" }},
    disabled: {{ control: "boolean" }},
  }},
}};

export default meta;
type Story = StoryObj<typeof ButtonDropdown>;

/** Figma primary / lg / open sample — Spec Accurate Design defaults. */
export const SpecAccurateDesign: Story = {{
  name: "Spec Accurate Design",
  args: {{
    label: "button",
    variant: "primary",
    size: "lg",
    open: true,
    disabled: false,
    leadingIconSlug: "settings-gear-detailed",
    trailingIconSlug: "arrow-tri-down-solid",
    items: sampleItems,
  }},
}};

export const SecondaryClosed: Story = {{
  args: {{
    variant: "secondary",
    open: false,
  }},
}};

export const TertiarySmall: Story = {{
  args: {{
    variant: "tertiary",
    size: "sm",
    open: false,
  }},
}};

export const Disabled: Story = {{
  args: {{
    disabled: true,
    open: false,
  }},
}};
"""

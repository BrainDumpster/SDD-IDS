from __future__ import annotations

import re
from pathlib import Path
from typing import Optional

from generation.deterministic_storybook.helpers import (
    prefixed_component_export_name,
    storybook_theme_import_line,
)
from generation.deterministic_storybook.models import DeterministicStorybookOptions
from generation.spec_derived.main_menu_left_composition import (
    DESIGN_SPEC_PATH,
    emit_angular_composition_root,
    emit_react_menu_list,
    emit_react_primary_state_matrix,
)
from validation.spec_contract_parser import SpecContract


def _sync_angular_developer_usage_composition(repo_root: Path) -> None:
    """Keep Angular developer-usage composition template aligned with codegen emitter."""
    usage_path = (
        repo_root
        / "storybook-angular/src/components/ids-main-menu-left/ids-main-menu-left.developer-usage.js"
    )
    if not usage_path.is_file():
        return
    text = usage_path.read_text(encoding="utf-8")
    generated = emit_angular_composition_root().strip()
    replacement = f"export const MAIN_MENU_LEFT_COMPOSITION_DEMO_TEMPLATE = `\n{generated}\n`.trim();"
    updated, count = re.subn(
        r"export const MAIN_MENU_LEFT_COMPOSITION_DEMO_TEMPLATE = `[\s\S]*?`\.trim\(\);",
        replacement,
        text,
        count=1,
    )
    if count and updated != text:
        usage_path.write_text(updated, encoding="utf-8")


def generate_ids_main_menu_left_story(
    *,
    repo_root: Path,
    story_path: Path,
    contract: SpecContract,
    options: Optional[DeterministicStorybookOptions] = None,
) -> str:
    options = options or DeterministicStorybookOptions()
    component_name = prefixed_component_export_name("main-menu-left", options.component_prefix)
    theme_import = storybook_theme_import_line(options.design_system_slug)
    composition_jsx = emit_react_menu_list()
    state_matrix_jsx = emit_react_primary_state_matrix()

    return f"""{theme_import}
import type {{ Meta, StoryObj }} from "@storybook/react";
import React, {{ type ComponentProps }} from "react";
import {{
  MainMenuLeft as {component_name},
  MainMenuLeftChildren,
  MainMenuLeftGroup,
  MainMenuLeftItem,
  MainMenuLeftItemIcon,
}} from "../../../../storybook/src/components/MainMenuLeft";
import styles from "../../../../storybook/src/components/MainMenuLeft.module.css";

const DESIGN_SPEC_PATH = "{DESIGN_SPEC_PATH}";

const specAccurateArgs: ComponentProps<typeof {component_name}> = {{
  expanded: true,
  defaultSelectedItemId: "dashboard",
}};

const meta: Meta<typeof {component_name}> = {{
  title: "{options.title_prefix}/Main Menu Left",
  component: {component_name},
  parameters: {{
    layout: "fullscreen",
    docs: {{
      description: {{
        component: [
          `Spec-driven IDS Main Menu/Left (composition API). Source: \\`${{DESIGN_SPEC_PATH}}\\`.`,
          "Deterministic order: Item | Group(Item → Children → secondary Items) per design-spec Codegen Contract.",
        ].join(" "),
      }},
    }},
  }},
  args: specAccurateArgs,
}};

export default meta;
type Story = StoryObj<typeof {component_name}>;

function SpecAccurateFrame(props: ComponentProps<typeof {component_name}>) {{
  return (
    <div
      style={{{{
        height: "100vh",
        boxSizing: "border-box",
        display: "flex",
        background: "var(--color-background-surface-1)",
        minHeight: 0,
      }}}}
    >
      <{component_name} {{...props}}>
{composition_jsx}
      </{component_name}>
      <div
        style={{{{
          flex: 1,
          minWidth: 0,
          padding: 24,
          color: "var(--color-text-neutral-strong)",
          fontSize: 14,
        }}}}
      >
        <p style={{{{ margin: 0, opacity: 0.85 }}}}>
          Main content area — use the rail collapse control to verify **64px** icon-only mode.
        </p>
      </div>
    </div>
  );
}}

export const SpecAccurateDesign: Story = {{
  name: "Spec Accurate Design",
  render: (args) => <SpecAccurateFrame {{...args}} />,
  args: specAccurateArgs,
}};

export const Collapsed: Story = {{
  render: (args) => <SpecAccurateFrame {{...args}} />,
  args: {{ ...specAccurateArgs, expanded: false }},
}};

export const PrimaryStateSnapshotMatrix: Story = {{
  render: () => (
    <div
      style={{{{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        padding: 16,
        background: "var(--color-background-surface-1)",
      }}}}
    >
      <{component_name} expanded forceStates>
{state_matrix_jsx}
      </{component_name}>
    </div>
  ),
}};
"""

from __future__ import annotations

from pathlib import Path
from typing import Optional

from generation.deterministic_storybook.helpers import (
    prefixed_component_export_name,
    storybook_theme_import_line,
)
from generation.deterministic_storybook.models import DeterministicStorybookOptions
from validation.spec_contract_parser import SpecContract

DESIGN_SPEC_PATH = "components/ids/main-menu-left/design-spec.mdx"


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

    return f"""{theme_import}
import type {{ Meta, StoryObj }} from "@storybook/react";
import React, {{ type ComponentProps }} from "react";
import {{
  MainMenuLeft as {component_name},
  type MainMenuLeftPrimaryItem,
}} from "../../../../storybook/src/components/MainMenuLeft";

const DESIGN_SPEC_PATH = "{DESIGN_SPEC_PATH}";

/** Canonical nav items for Storybook / codegen parity (expanded + one secondary group). */
/** Sample nav from Figma MainMenu-Left-Main expanded (`11099:56218`). */
const specAccurateItems: MainMenuLeftPrimaryItem[] = [
  {{ id: "dashboard", name: "Dashboard", iconName: "home", routeRef: "/dashboard" }},
  {{
    id: "infrastructure",
    name: "Infrastructure",
    iconName: "network-share",
    routeRef: "/infrastructure",
    childrenMenu: "collapsed",
    children: [
      {{ id: "secondary-a", name: "Secondary Item", routeRef: "/infrastructure/a" }},
      {{ id: "secondary-b", name: "Secondary Item", routeRef: "/infrastructure/b" }},
    ],
  }},
  {{ id: "protection", name: "Protection", iconName: "shield-encrypt-alt", routeRef: "/protection" }},
  {{ id: "recovery", name: "Recovery", iconName: "arrows-spin", routeRef: "/recovery" }},
  {{ id: "alerts", name: "Alerts and Events", iconName: "alert-bell", routeRef: "/alerts" }},
  {{ id: "reports", name: "Reports", iconName: "productivity-alt", routeRef: "/reports" }},
  {{
    id: "administration",
    name: "Administration",
    iconName: "user-settings",
    routeRef: "/administration",
  }},
  {{ id: "jobs", name: "Jobs", iconName: "time-detail", routeRef: "/jobs" }},
];

const specAccurateArgs: ComponentProps<typeof {component_name}> = {{
  expanded: true,
  defaultSelectedItemId: "dashboard",
  items: specAccurateItems,
}};

const meta: Meta<typeof {component_name}> = {{
  title: "{options.title_prefix}/Main Menu Left",
  component: {component_name},
  parameters: {{
    layout: "fullscreen",
    docs: {{
      description: {{
        component: [
          `Spec-driven IDS Main Menu/Left. Source of truth: \\`${{DESIGN_SPEC_PATH}}\\`.`,
          "Primary story: expanded **278px** rail (Figma `11099:56218`), **40px** primary rows, **32px** secondary rows, collapse footer — `MainMenuLeft.module.css`.",
          "Icons: shared `Icon` + `assets/icons/<shapeName>.svg`. Dark theme: `components/ids-theme.css` + `[data-theme=\\"dark\\"]`.",
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
      <{component_name} {{...props}} />
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

/** Canonical reference: expanded left nav (Figma `11099:56218`); Infrastructure row has `children` with `childrenMenu: "collapsed"`. */
export const SpecAccurateDesign: Story = {{
  name: "Spec Accurate Design",
  render: (args) => <SpecAccurateFrame {{...args}} />,
  args: specAccurateArgs,
}};

/** Collapsed icon-only rail (**64px**). */
export const Collapsed: Story = {{
  render: (args) => <SpecAccurateFrame {{...args}} />,
  args: {{ ...specAccurateArgs, expanded: false }},
}};

/** Fixed primary-row states for visual QA (`forceStates`). */
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
      <{component_name}
        expanded
        forceStates
        items={{[
          {{ id: "default", name: "Default", iconName: "home", state: "default" }},
          {{ id: "hover", name: "Hover", iconName: "home", state: "hover" }},
          {{ id: "press", name: "Press", iconName: "home", state: "press" }},
          {{ id: "selected", name: "Selected", iconName: "home", state: "selected" }},
          {{
            id: "default-focus",
            name: "Default focus",
            iconName: "home",
            state: "default-focus",
          }},
          {{
            id: "selected-focus",
            name: "Selected focus",
            iconName: "home",
            state: "selected-focus",
          }},
        ]}}
      />
    </div>
  ),
}};
"""

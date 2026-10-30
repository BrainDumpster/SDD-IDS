from __future__ import annotations

from pathlib import Path
from typing import Optional

from generation.deterministic_storybook.helpers import (
    prefixed_component_export_name,
    storybook_theme_import_line,
)
from generation.deterministic_storybook.models import DeterministicStorybookOptions
from validation.spec_contract_parser import SpecContract

DESIGN_SPEC_PATH = "components/ids/dashboard/design-spec.md"


def generate_ids_dashboard_story(
    *,
    repo_root: Path,
    story_path: Path,
    contract: SpecContract,
    options: Optional[DeterministicStorybookOptions] = None,
) -> str:
    """Emit Spec Generated Dashboard stories from the Dashboard design-spec contract."""
    del repo_root, story_path, contract
    options = options or DeterministicStorybookOptions()
    component_name = prefixed_component_export_name("dashboard", options.component_prefix)
    theme_import = storybook_theme_import_line(options.design_system_slug)

    return f"""{theme_import}
import type {{ Meta, StoryObj }} from "@storybook/react";
import {{
  Card,
  CardSecondaryTitle,
  CardTextContent,
}} from "../../../../storybook/src/components/Card";
import {{ Dashboard as {component_name} }} from "../../../../storybook/src/components/Dashboard";

const DESIGN_SPEC_PATH = "{DESIGN_SPEC_PATH}";

const CARD_MENU = [
  {{ value: "edit", label: "Edit" }},
  {{ value: "remove", label: "Remove from dashboard" }},
];

const sampleBody = (label: string) => (
  <CardTextContent sectionTitle={{label}}>
    Dashboard tile body — IDS Card Content Type=Text sample.
  </CardTextContent>
);

const meta: Meta<typeof {component_name}> = {{
  title: "{options.title_prefix}/Dashboard",
  component: {component_name},
  parameters: {{
    layout: "padded",
    docs: {{
      description: {{
        component: [
          `IDS Dashboard wrapper. Source: \\`${{DESIGN_SPEC_PATH}}\\`.`,
          "Holds a responsive grid of IDS Cards (1 → 2 → 3 columns by viewport).",
          "Sets `--card-border-color: var(--color-border-gray-neutral-light)` for nested Cards.",
          "Injects `showDivider` via `showDividerInCard` (default true).",
          "Page title and page-level actions are owned by the host layout (not Dashboard).",
          "Optional `enableDragAndDrop` (makes Cards draggable).",
          "Card `size`: `span-1` | `span-2` | `span-3`.",
        ].join(" "),
      }},
    }},
  }},
  decorators: [
    (Story) => (
      <div style={{{{ width: "100%", maxWidth: 1200, margin: "0 auto" }}}}>
        <Story />
      </div>
    ),
  ],
}};

export default meta;
type Story = StoryObj<typeof {component_name}>;

/** Three-column layout with mixed card spans + light nested borders. */
export const SpecAccurateDesign: Story = {{
  name: "Spec Accurate Design",
  args: {{
    showDividerInCard: true,
    enableDragAndDrop: false,
  }},
  render: (args) => (
    <{component_name} {{...args}}>
      <Card
        key="alerts"
        title="Widget Title"
        secondaryTitle="Secondary Title"
        headerMeta="Last 24 Hours"
        size="span-1"
        showOverflowMenu
        menuOptions={{CARD_MENU}}
        showButtons
        actions={{[{{ id: "a1", label: "Action" }}]}}
      >
        {{sampleBody("Critical events")}}
      </Card>
      <Card
        key="capacity"
        title="Widget Title"
        secondaryTitle={{<CardSecondaryTitle>Secondary Title</CardSecondaryTitle>}}
        size="span-1"
        showButtons={{false}}
      >
        {{sampleBody("Storage pool")}}
      </Card>
      <Card
        key="jobs"
        title="Jobs"
        size="span-1"
        showOverflowMenu
        menuOptions={{CARD_MENU}}
      >
        {{sampleBody("Active jobs")}}
      </Card>
      <Card
        key="health"
        title="Health summary"
        secondaryTitle={{<CardSecondaryTitle>All regions</CardSecondaryTitle>}}
        size="span-2"
        showButtons
        actions={{[
          {{ id: "a1", label: "Action" }},
          {{ id: "a2", label: "Action" }},
        ]}}
      >
        {{sampleBody("Status overview")}}
      </Card>
      <Card key="notes" title="Notes" size="span-1">
        {{sampleBody("Operator notes")}}
      </Card>
      <Card
        key="timeline"
        title="Timeline"
        secondaryTitle="Full width"
        size="span-3"
      >
        {{sampleBody("Recent activity")}}
      </Card>
    </{component_name}>
  ),
}};

/** Same layout with HTML5 drag reorder enabled via `enableDragAndDrop`. */
export const WithDraggableCards: Story = {{
  name: "With enableDragAndDrop",
  args: {{
    showDividerInCard: true,
    enableDragAndDrop: true,
  }},
  render: (args) => (
    <{component_name} {{...args}}>
      <Card key="c1" title="Card A" size="span-1">
        {{sampleBody("A")}}
      </Card>
      <Card key="c2" title="Card B" secondaryTitle="Drag me" size="span-1">
        {{sampleBody("B")}}
      </Card>
      <Card key="c3" title="Card C" size="span-1">
        {{sampleBody("C")}}
      </Card>
      <Card key="c4" title="Wide card" size="span-2">
        {{sampleBody("Span 2")}}
      </Card>
      <Card key="c5" title="Narrow" size="span-1">
        {{sampleBody("Span 1")}}
      </Card>
    </{component_name}>
  ),
}};

/** Nested Cards with body dividers off via Dashboard. */
export const WithoutCardDividers: Story = {{
  name: "showDividerInCard false",
  args: {{
    showDividerInCard: false,
    enableDragAndDrop: false,
  }},
  render: (args) => (
    <{component_name} {{...args}}>
      <Card
        key="1"
        title="One"
        size="span-1"
        showButtons
        actions={{[{{ label: "Action" }}]}}
      >
        {{sampleBody("Column 1")}}
      </Card>
      <Card key="2" title="Two" size="span-1">
        {{sampleBody("Column 2")}}
      </Card>
      <Card key="3" title="Three" size="span-1">
        {{sampleBody("Column 3")}}
      </Card>
    </{component_name}>
  ),
}};

/** Simple 3-card grid. */
export const GridOnly: Story = {{
  name: "Grid only",
  args: {{
    showDividerInCard: true,
    enableDragAndDrop: false,
  }},
  render: (args) => (
    <{component_name} {{...args}}>
      <Card key="1" title="One" size="span-1">
        {{sampleBody("Column 1")}}
      </Card>
      <Card key="2" title="Two" size="span-1">
        {{sampleBody("Column 2")}}
      </Card>
      <Card key="3" title="Three" size="span-1">
        {{sampleBody("Column 3")}}
      </Card>
    </{component_name}>
  ),
}};
"""

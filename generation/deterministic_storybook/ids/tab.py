from __future__ import annotations

from pathlib import Path
from typing import Optional

from generation.deterministic_storybook.helpers import prefixed_component_export_name
from generation.deterministic_storybook.models import DeterministicStorybookOptions
from validation.spec_contract_parser import SpecContract


def generate_ids_tab_story(
    *,
    repo_root: Path,
    story_path: Path,
    contract: SpecContract,
    options: Optional[DeterministicStorybookOptions] = None,
) -> str:
    options = options or DeterministicStorybookOptions()
    component_name = prefixed_component_export_name("tab", options.component_prefix)
    import_path = "../../../../storybook/src/components/Tabs"

    return f"""import type {{ Meta, StoryObj }} from "@storybook/react";
import {{ useState }} from "react";
import {{ Tabs as {component_name} }} from "{import_path}";

const baseItems = [
  {{ id: "overview", label: "Overview", panel: "Overview tab content area." }},
  {{ id: "security", label: "Security", panel: "Security tab content area." }},
  {{ id: "alerts", label: "Alerts", panel: "Alerts tab content area with related data." }},
];

const overflowItems = [
  {{ id: "summary", label: "Summary", panel: "Summary content." }},
  {{ id: "details", label: "Details", panel: "Details content." }},
  {{ id: "settings", label: "Settings", panel: "Settings content." }},
  {{ id: "activity", label: "Activity", panel: "Activity content." }},
  {{ id: "audit", label: "Audit Trail", panel: "Audit trail content." }},
  {{ id: "integrations", label: "Integrations", panel: "Integrations content." }},
  {{ id: "policies", label: "Policies", panel: "Policies content." }},
];

const meta: Meta<typeof {component_name}> = {{
  title: "{options.title_prefix}/Tab",
  component: {component_name},
  args: {{ items: baseItems, variant: "secondary", surface: "elevated", showAddTab: false, addTabLabel: "Add Tab", minTabWidth: 80, maxTabWidth: 250, moreLabel: "More" }},
}};

export default meta;
type Story = StoryObj<typeof {component_name}>;

export const SecondaryDefault: Story = {{ args: {{ variant: "secondary", items: baseItems }} }};
export const PrimaryVariant: Story = {{ args: {{ variant: "primary", items: baseItems }} }};

export const TransparentOnGray: Story = {{
  args: {{ variant: "secondary", surface: "transparent", items: baseItems }},
  render: (args) => (
    <div style={{{{ maxWidth: 720, padding: 16, background: "var(--color-background-gray-light)" }}}}>
      <{component_name} {{...args}} />
    </div>
  ),
}};

export const OverflowResponsive: Story = {{
  args: {{ items: overflowItems, variant: "secondary", showAddTab: false }},
  render: (args) => <div style={{{{ maxWidth: 560 }}}}><{component_name} {{...args}} /></div>,
}};

export const AddTabDynamic: Story = {{
  render: () => {{
    const [items, setItems] = useState(overflowItems.slice(0, 4));
    return (
      <div style={{{{ maxWidth: 700 }}}}>
        <{component_name}
          items={{items}}
          variant="secondary"
          showAddTab
          addTabLabel="Add Tab"
          onAddTab={{() => {{
            const nextIndex = items.length + 1;
            const id = `new-${{nextIndex}}`;
            setItems((prev) => [...prev, {{ id, label: `Tab ${{nextIndex}}`, panel: `Dynamic tab content for Tab ${{nextIndex}}.` }}]);
          }}}}
        />
      </div>
    );
  }},
}};

export const IconAndBadge: Story = {{
  args: {{
    variant: "primary",
    items: [
      {{ id: "overview", label: "Overview", panel: "Overview tab content area.", iconSlug: "home", badgeCount: 5 }},
      {{ id: "security", label: "Security", panel: "Security tab content area.", iconSlug: "shield", badgeCount: 3 }},
      {{ id: "alerts", label: "Alerts", panel: "Alerts tab content area with related data.", iconSlug: "alert", badgeCount: 1 }},
      {{ id: "settings", label: "Settings", panel: "Settings content area.", iconSlug: "settings", badgeCount: 0 }},
    ],
  }},
}};
"""

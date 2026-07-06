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
    tabs_import = "../../../../storybook/src/components/Tabs"

    return f"""import type {{ Meta, StoryObj }} from "@storybook/react";
import {{ useState }} from "react";
import "../../../../components/ids-theme.css";
import shieldEncryptAltIcon from "../../../../assets/icons/shield-encrypt-alt.svg";
import {{
  TAB_API_DEFAULTS,
  TAB_OVERFLOW_DEMO_WIDTH,
  TAB_OVERFLOW_MORE_ICON_SIZE_PX,
  TAB_OVERFLOW_MORE_ICON_SLUG,
  TAB_SPEC_ACCURATE_DEFAULTS,
  TAB_SPEC_DEMO_ITEMS,
  TAB_SPEC_OVERFLOW_ITEMS,
}} from "@component-contracts/ids/tab.contract";
import {{ SPEC_ACCURATE_DESIGN_STORY }} from "@component-contracts/common/story-meta";
import {{ Tabs as {component_name} }} from "{tabs_import}";

const baseItems = TAB_SPEC_DEMO_ITEMS.map((item) => ({{
  id: item.id,
  label: item.label,
  panel: item.content,
  ...(item.iconSlug
    ? {{
        icon: (
          <img src={{shieldEncryptAltIcon}} alt="" width={{16}} height={{16}} />
        ),
      }}
    : {{}}),
}}));

const overflowItems = TAB_SPEC_OVERFLOW_ITEMS.map((item) => ({{
  id: item.id,
  label: item.label,
  panel: item.content,
}}));

const meta: Meta<typeof {component_name}> = {{
  title: "{options.title_prefix}/Tab",
  component: {component_name},
  parameters: {{
    docs: {{
      description: {{
        component: [
          "IDS Tab overflow demos use contract constants from `component-contracts/ids/tab.contract.ts`.",
          `Overflow \\`More\\` caret: \\`${{TAB_OVERFLOW_MORE_ICON_SLUG}}\\` at ${{TAB_OVERFLOW_MORE_ICON_SIZE_PX}}×${{TAB_OVERFLOW_MORE_ICON_SIZE_PX}}px.`,
          `Overflow host width: ${{TAB_OVERFLOW_DEMO_WIDTH}}px.`,
        ].join(" "),
      }},
    }},
  }},
  args: {{
    items: baseItems,
    variant: TAB_SPEC_ACCURATE_DEFAULTS.type,
    surface: TAB_SPEC_ACCURATE_DEFAULTS.surface,
    showAddTab: TAB_SPEC_ACCURATE_DEFAULTS.allowAddTab,
    addTabLabel: TAB_API_DEFAULTS.addTabLabel,
    minTabWidth: TAB_API_DEFAULTS.minTabWidth,
    maxTabWidth: TAB_API_DEFAULTS.maxTabWidth,
    moreLabel: TAB_API_DEFAULTS.moreLabel,
  }},
  argTypes: {{
    variant: {{ control: "select", options: ["primary", "secondary"] }},
    surface: {{ control: "select", options: ["elevated", "transparent"] }},
    showAddTab: {{ control: "boolean" }},
    addTabLabel: {{ control: "text" }},
    moreLabel: {{ control: "text" }},
  }},
}};

export default meta;
type Story = StoryObj<typeof {component_name}>;

export const SpecAccurateDesign: Story = {{
  name: SPEC_ACCURATE_DESIGN_STORY,
  args: {{
    variant: TAB_SPEC_ACCURATE_DEFAULTS.type,
    items: baseItems,
  }},
}};

export const PrimaryVariant: Story = {{
  args: {{
    variant: "primary",
    items: baseItems,
  }},
}};

export const TransparentOnGray: Story = {{
  args: {{
    variant: "secondary",
    surface: "transparent",
    items: baseItems,
  }},
  render: (args) => (
    <div
      style={{{{
        maxWidth: 720,
        padding: 16,
        background: "var(--color-background-gray-light)",
      }}}}
    >
      <{component_name} {{...args}} />
    </div>
  ),
}};

export const OverflowResponsive: Story = {{
  name: "Overflow Responsive",
  args: {{
    items: overflowItems,
    variant: "secondary",
    showAddTab: false,
  }},
  render: (args) => (
    <div style={{{{ width: TAB_OVERFLOW_DEMO_WIDTH, maxWidth: TAB_OVERFLOW_DEMO_WIDTH }}}}>
      <{component_name} {{...args}} />
    </div>
  ),
  parameters: {{
    docs: {{
      description: {{
        story: `Secondary overflow at ${{TAB_OVERFLOW_DEMO_WIDTH}}px host — \\`More\\` + \\`${{TAB_OVERFLOW_MORE_ICON_SLUG}}\\` (${{TAB_OVERFLOW_MORE_ICON_SIZE_PX}}×${{TAB_OVERFLOW_MORE_ICON_SIZE_PX}}).`,
      }},
    }},
  }},
}};

export const PrimaryOverflowResponsive: Story = {{
  name: "Primary Overflow Responsive",
  args: {{
    items: overflowItems,
    variant: "primary",
    showAddTab: false,
  }},
  render: (args) => (
    <div style={{{{ width: TAB_OVERFLOW_DEMO_WIDTH, maxWidth: TAB_OVERFLOW_DEMO_WIDTH }}}}>
      <{component_name} {{...args}} />
    </div>
  ),
  parameters: {{
    docs: {{
      description: {{
        story: `Primary overflow at ${{TAB_OVERFLOW_DEMO_WIDTH}}px host — \\`More\\` + \\`${{TAB_OVERFLOW_MORE_ICON_SLUG}}\\` (${{TAB_OVERFLOW_MORE_ICON_SIZE_PX}}×${{TAB_OVERFLOW_MORE_ICON_SIZE_PX}}).`,
      }},
    }},
  }},
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
          addTabLabel={{TAB_API_DEFAULTS.addTabLabel}}
          onAddTab={{() => {{
            const nextIndex = items.length + 1;
            const id = `new-${{nextIndex}}`;
            setItems((prev) => [
              ...prev,
              {{
                id,
                label: `Tab ${{nextIndex}}`,
                panel: `Dynamic tab content for Tab ${{nextIndex}}.`,
              }},
            ]);
          }}}}
        />
      </div>
    );
  }},
}};

export const AddLabelSecondary: Story = {{
  args: {{
    items: overflowItems,
    variant: "secondary",
    showAddTab: true,
    addTabLabel: "Create Tab",
  }},
  render: (args) => (
    <div style={{{{ maxWidth: 760 }}}}>
      <{component_name} {{...args}} />
    </div>
  ),
}};

export const IconAndBadge: Story = {{
  args: {{
    variant: "primary",
    items: [
      {{
        id: "overview",
        label: "Overview",
        panel: "Overview tab content area.",
        icon: <img src={{shieldEncryptAltIcon}} alt="" width={{16}} height={{16}} />,
        badgeCount: 5,
        closable: true,
      }},
      {{
        id: "security",
        label: "Security",
        panel: "Security tab content area.",
        icon: <img src={{shieldEncryptAltIcon}} alt="" width={{16}} height={{16}} />,
        badgeCount: 3,
        closable: true,
      }},
      {{
        id: "alerts",
        label: "Alerts",
        panel: "Alerts tab content area with related data.",
        icon: <img src={{shieldEncryptAltIcon}} alt="" width={{16}} height={{16}} />,
        badgeCount: 1,
        closable: true,
      }},
      {{
        id: "settings",
        label: "Settings",
        panel: "Settings content area.",
        icon: <img src={{shieldEncryptAltIcon}} alt="" width={{16}} height={{16}} />,
        badgeCount: 0,
        closable: true,
      }},
    ],
  }},
}};
"""

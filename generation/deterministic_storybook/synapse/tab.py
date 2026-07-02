from __future__ import annotations

from pathlib import Path
from typing import Optional

from generation.deterministic_storybook.models import DeterministicStorybookOptions
from validation.spec_contract_parser import SpecContract


def generate_synapse_tab_story(
    *,
    repo_root: Path,
    story_path: Path,
    contract: SpecContract,
    options: Optional[DeterministicStorybookOptions] = None,
) -> str:
    options = options or DeterministicStorybookOptions()
    synapse_tabs_import = "../../../../storybook/src/components/SynapseTabs"
    spec_contract_import = "../../../../storybook/src/spec-contracts/synapse-tab.contract"

    return f"""import React, {{ useState, type ComponentProps }} from "react";
import "../../../../components/synapse-theme.css";
import type {{ Meta, StoryObj }} from "@storybook/react";
import {{ Icon }} from "../../../../storybook/src/components/Icon";
import {{ SynapseTabs }} from "{synapse_tabs_import}";
import {{
  SYNAPSE_NAV_TAB_GROUP_FOUR_NODE_ID,
  SYNAPSE_NAV_TAB_GROUP_OVERFLOW_NODE_ID,
  SYNAPSE_TAB_DESIGN_SPEC_PATH,
  SYNAPSE_TAB_MAX_WIDTH_NODE_ID,
  SYNAPSE_TAB_MAX_WIDTH_PX,
  SYNAPSE_TAB_MIN_WIDTH_NODE_ID,
  SYNAPSE_TAB_MIN_WIDTH_PX,
  SYNAPSE_TAB_NO_ICON_NODE_ID,
  SYNAPSE_TAB_OVERFLOW_DEMO_WIDTH,
}} from "{spec_contract_import}";
import {{ SPEC_ACCURATE_DESIGN_STORY }} from "@component-contracts/common/story-meta";

const navTabPanel = (name: string) => `${{name}} panel content.`;

const fourTabItems: ComponentProps<typeof SynapseTabs>["items"] = [
  {{ id: "tab-1", label: "Tab name", panel: navTabPanel("Tab 1") }},
  {{ id: "tab-2", label: "Tab name", panel: navTabPanel("Tab 2") }},
  {{ id: "tab-3", label: "Tab name", panel: navTabPanel("Tab 3") }},
  {{ id: "tab-4", label: "Tab name", panel: navTabPanel("Tab 4") }},
];

const overflowTabItems: ComponentProps<typeof SynapseTabs>["items"] = Array.from(
  {{ length: 12 }},
  (_, index) => ({{
    id: `overflow-${{index + 1}}`,
    label: "Tab name",
    panel: navTabPanel(`Overflow tab ${{index + 1}}`),
  }}),
);

const specAccurateArgs: ComponentProps<typeof SynapseTabs> = {{
  items: fourTabItems,
  defaultActiveTabId: "tab-1",
  showAddTab: true,
  minTabWidth: SYNAPSE_TAB_MIN_WIDTH_PX,
  maxTabWidth: SYNAPSE_TAB_MAX_WIDTH_PX,
}};

const meta: Meta<typeof SynapseTabs> = {{
  title: "{options.title_prefix}/Tab",
  component: SynapseTabs,
  parameters: {{
    layout: "padded",
    docs: {{
      description: {{
        component: [
          `Spec-driven Synapse Nav Tab (IDS Tab contract). Source: \\`${{SYNAPSE_TAB_DESIGN_SPEC_PATH}}\\`.`,
          `Primary story: **4 tabs + add** (Figma \\`${{SYNAPSE_NAV_TAB_GROUP_FOUR_NODE_ID}}\\`).`,
          "Overflow: `More` + `arrow-tri-down-solid` `10×10` (IDS contract) before add tab.",
          "Theme: `components/synapse-theme.css`.",
        ].join(" "),
      }},
    }},
  }},
  args: specAccurateArgs,
}};

export default meta;
type Story = StoryObj<typeof SynapseTabs>;

function TabFrame({{
  width = 492,
  children,
}}: {{
  width?: number | string;
  children: React.ReactNode;
}}) {{
  return (
    <div
      style={{{{
        width,
        maxWidth: "100%",
        boxSizing: "border-box",
        background: "var(--color-background-surface-1)",
        padding: 16,
      }}}}
    >
      {{children}}
    </div>
  );
}}

function OverflowTabFrame({{ children }}: {{ children: React.ReactNode }}) {{
  return (
    <div
      style={{{{
        width: "100%",
        minHeight: "100dvh",
        boxSizing: "border-box",
        background: "var(--color-background-surface-1)",
        padding: 16,
      }}}}
    >
      <div
        style={{{{
          width: `min(100%, ${{SYNAPSE_TAB_OVERFLOW_DEMO_WIDTH}}px)`,
          minWidth: 240,
          maxWidth: "100%",
          resize: "horizontal",
          overflow: "hidden",
          boxSizing: "border-box",
          border: "1px dashed var(--color-border-light)",
        }}}}
      >
        {{children}}
      </div>
      <p
        style={{{{
          margin: "8px 0 0",
          fontSize: "var(--font-size-body-2)",
          lineHeight: "var(--font-line-height-line-height-20)",
          color: "var(--color-text-neutral)",
        }}}}
      >
        Resize the dashed container or Storybook canvas to trigger the `More` overflow menu.
      </p>
    </div>
  );
}}

export const SpecAccurateDesign: Story = {{
  name: SPEC_ACCURATE_DESIGN_STORY,
  render: (args) => (
    <TabFrame width={{492}}>
      <SynapseTabs {{...args}} />
    </TabFrame>
  ),
  args: specAccurateArgs,
}};

export const DefaultNoIcon: Story = {{
  name: "Default No Icon",
  render: () => (
    <TabFrame width={{114}}>
      <SynapseTabs
        items={{[{{ id: "solo", label: "Tab name", panel: navTabPanel("Solo") }}]}}
        defaultActiveTabId="solo"
        minTabWidth={{SYNAPSE_TAB_MIN_WIDTH_PX}}
        maxTabWidth={{SYNAPSE_TAB_MAX_WIDTH_PX}}
      />
    </TabFrame>
  ),
  parameters: {{
    docs: {{
      description: {{ story: `Figma \\`${{SYNAPSE_TAB_NO_ICON_NODE_ID}}\\`.` }},
    }},
  }},
}};

export const WithTabIcon: Story = {{
  name: "With Tab Icon",
  render: () => (
    <TabFrame width={{160}}>
      <SynapseTabs
        items={{[
          {{
            id: "workspace",
            label: "Tab name",
            panel: navTabPanel("Workspace"),
            icon: <Icon shapeName="grid-square-9" style={{{{ width: 16, height: 16 }}}} />,
          }},
        ]}}
        defaultActiveTabId="workspace"
      />
    </TabFrame>
  ),
}};

export const MinWidth: Story = {{
  name: "Min Width 80px",
  render: () => (
    <TabFrame width={{80}}>
      <SynapseTabs
        items={{[{{ id: "min", label: "Tab name", panel: navTabPanel("Min") }}]}}
        defaultActiveTabId="min"
        minTabWidth={{SYNAPSE_TAB_MIN_WIDTH_PX}}
        maxTabWidth={{SYNAPSE_TAB_MAX_WIDTH_PX}}
      />
    </TabFrame>
  ),
  parameters: {{
    docs: {{
      description: {{ story: `Figma \\`${{SYNAPSE_TAB_MIN_WIDTH_NODE_ID}}\\`.` }},
    }},
  }},
}};

export const MaxWidthTruncation: Story = {{
  name: "Max Width 250px",
  render: () => (
    <TabFrame width={{250}}>
      <SynapseTabs
        items={{[
          {{
            id: "max",
            label: "Tab name example long tab name and more text",
            panel: navTabPanel("Max"),
          }},
        ]}}
        defaultActiveTabId="max"
        minTabWidth={{SYNAPSE_TAB_MIN_WIDTH_PX}}
        maxTabWidth={{SYNAPSE_TAB_MAX_WIDTH_PX}}
      />
    </TabFrame>
  ),
  parameters: {{
    docs: {{
      description: {{ story: `Figma \\`${{SYNAPSE_TAB_MAX_WIDTH_NODE_ID}}\\` — label ellipsizes at 250px.` }},
    }},
  }},
}};

export const NavTabGroupOverflow: Story = {{
  name: "Nav Tab Group Overflow",
  render: () => (
    <OverflowTabFrame>
      <SynapseTabs
        items={{overflowTabItems}}
        defaultActiveTabId="overflow-1"
        showAddTab
        minTabWidth={{SYNAPSE_TAB_MIN_WIDTH_PX}}
        maxTabWidth={{SYNAPSE_TAB_MAX_WIDTH_PX}}
      />
    </OverflowTabFrame>
  ),
  parameters: {{
    layout: "fullscreen",
    docs: {{
      description: {{
        story: `Figma \\`${{SYNAPSE_NAV_TAB_GROUP_OVERFLOW_NODE_ID}}\\` — overflow \\`More\\` + add tab; host uses \\`SYNAPSE_TAB_OVERFLOW_DEMO_WIDTH\\` (${{SYNAPSE_TAB_OVERFLOW_DEMO_WIDTH}}px) as max resize width.`,
      }},
    }},
  }},
}};

export const AddTabDynamic: Story = {{
  name: "Add Tab Dynamic",
  render: () => {{
    const [items, setItems] = useState(fourTabItems);

    return (
      <TabFrame width={{560}}>
        <SynapseTabs
          items={{items}}
          defaultActiveTabId={{items[0]?.id}}
          showAddTab
          onAddTab={{() => {{
            const nextIndex = items.length + 1;
            const id = `new-${{nextIndex}}`;
            setItems((prev) => [
              ...prev,
              {{
                id,
                label: "Tab name",
                panel: navTabPanel(`New ${{nextIndex}}`),
              }},
            ]);
          }}}}
        />
      </TabFrame>
    );
  }},
}};
"""

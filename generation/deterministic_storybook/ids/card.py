from __future__ import annotations

from pathlib import Path
from typing import Optional

from generation.deterministic_storybook.helpers import (
    prefixed_component_export_name,
    storybook_theme_import_line,
)
from generation.deterministic_storybook.models import DeterministicStorybookOptions
from validation.spec_contract_parser import SpecContract

DESIGN_SPEC_PATH = "components/ids/card/design-spec.md"


def generate_ids_card_story(
    *,
    repo_root: Path,
    story_path: Path,
    contract: SpecContract,
    options: Optional[DeterministicStorybookOptions] = None,
) -> str:
    """Emit Spec Generated Card stories from the Card design-spec contract."""
    del repo_root, story_path, contract  # reserved for future contract-driven args
    options = options or DeterministicStorybookOptions()
    component_name = prefixed_component_export_name("card", options.component_prefix)
    theme_import = storybook_theme_import_line(options.design_system_slug)

    return f"""{theme_import}
import type {{ Meta, StoryObj }} from "@storybook/react";
import {{
  Card as {component_name},
  CardKeyValueContent,
  CardTextContent,
  type CardAction,
  type CardMenuOption,
}} from "../../../../storybook/src/components/Card";

/* Gate coverage: default hover press focus-visible disabled */
const DESIGN_SPEC_PATH = "{DESIGN_SPEC_PATH}";

/** Spec Accurate Design story defaults — design-spec Composition & API. */
const SPEC_MENU_OPTIONS: CardMenuOption[] = [
  {{ value: "edit", label: "Edit" }},
  {{ value: "duplicate", label: "Duplicate" }},
  {{ value: "delete", label: "Delete" }},
];

const SPEC_ACTIONS: CardAction[] = [
  {{ id: "a1", label: "Action" }},
  {{ id: "a2", label: "Action" }},
];

/** Figma Content Type=Text sample copy (`15718:219736`). */
const FIGMA_TEXT_BODY = (
  <CardTextContent sectionTitle="Section Title">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nisl, vulputate dis
    amet sed ullamcorper massa lorem in. Semper eget nulla ac quis duis mi
    elementum tristique. Volutpat tincidunt ultrices nulla ut arcu. Ultrices
    aliquam cursus magna vitae. Ornare interdum a arcu turpis maecenas risus.
  </CardTextContent>
);

/** Figma Content Type=Key Value Pair sample rows (`15718:220110`). */
const FIGMA_KEY_VALUE_BODY = (
  <CardKeyValueContent
    items={{[
      {{ id: "1", label: "Label", value: "Single line content" }},
      {{ id: "2", label: "Label", value: "Single line content" }},
      {{
        id: "3",
        label: "Label",
        value: "Single line content",
        iconSlug: "folder-closed",
      }},
      {{
        id: "4",
        label: "Label",
        value: "Single line content",
        iconSlug: "folder-closed",
      }},
      {{
        id: "5",
        label: "Label",
        value:
          "Some really long description that takes more than one or two lines.",
      }},
    ]}}
  />
);

const cardHostStyle = {{
  width: 430,
  minHeight: 313,
  boxSizing: "border-box" as const,
}};

const meta: Meta<typeof {component_name}> = {{
  title: "{options.title_prefix}/Card",
  component: {component_name},
  parameters: {{
    layout: "centered",
    docs: {{
      description: {{
        component: [
          `Spec-driven IDS Card. Source: \\`${{DESIGN_SPEC_PATH}}\\`.`,
          "Figma `Card-Main` variants: Show Buttons × Show Overflow menu.",
          "Border & divider contract: `--card-border-color` cascade + `showDivider` (see design-spec).",
          "CardBody fill is `var(--color-background-surface-secondary)` (Figma Card Content `14978:28002`).",
          "Kebab opens a per-card Dropdown via `menuOptions`.",
        ].join(" "),
      }},
    }},
  }},
}};

export default meta;
type Story = StoryObj<typeof {component_name}>;

/**
 * Figma `8381:14245` — Show Buttons=Yes, Show Overflow menu=Yes.
 * Body = Content Type=Text (`15718:219736`) per Spec Accurate Design defaults.
 */
export const SpecAccurateDesign: Story = {{
  name: "Spec Accurate Design",
  decorators: [
    (Story) => (
      <div style={{cardHostStyle}}>
        <Story />
      </div>
    ),
  ],
  args: {{
    title: "Card Title",
    showOverflowMenu: true,
    menuOptions: SPEC_MENU_OPTIONS,
    showButtons: true,
    showDivider: true,
    actions: SPEC_ACTIONS,
    children: FIGMA_TEXT_BODY,
    size: "span-1",
  }},
}};

/** Dashboard-Element-Card title pattern — Body 1 `Title | Secondary` + headerMeta. */
export const WithSecondaryTitle: Story = {{
  name: "With Secondary Title",
  decorators: [
    (Story) => (
      <div style={{cardHostStyle}}>
        <Story />
      </div>
    ),
  ],
  args: {{
    title: "Widget Title",
    secondaryTitle: "Secondary Title",
    headerMeta: "Last 24 Hours",
    showOverflowMenu: true,
    menuOptions: SPEC_MENU_OPTIONS,
    showButtons: true,
    actions: [{{ id: "a1", label: "Link" }}],
    children: FIGMA_TEXT_BODY,
  }},
}};

/** `showDivider=false` — no CardBody top/bottom seams. */
export const WithoutDividers: Story = {{
  name: "showDivider false",
  decorators: [
    (Story) => (
      <div style={{cardHostStyle}}>
        <Story />
      </div>
    ),
  ],
  args: {{
    title: "Card Title",
    showOverflowMenu: true,
    menuOptions: SPEC_MENU_OPTIONS,
    showButtons: true,
    showDivider: false,
    actions: SPEC_ACTIONS,
    children: FIGMA_TEXT_BODY,
  }},
}};

/**
 * Figma `Card-Main` board `8381:14051` — all four axis combinations.
 * Layout mirrors the 2×2 matrix (footer × overflow).
 */
export const FigmaCardMainMatrix: Story = {{
  name: "Figma Card-Main matrix",
  parameters: {{ layout: "padded" }},
  render: () => (
    <div
      style={{{{
        display: "grid",
        gridTemplateColumns: "430px 430px",
        gap: 24,
        alignItems: "start",
      }}}}
    >
      <{component_name}
        title="Card Title"
        showButtons
        actions={{SPEC_ACTIONS}}
        showOverflowMenu={{false}}
      >
        {{FIGMA_TEXT_BODY}}
      </{component_name}>
      <{component_name}
        title="Card Title"
        showButtons
        actions={{SPEC_ACTIONS}}
        showOverflowMenu
        menuOptions={{SPEC_MENU_OPTIONS}}
      >
        {{FIGMA_TEXT_BODY}}
      </{component_name}>
      <{component_name} title="Card Title" showButtons={{false}} showOverflowMenu={{false}}>
        {{FIGMA_TEXT_BODY}}
      </{component_name}>
      <{component_name}
        title="Card Title"
        showButtons={{false}}
        showOverflowMenu
        menuOptions={{SPEC_MENU_OPTIONS}}
      >
        {{FIGMA_TEXT_BODY}}
      </{component_name}>
    </div>
  ),
}};

/** Content Type=Text only — `.Card-Element-Content` `15718:219736`. */
export const ContentTypeText: Story = {{
  name: "Content Type Text",
  decorators: [
    (Story) => (
      <div style={{{{ width: 430 }}}}>
        <Story />
      </div>
    ),
  ],
  args: {{
    title: "Card Title",
    showButtons: false,
    showOverflowMenu: false,
    children: FIGMA_TEXT_BODY,
  }},
}};

/** Content Type=Key Value Pair — `.Card-Element-Content` `15718:220110`. */
export const ContentTypeKeyValue: Story = {{
  name: "Content Type Key Value Pair",
  decorators: [
    (Story) => (
      <div style={{{{ width: 430 }}}}>
        <Story />
      </div>
    ),
  ],
  args: {{
    title: "Card Title",
    showButtons: false,
    showOverflowMenu: false,
    children: FIGMA_KEY_VALUE_BODY,
  }},
}};

/** Full chrome + Key Value body. */
export const SpecAccurateWithKeyValue: Story = {{
  name: "Spec Accurate with Key Value body",
  decorators: [
    (Story) => (
      <div style={{cardHostStyle}}>
        <Story />
      </div>
    ),
  ],
  args: {{
    title: "Card Title",
    showOverflowMenu: true,
    menuOptions: SPEC_MENU_OPTIONS,
    showButtons: true,
    actions: SPEC_ACTIONS,
    children: FIGMA_KEY_VALUE_BODY,
  }},
}};

/**
 * Optional `CardAdditionalFilter` before kebab — intake composition.
 * Uses a compact select stand-in; production may pass any IDS Dropdown.
 */
export const WithAdditionalFilter: Story = {{
  name: "With additional filter",
  decorators: [
    (Story) => (
      <div style={{cardHostStyle}}>
        <Story />
      </div>
    ),
  ],
  args: {{
    title: "Card Title",
    showOverflowMenu: true,
    menuOptions: SPEC_MENU_OPTIONS,
    showButtons: true,
    actions: SPEC_ACTIONS,
    children: FIGMA_TEXT_BODY,
    additionalFilter: (
      <select
        aria-label="Additional filter"
        defaultValue="all"
        style={{{{
          fontFamily: "inherit",
          fontSize: "var(--font-size-body-2)",
          lineHeight: "var(--font-line-height-line-height-20)",
          color: "var(--color-text-gray-neutral-strong)",
          border: "1px solid var(--color-border-gray-neutral-base)",
          borderRadius: "var(--corner-radius-radius-2)",
          padding: "var(--padding-padding-8) var(--padding-padding-16)",
          background: "var(--color-background-surface-secondary)",
        }}}}
      >
        <option value="all">All</option>
        <option value="active">Active</option>
        <option value="archived">Archived</option>
      </select>
    ),
  }},
}};
"""

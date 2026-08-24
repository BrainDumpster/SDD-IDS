from __future__ import annotations

from pathlib import Path
from typing import Optional

from generation.deterministic_storybook.ids.main_menu_left import _sync_angular_developer_usage_composition
from generation.deterministic_storybook.models import DeterministicStorybookOptions
from generation.deterministic_storybook.story_model import build_main_menu_left_story_model
from generation.spec_derived.main_menu_left_composition import emit_angular_primary_state_matrix
from validation.spec_contract_parser import SpecContract


def generate_ids_main_menu_left_story_angular(
    *,
    repo_root: Path,
    story_path: Path,
    contract: SpecContract,
    options: Optional[DeterministicStorybookOptions] = None,
) -> str:
    options = options or DeterministicStorybookOptions(framework="angular")
    model = build_main_menu_left_story_model(options=options)
    _sync_angular_developer_usage_composition(repo_root)
    state_matrix = emit_angular_primary_state_matrix()

    return f"""import {{ applicationConfig, moduleMetadata }} from "@storybook/angular";
import {{ provideZoneChangeDetection }} from "@angular/core";
import {{ SPEC_ACCURATE_DESIGN_STORY }} from "../../../compiled/component-contracts/common/story-meta.js";
import {{ MAIN_MENU_LEFT_SPEC_ACCURATE_DEFAULTS, MAIN_MENU_LEFT_SPEC_ACCURATE_ITEMS }} from "../../../compiled/component-contracts/ids/main-menu-left.contract.js";
import {{ IdsMainMenuLeftComponent }} from "../../../compiled/storybook-angular/src/components/ids-main-menu-left/ids-main-menu-left.component.js";
import {{ IDS_MAIN_MENU_LEFT_IMPORTS }} from "../../../compiled/storybook-angular/src/components/ids-main-menu-left/ids-main-menu-left.imports.js";
import {{
  MAIN_MENU_LEFT_COMPOSITION_DEMO_TEMPLATE,
  MAIN_MENU_LEFT_DOCS_DESCRIPTION,
  MAIN_MENU_LEFT_SOURCE_CODE,
  MAIN_MENU_LEFT_SPEC_ACCURATE_FRAME_TEMPLATE,
  MAIN_MENU_LEFT_STORY_FRAME_STYLES,
  MAIN_MENU_LEFT_STORY_SOURCE_CODE,
}} from "./ids-main-menu-left.developer-usage.js";

/** @type {{import("@storybook/angular").Meta<IdsMainMenuLeftComponent>}} */
const meta = {{
  title: "{model.title}",
  component: IdsMainMenuLeftComponent,
  tags: ["autodocs"],
  decorators: [
    applicationConfig({{ providers: [provideZoneChangeDetection()] }}),
    moduleMetadata({{ imports: [...IDS_MAIN_MENU_LEFT_IMPORTS] }}),
  ],
  parameters: {{
    layout: "fullscreen",
    docs: {{
      canvas: {{ sourceState: "open" }},
      description: {{ component: MAIN_MENU_LEFT_DOCS_DESCRIPTION }},
      source: {{ type: "code", language: "typescript", code: MAIN_MENU_LEFT_SOURCE_CODE }},
    }},
  }},
  argTypes: {{
    expanded: {{ control: "boolean" }},
    defaultSelectedItemId: {{ control: "text" }},
    forceStates: {{ control: "boolean" }},
    compositionMode: {{ control: "boolean" }},
  }},
}};

export default meta;

const specAccurateArgs = {{
  compositionMode: true,
  expanded: MAIN_MENU_LEFT_SPEC_ACCURATE_DEFAULTS.expanded,
  defaultSelectedItemId: MAIN_MENU_LEFT_SPEC_ACCURATE_DEFAULTS.defaultSelectedItemId,
  forceStates: false,
  ariaLabel: MAIN_MENU_LEFT_SPEC_ACCURATE_DEFAULTS.ariaLabel,
}};

/** @type {{import("@storybook/angular").StoryObj<IdsMainMenuLeftComponent>}} */
export const SpecAccurateDesign = {{
  name: SPEC_ACCURATE_DESIGN_STORY,
  parameters: {{
    docs: {{
      description: {{
        story:
          "Composition API — deterministic Item | Group(Item → Children → secondary Items); Figma `11099:56218`.",
      }},
      source: {{ type: "code", language: "html", code: MAIN_MENU_LEFT_STORY_SOURCE_CODE }},
    }},
  }},
  render: (args) => ({{
    props: args,
    styles: [MAIN_MENU_LEFT_STORY_FRAME_STYLES],
    template: MAIN_MENU_LEFT_SPEC_ACCURATE_FRAME_TEMPLATE,
  }}),
  args: specAccurateArgs,
}};

/** @type {{import("@storybook/angular").StoryObj<IdsMainMenuLeftComponent>}} */
export const Collapsed = {{
  render: (args) => ({{
    props: {{ ...args, expanded: false }},
    styles: [MAIN_MENU_LEFT_STORY_FRAME_STYLES],
    template: MAIN_MENU_LEFT_SPEC_ACCURATE_FRAME_TEMPLATE,
  }}),
  args: specAccurateArgs,
}};

/** @type {{import("@storybook/angular").StoryObj<IdsMainMenuLeftComponent>}} */
export const PrimaryStateSnapshotMatrix = {{
  render: () => ({{
    styles: [MAIN_MENU_LEFT_STORY_FRAME_STYLES],
    template: `
      <div class="ids-main-menu-left-state-matrix">
        <ids-main-menu-left [compositionMode]="true" [forceStates]="true" [expanded]="true">
{state_matrix}
        </ids-main-menu-left>
      </div>
    `,
  }}),
}};

/** @type {{import("@storybook/angular").StoryObj<IdsMainMenuLeftComponent>}} */
export const LegacyItemsAdapter = {{
  name: "Legacy items[] adapter",
  render: (args) => ({{
    props: {{ ...args, compositionMode: false }},
    styles: [MAIN_MENU_LEFT_STORY_FRAME_STYLES],
    template: `
      <div class="ids-main-menu-left-story-frame">
        <ids-main-menu-left
          [compositionMode]="false"
          [items]="items"
          [expanded]="expanded"
          [defaultSelectedItemId]="defaultSelectedItemId"
        />
        <div class="ids-main-menu-left-story-canvas"><p>Legacy programmatic <code>items[]</code> API.</p></div>
      </div>
    `,
  }}),
  args: {{
    ...specAccurateArgs,
    compositionMode: false,
    items: MAIN_MENU_LEFT_SPEC_ACCURATE_DEFAULTS.items,
  }},
}};
"""

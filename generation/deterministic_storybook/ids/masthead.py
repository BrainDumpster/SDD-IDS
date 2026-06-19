from __future__ import annotations

from pathlib import Path
from typing import Optional

from generation.deterministic_storybook.helpers import (
    prefixed_component_export_name,
    storybook_theme_import_line,
)
from generation.deterministic_storybook.models import DeterministicStorybookOptions
from validation.spec_contract_parser import SpecContract


def generate_ids_masthead_story(
    *,
    repo_root: Path,
    story_path: Path,
    contract: SpecContract,
    options: Optional[DeterministicStorybookOptions] = None,
) -> str:
    options = options or DeterministicStorybookOptions()
    component_name = prefixed_component_export_name("masthead", options.component_prefix)
    masthead_import_path = "../../../../storybook/src/components/IdsMasthead"
    app_launcher_import_path = "../../../../storybook/src/components/AppLauncher"
    icon_import_path = "../../../../storybook/src/components/Icon"

    design_spec_path = f"components/{options.design_system_slug}/masthead/design-spec.md"
    theme_import = storybook_theme_import_line(options.design_system_slug)
    return f"""import type {{ Meta, StoryObj }} from "@storybook/react";
import {{ IdsMasthead as {component_name}, IdsMastheadActionButtonContainer, IdsMastheadActionIconButton, IdsMastheadAvatar }} from "{masthead_import_path}";
import {{ AppLauncher }} from "{app_launcher_import_path}";
import {{ Icon }} from "{icon_import_path}";
import userIcon from "../../../../assets/icons/user-single-16.svg";
{theme_import}

const DESIGN_SPEC_PATH = "{design_spec_path}";
const helpIconEl = <Icon shapeName="help-circ-16" style={{{{ width: 16, height: 16 }}}} />;

const meta: Meta<typeof {component_name}> = {{
  title: "{options.title_prefix}/Masthead",
  component: {component_name},
  parameters: {{
    layout: "fullscreen",
    docs: {{
      description: {{
        component: [
          `Spec-driven IDS masthead. Source: \\`${{DESIGN_SPEC_PATH}}\\`.`,
          "Compose utility actions via `iconsSlot` — wire `onClick` on each child (no icon config array).",
          "See **Developer usage** and **Composed icons slot** for code panels (hand-maintained in storybook/src).",
        ].join(" "),
      }},
    }},
  }},
}};

export default meta;
type Story = StoryObj<typeof {component_name}>;

export const Default: Story = {{
  args: {{
    productName: "Synapse",
    iconsSlot: <IdsMastheadActionButtonContainer><IdsMastheadActionIconButton aria-label="Help" icon={{helpIconEl}} /></IdsMastheadActionButtonContainer>,
    avatarSlot: <IdsMastheadAvatar initials="YK" />,
  }},
}};

export const WithAppLauncherExample: Story = {{
  args: {{
    productName: "Synapse",
    iconsSlot: <IdsMastheadActionButtonContainer><IdsMastheadActionIconButton aria-label="Help" icon={{helpIconEl}} /></IdsMastheadActionButtonContainer>,
    appLauncherSlot: <AppLauncher triggerVariant="masthead" sideOffset={{0}} products={{[{{ id: "p1", name: "Product Name 1", href: "#" }}, {{ id: "p2", name: "Product Name 2", href: "#" }}]}} />,
    avatarSlot: <IdsMastheadAvatar initials="YK" />,
  }},
}};

export const UserIconAvatar: Story = {{
  args: {{
    productName: "Synapse",
    iconsSlot: <IdsMastheadActionButtonContainer><IdsMastheadActionIconButton aria-label="Help" icon={{helpIconEl}} /></IdsMastheadActionButtonContainer>,
    avatarSlot: <IdsMastheadAvatar imageSrc={{userIcon}} imageAlt="User profile" />,
  }},
}};
"""

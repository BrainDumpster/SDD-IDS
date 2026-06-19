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

    theme_import = storybook_theme_import_line(options.design_system_slug)
    return f"""import type {{ Meta, StoryObj }} from "@storybook/react";
import {{ IdsMasthead as {component_name}, IdsMastheadActionButtonContainer, IdsMastheadActionIconButton, IdsMastheadAvatar }} from "{masthead_import_path}";
import {{ AppLauncher }} from "{app_launcher_import_path}";
import {{ Icon }} from "{icon_import_path}";
{theme_import}

const icon16 = {{ width: 16, height: 16 }} as const;

const helpIcon = <Icon shapeName="help-circ-16" style={icon16} />;
const userIcon = (
  <Icon shapeName="user-single" color="var(--color-icon-white)" style={icon16} />
);

const productLogo = (
  <Icon
    shapeName="appic-dp-cloud-blue"
    variant="img"
    title="Product logo"
    style={{{{ width: 32, height: 32 }}}}
  />
);

const defaultHelpSlot = (
  <IdsMastheadActionButtonContainer>
    <IdsMastheadActionIconButton aria-label="Help" icon={{helpIcon}} />
  </IdsMastheadActionButtonContainer>
);

const defaultAppLauncher = (
  <AppLauncher
    triggerVariant="masthead"
    sideOffset={{0}}
    products={{[
      {{ id: "p1", name: "Product Name 1", href: "#" }},
      {{ id: "p2", name: "Product Name 2", href: "#" }},
    ]}}
  />
);

const meta: Meta<typeof {component_name}> = {{
  title: "{options.title_prefix}/Masthead",
  component: {component_name},
  parameters: {{ layout: "fullscreen" }},
}};

export default meta;
type Story = StoryObj<typeof {component_name}>;

/** Figma `User Settings=Initials` — 32×32 white ring, body-2 initials (sample "DT"). */
export const Default: Story = {{
  args: {{
    productName: "Synapse",
    iconsSlot: defaultHelpSlot,
    avatarSlot: <IdsMastheadAvatar initials="DT" aria-label="User settings" />,
  }},
}};

export const WithAppLauncherExample: Story = {{
  args: {{
    productName: "Synapse",
    iconsSlot: defaultHelpSlot,
    appLauncherSlot: defaultAppLauncher,
    avatarSlot: <IdsMastheadAvatar initials="DT" aria-label="User settings" />,
  }},
}};

/** Figma `Show Product Icon=Yes` — optional 32×32 product logo via Icon. */
export const WithProductLogo: Story = {{
  args: {{
    logo: productLogo,
    productName: "Product Name",
    iconsSlot: defaultHelpSlot,
    appLauncherSlot: defaultAppLauncher,
    avatarSlot: <IdsMastheadAvatar initials="DT" aria-label="User settings" />,
  }},
}};

/** Figma `User Settings=Icon` — 32×32 ring with `user-single` 16×16, `var(--color-icon-white)`. */
export const UserIconAvatar: Story = {{
  args: {{
    productName: "Synapse",
    iconsSlot: defaultHelpSlot,
    appLauncherSlot: defaultAppLauncher,
    avatarSlot: (
      <IdsMastheadAvatar icon={{userIcon}} aria-label="User settings" />
    ),
  }},
}};
"""

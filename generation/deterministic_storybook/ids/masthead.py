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
{theme_import}

const DESIGN_SPEC_PATH = "{design_spec_path}";
const icon16 = {{ width: 16, height: 16 }} as const;

const helpIcon = <Icon shapeName="help-circ-16" style={{icon16}} />;
const userIcon = (
  <Icon shapeName="user-single" color="var(--color-icon-white)" style={{icon16}} />
);

const productLogo = (
  <Icon
    shapeName="appic-dp-cloud-blue"
    variant="img"
    title="Product logo"
    style={{{{ width: 32, height: 32 }}}}
  />
);

/** Figma reference sample for `iconsSlot` — Storybook only; not a runtime default. */
const figmaSampleIconsSlot = (
  <IdsMastheadActionButtonContainer>
    <IdsMastheadActionIconButton
      aria-label="Search"
      icon={{<Icon shapeName="search-16" style={{icon16}} />}}
    />
    <IdsMastheadActionIconButton
      aria-label="Alerts, 3 unread"
      badgeCount={{3}}
      badgeType="critical"
      icon={{<Icon shapeName="alert-bell-16" style={{icon16}} />}}
    />
    <IdsMastheadActionIconButton
      aria-label="Jobs queue, 2 active"
      badgeCount={{2}}
      badgeType="success"
      icon={{<Icon shapeName="jobs-queue-stack" style={{icon16}} />}}
    />
    <IdsMastheadActionIconButton
      aria-label="Settings"
      icon={{<Icon shapeName="setting-gear-16" style={{icon16}} />}}
    />
    <IdsMastheadActionIconButton aria-label="Help" icon={{helpIcon}} />
  </IdsMastheadActionButtonContainer>
);

const sampleAppLauncher = (
  <AppLauncher
    triggerVariant="masthead"
    sideOffset={{0}}
    products={{[
      {{ id: "p1", name: "Product Name 1", href: "#" }},
      {{ id: "p2", name: "Product Name 2", href: "#" }},
    ]}}
  />
);

const sampleAvatar = <IdsMastheadAvatar initials="DT" aria-label="User settings" />;

const meta: Meta<typeof {component_name}> = {{
  title: "{options.title_prefix}/Masthead",
  component: {component_name},
  parameters: {{
    layout: "fullscreen",
    docs: {{
      description: {{
        component: [
          `Spec-driven IDS masthead. Source: \\`${{DESIGN_SPEC_PATH}}\\`.`,
          "Only `productName` is required. `logo`, `iconsSlot` (search/action icons), `appLauncherSlot`, and `avatarSlot` are optional host composition — omit any unused slot.",
          "See **Developer usage** and **Composed icons slot** for code panels (hand-maintained in storybook/src).",
        ].join(" "),
      }},
    }},
  }},
}};

export default meta;
type Story = StoryObj<typeof {component_name}>;

/** Spec default — product name only; no logo, search, action icons, launcher, or avatar. */
export const Default: Story = {{
  args: {{
    productName: "Product Name",
  }},
}};

/** Figma `Show Product Icon=Yes` — optional 32×32 product logo via Icon; other chrome still omitted. */
export const WithProductLogo: Story = {{
  args: {{
    logo: productLogo,
    productName: "Product Name",
  }},
}};

/** Optional `iconsSlot` — Figma reference action order (Storybook sample only). */
export const WithFigmaSampleActions: Story = {{
  name: "With Figma sample actions",
  args: {{
    productName: "Product Name",
    iconsSlot: figmaSampleIconsSlot,
  }},
}};

/** Optional `appLauncherSlot` only. */
export const WithAppLauncherExample: Story = {{
  args: {{
    productName: "Product Name",
    appLauncherSlot: sampleAppLauncher,
  }},
}};

/** Optional `avatarSlot` — Figma `User Settings=Initials`. */
export const WithAvatarInitials: Story = {{
  args: {{
    productName: "Product Name",
    avatarSlot: sampleAvatar,
  }},
}};

/** Optional `avatarSlot` — Figma `User Settings=Icon` (`user-single` 16×16). */
export const UserIconAvatar: Story = {{
  args: {{
    productName: "Product Name",
    avatarSlot: (
      <IdsMastheadAvatar icon={{userIcon}} aria-label="User settings" />
    ),
  }},
}};

/** Full host composition sample — all optional slots supplied by the consumer. */
export const FullHostComposition: Story = {{
  name: "Full host composition",
  args: {{
    logo: productLogo,
    productName: "Product Name",
    iconsSlot: figmaSampleIconsSlot,
    appLauncherSlot: sampleAppLauncher,
    avatarSlot: sampleAvatar,
  }},
}};
"""

from __future__ import annotations

from pathlib import Path
from typing import Optional

from generation.deterministic_storybook.helpers import (
    ensure_gate_coverage_comment,
    storybook_theme_import_line,
)
from generation.deterministic_storybook.models import DeterministicStorybookOptions
from validation.spec_contract_parser import SpecContract

DESIGN_SPEC_PATH = "components/ids/about/design-spec.md"


def generate_ids_about_story(
    *,
    repo_root: Path,
    story_path: Path,
    contract: SpecContract,
    options: Optional[DeterministicStorybookOptions] = None,
) -> str:
    del repo_root, story_path, contract
    options = options or DeterministicStorybookOptions()
    theme_import = storybook_theme_import_line(options.design_system_slug)

    text = f"""{theme_import}
import type {{ Meta, StoryObj }} from "@storybook/react";
import {{ About }} from "../../../../storybook/src/components/About";
import {{ Button }} from "../../../../storybook/src/components/Button";
import {{ Tabs }} from "../../../../storybook/src/components/Tabs";
import {{ Icon }} from "../../../../storybook/src/components/Icon";
import dellLogo from "../../../../assets/icons/logo-delltech-horiz.svg";

const productLogo = (
  <Icon
    shapeName="appic-dp-cloud-blue"
    variant="mask"
    color="var(--color-icon-brand-base)"
    size={{104}}
  />
);

const DESIGN_SPEC_PATH = "{DESIGN_SPEC_PATH}";

const meta: Meta<typeof About> = {{
  title: "{options.title_prefix}/About",
  component: About,
  parameters: {{
    layout: "centered",
    docs: {{
      description: {{
        component: [
          `Spec-driven IDS About dialog. Source: \\`${{DESIGN_SPEC_PATH}}\\`.`,
          "Modal About surface: product title, version, optional serial + copy, copyright paragraph, Close action.",
          "Theme: `components/ids-theme.css`.",
        ].join(" "),
      }},
    }},
  }},
}};

export default meta;
type Story = StoryObj<typeof About>;

/** Primary Spec Accurate Design — About dialog open with sample product metadata. */
export const SpecAccurateDesign: Story = {{
  name: "Spec Accurate Design",
  args: {{
    defaultOpen: true,
    productTitle: "Product Name",
    productLogo,
    logoSrc: dellLogo,
    versionLabel: "Version 1.0.0",
    showSerialNumber: true,
    serialNumber: "ELMCR00222GBPB",
    copyrightText:
      "Copyright © 2026. All rights reserved. This product is protected by copyright and other intellectual property laws.",
    closeLabel: "Close",
    trigger: <Button variant="secondary">Open About</Button>,
  }},
  render: (args) => (
    <div style={{{{ minHeight: 480, minWidth: 560, padding: 24 }}}}>
      <About {{...args}} />
    </div>
  ),
}};

/** About without the optional product icon (Figma `node 340:930`). */
export const WithoutProductIcon: Story = {{
  args: {{
    defaultOpen: true,
    productTitle: "Software Product Name",
    logoSrc: dellLogo,
    versionLabel: "Version 5.1.2 (Release 3120, Build 0123)",
    showSerialNumber: true,
    serialNumber: "1A2B3C4D5E6F7G",
    copyrightText:
      "Copyright © 2026. All rights reserved. This product is protected by copyright and other intellectual property laws.",
    closeLabel: "Close",
    trigger: <Button variant="secondary">Open About</Button>,
  }},
}};

/** Figma `Tabs=True` — header tab bar on the left, close on the right. */
export const WithTabs: Story = {{
  args: {{
    defaultOpen: true,
    productTitle: "Product Name",
    productLogo,
    logoSrc: dellLogo,
    versionLabel: "Version 1.0.0",
    showSerialNumber: true,
    serialNumber: "ELMCR00222GBPB",
    copyrightText:
      "Copyright © 2026. All rights reserved. This product is protected by copyright and other intellectual property laws.",
    closeLabel: "Close",
    trigger: <Button variant="secondary">Open About</Button>,
    tabs: (
      <Tabs
        variant="primary"
        surface="transparent"
        defaultActiveTabId="about"
        items={{[
          {{ id: "about", label: "About", panel: null }},
          {{ id: "t1", label: "Tab Option 1", panel: null }},
          {{ id: "t2", label: "Tab Option 2", panel: null }},
          {{ id: "t3", label: "Tab Option 3", panel: null }},
        ]}}
      />
    ),
  }},
  render: (args) => (
    <div style={{{{ minHeight: 560, minWidth: 720, padding: 24 }}}}>
      <About {{...args}} />
    </div>
  ),
}};
"""
    return ensure_gate_coverage_comment(text, "default hover focus-visible")

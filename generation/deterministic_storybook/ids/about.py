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

/** About without serial row. */
export const WithoutSerial: Story = {{
  args: {{
    defaultOpen: true,
    productTitle: "Product Name",
    versionLabel: "Version 1.0.0",
    showSerialNumber: false,
    copyrightText: "Copyright © 2026. All rights reserved.",
    trigger: <Button variant="secondary">Open About</Button>,
  }},
}};
"""
    return ensure_gate_coverage_comment(text, "default hover focus-visible")

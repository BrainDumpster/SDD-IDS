from __future__ import annotations

import json
from pathlib import Path
from typing import Optional

from generation.deterministic_storybook.helpers import (
    prefixed_component_export_name,
    storybook_theme_import_line,
    ts_array,
)
from generation.deterministic_storybook.models import DeterministicStorybookOptions
from validation.spec_contract_parser import SpecContract

# Canonical demo icon per spec asset contract (`assets/icons/<slug>.svg`).
_DEMO_ICON_SLUG = "settings-gear-detailed"


def _ids_state_harness_css(focus_outline_width: str) -> str:
    """StateHarness overrides match components/ids/button/design-spec.md token tables."""
    return f"""
        .sbSimButton[data-sim-state="hover"][data-sim-variant="primary"]:not(:disabled) {{
          background: var(--color-background-controls-brand-strong);
          border-color: var(--color-border-transparent-brand);
        }}
        .sbSimButton[data-sim-state="press"][data-sim-variant="primary"]:not(:disabled) {{
          background: var(--color-background-controls-brand-stronger);
          border-color: var(--color-border-transparent-brand);
        }}
        .sbSimButton[data-sim-state="hover"][data-sim-variant="secondary"]:not(:disabled) {{
          background: var(--color-background-controls-brand-lighter);
          border-color: var(--color-border-brand-base);
        }}
        .sbSimButton[data-sim-state="press"][data-sim-variant="secondary"]:not(:disabled) {{
          background: var(--color-background-controls-brand-light);
          border-color: var(--color-border-brand-base);
        }}
        .sbSimButton[data-sim-state="hover"][data-sim-variant="tertiary"]:not(:disabled) {{
          background: var(--color-background-controls-brand-lighter);
          border-color: var(--color-border-brand-base);
        }}
        .sbSimButton[data-sim-state="press"][data-sim-variant="tertiary"]:not(:disabled) {{
          background: var(--color-background-controls-brand-light);
          border-color: var(--color-border-brand-base);
        }}
        .sbSimButton[data-sim-state="hover"][data-sim-variant="destructive"]:not(:disabled) {{
          background: var(--color-background-alerting-critical-strong);
          border-color: var(--color-border-alerting-transparent-critical);
        }}
        .sbSimButton[data-sim-state="press"][data-sim-variant="destructive"]:not(:disabled) {{
          background: var(--color-background-alerting-critical-stronger);
          border-color: var(--color-border-alerting-transparent-critical);
        }}
        .sbSimButton[data-sim-state="focus-visible"]:not(:disabled) {{
          outline: {focus_outline_width} solid var(--color-border-brand-base);
          outline-offset: 3px;
        }}
"""


def generate_ids_button_story(
    *,
    repo_root: Path,
    story_path: Path,
    contract: SpecContract,
    options: Optional[DeterministicStorybookOptions] = None,
) -> str:
    options = options or DeterministicStorybookOptions()
    component_name = prefixed_component_export_name("button", options.component_prefix)
    import_symbol = "IdsButton"
    import_path = "../../../../storybook/src/components/IdsButton"
    if options.design_system_slug == "dap" and options.apply_program_deltas:
        import_symbol = "IdsButtonDap"
        import_path = "../../../../storybook/src/components/dap/IdsButtonDap"

    theme_import = storybook_theme_import_line(options.design_system_slug)
    focus_outline_width = (
        "var(--border-width-border-default)" if options.design_system_slug == "dap" else "var(--border-width-border-1)"
    )
    use_dap_sizes = options.apply_program_deltas and options.design_system_slug in ("dap", "powerflex")
    size_type = '"small" | "medium" | "large"' if use_dap_sizes else '"sm" | "md" | "lg"'
    size_options_json = json.dumps(["small", "medium", "large"] if use_dap_sizes else ["sm", "md", "lg"])
    # Spec API default: size large → implementation lg (sm/md/lg).
    default_size = "medium" if use_dap_sizes else "lg"
    icon_slug = _DEMO_ICON_SLUG

    variants = [v for v in (contract.variants or ["primary", "secondary", "tertiary", "destructive"]) if v]
    variants = [v for v in variants if v in {"primary", "secondary", "tertiary", "destructive"}] or [
        "primary",
        "secondary",
        "tertiary",
        "destructive",
    ]
    variant_union = " | ".join(json.dumps(v) for v in variants)
    variants_array = ts_array(variants)

    state_harness = ""
    if options.include_state_harness:
        harness_css = _ids_state_harness_css(focus_outline_width)
        state_harness = f"""

export const StateHarness: Story = {{
  render: () => (
    <motionless className="sbGrid">
      <ButtonStoryStyles />
      <style>{{`
        {harness_css}
      `}}</style>
      {{({variants_array} as const).map((variant) => (
        <motionless key={{variant}} className="sbRow">
          <motionless className="sbLabel">{{variant}}</motionless>
          <SimButton simVariant={{variant}} simState="default" variant={{variant}} size="{default_size}">Default</SimButton>
          <SimButton simVariant={{variant}} simState="hover" variant={{variant}} size="{default_size}">Hover</SimButton>
          <SimButton simVariant={{variant}} simState="press" variant={{variant}} size="{default_size}">Press</SimButton>
          <SimButton simVariant={{variant}} simState="focus-visible" variant={{variant}} size="{default_size}">Focus</SimButton>
          <SimButton simVariant={{variant}} simState="default" variant={{variant}} size="{default_size}" disabled>Disabled</SimButton>
        </motionless>
      ))}}
    </motionless>
  ),
}};
"""

    # Replace placeholder tag with div (avoid accidental invalid elements in f-string)
    state_harness = state_harness.replace("motionless", "div")

    icon_only_block = ""
    if use_dap_sizes:
        icon_only_block = f"""
      {{(["medium", "large"] as const).map((size) => (
        <div key={{size}} className="sbIconOnlyRow">
          {{({variants_array} as const).map((variant) => (
            <{component_name}
              key={{`${{variant}}-${{size}}`}}
              iconOnly
              size={{size}}
              variant={{variant}}
              iconSlug="{icon_slug}"
              aria-label={{`${{variant}} icon button ${{size}}`}}
            />
          ))}}
        </div>
      ))}}
"""
    else:
        icon_only_block = f"""
      {{(["md", "lg"] as const).map((size) => (
        <motionless key={{size}} className="sbIconOnlyRow">
          {{({variants_array} as const).map((variant) => (
            <{component_name}
              key={{`${{variant}}-${{size}}`}}
              iconOnly
              size={{size}}
              variant={{variant}}
              iconSlug="{icon_slug}"
              aria-label={{`${{variant}} icon button ${{size}}`}}
            />
          ))}}
        </motionless>
      ))}}
"""
    icon_only_block = icon_only_block.replace("motionless", "motionless")
    icon_only_block = icon_only_block.replace("motionless", "div")

    return f"""import type {{ Meta, StoryObj }} from "@storybook/react";
import type {{ ComponentProps }} from "react";
{theme_import}
import {{ {import_symbol} as {component_name} }} from "{import_path}";

type Variant = {variant_union};
type Size = {size_type};

const DEMO_ICON_SLUG = "{icon_slug}";

function ButtonStoryStyles() {{
  return (
    <style>{{`
      .sbVariantGrid {{
        display: grid;
        grid-template-columns: repeat(2, max-content);
        gap: 12px;
        align-items: center;
      }}
      .sbSizeRow {{
        display: flex;
        gap: 12px;
        align-items: center;
        flex-wrap: wrap;
      }}
      .sbIconOnlyGrid {{
        display: grid;
        gap: 12px;
      }}
      .sbIconOnlyRow {{
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
        align-items: center;
      }}
      .sbGrid {{
        display: grid;
        gap: 16px;
      }}
      .sbRow {{
        display: grid;
        grid-template-columns: 140px repeat(5, max-content);
        gap: 12px;
        align-items: center;
      }}
      .sbLabel {{
        font-size: 12px;
        opacity: 0.8;
        text-transform: capitalize;
      }}
    `}}</style>
  );
}}

const meta: Meta<typeof {component_name}> = {{
  title: "{options.title_prefix}/Button",
  component: {component_name},
  parameters: {{
    layout: "centered",
    docs: {{
      description: {{
        component:
          "IDS Button per components/ids/button/design-spec.md. Theme: components/ids-theme.css. Default size: large (lg). Icon slug resolves from assets/icons/<slug>.svg.",
      }},
    }},
  }},
  argTypes: {{
    variant: {{ control: "select", options: {variants_array} }},
    size: {{ control: "select", options: {size_options_json} }},
    iconSlug: {{ control: "text" }},
    disabled: {{ control: "boolean" }},
    loading: {{ control: "boolean" }},
    iconOnly: {{ control: "boolean" }},
    children: {{ control: "text" }},
  }},
  args: {{
    variant: "primary",
    size: "{default_size}",
    disabled: false,
    loading: false,
    iconOnly: false,
    children: "Button",
  }},
}};

export default meta;
type Story = StoryObj<typeof {component_name}>;

function SimButton(
  props: ComponentProps<typeof {component_name}> & {{
    simState?: "default" | "hover" | "press" | "focus-visible";
    simVariant?: Variant;
  }},
) {{
  const {{ simState = "default", simVariant, className, ...rest }} = props;
  return (
    <{component_name}
      {{...rest}}
      data-sim-state={{simState}}
      data-sim-variant={{simVariant ?? (rest.variant as Variant | undefined) ?? "primary"}}
      className={{["sbSimButton", className].filter(Boolean).join(" ")}}
    />
  );
}}

/** Canonical spec defaults: primary, large, interactive (Figma 41894:116183 / matrix 9662:25120). */
export const SpecAccurateDesign: Story = {{
  args: {{
    variant: "primary",
    size: "{default_size}",
    children: "Button",
    disabled: false,
    loading: false,
    iconOnly: false,
  }},
}};

export const Playground: Story = {{
  render: (args) => (
    <{component_name}
      {{...args}}
      aria-label={{args.iconOnly ? (args["aria-label"] as string | undefined) ?? "Icon only button" : undefined}}
      iconSlug={{args.iconOnly || args.iconSlug ? (args.iconSlug as string | undefined) ?? DEMO_ICON_SLUG : undefined}}
    />
  ),
}};

export const Variants: Story = {{
  render: () => (
  <motionless>
      <ButtonStoryStyles />
      <motionless className="sbVariantGrid">
        <{component_name} variant="primary" size="{default_size}">Primary</{component_name}>
        <{component_name} variant="secondary" size="{default_size}">Secondary</{component_name}>
        <{component_name} variant="tertiary" size="{default_size}">Tertiary</{component_name}>
        <{component_name} variant="destructive" size="{default_size}">Destructive</{component_name}>
      </motionless>
    </motionless>
  ),
}};

export const Sizes: Story = {{
  render: () => (
    <motionless>
      <ButtonStoryStyles />
      <motionless className="sbSizeRow">
        <{component_name} variant="primary" size="{"small" if use_dap_sizes else "sm"}">Small</{component_name}>
        <{component_name} variant="primary" size="{"medium" if use_dap_sizes else "md"}">Medium</{component_name}>
        <{component_name} variant="primary" size="{"large" if use_dap_sizes else "lg"}">Large</{component_name}>
      </motionless>
    </motionless>
  ),
}};

export const Disabled: Story = {{
  render: () => (
    <motionless>
      <ButtonStoryStyles />
      <motionless className="sbVariantGrid">
        <{component_name} variant="primary" size="{default_size}" disabled>Primary</{component_name}>
        <{component_name} variant="secondary" size="{default_size}" disabled>Secondary</{component_name}>
        <{component_name} variant="tertiary" size="{default_size}" disabled>Tertiary</{component_name}>
        <{component_name} variant="destructive" size="{default_size}" disabled>Destructive</{component_name}>
      </motionless>
    </motionless>
  ),
}};

export const Loading: Story = {{
  render: () => (
    <motionless>
      <ButtonStoryStyles />
      <motionless className="sbVariantGrid">
        <{component_name} variant="primary" size="{default_size}" loading>Primary</{component_name}>
        <{component_name} variant="secondary" size="{default_size}" loading>Secondary</{component_name}>
      </motionless>
    </motionless>
  ),
}};

export const IconWithLabel: Story = {{
  render: () => (
    <motionless>
      <ButtonStoryStyles />
      <motionless className="sbVariantGrid">
        <{component_name} variant="primary" size="{default_size}" iconSlug={{DEMO_ICON_SLUG}}>Primary</{component_name}>
        <{component_name} variant="secondary" size="{default_size}" iconSlug={{DEMO_ICON_SLUG}}>Secondary</{component_name}>
        <{component_name} variant="tertiary" size="{default_size}" iconSlug={{DEMO_ICON_SLUG}}>Tertiary</{component_name}>
        <{component_name} variant="destructive" size="{default_size}" iconSlug={{DEMO_ICON_SLUG}}>Destructive</{component_name}>
      </motionless>
    </motionless>
  ),
}};

export const IconOnly: Story = {{
  render: () => (
    <motionless>
      <ButtonStoryStyles />
      <motionless className="sbIconOnlyGrid">
{icon_only_block}
      </motionless>
    </motionless>
  ),
}};
{state_harness}
""".replace("motionless", "div")

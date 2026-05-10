from __future__ import annotations

import json
from pathlib import Path
from typing import Optional

from generation.deterministic_storybook.helpers import prefixed_component_export_name, ts_array
from generation.deterministic_storybook.models import DeterministicStorybookOptions
from validation.spec_contract_parser import SpecContract


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
        # DAP button deltas are implemented in wrapper component.
        import_symbol = "IdsButtonDap"
        import_path = "../../../../storybook/src/components/dap/IdsButtonDap"
    icon_import_path = "../../../../storybook/src/components/Icon"

    focus_outline_width = (
        "var(--border-width-border-default)"
        if options.design_system_slug in ("dap", "ids-ai")
        else "var(--border-width-border-1)"
    )
    use_dap_sizes = options.design_system_slug == "dap" and options.apply_program_deltas
    size_type = '"small" | "medium" | "large"' if use_dap_sizes else '"sm" | "md" | "lg"'
    size_options_json = json.dumps(["small", "medium", "large"] if use_dap_sizes else ["sm", "md", "lg"])
    default_size = "medium" if use_dap_sizes else "md"
    icon_only_size = "medium" if use_dap_sizes else "md"

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
        state_harness = f"""

export const StateHarness: Story = {{
  render: () => (
    <div className="sbGrid">
      <style>{{
        `
        .sbGrid {{
          display: grid;
          gap: 16px;
        }}
        .sbRow {{
          display: grid;
          grid-template-columns: 140px repeat(4, max-content);
          gap: 12px;
          align-items: center;
        }}
        .sbLabel {{
          font-size: 12px;
          opacity: 0.8;
          text-transform: capitalize;
        }}
        .sbSimButton[data-sim-state="hover"][data-sim-variant="primary"]:not(:disabled) {{
          background: var(--color-background-controls-brand-strong);
        }}
        .sbSimButton[data-sim-state="press"][data-sim-variant="primary"]:not(:disabled) {{
          background: var(--color-background-controls-brand-stronger);
        }}
        .sbSimButton[data-sim-state="hover"][data-sim-variant="secondary"]:not(:disabled) {{
          background: var(--color-background-brand-lighter);
        }}
        .sbSimButton[data-sim-state="press"][data-sim-variant="secondary"]:not(:disabled) {{
          background: var(--color-background-brand-light);
        }}
        .sbSimButton[data-sim-state="hover"][data-sim-variant="tertiary"]:not(:disabled),
        .sbSimButton[data-sim-state="press"][data-sim-variant="tertiary"]:not(:disabled) {{
          border-color: var(--color-border-brand-base);
        }}
        .sbSimButton[data-sim-state="hover"][data-sim-variant="tertiary"]:not(:disabled) {{
          background: var(--color-background-brand-lighter);
        }}
        .sbSimButton[data-sim-state="press"][data-sim-variant="tertiary"]:not(:disabled) {{
          background: var(--color-background-brand-light);
        }}
        .sbSimButton[data-sim-state="hover"][data-sim-variant="destructive"]:not(:disabled) {{
          background: var(--alert-red-600);
        }}
        .sbSimButton[data-sim-state="press"][data-sim-variant="destructive"]:not(:disabled) {{
          background: var(--alert-red-700);
        }}
        .sbSimButton[data-sim-state="focus-visible"]:not(:disabled) {{
          outline: {focus_outline_width} solid var(--color-border-brand-base);
          outline-offset: 3px;
        }}
        `
      }}</style>

      {{({variants_array} as const).map((variant) => (
        <div key={{variant}} className="sbRow">
          <div className="sbLabel">{{variant}}</div>
          <SimButton simVariant={{variant}} simState="default" variant={{variant}}>Default</SimButton>
          <SimButton simVariant={{variant}} simState="hover" variant={{variant}}>Hover</SimButton>
          <SimButton simVariant={{variant}} simState="press" variant={{variant}}>Press</SimButton>
          <SimButton simVariant={{variant}} simState="focus-visible" variant={{variant}}>Focus</SimButton>
        </div>
      ))}}
    </div>
  ),
}};
"""

    return f"""import type {{ Meta, StoryObj }} from "@storybook/react";
import type {{ ComponentProps }} from "react";
import {{ {import_symbol} as {component_name} }} from "{import_path}";
import {{ Icon }} from "{icon_import_path}";

type Variant = {variant_union};
type Size = {size_type};

const meta: Meta<typeof {component_name}> = {{
  title: "{options.title_prefix}/Button",
  component: {component_name},
  parameters: {{ layout: "centered" }},
  argTypes: {{
    variant: {{ control: "select", options: {variants_array} }},
    size: {{ control: "select", options: {size_options_json} }},
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

export const Playground: Story = {{
  render: (args) => (
    <{component_name}
      {{...args}}
      aria-label={{args.iconOnly ? "Icon only button" : undefined}}
      icon={{args.iconOnly || args.iconSlug ? <Icon shapeName="docs-bundle" variant="mask" /> : undefined}}
    />
  ),
}};

export const Variants: Story = {{
  render: () => (
    <div className="sbVariantGrid">
      <{component_name} variant="primary">Primary</{component_name}>
      <{component_name} variant="secondary">Secondary</{component_name}>
      <{component_name} variant="tertiary">Tertiary</{component_name}>
      <{component_name} variant="destructive">Destructive</{component_name}>
    </div>
  ),
}};

export const Disabled: Story = {{
  render: () => (
    <div className="sbVariantGrid">
      <{component_name} variant="primary" disabled>Primary</{component_name}>
      <{component_name} variant="secondary" disabled>Secondary</{component_name}>
      <{component_name} variant="tertiary" disabled>Tertiary</{component_name}>
      <{component_name} variant="destructive" disabled>Destructive</{component_name}>
    </div>
  ),
}};

export const IconWithLabel: Story = {{
  render: () => (
    <div className="sbVariantGrid">
      <{component_name} icon={{<Icon shapeName="docs-bundle" variant="mask" />}}>Primary</{component_name}>
      <{component_name} variant="secondary" icon={{<Icon shapeName="status-ok-circ-solid" variant="img" />}}>
        Secondary
      </{component_name}>
      <{component_name} variant="tertiary" icon={{<Icon shapeName="state-progress-circle" variant="img" />}}>
        Tertiary
      </{component_name}>
      <{component_name} variant="destructive" icon={{<Icon shapeName="status-critical-square-solid" variant="img" />}}>
        Destructive
      </{component_name}>
    </div>
  ),
}};

export const IconOnly: Story = {{
  render: () => (
    <div className="sbIconOnlyGrid">
      <{component_name} iconOnly size="{icon_only_size}" aria-label="Primary icon button" icon={{<Icon shapeName="docs-bundle" variant="mask" />}} />
      <{component_name}
        iconOnly
        size="{icon_only_size}"
        aria-label="Secondary icon button"
        variant="secondary"
        icon={{<Icon shapeName="status-ok-circ-solid" variant="img" />}}
      />
      <{component_name}
        iconOnly
        size="{icon_only_size}"
        aria-label="Tertiary icon button"
        variant="tertiary"
        icon={{<Icon shapeName="state-progress-circle" variant="img" />}}
      />
    </div>
  ),
}};

export const LayoutTokens: Story = {{
  render: () => (
    <style>{{
      `
      .sbVariantGrid {{
        display: grid;
        grid-template-columns: repeat(2, max-content);
        gap: 12px;
      }}
      .sbIconOnlyGrid {{
        display: grid;
        grid-template-columns: repeat(3, max-content);
        gap: 12px;
      }}
      `
    }}</style>
  ),
}};
{state_harness}
"""

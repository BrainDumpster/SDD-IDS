from __future__ import annotations

import json

from generation.deterministic_storybook.story_model import StoryModel


def emit_angular_csf(
    *,
    model: StoryModel,
    component_import_path: str,
    component_class_name: str,
    theme_import_line: str = "",
    docs_description: str | None = None,
) -> str:
    """Emit Angular Storybook CSF3 for Spec Accurate Design (pilot scope)."""
    docs = docs_description or model.docs_description
    contract_module = f"@component-contracts/ids/{model.component_slug}.contract"
    if model.design_system_slug == "dap" and "dap" in model.contract_import_path:
        contract_module = "@component-contracts/dap/button.contract"

    arg_types_lines = []
    for key, meta in model.arg_types.items():
        options = meta.get("options")
        if options is not None:
            arg_types_lines.append(
                f"    {key}: {{ control: {json.dumps(meta['control'])}, "
                f"options: {json.dumps(options)} }},"
            )
        else:
            arg_types_lines.append(
                f"    {key}: {{ control: {json.dumps(meta['control'])} }},"
            )
    arg_types_block = "\n".join(arg_types_lines)

    defaults = model.contract_defaults_symbol
    label_key = "label" if "label" in model.args else "children"

    extra_contract_imports = ""
    developer_usage_import = ""
    story_docs_params = ""
    extra_router_import = ""
    extra_router_provider = ""
    extra_stories = ""
    docs_params = f"""    docs: {{
      description: {{
        component: "{docs}",
      }},
    }},"""

    if defaults == "BUTTON_SPEC_ACCURATE_DEFAULTS":
        args_block = f"""    variant: {defaults}.variant,
    size: {defaults}.size,
    {label_key}: {defaults}.children,
    disabled: {defaults}.disabled,
    loading: {defaults}.loading,
    iconOnly: {defaults}.iconOnly,
    iconSlug: {defaults}.iconSlug,"""
        layout = "centered"
        imports_block = f"[{component_class_name}]"
    elif defaults == "BADGE_SPEC_ACCURATE_DEFAULTS":
        args_block = f"""    value: {defaults}.value,
    type: {defaults}.type,
    ariaLabel: {defaults}.ariaLabel,"""
        layout = "centered"
        imports_block = f"[{component_class_name}]"
    elif defaults == "ACCORDION_SPEC_ACCURATE_DEFAULTS":
        args_block = f"""    multiple: {defaults}.multiple,
    defaultValue: [...{defaults}.defaultValue],
    chevronPosition: {defaults}.chevronPosition,
    variant: {defaults}.variant,"""
        layout = "padded"
        developer_usage_import = """
import { IDS_ACCORDION_IMPORTS } from "../../../compiled/storybook-angular/src/components/ids-accordion/ids-accordion.imports.js";
import {
  ACCORDION_COMPOSITION_DEMO_TEMPLATE,
  ACCORDION_DOCS_DESCRIPTION,
  ACCORDION_SOURCE_CODE,
  ACCORDION_STORY_SOURCE_CODE,
} from "./ids-accordion.developer-usage.js";"""
        docs_params = """    docs: {
      canvas: { sourceState: "open" },
      description: { component: ACCORDION_DOCS_DESCRIPTION },
      source: {
        type: "code",
        language: "typescript",
        code: ACCORDION_SOURCE_CODE,
      },
    },"""
        story_docs_params = """  parameters: {
    docs: {
      description: {
        story:
          "Spec Accurate Design: single-expand, first panel open (`section1`), left chevron, default variant — composition markup.",
      },
      source: {
        type: "code",
        language: "html",
        code: ACCORDION_STORY_SOURCE_CODE,
      },
    },
  },
  render: (args) => ({
    props: {
      ...args,
      valueChange: (open) => {
        args.valueChange?.(open);
      },
    },
    template: ACCORDION_COMPOSITION_DEMO_TEMPLATE,
  }),"""
        imports_block = "[...IDS_ACCORDION_IMPORTS]"
    elif defaults == "ALERT_SPEC_ACCURATE_DEFAULTS":
        args_block = f"""    display: {defaults}.display,
    severity: {defaults}.severity,
    density: {defaults}.density,
    messageText: {defaults}.message,
    dismissible: {defaults}.dismissible,
    title: "",
    linkLabel: "",
    linkHref: "",
    actionLabel: "","""
        layout = "padded"
        developer_usage_import = """
import { IDS_ALERT_IMPORTS } from "../../../compiled/storybook-angular/src/components/ids-alert/ids-alert.imports.js";
import {
  ALERT_COMPOSITION_DEMO_TEMPLATE,
  ALERT_DOCS_DESCRIPTION,
  ALERT_MULTIPLE_GROUP_SOURCE_CODE,
  ALERT_MULTIPLE_GROUP_TEMPLATE,
  ALERT_SOURCE_CODE,
  ALERT_STORY_SOURCE_CODE,
} from "./ids-alert.developer-usage.js";"""
        docs_params = """    docs: {
      canvas: { sourceState: "open" },
      description: { component: ALERT_DOCS_DESCRIPTION },
      source: {
        type: "code",
        language: "typescript",
        code: ALERT_SOURCE_CODE,
      },
    },"""
        story_docs_params = """  parameters: {
    docs: {
      description: {
        story:
          "Spec Accurate Design: inline · informational · compact · dismissible — composition markup with `ids-alert-message`.",
      },
      source: {
        type: "code",
        language: "html",
        code: ALERT_STORY_SOURCE_CODE,
      },
    },
  },
  render: (args) => ({
    props: {
      ...args,
      dismiss: () => {
        args.dismiss?.();
      },
    },
    template: ALERT_COMPOSITION_DEMO_TEMPLATE,
  }),"""
        imports_block = "[...IDS_ALERT_IMPORTS]"
        extra_stories = """
/** @type {import("@storybook/angular").StoryObj<IdsAlertComponent>} */
export const MultipleAlerts = {
  name: "Multiple Alerts (Global Carousel)",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story:
          "Global multi-alert composition: `ids-alert-group` owns carousel state and renders one internal `ids-alert` banner bound to the active `ids-alert-item` (maps to Clarity `clr-alerts` + pager).",
      },
      source: {
        type: "code",
        language: "html",
        code: ALERT_MULTIPLE_GROUP_SOURCE_CODE,
      },
    },
  },
  render: () => ({
    template: ALERT_MULTIPLE_GROUP_TEMPLATE,
  }),
};"""
    else:
        args_block = f"""    variant: {defaults}.variant,
    size: "{model.args.get('size', 'lg')}",
    {label_key}: "{model.args.get(label_key, 'Button')}",
    disabled: {defaults}.disabled,
    loading: false,
    iconOnly: {defaults}.iconOnly,
    iconSlug: "{model.args.get('iconSlug', 'settings-gear-detailed')}","""
        layout = "centered"
        imports_block = f"[{component_class_name}]"

    component_import = (
        f"../../../compiled/storybook-angular/src/components/ids-{model.component_slug}/"
        f"ids-{model.component_slug}.component.js"
    )

    return f"""import {{ applicationConfig, moduleMetadata }} from "@storybook/angular";
import {{ provideZoneChangeDetection }} from "@angular/core";
{extra_router_import}import {{ SPEC_ACCURATE_DESIGN_STORY }} from "../../../compiled/component-contracts/common/story-meta.js";
import {{{extra_contract_imports}
  {defaults},
}} from "../../../compiled/component-contracts/ids/{model.component_slug}.contract.js";
import {{ {component_class_name} }} from "{component_import}";{developer_usage_import}

/** @type {{import("@storybook/angular").Meta<{component_class_name}>}} */
const meta = {{
  title: "{model.title}",
  component: {component_class_name},
  tags: ["autodocs"],
  decorators: [
    applicationConfig({{
      providers: [provideZoneChangeDetection(){extra_router_provider}],
    }}),
    moduleMetadata({{
      imports: {imports_block},
    }}),
  ],
  parameters: {{
    layout: "{layout}",
{docs_params}
  }},
  argTypes: {{
{arg_types_block}
  }},
}};

export default meta;

/** @type {{import("@storybook/angular").StoryObj<{component_class_name}>}} */
export const SpecAccurateDesign = {{
  name: SPEC_ACCURATE_DESIGN_STORY,
{story_docs_params}
  args: {{
{args_block}
  }},
}};
{extra_stories}"""

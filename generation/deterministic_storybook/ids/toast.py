from __future__ import annotations

import json
from pathlib import Path
from typing import Optional

from generation.deterministic_storybook.models import DeterministicStorybookOptions
from generation.spec_derived.toast import parse_toast_spec
from validation.spec_contract_parser import SpecContract

# IDS: `strict_spec_storybook_gate --deterministic-story` can sync `Toast.module.css` from the layered IDS toast spec
# via `generation.spec_derived.toast`. Stories embed a layout snapshot for QA (see `LayoutFromSpec`).

_DEFAULT_TOAST_VARIANTS = ["info", "critical", "major-warning", "minor-warning", "success"]


def generate_ids_toast_story(
    *,
    repo_root: Path,
    story_path: Path,
    contract: SpecContract,
    options: Optional[DeterministicStorybookOptions] = None,
) -> str:
    options = options or DeterministicStorybookOptions()
    import_path = "../../../../storybook/src/components/Toast"
    button_import_path = "../../../../storybook/src/components/IdsButton"
    variant_options = contract.variants if contract.variants else list(_DEFAULT_TOAST_VARIANTS)
    variant_options_json = json.dumps(variant_options)

    demo_message = "This is a temporary and brief notification following a user action."
    demo_link = "View Details"
    demo_duration = 8000
    if options.spec_text.strip():
        try:
            tmodel = parse_toast_spec(options.spec_text)
            demo_message = tmodel.default_message
            demo_link = tmodel.default_link_label
            demo_duration = tmodel.default_duration
        except Exception:
            pass
    demo_message_json = json.dumps(demo_message)
    demo_link_json = json.dumps(demo_link)

    spec_layout_json = json.dumps(
        {
            "rootBorderRadius": "--corner-radius-radius-8",
            "rootBackground": "--color-static-gray-900",
            "rootBorderColor": "--color-border-white",
            "rootRowGap": "--spacing-space-32",
            "contentGap": "--spacing-space-8",
            "actionGap": "--spacing-space-24",
            "borderWidth": "--border-width-border-default",
        },
        indent=2,
    )
    if options.spec_text.strip():
        try:
            tm = parse_toast_spec(options.spec_text)
            spec_layout_json = json.dumps(
                {
                    "rootBorderRadius": tm.root_radius,
                    "rootBackground": tm.root_background,
                    "rootBorderColor": tm.root_border_color,
                    "rootRowGap": tm.root_row_gap,
                    "contentGap": tm.content_gap,
                    "actionGap": tm.action_gap,
                    "borderWidth": tm.border_width,
                },
                indent=2,
            )
        except Exception:
            pass

    return f"""import type {{ Meta, StoryObj }} from "@storybook/react";
import {{
  ToastSetup,
  type ToastPosition,
  type ToastVariant,
  useToast,
}} from "{import_path}";
import {{ IdsButton }} from "{button_import_path}";

interface ToastStoryArgs {{
  variant: ToastVariant;
  message: string;
  showLink: boolean;
  closable: boolean;
  linkLabel: string;
  position: ToastPosition;
  duration: number;
}}

const meta: Meta<ToastStoryArgs> = {{
  title: "{options.title_prefix}/Toast",
  args: {{
    variant: "info",
    message: {demo_message_json},
    showLink: true,
    closable: true,
    linkLabel: {demo_link_json},
    position: "top-right",
    duration: {demo_duration},
  }},
  argTypes: {{
    variant: {{
      control: "select",
      options: {variant_options_json},
    }},
    message: {{ control: "text" }},
    showLink: {{ control: "boolean" }},
    closable: {{ control: "boolean" }},
    linkLabel: {{ control: "text" }},
    position: {{
      control: "select",
      options: [
        "top-left",
        "top-center",
        "top-right",
        "bottom-left",
        "bottom-center",
        "bottom-right",
      ],
    }},
    duration: {{ control: {{ type: "number", min: 0, step: 500 }} }},
  }},
  decorators: [
    (Story, ctx) => (
      <ToastSetup position={{ctx.args.position}} duration={{ctx.args.duration}}>
        <Story />
      </ToastSetup>
    ),
  ],
}};

export default meta;
type Story = StoryObj<ToastStoryArgs>;

function getToastType(variant: ToastVariant): "info" | "success" | "warning" | "error" {{
  if (variant === "critical") return "error";
  if (variant === "success") return "success";
  if (variant === "info") return "info";
  return "warning";
}}

const TOAST_VARIANTS: ToastVariant[] = {variant_options_json};

const SPEC_LAYOUT = {spec_layout_json} as const;

function ToastDemo(args: ToastStoryArgs) {{
  const toastManager = useToast();
  const {{ variant, message, showLink, closable, linkLabel, duration }} = args;

  const showToast = () => {{
    toastManager.add({{
      description: message,
      type: getToastType(variant),
      data: {{
        variant,
        showLink,
        closable,
        linkLabel,
        duration,
      }},
    }});
  }};

  return (
    <div className="sbToastRow">
      <IdsButton variant="secondary" onClick={{showToast}}>
        Show Toast
      </IdsButton>
    </div>
  );
}}

export const Playground: Story = {{
  render: (args) => <ToastDemo {{...args}} />,
}};

export const AlertingTypes: Story = {{
  args: {{
    closable: false,
  }},
  render: () => {{
    const toastManager = useToast();
    return (
      <div className="sbToastRow">
        {{TOAST_VARIANTS.map((variant) => (
          <IdsButton
            key={{variant}}
            variant="secondary"
            onClick={{() =>
              toastManager.add({{
                description: `${{variant[0].toUpperCase()}}${{variant.slice(1)}} toast`,
                type: getToastType(variant),
                data: {{
                  variant,
                  showLink: true,
                  closable: true,
                  linkLabel: {demo_link_json},
                }},
              }})
            }}
          >
            {{variant}}
          </IdsButton>
        ))}}
      </div>
    );
  }},
}};

export const QueueAndStack: Story = {{
  args: {{
    showLink: false,
    closable: true,
  }},
  render: (args) => {{
    const toastManager = useToast();

    const enqueueFive = () => {{
      TOAST_VARIANTS.forEach((variant, index) => {{
        toastManager.add({{
          description: `Queue item ${{index + 1}}: ${{variant}}`,
          type: getToastType(variant),
          data: {{
            variant,
            showLink: args.showLink,
            closable: args.closable,
            linkLabel: args.linkLabel,
            duration: args.duration,
          }},
        }});
      }});
    }};

    return (
      <div className="sbToastRow">
        <IdsButton variant="secondary" onClick={{enqueueFive}}>
          Enqueue 5 Toasts
        </IdsButton>
      </div>
    );
  }},
}};

export const PositionMatrix: Story = {{
  render: () => {{
    const toastManager = useToast();
    const positions: ToastPosition[] = [
      "top-left",
      "top-center",
      "top-right",
      "bottom-left",
      "bottom-center",
      "bottom-right",
    ];
    return (
      <div className="sbToastRow">
        {{positions.map((position) => (
          <IdsButton
            key={{position}}
            variant="secondary"
            onClick={{() =>
              toastManager.add({{
                description: `Position demo: ${{position}}`,
                type: "info",
                data: {{
                  variant: "info",
                  showLink: false,
                  closable: true,
                }},
              }})
            }}
          >
            {{position}}
          </IdsButton>
        ))}}
      </div>
    );
  }},
}};

export const LayoutFromSpec: Story = {{
  render: () => (
    <div className="sbToastWrap">
      <style>{{
        `
        .sbToastWrap {{ font-family: system-ui, sans-serif; padding: 8px; }}
        .sbToastRow {{
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }}
        `
      }}</style>
      <p style={{{{ fontSize: 13, margin: "0 0 8px" }}}}>
        Toast root chrome — token snapshot baked at codegen from <code>design-spec.mdx</code> (includes{" "}
        <strong>border radius</strong>).
      </p>
      <pre style={{{{ fontSize: 11, margin: "0 0 12px", whiteSpace: "pre-wrap" }}}}>
        {{JSON.stringify(SPEC_LAYOUT, null, 2)}}
      </pre>
      <div
        aria-label="Toast shell preview (radius + border + fill)"
        style={{{{
          boxSizing: "border-box",
          width: "100%",
          maxWidth: 420,
          height: 48,
          borderWidth: `var(${{SPEC_LAYOUT.borderWidth}})`,
          borderStyle: "solid",
          borderColor: `var(${{SPEC_LAYOUT.rootBorderColor}})`,
          borderRadius: `var(${{SPEC_LAYOUT.rootBorderRadius}})`,
          background: `var(${{SPEC_LAYOUT.rootBackground}})`,
        }}}}
      />
    </div>
  ),
}};
"""

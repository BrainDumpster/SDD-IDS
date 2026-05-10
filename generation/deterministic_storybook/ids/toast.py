from __future__ import annotations

from pathlib import Path
from typing import Optional

from generation.deterministic_storybook.helpers import prefixed_component_export_name
from generation.deterministic_storybook.models import DeterministicStorybookOptions
from validation.spec_contract_parser import SpecContract


def generate_ids_toast_story(
    *,
    repo_root: Path,
    story_path: Path,
    contract: SpecContract,
    options: Optional[DeterministicStorybookOptions] = None,
) -> str:
    options = options or DeterministicStorybookOptions()
    component_name = prefixed_component_export_name("toast", options.component_prefix)
    import_path = "../../../../storybook/src/components/Toast"
    button_import_path = "../../../../storybook/src/components/IdsButton"

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
    message: "This is a temporary and brief notification following a user action.",
    showLink: true,
    closable: true,
    linkLabel: "View Details",
    position: "top-right",
    duration: 8000,
  }},
  argTypes: {{
    variant: {{
      control: "select",
      options: ["info", "critical", "major-warning", "minor-warning", "success"],
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
    const variants: ToastVariant[] = [
      "info",
      "critical",
      "major-warning",
      "minor-warning",
      "success",
    ];
    return (
      <div className="sbToastRow">
        {{variants.map((variant) => (
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
                  linkLabel: "View Details",
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
    const variants: ToastVariant[] = [
      "info",
      "critical",
      "major-warning",
      "minor-warning",
      "success",
    ];

    const enqueueFive = () => {{
      variants.forEach((variant, index) => {{
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

export const LayoutTokens: Story = {{
  render: () => (
    <style>{{
      `
      .sbToastRow {{
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
      }}
      `
    }}</style>
  ),
}};
"""

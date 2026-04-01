import type { Meta, StoryObj } from "@storybook/react";
import { ToastSetup, type ToastVariant, useToast } from "./Toast";
import { Button } from "./Button";

interface ToastStoryArgs {
  variant: ToastVariant;
  message: string;
  showLink: boolean;
  closable: boolean;
  linkLabel: string;
}

const meta: Meta<ToastStoryArgs> = {
  title: "Synapse/Toast",
  args: {
    variant: "info",
    message: "This is a temporary and brief notification following a user action.",
    showLink: true,
    closable: true,
    linkLabel: "View Details",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["info", "success", "minor", "major", "critical"],
    },
    message: { control: "text" },
    showLink: { control: "boolean" },
    closable: { control: "boolean" },
    linkLabel: { control: "text" },
  },
  decorators: [
    (Story) => (
      <ToastSetup>
        <Story />
      </ToastSetup>
    ),
  ],
};

export default meta;
type Story = StoryObj<ToastStoryArgs>;

function getToastType(variant: ToastVariant): "info" | "success" | "warning" | "error" {
  if (variant === "critical") return "error";
  if (variant === "success") return "success";
  if (variant === "info") return "info";
  return "warning";
}

function ToastDemo(args: ToastStoryArgs) {
  const toastManager = useToast();
  const { variant, message, showLink, closable, linkLabel } = args;

  const showToast = () => {
    toastManager.add({
      description: message,
      type: getToastType(variant),
      data: {
        variant,
        showLink,
        closable,
        linkLabel,
      },
    });
  };

  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      <Button variant="secondary" onClick={showToast}>
        Show Toast
      </Button>
    </div>
  );
}

export const Default: Story = {
  render: (args) => <ToastDemo {...args} />,
};

export const AlertingTypes: Story = {
  args: {
    closable: false
  },

  render: () => {
    const toastManager = useToast();
    const variants: ToastVariant[] = ["info", "success", "minor", "major", "critical"];
    return (
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {variants.map((variant) => (
          <Button
            key={variant}
            variant="secondary"
            onClick={() =>
              toastManager.add({
                description: `${variant[0].toUpperCase()}${variant.slice(1)} toast`,
                type: getToastType(variant),
                data: {
                  variant,
                  showLink: true,
                  closable: true,
                  linkLabel: "View Details",
                },
              })
            }
          >
            {variant}
          </Button>
        ))}
      </div>
    );
  }
};

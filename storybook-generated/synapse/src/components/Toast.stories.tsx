import "../../../../components/synapse-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { IdsButton } from "../../../../storybook/src/components/IdsButton";
import {
  SynapseToastSetup,
  useSynapseToast,
  type SynapseToastPosition,
  type SynapseToastVariant,
} from "../../../../storybook/src/components/SynapseToast";
import {
  SYNAPSE_TOAST_CONTROL_RADIUS_ALIAS,
  SYNAPSE_TOAST_DESIGN_SPEC_PATH,
  SYNAPSE_TOAST_IDS_BASELINE_SPEC_PATH,
  SYNAPSE_TOAST_SPEC_ACCURATE_NODE_ID,
} from "../../../../storybook/src/spec-contracts/synapse-toast.contract";

interface ToastStoryArgs {
  variant: SynapseToastVariant;
  message: string;
  showLink: boolean;
  closable: boolean;
  linkLabel: string;
  position: SynapseToastPosition;
  duration: number;
}

function getToastType(variant: SynapseToastVariant): "info" | "success" | "warning" | "error" {
  if (variant === "critical") return "error";
  if (variant === "success") return "success";
  if (variant === "info") return "info";
  return "warning";
}

const TOAST_VARIANTS: SynapseToastVariant[] = [
  "info",
  "critical",
  "major-warning",
  "minor-warning",
  "success",
];

const specAccurateArgs: ToastStoryArgs = {
  variant: "info",
  message: "This is a temporary and brief notification following a user action.",
  showLink: true,
  closable: true,
  linkLabel: "View Details",
  position: "top-right",
  duration: 8000,
};

const meta: Meta<ToastStoryArgs> = {
  title: "Components/Synapse/Toast",
  args: specAccurateArgs,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          `Spec-driven Synapse Toast (IDS contract). Source: \`${SYNAPSE_TOAST_DESIGN_SPEC_PATH}\`.`,
          `IDS baseline: \`${SYNAPSE_TOAST_IDS_BASELINE_SPEC_PATH}\`.`,
          `Primary story layout: Figma \`${SYNAPSE_TOAST_SPEC_ACCURATE_NODE_ID}\`; Synapse delta: \`${SYNAPSE_TOAST_CONTROL_RADIUS_ALIAS}\` → \`radius-8\` (8px).`,
          "Theme: `components/synapse-theme.css`. All other chrome inherits IDS.",
        ].join(" "),
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: TOAST_VARIANTS,
    },
    message: { control: "text" },
    showLink: { control: "boolean" },
    closable: { control: "boolean" },
    linkLabel: { control: "text" },
    position: {
      control: "select",
      options: [
        "top-left",
        "top-center",
        "top-right",
        "bottom-left",
        "bottom-center",
        "bottom-right",
      ],
    },
    duration: { control: { type: "number", min: 0, step: 500 } },
  },
  decorators: [
    (Story, ctx) => (
      <SynapseToastSetup position={ctx.args.position} duration={ctx.args.duration}>
        <Story />
      </SynapseToastSetup>
    ),
  ],
};

export default meta;
type Story = StoryObj<ToastStoryArgs>;

function ToastDemo(args: ToastStoryArgs) {
  const toastManager = useSynapseToast();
  const { variant, message, showLink, closable, linkLabel, duration } = args;

  const showToast = () => {
    toastManager.add({
      description: message,
      type: getToastType(variant),
      data: {
        variant,
        showLink,
        closable,
        linkLabel,
        duration,
      },
    });
  };

  return (
    <div className="sbToastRow">
      <IdsButton variant="secondary" onClick={showToast}>
        Show Toast
      </IdsButton>
    </div>
  );
}

/** IDS Figma `42903:139689` layout; Synapse delta: 8px root radius via theme. */
export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  args: specAccurateArgs,
  render: (args) => <ToastDemo {...args} />,
};

export const Playground: Story = {
  render: (args) => <ToastDemo {...args} />,
};

export const AlertingTypes: Story = {
  args: {
    closable: false,
  },
  render: () => {
    const toastManager = useSynapseToast();
    return (
      <div className="sbToastRow">
        {TOAST_VARIANTS.map((variant) => (
          <IdsButton
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
          </IdsButton>
        ))}
      </div>
    );
  },
};

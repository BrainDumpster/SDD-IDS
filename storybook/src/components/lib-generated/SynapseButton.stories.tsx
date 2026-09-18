/**
 * Storybook: Synapse Button from `lib/react/synapse/button`
 * (IDS-fork reexport façade — React + CSS Modules).
 *
 * Theme: components/synapse-theme.css
 * Spec: components/synapse/button/design-spec.md
 *
 * Content projection only: SynapseButtonLeadingIcon + SynapseButtonLabel.
 */
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/synapse-theme.css";
import { SPEC_ACCURATE_DESIGN_STORY } from "@component-contracts/common/story-meta";
import {
  SYNAPSE_BUTTON_DESIGN_SPEC_PATH,
  SYNAPSE_BUTTON_SPEC_ACCURATE_VARIANT_NODE_ID,
} from "../../spec-contracts/synapse-button.contract";
import {
  SYNAPSE_BUTTON_DOCS_DESCRIPTION,
  SYNAPSE_BUTTON_SOURCE_CODE,
} from "./synapse-button.developer-usage";
import {
  SynapseButton,
  SynapseButtonLabel,
  SynapseButtonLeadingIcon,
  type SynapseButtonProps,
} from "@synapse/react/button";
import { SynapseIcon } from "@synapse/react/icon";

const DEMO_ICON = "settings-gear-detailed";

function Btn({
  variant,
  size,
  label,
  icon,
  ...rest
}: SynapseButtonProps & { label?: React.ReactNode; icon?: boolean }) {
  return (
    <SynapseButton variant={variant} size={size} {...rest}>
      {icon ? (
        <SynapseButtonLeadingIcon>
          <SynapseIcon shape={DEMO_ICON} size={16} />
        </SynapseButtonLeadingIcon>
      ) : null}
      {label != null ? <SynapseButtonLabel>{label}</SynapseButtonLabel> : null}
    </SynapseButton>
  );
}

const meta: Meta<SynapseButtonProps> = {
  tags: ["autodocs"],
  title: "Components/Synapse/Button",
  component: SynapseButton,
  parameters: {
    layout: "centered",
    docs: {
      canvas: { sourceState: "open" },
      description: {
        component: [
          SYNAPSE_BUTTON_DOCS_DESCRIPTION,
          `Source: \`${SYNAPSE_BUTTON_DESIGN_SPEC_PATH}\`. Spec Accurate Design → Figma \`${SYNAPSE_BUTTON_SPEC_ACCURATE_VARIANT_NODE_ID}\`.`,
          "Theme: `components/synapse-theme.css`. Import from `@synapse/react/button`.",
        ].join("\n\n"),
      },
      source: {
        type: "code",
        language: "tsx",
        code: SYNAPSE_BUTTON_SOURCE_CODE,
      },
    },
  },
  args: {
    variant: "primary",
    size: "large",
    disabled: false,
    loading: false,
    iconOnly: false,
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "tertiary", "destructive"],
    },
    size: {
      control: "select",
      options: ["small", "medium", "large"],
    },
    iconOnly: { control: "boolean" },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
    dataState: {
      control: "select",
      options: [undefined, "default", "hover", "press", "focus-visible", "disabled"],
    },
    onClick: { action: "onClick" },
  },
};

export default meta;
type Story = StoryObj<SynapseButtonProps>;

export const SpecAccurateDesign: Story = {
  name: SPEC_ACCURATE_DESIGN_STORY,
  render: (args) => (
    <SynapseButton {...args}>
      <SynapseButtonLeadingIcon>
        <SynapseIcon shape={DEMO_ICON} size={16} />
      </SynapseButtonLeadingIcon>
      <SynapseButtonLabel>Button</SynapseButtonLabel>
    </SynapseButton>
  ),
};

export const Variants: Story = {
  name: "Variants",
  render: () => (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
      <Btn variant="primary" label="Primary" />
      <Btn variant="secondary" label="Secondary" />
      <Btn variant="tertiary" label="Tertiary" />
      <Btn variant="destructive" label="Destructive" />
    </div>
  ),
};

export const Sizes: Story = {
  name: "Sizes",
  render: () => (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
      <Btn size="small" label="Small" />
      <Btn size="medium" label="Medium" />
      <Btn size="large" label="Large" />
    </div>
  ),
};

export const WithProjectedIcon: Story = {
  name: "With Projected Icon",
  render: () => (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
      <Btn variant="primary" label="Settings" icon />
      <Btn variant="secondary" label="Settings" icon />
      <Btn variant="tertiary" label="Settings" icon />
      <Btn variant="destructive" label="Delete" icon />
      <SynapseButton variant="secondary">
        <SynapseButtonLeadingIcon>
          <SynapseIcon shape={DEMO_ICON} size={16} />
        </SynapseButtonLeadingIcon>
        <SynapseButtonLabel>
          <strong>Rich</strong> label
        </SynapseButtonLabel>
      </SynapseButton>
    </div>
  ),
};

export const IconOnly: Story = {
  name: "Icon Only",
  render: () => (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
      <SynapseButton variant="primary" iconOnly ariaLabel="Settings" size="medium">
        <SynapseButtonLeadingIcon>
          <SynapseIcon shape={DEMO_ICON} size={16} />
        </SynapseButtonLeadingIcon>
      </SynapseButton>
      <SynapseButton variant="secondary" iconOnly ariaLabel="Settings" size="large">
        <SynapseButtonLeadingIcon>
          <SynapseIcon shape={DEMO_ICON} size={16} />
        </SynapseButtonLeadingIcon>
      </SynapseButton>
      <SynapseButton variant="tertiary" iconOnly ariaLabel="Settings" size="large">
        <SynapseButtonLeadingIcon>
          <SynapseIcon shape={DEMO_ICON} size={16} />
        </SynapseButtonLeadingIcon>
      </SynapseButton>
    </div>
  ),
};

export const Disabled: Story = {
  name: "Disabled",
  render: () => (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
      <Btn variant="primary" label="Primary" disabled />
      <Btn variant="secondary" label="Secondary" disabled />
      <Btn variant="tertiary" label="Tertiary" disabled />
      <Btn variant="destructive" label="Destructive" disabled />
      <Btn variant="primary" label="Settings" icon disabled />
    </div>
  ),
};

export const Loading: Story = {
  name: "Loading",
  render: () => (
    <SynapseButton variant="primary" loading>
      <SynapseButtonLabel>Saving</SynapseButtonLabel>
    </SynapseButton>
  ),
};

export const ForcedStates: Story = {
  name: "Forced States (dataState)",
  render: () => (
    <div style={{ display: "grid", gap: 16 }}>
      {(["primary", "secondary", "tertiary", "destructive"] as const).map((variant) => (
        <div key={variant} style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <Btn variant={variant} label="Default" />
          <Btn variant={variant} label="Hover" dataState="hover" />
          <Btn variant={variant} label="Press" dataState="press" />
          <Btn variant={variant} label="Focus" dataState="focus-visible" />
          <Btn variant={variant} label="Disabled" dataState="disabled" />
        </div>
      ))}
    </div>
  ),
};

export const VariantSizeMatrix: Story = {
  name: "Variant × Size Matrix",
  render: () => (
    <div style={{ display: "grid", gap: 16 }}>
      {(["primary", "secondary", "tertiary", "destructive"] as const).map((variant) => (
        <div key={variant} style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <Btn variant={variant} size="small" label="Small" />
          <Btn variant={variant} size="medium" label="Medium" />
          <Btn variant={variant} size="large" label="Large" />
          <Btn variant={variant} size="medium" label="Icon" icon />
        </div>
      ))}
    </div>
  ),
};

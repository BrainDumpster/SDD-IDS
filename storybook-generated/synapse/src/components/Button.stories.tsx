import React, { type ComponentProps } from "react";
import "../../../../components/synapse-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import { BUTTON_SPEC_ACCURATE_DEFAULTS } from "@component-contracts/ids/button.contract";
import { SPEC_ACCURATE_DESIGN_STORY } from "@component-contracts/common/story-meta";
import { Button } from "../../../../storybook/src/components/Button";
import { Icon } from "../../../../storybook/src/components/Icon";
import {
  SYNAPSE_BUTTON_DESIGN_SPEC_PATH,
  SYNAPSE_BUTTON_SPEC_ACCURATE_VARIANT_NODE_ID,
} from "../../../../storybook/src/spec-contracts/synapse-button.contract";

const DEMO_ICON_SLUG = "settings-gear-detailed";
const DemoIcon = () => <Icon shapeName={DEMO_ICON_SLUG} variant="mask" />;

const synapseButtonProps = { programme: "synapse" as const, size: "lg" as const };

const meta: Meta<typeof Button> = {
  title: "Components/Synapse/Button",
  component: Button,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          `Spec-driven Synapse Button (IDS Button contract). Source: \`${SYNAPSE_BUTTON_DESIGN_SPEC_PATH}\`.`,
          `Primary story: **Spec Accurate Design** (Figma \`${SYNAPSE_BUTTON_SPEC_ACCURATE_VARIANT_NODE_ID}\`) — composition: leading \`Icon\` + label children.`,
          "Theme: `components/synapse-theme.css`. Programme chrome: `programme=\"synapse\"`.",
        ].join(" "),
      },
    },
  },
  argTypes: {
    variant: { control: "select", options: ["primary", "secondary", "tertiary", "destructive"] },
    size: { control: "select", options: ["sm", "md", "lg"] },
    disabled: { control: "boolean" },
    loading: { control: "boolean" },
    iconOnly: { control: "boolean" },
  },
  args: {
    programme: "synapse",
    variant: "primary",
    size: "lg",
    disabled: false,
    loading: false,
    iconOnly: false,
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const SpecAccurateDesign: Story = {
  name: SPEC_ACCURATE_DESIGN_STORY,
  render: (args) => (
    <Button {...args}>
      <DemoIcon />
      Button
    </Button>
  ),
  args: {
    programme: "synapse",
    variant: BUTTON_SPEC_ACCURATE_DEFAULTS.variant,
    size: "lg",
    disabled: BUTTON_SPEC_ACCURATE_DEFAULTS.disabled,
    loading: BUTTON_SPEC_ACCURATE_DEFAULTS.loading,
    iconOnly: BUTTON_SPEC_ACCURATE_DEFAULTS.iconOnly,
  },
};

export const Playground: Story = {
  render: (args: ComponentProps<typeof Button>) => (
    <Button
      {...args}
      aria-label={args.iconOnly ? (args["aria-label"] as string | undefined) ?? "Icon only button" : undefined}
    >
      {args.iconOnly ? <DemoIcon /> : (
        <>
          <DemoIcon />
          Button
        </>
      )}
    </Button>
  ),
};

export const StatesMatrix: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Button {...synapseButtonProps} variant="primary">
          Button
        </Button>
        <Button {...synapseButtonProps} variant="secondary">
          Button
        </Button>
        <Button {...synapseButtonProps} variant="tertiary">
          Button
        </Button>
        <Button {...synapseButtonProps} variant="destructive">
          Button
        </Button>
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Button {...synapseButtonProps} variant="primary" disabled>
          Button
        </Button>
        <Button {...synapseButtonProps} variant="secondary" disabled>
          Button
        </Button>
        <Button {...synapseButtonProps} variant="tertiary" disabled>
          Button
        </Button>
        <Button {...synapseButtonProps} variant="destructive" disabled>
          Button
        </Button>
      </div>
    </div>
  ),
};

export const VariantMatrix: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
      <Button {...synapseButtonProps} variant="primary">
        Button
      </Button>
      <Button {...synapseButtonProps} variant="secondary">
        Button
      </Button>
      <Button {...synapseButtonProps} variant="tertiary">
        Button
      </Button>
      <Button {...synapseButtonProps} variant="destructive">
        Button
      </Button>
      <Button {...synapseButtonProps} variant="primary" disabled>
        Disabled
      </Button>
    </div>
  ),
};

export const SizeExamples: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <Button programme="synapse" variant="primary" size="sm">
          Small
        </Button>
        <Button programme="synapse" variant="primary" size="md">
          Medium
        </Button>
        <Button programme="synapse" variant="primary" size="lg">
          Large
        </Button>
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <Button programme="synapse" variant="secondary" size="lg">
          <DemoIcon />
          Large
        </Button>
        <Button programme="synapse" variant="tertiary" size="lg" iconOnly aria-label="Settings">
          <DemoIcon />
        </Button>
      </div>
    </div>
  ),
};

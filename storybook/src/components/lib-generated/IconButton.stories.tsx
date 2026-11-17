/**
 * Storybook: design-spec IdsIconButton from `lib/react/ids/icon-button`
 * Theme: components/ids-theme.css
 * Spec: components/ids/icon-button/design-spec.md
 */
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/ids-theme.css";
import {
  ICON_BUTTON_DOCS_DESCRIPTION,
  ICON_BUTTON_SOURCE_CODE,
} from "./ids-icon-button.developer-usage";
import {
  ICON_BUTTON_DEMO_SHAPE,
  ICON_BUTTON_SPEC_ACCURATE_DEFAULTS,
} from "@component-contracts/ids/icon-button.contract";
import { SPEC_ACCURATE_DESIGN_STORY } from "@component-contracts/common/story-meta";
import {
  IdsIconButton,
  type IdsIconButtonProps,
} from "@ids/react/icon-button";

const meta: Meta<IdsIconButtonProps> = {
  tags: ["autodocs"],
  title: "Components/IDS/Icon Button",
  component: IdsIconButton,
  parameters: {
    docs: {
      canvas: { sourceState: "open" },
      description: { component: ICON_BUTTON_DOCS_DESCRIPTION },
      source: { type: "code", language: "tsx", code: ICON_BUTTON_SOURCE_CODE },
    },
  },
  args: {
    shape: ICON_BUTTON_DEMO_SHAPE,
    variant: "primary",
    size: "large",
    disabled: false,
    loading: false,
    ariaLabel: ICON_BUTTON_SPEC_ACCURATE_DEFAULTS.ariaLabel,
  },
  argTypes: {
    shape: { control: "text" },
    variant: {
      control: "select",
      options: ["primary", "secondary", "tertiary", "ghostNeutral"],
    },
    size: { control: "select", options: ["small", "medium", "large"] },
    ariaLabel: { control: "text" },
    onClick: { action: "onClick" },
  },
};

export default meta;
type Story = StoryObj<IdsIconButtonProps>;

export const SpecAccurateDesign: Story = {
  name: SPEC_ACCURATE_DESIGN_STORY,
  render: (args) => <IdsIconButton {...args} />,
  args: {
    shape: ICON_BUTTON_SPEC_ACCURATE_DEFAULTS.shape,
    variant: ICON_BUTTON_SPEC_ACCURATE_DEFAULTS.variant,
    size: "large",
    disabled: ICON_BUTTON_SPEC_ACCURATE_DEFAULTS.disabled,
    loading: ICON_BUTTON_SPEC_ACCURATE_DEFAULTS.loading,
    ariaLabel: ICON_BUTTON_SPEC_ACCURATE_DEFAULTS.ariaLabel,
  },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      <IdsIconButton shape={ICON_BUTTON_DEMO_SHAPE} variant="primary" ariaLabel="Primary" />
      <IdsIconButton shape={ICON_BUTTON_DEMO_SHAPE} variant="secondary" ariaLabel="Secondary" />
      <IdsIconButton shape={ICON_BUTTON_DEMO_SHAPE} variant="tertiary" ariaLabel="Tertiary" />
      <IdsIconButton
        shape={ICON_BUTTON_DEMO_SHAPE}
        variant="ghostNeutral"
        ariaLabel="Ghost Neutral"
      />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
      <IdsIconButton shape={ICON_BUTTON_DEMO_SHAPE} size="small" ariaLabel="Small" />
      <IdsIconButton shape={ICON_BUTTON_DEMO_SHAPE} size="medium" ariaLabel="Medium" />
      <IdsIconButton shape={ICON_BUTTON_DEMO_SHAPE} size="large" ariaLabel="Large" />
    </div>
  ),
};

export const StatesMatrix: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {(["primary", "secondary", "tertiary", "ghostNeutral"] as const).map((v) => (
          <IdsIconButton key={v} shape={ICON_BUTTON_DEMO_SHAPE} variant={v} ariaLabel={v} />
        ))}
      </div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {(["primary", "secondary", "tertiary", "ghostNeutral"] as const).map((v) => (
          <IdsIconButton
            key={`${v}-d`}
            shape={ICON_BUTTON_DEMO_SHAPE}
            variant={v}
            disabled
            ariaLabel={`${v} disabled`}
          />
        ))}
      </div>
    </div>
  ),
};

/**
 * Storybook: design-spec–generated Button from `lib/react/ids/button`
 * (React + CSS Modules, no @base-ui-components).
 *
 * Theme: components/ids-theme.css
 * Spec: components/ids/button/design-spec.md
 *
 * Content projection only: IdsButtonLeadingIcon + IdsButtonLabel.
 */
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/ids-theme.css";
import {
  IdsButton,
  IdsButtonLabel,
  IdsButtonLeadingIcon,
  type IdsButtonProps,
} from "../../../../lib/react/ids/button";
import { IdsIcon } from "../../../../lib/react/ids/icon";

const DEMO_ICON = "settings-gear-detailed";

function Btn({
  variant,
  size,
  label,
  icon,
  ...rest
}: IdsButtonProps & { label?: React.ReactNode; icon?: boolean }) {
  return (
    <IdsButton variant={variant} size={size} {...rest}>
      {icon ? (
        <IdsButtonLeadingIcon>
          <IdsIcon shape={DEMO_ICON} size={16} />
        </IdsButtonLeadingIcon>
      ) : null}
      {label != null ? <IdsButtonLabel>{label}</IdsButtonLabel> : null}
    </IdsButton>
  );
}

const meta: Meta<IdsButtonProps> = {
  title: "Components/IDS/Button",
  component: IdsButton,
  parameters: {
    docs: {
      description: {
        component:
          "React IDS Button from `components/ids/button/design-spec.md`. " +
          "Content projection only: `IdsButtonLeadingIcon` (project `IdsIcon`) + `IdsButtonLabel`. " +
          "Theme: `components/ids-theme.css`. No `@base-ui-components`.",
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
type Story = StoryObj<IdsButtonProps>;

export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  render: (args) => (
    <IdsButton {...args}>
      <IdsButtonLabel>Button</IdsButtonLabel>
    </IdsButton>
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
      <IdsButton variant="secondary">
        <IdsButtonLeadingIcon>
          <IdsIcon shape={DEMO_ICON} size={16} />
        </IdsButtonLeadingIcon>
        <IdsButtonLabel>
          <strong>Rich</strong> label
        </IdsButtonLabel>
      </IdsButton>
    </div>
  ),
};

export const IconOnly: Story = {
  name: "Icon Only",
  render: () => (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
      <IdsButton variant="primary" iconOnly ariaLabel="Settings" size="medium">
        <IdsButtonLeadingIcon>
          <IdsIcon shape={DEMO_ICON} size={16} />
        </IdsButtonLeadingIcon>
      </IdsButton>
      <IdsButton variant="secondary" iconOnly ariaLabel="Settings" size="large">
        <IdsButtonLeadingIcon>
          <IdsIcon shape={DEMO_ICON} size={16} />
        </IdsButtonLeadingIcon>
      </IdsButton>
      <IdsButton variant="tertiary" iconOnly ariaLabel="Settings" size="large">
        <IdsButtonLeadingIcon>
          <IdsIcon shape={DEMO_ICON} size={16} />
        </IdsButtonLeadingIcon>
      </IdsButton>
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
    <IdsButton variant="primary" loading>
      <IdsButtonLabel>Saving</IdsButtonLabel>
    </IdsButton>
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

import "../../../components/ids-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import { IdsButton } from "./IdsButton";

const meta: Meta<typeof IdsButton> = {
  title: "Spec Generated/IDS/Button",
  component: IdsButton,
  args: {
    children: "Button",
    variant: "primary",
    size: "large",
    disabled: false,
    loading: false,
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "tertiary", "destructive"],
    },
    size: { control: "select", options: ["small", "medium", "large"] },
    iconSlug: {
      control: "text",
      description: "Optional IDS icon slug from assets/icons/<slug>.svg",
    },
    iconVariant: {
      control: "select",
      options: ["mask", "img"],
    },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
    onClick: { action: "onClick" },
    onFocus: { action: "onFocus" },
    onBlur: { action: "onBlur" },
    onKeyDown: { action: "onKeyDown" },
    onKeyUp: { action: "onKeyUp" },
  },
};

export default meta;
type Story = StoryObj<typeof IdsButton>;

export const Default: Story = {
  args: {
    children: "Button",
    variant: "primary",
    size: "large",
  },
};

export const StatesMatrix: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <IdsButton variant="primary" size="large">
          Primary
        </IdsButton>
        <IdsButton variant="secondary" size="large">
          Secondary
        </IdsButton>
        <IdsButton variant="tertiary" size="large">
          Tertiary
        </IdsButton>
        <IdsButton variant="destructive" size="large">
          Destructive
        </IdsButton>
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <IdsButton variant="primary" size="large" disabled>
          Primary
        </IdsButton>
        <IdsButton variant="secondary" size="large" disabled>
          Secondary
        </IdsButton>
        <IdsButton variant="tertiary" size="large" disabled>
          Tertiary
        </IdsButton>
        <IdsButton variant="destructive" size="large" disabled>
          Destructive
        </IdsButton>
      </div>
    </div>
  ),
};

export const SizeExamples: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <IdsButton variant="primary" size="small">
          Small
        </IdsButton>
        <IdsButton variant="primary" size="medium">
          Medium
        </IdsButton>
        <IdsButton variant="primary" size="large">
          Large
        </IdsButton>
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <IdsButton variant="secondary" size="small" iconSlug="settings-gear-detailed">
          Small
        </IdsButton>
        <IdsButton variant="secondary" size="medium" iconSlug="settings-gear-detailed">
          Medium
        </IdsButton>
        <IdsButton variant="secondary" size="large" iconSlug="settings-gear-detailed">
          Large
        </IdsButton>
      </div>
    </div>
  ),
};

/** Body 2 typography from Figma (41894:116183 / 9662:25120): 14/20, weight 400, Roboto primary. */
export const TypographyBody2: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 8 }}>
      <IdsButton variant="primary" size="large">
        Body 2 — 14/20 / 400
      </IdsButton>
      <p
        style={{
          margin: 0,
          fontFamily: 'var(--typography-font-style-primary, "Roboto", sans-serif)',
          fontSize: "var(--font-size-body-2)",
          lineHeight: "var(--font-line-height-line-height-20)",
          fontWeight: 400,
        }}
      >
        Reference text using the same Body 2 tokens as the button label.
      </p>
    </div>
  ),
};

export const IconSlugExamples: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
      <IdsButton variant="primary" size="large" iconSlug="settings-gear-detailed">
        Button
      </IdsButton>
      <IdsButton variant="secondary" size="large" iconSlug="settings-gear-detailed">
        Button
      </IdsButton>
      <IdsButton variant="tertiary" size="large" iconSlug="settings-gear-detailed">
        Button
      </IdsButton>
    </div>
  ),
};

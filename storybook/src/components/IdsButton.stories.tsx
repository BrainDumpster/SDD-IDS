import type { Meta, StoryObj } from "@storybook/react";
import { IdsButton } from "./IdsButton";

const meta: Meta<typeof IdsButton> = {
  title: "Spec Generated/IDS/Button",
  component: IdsButton,
  args: {
    children: "Button",
    variant: "primary",
    size: "lg",
    disabled: false,
    loading: false,
    iconOnly: false,
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "tertiary", "danger"],
    },
    size: { control: "select", options: ["sm", "md", "lg"] },
    iconSlug: {
      control: "text",
      description: "Optional IDS icon slug from assets/icons/<slug>.svg",
    },
    iconVariant: {
      control: "select",
      options: ["mask", "img"],
    },
    iconOnly: { control: "boolean" },
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
    size: "lg",
  },
};

export const StatesMatrix: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <IdsButton variant="primary" size="lg">
          Primary
        </IdsButton>
        <IdsButton variant="secondary" size="lg">
          Secondary
        </IdsButton>
        <IdsButton variant="tertiary" size="lg">
          Tertiary
        </IdsButton>
        <IdsButton variant="danger" size="lg">
          Destructive
        </IdsButton>
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <IdsButton variant="primary" size="lg" disabled>
          Primary
        </IdsButton>
        <IdsButton variant="secondary" size="lg" disabled>
          Secondary
        </IdsButton>
        <IdsButton variant="tertiary" size="lg" disabled>
          Tertiary
        </IdsButton>
        <IdsButton variant="danger" size="lg" disabled>
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
        <IdsButton variant="primary" size="sm">
          Small
        </IdsButton>
        <IdsButton variant="primary" size="md">
          Medium
        </IdsButton>
        <IdsButton variant="primary" size="lg">
          Large
        </IdsButton>
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <IdsButton variant="secondary" size="sm" iconSlug="settings-gear-detailed">
          Small
        </IdsButton>
        <IdsButton variant="secondary" size="md" iconSlug="settings-gear-detailed">
          Medium
        </IdsButton>
        <IdsButton variant="secondary" size="lg" iconSlug="settings-gear-detailed">
          Large
        </IdsButton>
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <IdsButton variant="tertiary" size="md" iconOnly iconSlug="settings-gear-detailed" aria-label="Settings medium" />
        <IdsButton variant="tertiary" size="lg" iconOnly iconSlug="settings-gear-detailed" aria-label="Settings large" />
      </div>
    </div>
  ),
};

export const IconSlugExamples: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
      <IdsButton variant="primary" size="lg" iconSlug="settings-gear-detailed">
        Button
      </IdsButton>
      <IdsButton variant="secondary" size="lg" iconSlug="settings-gear-detailed">
        Button
      </IdsButton>
      <IdsButton variant="tertiary" size="lg" iconSlug="settings-gear-detailed">
        Button
      </IdsButton>
      <IdsButton variant="primary" size="lg" iconOnly iconSlug="settings-gear-detailed" aria-label="Settings" />
    </div>
  ),
};

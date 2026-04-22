import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "IDS/Button",
  component: Button,
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
type Story = StoryObj<typeof Button>;

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
        <Button variant="primary" size="lg">
          Primary
        </Button>
        <Button variant="secondary" size="lg">
          Secondary
        </Button>
        <Button variant="tertiary" size="lg">
          Tertiary
        </Button>
        <Button variant="danger" size="lg">
          Destructive
        </Button>
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Button variant="primary" size="lg" disabled>
          Primary
        </Button>
        <Button variant="secondary" size="lg" disabled>
          Secondary
        </Button>
        <Button variant="tertiary" size="lg" disabled>
          Tertiary
        </Button>
        <Button variant="danger" size="lg" disabled>
          Destructive
        </Button>
      </div>
    </div>
  ),
};

export const SizeExamples: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <Button variant="primary" size="sm">
          Small
        </Button>
        <Button variant="primary" size="md">
          Medium
        </Button>
        <Button variant="primary" size="lg">
          Large
        </Button>
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <Button variant="secondary" size="sm" iconSlug="settings-gear-detailed">
          Small
        </Button>
        <Button variant="secondary" size="md" iconSlug="settings-gear-detailed">
          Medium
        </Button>
        <Button variant="secondary" size="lg" iconSlug="settings-gear-detailed">
          Large
        </Button>
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <Button variant="tertiary" size="md" iconOnly iconSlug="settings-gear-detailed" aria-label="Settings medium" />
        <Button variant="tertiary" size="lg" iconOnly iconSlug="settings-gear-detailed" aria-label="Settings large" />
      </div>
    </div>
  ),
};

export const IconSlugExamples: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
      <Button variant="primary" size="lg" iconSlug="settings-gear-detailed">
        Button
      </Button>
      <Button variant="secondary" size="lg" iconSlug="settings-gear-detailed">
        Button
      </Button>
      <Button variant="tertiary" size="lg" iconSlug="settings-gear-detailed">
        Button
      </Button>
      <Button variant="primary" size="lg" iconOnly iconSlug="settings-gear-detailed" aria-label="Settings" />
    </div>
  ),
};

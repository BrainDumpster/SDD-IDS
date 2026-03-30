import type { Meta, StoryObj } from "@storybook/react";
import { ButtonGearIcon } from "./button-icons";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "Synapse/Button",
  component: Button,
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "tertiary", "ghost", "danger"],
    },
    size: { control: "select", options: ["sm", "md", "lg"] },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
    iconOnly: { control: "boolean", description: "Figma Icon Only=Yes — set aria-label" },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: { children: "Primary Button", variant: "primary", size: "md" },
};

export const Secondary: Story = {
  args: { children: "Secondary", variant: "secondary" },
};

export const Tertiary: Story = {
  args: { children: "Tertiary", variant: "tertiary" },
};

export const Ghost: Story = {
  args: { children: "Ghost", variant: "ghost" },
};

export const Danger: Story = {
  args: { children: "Delete", variant: "danger" },
};

export const Small: Story = {
  args: { children: "Small", size: "sm" },
};

export const Large: Story = {
  args: { children: "Large", size: "lg" },
};

export const Disabled: Story = {
  args: { children: "Disabled", disabled: true },
};

export const Loading: Story = {
  args: { children: "Saving...", loading: true },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="tertiary">Tertiary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="danger">Danger</Button>
        <Button loading>Loading</Button>
      </div>
      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <Button variant="primary" disabled>
          Primary
        </Button>
        <Button variant="secondary" disabled>
          Secondary
        </Button>
        <Button variant="tertiary" disabled>
          Tertiary
        </Button>
        <Button variant="ghost" disabled>
          Ghost
        </Button>
        <Button variant="danger" disabled>
          Danger
        </Button>
      </div>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

/** Figma: Icon=Yes, Icon Only=No — 16×16 icon, 8px gap, label `Button`, ~98×40 Large Primary Default. */
export const WithIconAndLabel: Story = {
  args: {
    children: "Button",
    variant: "primary",
    size: "lg",
    icon: <ButtonGearIcon />,
  },
};

export const WithIconAndLabelDisabled: Story = {
  args: {
    children: "Button",
    variant: "primary",
    size: "lg",
    icon: <ButtonGearIcon />,
    disabled: true,
  },
};

export const WithIconAllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <Button variant="primary" icon={<ButtonGearIcon />}>
          Button
        </Button>
        <Button variant="secondary" icon={<ButtonGearIcon />}>
          Button
        </Button>
        <Button variant="tertiary" icon={<ButtonGearIcon />}>
          Button
        </Button>
        <Button variant="danger" icon={<ButtonGearIcon />}>
          Button
        </Button>
      </div>
      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <Button variant="primary" icon={<ButtonGearIcon />} disabled>
          Button
        </Button>
        <Button variant="secondary" icon={<ButtonGearIcon />} disabled>
          Button
        </Button>
        <Button variant="tertiary" icon={<ButtonGearIcon />} disabled>
          Button
        </Button>
        <Button variant="danger" icon={<ButtonGearIcon />} disabled>
          Button
        </Button>
      </div>
    </div>
  ),
};

/** Figma: Icon Only=Yes — 48×40 Large / 48×32 Medium with 16×16 icon; set aria-label. */
export const IconOnly: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <Button size="lg" icon={<ButtonGearIcon />} iconOnly aria-label="Settings" variant="primary" />
        <Button size="md" icon={<ButtonGearIcon />} iconOnly aria-label="Settings" variant="primary" />
        <Button size="sm" icon={<ButtonGearIcon />} iconOnly aria-label="Settings" variant="primary" />
        <Button size="lg" icon={<ButtonGearIcon />} iconOnly aria-label="Settings" variant="secondary" />
        <Button size="lg" icon={<ButtonGearIcon />} iconOnly aria-label="Settings" variant="tertiary" />
        <Button size="lg" icon={<ButtonGearIcon />} iconOnly aria-label="Delete" variant="danger" />
      </div>
      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <Button size="lg" icon={<ButtonGearIcon />} iconOnly aria-label="Settings (disabled)" variant="primary" disabled />
        <Button size="md" icon={<ButtonGearIcon />} iconOnly aria-label="Settings (disabled)" variant="primary" disabled />
        <Button size="lg" icon={<ButtonGearIcon />} iconOnly aria-label="Settings (disabled)" variant="secondary" disabled />
        <Button size="lg" icon={<ButtonGearIcon />} iconOnly aria-label="Settings (disabled)" variant="tertiary" disabled />
        <Button size="lg" icon={<ButtonGearIcon />} iconOnly aria-label="Delete (disabled)" variant="danger" disabled />
      </div>
    </div>
  ),
};

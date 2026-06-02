import type { Meta, StoryObj } from "@storybook/react";
import { Tag } from "./Tag";

const meta: Meta<typeof Tag> = {
  title: "Spec Generated/IDS/Tag",
  component: Tag,
  argTypes: {
    tone: {
      control: "select",
      options: ["non-alerting", "info", "success", "minor", "major", "critical"],
    },
    type: { control: "select", options: ["read-only", "clickable", "editable", "badge"] },
    size: { control: "select", options: ["sm", "lg"] },
    selected: { control: "boolean" },
    showLabel: { control: "boolean" },
    closable: { control: "boolean" },
    visualState: { control: "select", options: ["default", "hover", "focus", "error", "disabled"] },
    badgeCount: { control: "number" },
  },
};

export default meta;
type Story = StoryObj<typeof Tag>;

export const MainComponentManual: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
      <Tag type="read-only" label="Tag" tone="non-alerting" size="sm" />
      <Tag type="clickable" label="Tag" tone="non-alerting" size="lg" />
      <Tag type="editable" label="Tag" tone="non-alerting" size="lg" showLabel labelPrefix="Label:" closable />
      <Tag type="badge" label="Tag" tone="non-alerting" size="lg" showLabel labelPrefix="Label:" badgeCount={1} />
    </div>
  ),
};

export const ReadOnlyAndAlertingManual: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      <Tag type="read-only" label="Tag" tone="non-alerting" size="sm" />
      <Tag type="read-only" label="Tag" tone="critical" size="sm" />
      <Tag type="read-only" label="Tag" tone="major" size="sm" />
      <Tag type="read-only" label="Tag" tone="minor" size="sm" />
      <Tag type="read-only" label="Tag" tone="success" size="sm" />
      <Tag type="read-only" label="Tag" tone="info" size="sm" />
    </div>
  ),
};

export const ClickableStatesManual: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      <Tag type="clickable" label="Tag" tone="non-alerting" size="lg" visualState="default" />
      <Tag type="clickable" label="Tag" tone="non-alerting" size="lg" visualState="hover" />
      <Tag type="clickable" label="Tag" tone="non-alerting" size="lg" visualState="focus" />
      <Tag type="clickable" label="Tag" tone="non-alerting" size="lg" selected visualState="default" />
      <Tag type="clickable" label="Tag" tone="non-alerting" size="lg" selected visualState="hover" />
      <Tag type="clickable" label="Tag" tone="non-alerting" size="lg" selected visualState="focus" />
    </div>
  ),
};

export const EditableAndBadgeStatesManual: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <Tag type="editable" label="Tag" tone="non-alerting" size="lg" closable />
        <Tag type="editable" label="Tag" tone="non-alerting" size="lg" showLabel labelPrefix="Label:" closable />
        <Tag type="editable" label="Tag" tone="critical" size="lg" visualState="error" closable />
        <Tag type="editable" label="Tag" tone="non-alerting" size="lg" visualState="disabled" closable />
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <Tag type="badge" label="Tag" size="lg" showLabel labelPrefix="Label:" badgeCount={1} />
        <Tag type="badge" label="Tag" size="lg" showLabel labelPrefix="Label:" badgeCount={1} visualState="focus" />
        <Tag type="badge" label="Tag" size="lg" showLabel labelPrefix="Label:" badgeCount={1} visualState="error" />
        <Tag type="badge" label="Tag" size="lg" showLabel labelPrefix="Label:" badgeCount={1} visualState="disabled" />
      </div>
    </div>
  ),
};

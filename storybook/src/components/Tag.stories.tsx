import type { Meta, StoryObj } from "@storybook/react";
import { Tag } from "./Tag";

const meta: Meta<typeof Tag> = {
  title: "Synapse/Tag",
  component: Tag,
  argTypes: {
    tone: {
      control: "select",
      options: ["non-alerting", "info", "success", "minor", "major", "critical"],
    },
    emphasis: { control: "select", options: ["light", "strong"] },
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

export const Types_Info_Success_Minor_Major_Critical_NonAlerting: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <Tag label="Info" tone="info" emphasis="light" />
        <Tag label="Success" tone="success" emphasis="light" />
        <Tag label="Minor" tone="minor" emphasis="light" />
        <Tag label="Major" tone="major" emphasis="light" />
        <Tag label="Critical" tone="critical" emphasis="light" />
        <Tag label="Non-Alerting" tone="non-alerting" emphasis="light" />
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <Tag label="Info" tone="info" emphasis="strong" />
        <Tag label="Success" tone="success" emphasis="strong" />
        <Tag label="Minor" tone="minor" emphasis="strong" />
        <Tag label="Major" tone="major" emphasis="strong" />
        <Tag label="Critical" tone="critical" emphasis="strong" />
      </div>
    </div>
  ),
};

export const ReadOnlyTags: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      <Tag type="read-only" label="Info" tone="info" />
      <Tag type="read-only" label="Success" tone="success" />
      <Tag type="read-only" label="Minor" tone="minor" />
      <Tag type="read-only" label="Major" tone="major" />
      <Tag type="read-only" label="Critical" tone="critical" />
      <Tag type="read-only" label="Tag" tone="non-alerting" />
    </div>
  ),
};

export const NonAlertingLargeTag: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      <Tag label="Tag" tone="non-alerting" size="lg" visualState="default" />
      <Tag label="Tag" tone="non-alerting" size="lg" visualState="focus" />
      <Tag label="Tag" tone="non-alerting" size="lg" visualState="error" />
      <Tag label="Tag" tone="non-alerting" size="lg" showLabel labelPrefix="Label:" visualState="default" />
    </div>
  ),
};

export const ClickableTags_Default_and_Selected: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      <Tag type="clickable" label="Tag" tone="non-alerting" defaultSelected={false} visualState="default" />
      <Tag type="clickable" label="Tag" tone="non-alerting" defaultSelected visualState="default" />
      <Tag type="clickable" label="Tag" tone="non-alerting" defaultSelected={false} visualState="focus" />
      <Tag type="clickable" label="Tag" tone="non-alerting" defaultSelected visualState="focus" />
    </div>
  ),
};

export const EditableTags_NoLabel_WithLabel_Focus: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      <Tag type="editable" label="Tag" tone="non-alerting" closable />
      <Tag type="editable" label="Tag" tone="non-alerting" showLabel labelPrefix="Label:" closable />
      <Tag type="editable" label="Tag" tone="non-alerting" visualState="focus" closable />
      <Tag type="editable" label="Tag" tone="non-alerting" showLabel labelPrefix="Label:" visualState="focus" closable />
      <Tag type="editable" label="Tag" tone="critical" visualState="error" closable />
      <Tag type="editable" label="Tag" tone="non-alerting" visualState="disabled" closable />
    </div>
  ),
};

export const ClosableTag: Story = {
  args: {
    type: "editable",
    label: "Tag",
    tone: "non-alerting",
    closable: true,
  },
};

export const TagsWithBadge: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      <Tag type="badge" label="Tag" showLabel labelPrefix="Label:" badgeCount={1} visualState="default" />
      <Tag type="badge" label="Tag" showLabel labelPrefix="Label:" badgeCount={1} visualState="focus" />
      <Tag type="badge" label="Tag" showLabel labelPrefix="Label:" badgeCount={1} visualState="error" />
      <Tag type="badge" label="Tag" showLabel labelPrefix="Label:" badgeCount={1} visualState="disabled" />
    </div>
  ),
};

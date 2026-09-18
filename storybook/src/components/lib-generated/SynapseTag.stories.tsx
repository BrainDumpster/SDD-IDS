/**
 * Storybook: design-spec–generated Tag from `lib/react/synapse/tag`
 * (IDS-fork reexport façade — React + CSS Modules).
 *
 * Theme: components/synapse-theme.css
 * Spec: components/synapse/tag/design-spec.md
 * Figma: 0bHk3XhrjFhowgFkz9yLr4 / 42012:26686
 *
 * API axes only (Composition & API): type, size, tone, selected, disabled,
 * error, focusVisible, focusOnText, label, badgeValue, leadingIconSlug,
 * closeIconSlug, onClick, onDismiss, onSelectionChange.
 */
import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/synapse-theme.css";
import {
  SYNAPSE_TAG_DOCS_DESCRIPTION,
  SYNAPSE_TAG_SOURCE_CODE,
} from "./synapse-tag.developer-usage";
import {
  SynapseTag,
  type SynapseTagProps,
} from "@synapse/react/tag";

const rowStyle: React.CSSProperties = {
  display: "flex",
  gap: 12,
  alignItems: "center",
  flexWrap: "wrap",
};

const meta: Meta<SynapseTagProps> = {
  tags: ["autodocs"],
  title: "Components/Synapse/Tag",
  component: SynapseTag,
  parameters: {
    layout: "centered",
    docs: {
      canvas: { sourceState: "open" },
      description: {
        component: SYNAPSE_TAG_DOCS_DESCRIPTION,
      },
      source: {
        type: "code",
        language: "tsx",
        code: SYNAPSE_TAG_SOURCE_CODE,
      },
    },
  },
  args: {
    label: "Tag",
    type: "read-only",
    tone: "none",
    disabled: false,
    error: false,
    selected: false,
    focusVisible: false,
    focusOnText: false,
  },
  argTypes: {
    type: {
      control: "select",
      options: ["read-only", "clickable", "editable", "badge"],
    },
    size: {
      control: "select",
      options: ["small", "large"],
    },
    tone: {
      control: "select",
      options: [
        "none",
        "informational",
        "success",
        "minor",
        "major",
        "critical",
      ],
    },
    selected: { control: "boolean" },
    disabled: { control: "boolean" },
    error: { control: "boolean" },
    focusVisible: { control: "boolean" },
    focusOnText: { control: "boolean" },
    label: { control: "text" },
    badgeValue: { control: "text" },
    leadingIconSlug: { control: "text" },
    closeIconSlug: { control: "text" },
    onClick: { action: "onClick" },
    onDismiss: { action: "onDismiss" },
    onSelectionChange: { action: "onSelectionChange" },
  },
};

export default meta;
type Story = StoryObj<SynapseTagProps>;

export const Playground: Story = {
  render: (args) => {
    const [selected, setSelected] = useState(Boolean(args.selected));
    const isClickable = args.type === "clickable";
    return (
      <SynapseTag
        {...args}
        selected={isClickable ? selected : false}
        onSelectionChange={(next) => {
          setSelected(next);
          args.onSelectionChange?.(next);
        }}
      />
    );
  },
};

export const Types: Story = {
  name: "Types",
  render: () => (
    <div style={rowStyle}>
      <SynapseTag type="read-only" label="Tag" tone="none" />
      <SynapseTag type="clickable" label="Tag" tone="none" />
      <SynapseTag type="editable" label="Tag" tone="none" onDismiss={() => {}} />
      <SynapseTag type="badge" label="Tag" tone="none" badgeValue={1} />
    </div>
  ),
};

export const ReadOnlyAlertingTones: Story = {
  name: "Read-only Alerting Tones",
  render: () => (
    <div style={rowStyle}>
      <SynapseTag type="read-only" label="Tag" tone="none" size="small" />
      <SynapseTag type="read-only" label="Tag" tone="critical" size="small" />
      <SynapseTag type="read-only" label="Tag" tone="major" size="small" />
      <SynapseTag type="read-only" label="Tag" tone="minor" size="small" />
      <SynapseTag type="read-only" label="Tag" tone="success" size="small" />
      <SynapseTag type="read-only" label="Tag" tone="informational" size="small" />
    </div>
  ),
};

export const ReadOnlyLarge: Story = {
  name: "Read-only Large",
  render: () => (
    <div style={rowStyle}>
      <SynapseTag type="read-only" label="Tag" tone="none" size="large" />
      <SynapseTag type="read-only" label="Tag" tone="none" size="large" error />
      <SynapseTag
        type="read-only"
        label="Tag"
        tone="none"
        size="large"
        focusVisible
      />
    </div>
  ),
};

export const ClickableStates: Story = {
  name: "Clickable States",
  render: () => {
    const [selectedA, setSelectedA] = useState(false);
    const [selectedB, setSelectedB] = useState(true);
    return (
      <div style={rowStyle}>
        <SynapseTag
          type="clickable"
          label="Tag"
          selected={selectedA}
          onSelectionChange={setSelectedA}
        />
        <SynapseTag type="clickable" label="Tag" {...{ "data-hover": true }} />
        <SynapseTag type="clickable" label="Tag" focusVisible />
        <SynapseTag
          type="clickable"
          label="Tag"
          selected={selectedB}
          onSelectionChange={setSelectedB}
        />
        <SynapseTag
          type="clickable"
          label="Tag"
          selected
          {...{ "data-hover": true }}
        />
        <SynapseTag type="clickable" label="Tag" selected focusVisible />
      </div>
    );
  },
};

export const EditableStates: Story = {
  name: "Editable States",
  render: () => (
    <div style={rowStyle}>
      <SynapseTag type="editable" label="Tag" onDismiss={() => {}} />
      <SynapseTag type="editable" label="Tag" error onDismiss={() => {}} />
      <SynapseTag type="editable" label="Tag" disabled onDismiss={() => {}} />
      <SynapseTag type="editable" label="Tag" focusOnText onDismiss={() => {}} />
    </div>
  ),
};

export const BadgeStates: Story = {
  name: "Badge States",
  render: () => (
    <div style={rowStyle}>
      <SynapseTag type="badge" label="Tag" badgeValue={1} />
      <SynapseTag type="badge" label="Tag" badgeValue={1} error />
      <SynapseTag type="badge" label="Tag" badgeValue={1} disabled />
      <SynapseTag type="badge" label="Tag" badgeValue={1} focusVisible />
    </div>
  ),
};

export const DisabledBlocksEvents: Story = {
  name: "Disabled Blocks Events",
  render: () => (
    <div style={rowStyle}>
      <SynapseTag
        type="clickable"
        label="Clickable"
        disabled
        onClick={() => {
          throw new Error("onClick must not fire when disabled");
        }}
        onSelectionChange={() => {
          throw new Error("onSelectionChange must not fire when disabled");
        }}
      />
      <SynapseTag
        type="editable"
        label="Editable"
        disabled
        onDismiss={() => {
          throw new Error("onDismiss must not fire when disabled");
        }}
      />
    </div>
  ),
};

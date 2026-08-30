/**
 * Storybook: design-spec–generated Tag from `lib/react/ids/tag`
 * (React + CSS Modules, no @base-ui-components).
 *
 * Theme: components/ids-theme.css
 * Spec: components/ids/tag/design-spec.md
 * Figma: 0bHk3XhrjFhowgFkz9yLr4 / 42012:26686
 *
 * API axes only (Composition & API): type, size, tone, selected, disabled,
 * error, focusVisible, focusOnText, label, badgeValue, leadingIconSlug,
 * closeIconSlug, onClick, onDismiss, onSelectionChange.
 */
import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/ids-theme.css";
import {
  TAG_DOCS_DESCRIPTION,
  TAG_SOURCE_CODE,
} from "./ids-tag.developer-usage";
import {
  IdsTag,
  type IdsTagProps,
} from "@ids/react/tag";

const rowStyle: React.CSSProperties = {
  display: "flex",
  gap: 12,
  alignItems: "center",
  flexWrap: "wrap",
};

const meta: Meta<IdsTagProps> = {
  tags: ["autodocs"],
  title: "Components/IDS/Tag",
  component: IdsTag,
  parameters: {
    layout: "centered",
    docs: {
      canvas: { sourceState: "open" },
      description: {
        component: TAG_DOCS_DESCRIPTION,
      },
      source: {
        type: "code",
        language: "tsx",
        code: TAG_SOURCE_CODE,
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
type Story = StoryObj<IdsTagProps>;

export const Playground: Story = {
  render: (args) => {
    const [selected, setSelected] = useState(Boolean(args.selected));
    const isClickable = args.type === "clickable";
    return (
      <IdsTag
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
      <IdsTag type="read-only" label="Tag" tone="none" />
      <IdsTag type="clickable" label="Tag" tone="none" />
      <IdsTag type="editable" label="Tag" tone="none" onDismiss={() => {}} />
      <IdsTag type="badge" label="Tag" tone="none" badgeValue={1} />
    </div>
  ),
};

export const ReadOnlyAlertingTones: Story = {
  name: "Read-only Alerting Tones",
  render: () => (
    <div style={rowStyle}>
      <IdsTag type="read-only" label="Tag" tone="none" size="small" />
      <IdsTag type="read-only" label="Tag" tone="critical" size="small" />
      <IdsTag type="read-only" label="Tag" tone="major" size="small" />
      <IdsTag type="read-only" label="Tag" tone="minor" size="small" />
      <IdsTag type="read-only" label="Tag" tone="success" size="small" />
      <IdsTag type="read-only" label="Tag" tone="informational" size="small" />
    </div>
  ),
};

export const ReadOnlyLarge: Story = {
  name: "Read-only Large",
  render: () => (
    <div style={rowStyle}>
      <IdsTag type="read-only" label="Tag" tone="none" size="large" />
      <IdsTag type="read-only" label="Tag" tone="none" size="large" error />
      <IdsTag
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
        <IdsTag
          type="clickable"
          label="Tag"
          selected={selectedA}
          onSelectionChange={setSelectedA}
        />
        <IdsTag type="clickable" label="Tag" {...{ "data-hover": true }} />
        <IdsTag type="clickable" label="Tag" focusVisible />
        <IdsTag
          type="clickable"
          label="Tag"
          selected={selectedB}
          onSelectionChange={setSelectedB}
        />
        <IdsTag
          type="clickable"
          label="Tag"
          selected
          {...{ "data-hover": true }}
        />
        <IdsTag type="clickable" label="Tag" selected focusVisible />
      </div>
    );
  },
};

export const EditableStates: Story = {
  name: "Editable States",
  render: () => (
    <div style={rowStyle}>
      <IdsTag type="editable" label="Tag" onDismiss={() => {}} />
      <IdsTag type="editable" label="Tag" error onDismiss={() => {}} />
      <IdsTag type="editable" label="Tag" disabled onDismiss={() => {}} />
      <IdsTag type="editable" label="Tag" focusOnText onDismiss={() => {}} />
    </div>
  ),
};

export const BadgeStates: Story = {
  name: "Badge States",
  render: () => (
    <div style={rowStyle}>
      <IdsTag type="badge" label="Tag" badgeValue={1} />
      <IdsTag type="badge" label="Tag" badgeValue={1} error />
      <IdsTag type="badge" label="Tag" badgeValue={1} disabled />
      <IdsTag type="badge" label="Tag" badgeValue={1} focusVisible />
    </div>
  ),
};

export const DisabledBlocksEvents: Story = {
  name: "Disabled Blocks Events",
  render: () => (
    <div style={rowStyle}>
      <IdsTag
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
      <IdsTag
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

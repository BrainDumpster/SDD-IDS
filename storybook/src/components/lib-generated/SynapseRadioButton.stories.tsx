/**
 * Storybook: design-spec–generated Radio Button from `lib/react/synapse/radio-button`
 * (IDS-fork reexport façade — React + CSS Modules).
 *
 * Theme: components/synapse-theme.css
 * Spec: components/synapse/radio-button/design-spec.md
 *
 * Projection: SynapseRadioLabel + optional SynapseHelper / SynapseError.
 */
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/synapse-theme.css";
import {
  SYNAPSE_RADIO_BUTTON_DOCS_DESCRIPTION,
  SYNAPSE_RADIO_BUTTON_SOURCE_CODE,
} from "./synapse-radio-button.developer-usage";
import {
  SynapseRadioButton,
  SynapseRadioGroup,
  SynapseRadioLabel,
  type SynapseRadioGroupProps,
} from "@synapse/react/radio-button";
import { SynapseError, SynapseErrorText } from "@synapse/react/error";
import { SynapseHelper, SynapseHelperText } from "@synapse/react/helper";
import { SynapseIcon } from "@synapse/react/icon";

const meta: Meta<SynapseRadioGroupProps> = {
  tags: ["autodocs"],
  title: "Components/Synapse/Radio Button",
  component: SynapseRadioGroup,
  parameters: {
    docs: {
      canvas: { sourceState: "open" },
      description: {
        component: SYNAPSE_RADIO_BUTTON_DOCS_DESCRIPTION,
      },
      source: {
        type: "code",
        language: "tsx",
        code: SYNAPSE_RADIO_BUTTON_SOURCE_CODE,
      },
    },
  },
  args: {
    name: "demo",
    orientation: "vertical",
    disabled: false,
  },
  argTypes: {
    orientation: { control: "radio", options: ["vertical", "horizontal"] },
    disabled: { control: "boolean" },
    onChange: { action: "onChange" },
  },
};

export default meta;
type Story = StoryObj<SynapseRadioGroupProps>;

export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  render: (args) => (
    <SynapseRadioGroup {...args} defaultValue="email">
      <SynapseRadioButton value="email">
        <SynapseRadioLabel>Email</SynapseRadioLabel>
      </SynapseRadioButton>
      <SynapseRadioButton value="sms">
        <SynapseRadioLabel>SMS</SynapseRadioLabel>
      </SynapseRadioButton>
      <SynapseRadioButton value="push">
        <SynapseRadioLabel>Push notification</SynapseRadioLabel>
      </SynapseRadioButton>
    </SynapseRadioGroup>
  ),
};

export const SelectionStates: Story = {
  name: "Selection States",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <SynapseRadioGroup name="sel-unselected" defaultValue="">
        <SynapseRadioButton value="a">
          <SynapseRadioLabel>Unselected</SynapseRadioLabel>
        </SynapseRadioButton>
      </SynapseRadioGroup>
      <SynapseRadioGroup name="sel-selected" defaultValue="a">
        <SynapseRadioButton value="a">
          <SynapseRadioLabel>Selected</SynapseRadioLabel>
        </SynapseRadioButton>
      </SynapseRadioGroup>
    </div>
  ),
};

export const InteractionMatrix: Story = {
  name: "Interaction Matrix",
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, auto)", gap: 16 }}>
      <SynapseRadioGroup name="m-default">
        <SynapseRadioButton value="a">
          <SynapseRadioLabel>Default</SynapseRadioLabel>
        </SynapseRadioButton>
      </SynapseRadioGroup>
      <SynapseRadioGroup name="m-selected" defaultValue="a">
        <SynapseRadioButton value="a">
          <SynapseRadioLabel>Selected</SynapseRadioLabel>
        </SynapseRadioButton>
      </SynapseRadioGroup>

      <SynapseRadioGroup name="m-focus">
        <SynapseRadioButton value="a" dataState="focus-visible">
          <SynapseRadioLabel>Focus</SynapseRadioLabel>
        </SynapseRadioButton>
      </SynapseRadioGroup>
      <SynapseRadioGroup name="m-focus-sel" defaultValue="a">
        <SynapseRadioButton value="a" dataState="focus-visible">
          <SynapseRadioLabel>Selected focus</SynapseRadioLabel>
        </SynapseRadioButton>
      </SynapseRadioGroup>

      <SynapseRadioGroup name="m-dis">
        <SynapseRadioButton value="a" disabled>
          <SynapseRadioLabel>Disabled</SynapseRadioLabel>
        </SynapseRadioButton>
      </SynapseRadioGroup>
      <SynapseRadioGroup name="m-dis-sel" defaultValue="a">
        <SynapseRadioButton value="a" disabled>
          <SynapseRadioLabel>Selected disabled</SynapseRadioLabel>
        </SynapseRadioButton>
      </SynapseRadioGroup>
    </div>
  ),
};

export const Horizontal: Story = {
  name: "Horizontal",
  render: () => (
    <SynapseRadioGroup name="orient" orientation="horizontal" defaultValue="day">
      <SynapseRadioButton value="day">
        <SynapseRadioLabel>Day</SynapseRadioLabel>
      </SynapseRadioButton>
      <SynapseRadioButton value="week">
        <SynapseRadioLabel>Week</SynapseRadioLabel>
      </SynapseRadioButton>
      <SynapseRadioButton value="month">
        <SynapseRadioLabel>Month</SynapseRadioLabel>
      </SynapseRadioButton>
    </SynapseRadioGroup>
  ),
};

export const WithHelperAndError: Story = {
  name: "With Helper And Error",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <SynapseRadioGroup name="help" defaultValue="email">
        <SynapseRadioButton value="email">
          <SynapseRadioLabel>Email</SynapseRadioLabel>
          <SynapseHelper>
            <SynapseHelperText>Receive weekly summary updates.</SynapseHelperText>
          </SynapseHelper>
        </SynapseRadioButton>
        <SynapseRadioButton value="sms">
          <SynapseRadioLabel>SMS</SynapseRadioLabel>
          <SynapseHelper>
            <SynapseIcon shape="status-ok-circ-solid-16" size={16} variant="img" />
            <SynapseHelperText>Optional helper icon</SynapseHelperText>
          </SynapseHelper>
        </SynapseRadioButton>
      </SynapseRadioGroup>

      <SynapseRadioGroup name="err">
        <SynapseRadioButton value="accept">
          <SynapseRadioLabel>Accept terms</SynapseRadioLabel>
          <SynapseError>
            <SynapseErrorText>You must select an option to continue.</SynapseErrorText>
          </SynapseError>
        </SynapseRadioButton>
      </SynapseRadioGroup>
    </div>
  ),
};

export const Controlled: Story = {
  name: "Controlled",
  render: function ControlledStory() {
    const [value, setValue] = React.useState("b");
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <SynapseRadioGroup name="ctrl" value={value} onChange={setValue}>
          <SynapseRadioButton value="a">
            <SynapseRadioLabel>Option A</SynapseRadioLabel>
          </SynapseRadioButton>
          <SynapseRadioButton value="b">
            <SynapseRadioLabel>Option B (selected: {value})</SynapseRadioLabel>
          </SynapseRadioButton>
          <SynapseRadioButton value="c" disabled>
            <SynapseRadioLabel>Option C (disabled)</SynapseRadioLabel>
          </SynapseRadioButton>
        </SynapseRadioGroup>
        <button type="button" onClick={() => setValue("a")}>
          Select A externally
        </button>
      </div>
    );
  },
};

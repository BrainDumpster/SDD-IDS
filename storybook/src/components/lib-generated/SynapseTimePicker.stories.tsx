/**
 * Storybook: design-spec–generated Time Picker from `lib/react/synapse/time-picker`
 * (IDS-fork reexport façade — React + CSS Modules).
 *
 * Anatomy:
 *   TimePickerRoot → Label? → FieldContainer(TextInput + ClockIconTrigger)
 *     → FormatHint | ValidationError? → TimePopup?(TimeColumn × N)
 *
 * Theme: components/synapse-theme.css
 * Spec: components/synapse/time-picker/design-spec.md
 */
import React, { useState, type ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/synapse-theme.css";
import {
  SYNAPSE_TIME_PICKER_DOCS_DESCRIPTION,
  SYNAPSE_TIME_PICKER_SOURCE_CODE,
} from "./synapse-time-picker.developer-usage";
import { SynapseTimePicker } from "@synapse/react/time-picker";

const DESIGN_SPEC_PATH = "components/synapse/time-picker/design-spec.md";

/** Spec Accurate Design story defaults — see design-spec.md Composition & API. */
const specAccurateArgs: ComponentProps<typeof SynapseTimePicker> = {
  size: "large",
  label: "Time",
  clockType: "12h",
  showSeconds: false,
  value: "09:30 PM",
  formatHint: "HH:MM AM/PM",
  placeholder: "HH:MM AM/PM",
};

const meta: Meta<typeof SynapseTimePicker> = {
  tags: ["autodocs"],
  title: "Components/Synapse/Time Picker",
  component: SynapseTimePicker,
  parameters: {
    layout: "padded",
    docs: {
      canvas: { sourceState: "open" },
      description: {
        component: SYNAPSE_TIME_PICKER_DOCS_DESCRIPTION,
      },
      source: {
        type: "code",
        language: "tsx",
        code: SYNAPSE_TIME_PICKER_SOURCE_CODE,
      },
    },
  },
  args: specAccurateArgs,
};

export default meta;
type Story = StoryObj<typeof SynapseTimePicker>;

export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  render: (args) => (
    <div style={{ padding: 24, maxWidth: 320 }}>
      <SynapseTimePicker {...args} />
    </div>
  ),
};

export const Sizes: Story = {
  name: "Large & Small",
  render: () => (
    <div style={{ padding: 24, display: "flex", gap: 48, alignItems: "flex-start" }}>
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", opacity: 0.6, marginBottom: 8 }}>
          Large (40 px)
        </div>
        <SynapseTimePicker size="large" label="Time" value="09:30 PM" />
      </div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", opacity: 0.6, marginBottom: 8 }}>
          Small (32 px)
        </div>
        <SynapseTimePicker size="small" label="Time" value="09:30 PM" />
      </div>
    </div>
  ),
};

export const FieldStates: Story = {
  name: "Field States",
  render: () => (
    <div style={{ padding: 24, display: "flex", gap: 48, flexWrap: "wrap", alignItems: "flex-start" }}>
      <div style={{ maxWidth: 320 }}>
        <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", opacity: 0.6, marginBottom: 8 }}>
          Default
        </div>
        <SynapseTimePicker size="large" label="Time" />
      </div>
      <div style={{ maxWidth: 320 }}>
        <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", opacity: 0.6, marginBottom: 8 }}>
          Filled
        </div>
        <SynapseTimePicker size="large" label="Time" value="09:30 PM" />
      </div>
      <div style={{ maxWidth: 320 }}>
        <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", opacity: 0.6, marginBottom: 8 }}>
          Disabled
        </div>
        <SynapseTimePicker size="large" label="Time" disabled value="09:30 PM" />
      </div>
      <div style={{ maxWidth: 320 }}>
        <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", opacity: 0.6, marginBottom: 8 }}>
          Error
        </div>
        <SynapseTimePicker size="large" label="Time" error errorMessage="Invalid time format" />
      </div>
    </div>
  ),
};

export const PopupOpen12Hour: Story = {
  name: "Popup Open — 12 Hour",
  args: { ...specAccurateArgs, forceOpen: true },
  render: (args) => (
    <div style={{ padding: 24, paddingBottom: 200, maxWidth: 320 }}>
      <SynapseTimePicker {...args} />
    </div>
  ),
};

export const PopupOpenSmall: Story = {
  name: "Popup Open — Small",
  render: () => (
    <div style={{ padding: 24, paddingBottom: 200, maxWidth: 320 }}>
      <SynapseTimePicker size="small" label="Time" value="09:30 PM" forceOpen />
    </div>
  ),
};

export const Format24Hour: Story = {
  name: "24 Hour — No Seconds",
  render: () => (
    <div style={{ padding: 24, maxWidth: 320 }}>
      <SynapseTimePicker
        size="large"
        label="Time"
        clockType="24h"
        value="13:30"
        formatHint="HH:MM"
        placeholder="HH:MM"
        forceOpen
      />
    </div>
  ),
};

export const WithSeconds: Story = {
  name: "12 Hour — With Seconds",
  render: () => (
    <div style={{ padding: 24, paddingBottom: 220, maxWidth: 360 }}>
      <SynapseTimePicker
        size="large"
        label="Time"
        clockType="12h"
        showSeconds
        value="09:30:00 PM"
        formatHint="HH:MM:SS AM/PM"
        forceOpen
      />
    </div>
  ),
};

function InteractiveDemo() {
  const [value, setValue] = useState<string | null>("09:30 PM");
  return (
    <div style={{ padding: 24, paddingBottom: 200, maxWidth: 320 }}>
      <SynapseTimePicker size="large" label="Time" value={value} onChange={setValue} />
      <div style={{ fontSize: 12, opacity: 0.6, marginTop: 8 }}>Selected: {value ?? "none"}</div>
    </div>
  );
}

export const Interactive: Story = {
  render: () => <InteractiveDemo />,
};

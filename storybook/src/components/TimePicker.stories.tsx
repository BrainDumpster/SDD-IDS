/* Spec Generated — IDS Time Picker (design-spec intake wizard) */
import "../../../components/ids-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import React, { useEffect, useState, type ComponentProps } from "react";
import { IdsTimePicker } from "./IdsTimePicker";

const DESIGN_SPEC_PATH = "components/ids/time-picker/design-spec.md";

function IdsThemeDecorator(Story: React.ComponentType) {
  useEffect(() => {
    document.documentElement.setAttribute("data-design-system", "ids");
    return () => document.documentElement.removeAttribute("data-design-system");
  }, []);
  return <Story />;
}

/** Spec Accurate Design story defaults — see design-spec.md */
const specAccurateArgs: ComponentProps<typeof IdsTimePicker> = {
  size: "large",
  label: "Time",
  clockType: "12h",
  showSeconds: false,
  value: "09:30 PM",
  formatHint: "HH:MM AM/PM",
  placeholder: "HH:MM AM/PM",
};

const meta: Meta<typeof IdsTimePicker> = {
  title: "Spec Generated/IDS/Time Picker",
  component: IdsTimePicker,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `Spec-driven IDS Time Picker. Source of truth: \`${DESIGN_SPEC_PATH}\`.`,
      },
    },
  },
  decorators: [IdsThemeDecorator],
  args: specAccurateArgs,
};

export default meta;
type Story = StoryObj<typeof IdsTimePicker>;

export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  render: (args) => (
    <div style={{ padding: 24, maxWidth: 320 }}>
      <IdsTimePicker {...args} />
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
        <IdsTimePicker size="large" label="Time" value="09:30 PM" />
      </div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", opacity: 0.6, marginBottom: 8 }}>
          Small (32 px)
        </div>
        <IdsTimePicker size="small" label="Time" value="09:30 PM" />
      </div>
    </div>
  ),
};

export const FieldStates: Story = {
  name: "Field States",
  render: () => (
    <div style={{ padding: 24, display: "flex", gap: 48, flexWrap: "wrap", alignItems: "flex-start" }}>
      <div style={{ maxWidth: 320 }}>
        <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", opacity: 0.6, marginBottom: 8 }}>Default</div>
        <IdsTimePicker size="large" label="Time" />
      </div>
      <div style={{ maxWidth: 320 }}>
        <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", opacity: 0.6, marginBottom: 8 }}>Filled</div>
        <IdsTimePicker size="large" label="Time" value="09:30 PM" />
      </div>
      <div style={{ maxWidth: 320 }}>
        <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", opacity: 0.6, marginBottom: 8 }}>Disabled</div>
        <IdsTimePicker size="large" label="Time" disabled value="09:30 PM" />
      </div>
      <div style={{ maxWidth: 320 }}>
        <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", opacity: 0.6, marginBottom: 8 }}>Error</div>
        <IdsTimePicker size="large" label="Time" error errorMessage="Invalid time format" />
      </div>
    </div>
  ),
};

export const PopupOpen12Hour: Story = {
  name: "Popup Open — 12 Hour",
  args: { ...specAccurateArgs, forceOpen: true },
  render: (args) => (
    <div style={{ padding: 24, paddingBottom: 200, maxWidth: 320 }}>
      <IdsTimePicker {...args} />
    </div>
  ),
};

export const PopupOpenSmall: Story = {
  name: "Popup Open — Small",
  render: () => (
    <div style={{ padding: 24, paddingBottom: 200, maxWidth: 320 }}>
      <IdsTimePicker size="small" label="Time" value="09:30 PM" forceOpen />
    </div>
  ),
};

export const Format24Hour: Story = {
  name: "24 Hour — No Seconds",
  render: () => (
    <div style={{ padding: 24, maxWidth: 320 }}>
      <IdsTimePicker
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
      <IdsTimePicker
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

export const Interactive: Story = {
  render: () => <InteractiveDemo />,
};

function InteractiveDemo() {
  const [value, setValue] = useState<string | null>("09:30 PM");
  return (
    <div style={{ padding: 24, paddingBottom: 200, maxWidth: 320 }}>
      <IdsTimePicker size="large" label="Time" value={value} onChange={setValue} />
      <div style={{ fontSize: 12, opacity: 0.6, marginTop: 8 }}>Selected: {value ?? "none"}</div>
    </div>
  );
}

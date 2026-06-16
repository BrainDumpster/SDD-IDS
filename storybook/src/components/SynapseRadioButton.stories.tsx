import "../../../components/synapse-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { SynapseRadioButton } from "./SynapseRadioButton";
import {
  SYNAPSE_RADIO_BUTTON_DESIGN_SPEC_PATH,
  SYNAPSE_RADIO_BUTTON_SAMPLE_LABEL,
  SYNAPSE_RADIO_BUTTON_SPEC_ACCURATE_NODE_ID,
  SYNAPSE_RADIO_BUTTON_STATE_MATRIX_NODE_ID,
} from "../spec-contracts/synapse-radio-button.contract";

const defaultOptions = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3" },
];

const meta: Meta<typeof SynapseRadioButton> = {
  title: "Spec Generated/Synapse/Radio Button",
  component: SynapseRadioButton,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          `Spec-driven Synapse Radio Button (IDS-fork). Source: \`${SYNAPSE_RADIO_BUTTON_DESIGN_SPEC_PATH}\`.`,
          `Primary story: **unselected / default** (Figma \`${SYNAPSE_RADIO_BUTTON_SPEC_ACCURATE_NODE_ID}\`).`,
          "Theme: `components/synapse-theme.css` (`--radio-label-font-weight` → 400).",
        ].join(" "),
      },
    },
  },
  argTypes: {
    orientation: { control: "select", options: ["vertical", "horizontal"] },
    onChange: { action: "onChange" },
  },
};

export default meta;
type Story = StoryObj<typeof SynapseRadioButton>;

export const SpecAccurateDefault: Story = {
  name: "Spec Accurate / Unselected Default",
  args: {
    name: "synapse-radio-default",
    options: [{ value: "a", label: SYNAPSE_RADIO_BUTTON_SAMPLE_LABEL }],
    defaultValue: "",
  },
};

export const DefaultGroup: Story = {
  args: {
    name: "synapse-radio-group",
    options: defaultOptions,
    defaultValue: "option1",
  },
};

export const StateMatrix: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 20 }}>
      <div style={{ fontSize: 12, color: "var(--color-text-neutral-strong)" }}>
        Matrix node `{SYNAPSE_RADIO_BUTTON_STATE_MATRIX_NODE_ID}` — hover the Hover row; Focus column uses simulatedState.
      </div>
      <div style={{ display: "flex", gap: 28, flexWrap: "wrap", alignItems: "flex-start" }}>
        <SynapseRadioButton
          name="synapse-radio-unselected"
          options={[
            { value: "default", label: "Default" },
            { value: "hover", label: "Hover" },
            { value: "focus", label: "Focus", simulatedState: "focus-visible" },
            { value: "disabled", label: "Disabled", disabled: true },
          ]}
        />
        <SynapseRadioButton
          name="synapse-radio-selected"
          options={[
            { value: "default", label: "Default", simulatedState: undefined },
            { value: "hover", label: "Hover" },
            { value: "focus", label: "Focus", simulatedState: "focus-visible" },
            { value: "disabled", label: "Disabled", disabled: true },
          ]}
          defaultValue="default"
        />
      </div>
    </div>
  ),
};

export const ControlledGroup: Story = {
  render: () => {
    const [value, setValue] = useState("option1");

    return (
      <div style={{ display: "grid", gap: 8 }}>
        <SynapseRadioButton
          name="synapse-radio-controlled"
          options={defaultOptions}
          value={value}
          onChange={setValue}
        />
        <div style={{ fontSize: 12, color: "var(--color-text-neutral)" }}>Selected: {value}</div>
      </div>
    );
  },
};

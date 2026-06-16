import "../../../components/ids-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { RadioButton } from "./RadioButton";

const meta: Meta<typeof RadioButton> = {
  title: "Spec Generated/IDS/Radio Button",
  component: RadioButton,
  argTypes: {
    orientation: { control: "select", options: ["vertical", "horizontal"] },
    onChange: { action: "onChange" },
  },
};

export default meta;
type Story = StoryObj<typeof RadioButton>;

const defaultOptions = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3" },
];

export const Default: Story = {
  args: {
    name: "ids-radio-default",
    options: defaultOptions,
    defaultValue: "option1",
  },
};

export const StateMatrix: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 20 }}>
      <div style={{ fontSize: 12, color: "var(--color-text-neutral-strong)" }}>
        Live groups: hover the Hover row for pointer parity. Focus column pins simulatedState focus-visible per Figma node 8505:14225.
      </div>
      <div style={{ display: "flex", gap: 28, flexWrap: "wrap", alignItems: "flex-start" }}>
        <RadioButton
          name="ids-radio-unselected"
          options={[
            { value: "default", label: "Default" },
            { value: "hover", label: "Hover" },
            { value: "focus", label: "Focus", simulatedState: "focus-visible" },
            { value: "disabled", label: "Disabled", disabled: true },
          ]}
        />
        <RadioButton
          name="ids-radio-selected"
          options={[
            { value: "default", label: "Default" },
            { value: "hover", label: "Hover" },
            { value: "focus", label: "Focus", simulatedState: "focus-visible" },
            { value: "disabled", label: "Disabled", disabled: true },
          ]}
          defaultValue="default"
        />
        <RadioButton
          name="ids-radio-selected-disabled"
          options={[
            { value: "selected-disabled", label: "Selected + Disabled", disabled: true },
            { value: "other", label: "Other" },
          ]}
          defaultValue="selected-disabled"
        />
      </div>
    </div>
  ),
};

export const ErrorAndHelperText: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16 }}>
      <RadioButton
        name="ids-radio-helper"
        options={[
          { value: "option1", label: "Option 1", helperText: "Recommended option." },
          { value: "option2", label: "Option 2" },
          { value: "option3", label: "Option 3" },
        ]}
        defaultValue="option1"
      />
      <RadioButton
        name="ids-radio-error"
        options={[
          { value: "option1", label: "Option 1", error: true, helperText: "Error message" },
          { value: "option2", label: "Option 2" },
          { value: "option3", label: "Option 3" },
        ]}
        defaultValue="option1"
      />
    </div>
  ),
};

export const ControlledExampleManual: Story = {
  render: () => {
    const [selected, setSelected] = useState("option1");

    return (
      <div style={{ display: "grid", gap: 12 }}>
        <RadioButton
          name="ids-radio-controlled"
          value={selected}
          onChange={setSelected}
          options={defaultOptions}
        />
        <div style={{ fontSize: 14 }}>Selected value: {selected}</div>
      </div>
    );
  },
};

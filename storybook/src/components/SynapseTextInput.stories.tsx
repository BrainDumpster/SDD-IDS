import React from "react";
import "../../../components/synapse-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import { SPEC_ACCURATE_DESIGN_STORY } from "../../../component-contracts/common/story-meta";
import { SynapseTextInput } from "./SynapseTextInput";
import {
  SYNAPSE_TEXT_INPUT_DESIGN_SPEC_PATH,
  SYNAPSE_TEXT_INPUT_SAMPLE_ERROR,
  SYNAPSE_TEXT_INPUT_SAMPLE_HELPER,
  SYNAPSE_TEXT_INPUT_SAMPLE_PLACEHOLDER,
  SYNAPSE_TEXT_INPUT_SAMPLE_VALUE,
  SYNAPSE_TEXT_INPUT_SPEC_ACCURATE_SCENARIO_NODE_ID,
} from "../spec-contracts/synapse-text-input.contract";

const specAccurateArgs = {
  componentType: "text-input" as const,
  size: "large" as const,
  value: SYNAPSE_TEXT_INPUT_SAMPLE_VALUE,
  helperText: SYNAPSE_TEXT_INPUT_SAMPLE_HELPER,
  showHelperText: true,
  showIcon: true,
};

const meta: Meta<typeof SynapseTextInput> = {
  title: "Components/Synapse/Text Input",
  component: SynapseTextInput,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          `Spec-driven Synapse Text Input (IDS Text Box contract). Source: \`${SYNAPSE_TEXT_INPUT_DESIGN_SPEC_PATH}\`.`,
          `Primary story: **Spec Accurate Design** (Figma \`${SYNAPSE_TEXT_INPUT_SPEC_ACCURATE_SCENARIO_NODE_ID}\`).`,
          "Theme: `components/synapse-theme.css` (`--text-box-control-radius` → 4px).",
        ].join(" "),
      },
    },
  },
  argTypes: {
    componentType: { control: "select", options: ["text-input", "text-area"] },
    size: { control: "select", options: ["large", "small"] },
    state: {
      control: "select",
      options: ["default", "hover", "selected", "focus", "disabled", "error"],
    },
    disabled: { control: "boolean" },
    invalid: { control: "boolean" },
    showIcon: { control: "boolean" },
    showHelperText: { control: "boolean" },
  },
  args: specAccurateArgs,
};

export default meta;
type Story = StoryObj<typeof SynapseTextInput>;

export const SpecAccurateDesign: Story = {
  name: SPEC_ACCURATE_DESIGN_STORY,
  args: specAccurateArgs,
};

export const Default: Story = {
  args: {
    componentType: "text-input",
    size: "large",
    state: "default",
    placeholder: SYNAPSE_TEXT_INPUT_SAMPLE_PLACEHOLDER,
    helperText: SYNAPSE_TEXT_INPUT_SAMPLE_HELPER,
    showHelperText: true,
    showIcon: true,
  },
};

export const StateMatrix: Story = {
  name: "State Matrix",
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(280px, 300px))", gap: 16 }}>
      <SynapseTextInput state="default" value="Filled Text" helperText="Helper text" />
      <SynapseTextInput state="hover" value="Filled Text" helperText="Helper text" />
      <SynapseTextInput state="selected" value="Filled Text" helperText="Helper text" />
      <SynapseTextInput state="focus" value="Filled Text" helperText="Helper text" />
      <SynapseTextInput disabled value="Filled Text" helperText="Helper text" />
      <SynapseTextInput state="error" placeholder={SYNAPSE_TEXT_INPUT_SAMPLE_PLACEHOLDER} errorText={SYNAPSE_TEXT_INPUT_SAMPLE_ERROR} />
    </div>
  ),
};

export const TextAreaVariants: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16, maxWidth: 300 }}>
      <SynapseTextInput componentType="text-area" state="default" placeholder="Default text-area" helperText="Helper text" />
      <SynapseTextInput componentType="text-area" state="hover" placeholder="Hover text-area" helperText="Helper text" />
      <SynapseTextInput componentType="text-area" state="error" placeholder="Error text-area" errorText={SYNAPSE_TEXT_INPUT_SAMPLE_ERROR} />
    </div>
  ),
};

export const SizeScale: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16, maxWidth: 300 }}>
      <SynapseTextInput size="large" placeholder="Large (40)" helperText="Helper text" />
      <SynapseTextInput size="small" placeholder="Small (32)" helperText="Helper text" />
    </div>
  ),
};

export const FocusVisibleAndPointerFocus: Story = {
  name: "Focus Behavior",
  render: () => (
    <div style={{ display: "grid", gap: 12, maxWidth: 300 }}>
      <p style={{ margin: 0, fontSize: 12, color: "var(--color-text-neutral)" }}>
        Click inside input: active border only. Use Tab to see focus-visible outline.
      </p>
      <SynapseTextInput value={SYNAPSE_TEXT_INPUT_SAMPLE_VALUE} helperText={SYNAPSE_TEXT_INPUT_SAMPLE_HELPER} />
    </div>
  ),
};

export const TextArea: Story = {
  args: {
    componentType: "text-area",
    placeholder: SYNAPSE_TEXT_INPUT_SAMPLE_PLACEHOLDER,
    helperText: SYNAPSE_TEXT_INPUT_SAMPLE_HELPER,
    showIcon: true,
  },
};

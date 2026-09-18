/**
 * Storybook: design-spec–generated Text Box from `lib/react/synapse/text-box`
 * (IDS-fork reexport façade — React + CSS Modules).
 *
 * Theme: components/synapse-theme.css
 * Spec: components/synapse/text-input/design-spec.md
 *
 * Projection: optional `SynapseHelper` / `SynapseError` (mutually exclusive).
 */
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/synapse-theme.css";
import {
  SYNAPSE_TEXT_INPUT_DOCS_DESCRIPTION,
  SYNAPSE_TEXT_INPUT_SOURCE_CODE,
} from "./synapse-text-input.developer-usage";
import {
  SynapseTextInput,
  type SynapseTextInputProps,
} from "@synapse/react/text-input";
import { SynapseError, SynapseErrorText } from "@synapse/react/error";
import { SynapseHelper, SynapseHelperText } from "@synapse/react/helper";

function Box(
  props: SynapseTextInputProps & {
    helper?: React.ReactNode;
    errorText?: React.ReactNode;
  },
) {
  const { helper, errorText, children, ...rest } = props;
  return (
    <SynapseTextInput {...rest}>
      {helper != null ? (
        <SynapseHelper>
          <SynapseHelperText>{helper}</SynapseHelperText>
        </SynapseHelper>
      ) : null}
      {errorText != null ? (
        <SynapseError>
          <SynapseErrorText>{errorText}</SynapseErrorText>
        </SynapseError>
      ) : null}
      {children}
    </SynapseTextInput>
  );
}

const meta: Meta<SynapseTextInputProps> = {
  tags: ["autodocs"],
  title: "Components/Synapse/Text Input",
  component: SynapseTextInput,
  parameters: {
    layout: "centered",
    docs: {
      canvas: { sourceState: "open" },
      description: {
        component: SYNAPSE_TEXT_INPUT_DOCS_DESCRIPTION,
      },
      source: {
        type: "code",
        language: "tsx",
        code: SYNAPSE_TEXT_INPUT_SOURCE_CODE,
      },
    },
  },
  args: {
    componentType: "text-input",
    size: "large",
    state: "default",
    label: "Label:",
    showLabel: true,
    required: false,
    placeholder: "Placeholder Text",
    showIcon: true,
    iconName: "mail",
    disabled: false,
    invalid: false,
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
    showLabel: { control: "boolean" },
    required: { control: "boolean" },
    showIcon: { control: "boolean" },
    onValueChange: { action: "onValueChange" },
  },
};

export default meta;
type Story = StoryObj<SynapseTextInputProps>;

const sampleWidth: React.CSSProperties = { width: 300, maxWidth: "100%" };

export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  render: (args) => (
    <div style={sampleWidth}>
      <SynapseTextInput {...args}>
        <SynapseHelper>
          <SynapseHelperText>Helper text</SynapseHelperText>
        </SynapseHelper>
      </SynapseTextInput>
    </div>
  ),
};

export const StateMatrix: Story = {
  name: "State Matrix",
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(280px, 300px))",
        gap: 16,
      }}
    >
      <Box state="default" value="Filled Text" helper="Helper text" />
      <Box state="hover" value="Filled Text" helper="Helper text" />
      <Box state="selected" value="Filled Text" helper="Helper text" />
      <Box state="focus" value="Filled Text" helper="Helper text" />
      <Box disabled value="Filled Text" helper="Helper text" />
      <Box state="error" placeholder="Placeholder Text" errorText="Error message" />
    </div>
  ),
};

export const TextAreaVariants: Story = {
  name: "Text Area Variants",
  render: () => (
    <div style={{ display: "grid", gap: 16, maxWidth: 300 }}>
      <Box
        componentType="text-area"
        state="default"
        placeholder="Default text-area"
        helper="Helper text"
      />
      <Box
        componentType="text-area"
        state="hover"
        placeholder="Hover text-area"
        helper="Helper text"
      />
      <Box
        componentType="text-area"
        state="selected"
        placeholder="Selected text-area"
        helper="Helper text"
      />
      <Box
        componentType="text-area"
        state="focus"
        placeholder="Focus text-area"
        helper="Helper text"
      />
      <Box
        componentType="text-area"
        disabled
        placeholder="Disabled text-area"
        helper="Helper text"
      />
      <Box
        componentType="text-area"
        state="error"
        placeholder="Error text-area"
        errorText="Error message"
      />
    </div>
  ),
};

export const SizeScale: Story = {
  name: "Size Scale",
  render: () => (
    <div style={{ display: "grid", gap: 16, maxWidth: 300 }}>
      <Box size="large" placeholder="Large (40)" helper="Helper text" />
      <Box size="small" placeholder="Small (32)" helper="Helper text" />
    </div>
  ),
};

export const WithLabelAndRequired: Story = {
  name: "With Label And Required",
  render: () => (
    <div style={{ display: "grid", gap: 16, maxWidth: 420 }}>
      <Box label="Label:" placeholder="Placeholder Text" helper="Helper text" />
      <Box label="Label:" required placeholder="Placeholder Text" helper="Helper text" />
      <Box
        label="Label:"
        showLabel={false}
        placeholder="No visible label (use ariaLabel)"
        ariaLabel="Email"
        helper="Helper text"
      />
    </div>
  ),
};

export const WithHelperAndError: Story = {
  name: "With Helper And Error",
  render: () => (
    <div style={{ display: "grid", gap: 16, maxWidth: 300 }}>
      <SynapseTextInput label="Email:" placeholder="name@example.com">
        <SynapseHelper>
          <SynapseHelperText>We will never share your email.</SynapseHelperText>
        </SynapseHelper>
      </SynapseTextInput>
      <SynapseTextInput label="Email:" placeholder="name@example.com" invalid>
        <SynapseError>
          <SynapseErrorText>Enter a valid email address.</SynapseErrorText>
        </SynapseError>
      </SynapseTextInput>
    </div>
  ),
};

export const FocusVisibleAndPointerFocus: Story = {
  name: "Focus Visible And Pointer Focus",
  render: () => (
    <div style={{ display: "grid", gap: 12, maxWidth: 300 }}>
      <p
        style={{
          margin: 0,
          fontSize: 12,
          color: "var(--color-text-gray-neutral)",
        }}
      >
        Click inside input: active border only. Use Tab for focus-visible ring.
      </p>
      <Box value="Focus behavior demo" helper="Helper text" />
    </div>
  ),
};

export const Controlled: Story = {
  name: "Controlled",
  render: function ControlledStory() {
    const [value, setValue] = React.useState("Filled Text");
    return (
      <div style={{ display: "grid", gap: 12, maxWidth: 300 }}>
        <SynapseTextInput label="Label:" value={value} onValueChange={setValue}>
          <SynapseHelper>
            <SynapseHelperText>Helper text</SynapseHelperText>
          </SynapseHelper>
        </SynapseTextInput>
        <button type="button" onClick={() => setValue("")}>
          Clear
        </button>
      </div>
    );
  },
};

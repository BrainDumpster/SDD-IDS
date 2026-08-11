/**
 * Storybook: design-spec–generated Text Box from `lib/react/ids/text-box`
 * (React + CSS Modules, no @base-ui-components).
 *
 * Theme: components/ids-theme.css
 * Spec: components/ids/text-box/design-spec.md
 *
 * Projection: optional `IdsHelper` / `IdsError` (mutually exclusive).
 */
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/ids-theme.css";
import {
  IdsTextBox,
  type IdsTextBoxProps,
} from "../../../../lib/react/ids/text-box";
import { IdsError, IdsErrorText } from "../../../../lib/react/ids/error";
import { IdsHelper, IdsHelperText } from "../../../../lib/react/ids/helper";

function Box(
  props: IdsTextBoxProps & {
    helper?: React.ReactNode;
    errorText?: React.ReactNode;
  },
) {
  const { helper, errorText, children, ...rest } = props;
  return (
    <IdsTextBox {...rest}>
      {helper != null ? (
        <IdsHelper>
          <IdsHelperText>{helper}</IdsHelperText>
        </IdsHelper>
      ) : null}
      {errorText != null ? (
        <IdsError>
          <IdsErrorText>{errorText}</IdsErrorText>
        </IdsError>
      ) : null}
      {children}
    </IdsTextBox>
  );
}

const meta: Meta<IdsTextBoxProps> = {
  title: "Lib Generated/IDS/Text Box",
  component: IdsTextBox,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "React IDS Text Box from `components/ids/text-box/design-spec.md`. " +
          "Projection: optional `IdsHelper` or `IdsError` (not both). " +
          "Theme: `components/ids-theme.css` (`--text-box-control-radius`, `--text-box-focus-ring-radius`). " +
          "No `@base-ui-components`.",
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
type Story = StoryObj<IdsTextBoxProps>;

const sampleWidth: React.CSSProperties = { width: 300, maxWidth: "100%" };

export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  render: (args) => (
    <div style={sampleWidth}>
      <IdsTextBox {...args}>
        <IdsHelper>
          <IdsHelperText>Helper text</IdsHelperText>
        </IdsHelper>
      </IdsTextBox>
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
      <IdsTextBox label="Email:" placeholder="name@example.com">
        <IdsHelper>
          <IdsHelperText>We will never share your email.</IdsHelperText>
        </IdsHelper>
      </IdsTextBox>
      <IdsTextBox label="Email:" placeholder="name@example.com" invalid>
        <IdsError>
          <IdsErrorText>Enter a valid email address.</IdsErrorText>
        </IdsError>
      </IdsTextBox>
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
        <IdsTextBox label="Label:" value={value} onValueChange={setValue}>
          <IdsHelper>
            <IdsHelperText>Helper text</IdsHelperText>
          </IdsHelper>
        </IdsTextBox>
        <button type="button" onClick={() => setValue("")}>
          Clear
        </button>
      </div>
    );
  },
};

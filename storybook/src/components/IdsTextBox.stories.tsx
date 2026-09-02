import "../../../components/ids-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import { IdsTextBox } from "./IdsTextBox";

const meta: Meta<typeof IdsTextBox> = {
  title: "Components/IDS/Text Box",
  component: IdsTextBox,
  argTypes: {
    componentType: { control: "select", options: ["text-input", "text-area"] },
    size: { control: "select", options: ["large", "small"] },
    state: {
      control: "select",
      options: ["default", "hover", "selected", "focus", "disabled", "error"],
    },
    labelPosition: { control: "select", options: ["left", "top"] },
    disabled: { control: "boolean" },
    invalid: { control: "boolean" },
    showLabel: { control: "boolean" },
    label: { control: "text" },
    required: { control: "boolean" },
    showIcon: { control: "boolean" },
    showHelperText: { control: "boolean" },
    showInfoIcon: { control: "boolean" },
    infoTooltip: { control: "text" },
    inputType: { control: "select", options: ["text", "password", "email", "number"] },
  },
};

export default meta;
type Story = StoryObj<typeof IdsTextBox>;

export const Default: Story = {
  render: (args) => (
    <div style={{ width: 300 }}>
      <IdsTextBox {...args} />
    </div>
  ),
  args: {
    componentType: "text-input",
    size: "large",
    state: "default",
    label: "Label:",
    showLabel: true,
    required: false,
    placeholder: "Placeholder Text",
    helperText: "Helper text",
    showHelperText: true,
    showIcon: true,
  },
};

export const ErrorWithHelper: Story = {
  name: "Error + Helper Text",
  render: () => (
    <div style={{ display: "grid", gap: 16, width: 300 }}>
      <IdsTextBox
        label="Username:"
        required
        state="error"
        value="User12345"
        helperText="Username or email address"
        errorText="Username already exists. Enter a different username."
      />
    </div>
  ),
};

export const TopLabel: Story = {
  name: "Label Position: Top",
  render: () => (
    <div style={{ display: "grid", gap: 16, width: 300 }}>
      <IdsTextBox
        label="Label:"
        labelPosition="top"
        placeholder="Top label"
        helperText="Helper text"
      />
      <IdsTextBox
        label="Label:"
        labelPosition="top"
        required
        placeholder="Top label required"
        helperText="Helper text"
      />
    </div>
  ),
};

export const InfoIcon: Story = {
  name: "Label with Info Icon",
  render: () => (
    <div style={{ display: "grid", gap: 32, width: 300, margin: "60px auto" }}>
      <IdsTextBox
        label="Label:"
        showInfoIcon
        infoTooltip="Additional information about this field"
        placeholder="Hover the info icon"
        helperText="Helper text"
      />
    </div>
  ),
};

export const Password: Story = {
  name: "Password Toggle",
  render: () => (
    <div style={{ display: "grid", gap: 16, width: 300 }}>
      <IdsTextBox
        label="Password:"
        inputType="password"
        value="secretpass123"
        helperText="Click the eye icon to toggle visibility"
      />
    </div>
  ),
};

export const ResponsiveTextInput: Story = {
  name: "Responsive: Text Input",
  render: () => (
    <div
      style={{
        resize: "horizontal",
        overflow: "auto",
        width: 400,
        minWidth: 70,
        maxWidth: 720,
        padding: 12,
        border: "1px dashed var(--color-border-accessible)",
        borderRadius: 8,
      }}
    >
      <IdsTextBox
        componentType="text-input"
        labelPosition="top"
        label="Label:"
        placeholder="Drag the bottom-right handle to resize"
        helperText="Field fills its container (min 70px, max 700px)."
      />
    </div>
  ),
};

export const ResponsiveTextArea: Story = {
  name: "Responsive: Text Area",
  render: () => (
    <div
      style={{
        resize: "horizontal",
        overflow: "auto",
        width: 400,
        minWidth: 70,
        maxWidth: 720,
        padding: 12,
        border: "1px dashed var(--color-border-accessible)",
        borderRadius: 8,
      }}
    >
      <IdsTextBox
        componentType="text-area"
        labelPosition="top"
        label="Label:"
        placeholder="Drag the bottom-right handle to resize"
        helperText="Text area fills its container (min 70px, max 700px)."
      />
    </div>
  ),
};

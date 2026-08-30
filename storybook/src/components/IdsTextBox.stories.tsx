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
    disabled: { control: "boolean" },
    invalid: { control: "boolean" },
    showLabel: { control: "boolean" },
    label: { control: "text" },
    required: { control: "boolean" },
    showIcon: { control: "boolean" },
    showHelperText: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof IdsTextBox>;

export const Default: Story = {
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

export const States: Story = {
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(280px, 300px))", gap: 16 }}>
      <IdsTextBox state="default" value="Filled Text" helperText="Helper text" />
      <IdsTextBox state="hover" value="Filled Text" helperText="Helper text" />
      <IdsTextBox state="selected" value="Filled Text" helperText="Helper text" />
      <IdsTextBox state="focus" value="Filled Text" helperText="Helper text" />
      <IdsTextBox disabled value="Filled Text" helperText="Helper text" />
      <IdsTextBox state="error" placeholder="Placeholder Text" errorText="Error message" />
    </div>
  ),
};

export const TextArea: Story = {
  args: {
    componentType: "text-area",
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

export const SizeScaleManual: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16, maxWidth: 300 }}>
      <IdsTextBox size="large" placeholder="Large (40)" helperText="Helper text" />
      <IdsTextBox size="small" placeholder="Small (32)" helperText="Helper text" />
    </div>
  ),
};

export const FocusBehavior: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 12, maxWidth: 300 }}>
      <p style={{ margin: 0, fontSize: 12, color: "var(--color-text-gray-neutral)" }}>
        Click inside input: active border only. Use Tab to see focus-visible outline.
      </p>
      <IdsTextBox value="Focus behavior demo" helperText="Helper text" />
    </div>
  ),
};

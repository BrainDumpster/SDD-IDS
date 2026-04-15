import type { Meta, StoryObj } from "@storybook/react";
import { TextInput } from "./TextInput";

const meta: Meta<typeof TextInput> = {
  title: "Synapse/Text Input",
  component: TextInput,
  argTypes: {
    componentType: { control: "select", options: ["text-input", "text-area"] },
    size: { control: "select", options: ["large", "small"] },
    state: {
      control: "select",
      options: ["default", "hover", "selected", "focus", "disabled", "error"],
    },
    showLabel: { control: "boolean" },
    showHelperText: { control: "boolean" },
    showIcon: { control: "boolean" },
    disabled: { control: "boolean" },
    invalid: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof TextInput>;

export const Default: Story = {
  args: {
    componentType: "text-input",
    size: "large",
    state: "default",
    placeholder: "Placeholder Text",
    showLabel: false,
    helperText: "Helper text",
    showHelperText: true,
    showIcon: false,
  },
};

export const Small: Story = {
  args: {
    componentType: "text-input",
    size: "small",
    state: "default",
    value: "Filled Text",
    helperText: "Helper text",
    showHelperText: true,
  },
};

export const WithIcon: Story = {
  args: {
    componentType: "text-input",
    size: "large",
    state: "default",
    value: "Filled Text",
    helperText: "Helper text",
    showHelperText: true,
    showIcon: true,
    iconName: "mail",
  },
};

export const Error: Story = {
  args: {
    componentType: "text-input",
    size: "large",
    state: "error",
    invalid: true,
    placeholder: "Placeholder Text",
    errorText: "Error message",
    showHelperText: true,
  },
};

export const Disabled: Story = {
  args: {
    componentType: "text-input",
    size: "large",
    disabled: true,
    value: "Filled Text",
    helperText: "Helper text",
    showHelperText: true,
  },
};

export const TextArea: Story = {
  args: {
    componentType: "text-area",
    size: "large",
    placeholder: "Placeholder Text",
    helperText: "Helper text",
    showHelperText: true,
  },
};

export const StateMatrix: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(2, minmax(260px, 300px))" }}>
      <TextInput value="Filled Text" helperText="Helper text" state="default" />
      <TextInput value="Filled Text" helperText="Helper text" state="hover" />
      <TextInput value="Filled Text" helperText="Helper text" state="selected" />
      <TextInput value="Filled Text" helperText="Helper text" state="focus" />
      <TextInput value="Filled Text" helperText="Helper text" disabled />
      <TextInput placeholder="Placeholder Text" invalid state="error" errorText="Error message" />
    </div>
  ),
};

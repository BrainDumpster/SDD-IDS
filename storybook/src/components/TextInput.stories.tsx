import type { Meta, StoryObj } from "@storybook/react";
import { TextInput } from "./TextInput";

const meta: Meta<typeof TextInput> = {
  title: "Synapse/TextInput",
  component: TextInput,
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    disabled: { control: "boolean" },
    invalid: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof TextInput>;

export const Default: Story = {
  args: { label: "Email", placeholder: "you@example.com" },
};

export const WithHelper: Story = {
  args: {
    label: "Username",
    placeholder: "Enter username",
    helperText: "Must be 3-20 characters",
  },
};

export const WithError: Story = {
  args: {
    label: "Password",
    type: "password",
    invalid: true,
    errorText: "Password must be at least 8 characters",
  },
};

export const Disabled: Story = {
  args: { label: "Read only", value: "Cannot edit", disabled: true },
};

export const Small: Story = {
  args: { label: "Compact", size: "sm", placeholder: "Small input" },
};

export const Large: Story = {
  args: { label: "Full name", size: "lg", placeholder: "Large input" },
};

export const FormExample: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 360 }}>
      <TextInput label="First name" placeholder="John" />
      <TextInput label="Last name" placeholder="Doe" />
      <TextInput label="Email" placeholder="john@example.com" type="email" helperText="We'll never share your email" />
      <TextInput label="Password" type="password" invalid errorText="Required field" />
    </div>
  ),
};

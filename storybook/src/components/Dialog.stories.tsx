import type { Meta, StoryObj } from "@storybook/react";
import { Dialog } from "./Dialog";
import { Button } from "./Button";
import { TextInput } from "./TextInput";

const meta: Meta<typeof Dialog> = {
  title: "Synapse/Dialog",
  component: Dialog,
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
  },
};

export default meta;
type Story = StoryObj<typeof Dialog>;

export const Default: Story = {
  args: {
    trigger: <Button>Open Dialog</Button>,
    title: "Confirm action",
    description: "Are you sure you want to proceed? This action cannot be undone.",
    children: (
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 16 }}>
        <Button variant="secondary">Cancel</Button>
        <Button variant="danger">Delete</Button>
      </div>
    ),
  },
};

export const WithForm: Story = {
  args: {
    trigger: <Button>Edit profile</Button>,
    title: "Edit profile",
    size: "md",
    children: (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <TextInput label="Display name" placeholder="Enter your name" />
        <TextInput label="Email" type="email" placeholder="you@example.com" />
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 8 }}>
          <Button variant="secondary">Cancel</Button>
          <Button>Save changes</Button>
        </div>
      </div>
    ),
  },
};

export const Small: Story = {
  args: {
    trigger: <Button variant="secondary">Quick confirm</Button>,
    title: "Delete item?",
    size: "sm",
    children: (
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <Button variant="secondary" size="sm">No</Button>
        <Button variant="danger" size="sm">Yes, delete</Button>
      </div>
    ),
  },
};

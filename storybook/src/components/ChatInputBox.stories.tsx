import "../../../components/synapse-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import { ChatInputBox } from "./ChatInputBox";

const meta: Meta<typeof ChatInputBox> = {
  title: "Spec Generated/Synapse/Chat Input Box",
  component: ChatInputBox,
};

export default meta;
type Story = StoryObj<typeof ChatInputBox>;

export const Default: Story = {
  args: {
    onSend: (msg: string) => alert(`Sent: ${msg}`),
  },
};

export const CustomPlaceholder: Story = {
  args: {
    placeholder: "Ask a question...",
    onSend: (msg: string) => console.log(msg),
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: "Chat is disabled",
  },
};

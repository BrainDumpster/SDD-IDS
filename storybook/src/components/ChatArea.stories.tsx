import "../../../components/synapse-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import { ChatArea } from "./ChatArea";

const meta: Meta<typeof ChatArea> = {
  title: "Spec Generated/Synapse/Chat and Layout/Chat Area",
  component: ChatArea,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: [
          "Spec-driven Synapse Chat Area. Source: `components/synapse/chatarea/design-spec.md`.",
          "Primary story: Figma `47816:4025`.",
          "Theme: `components/synapse-theme.css`.",
        ].join(" "),
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ChatArea>;

export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  args: {
    messages: [
      { id: "1", content: "Hello, I need help with my account settings.", sender: "user", timestamp: "10:00 AM" },
      { id: "2", content: "Of course! I can help you with that. What would you like to change?", sender: "system", timestamp: "10:01 AM" },
      { id: "3", content: "I want to update my notification preferences.", sender: "user", timestamp: "10:02 AM" },
      { id: "4", content: "You can find notification preferences under Settings > Notifications. Would you like me to walk you through the options?", sender: "system", timestamp: "10:02 AM" },
      { id: "5", content: "Yes please, that would be helpful.", sender: "user", timestamp: "10:03 AM" },
    ],
  },
  decorators: [
    (Story) => (
      <div style={{ height: 400 }}>
        <Story />
      </div>
    ),
  ],
};

export const Conversation: Story = {
  args: {
    messages: [
      { id: "1", content: "Hello, I need help with my account settings.", sender: "user", timestamp: "10:00 AM" },
      { id: "2", content: "Of course! I can help you with that. What would you like to change?", sender: "system", timestamp: "10:01 AM" },
      { id: "3", content: "I want to update my notification preferences.", sender: "user", timestamp: "10:02 AM" },
      { id: "4", content: "You can find notification preferences under Settings > Notifications. Would you like me to walk you through the options?", sender: "system", timestamp: "10:02 AM" },
      { id: "5", content: "Yes please, that would be helpful.", sender: "user", timestamp: "10:03 AM" },
    ],
  },
  decorators: [
    (Story) => (
      <div style={{ height: 400 }}>
        <Story />
      </div>
    ),
  ],
};

export const SingleMessage: Story = {
  args: {
    messages: [
      { id: "1", content: "Welcome! How can I assist you today?", sender: "system" },
    ],
  },
  decorators: [
    (Story) => (
      <div style={{ height: 300 }}>
        <Story />
      </div>
    ),
  ],
};

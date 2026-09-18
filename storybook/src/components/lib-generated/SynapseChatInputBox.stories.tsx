/**
 * Storybook: Synapse Chat Input Box from `lib/react/synapse/chat-input-box`
 * (Synapse-native / standalone — React + CSS Modules).
 *
 * Theme: components/synapse-theme.css
 * Spec: components/synapse/chatinputbox/design-spec.md
 */
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/synapse-theme.css";
import { SPEC_ACCURATE_DESIGN_STORY } from "@component-contracts/common/story-meta";
import {
  SYNAPSE_CHAT_INPUT_BOX_DESIGN_SPEC_PATH,
} from "../../spec-contracts/synapse-chat-input-box.contract";
import {
  SYNAPSE_CHAT_INPUT_BOX_DOCS_DESCRIPTION,
  SYNAPSE_CHAT_INPUT_BOX_SOURCE_CODE,
} from "./synapse-chat-input-box.developer-usage";
import {
  SynapseChatInputBox, type SynapseChatInputBoxProps,
} from "@synapse/react/chat-input-box";

const meta: Meta<SynapseChatInputBoxProps> = {
  tags: ["autodocs"],
  title: "Components/Synapse/Chat Input Box",
  component: SynapseChatInputBox,
  parameters: {
    layout: "centered",
    docs: {
      canvas: { sourceState: "open" },
      description: {
        component: [
          SYNAPSE_CHAT_INPUT_BOX_DOCS_DESCRIPTION,
          `Source: \`${SYNAPSE_CHAT_INPUT_BOX_DESIGN_SPEC_PATH}\`.`,
          "Theme: `components/synapse-theme.css`. Import from `@synapse/react/chat-input-box`.",
        ].join("\n\n"),
      },
      source: {
        type: "code",
        language: "tsx",
        code: SYNAPSE_CHAT_INPUT_BOX_SOURCE_CODE,
      },
    },
  },
};

export default meta;
type Story = StoryObj<SynapseChatInputBoxProps>;

export const SpecAccurateDesign: Story = {
  name: SPEC_ACCURATE_DESIGN_STORY,
  render: () => (
    <div style={{ width: 640 }}>
      <SynapseChatInputBox
        placeholder="Ask me anything"
        suggestedPrompts={[
          "Summarize the health of my environment",
          "Show critical alerts from the last 24 hours",
        ]}
      />
    </div>
  ),
};

export const WithButtons: Story = {
  name: "With Buttons",
  render: () => (
    <div style={{ width: 640 }}>
      <SynapseChatInputBox layout="withButtons" />
    </div>
  ),
};


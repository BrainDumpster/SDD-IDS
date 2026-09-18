/**
 * Storybook: Synapse Chat System Response from `lib/react/synapse/chat-system-response`
 * (Synapse-native / standalone — React + CSS Modules).
 *
 * Theme: components/synapse-theme.css
 * Spec: components/synapse/chatsystemresponse/design-spec.md
 */
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/synapse-theme.css";
import { SPEC_ACCURATE_DESIGN_STORY } from "@component-contracts/common/story-meta";
import {
  SYNAPSE_CHAT_SYSTEM_RESPONSE_DESIGN_SPEC_PATH,
} from "../../spec-contracts/synapse-chat-system-response.contract";
import {
  SYNAPSE_CHAT_SYSTEM_RESPONSE_DOCS_DESCRIPTION,
  SYNAPSE_CHAT_SYSTEM_RESPONSE_SOURCE_CODE,
} from "./synapse-chat-system-response.developer-usage";
import {
  SynapseChatSystemResponse, type SynapseChatSystemResponseProps,
} from "@synapse/react/chat-system-response";

const meta: Meta<SynapseChatSystemResponseProps> = {
  tags: ["autodocs"],
  title: "Components/Synapse/Chat System Response",
  component: SynapseChatSystemResponse,
  parameters: {
    layout: "centered",
    docs: {
      canvas: { sourceState: "open" },
      description: {
        component: [
          SYNAPSE_CHAT_SYSTEM_RESPONSE_DOCS_DESCRIPTION,
          `Source: \`${SYNAPSE_CHAT_SYSTEM_RESPONSE_DESIGN_SPEC_PATH}\`.`,
          "Theme: `components/synapse-theme.css`. Import from `@synapse/react/chat-system-response`.",
        ].join("\n\n"),
      },
      source: {
        type: "code",
        language: "tsx",
        code: SYNAPSE_CHAT_SYSTEM_RESPONSE_SOURCE_CODE,
      },
    },
  },
};

export default meta;
type Story = StoryObj<SynapseChatSystemResponseProps>;

export const SpecAccurateDesign: Story = {
  name: SPEC_ACCURATE_DESIGN_STORY,
  render: () => (
    <SynapseChatSystemResponse
      content="I found 3 clusters that need attention."
      timestamp="11:21 AM"
    />
  ),
};


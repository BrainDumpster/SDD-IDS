/**
 * Storybook: Synapse Chat Area from `lib/react/synapse/chat-area`
 * (Synapse-native / standalone — React + CSS Modules).
 *
 * Theme: components/synapse-theme.css
 * Spec: components/synapse/chatarea/design-spec.md
 */
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/synapse-theme.css";
import { SPEC_ACCURATE_DESIGN_STORY } from "@component-contracts/common/story-meta";
import {
  SYNAPSE_CHAT_AREA_DESIGN_SPEC_PATH,
} from "../../spec-contracts/synapse-chat-area.contract";
import {
  SYNAPSE_CHAT_AREA_DOCS_DESCRIPTION,
  SYNAPSE_CHAT_AREA_SOURCE_CODE,
} from "./synapse-chat-area.developer-usage";
import {
  SynapseChatArea, type SynapseChatAreaProps,
} from "@synapse/react/chat-area";

const meta: Meta<SynapseChatAreaProps> = {
  tags: ["autodocs"],
  title: "Components/Synapse/Chat Area",
  component: SynapseChatArea,
  parameters: {
    layout: "centered",
    docs: {
      canvas: { sourceState: "open" },
      description: {
        component: [
          SYNAPSE_CHAT_AREA_DOCS_DESCRIPTION,
          `Source: \`${SYNAPSE_CHAT_AREA_DESIGN_SPEC_PATH}\`.`,
          "Theme: `components/synapse-theme.css`. Import from `@synapse/react/chat-area`.",
        ].join("\n\n"),
      },
      source: {
        type: "code",
        language: "tsx",
        code: SYNAPSE_CHAT_AREA_SOURCE_CODE,
      },
    },
  },
};

export default meta;
type Story = StoryObj<SynapseChatAreaProps>;

export const SpecAccurateDesign: Story = {
  name: SPEC_ACCURATE_DESIGN_STORY,
  render: () => (
    <div style={{ width: 480, height: 280 }}>
      <SynapseChatArea
        messages={[
          { id: "1", sender: "user", content: "Summarize cluster health.", timestamp: "11:20 AM" },
          { id: "2", sender: "system", content: "All control-plane nodes are ready.", timestamp: "11:21 AM" },
        ]}
      />
    </div>
  ),
};


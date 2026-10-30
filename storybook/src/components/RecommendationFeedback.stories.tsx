import "../../../components/synapse-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import { RecommendationFeedback } from "./RecommendationFeedback";
import {
  SYNAPSE_RECOMMENDATION_FEEDBACK_DESIGN_SPEC_PATH,
  SYNAPSE_RECOMMENDATION_FEEDBACK_SAMPLE_PROMPT,
  SYNAPSE_RECOMMENDATION_FEEDBACK_SAMPLE_TIMESTAMP,
  SYNAPSE_RECOMMENDATION_FEEDBACK_SPEC_ACCURATE_NODE_ID,
  SYNAPSE_RECOMMENDATION_FEEDBACK_VARIANT_FRAME_NODE_ID,
} from "../spec-contracts/synapse-recommendation-feedback.contract";

const specAccurateArgs = {
  prompt: SYNAPSE_RECOMMENDATION_FEEDBACK_SAMPLE_PROMPT,
  timestamp: SYNAPSE_RECOMMENDATION_FEEDBACK_SAMPLE_TIMESTAMP,
};

const meta: Meta<typeof RecommendationFeedback> = {
  title: "Components/Synapse/Chat and Layout/Recommendation Feedback",
  component: RecommendationFeedback,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          `Spec-driven Synapse Recommendation Feedback. Source: \`${SYNAPSE_RECOMMENDATION_FEEDBACK_DESIGN_SPEC_PATH}\`.`,
          `Primary story: Figma \`${SYNAPSE_RECOMMENDATION_FEEDBACK_SPEC_ACCURATE_NODE_ID}\` (frame \`${SYNAPSE_RECOMMENDATION_FEEDBACK_VARIANT_FRAME_NODE_ID}\`).`,
          "Theme: `components/synapse-theme.css`.",
        ].join(" "),
      },
    },
  },
  args: specAccurateArgs,
};

export default meta;
type Story = StoryObj<typeof RecommendationFeedback>;

export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  args: specAccurateArgs,
  decorators: [
    (Story) => (
      <div style={{ width: 600, boxSizing: "border-box" }}>
        <Story />
      </div>
    ),
  ],
};

export const WithCustomPrompt: Story = {
  name: "With Custom Prompt",
  args: {
    ...specAccurateArgs,
    prompt: "Was this summary helpful?",
    timestamp: "Today, 2:15 PM",
  },
  decorators: [
    (Story) => (
      <div style={{ width: 600, boxSizing: "border-box" }}>
        <Story />
      </div>
    ),
  ],
};

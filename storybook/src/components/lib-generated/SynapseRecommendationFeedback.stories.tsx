/**
 * Storybook: Synapse Recommendation Feedback from `lib/react/synapse/recommendation-feedback`
 * (Synapse-native / standalone — React + CSS Modules).
 *
 * Theme: components/synapse-theme.css
 * Spec: components/synapse/recommendation-feedback/design-spec.md
 */
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/synapse-theme.css";
import { SPEC_ACCURATE_DESIGN_STORY } from "@component-contracts/common/story-meta";
import {
  SYNAPSE_RECOMMENDATION_FEEDBACK_DESIGN_SPEC_PATH,
} from "../../spec-contracts/synapse-recommendation-feedback.contract";
import {
  SYNAPSE_RECOMMENDATION_FEEDBACK_DOCS_DESCRIPTION,
  SYNAPSE_RECOMMENDATION_FEEDBACK_SOURCE_CODE,
} from "./synapse-recommendation-feedback.developer-usage";
import {
  SynapseRecommendationFeedback, type SynapseRecommendationFeedbackProps,
} from "@synapse/react/recommendation-feedback";

const meta: Meta<SynapseRecommendationFeedbackProps> = {
  tags: ["autodocs"],
  title: "Components/Synapse/Recommendation Feedback",
  component: SynapseRecommendationFeedback,
  parameters: {
    layout: "centered",
    docs: {
      canvas: { sourceState: "open" },
      description: {
        component: [
          SYNAPSE_RECOMMENDATION_FEEDBACK_DOCS_DESCRIPTION,
          `Source: \`${SYNAPSE_RECOMMENDATION_FEEDBACK_DESIGN_SPEC_PATH}\`.`,
          "Theme: `components/synapse-theme.css`. Import from `@synapse/react/recommendation-feedback`.",
        ].join("\n\n"),
      },
      source: {
        type: "code",
        language: "tsx",
        code: SYNAPSE_RECOMMENDATION_FEEDBACK_SOURCE_CODE,
      },
    },
  },
};

export default meta;
type Story = StoryObj<SynapseRecommendationFeedbackProps>;

export const SpecAccurateDesign: Story = {
  name: SPEC_ACCURATE_DESIGN_STORY,
  render: () => (
    <SynapseRecommendationFeedback />
  ),
};


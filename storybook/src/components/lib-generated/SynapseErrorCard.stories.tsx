/**
 * Storybook: Synapse Error Card from `lib/react/synapse/error-card`
 * (Synapse-native / standalone — React + CSS Modules).
 *
 * Theme: components/synapse-theme.css
 * Spec: components/synapse/errorcard/design-spec.md
 */
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/synapse-theme.css";
import { SPEC_ACCURATE_DESIGN_STORY } from "@component-contracts/common/story-meta";
import {
  SYNAPSE_ERROR_CARD_DESIGN_SPEC_PATH,
} from "../../spec-contracts/synapse-error-card.contract";
import {
  SYNAPSE_ERROR_CARD_DOCS_DESCRIPTION,
  SYNAPSE_ERROR_CARD_SOURCE_CODE,
} from "./synapse-error-card.developer-usage";
import {
  SynapseErrorCard, type SynapseErrorCardProps,
} from "@synapse/react/error-card";

const meta: Meta<SynapseErrorCardProps> = {
  tags: ["autodocs"],
  title: "Components/Synapse/Error Card",
  component: SynapseErrorCard,
  parameters: {
    layout: "centered",
    docs: {
      canvas: { sourceState: "open" },
      description: {
        component: [
          SYNAPSE_ERROR_CARD_DOCS_DESCRIPTION,
          `Source: \`${SYNAPSE_ERROR_CARD_DESIGN_SPEC_PATH}\`.`,
          "Theme: `components/synapse-theme.css`. Import from `@synapse/react/error-card`.",
        ].join("\n\n"),
      },
      source: {
        type: "code",
        language: "tsx",
        code: SYNAPSE_ERROR_CARD_SOURCE_CODE,
      },
    },
  },
};

export default meta;
type Story = StoryObj<SynapseErrorCardProps>;

export const SpecAccurateDesign: Story = {
  name: SPEC_ACCURATE_DESIGN_STORY,
  render: () => (
    <div style={{ width: 420 }}>
      <SynapseErrorCard
        title="Unable to load data"
        message="The request failed. Try again, or contact support if it continues."
        action={{ label: "Retry", onClick: () => undefined }}
      />
    </div>
  ),
};


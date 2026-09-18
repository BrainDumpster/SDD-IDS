/**
 * Storybook: Synapse Empty State from `lib/react/synapse/empty-state`
 * (Synapse-native / standalone — React + CSS Modules).
 *
 * Theme: components/synapse-theme.css
 * Spec: components/synapse/emptystate/design-spec.md
 */
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/synapse-theme.css";
import { SPEC_ACCURATE_DESIGN_STORY } from "@component-contracts/common/story-meta";
import {
  SYNAPSE_EMPTY_STATE_DESIGN_SPEC_PATH,
} from "../../spec-contracts/synapse-empty-state.contract";
import {
  SYNAPSE_EMPTY_STATE_DOCS_DESCRIPTION,
  SYNAPSE_EMPTY_STATE_SOURCE_CODE,
} from "./synapse-empty-state.developer-usage";
import {
  SynapseEmptyState, type SynapseEmptyStateProps,
} from "@synapse/react/empty-state";

const meta: Meta<SynapseEmptyStateProps> = {
  tags: ["autodocs"],
  title: "Components/Synapse/Empty State",
  component: SynapseEmptyState,
  parameters: {
    layout: "centered",
    docs: {
      canvas: { sourceState: "open" },
      description: {
        component: [
          SYNAPSE_EMPTY_STATE_DOCS_DESCRIPTION,
          `Source: \`${SYNAPSE_EMPTY_STATE_DESIGN_SPEC_PATH}\`.`,
          "Theme: `components/synapse-theme.css`. Import from `@synapse/react/empty-state`.",
        ].join("\n\n"),
      },
      source: {
        type: "code",
        language: "tsx",
        code: SYNAPSE_EMPTY_STATE_SOURCE_CODE,
      },
    },
  },
};

export default meta;
type Story = StoryObj<SynapseEmptyStateProps>;

export const SpecAccurateDesign: Story = {
  name: SPEC_ACCURATE_DESIGN_STORY,
  render: () => (
    <SynapseEmptyState
      title="No results"
      description="Try adjusting filters or create a new item."
      action={{ label: "Create", onClick: () => undefined }}
    />
  ),
};


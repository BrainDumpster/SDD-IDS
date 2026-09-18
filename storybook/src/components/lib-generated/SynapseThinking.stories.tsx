/**
 * Storybook: Synapse Thinking from `lib/react/synapse/thinking`
 * (Synapse-native / standalone — React + CSS Modules).
 *
 * Theme: components/synapse-theme.css
 * Spec: components/synapse/thinking/design-spec.md
 */
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/synapse-theme.css";
import { SPEC_ACCURATE_DESIGN_STORY } from "@component-contracts/common/story-meta";
import {
  SYNAPSE_THINKING_DESIGN_SPEC_PATH,
} from "../../spec-contracts/synapse-thinking.contract";
import {
  SYNAPSE_THINKING_DOCS_DESCRIPTION,
  SYNAPSE_THINKING_SOURCE_CODE,
} from "./synapse-thinking.developer-usage";
import {
  SynapseThinking, type SynapseThinkingProps,
} from "@synapse/react/thinking";

const meta: Meta<SynapseThinkingProps> = {
  tags: ["autodocs"],
  title: "Components/Synapse/Thinking",
  component: SynapseThinking,
  parameters: {
    layout: "centered",
    docs: {
      canvas: { sourceState: "open" },
      description: {
        component: [
          SYNAPSE_THINKING_DOCS_DESCRIPTION,
          `Source: \`${SYNAPSE_THINKING_DESIGN_SPEC_PATH}\`.`,
          "Theme: `components/synapse-theme.css`. Import from `@synapse/react/thinking`.",
        ].join("\n\n"),
      },
      source: {
        type: "code",
        language: "tsx",
        code: SYNAPSE_THINKING_SOURCE_CODE,
      },
    },
  },
};

export default meta;
type Story = StoryObj<SynapseThinkingProps>;

export const SpecAccurateDesign: Story = {
  name: SPEC_ACCURATE_DESIGN_STORY,
  render: () => (
    <SynapseThinking variant="spinner" label="Collecting information" />
  ),
};

export const ProgressBar: Story = {
  name: "Progress Bar",
  render: () => <SynapseThinking variant="progressBar" label="Calculating..." progress={10} />,
};


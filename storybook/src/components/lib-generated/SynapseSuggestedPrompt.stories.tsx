/**
 * Storybook: Synapse Suggested Prompt from `lib/react/synapse/suggested-prompt`
 * (Synapse-native / standalone — React + CSS Modules).
 *
 * Theme: components/synapse-theme.css
 * Spec: components/synapse/suggested-prompt/design-spec.md
 */
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/synapse-theme.css";
import { SPEC_ACCURATE_DESIGN_STORY } from "@component-contracts/common/story-meta";
import {
  SYNAPSE_SUGGESTED_PROMPT_DESIGN_SPEC_PATH,
} from "../../spec-contracts/synapse-suggested-prompt.contract";
import {
  SYNAPSE_SUGGESTED_PROMPT_DOCS_DESCRIPTION,
  SYNAPSE_SUGGESTED_PROMPT_SOURCE_CODE,
} from "./synapse-suggested-prompt.developer-usage";
import {
  SynapseSuggestedPrompt, SynapseSuggestedPromptList, type SynapseSuggestedPromptProps,
} from "@synapse/react/suggested-prompt";

const meta: Meta<SynapseSuggestedPromptProps> = {
  tags: ["autodocs"],
  title: "Components/Synapse/Suggested Prompt",
  component: SynapseSuggestedPrompt,
  parameters: {
    layout: "centered",
    docs: {
      canvas: { sourceState: "open" },
      description: {
        component: [
          SYNAPSE_SUGGESTED_PROMPT_DOCS_DESCRIPTION,
          `Source: \`${SYNAPSE_SUGGESTED_PROMPT_DESIGN_SPEC_PATH}\`.`,
          "Theme: `components/synapse-theme.css`. Import from `@synapse/react/suggested-prompt`.",
        ].join("\n\n"),
      },
      source: {
        type: "code",
        language: "tsx",
        code: SYNAPSE_SUGGESTED_PROMPT_SOURCE_CODE,
      },
    },
  },
};

export default meta;
type Story = StoryObj<SynapseSuggestedPromptProps>;

export const SpecAccurateDesign: Story = {
  name: SPEC_ACCURATE_DESIGN_STORY,
  render: () => (
    <SynapseSuggestedPromptList layout="vertical">
      <SynapseSuggestedPrompt label="Summarize the health of my environment" icon />
      <SynapseSuggestedPrompt label="Show critical alerts from the last 24 hours" />
      <SynapseSuggestedPrompt label="Draft a status update for stakeholders" aiGradient />
    </SynapseSuggestedPromptList>
  ),
};

export const Variants: Story = {
  name: "Variants",
  render: () => (
    <SynapseSuggestedPromptList layout="wrap">
      <SynapseSuggestedPrompt label="Default chip" />
      <SynapseSuggestedPrompt label="With icon" icon />
      <SynapseSuggestedPrompt label="AI gradient" aiGradient />
      <SynapseSuggestedPrompt label="Icon + gradient" icon aiGradient />
    </SynapseSuggestedPromptList>
  ),
};


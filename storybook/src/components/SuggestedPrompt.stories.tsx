import "../../../components/synapse-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import { SuggestedPrompt, SuggestedPromptList } from "./SuggestedPrompt";
import {
  SYNAPSE_SUGGESTED_PROMPT_DESIGN_SPEC_PATH,
  SYNAPSE_SUGGESTED_PROMPT_SAMPLE_LABEL,
  SYNAPSE_SUGGESTED_PROMPT_VARIANT_NODES,
} from "../spec-contracts/synapse-suggested-prompt.contract";

const specAccurateArgs = {
  label: SYNAPSE_SUGGESTED_PROMPT_SAMPLE_LABEL,
  aiGradient: false,
  icon: false,
};

const meta: Meta<typeof SuggestedPrompt> = {
  title: "Spec Generated/Synapse/Chat and Layout/Suggested Prompt",
  component: SuggestedPrompt,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          `Spec-driven Synapse Suggested Prompt. Source: \`${SYNAPSE_SUGGESTED_PROMPT_DESIGN_SPEC_PATH}\`.`,
          `Primary story: **AI Gradient=false** (Figma \`${SYNAPSE_SUGGESTED_PROMPT_VARIANT_NODES.aiGradientFalse}\`).`,
          "Theme: `components/synapse-theme.css`.",
        ].join(" "),
      },
    },
  },
  args: specAccurateArgs,
};

export default meta;
type Story = StoryObj<typeof SuggestedPrompt>;

/** Figma `48467:26157` — `AI Gradient=false`. */
export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  args: specAccurateArgs,
};

/** Figma `53325:277102` — `AI Gradient=true`. */
export const AiGradientTrue: Story = {
  name: "AI Gradient True",
  args: {
    ...specAccurateArgs,
    aiGradient: true,
  },
  parameters: {
    docs: {
      description: {
        story: `Figma \`${SYNAPSE_SUGGESTED_PROMPT_VARIANT_NODES.aiGradientTrue}\`. Same semantic token bindings as false in live verification; variant axis reserved for programme gradient chrome.`,
      },
    },
  },
};

/** Figma `icon=true` — leading `arrow-right` 16px. */
export const WithIcon: Story = {
  name: "With Icon",
  args: {
    ...specAccurateArgs,
    icon: true,
  },
};

/** Variant matrix — Figma component set `48467:26158`. */
export const VariantMatrix: Story = {
  name: "Variant Matrix",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <SuggestedPrompt label={SYNAPSE_SUGGESTED_PROMPT_SAMPLE_LABEL} aiGradient={false} />
      <SuggestedPrompt label={SYNAPSE_SUGGESTED_PROMPT_SAMPLE_LABEL} aiGradient />
      <SuggestedPrompt label={SYNAPSE_SUGGESTED_PROMPT_SAMPLE_LABEL} icon />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `Figma set \`48467:26158\`: AI Gradient false/true + optional icon.`,
      },
    },
  },
};

/** List layouts consumed by Chat Input Box composition. */
export const VerticalList: Story = {
  name: "Vertical List",
  render: () => (
    <div style={{ width: 370 }}>
      <SuggestedPromptList layout="vertical">
        <SuggestedPrompt label="Summarize the health of my environment" />
        <SuggestedPrompt label="Show me what needs my attention right now" />
        <SuggestedPrompt label="Highlight the top risks across compute and storage" />
      </SuggestedPromptList>
    </div>
  ),
};

export const WrapList: Story = {
  name: "Wrap List",
  render: () => (
    <div style={{ width: 370 }}>
      <SuggestedPromptList layout="wrap">
        <SuggestedPrompt label="How do I add memory to PowerEdge?" />
        <SuggestedPrompt label="How can I learn about ransomware incidents on PowerMax?" />
        <SuggestedPrompt label="Summarize the health of my environment" />
      </SuggestedPromptList>
    </div>
  ),
};

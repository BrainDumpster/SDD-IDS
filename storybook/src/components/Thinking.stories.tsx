import "../../../components/synapse-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useState } from "react";
import { Thinking } from "./Thinking";
import {
  SYNAPSE_THINKING_DESIGN_SPEC_PATH,
  SYNAPSE_THINKING_EXAMPLES_BOARD_NODE_ID,
  SYNAPSE_THINKING_PROGRESS_BAR_SPEC_PATH,
  SYNAPSE_THINKING_PROGRESS_SAMPLE_LABEL,
  SYNAPSE_THINKING_PROGRESS_SAMPLE_VALUE,
  SYNAPSE_THINKING_SPINNER_SAMPLE_LABEL,
  SYNAPSE_THINKING_SPINNER_SPEC_PATH,
  SYNAPSE_THINKING_VARIANT_FRAME_NODES,
  SYNAPSE_THINKING_VARIANT_NODES,
} from "../spec-contracts/synapse-thinking.contract";

const meta: Meta<typeof Thinking> = {
  title: "Spec Generated/Synapse/Chat and Layout/Thinking",
  component: Thinking,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          `Spec-driven Synapse Thinking. Source: \`${SYNAPSE_THINKING_DESIGN_SPEC_PATH}\`.`,
          `Examples board: Figma \`${SYNAPSE_THINKING_EXAMPLES_BOARD_NODE_ID}\`.`,
          `Composes [\`${SYNAPSE_THINKING_SPINNER_SPEC_PATH}\`](spinner) and [\`${SYNAPSE_THINKING_PROGRESS_BAR_SPEC_PATH}\`](progress-bar).`,
          "Theme: `components/synapse-theme.css`.",
        ].join(" "),
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Thinking>;

/** Figma `53259:126109` — `Options=Thinking with Spinner`. */
export const WithSpinner: Story = {
  name: "With Spinner",
  args: {
    variant: "spinner",
    label: SYNAPSE_THINKING_SPINNER_SAMPLE_LABEL,
  },
  parameters: {
    docs: {
      description: {
        story: [
          `Figma \`${SYNAPSE_THINKING_VARIANT_NODES.spinner}\` (frame \`${SYNAPSE_THINKING_VARIANT_FRAME_NODES.spinner}\`).`,
          "Small Synapse Spinner + user-defined Body 1 label.",
        ].join(" "),
      },
    },
  },
};

/** Figma `53259:126110` — `Options=Thinking with Progress Bar`. */
export const WithProgressBar: Story = {
  name: "With Progress Bar",
  args: {
    variant: "progressBar",
    label: SYNAPSE_THINKING_PROGRESS_SAMPLE_LABEL,
    progress: SYNAPSE_THINKING_PROGRESS_SAMPLE_VALUE,
  },
  parameters: {
    docs: {
      description: {
        story: [
          `Figma \`${SYNAPSE_THINKING_VARIANT_NODES.progressBar}\` (frame \`${SYNAPSE_THINKING_VARIANT_FRAME_NODES.progressBar}\`).`,
          "Placeholder label + Synapse inline progress bar with dynamic `progress` (0–100).",
        ].join(" "),
      },
    },
  },
};

export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  args: {
    variant: "spinner",
    label: SYNAPSE_THINKING_SPINNER_SAMPLE_LABEL,
  },
};

/** Both variants from the Chat System Response examples board. */
export const VariantMatrix: Story = {
  name: "Variant Matrix",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 32, width: 400 }}>
      <Thinking variant="spinner" label={SYNAPSE_THINKING_SPINNER_SAMPLE_LABEL} />
      <Thinking
        variant="progressBar"
        label={SYNAPSE_THINKING_PROGRESS_SAMPLE_LABEL}
        progress={SYNAPSE_THINKING_PROGRESS_SAMPLE_VALUE}
      />
    </div>
  ),
};

/** Parent-controlled `progress` updates (dynamic % done). */
export const DynamicProgress: Story = {
  name: "Dynamic Progress",
  render: function DynamicProgressStory() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
      const timerId = window.setInterval(() => {
        setProgress((current) => (current >= 100 ? 0 : current + 10));
      }, 1200);
      return () => window.clearInterval(timerId);
    }, []);

    return (
      <Thinking
        variant="progressBar"
        label={SYNAPSE_THINKING_PROGRESS_SAMPLE_LABEL}
        progress={progress}
      />
    );
  },
};

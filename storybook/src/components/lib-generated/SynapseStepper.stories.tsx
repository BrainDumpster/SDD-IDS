/**
 * Storybook: Synapse Stepper from `lib/react/synapse/stepper`
 * (Synapse-native / standalone — React + CSS Modules).
 *
 * Theme: components/synapse-theme.css
 * Spec: components/synapse/stepper/design-spec.md
 */
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/synapse-theme.css";
import { SPEC_ACCURATE_DESIGN_STORY } from "@component-contracts/common/story-meta";
import {
  SYNAPSE_STEPPER_DESIGN_SPEC_PATH,
} from "../../spec-contracts/synapse-stepper.contract";
import {
  SYNAPSE_STEPPER_DOCS_DESCRIPTION,
  SYNAPSE_STEPPER_SOURCE_CODE,
} from "./synapse-stepper.developer-usage";
import {
  SynapseStepper, type SynapseStepperProps,
} from "@synapse/react/stepper";

const meta: Meta<SynapseStepperProps> = {
  tags: ["autodocs"],
  title: "Components/Synapse/Stepper",
  component: SynapseStepper,
  parameters: {
    layout: "centered",
    docs: {
      canvas: { sourceState: "open" },
      description: {
        component: [
          SYNAPSE_STEPPER_DOCS_DESCRIPTION,
          `Source: \`${SYNAPSE_STEPPER_DESIGN_SPEC_PATH}\`.`,
          "Theme: `components/synapse-theme.css`. Import from `@synapse/react/stepper`.",
        ].join("\n\n"),
      },
      source: {
        type: "code",
        language: "tsx",
        code: SYNAPSE_STEPPER_SOURCE_CODE,
      },
    },
  },
};

export default meta;
type Story = StoryObj<SynapseStepperProps>;

export const SpecAccurateDesign: Story = {
  name: SPEC_ACCURATE_DESIGN_STORY,
  render: () => (
    <div style={{ width: 560 }}>
      <SynapseStepper
        steps={["Connect", "Configure", "Review", "Done"]}
        activeStep={1}
        completed={[0]}
      />
    </div>
  ),
};

export const Vertical: Story = {
  name: "Vertical",
  render: () => (
    <SynapseStepper
      orientation="vertical"
      steps={["Connect", "Configure", "Review"]}
      activeStep={1}
      completed={[0]}
    />
  ),
};


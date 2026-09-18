/**
 * Storybook: Synapse Helper from `lib/react/synapse/helper`
 * (IDS-fork reexport façade — React + CSS Modules).
 *
 * Theme: components/synapse-theme.css
 */
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/synapse-theme.css";
import { SPEC_ACCURATE_DESIGN_STORY } from "@component-contracts/common/story-meta";
import {
  SYNAPSE_HELPER_DOCS_DESCRIPTION,
  SYNAPSE_HELPER_SOURCE_CODE,
} from "./synapse-helper.developer-usage";
import {
  SynapseHelper,
  SynapseHelperText,
  type SynapseHelperProps,
} from "@synapse/react/helper";

const meta: Meta<SynapseHelperProps> = {
  tags: ["autodocs"],
  title: "Components/Synapse/Helper",
  component: SynapseHelper,
  parameters: {
    layout: "centered",
    docs: {
      canvas: { sourceState: "open" },
      description: {
        component: [
          SYNAPSE_HELPER_DOCS_DESCRIPTION,
          "Theme: `components/synapse-theme.css`. Import from `@synapse/react/helper`.",
        ].join("\n\n"),
      },
      source: {
        type: "code",
        language: "tsx",
        code: SYNAPSE_HELPER_SOURCE_CODE,
      },
    },
  },
};

export default meta;
type Story = StoryObj<SynapseHelperProps>;

export const SpecAccurateDesign: Story = {
  name: SPEC_ACCURATE_DESIGN_STORY,
  render: () => (
    <SynapseHelper><SynapseHelperText>Helper text</SynapseHelperText></SynapseHelper>
  ),
};

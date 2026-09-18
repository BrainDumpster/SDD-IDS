/**
 * Storybook: Synapse Error from `lib/react/synapse/error`
 * (IDS-fork reexport façade — React + CSS Modules).
 *
 * Theme: components/synapse-theme.css
 */
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/synapse-theme.css";
import { SPEC_ACCURATE_DESIGN_STORY } from "@component-contracts/common/story-meta";
import {
  SYNAPSE_ERROR_DOCS_DESCRIPTION,
  SYNAPSE_ERROR_SOURCE_CODE,
} from "./synapse-error.developer-usage";
import {
  SynapseError,
  SynapseErrorText,
  type SynapseErrorProps,
} from "@synapse/react/error";

const meta: Meta<SynapseErrorProps> = {
  tags: ["autodocs"],
  title: "Components/Synapse/Error",
  component: SynapseError,
  parameters: {
    layout: "centered",
    docs: {
      canvas: { sourceState: "open" },
      description: {
        component: [
          SYNAPSE_ERROR_DOCS_DESCRIPTION,
          "Theme: `components/synapse-theme.css`. Import from `@synapse/react/error`.",
        ].join("\n\n"),
      },
      source: {
        type: "code",
        language: "tsx",
        code: SYNAPSE_ERROR_SOURCE_CODE,
      },
    },
  },
};

export default meta;
type Story = StoryObj<SynapseErrorProps>;

export const SpecAccurateDesign: Story = {
  name: SPEC_ACCURATE_DESIGN_STORY,
  render: () => (
    <SynapseError><SynapseErrorText>Error text</SynapseErrorText></SynapseError>
  ),
};

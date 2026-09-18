/**
 * Storybook: Synapse Icon from `lib/react/synapse/icon`
 * (IDS-fork reexport façade — React + CSS Modules).
 *
 * Theme: components/synapse-theme.css
 */
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/synapse-theme.css";
import { SPEC_ACCURATE_DESIGN_STORY } from "@component-contracts/common/story-meta";
import {
  SYNAPSE_ICON_DOCS_DESCRIPTION,
  SYNAPSE_ICON_SOURCE_CODE,
} from "./synapse-icon.developer-usage";
import {
  SynapseIcon,
  
  type SynapseIconProps,
} from "@synapse/react/icon";

const meta: Meta<SynapseIconProps> = {
  tags: ["autodocs"],
  title: "Components/Synapse/Icon",
  component: SynapseIcon,
  parameters: {
    layout: "centered",
    docs: {
      canvas: { sourceState: "open" },
      description: {
        component: [
          SYNAPSE_ICON_DOCS_DESCRIPTION,
          "Theme: `components/synapse-theme.css`. Import from `@synapse/react/icon`.",
        ].join("\n\n"),
      },
      source: {
        type: "code",
        language: "tsx",
        code: SYNAPSE_ICON_SOURCE_CODE,
      },
    },
  },
};

export default meta;
type Story = StoryObj<SynapseIconProps>;

export const SpecAccurateDesign: Story = {
  name: SPEC_ACCURATE_DESIGN_STORY,
  render: () => (
    <SynapseIcon shape="settings-gear-detailed" size={16} />
  ),
};

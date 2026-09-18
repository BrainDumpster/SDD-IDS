/**
 * Storybook: Synapse Tracker from `lib/react/synapse/tracker`
 * (Synapse-native / standalone — React + CSS Modules).
 *
 * Theme: components/synapse-theme.css
 * Spec: components/synapse/tracker/design-spec.md
 */
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/synapse-theme.css";
import { SPEC_ACCURATE_DESIGN_STORY } from "@component-contracts/common/story-meta";
import {
  SYNAPSE_TRACKER_DESIGN_SPEC_PATH,
} from "../../spec-contracts/synapse-tracker.contract";
import {
  SYNAPSE_TRACKER_DOCS_DESCRIPTION,
  SYNAPSE_TRACKER_SOURCE_CODE,
} from "./synapse-tracker.developer-usage";
import {
  SynapseTracker, type SynapseTrackerProps,
} from "@synapse/react/tracker";

const meta: Meta<SynapseTrackerProps> = {
  tags: ["autodocs"],
  title: "Components/Synapse/Tracker",
  component: SynapseTracker,
  parameters: {
    layout: "centered",
    docs: {
      canvas: { sourceState: "open" },
      description: {
        component: [
          SYNAPSE_TRACKER_DOCS_DESCRIPTION,
          `Source: \`${SYNAPSE_TRACKER_DESIGN_SPEC_PATH}\`.`,
          "Theme: `components/synapse-theme.css`. Import from `@synapse/react/tracker`.",
        ].join("\n\n"),
      },
      source: {
        type: "code",
        language: "tsx",
        code: SYNAPSE_TRACKER_SOURCE_CODE,
      },
    },
  },
};

export default meta;
type Story = StoryObj<SynapseTrackerProps>;

export const SpecAccurateDesign: Story = {
  name: SPEC_ACCURATE_DESIGN_STORY,
  render: () => (
    <div style={{ width: 480 }}>
      <SynapseTracker
        items={[
          { label: "Discover", status: "complete" },
          { label: "Analyze", status: "active" },
          { label: "Remediate", status: "pending" },
        ]}
      />
    </div>
  ),
};


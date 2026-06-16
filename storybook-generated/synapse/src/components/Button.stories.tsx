import React from "react";
import type { ComponentProps } from "react";
import "../../../../components/synapse-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../../../../storybook/src/components/Button";
import {
  SYNAPSE_BUTTON_DESIGN_SPEC_PATH,
  SYNAPSE_BUTTON_SPEC_ACCURATE_VARIANT_NODE_ID,
} from "../../../../storybook/src/spec-contracts/synapse-button.contract";

const specAccurateArgs: ComponentProps<typeof Button> = {
  programme: "synapse",
  variant: "primary",
  size: "lg",
  children: "Button",
};

const meta: Meta<typeof Button> = {
  title: "Spec Generated/Synapse/Button",
  component: Button,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          `Spec-driven Synapse Button (IDS Button contract). Source: \`${SYNAPSE_BUTTON_DESIGN_SPEC_PATH}\`.`,
          `Primary story: **Primary / Large / default** (Figma \`${SYNAPSE_BUTTON_SPEC_ACCURATE_VARIANT_NODE_ID}\`) with \`radius-4\` + focus ring \`radius-6\`.`,
          "Theme: `components/synapse-theme.css`. Programme chrome: `programme=\"synapse\"`.",
        ].join(" "),
      },
    },
  },
  args: specAccurateArgs,
};

export default meta;
type Story = StoryObj<typeof Button>;

/** Figma `47808:32122` — Primary, Default, Large. */
export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  args: specAccurateArgs,
};

/** Four styles × large — Figma documentation board `47809:1805`. */
export const VariantMatrix: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
      <Button programme="synapse" variant="primary" size="lg">
        Button
      </Button>
      <Button programme="synapse" variant="secondary" size="lg">
        Button
      </Button>
      <Button programme="synapse" variant="tertiary" size="lg">
        Button
      </Button>
      <Button programme="synapse" variant="destructive" size="lg">
        Button
      </Button>
      <Button programme="synapse" variant="primary" size="lg" disabled>
        Disabled
      </Button>
    </div>
  ),
};

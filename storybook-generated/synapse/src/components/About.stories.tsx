import React from "react";
import "../../../../components/synapse-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import logoDellTechHoriz from "../../../../assets/icons/logo-delltech-horiz.svg";
import { About } from "../../../../storybook/src/components/About";
import { Button } from "../../../../storybook/src/components/Button";
import {
  SYNAPSE_ABOUT_DESIGN_SPEC_PATH,
  SYNAPSE_ABOUT_MAIN_NODE_ID,
  SYNAPSE_ABOUT_SAMPLE_COPYRIGHT,
  SYNAPSE_ABOUT_SAMPLE_PRODUCT_TITLE,
  SYNAPSE_ABOUT_SAMPLE_SERIAL,
  SYNAPSE_ABOUT_SAMPLE_VERSION,
  SYNAPSE_ABOUT_SERIAL_ROW_NODE_ID,
  SYNAPSE_ABOUT_SURFACE_HEIGHT_PX,
  SYNAPSE_ABOUT_SURFACE_WIDTH_PX,
} from "../../../../storybook/src/spec-contracts/synapse-about.contract";

const synapseButtonProps = { programme: "synapse" as const, size: "lg" as const };

const specAccurateArgs = {
  productTitle: SYNAPSE_ABOUT_SAMPLE_PRODUCT_TITLE,
  versionLabel: SYNAPSE_ABOUT_SAMPLE_VERSION,
  logoSrc: logoDellTechHoriz,
  copyrightText: SYNAPSE_ABOUT_SAMPLE_COPYRIGHT,
  closeLabel: "Close",
};

const meta: Meta<typeof About> = {
  title: "Spec Generated/Synapse/About",
  component: About,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: [
          `Spec-driven Synapse About (IDS About contract). Source: \`${SYNAPSE_ABOUT_DESIGN_SPEC_PATH}\`.`,
          `Primary story: **About-Synapse** (Figma \`${SYNAPSE_ABOUT_MAIN_NODE_ID}\`, ${SYNAPSE_ABOUT_SURFACE_WIDTH_PX}×${SYNAPSE_ABOUT_SURFACE_HEIGHT_PX}).`,
          "Centered product title, version, Dell Technologies logo, copyright, single Close footer.",
          "Theme: `components/synapse-theme.css`.",
        ].join(" "),
      },
    },
  },
  args: specAccurateArgs,
};

export default meta;
type Story = StoryObj<typeof About>;

function AboutCanvas({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        width: "100%",
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box",
        background: "var(--color-background-surface-1)",
        padding: "var(--padding-padding-24)",
      }}
    >
      {children}
    </div>
  );
}

/** Figma `49962:52708` — default About-Synapse (no serial row). */
export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  render: (args) => (
    <AboutCanvas>
      <About
        {...args}
        trigger={<Button {...synapseButtonProps}>Open About</Button>}
      />
    </AboutCanvas>
  ),
  args: specAccurateArgs,
};

/** Figma `49962:52727` — optional serial number + copy affordance. */
export const WithSerialNumber: Story = {
  name: "With Serial Number",
  render: (args) => (
    <AboutCanvas>
      <About
        {...args}
        showSerialNumber
        serialNumber={SYNAPSE_ABOUT_SAMPLE_SERIAL}
        onSerialCopy={() => console.log("[Synapse About] serial copied")}
        trigger={<Button {...synapseButtonProps}>Open About (Serial)</Button>}
      />
    </AboutCanvas>
  ),
  args: specAccurateArgs,
  parameters: {
    docs: {
      description: {
        story: `Figma \`${SYNAPSE_ABOUT_SERIAL_ROW_NODE_ID}\` — serial label + \`copy\` icon (14×14).`,
      },
    },
  },
};

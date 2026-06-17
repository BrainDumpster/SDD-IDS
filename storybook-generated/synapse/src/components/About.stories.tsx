import React from "react";
import "../../../../components/synapse-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import logoDellTechHoriz from "../../../../assets/icons/logo-delltech-horiz.svg";
import { About } from "../../../../storybook/src/components/About";
import { Button } from "../../../../storybook/src/components/Button";
import {
  SYNAPSE_ABOUT_CENTER_MAX_WIDTH_PX,
  SYNAPSE_ABOUT_DESIGN_SPEC_PATH,
  SYNAPSE_ABOUT_FIGMA_NODES,
  SYNAPSE_ABOUT_IDS_BASELINE_SPEC_PATH,
  SYNAPSE_ABOUT_PRODUCT_COPYRIGHT_GAP_PX,
  SYNAPSE_ABOUT_SAMPLE_COPYRIGHT,
  SYNAPSE_ABOUT_SAMPLE_PRODUCT_TITLE,
  SYNAPSE_ABOUT_SAMPLE_SERIAL,
  SYNAPSE_ABOUT_SAMPLE_VERSION,
  SYNAPSE_ABOUT_SURFACE_HEIGHT_PX,
  SYNAPSE_ABOUT_SURFACE_WIDTH_PX,
  SYNAPSE_ABOUT_SERIAL_ROW_NODE_ID,
  SYNAPSE_BUTTON_DESIGN_SPEC_PATH,
} from "../../../../storybook/src/spec-contracts/synapse-about.contract";

const synapseButtonProps = { programme: "synapse" as const, size: "lg" as const };

const specAccurateArgs = {
  programme: "synapse" as const,
  productTitle: SYNAPSE_ABOUT_SAMPLE_PRODUCT_TITLE,
  versionLabel: SYNAPSE_ABOUT_SAMPLE_VERSION,
  showProductIcon: false,
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
          `Spec-driven Synapse About (IDS-fork). Source: \`${SYNAPSE_ABOUT_DESIGN_SPEC_PATH}\`.`,
          `IDS baseline: \`${SYNAPSE_ABOUT_IDS_BASELINE_SPEC_PATH}\`.`,
          `Primary story: **About-Synapse** (Figma \`${SYNAPSE_ABOUT_FIGMA_NODES.main}\`, ${SYNAPSE_ABOUT_SURFACE_WIDTH_PX}×${SYNAPSE_ABOUT_SURFACE_HEIGHT_PX}).`,
          `Programme deltas: 16px shell radius, neutral-light border, title \`var(--color-icon-brand-base)\`, Product↔Copyright gap ${SYNAPSE_ABOUT_PRODUCT_COPYRIGHT_GAP_PX}px, center max-width ${SYNAPSE_ABOUT_CENTER_MAX_WIDTH_PX}px, no default product icon.`,
          `Footer Close: \`${SYNAPSE_BUTTON_DESIGN_SPEC_PATH}\` (\`programme="synapse"\`).`,
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
        story: `Figma serial row \`${SYNAPSE_ABOUT_SERIAL_ROW_NODE_ID}\` — label + \`copy\` icon (14×14).`,
      },
    },
  },
};

export const WithProductIcon: Story = {
  name: "With Product Icon",
  render: (args) => (
    <AboutCanvas>
      <About
        {...args}
        showProductIcon
        productIconSlug="shield-cloud"
        trigger={<Button {...synapseButtonProps}>Open About (Icon)</Button>}
      />
    </AboutCanvas>
  ),
  args: specAccurateArgs,
  parameters: {
    docs: {
      description: {
        story:
          "Runtime optional slot — Synapse Figma `49962:52708` omits the product icon; when shown, tint via `var(--color-icon-brand-base)` (Synapse brand blue).",
      },
    },
  },
};

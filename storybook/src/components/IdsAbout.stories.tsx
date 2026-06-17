import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../components/ids-theme.css";
import logoDellTechHoriz from "../../../assets/icons/logo-delltech-horiz.svg";
import { About } from "./About";
import { Button } from "./Button";
import {
  IDS_ABOUT_DESIGN_SPEC_PATH,
  IDS_ABOUT_FIGMA_NODES,
  IDS_ABOUT_PRODUCT_ICON_SLUG,
  IDS_ABOUT_SAMPLE_COPYRIGHT,
  IDS_ABOUT_SAMPLE_PRODUCT_TITLE,
  IDS_ABOUT_SAMPLE_SERIAL,
  IDS_ABOUT_SAMPLE_TAB_LABELS,
  IDS_ABOUT_SAMPLE_VERSION,
  IDS_ABOUT_SURFACE_HEIGHT_PX,
  IDS_ABOUT_SURFACE_WIDTH_PX,
  IDS_TAB_DESIGN_SPEC_PATH,
} from "../spec-contracts/ids-about.contract";

const idsButtonProps = { programme: "ids" as const, size: "lg" as const };

const specAccurateArgs = {
  programme: "ids" as const,
  productTitle: IDS_ABOUT_SAMPLE_PRODUCT_TITLE,
  versionLabel: IDS_ABOUT_SAMPLE_VERSION,
  showProductIcon: true,
  productIconSlug: IDS_ABOUT_PRODUCT_ICON_SLUG,
  logoSrc: logoDellTechHoriz,
  copyrightText: IDS_ABOUT_SAMPLE_COPYRIGHT,
  closeLabel: "Close",
};

const meta: Meta<typeof About> = {
  title: "Spec Generated/IDS/About",
  component: About,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: [
          `Spec-driven IDS About. Source: \`${IDS_ABOUT_DESIGN_SPEC_PATH}\`.`,
          `Primary story: **About-Main** \`Tabs=False\` (Figma \`${IDS_ABOUT_FIGMA_NODES.mainTabsFalse}\`, ${IDS_ABOUT_SURFACE_WIDTH_PX}×${IDS_ABOUT_SURFACE_HEIGHT_PX}).`,
          `Center-content spacing/sizing: IDS Design Library \`${IDS_ABOUT_FIGMA_NODES.designLibraryContentDefault}\`.`,
          "Centered product icon, Header 1 title, version, Dell Technologies logo, single centered copyright paragraph, Close footer.",
          "Theme: `components/ids-theme.css`.",
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

/** Figma `30680:10962` — About-Main, Tabs=False, product icon + name + version + copyright. */
export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  render: (args) => (
    <AboutCanvas>
      <About
        {...args}
        trigger={<Button {...idsButtonProps}>Open About</Button>}
      />
    </AboutCanvas>
  ),
  args: specAccurateArgs,
};

/** Figma `30680:10879` — optional serial number row with copy affordance. */
export const WithSerialNumber: Story = {
  name: "With Serial Number",
  render: (args) => (
    <AboutCanvas>
      <About
        {...args}
        showSerialNumber
        serialNumber={IDS_ABOUT_SAMPLE_SERIAL}
        onSerialCopy={() => console.log("[IDS About] serial copied")}
        trigger={<Button {...idsButtonProps}>Open About (Serial)</Button>}
      />
    </AboutCanvas>
  ),
  args: specAccurateArgs,
  parameters: {
    docs: {
      description: {
        story: `Figma example \`${IDS_ABOUT_FIGMA_NODES.exampleSerial}\` — serial label + \`copy\` icon (14×14).`,
      },
    },
  },
};

/** Figma `30680:10962` with `showProductIcon=false` — product name only (no icon). */
export const WithoutProductIcon: Story = {
  name: "Without Product Icon",
  render: (args) => (
    <AboutCanvas>
      <About
        {...args}
        showProductIcon={false}
        productIconSlug={undefined}
        productIconSrc={undefined}
        trigger={<Button {...idsButtonProps}>Open About (No Icon)</Button>}
      />
    </AboutCanvas>
  ),
  args: { ...specAccurateArgs, showProductIcon: false },
};

const tabbedAdditionalTabs = IDS_ABOUT_SAMPLE_TAB_LABELS.map((label, index) => ({
  id: `tab-option-${index + 1}`,
  label,
}));

/** Figma `30680:10947` — About-Main `Tabs=True`; MODAL-TAB-BAR uses IDS Tab primary (`components/ids/tab/design-spec.md`). */
export const WithTabs: Story = {
  name: "With Tabs",
  render: (args) => (
    <AboutCanvas>
      <About
        {...args}
        showTabs
        showSerialNumber
        serialNumber={IDS_ABOUT_SAMPLE_SERIAL}
        additionalTabs={tabbedAdditionalTabs}
        trigger={<Button {...idsButtonProps}>Open About (Tabs)</Button>}
      />
    </AboutCanvas>
  ),
  args: specAccurateArgs,
  parameters: {
    docs: {
      description: {
        story: [
          `Figma \`${IDS_ABOUT_FIGMA_NODES.mainTabsTrue}\` — tabs are part of dialog **Top-Content** body (MODAL-TAB-BAR + Frame-Center). IDS Tab **primary** per \`${IDS_TAB_DESIGN_SPEC_PATH}\`.`,
          "Close is top-right in MODAL-TAB-BAR; About content lives inside the active tab panel with no scrollbar on default About.",
        ].join(" "),
      },
    },
  },
};

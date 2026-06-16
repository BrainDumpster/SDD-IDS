import "../../../components/synapse-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import { SynapseAccordion } from "./SynapseAccordion";
import {
  SYNAPSE_ACCORDION_DESIGN_SPEC_PATH,
  SYNAPSE_ACCORDION_MAIN_SET_NODE_ID,
  SYNAPSE_ACCORDION_SAMPLE_ITEMS,
} from "../spec-contracts/synapse-accordion.contract";

const meta: Meta<typeof SynapseAccordion> = {
  title: "Spec Generated/Synapse/Accordion",
  component: SynapseAccordion,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          `Spec-driven Synapse Accordion (IDS-fork). Source: \`${SYNAPSE_ACCORDION_DESIGN_SPEC_PATH}\`.`,
          `Figma component set: \`${SYNAPSE_ACCORDION_MAIN_SET_NODE_ID}\`.`,
        ].join(" "),
      },
    },
  },
  args: {
    items: [...SYNAPSE_ACCORDION_SAMPLE_ITEMS],
    multiple: false,
    chevronPosition: "left",
    variant: "default",
  },
};

export default meta;
type Story = StoryObj<typeof SynapseAccordion>;

export const Default: Story = {};

export const FirstOpen: Story = {
  args: { defaultValue: ["section1"] },
};

export const MultipleOpen: Story = {
  args: { multiple: true, defaultValue: ["section1", "section2"] },
};

export const ChevronRight: Story = {
  args: { chevronPosition: "right", defaultValue: ["section2"] },
};

export const WithDisabledItem: Story = {
  args: {
    items: [
      ...SYNAPSE_ACCORDION_SAMPLE_ITEMS.slice(0, 2),
      { value: "section3", title: "Section 3 (disabled)", content: "Unavailable.", disabled: true },
    ],
  },
};

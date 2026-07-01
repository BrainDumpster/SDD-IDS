import "../../../components/synapse-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import { SPEC_ACCURATE_DESIGN_STORY } from "../../../component-contracts/common/story-meta";
import { SynapseAccordion } from "./SynapseAccordion";
import {
  ACCORDION_API_DEFAULTS,
  ACCORDION_SPEC_ACCURATE_DEFAULTS,
  ACCORDION_SPEC_DEMO_ITEMS,
  ACCORDION_SPEC_DISABLED_ITEM,
  ACCORDION_SPEC_FORM_ITEMS,
} from "../spec-contracts/ids-accordion.contract";
import {
  SYNAPSE_ACCORDION_DESIGN_SPEC_PATH,
  SYNAPSE_ACCORDION_MAIN_SET_NODE_ID,
} from "../spec-contracts/synapse-accordion.contract";

const meta: Meta<typeof SynapseAccordion> = {
  title: "Spec Generated/Synapse/Accordion",
  component: SynapseAccordion,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          `Spec-driven Synapse Accordion (IDS-fork, shared \`IdsAccordion\`). Source: \`${SYNAPSE_ACCORDION_DESIGN_SPEC_PATH}\`.`,
          `Figma component set: \`${SYNAPSE_ACCORDION_MAIN_SET_NODE_ID}\`. Composition contract mirrors IDS \`items[]\` API.`,
        ].join(" "),
      },
    },
  },
  args: {
    items: ACCORDION_SPEC_DEMO_ITEMS,
    ...ACCORDION_API_DEFAULTS,
  },
};

export default meta;
type Story = StoryObj<typeof SynapseAccordion>;

export const SpecAccurateDesign: Story = {
  name: SPEC_ACCURATE_DESIGN_STORY,
  args: {
    items: ACCORDION_SPEC_DEMO_ITEMS,
    multiple: ACCORDION_SPEC_ACCURATE_DEFAULTS.multiple,
    defaultValue: [...ACCORDION_SPEC_ACCURATE_DEFAULTS.defaultValue],
    chevronPosition: ACCORDION_SPEC_ACCURATE_DEFAULTS.chevronPosition,
    variant: ACCORDION_SPEC_ACCURATE_DEFAULTS.variant,
  },
};

export const Default: Story = {};

export const FirstOpen: Story = {
  args: { defaultValue: ["section1"] },
};

export const MultipleOpen: Story = {
  args: { multiple: true, defaultValue: ["section1", "section2"] },
};

export const WithDisabledItem: Story = {
  args: {
    items: [...ACCORDION_SPEC_DEMO_ITEMS, ACCORDION_SPEC_DISABLED_ITEM],
  },
};

export const ChevronLeft: Story = {
  args: { chevronPosition: "left" },
};

export const ChevronRight: Story = {
  args: { chevronPosition: "right", defaultValue: ["section2"] },
};

export const AccordionWithForm: Story = {
  args: {
    chevronPosition: "left",
    variant: "form",
    items: ACCORDION_SPEC_FORM_ITEMS,
  },
};

import "../../../components/ids-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import { SPEC_ACCURATE_DESIGN_STORY } from "../../../component-contracts/common/story-meta";
import { IdsAccordion } from "./IdsAccordion";
import {
  ACCORDION_API_DEFAULTS,
  ACCORDION_SPEC_ACCURATE_DEFAULTS,
  ACCORDION_SPEC_DEMO_ITEMS,
  IDS_ACCORDION_DESIGN_SPEC_PATH,
} from "../spec-contracts/ids-accordion.contract";

/**
 * Stories consume `../spec-contracts/ids-accordion.contract.tsx`, which mirrors
 * {@link IDS_ACCORDION_DESIGN_SPEC_PATH} (Composition & API + Codegen anatomy).
 * Keep demo data and matrix defaults in the contract file so codegen QA can import the same shapes.
 */
const meta: Meta<typeof IdsAccordion> = {
  title: "Spec Generated/IDS/Accordion",
  component: IdsAccordion,
  parameters: {
    docs: {
      description: {
        component: `Spec-driven examples: runtime contract in \`storybook/src/spec-contracts/ids-accordion.contract.tsx\` (source MDX: \`${IDS_ACCORDION_DESIGN_SPEC_PATH}\`).`,
      },
    },
  },
  args: {
    items: ACCORDION_SPEC_DEMO_ITEMS,
    ...ACCORDION_API_DEFAULTS,
  },
};

export default meta;
type Story = StoryObj<typeof IdsAccordion>;

/** Canonical spec defaults — lives in-package so Storybook can import this CSF reliably. */
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
  args: {
    defaultValue: ["section1"],
  },
};

export const MultipleOpen: Story = {
  args: {
    multiple: true,
    defaultValue: ["section1", "section2"],
  },
};

export const ChevronLeft: Story = {
  args: {
    chevronPosition: "left",
  },
};

export const ChevronRight: Story = {
  args: {
    chevronPosition: "right",
  },
};

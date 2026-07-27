/* Spec Accurate Design — Powerflex Accordion (ids-fork) */
import React from "react";
import "../../../../components/powerflex-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import { IdsAccordion as PowerflexAccordion } from "../../../../storybook/src/components/IdsAccordion";

const DESIGN_SPEC_PATH = "components/powerflex/accordion/design-spec.md";

const sampleItems = [
  {
    value: "panel-1",
    title: "Panel",
    content: (
      <div>
        <p>Customize your content by swapping this component with your local component or one of the defined templates.</p>
        <a href="#">Learn how to swap component</a>
      </div>
    ),
  },
  {
    value: "panel-2",
    title: "Panel",
    content: "Collapsed panel body content for Accordion item two.",
  },
  {
    value: "panel-3",
    title: "Panel",
    content: "Collapsed panel body content for Accordion item three.",
  },
];

const meta: Meta<typeof PowerflexAccordion> = {
  title: "Spec Generated/Powerflex/Accordion",
  component: PowerflexAccordion,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          `Spec-driven Powerflex Accordion (ids-fork). Source: \`${DESIGN_SPEC_PATH}\`.`,
          "Figma Main `10962:89111` (Accordion-Main); Elements `10962:89124` / `10962:89134`.",
          "Shared runtime: `IdsAccordion` + `components/powerflex-theme.css`.",
        ].join(" "),
      },
    },
  },
  args: {
    items: sampleItems,
    multiple: false,
    defaultValue: ["panel-1"],
    variant: "default",
    chevronPosition: "left",
  },
  argTypes: {
    multiple: { control: "boolean" },
    variant: { control: "select", options: ["default", "form"] },
    chevronPosition: { control: "inline-radio", options: ["left", "right"] },
  },
};

export default meta;
type Story = StoryObj<typeof PowerflexAccordion>;

/** Figma Main chevron-left sample + first panel expanded — Spec Accurate Design defaults. */
export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  args: {
    items: sampleItems,
    multiple: false,
    defaultValue: ["panel-1"],
    variant: "default",
    chevronPosition: "left",
  },
};

export const ChevronRight: Story = {
  args: {
    chevronPosition: "right",
    defaultValue: ["panel-1"],
  },
};

export const MultipleExpand: Story = {
  args: {
    multiple: true,
    defaultValue: ["panel-1", "panel-2"],
  },
};

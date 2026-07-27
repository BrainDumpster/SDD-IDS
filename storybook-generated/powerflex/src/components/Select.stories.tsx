/* Spec Accurate Design — Powerflex Select (standalone) */
import React from "react";
import "../../../../components/powerflex-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import {
  Select,
  type SelectItem,
} from "../../../../storybook/src/components/Select";

const DESIGN_SPEC_PATH = "components/powerflex/select/design-spec.md";

const sampleItems: SelectItem[] = [
  { id: "action-1", label: "Action", hasSubmenu: true },
  { id: "action-2", label: "Action", hasSubmenu: true },
];

const meta: Meta<typeof Select> = {
  title: "Spec Generated/Powerflex/Select",
  component: Select,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          `Spec-driven Powerflex Select (standalone). Source: \`${DESIGN_SPEC_PATH}\`.`,
          "Figma Main `3022:1260` (select).",
          "Runtime: `Select` + `components/powerflex-theme.css`.",
        ].join(" "),
      },
    },
  },
  args: {
    value: "Option",
    placeholder: "Placeholder",
    size: "lg",
    open: true,
    disabled: false,
    trailingIconSlug: "arrow-tri-down-solid",
    items: sampleItems,
  },
  argTypes: {
    size: { control: "inline-radio", options: ["lg", "md", "sm"] },
    open: { control: "boolean" },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

/** Figma filled / lg / active(open) sample — Spec Accurate Design defaults. */
export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  args: {
    value: "Option",
    placeholder: "Placeholder",
    size: "lg",
    open: true,
    disabled: false,
    trailingIconSlug: "arrow-tri-down-solid",
    items: sampleItems,
  },
};

export const PlaceholderClosed: Story = {
  args: {
    value: undefined,
    placeholder: "Placeholder",
    open: false,
  },
};

export const EmptySmall: Story = {
  args: {
    value: undefined,
    placeholder: undefined,
    size: "sm",
    open: false,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    open: false,
  },
};

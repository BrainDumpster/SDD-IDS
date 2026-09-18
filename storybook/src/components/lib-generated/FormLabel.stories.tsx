/**
 * Storybook: design-spec–generated Form Label from `lib/react/ids/form-label`
 * (React + CSS Modules).
 *
 * Anatomy:
 *   labelGroup (<label for>) → labelText + requiredMarker? · infoIcon?
 *
 * Theme: components/ids-theme.css
 * Spec: components/ids/form-label/design-spec.md
 */
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/ids-theme.css";
import {
  FORM_LABEL_DOCS_DESCRIPTION,
  FORM_LABEL_SOURCE_CODE,
} from "./ids-form-label.developer-usage";
import { IdsFormLabel, type IdsFormLabelProps } from "@ids/react/form-label";

type StoryArgs = Omit<IdsFormLabelProps, "children"> & { label: string };

/** Figma sample from component set `12065:229953` — "Label: *" + info icon, md. */
const specAccurateArgs: StoryArgs = {
  label: "Label:",
  size: "md",
  required: true,
  showInfoIcon: true,
  infoLabel: "More information",
};

function FormLabelDemo({ label, ...rest }: StoryArgs) {
  return <IdsFormLabel {...rest}>{label}</IdsFormLabel>;
}

const meta: Meta<StoryArgs> = {
  tags: ["autodocs"],
  title: "Components/IDS/Form Label",
  component: IdsFormLabel,
  parameters: {
    layout: "padded",
    docs: {
      canvas: { sourceState: "open" },
      description: { component: FORM_LABEL_DOCS_DESCRIPTION },
      source: { type: "code", language: "tsx", code: FORM_LABEL_SOURCE_CODE },
    },
  },
  args: specAccurateArgs,
  argTypes: {
    label: { control: "text" },
    size: { control: "select", options: ["sm", "md", "lg"] },
    required: { control: "boolean" },
    showInfoIcon: { control: "boolean" },
    infoLabel: { control: "text" },
  },
  render: (args) => <FormLabelDemo {...args} />,
};

export default meta;
type Story = StoryObj<StoryArgs>;

/** Primary sample: md, required + info icon. */
export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  args: specAccurateArgs,
};

/** Figma `Size` variants stacked — 24 / 32 / 40px rows. */
export const SizeMatrix: Story = {
  name: "Size Matrix",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: 16 }}>
      <IdsFormLabel size="sm" required showInfoIcon infoLabel="More information">
        Small (24px)
      </IdsFormLabel>
      <IdsFormLabel size="md" required showInfoIcon infoLabel="More information">
        Medium (32px)
      </IdsFormLabel>
      <IdsFormLabel size="lg" required showInfoIcon infoLabel="More information">
        Large (40px)
      </IdsFormLabel>
    </div>
  ),
};

export const RequiredOnly: Story = {
  name: "Required (no icon)",
  args: { label: "Email", size: "md", required: true, showInfoIcon: false },
};

export const WithInfoIcon: Story = {
  name: "With Info Icon",
  args: {
    label: "Password",
    size: "md",
    required: false,
    showInfoIcon: true,
    infoLabel: "Must be at least 8 characters",
  },
};

export const Plain: Story = {
  name: "Plain (optional field)",
  args: { label: "Nickname", size: "md", required: false, showInfoIcon: false },
};

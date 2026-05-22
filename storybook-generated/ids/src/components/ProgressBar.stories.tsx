import "../../../../components/ids-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import React, { type ComponentProps } from "react";
import { IdsProgressBar } from "../../../../storybook/src/components/IdsProgressBar";

const DESIGN_SPEC_PATH = "components/ids/progress-bar/design-spec.mdx";

/** Figma `11099:57210` — Determinate/regular, Thin, In Progress + helper. */
const specAccurateArgs: ComponentProps<typeof IdsProgressBar> = {
  value: 30,
  label: "Label",
  type: "with-label",
  thickness: "thin",
  state: "in-progress",
  showHelperText: true,
  helperText: "Helper text (time estimate)",
};

const meta: Meta<typeof IdsProgressBar> = {
  title: "Spec Generated/IDS/Progress Bar",
  component: IdsProgressBar,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          `Spec-driven IDS Progress Bar. Source of truth: \`${DESIGN_SPEC_PATH}\`.`,
          "Primary story: Figma `11099:57210` (with-label, thin, 30%, helper).",
          "Tokens: `components/ids-theme.css`. Icons: `Icon` + `assets/icons/<slug>.svg`.",
        ].join(" "),
      },
    },
  },
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100 } },
    type: { control: "select", options: ["with-label", "inline", "indeterminate"] },
    thickness: { control: "select", options: ["thin", "medium", "thick"] },
    state: {
      control: "select",
      options: ["in-progress", "completed-success", "completed-warning", "failed-error"],
    },
    showHelperText: { control: "boolean" },
  },
  args: specAccurateArgs,
};

export default meta;
type Story = StoryObj<typeof IdsProgressBar>;

export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  args: specAccurateArgs,
  render: (args) => (
    <div style={{ maxWidth: 300, width: "100%" }}>
      <IdsProgressBar {...args} />
    </div>
  ),
};

/** Figma `11099:57186` — Determinate/Inline, Medium, 30%. */
export const InlineType: Story = {
  args: {
    value: 30,
    type: "inline",
    thickness: "medium",
    state: "in-progress",
  },
  render: (args) => (
    <div style={{ maxWidth: 300, width: "100%" }}>
      <IdsProgressBar {...args} />
    </div>
  ),
};

export const ThicknessReference: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 300 }}>
      <IdsProgressBar
        value={30}
        label="Thin"
        type="with-label"
        thickness="thin"
        state="in-progress"
      />
      <IdsProgressBar
        value={30}
        label="Medium"
        type="with-label"
        thickness="medium"
        state="in-progress"
      />
      <IdsProgressBar
        value={30}
        label="Thick"
        type="with-label"
        thickness="thick"
        state="in-progress"
      />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 300 }}>
      <IdsProgressBar
        value={35}
        label="In Progress"
        type="with-label"
        state="in-progress"
        showHelperText
        helperText="No status icon for in-progress"
      />
      <IdsProgressBar
        value={100}
        label="Completed/Success"
        type="with-label"
        state="completed-success"
        showHelperText
        helperText="Success with status-ok-circ-solid"
      />
      <IdsProgressBar
        value={100}
        label="Completed with Exceptions/Warning"
        type="with-label"
        state="completed-warning"
        showHelperText
        helperText="Warning with status-warn-tri-solid"
      />
      <IdsProgressBar
        value={100}
        label="Failed/Error"
        type="with-label"
        state="failed-error"
        showHelperText
        helperText="Error with status-critical-square-solid"
      />
    </div>
  ),
};

export const Indeterminate: Story = {
  args: {
    label: "Processing...",
    type: "indeterminate",
    thickness: "medium",
    state: "in-progress",
    showHelperText: true,
    helperText: "Estimated time unavailable",
  },
  render: (args) => (
    <div style={{ maxWidth: 300, width: "100%" }}>
      <IdsProgressBar {...args} />
    </div>
  ),
};

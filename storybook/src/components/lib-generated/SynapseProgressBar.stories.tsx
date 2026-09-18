/**
 * Storybook: design-spec–generated Progress Bar from `lib/react/synapse/progress-bar`
 * (IDS-fork reexport façade — React + CSS Modules).
 *
 * Anatomy:
 *   ProgressRoot → MetaRow? → TrackRow (track ± inline %) → HelperRow?
 *
 * Composition: helper row uses lib `SynapseHelper` + `SynapseIcon` (status glyphs).
 * Theme: components/synapse-theme.css
 * Spec: components/synapse/progressbar/design-spec.md
 */
import React, { type ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/synapse-theme.css";
import {
  SYNAPSE_PROGRESS_BAR_DOCS_DESCRIPTION,
  SYNAPSE_PROGRESS_BAR_SOURCE_CODE,
} from "./synapse-progress-bar.developer-usage";
import {
  SynapseProgressBar,
  type SynapseProgressBarProps,
} from "@synapse/react/progress-bar";

const DESIGN_SPEC_PATH = "components/synapse/progressbar/design-spec.md";

/** Figma `11099:57210` — Determinate/regular, Thin, In Progress + helper. */
const specAccurateArgs: SynapseProgressBarProps = {
  value: 30,
  label: "Label",
  type: "with-label",
  thickness: "thin",
  state: "in-progress",
  showHelperText: true,
  helperText: "Helper text (time estimate)",
};

const frameStyle: React.CSSProperties = {
  maxWidth: 300,
  width: "100%",
};

const meta: Meta<SynapseProgressBarProps> = {
  tags: ["autodocs"],
  title: "Components/Synapse/Progress Bar",
  component: SynapseProgressBar,
  parameters: {
    layout: "padded",
    docs: {
      canvas: { sourceState: "open" },
      description: {
        component: SYNAPSE_PROGRESS_BAR_DOCS_DESCRIPTION,
      },
      source: {
        type: "code",
        language: "tsx",
        code: SYNAPSE_PROGRESS_BAR_SOURCE_CODE,
      },
    },
  },
  args: specAccurateArgs,
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100 } },
    type: {
      control: "select",
      options: ["with-label", "inline", "indeterminate"],
    },
    thickness: {
      control: "select",
      options: ["thin", "medium", "thick"],
    },
    state: {
      control: "select",
      options: [
        "in-progress",
        "completed-success",
        "completed-warning",
        "failed-error",
      ],
    },
    showHelperText: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<SynapseProgressBarProps>;

export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  args: specAccurateArgs,
  render: (args) => (
    <div style={frameStyle}>
      <SynapseProgressBar {...args} />
    </div>
  ),
};

/** Figma `11099:57186` — Determinate/Inline, Medium, 30%. */
export const InlineType: Story = {
  name: "Inline Type",
  args: {
    value: 30,
    type: "inline",
    thickness: "medium",
    state: "in-progress",
    showHelperText: false,
  },
  render: (args) => (
    <div style={frameStyle}>
      <SynapseProgressBar {...args} />
    </div>
  ),
};

export const ThicknessReference: Story = {
  name: "Thickness Reference",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 300 }}>
      <SynapseProgressBar
        value={30}
        label="Thin"
        type="with-label"
        thickness="thin"
        state="in-progress"
      />
      <SynapseProgressBar
        value={30}
        label="Medium"
        type="with-label"
        thickness="medium"
        state="in-progress"
      />
      <SynapseProgressBar
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
      <SynapseProgressBar
        value={35}
        label="In Progress"
        type="with-label"
        state="in-progress"
        showHelperText
        helperText="No status icon for in-progress"
      />
      <SynapseProgressBar
        value={100}
        label="Completed/Success"
        type="with-label"
        state="completed-success"
        showHelperText
        helperText="Success with status-ok-circ-solid"
      />
      <SynapseProgressBar
        value={100}
        label="Completed with Exceptions/Warning"
        type="with-label"
        state="completed-warning"
        showHelperText
        helperText="Warning with status-warn-tri-solid"
      />
      <SynapseProgressBar
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
  } satisfies ComponentProps<typeof SynapseProgressBar>,
  render: (args) => (
    <div style={frameStyle}>
      <SynapseProgressBar {...args} />
    </div>
  ),
};

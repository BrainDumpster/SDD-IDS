import "../../../components/synapse-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { SynapseCheckbox } from "./SynapseCheckbox";
import {
  SYNAPSE_CHECKBOX_DESIGN_SPEC_PATH,
  SYNAPSE_CHECKBOX_SAMPLE_LABEL,
  SYNAPSE_CHECKBOX_SPEC_ACCURATE_NODE_ID,
  SYNAPSE_CHECKBOX_STATE_MATRIX_NODE_ID,
} from "../spec-contracts/synapse-checkbox.contract";

const meta: Meta<typeof SynapseCheckbox> = {
  title: "Spec Generated/Synapse/Checkbox",
  component: SynapseCheckbox,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          `Spec-driven Synapse Checkbox (IDS-fork). Source: \`${SYNAPSE_CHECKBOX_DESIGN_SPEC_PATH}\`.`,
          `Primary story: **unchecked / default** (Figma \`${SYNAPSE_CHECKBOX_SPEC_ACCURATE_NODE_ID}\`).`,
          "Theme: `components/synapse-theme.css` (`--checkbox-label-font-weight` → 400; control radius `radius-2`).",
        ].join(" "),
      },
    },
  },
  argTypes: {
    disabled: { control: "boolean" },
    indeterminate: { control: "boolean" },
    error: { control: "boolean" },
    helperText: { control: "text" },
    onChange: { action: "onChange" },
  },
};

export default meta;
type Story = StoryObj<typeof SynapseCheckbox>;

export const SpecAccurateDefault: Story = {
  name: "Spec Accurate / Unchecked Default",
  args: {
    label: SYNAPSE_CHECKBOX_SAMPLE_LABEL,
  },
};

/** Mirrors Figma `8505:14296` main matrix: selection × (default | focus-visible | disabled). */
export const FigmaMainMatrix: Story = {
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "120px repeat(3, minmax(140px, 1fr))",
        gap: "12px 16px",
        alignItems: "center",
        fontSize: 12,
        color: "var(--color-text-neutral-strong)",
      }}
    >
      <div />
      <div>Unselected</div>
      <div>Selected</div>
      <div>Partial</div>
      <div>Default</div>
      <SynapseCheckbox label={SYNAPSE_CHECKBOX_SAMPLE_LABEL} />
      <SynapseCheckbox label={SYNAPSE_CHECKBOX_SAMPLE_LABEL} checked />
      <SynapseCheckbox label={SYNAPSE_CHECKBOX_SAMPLE_LABEL} indeterminate />
      <div>Focus-visible (simulated)</div>
      <SynapseCheckbox label={SYNAPSE_CHECKBOX_SAMPLE_LABEL} simulateFocusVisible />
      <SynapseCheckbox label={SYNAPSE_CHECKBOX_SAMPLE_LABEL} checked simulateFocusVisible />
      <SynapseCheckbox label={SYNAPSE_CHECKBOX_SAMPLE_LABEL} indeterminate simulateFocusVisible />
      <div>Disabled</div>
      <SynapseCheckbox label={SYNAPSE_CHECKBOX_SAMPLE_LABEL} disabled />
      <SynapseCheckbox label={SYNAPSE_CHECKBOX_SAMPLE_LABEL} checked disabled />
      <SynapseCheckbox label={SYNAPSE_CHECKBOX_SAMPLE_LABEL} indeterminate disabled />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `State matrix node \`${SYNAPSE_CHECKBOX_STATE_MATRIX_NODE_ID}\`.`,
      },
    },
  },
};

export const ValidationAndHelperText: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16 }}>
      <SynapseCheckbox label="Email notifications" helperText="Receive weekly summary updates." />
      <SynapseCheckbox
        label="Required acknowledgement"
        error
        helperText="You must accept this option to continue."
      />
      <SynapseCheckbox label="Disabled option" disabled helperText="This option is unavailable." />
    </div>
  ),
};

export const ControlledExample: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);

    return (
      <SynapseCheckbox
        label="Controlled checkbox"
        checked={checked}
        helperText={`Current value: ${checked ? "checked" : "unchecked"}`}
        onChange={setChecked}
      />
    );
  },
};

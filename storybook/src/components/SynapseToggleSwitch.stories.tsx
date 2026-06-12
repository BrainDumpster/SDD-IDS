import "../../../components/synapse-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { SynapseToggleSwitch } from "./SynapseToggleSwitch";
import {
  SYNAPSE_TOGGLE_SWITCH_COMPONENT_SET_NODE_ID,
  SYNAPSE_TOGGLE_SWITCH_DESIGN_SPEC_PATH,
  SYNAPSE_TOGGLE_SWITCH_OFF_DEFAULT_NODE_ID,
  SYNAPSE_TOGGLE_SWITCH_ON_DEFAULT_NODE_ID,
  SYNAPSE_TOGGLE_SWITCH_SAMPLE_LABEL,
  SYNAPSE_TOGGLE_SWITCH_SPEC_ACCURATE_NODE_ID,
} from "../spec-contracts/synapse-toggle-switch.contract";

const meta: Meta<typeof SynapseToggleSwitch> = {
  title: "Spec Generated/Synapse/Toggle Switch",
  component: SynapseToggleSwitch,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          `Spec-driven Synapse Toggle Switch (IDS-fork). Source: \`${SYNAPSE_TOGGLE_SWITCH_DESIGN_SPEC_PATH}\`.`,
          `Primary story: **off / default** (Figma \`${SYNAPSE_TOGGLE_SWITCH_SPEC_ACCURATE_NODE_ID}\`).`,
          "Theme: `components/synapse-theme.css` (inherits IDS track/thumb semantic tokens).",
        ].join(" "),
      },
    },
  },
  argTypes: {
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof SynapseToggleSwitch>;

export const SpecAccurateOffDefault: Story = {
  name: "Spec Accurate / Off Default",
  args: {
    label: SYNAPSE_TOGGLE_SWITCH_SAMPLE_LABEL,
    defaultChecked: false,
  },
};

export const OnDefault: Story = {
  parameters: {
    docs: {
      description: {
        story: `On default cell: Figma \`${SYNAPSE_TOGGLE_SWITCH_ON_DEFAULT_NODE_ID}\`.`,
      },
    },
  },
  args: {
    label: SYNAPSE_TOGGLE_SWITCH_SAMPLE_LABEL,
    defaultChecked: true,
  },
};

export const DisabledOff: Story = {
  args: {
    label: SYNAPSE_TOGGLE_SWITCH_SAMPLE_LABEL,
    disabled: true,
    defaultChecked: false,
  },
};

export const DisabledOn: Story = {
  args: {
    label: SYNAPSE_TOGGLE_SWITCH_SAMPLE_LABEL,
    disabled: true,
    defaultChecked: true,
  },
};

export const Controlled: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <div style={{ display: "grid", gap: 8 }}>
        <SynapseToggleSwitch
          label={SYNAPSE_TOGGLE_SWITCH_SAMPLE_LABEL}
          checked={checked}
          onCheckedChange={setChecked}
        />
        <div style={{ fontSize: 12, color: "var(--color-text-neutral)" }}>
          State: {checked ? "on" : "off"}
        </div>
      </div>
    );
  },
};

export const StateMatrixReference: Story = {
  parameters: {
    docs: {
      description: {
        story: `Component set matrix: Figma \`${SYNAPSE_TOGGLE_SWITCH_COMPONENT_SET_NODE_ID}\` (Off/On × Default/Hover/Focus/Disabled).`,
      },
    },
  },
  render: () => (
    <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
      <SynapseToggleSwitch label="Off" defaultChecked={false} />
      <SynapseToggleSwitch label="On" defaultChecked />
      <SynapseToggleSwitch label="Disabled off" disabled defaultChecked={false} />
      <SynapseToggleSwitch label="Disabled on" disabled defaultChecked />
    </div>
  ),
};

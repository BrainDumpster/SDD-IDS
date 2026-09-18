/**
 * Storybook: design-spec–generated Toggle Switch from `lib/react/synapse/toggle-switch`
 * (IDS-fork reexport façade — React + CSS Modules).
 *
 * Anatomy:
 *   root → input → switch → track → thumb → label?
 *
 * Theme: components/synapse-theme.css
 * Spec: components/synapse/toggleswitch/design-spec.md
 */
import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/synapse-theme.css";
import {
  SYNAPSE_TOGGLE_SWITCH_DOCS_DESCRIPTION,
  SYNAPSE_TOGGLE_SWITCH_SOURCE_CODE,
} from "./synapse-toggle-switch.developer-usage";
import {
  SynapseToggleSwitch,
  type SynapseToggleSwitchProps,
} from "@synapse/react/toggle-switch";

const DESIGN_SPEC_PATH = "components/synapse/toggleswitch/design-spec.md";

/** Spec Accurate Design — labeled off default (Composition & API). */
const specAccurateArgs: SynapseToggleSwitchProps = {
  label: "Enable alerts",
  defaultChecked: false,
  disabled: false,
};

const meta: Meta<SynapseToggleSwitchProps> = {
  tags: ["autodocs"],
  title: "Components/Synapse/Toggle Switch",
  component: SynapseToggleSwitch,
  parameters: {
    layout: "padded",
    docs: {
      canvas: { sourceState: "open" },
      description: {
        component: SYNAPSE_TOGGLE_SWITCH_DOCS_DESCRIPTION,
      },
      source: {
        type: "code",
        language: "tsx",
        code: SYNAPSE_TOGGLE_SWITCH_SOURCE_CODE,
      },
    },
  },
  args: specAccurateArgs,
  argTypes: {
    checked: { control: "boolean" },
    defaultChecked: { control: "boolean" },
    disabled: { control: "boolean" },
    label: { control: "text" },
    "aria-label": { control: "text" },
    onCheckedChange: { action: "onCheckedChange" },
  },
};

export default meta;
type Story = StoryObj<SynapseToggleSwitchProps>;

export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  args: specAccurateArgs,
  render: (args) => <SynapseToggleSwitch {...args} />,
};

export const Off: Story = {
  name: "Off",
  args: {
    label: "Enable alerts",
    defaultChecked: false,
  },
};

export const On: Story = {
  name: "On",
  args: {
    label: "Enable alerts",
    defaultChecked: true,
  },
};

export const DisabledOff: Story = {
  name: "Disabled Off",
  args: {
    label: "Enable alerts",
    disabled: true,
    defaultChecked: false,
  },
};

export const DisabledOn: Story = {
  name: "Disabled On",
  args: {
    label: "Enable alerts",
    disabled: true,
    defaultChecked: true,
  },
};

/** Accessible name via `aria-label` when visible label is absent. */
export const WithoutVisibleLabel: Story = {
  name: "Without Visible Label",
  args: {
    "aria-label": "Enable alerts",
    defaultChecked: false,
  },
};

export const Controlled: Story = {
  name: "Controlled",
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <div style={{ display: "grid", gap: 8 }}>
        <SynapseToggleSwitch
          label="Enable alerts"
          checked={checked}
          onCheckedChange={setChecked}
        />
        <span style={{ color: "var(--color-text-gray-neutral)" }}>
          Checked: {checked ? "true" : "false"}
        </span>
      </div>
    );
  },
};

/** Variant matrix sample: checked × disabled (with labels). */
export const StateMatrix: Story = {
  name: "State Matrix",
  render: () => (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "flex", gap: 24 }}>
        <SynapseToggleSwitch label="Off" defaultChecked={false} />
        <SynapseToggleSwitch label="On" defaultChecked />
      </div>
      <div style={{ display: "flex", gap: 24 }}>
        <SynapseToggleSwitch label="Disabled Off" disabled defaultChecked={false} />
        <SynapseToggleSwitch label="Disabled On" disabled defaultChecked />
      </div>
    </div>
  ),
};

/** Figma matrix frame `42848:100536` — dark surface + tokens. */
export const StateMatrixDark: Story = {
  name: "State Matrix Dark",
  parameters: {
    globals: { theme: "dark" },
    backgrounds: { default: "dark" },
  },
  render: () => (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "flex", gap: 24 }}>
        <SynapseToggleSwitch label="Off" defaultChecked={false} />
        <SynapseToggleSwitch label="On" defaultChecked />
      </div>
      <div style={{ display: "flex", gap: 24 }}>
        <SynapseToggleSwitch label="Disabled Off" disabled defaultChecked={false} />
        <SynapseToggleSwitch label="Disabled On" disabled defaultChecked />
      </div>
    </div>
  ),
};

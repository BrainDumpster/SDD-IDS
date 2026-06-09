import React from "react";
import "../../../components/synapse-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import { SynapseTextInput } from "./SynapseTextInput";
import {
  SYNAPSE_TEXT_INPUT_DESIGN_SPEC_PATH,
  SYNAPSE_TEXT_INPUT_SAMPLE_ERROR,
  SYNAPSE_TEXT_INPUT_SAMPLE_HELPER,
  SYNAPSE_TEXT_INPUT_SAMPLE_PLACEHOLDER,
  SYNAPSE_TEXT_INPUT_SAMPLE_VALUE,
  SYNAPSE_TEXT_INPUT_SCENARIO_NODES,
  SYNAPSE_TEXT_INPUT_SPEC_ACCURATE_SCENARIO_NODE_ID,
  SYNAPSE_TEXT_INPUT_STATE_NODES,
} from "../spec-contracts/synapse-text-input.contract";

const specAccurateArgs = {
  componentType: "text-input" as const,
  size: "large" as const,
  value: SYNAPSE_TEXT_INPUT_SAMPLE_VALUE,
  helperText: SYNAPSE_TEXT_INPUT_SAMPLE_HELPER,
  showHelperText: true,
  showIcon: false,
};

const meta: Meta<typeof SynapseTextInput> = {
  title: "Spec Generated/Synapse/Text Input",
  component: SynapseTextInput,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          `Spec-driven Synapse Text Input (IDS Text Box contract). Source: \`${SYNAPSE_TEXT_INPUT_DESIGN_SPEC_PATH}\`.`,
          `Primary story: **Large / filled / default** (Figma \`${SYNAPSE_TEXT_INPUT_SPEC_ACCURATE_SCENARIO_NODE_ID}\`).`,
          "Theme: `components/synapse-theme.css`. Programme chrome: `radius-4` control + `radius-6` focus ring.",
        ].join(" "),
      },
    },
  },
  args: specAccurateArgs,
};

export default meta;
type Story = StoryObj<typeof SynapseTextInput>;

/** Figma `47834:48520` — Large, filled, helper. */
export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  args: specAccurateArgs,
};

/** Figma scenario nodes — large, small, icon, error. */
export const ScenarioMatrix: Story = {
  name: "Scenario Matrix",
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(280px, 300px))",
        gap: 24,
        padding: 24,
        background: "var(--color-background-surface-1)",
      }}
    >
      <div>
        <p style={{ margin: "0 0 8px", fontSize: 12, color: "var(--color-text-neutral)" }}>
          Large — {SYNAPSE_TEXT_INPUT_SCENARIO_NODES.large}
        </p>
        <SynapseTextInput
          size="large"
          value={SYNAPSE_TEXT_INPUT_SAMPLE_VALUE}
          helperText={SYNAPSE_TEXT_INPUT_SAMPLE_HELPER}
          showIcon={false}
        />
      </div>
      <div>
        <p style={{ margin: "0 0 8px", fontSize: 12, color: "var(--color-text-neutral)" }}>
          Small — {SYNAPSE_TEXT_INPUT_SCENARIO_NODES.small}
        </p>
        <SynapseTextInput
          size="small"
          value={SYNAPSE_TEXT_INPUT_SAMPLE_VALUE}
          helperText={SYNAPSE_TEXT_INPUT_SAMPLE_HELPER}
          showIcon={false}
        />
      </div>
      <div>
        <p style={{ margin: "0 0 8px", fontSize: 12, color: "var(--color-text-neutral)" }}>
          With icon — {SYNAPSE_TEXT_INPUT_SCENARIO_NODES.withIcon}
        </p>
        <SynapseTextInput
          size="large"
          value={SYNAPSE_TEXT_INPUT_SAMPLE_VALUE}
          helperText={SYNAPSE_TEXT_INPUT_SAMPLE_HELPER}
          showIcon
          iconName="mail"
        />
      </div>
      <div>
        <p style={{ margin: "0 0 8px", fontSize: 12, color: "var(--color-text-neutral)" }}>
          Error — {SYNAPSE_TEXT_INPUT_SCENARIO_NODES.error}
        </p>
        <SynapseTextInput
          size="large"
          state="error"
          placeholder={SYNAPSE_TEXT_INPUT_SAMPLE_PLACEHOLDER}
          errorText={SYNAPSE_TEXT_INPUT_SAMPLE_ERROR}
          showIcon={false}
        />
      </div>
    </div>
  ),
};

/** Figma `47833:47770` state symbols — forced `data-state` matrix. */
export const StateMatrix: Story = {
  name: "State Matrix",
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(280px, 300px))",
        gap: 16,
        padding: 24,
        background: "var(--color-background-surface-1)",
      }}
    >
      {(
        [
          ["default", SYNAPSE_TEXT_INPUT_STATE_NODES.largeEmptyDefault],
          ["hover", SYNAPSE_TEXT_INPUT_STATE_NODES.largeEmptyHover],
          ["selected", SYNAPSE_TEXT_INPUT_STATE_NODES.largeEmptySelected],
          ["focus", SYNAPSE_TEXT_INPUT_STATE_NODES.largeEmptyFocus],
          ["disabled", SYNAPSE_TEXT_INPUT_STATE_NODES.largeEmptyDisabled],
          ["error", SYNAPSE_TEXT_INPUT_STATE_NODES.largeEmptyError],
        ] as const
      ).map(([state, node]) => (
        <div key={state}>
          <p
            style={{
              margin: "0 0 8px",
              fontSize: 12,
              color: "var(--color-text-neutral)",
            }}
          >
            {state} — {node}
          </p>
          <SynapseTextInput
            state={state}
            value={state === "error" ? undefined : SYNAPSE_TEXT_INPUT_SAMPLE_VALUE}
            placeholder={SYNAPSE_TEXT_INPUT_SAMPLE_PLACEHOLDER}
            helperText={SYNAPSE_TEXT_INPUT_SAMPLE_HELPER}
            errorText={SYNAPSE_TEXT_INPUT_SAMPLE_ERROR}
            showIcon={state !== "error"}
            disabled={state === "disabled"}
          />
        </div>
      ))}
    </div>
  ),
};

/** Text area — large only (`47833:47872`). */
export const TextArea: Story = {
  name: "Text Area",
  args: {
    componentType: "text-area",
    placeholder: SYNAPSE_TEXT_INPUT_SAMPLE_PLACEHOLDER,
    helperText: SYNAPSE_TEXT_INPUT_SAMPLE_HELPER,
    showIcon: true,
  },
};

/** Runtime focus: click vs Tab keyboard focus ring (`47833:48038`). */
export const FocusBehavior: Story = {
  name: "Focus Behavior",
  render: () => (
    <div style={{ display: "grid", gap: 12, maxWidth: 300, padding: 24 }}>
      <p style={{ margin: 0, fontSize: 12, color: "var(--color-text-neutral)" }}>
        Click inside: selected border only. Tab to field: outer focus ring (radius-6).
      </p>
      <SynapseTextInput value={SYNAPSE_TEXT_INPUT_SAMPLE_VALUE} helperText={SYNAPSE_TEXT_INPUT_SAMPLE_HELPER} />
    </div>
  ),
};

import React from "react";
import "../../../components/synapse-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import { SynapseTag } from "./SynapseTag";
import { Tags } from "./Tags";
import {
  SYNAPSE_TAG_DESIGN_SPEC_PATH,
  SYNAPSE_TAG_IDS_BASELINE_SPEC_PATH,
  SYNAPSE_TAG_IDS_MAIN_NODE_ID,
  SYNAPSE_TAG_SAMPLE_LABEL,
  SYNAPSE_TAG_SCENARIO_BOARDS,
  SYNAPSE_TAG_SPEC_ACCURATE_SCENARIO_NODE_ID,
  SYNAPSE_TAG_TYPE_NODES,
} from "../spec-contracts/synapse-tag.contract";

const specAccurateArgs = {
  type: "read-only" as const,
  label: SYNAPSE_TAG_SAMPLE_LABEL,
  tone: "none" as const,
  size: "small" as const,
};

const meta: Meta<typeof SynapseTag> = {
  title: "Components/Synapse/Tag",
  component: SynapseTag,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          `Spec-driven Synapse Tag (IDS-fork). Source: \`${SYNAPSE_TAG_DESIGN_SPEC_PATH}\`.`,
          `IDS baseline: \`${SYNAPSE_TAG_IDS_BASELINE_SPEC_PATH}\` (Figma \`${SYNAPSE_TAG_IDS_MAIN_NODE_ID}\`).`,
          `Primary story: **Read-only** (Figma \`${SYNAPSE_TAG_SPEC_ACCURATE_SCENARIO_NODE_ID}\`).`,
          "Programme deltas only: `programme=\"synapse\"` → 4px focus offset, critical Light slate tokens, close hover icon. All other chrome inherits IDS.",
          "Theme: `components/synapse-theme.css`.",
        ].join(" "),
      },
    },
  },
  args: specAccurateArgs,
};

export default meta;
type Story = StoryObj<typeof SynapseTag>;

/** Figma `38910:57384` — Read-only, small, non-alerting. */
export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  args: specAccurateArgs,
};

/** Figma `38910:57385` — main type axis. */
export const TypeMatrix: Story = {
  name: "Type Matrix",
  render: () => (
    <div
      style={{
        display: "flex",
        gap: 16,
        flexWrap: "wrap",
        padding: 24,
        background: "var(--color-background-surface-1)",
      }}
    >
      <div>
        <p style={{ margin: "0 0 8px", fontSize: 12, color: "var(--color-text-neutral)" }}>
          Read-only — {SYNAPSE_TAG_TYPE_NODES.readOnly}
        </p>
        <SynapseTag type="read-only" label={SYNAPSE_TAG_SAMPLE_LABEL} size="small" />
      </div>
      <div>
        <p style={{ margin: "0 0 8px", fontSize: 12, color: "var(--color-text-neutral)" }}>
          Clickable — {SYNAPSE_TAG_TYPE_NODES.clickable}
        </p>
        <SynapseTag type="clickable" label={SYNAPSE_TAG_SAMPLE_LABEL} size="large" />
      </div>
      <div>
        <p style={{ margin: "0 0 8px", fontSize: 12, color: "var(--color-text-neutral)" }}>
          Editable — {SYNAPSE_TAG_TYPE_NODES.editableDismissible}
        </p>
        <SynapseTag type="editable" label={SYNAPSE_TAG_SAMPLE_LABEL} size="large" />
      </div>
      <div>
        <p style={{ margin: "0 0 8px", fontSize: 12, color: "var(--color-text-neutral)" }}>
          Badge — {SYNAPSE_TAG_TYPE_NODES.withBadge}
        </p>
        <SynapseTag
          type="badge"
          label={SYNAPSE_TAG_SAMPLE_LABEL}
          size="large"
          showLabel
          labelPrefix="Label"
          badgeValue={1}
        />
      </div>
    </div>
  ),
};

/** Figma `38910:51200` — alerting tones (Strong + Light). */
export const AlertingTones: Story = {
  name: "Alerting Tones",
  render: () => (
    <div style={{ display: "grid", gap: 12, padding: 24 }}>
      <p style={{ margin: 0, fontSize: 12, color: "var(--color-text-neutral)" }}>
        Board {SYNAPSE_TAG_SCENARIO_BOARDS.alerting}
      </p>
      <Tags ariaLabel="Alerting strong tones">
        {(["informational", "success", "minor", "major", "critical"] as const).map((tone) => (
          <SynapseTag key={`${tone}-strong`} type="read-only" label={SYNAPSE_TAG_SAMPLE_LABEL} tone={tone} emphasis="strong" size="small" />
        ))}
      </Tags>
      <Tags ariaLabel="Alerting light tones">
        {(["informational", "success", "minor", "major", "critical"] as const).map((tone) => (
          <SynapseTag key={`${tone}-light`} type="read-only" label={SYNAPSE_TAG_SAMPLE_LABEL} tone={tone} emphasis="light" size="small" />
        ))}
      </Tags>
    </div>
  ),
};

/** Figma `38910:51213` — clickable selected / hover / focus. */
export const ClickableStates: Story = {
  name: "Clickable States",
  render: () => (
    <Tags ariaLabel="Clickable tag states">
      <SynapseTag type="clickable" label={SYNAPSE_TAG_SAMPLE_LABEL} size="large" />
      <SynapseTag type="clickable" label={SYNAPSE_TAG_SAMPLE_LABEL} size="large" demoHover />
      <SynapseTag type="clickable" label={SYNAPSE_TAG_SAMPLE_LABEL} size="large" focusVisible />
      <SynapseTag type="clickable" label={SYNAPSE_TAG_SAMPLE_LABEL} size="large" selected />
      <SynapseTag type="clickable" label={SYNAPSE_TAG_SAMPLE_LABEL} size="large" selected demoHover />
    </Tags>
  ),
};

/** Figma `38910:51235` + `38910:57339` — editable, badge, close. */
export const EditableAndBadgeStates: Story = {
  name: "Editable And Badge States",
  render: () => (
    <div style={{ display: "grid", gap: 16, padding: 24 }}>
      <Tags ariaLabel="Editable tag states">
        <SynapseTag type="editable" label={SYNAPSE_TAG_SAMPLE_LABEL} size="large" />
        <SynapseTag type="editable" label={SYNAPSE_TAG_SAMPLE_LABEL} size="large" error />
        <SynapseTag type="editable" label={SYNAPSE_TAG_SAMPLE_LABEL} size="large" disabled />
        <SynapseTag type="editable" label={SYNAPSE_TAG_SAMPLE_LABEL} size="large" focusOnText showLabel labelPrefix="Label" />
      </Tags>
      <Tags ariaLabel="Badge tag states">
        <SynapseTag type="badge" label={SYNAPSE_TAG_SAMPLE_LABEL} size="large" showLabel labelPrefix="Label" badgeValue={1} />
        <SynapseTag
          type="badge"
          label={SYNAPSE_TAG_SAMPLE_LABEL}
          size="large"
          showLabel
          labelPrefix="Label"
          badgeValue={1}
          focusVisible
        />
        <SynapseTag
          type="badge"
          label={SYNAPSE_TAG_SAMPLE_LABEL}
          size="large"
          showLabel
          labelPrefix="Label"
          badgeValue={1}
          error
        />
      </Tags>
    </div>
  ),
};

/** Figma `38910:51195` — non-alerting large default / error / focus. */
export const NonAlertingLargeStates: Story = {
  name: "Non-Alerting Large States",
  render: () => (
    <Tags ariaLabel="Non-alerting large tag states">
      <SynapseTag type="read-only" label={SYNAPSE_TAG_SAMPLE_LABEL} size="large" />
      <SynapseTag type="read-only" label={SYNAPSE_TAG_SAMPLE_LABEL} size="large" error />
      <SynapseTag type="read-only" label={SYNAPSE_TAG_SAMPLE_LABEL} size="large" focusVisible />
    </Tags>
  ),
};

import React from "react";
import "../../../components/synapse-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import { SynapseTag } from "./SynapseTag";
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
  tone: "non-alerting" as const,
  size: "sm" as const,
};

const meta: Meta<typeof SynapseTag> = {
  title: "Spec Generated/Synapse/Tag",
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
        <SynapseTag type="read-only" label={SYNAPSE_TAG_SAMPLE_LABEL} size="sm" />
      </div>
      <div>
        <p style={{ margin: "0 0 8px", fontSize: 12, color: "var(--color-text-neutral)" }}>
          Clickable — {SYNAPSE_TAG_TYPE_NODES.clickable}
        </p>
        <SynapseTag type="clickable" label={SYNAPSE_TAG_SAMPLE_LABEL} size="lg" />
      </div>
      <div>
        <p style={{ margin: "0 0 8px", fontSize: 12, color: "var(--color-text-neutral)" }}>
          Editable — {SYNAPSE_TAG_TYPE_NODES.editableDismissible}
        </p>
        <SynapseTag type="editable" label={SYNAPSE_TAG_SAMPLE_LABEL} size="lg" closable />
      </div>
      <div>
        <p style={{ margin: "0 0 8px", fontSize: 12, color: "var(--color-text-neutral)" }}>
          Badge — {SYNAPSE_TAG_TYPE_NODES.withBadge}
        </p>
        <SynapseTag
          type="badge"
          label={SYNAPSE_TAG_SAMPLE_LABEL}
          size="lg"
          showLabel
          labelPrefix="Label:"
          badgeCount={1}
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
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {(["info", "success", "minor", "major", "critical"] as const).map((tone) => (
          <SynapseTag key={`${tone}-strong`} type="read-only" label={SYNAPSE_TAG_SAMPLE_LABEL} tone={tone} emphasis="strong" size="sm" />
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {(["info", "success", "minor", "major", "critical"] as const).map((tone) => (
          <SynapseTag key={`${tone}-light`} type="read-only" label={SYNAPSE_TAG_SAMPLE_LABEL} tone={tone} emphasis="light" size="sm" />
        ))}
      </div>
    </div>
  ),
};

/** Figma `38910:51213` — clickable selected / hover / focus. */
export const ClickableStates: Story = {
  name: "Clickable States",
  render: () => (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", padding: 24 }}>
      <SynapseTag type="clickable" label={SYNAPSE_TAG_SAMPLE_LABEL} size="lg" />
      <SynapseTag type="clickable" label={SYNAPSE_TAG_SAMPLE_LABEL} size="lg" visualState="hover" />
      <SynapseTag type="clickable" label={SYNAPSE_TAG_SAMPLE_LABEL} size="lg" visualState="focus" />
      <SynapseTag type="clickable" label={SYNAPSE_TAG_SAMPLE_LABEL} size="lg" selected />
      <SynapseTag type="clickable" label={SYNAPSE_TAG_SAMPLE_LABEL} size="lg" selected visualState="hover" />
    </div>
  ),
};

/** Figma `38910:51235` + `38910:57339` — editable, badge, close. */
export const EditableAndBadgeStates: Story = {
  name: "Editable And Badge States",
  render: () => (
    <div style={{ display: "grid", gap: 16, padding: 24 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <SynapseTag type="editable" label={SYNAPSE_TAG_SAMPLE_LABEL} size="lg" closable />
        <SynapseTag type="editable" label={SYNAPSE_TAG_SAMPLE_LABEL} size="lg" visualState="error" closable />
        <SynapseTag type="editable" label={SYNAPSE_TAG_SAMPLE_LABEL} size="lg" visualState="disabled" closable />
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <SynapseTag type="badge" label={SYNAPSE_TAG_SAMPLE_LABEL} size="lg" showLabel labelPrefix="Label:" badgeCount={1} />
        <SynapseTag
          type="badge"
          label={SYNAPSE_TAG_SAMPLE_LABEL}
          size="lg"
          showLabel
          labelPrefix="Label:"
          badgeCount={1}
          visualState="focus"
        />
        <SynapseTag
          type="badge"
          label={SYNAPSE_TAG_SAMPLE_LABEL}
          size="lg"
          showLabel
          labelPrefix="Label:"
          badgeCount={1}
          visualState="error"
        />
      </div>
    </div>
  ),
};

/** Figma `38910:51195` — non-alerting large default / error / focus. */
export const NonAlertingLargeStates: Story = {
  name: "Non-Alerting Large States",
  render: () => (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", padding: 24 }}>
      <SynapseTag type="read-only" label={SYNAPSE_TAG_SAMPLE_LABEL} size="lg" />
      <SynapseTag type="read-only" label={SYNAPSE_TAG_SAMPLE_LABEL} size="lg" visualState="error" />
      <SynapseTag type="read-only" label={SYNAPSE_TAG_SAMPLE_LABEL} size="lg" visualState="focus" />
    </div>
  ),
};

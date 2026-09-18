/**
 * Storybook: design-spec–generated Segmented Button from
 * `lib/react/synapse/segmented-button` (IDS-fork reexport façade — React + CSS Modules).
 *
 * Hierarchy: SynapseSegmentedButton → SynapseSegmentedText[] | SynapseSegmentedIcon[]
 * Theme: components/synapse-theme.css
 * Spec: components/synapse/segmentedbutton/design-spec.md
 */
import React, { useState, type CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/synapse-theme.css";
import {
  SYNAPSE_SEGMENTED_BUTTON_DOCS_DESCRIPTION,
  SYNAPSE_SEGMENTED_BUTTON_SOURCE_CODE,
} from "./synapse-segmented-button.developer-usage";
import {
  SynapseSegmentedButton,
  SynapseSegmentedIcon,
  SynapseSegmentedText,
  type SynapseSegmentedButtonChangeMeta,
  type SynapseSegmentedSimulatedState,
} from "@synapse/react/segmented-button";

const DESIGN_SPEC_PATH = "components/synapse/segmentedbutton/design-spec.md";

const meta: Meta<typeof SynapseSegmentedButton> = {
  tags: ["autodocs"],
  title: "Components/Synapse/Segmented Button",
  component: SynapseSegmentedButton,
  parameters: {
    layout: "centered",
    docs: {
      canvas: { sourceState: "open" },
      description: {
        component: SYNAPSE_SEGMENTED_BUTTON_DOCS_DESCRIPTION,
      },
      source: {
        type: "code",
        language: "tsx",
        code: SYNAPSE_SEGMENTED_BUTTON_SOURCE_CODE,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof SynapseSegmentedButton>;

type SimulatedState = SynapseSegmentedSimulatedState;

const matrixWrap: CSSProperties = {
  display: "grid",
  gap: 20,
  maxWidth: 640,
};

const matrixRow: CSSProperties = {
  display: "grid",
  gap: 10,
};

const matrixHeading: CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: "var(--color-text-gray-neutral-strong)",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
};

const matrixColumns: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(4, minmax(140px, 1fr))",
  gap: 12,
  alignItems: "start",
};

const matrixCellLabel: CSSProperties = {
  fontSize: 11,
  color: "var(--color-text-gray-neutral)",
  marginBottom: 6,
};

const stateColumns: { label: string; simulatedState?: SimulatedState }[] = [
  { label: "Default" },
  { label: "Hover", simulatedState: "hover" },
  { label: "Press", simulatedState: "press" },
  { label: "Focus", simulatedState: "focus-visible" },
];

function StateMatrixTextDemo() {
  return (
    <div style={matrixWrap}>
      <div style={{ fontSize: 12, color: "var(--color-text-gray-neutral)" }}>
        Figma text option component (node 9015:20992). Focus column uses{" "}
        <code>simulatedState</code>; hover/press columns are pinned for QA.
      </div>

      <div style={matrixRow}>
        <div style={matrixHeading}>Inactive (unselected segment)</div>
        <div style={matrixColumns}>
          {stateColumns.map(({ label, simulatedState }) => (
            <div key={`inactive-${label}`}>
              <div style={matrixCellLabel}>{label}</div>
              <SynapseSegmentedButton
                type="text"
                ariaLabel={`Inactive ${label}`}
                value="option1"
              >
                <SynapseSegmentedText value="option1" label="Option 1" />
                <SynapseSegmentedText
                  value="option2"
                  label="Option Text"
                  simulatedState={simulatedState}
                />
              </SynapseSegmentedButton>
            </div>
          ))}
        </div>
      </div>

      <div style={matrixRow}>
        <div style={matrixHeading}>Active (selected segment)</div>
        <div style={matrixColumns}>
          {stateColumns.map(({ label, simulatedState }) => (
            <div key={`active-${label}`}>
              <div style={matrixCellLabel}>{label}</div>
              <SynapseSegmentedButton
                type="text"
                ariaLabel={`Active ${label}`}
                value="option2"
              >
                <SynapseSegmentedText value="option1" label="Option 1" />
                <SynapseSegmentedText
                  value="option2"
                  label="Option Text"
                  simulatedState={simulatedState}
                />
              </SynapseSegmentedButton>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Figma `SegmentedButton-Main` text × 2, Option 1 selected (`42113:67642`, width 260px). */
export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  render: () => {
    const [value, setValue] = useState("option1");
    return (
      <div style={{ width: 260 }}>
        <SynapseSegmentedButton
          type="text"
          ariaLabel="Segmented options"
          value={value}
          onSelected={setValue}
        >
          <SynapseSegmentedText value="option1" label="Option 1" />
          <SynapseSegmentedText value="option2" label="Option 2" />
        </SynapseSegmentedButton>
      </div>
    );
  },
};

/**
 * Text option matrix — Figma `.Segemented Button Text` (`9015:20992`).
 * Option 1 stays selected on Inactive row; Option 2 selected on Active row.
 */
export const StateMatrixText: Story = {
  name: "State Matrix Text",
  render: () => <StateMatrixTextDemo />,
};

/** Icon option matrix — Figma `.SegementedButton-Element-OptionIcon` (`10148:29576`). */
export const StateMatrixIcon: Story = {
  name: "State Matrix Icon",
  render: () => (
    <div style={matrixWrap}>
      <div style={matrixRow}>
        <div style={matrixHeading}>Inactive (unselected segment)</div>
        <div style={matrixColumns}>
          {stateColumns.map(({ label, simulatedState }) => (
            <div key={`icon-inactive-${label}`}>
              <div style={matrixCellLabel}>{label}</div>
              <SynapseSegmentedButton
                type="icon"
                ariaLabel={`Icon inactive ${label}`}
                value="option1"
              >
                <SynapseSegmentedIcon
                  value="option1"
                  shape="view-hamburger"
                  ariaLabel="Option 1"
                />
                <SynapseSegmentedIcon
                  value="option2"
                  shape="view-hamburger"
                  ariaLabel="Option icon"
                  simulatedState={simulatedState}
                />
              </SynapseSegmentedButton>
            </div>
          ))}
        </div>
      </div>

      <div style={matrixRow}>
        <div style={matrixHeading}>Active (selected segment)</div>
        <div style={matrixColumns}>
          {stateColumns.map(({ label, simulatedState }) => (
            <div key={`icon-active-${label}`}>
              <div style={matrixCellLabel}>{label}</div>
              <SynapseSegmentedButton
                type="icon"
                ariaLabel={`Icon active ${label}`}
                value="option2"
              >
                <SynapseSegmentedIcon
                  value="option1"
                  shape="view-hamburger"
                  ariaLabel="Option 1"
                />
                <SynapseSegmentedIcon
                  value="option2"
                  shape="view-hamburger"
                  ariaLabel="Option icon"
                  simulatedState={simulatedState}
                />
              </SynapseSegmentedButton>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};

export const StateMatrixTextDark: Story = {
  name: "State Matrix Text Dark",
  parameters: {
    globals: { theme: "dark" },
    backgrounds: { default: "dark" },
  },
  render: () => <StateMatrixTextDemo />,
};

/** Three text segments — common Figma width behavior. */
export const TextThreeOptions: Story = {
  name: "Text Three Options",
  render: () => {
    const [value, setValue] = useState("weekly");
    return (
      <SynapseSegmentedButton
        type="text"
        ariaLabel="Billing cycle"
        value={value}
        onSelected={setValue}
      >
        <SynapseSegmentedText value="daily" label="Daily" />
        <SynapseSegmentedText value="weekly" label="Weekly" />
        <SynapseSegmentedText value="monthly" label="Monthly" />
      </SynapseSegmentedButton>
    );
  },
};

/** Validates text counts 2–5 per spec. */
export const TextTwoAndFiveOptions: Story = {
  name: "Text Two And Five Options",
  render: () => {
    const [two, setTwo] = useState("daily");
    const [five, setFive] = useState("c");
    return (
      <div style={{ display: "grid", gap: 20 }}>
        <SynapseSegmentedButton
          type="text"
          ariaLabel="Two options"
          value={two}
          onSelected={setTwo}
        >
          <SynapseSegmentedText value="daily" label="Daily" />
          <SynapseSegmentedText value="weekly" label="Weekly" />
        </SynapseSegmentedButton>
        <SynapseSegmentedButton
          type="text"
          ariaLabel="Five options"
          value={five}
          onSelected={setFive}
        >
          <SynapseSegmentedText value="a" label="Option 1" />
          <SynapseSegmentedText value="b" label="Option 2" />
          <SynapseSegmentedText value="c" label="Option 3" />
          <SynapseSegmentedText value="d" label="Option 4" />
          <SynapseSegmentedText value="e" label="Option 5" />
        </SynapseSegmentedButton>
      </div>
    );
  },
};

/** Icon mode: reference slugs from design-spec asset contract. */
export const IconListTreeGrid: Story = {
  name: "Icon List Tree Grid",
  render: () => {
    const [value, setValue] = useState("tree");
    return (
      <SynapseSegmentedButton
        type="icon"
        ariaLabel="Content view"
        value={value}
        onSelected={setValue}
      >
        <SynapseSegmentedIcon
          value="list"
          shape="view-hamburger"
          ariaLabel="List view"
        />
        <SynapseSegmentedIcon value="tree" shape="nav-tree" ariaLabel="Tree view" />
        <SynapseSegmentedIcon
          value="grid"
          shape="view-sort-grid-solid"
          ariaLabel="Grid view"
        />
      </SynapseSegmentedButton>
    );
  },
};

/** Custom IconSlot — no slug resolution. */
export const IconCustomSlot: Story = {
  name: "Icon Custom Slot",
  render: () => {
    const [value, setValue] = useState("alpha");
    return (
      <SynapseSegmentedButton
        type="icon"
        ariaLabel="Custom glyphs"
        value={value}
        onSelected={setValue}
      >
        <SynapseSegmentedIcon
          value="alpha"
          ariaLabel="Circle view"
          icon={
            <svg width={16} height={14} viewBox="0 0 16 14" aria-hidden>
              <circle cx={8} cy={7} r={5} fill="currentColor" opacity={0.9} />
            </svg>
          }
        />
        <SynapseSegmentedIcon
          value="beta"
          ariaLabel="Square view"
          icon={
            <svg width={16} height={14} viewBox="0 0 16 14" aria-hidden>
              <rect
                x={3}
                y={2}
                width={10}
                height={10}
                rx={1}
                fill="currentColor"
                opacity={0.9}
              />
            </svg>
          }
        />
      </SynapseSegmentedButton>
    );
  },
};

/** `onSelected(value, meta)` — `meta` carries `label` (text) or `ariaLabel` (icon). */
export const OnChangePayload: Story = {
  name: "On Change Payload",
  render: () => {
    const [value, setValue] = useState("a");
    const [lastMeta, setLastMeta] = useState<SynapseSegmentedButtonChangeMeta | null>(
      null,
    );
    return (
      <div style={{ display: "grid", gap: 12 }}>
        <SynapseSegmentedButton
          type="text"
          ariaLabel="Payload demo"
          value={value}
          onSelected={(v, meta) => {
            setValue(v);
            setLastMeta(meta);
          }}
        >
          <SynapseSegmentedText value="a" label="Alpha" />
          <SynapseSegmentedText value="b" label="Beta" />
        </SynapseSegmentedButton>
        <pre
          style={{
            margin: 0,
            padding: 12,
            background: "var(--color-background-gray-neutral-lighter)",
            borderRadius: 4,
            fontSize: 12,
          }}
        >
          value: {JSON.stringify(value)}
          {"\n"}
          meta: {lastMeta ? JSON.stringify(lastMeta) : "—"}
        </pre>
      </div>
    );
  },
};

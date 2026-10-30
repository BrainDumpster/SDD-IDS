/**
 * Storybook: design-spec–generated Segmented Button from
 * `lib/react/ids/segmented-button` (React + CSS Modules, no @base-ui-components).
 *
 * Hierarchy: IdsSegmentedButton → IdsSegmentedText[] | IdsSegmentedIcon[]
 * Theme: components/ids-theme.css
 * Spec: components/ids/segmented-button/design-spec.md
 */
import React, { useState, type CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/ids-theme.css";
import {
  SEGMENTED_BUTTON_DOCS_DESCRIPTION,
  SEGMENTED_BUTTON_SOURCE_CODE,
} from "./ids-segmented-button.developer-usage";
import {
  IdsSegmentedButton,
  IdsSegmentedIcon,
  IdsSegmentedText,
  type IdsSegmentedButtonChangeMeta,
  type IdsSegmentedSimulatedState,
} from "@ids/react/segmented-button";

const DESIGN_SPEC_PATH = "components/ids/segmented-button/design-spec.md";

const meta: Meta<typeof IdsSegmentedButton> = {
  tags: ["autodocs"],
  title: "Components/IDS/Segmented Button",
  component: IdsSegmentedButton,
  parameters: {
    layout: "centered",
    docs: {
      canvas: { sourceState: "open" },
      description: {
        component: SEGMENTED_BUTTON_DOCS_DESCRIPTION,
      },
      source: {
        type: "code",
        language: "tsx",
        code: SEGMENTED_BUTTON_SOURCE_CODE,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof IdsSegmentedButton>;

type SimulatedState = IdsSegmentedSimulatedState;

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
              <IdsSegmentedButton
                type="text"
                ariaLabel={`Inactive ${label}`}
                value="option1"
              >
                <IdsSegmentedText value="option1" label="Option 1" />
                <IdsSegmentedText
                  value="option2"
                  label="Option Text"
                  simulatedState={simulatedState}
                />
              </IdsSegmentedButton>
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
              <IdsSegmentedButton
                type="text"
                ariaLabel={`Active ${label}`}
                value="option2"
              >
                <IdsSegmentedText value="option1" label="Option 1" />
                <IdsSegmentedText
                  value="option2"
                  label="Option Text"
                  simulatedState={simulatedState}
                />
              </IdsSegmentedButton>
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
        <IdsSegmentedButton
          type="text"
          ariaLabel="Segmented options"
          value={value}
          onSelected={setValue}
        >
          <IdsSegmentedText value="option1" label="Option 1" />
          <IdsSegmentedText value="option2" label="Option 2" />
        </IdsSegmentedButton>
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
              <IdsSegmentedButton
                type="icon"
                ariaLabel={`Icon inactive ${label}`}
                value="option1"
              >
                <IdsSegmentedIcon
                  value="option1"
                  shape="view-hamburger"
                  ariaLabel="Option 1"
                />
                <IdsSegmentedIcon
                  value="option2"
                  shape="view-hamburger"
                  ariaLabel="Option icon"
                  simulatedState={simulatedState}
                />
              </IdsSegmentedButton>
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
              <IdsSegmentedButton
                type="icon"
                ariaLabel={`Icon active ${label}`}
                value="option2"
              >
                <IdsSegmentedIcon
                  value="option1"
                  shape="view-hamburger"
                  ariaLabel="Option 1"
                />
                <IdsSegmentedIcon
                  value="option2"
                  shape="view-hamburger"
                  ariaLabel="Option icon"
                  simulatedState={simulatedState}
                />
              </IdsSegmentedButton>
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
      <IdsSegmentedButton
        type="text"
        ariaLabel="Billing cycle"
        value={value}
        onSelected={setValue}
      >
        <IdsSegmentedText value="daily" label="Daily" />
        <IdsSegmentedText value="weekly" label="Weekly" />
        <IdsSegmentedText value="monthly" label="Monthly" />
      </IdsSegmentedButton>
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
        <IdsSegmentedButton
          type="text"
          ariaLabel="Two options"
          value={two}
          onSelected={setTwo}
        >
          <IdsSegmentedText value="daily" label="Daily" />
          <IdsSegmentedText value="weekly" label="Weekly" />
        </IdsSegmentedButton>
        <IdsSegmentedButton
          type="text"
          ariaLabel="Five options"
          value={five}
          onSelected={setFive}
        >
          <IdsSegmentedText value="a" label="Option 1" />
          <IdsSegmentedText value="b" label="Option 2" />
          <IdsSegmentedText value="c" label="Option 3" />
          <IdsSegmentedText value="d" label="Option 4" />
          <IdsSegmentedText value="e" label="Option 5" />
        </IdsSegmentedButton>
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
      <IdsSegmentedButton
        type="icon"
        ariaLabel="Content view"
        value={value}
        onSelected={setValue}
      >
        <IdsSegmentedIcon
          value="list"
          shape="view-hamburger"
          ariaLabel="List view"
        />
        <IdsSegmentedIcon value="tree" shape="nav-tree" ariaLabel="Tree view" />
        <IdsSegmentedIcon
          value="grid"
          shape="view-sort-grid-solid"
          ariaLabel="Grid view"
        />
      </IdsSegmentedButton>
    );
  },
};

/** Custom IconSlot — no slug resolution. */
export const IconCustomSlot: Story = {
  name: "Icon Custom Slot",
  render: () => {
    const [value, setValue] = useState("alpha");
    return (
      <IdsSegmentedButton
        type="icon"
        ariaLabel="Custom glyphs"
        value={value}
        onSelected={setValue}
      >
        <IdsSegmentedIcon
          value="alpha"
          ariaLabel="Circle view"
          icon={
            <svg width={16} height={14} viewBox="0 0 16 14" aria-hidden>
              <circle cx={8} cy={7} r={5} fill="currentColor" opacity={0.9} />
            </svg>
          }
        />
        <IdsSegmentedIcon
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
      </IdsSegmentedButton>
    );
  },
};

/** `onSelected(value, meta)` — `meta` carries `label` (text) or `ariaLabel` (icon). */
export const OnChangePayload: Story = {
  name: "On Change Payload",
  render: () => {
    const [value, setValue] = useState("a");
    const [lastMeta, setLastMeta] = useState<IdsSegmentedButtonChangeMeta | null>(
      null,
    );
    return (
      <div style={{ display: "grid", gap: 12 }}>
        <IdsSegmentedButton
          type="text"
          ariaLabel="Payload demo"
          value={value}
          onSelected={(v, meta) => {
            setValue(v);
            setLastMeta(meta);
          }}
        >
          <IdsSegmentedText value="a" label="Alpha" />
          <IdsSegmentedText value="b" label="Beta" />
        </IdsSegmentedButton>
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

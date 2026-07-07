import "../../../components/ids-theme.css";
import { useState, type CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  SegmentedButton,
  type SegmentedButtonChangeMeta,
  type SegmentedButtonItemIcon,
  type SegmentedButtonItemText,
} from "./SegmentedButton";

const meta: Meta<typeof SegmentedButton> = {
  title: "Spec Generated/IDS/Segmented Button",
  component: SegmentedButton,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof SegmentedButton>;

type SimulatedState = "hover" | "press" | "focus-visible";

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
  color: "var(--color-text-neutral-strong)",
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
  color: "var(--color-text-neutral)",
  marginBottom: 6,
};

function textStatePair(simulatedState?: SimulatedState): SegmentedButtonItemText[] {
  return [
    { value: "option1", label: "Option 1" },
    {
      value: "option2",
      label: "Option Text",
      ...(simulatedState ? { simulatedState } : {}),
    },
  ];
}

function iconStatePair(simulatedState?: SimulatedState): SegmentedButtonItemIcon[] {
  return [
    { value: "option1", icon: "view-hamburger", ariaLabel: "Option 1" },
    {
      value: "option2",
      icon: "view-hamburger",
      ariaLabel: "Option icon",
      ...(simulatedState ? { simulatedState } : {}),
    },
  ];
}

const stateColumns: { label: string; simulatedState?: SimulatedState }[] = [
  { label: "Default" },
  { label: "Hover", simulatedState: "hover" },
  { label: "Press", simulatedState: "press" },
  { label: "Focus", simulatedState: "focus-visible" },
];

function StateMatrixTextDemo() {
  return (
    <div style={matrixWrap}>
      <div style={{ fontSize: 12, color: "var(--color-text-neutral)" }}>
        Figma text option component (node 9015:20992). Focus column uses{" "}
        <code>simulatedState</code>; hover/press columns are pinned for QA.
      </div>

      <div style={matrixRow}>
        <div style={matrixHeading}>Inactive (unselected segment)</div>
        <div style={matrixColumns}>
          {stateColumns.map(({ label, simulatedState }) => (
            <div key={`inactive-${label}`}>
              <div style={matrixCellLabel}>{label}</div>
              <SegmentedButton
                type="text"
                ariaLabel={`Inactive ${label}`}
                value="option1"
                items={textStatePair(simulatedState)}
              />
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
              <SegmentedButton
                type="text"
                ariaLabel={`Active ${label}`}
                value="option2"
                items={textStatePair(simulatedState)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Text option matrix — Figma `.Segemented Button Text` (`9015:20992`).
 * Option 1 stays selected on Inactive row; Option 2 selected on Active row.
 */
export const StateMatrixText: Story = {
  render: () => <StateMatrixTextDemo />,
};

/** Icon option matrix — Figma `.SegementedButton-Element-OptionIcon` (`10148:29576`). */
export const StateMatrixIcon: Story = {
  render: () => (
    <div style={matrixWrap}>
      <div style={matrixRow}>
        <div style={matrixHeading}>Inactive (unselected segment)</div>
        <div style={matrixColumns}>
          {stateColumns.map(({ label, simulatedState }) => (
            <div key={`icon-inactive-${label}`}>
              <div style={matrixCellLabel}>{label}</div>
              <SegmentedButton
                type="icon"
                ariaLabel={`Icon inactive ${label}`}
                value="option1"
                items={iconStatePair(simulatedState)}
              />
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
              <SegmentedButton
                type="icon"
                ariaLabel={`Icon active ${label}`}
                value="option2"
                items={iconStatePair(simulatedState)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};

export const StateMatrixTextDark: Story = {
  parameters: {
    globals: { theme: "dark" },
    backgrounds: { default: "dark" },
  },
  render: () => <StateMatrixTextDemo />,
};

/** Figma `SegmentedButton-Main` text × 2, Option 1 selected (`42113:67642`, width 260px). */
export const SpecAccurateDesign: Story = {
  render: () => {
    const [value, setValue] = useState("option1");
    return (
      <div style={{ width: 260 }}>
        <SegmentedButton
          type="text"
          ariaLabel="Segmented options"
          items={[
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ]}
          value={value}
          onChange={setValue}
        />
      </div>
    );
  },
};

/** Three text segments — common Figma width behavior. */
export const TextThreeOptions: Story = {
  render: () => {
    const [value, setValue] = useState("weekly");
    return (
      <SegmentedButton
        type="text"
        ariaLabel="Billing cycle"
        items={[
          { value: "daily", label: "Daily" },
          { value: "weekly", label: "Weekly" },
          { value: "monthly", label: "Monthly" },
        ]}
        value={value}
        onChange={setValue}
      />
    );
  },
};

/** Validates text counts 2–5 per spec. */
export const TextTwoAndFiveOptions: Story = {
  render: () => {
    const [two, setTwo] = useState("daily");
    const [five, setFive] = useState("c");
    return (
      <div style={{ display: "grid", gap: 20 }}>
        <SegmentedButton
          type="text"
          ariaLabel="Two options"
          items={[
            { value: "daily", label: "Daily" },
            { value: "weekly", label: "Weekly" },
          ]}
          value={two}
          onChange={setTwo}
        />
        <SegmentedButton
          type="text"
          ariaLabel="Five options"
          items={[
            { value: "a", label: "Option 1" },
            { value: "b", label: "Option 2" },
            { value: "c", label: "Option 3" },
            { value: "d", label: "Option 4" },
            { value: "e", label: "Option 5" },
          ]}
          value={five}
          onChange={setFive}
        />
      </div>
    );
  },
};

/** Icon mode: slug resolves to `assets/icons/<slug>.svg`. */
export const IconListTreeGrid: Story = {
  render: () => {
    const [value, setValue] = useState("tree");
    return (
      <SegmentedButton
        type="icon"
        ariaLabel="Content view"
        items={[
          { value: "list", icon: "view-hamburger", ariaLabel: "List view" },
          { value: "tree", icon: "nav-tree", ariaLabel: "Tree view" },
          {
            value: "grid",
            icon: "view-sort-grid-solid",
            ariaLabel: "Grid view",
          },
        ]}
        value={value}
        onChange={setValue}
      />
    );
  },
};

/** Custom icon slot — no slug resolution. */
export const IconCustomSlot: Story = {
  render: () => {
    const [value, setValue] = useState("alpha");
    return (
      <SegmentedButton
        type="icon"
        ariaLabel="Custom glyphs"
        items={[
          {
            value: "alpha",
            icon: (
              <svg width={16} height={16} viewBox="0 0 16 16" aria-hidden>
                <circle
                  cx={8}
                  cy={8}
                  r={6}
                  fill="currentColor"
                  opacity={0.9}
                />
              </svg>
            ),
            ariaLabel: "Circle view",
          },
          {
            value: "beta",
            icon: (
              <svg width={16} height={16} viewBox="0 0 16 16" aria-hidden>
                <rect
                  x={3}
                  y={3}
                  width={10}
                  height={10}
                  rx={1}
                  fill="currentColor"
                  opacity={0.9}
                />
              </svg>
            ),
            ariaLabel: "Square view",
          },
        ]}
        value={value}
        onChange={setValue}
      />
    );
  },
};


/** Back-compat for Storybook deep links / HMR (`spec-generated-ids-segmented-button--icon-modes`). */
export const IconModes: Story = IconListTreeGrid;

/** Back-compat for removed generated story id `text-two-options`. */
export const TextTwoOptions: Story = {
  render: () => {
    const [value, setValue] = useState("daily");
    return (
      <SegmentedButton
        type="text"
        ariaLabel="Report period"
        items={[
          { value: "daily", label: "Daily" },
          { value: "weekly", label: "Weekly" },
        ]}
        value={value}
        onChange={setValue}
      />
    );
  },
};

/** Back-compat for removed generated story id `text-three-to-five-options`. */
export const TextThreeToFiveOptions: Story = TextTwoAndFiveOptions;

/** `onChange(value, meta)` — `meta` carries `label` (text) or `ariaLabel` (icon). */
export const OnChangePayload: Story = {
  render: () => {
    const [value, setValue] = useState("a");
    const [lastMeta, setLastMeta] = useState<SegmentedButtonChangeMeta | null>(
      null,
    );
    return (
      <div style={{ display: "grid", gap: 12 }}>
        <SegmentedButton
          type="text"
          ariaLabel="Payload demo"
          items={[
            { value: "a", label: "Alpha" },
            { value: "b", label: "Beta" },
          ]}
          value={value}
          onChange={(v, meta) => {
            setValue(v);
            setLastMeta(meta);
          }}
        />
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

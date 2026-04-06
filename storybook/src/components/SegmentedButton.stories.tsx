import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  SegmentedButton,
  type SegmentedButtonChangeMeta,
} from "./SegmentedButton";

const meta: Meta<typeof SegmentedButton> = {
  title: "Synapse/SegmentedButton",
  component: SegmentedButton,
};

export default meta;
type Story = StoryObj<typeof SegmentedButton>;

/** Two text segments (minimum). */
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

/** Three text segments — matches common Figma “3 options” width behavior. */
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

/** Four and five segments — validates counts allowed by spec. */
export const TextFourAndFive: Story = {
  render: () => {
    const [four, setFour] = useState("b");
    const [five, setFive] = useState("c");
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <SegmentedButton
          type="text"
          ariaLabel="Four-up"
          items={[
            { value: "a", label: "Option 1" },
            { value: "b", label: "Option 2" },
            { value: "c", label: "Option 3" },
            { value: "d", label: "Option 4" },
          ]}
          value={four}
          onChange={setFour}
        />
        <SegmentedButton
          type="text"
          ariaLabel="Five-up"
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

/**
 * Icon mode: `icon` string = slug under `assets/icons` (no `.svg`).
 * Resolves at build time via Vite `import.meta.glob`.
 */
export const IconSlugListGrid: Story = {
  render: () => {
    const [value, setValue] = useState("list");
    return (
      <SegmentedButton
        type="icon"
        ariaLabel="View layout"
        items={[
          {
            value: "list",
            icon: "view-hamburger",
            ariaLabel: "List view",
          },
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

/** Three icon segments — Figma allows 2–3 icon options. */
export const IconSlugListTreeGrid: Story = {
  render: () => {
    const [value, setValue] = useState("tree");
    return (
      <SegmentedButton
        type="icon"
        ariaLabel="Content view"
        items={[
          {
            value: "list",
            icon: "view-hamburger",
            ariaLabel: "List view",
          },
          {
            value: "tree",
            icon: "nav-tree",
            ariaLabel: "Tree view",
          },
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

/** Custom icon slot: any `ReactNode`; slug resolution is skipped. */
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

/** Mixed: one segment disabled; root not disabled. */
export const TextWithDisabledSegment: Story = {
  render: () => {
    const [value, setValue] = useState("a");
    return (
      <SegmentedButton
        type="text"
        ariaLabel="With disabled segment"
        items={[
          { value: "a", label: "Available" },
          { value: "b", label: "Locked", disabled: true },
          { value: "c", label: "Also available" },
        ]}
        value={value}
        onChange={setValue}
      />
    );
  },
};

/** Entire group disabled. */
export const TextDisabledGroup: Story = {
  render: () => (
    <SegmentedButton
      type="text"
      ariaLabel="Disabled group"
      items={[
        { value: "x", label: "One" },
        { value: "y", label: "Two" },
      ]}
      value="x"
      disabled
    />
  ),
};

export const UncontrolledDefault: Story = {
  render: () => (
    <SegmentedButton
      type="text"
      ariaLabel="Uncontrolled"
      items={[
        { value: "list", label: "List" },
        { value: "grid", label: "Grid" },
        { value: "kanban", label: "Kanban" },
      ]}
      defaultValue="grid"
    />
  ),
};

/** `onChange(value, meta)` — `value` is stable id; `meta` carries `label` (text) or `ariaLabel` (icon). */
export const OnChangePayload: Story = {
  render: () => {
    const [value, setValue] = useState("a");
    const [lastMeta, setLastMeta] = useState<SegmentedButtonChangeMeta | null>(
      null,
    );
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
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
            background: "var(--color-background-gray-neutral-lighter, #f4f4f4)",
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

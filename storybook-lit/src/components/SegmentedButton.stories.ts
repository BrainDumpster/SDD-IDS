/**
 * Storybook: IDS Lit Segmented Button from `lib/lit/ids/segmented-button`
 *
 * Theme: components/ids-theme.css (via preview)
 * Spec: components/ids/segmented-button/design-spec.md
 * Figma text Spec Accurate: 42113:67642 = 260x34
 * Figma icon 3-option: 42113:67622 = 106x39
 * Examples: storybook/src/components/SegmentedButtonComposition.tsx
 *           storybook-angular/.../ids-segmented-button.stories.js
 */
import type { Meta, StoryObj } from "@storybook/web-components";
import { html, nothing } from "lit";
import "@ids/core/segmented-button/register.js";
import type {
  SegmentedButtonChangeMeta,
  SegmentedButtonSimulatedState,
} from "@ids/core/segmented-button";
import {
  SEGMENTED_BUTTON_DOCS_DESCRIPTION,
  SEGMENTED_BUTTON_SOURCE_CODE,
} from "./ids-segmented-button.developer-usage";

type SimulatedState = SegmentedButtonSimulatedState;

const matrixWrap = "display: grid; gap: 20px; max-width: 640px";
const matrixRow = "display: grid; gap: 10px";
const matrixHeading =
  "font-size: 12px; font-weight: 600; color: var(--color-text-gray-neutral-strong); text-transform: uppercase; letter-spacing: 0.04em";
const matrixColumns =
  "display: grid; grid-template-columns: repeat(4, minmax(140px, 1fr)); gap: 12px; align-items: start";
const matrixCellLabel =
  "font-size: 11px; color: var(--color-text-gray-neutral); margin-bottom: 6px";

const stateColumns: { label: string; simulatedState?: SimulatedState }[] = [
  { label: "Default" },
  { label: "Hover", simulatedState: "hover" },
  { label: "Press", simulatedState: "press" },
  { label: "Focus", simulatedState: "focus-visible" },
];

/** Keep controlled `selected` in sync without Storybook useArgs. */
function onSelectedChange(event: Event) {
  const custom = event as CustomEvent<string>;
  const host = custom.currentTarget as HTMLElement & { selected: string };
  host.selected = custom.detail;
}

function onChangePayload(event: Event) {
  const custom = event as CustomEvent<{
    value: string;
    meta: SegmentedButtonChangeMeta;
  }>;
  const host = custom.currentTarget as HTMLElement & { selected: string };
  host.selected = custom.detail.value;
  const pre = host.parentElement?.querySelector("pre");
  if (pre) {
    pre.textContent = `selected: ${JSON.stringify(custom.detail.value)}\nmeta: ${JSON.stringify(custom.detail.meta)}`;
  }
}

function renderStateMatrixText() {
  return html`
    <div style=${matrixWrap}>
      <div style="font-size: 12px; color: var(--color-text-gray-neutral)">
        Figma text option component (node 9015:20992). Focus column uses
        <code>simulatedState</code>; hover/press columns are pinned for QA.
      </div>

      <div style=${matrixRow}>
        <div style=${matrixHeading}>Inactive (unselected segment)</div>
        <div style=${matrixColumns}>
          ${stateColumns.map(
            ({ label, simulatedState }) => html`
              <div>
                <div style=${matrixCellLabel}>${label}</div>
                <ids-segmented-buttons
                  type="text"
                  ariaLabel=${`Inactive ${label}`}
                  selected="option1"
                >
                  <ids-segmented-text
                    value="option1"
                    label="Option 1"
                  ></ids-segmented-text>
                  <ids-segmented-text
                    value="option2"
                    label="Option Text"
                    simulatedstate=${simulatedState || nothing}
                  ></ids-segmented-text>
                </ids-segmented-buttons>
              </div>
            `,
          )}
        </div>
      </div>

      <div style=${matrixRow}>
        <div style=${matrixHeading}>Active (selected segment)</div>
        <div style=${matrixColumns}>
          ${stateColumns.map(
            ({ label, simulatedState }) => html`
              <div>
                <div style=${matrixCellLabel}>${label}</div>
                <ids-segmented-buttons
                  type="text"
                  ariaLabel=${`Active ${label}`}
                  selected="option2"
                >
                  <ids-segmented-text
                    value="option1"
                    label="Option 1"
                  ></ids-segmented-text>
                  <ids-segmented-text
                    value="option2"
                    label="Option Text"
                    simulatedstate=${simulatedState || nothing}
                  ></ids-segmented-text>
                </ids-segmented-buttons>
              </div>
            `,
          )}
        </div>
      </div>
    </div>
  `;
}

function renderStateMatrixIcon() {
  return html`
    <div style=${matrixWrap}>
      <div style=${matrixRow}>
        <div style=${matrixHeading}>Inactive (unselected segment)</div>
        <div style=${matrixColumns}>
          ${stateColumns.map(
            ({ label, simulatedState }) => html`
              <div>
                <div style=${matrixCellLabel}>${label}</div>
                <ids-segmented-buttons
                  type="icon"
                  ariaLabel=${`Icon inactive ${label}`}
                  selected="option1"
                >
                  <ids-segmented-icon
                    value="option1"
                    shape="view-hamburger"
                    ariaLabel="Option 1"
                  ></ids-segmented-icon>
                  <ids-segmented-icon
                    value="option2"
                    shape="view-hamburger"
                    ariaLabel="Option icon"
                    simulatedstate=${simulatedState || nothing}
                  ></ids-segmented-icon>
                </ids-segmented-buttons>
              </div>
            `,
          )}
        </div>
      </div>

      <div style=${matrixRow}>
        <div style=${matrixHeading}>Active (selected segment)</div>
        <div style=${matrixColumns}>
          ${stateColumns.map(
            ({ label, simulatedState }) => html`
              <div>
                <div style=${matrixCellLabel}>${label}</div>
                <ids-segmented-buttons
                  type="icon"
                  ariaLabel=${`Icon active ${label}`}
                  selected="option2"
                >
                  <ids-segmented-icon
                    value="option1"
                    shape="view-hamburger"
                    ariaLabel="Option 1"
                  ></ids-segmented-icon>
                  <ids-segmented-icon
                    value="option2"
                    shape="view-hamburger"
                    ariaLabel="Option icon"
                    simulatedstate=${simulatedState || nothing}
                  ></ids-segmented-icon>
                </ids-segmented-buttons>
              </div>
            `,
          )}
        </div>
      </div>
    </div>
  `;
}

const meta: Meta = {
  title: "Spec Generated/IDS/Segmented Button",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: { component: SEGMENTED_BUTTON_DOCS_DESCRIPTION },
      source: { code: SEGMENTED_BUTTON_SOURCE_CODE, language: "html" },
    },
  },
};

export default meta;
type Story = StoryObj;

/**
 * Spec Accurate Design — Figma 42113:67642 / 8218:13150.
 * Host width 260px; control fills to 260x34; Option 1 selected.
 */
export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  render: () => html`
    <div style="width: 260px">
      <ids-segmented-buttons
        type="text"
        ariaLabel="Segmented options"
        selected="option1"
        @selected-change=${onSelectedChange}
      >
        <ids-segmented-text
          value="option1"
          label="Option 1"
        ></ids-segmented-text>
        <ids-segmented-text
          value="option2"
          label="Option 2"
        ></ids-segmented-text>
      </ids-segmented-buttons>
    </div>
  `,
};

/** Text option matrix — Figma .Segemented Button Text (9015:20992). */
export const StateMatrixText: Story = {
  name: "State Matrix Text",
  render: () => renderStateMatrixText(),
};

/** Icon option matrix — Figma .SegementedButton-Element-OptionIcon (10148:29576). */
export const StateMatrixIcon: Story = {
  name: "State Matrix Icon",
  render: () => renderStateMatrixIcon(),
};

export const StateMatrixTextDark: Story = {
  name: "State Matrix Text Dark",
  parameters: {
    globals: { theme: "dark" },
    backgrounds: { default: "dark" },
  },
  render: () => renderStateMatrixText(),
};

/** Three text segments — Angular / React example parity. */
export const TextThreeOptions: Story = {
  name: "Text Three Options",
  render: () => html`
    <ids-segmented-buttons
      type="text"
      ariaLabel="Billing cycle"
      selected="weekly"
      @selected-change=${onSelectedChange}
    >
      <ids-segmented-text value="daily" label="Daily"></ids-segmented-text>
      <ids-segmented-text value="weekly" label="Weekly"></ids-segmented-text>
      <ids-segmented-text value="monthly" label="Monthly"></ids-segmented-text>
    </ids-segmented-buttons>
  `,
};

/** Validates text counts 2-5 per spec. */
export const TextTwoAndFiveOptions: Story = {
  name: "Text Two And Five Options",
  render: () => html`
    <div style="display: grid; gap: 20px">
      <ids-segmented-buttons
        type="text"
        ariaLabel="Two options"
        defaultSelected="daily"
      >
        <ids-segmented-text value="daily" label="Daily"></ids-segmented-text>
        <ids-segmented-text value="weekly" label="Weekly"></ids-segmented-text>
      </ids-segmented-buttons>
      <ids-segmented-buttons
        type="text"
        ariaLabel="Five options"
        defaultSelected="c"
      >
        <ids-segmented-text value="a" label="Option 1"></ids-segmented-text>
        <ids-segmented-text value="b" label="Option 2"></ids-segmented-text>
        <ids-segmented-text value="c" label="Option 3"></ids-segmented-text>
        <ids-segmented-text value="d" label="Option 4"></ids-segmented-text>
        <ids-segmented-text value="e" label="Option 5"></ids-segmented-text>
      </ids-segmented-buttons>
    </div>
  `,
};

/**
 * Icon Modes — Figma list/tree/grid (42113:67622 geometry: 106x39).
 * Default selection tree (Angular Icon Modes parity).
 */
export const IconModes: Story = {
  name: "Icon Modes",
  render: () => html`
    <ids-segmented-buttons
      type="icon"
      ariaLabel="Content view"
      selected="tree"
      @selected-change=${onSelectedChange}
    >
      <ids-segmented-icon
        value="list"
        shape="view-hamburger"
        ariaLabel="List view"
        title="List view"
      ></ids-segmented-icon>
      <ids-segmented-icon
        value="tree"
        shape="nav-tree"
        ariaLabel="Tree view"
        title="Tree view"
      ></ids-segmented-icon>
      <ids-segmented-icon
        value="grid"
        shape="view-sort-grid-solid"
        ariaLabel="Grid view"
        title="Grid view"
      ></ids-segmented-icon>
    </ids-segmented-buttons>
  `,
};

/** Icon mode alias — React lib story name. */
export const IconListTreeGrid: Story = {
  name: "Icon List Tree Grid",
  render: IconModes.render,
};

/** Custom IconSlot — default slot, no slug resolution. */
export const IconCustomSlot: Story = {
  name: "Icon Custom Slot",
  render: () => html`
    <ids-segmented-buttons
      type="icon"
      ariaLabel="Custom glyphs"
      selected="alpha"
      @selected-change=${onSelectedChange}
    >
      <ids-segmented-icon value="alpha" ariaLabel="Circle view">
        <svg width="16" height="14" viewBox="0 0 16 14" aria-hidden="true">
          <circle
            cx="8"
            cy="7"
            r="5"
            fill="currentColor"
            opacity="0.9"
          ></circle>
        </svg>
      </ids-segmented-icon>
      <ids-segmented-icon value="beta" ariaLabel="Square view">
        <svg width="16" height="14" viewBox="0 0 16 14" aria-hidden="true">
          <rect
            x="3"
            y="2"
            width="10"
            height="10"
            rx="1"
            fill="currentColor"
            opacity="0.9"
          ></rect>
        </svg>
      </ids-segmented-icon>
    </ids-segmented-buttons>
  `,
};

/** change payload includes value + meta (label or ariaLabel). */
export const OnChangePayload: Story = {
  name: "On Change Payload",
  render: () => html`
    <div style="display: grid; gap: 12px">
      <ids-segmented-buttons
        type="text"
        ariaLabel="Payload demo"
        selected="a"
        @change=${onChangePayload}
      >
        <ids-segmented-text value="a" label="Alpha"></ids-segmented-text>
        <ids-segmented-text value="b" label="Beta"></ids-segmented-text>
      </ids-segmented-buttons>
      <pre
        style="margin: 0; padding: 12px; background: var(--color-background-gray-neutral-lighter); border-radius: 4px; font-size: 12px"
      >
selected: "a"
meta: —</pre
      >
    </div>
  `,
};

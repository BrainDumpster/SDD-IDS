import "../../../components/synapse-theme.css";
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  SynapseSegmentedButtons,
  SynapseSegmentedIcon,
  SynapseSegmentedText,
} from "./SynapseSegmentedButton";
import {
  SYNAPSE_SEGMENTED_BUTTON_DESIGN_SPEC_PATH,
  SYNAPSE_SEGMENTED_BUTTON_ICON_SPEC_ACCURATE_NODE_ID,
  SYNAPSE_SEGMENTED_BUTTON_SAMPLE_OPTIONS,
  SYNAPSE_SEGMENTED_BUTTON_SPEC_ACCURATE_NODE_ID,
  SYNAPSE_SEGMENTED_BUTTON_STATE_MATRIX_NODE_ID,
} from "../spec-contracts/synapse-segmented-button.contract";

const meta: Meta<typeof SynapseSegmentedButtons> = {
  title: "Spec Generated/Synapse/Segmented Button",
  component: SynapseSegmentedButtons,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          `Spec-driven Synapse Segmented Button (IDS-fork). Source: \`${SYNAPSE_SEGMENTED_BUTTON_DESIGN_SPEC_PATH}\`.`,
          `Primary story: **Text / 2 options / default** (Figma \`${SYNAPSE_SEGMENTED_BUTTON_SPEC_ACCURATE_NODE_ID}\`).`,
          "Theme: `components/synapse-theme.css` (`--segmented-button-control-radius` → 2px; Body 2 Regular labels).",
        ].join(" "),
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof SynapseSegmentedButtons>;

export const SpecAccurateTextTwoOptions: Story = {
  name: "Spec Accurate / Text 2 Options",
  render: () => {
    const [selected, setSelected] = useState("option1");
    return (
      <div style={{ width: 260 }}>
        <SynapseSegmentedButtons
          type="text"
          ariaLabel="View mode"
          selected={selected}
          onSelectedChange={setSelected}
        >
          {SYNAPSE_SEGMENTED_BUTTON_SAMPLE_OPTIONS.map((option) => (
            <SynapseSegmentedText
              key={option.value}
              value={option.value}
              label={option.label}
            />
          ))}
        </SynapseSegmentedButtons>
      </div>
    );
  },
};

export const TextThreeOptions: Story = {
  render: () => {
    const [selected, setSelected] = useState("weekly");
    return (
      <div style={{ width: 370 }}>
        <SynapseSegmentedButtons
          type="text"
          ariaLabel="Billing cycle"
          selected={selected}
          onSelectedChange={setSelected}
        >
          <SynapseSegmentedText value="daily" label="Daily" />
          <SynapseSegmentedText value="weekly" label="Weekly" />
          <SynapseSegmentedText value="monthly" label="Monthly" />
        </SynapseSegmentedButtons>
      </div>
    );
  },
};

export const IconTwoOptions: Story = {
  render: () => {
    const [selected, setSelected] = useState("list");
    return (
      <SynapseSegmentedButtons
        type="icon"
        ariaLabel="Layout"
        selected={selected}
        onSelectedChange={setSelected}
      >
        <SynapseSegmentedIcon
          value="list"
          shape="view-hamburger"
          ariaLabel="List view"
          title="List view"
        />
        <SynapseSegmentedIcon
          value="grid"
          shape="view-sort-grid-solid"
          ariaLabel="Grid view"
          title="Grid view"
        />
      </SynapseSegmentedButtons>
    );
  },
};

export const IconListTreeGrid: Story = {
  render: () => {
    const [selected, setSelected] = useState("tree");
    return (
      <SynapseSegmentedButtons
        type="icon"
        ariaLabel="Content view"
        selected={selected}
        onSelectedChange={setSelected}
      >
        <SynapseSegmentedIcon
          value="list"
          shape="view-hamburger"
          ariaLabel="List view"
          title="List view"
        />
        <SynapseSegmentedIcon
          value="tree"
          shape="nav-tree"
          ariaLabel="Tree view"
          title="Tree view"
        />
        <SynapseSegmentedIcon
          value="grid"
          shape="view-sort-grid-solid"
          ariaLabel="Grid view"
          title="Grid view"
        />
      </SynapseSegmentedButtons>
    );
  },
};

/** Figma icon × 3 (`42113:67622` / IDS Dev Mode **106×39px**). */
export const IconThreeOptions: Story = {
  parameters: {
    docs: {
      description: {
        story: `Icon variant with three options — Figma \`${SYNAPSE_SEGMENTED_BUTTON_ICON_SPEC_ACCURATE_NODE_ID}\` (inherits IDS geometry: **39px** shell, **33px** segment row, **16×14** glyph).`,
      },
    },
  },
  render: () => {
    const [value, setValue] = useState("tree");
    return (
      <SynapseSegmentedButton
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

export const FigmaMatrixReference: Story = {
  parameters: {
    docs: {
      description: {
        story: `Full state matrix: Figma \`${SYNAPSE_SEGMENTED_BUTTON_STATE_MATRIX_NODE_ID}\` (hover/press/focus on unselected segment while option 1 stays selected).`,
      },
    },
  },
  render: () => {
    const [selected, setSelected] = useState("option1");
    return (
      <div style={{ width: 260 }}>
        <SynapseSegmentedButtons
          type="text"
          ariaLabel="Matrix reference"
          selected={selected}
          onSelectedChange={setSelected}
        >
          {SYNAPSE_SEGMENTED_BUTTON_SAMPLE_OPTIONS.map((option) => (
            <SynapseSegmentedText
              key={option.value}
              value={option.value}
              label={option.label}
            />
          ))}
        </SynapseSegmentedButtons>
      </div>
    );
  },
};

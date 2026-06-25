import "../../../components/synapse-theme.css";
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { SynapseSegmentedButton } from "./SynapseSegmentedButton";
import {
  SYNAPSE_SEGMENTED_BUTTON_DESIGN_SPEC_PATH,
  SYNAPSE_SEGMENTED_BUTTON_ICON_SPEC_ACCURATE_NODE_ID,
  SYNAPSE_SEGMENTED_BUTTON_SAMPLE_OPTIONS,
  SYNAPSE_SEGMENTED_BUTTON_SPEC_ACCURATE_NODE_ID,
  SYNAPSE_SEGMENTED_BUTTON_STATE_MATRIX_NODE_ID,
} from "../spec-contracts/synapse-segmented-button.contract";

const meta: Meta<typeof SynapseSegmentedButton> = {
  title: "Spec Generated/Synapse/Segmented Button",
  component: SynapseSegmentedButton,
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
type Story = StoryObj<typeof SynapseSegmentedButton>;

export const SpecAccurateTextTwoOptions: Story = {
  name: "Spec Accurate / Text 2 Options",
  render: () => {
    const [value, setValue] = useState("option1");
    return (
      <div style={{ width: 260 }}>
        <SynapseSegmentedButton
          type="text"
          ariaLabel="View mode"
          items={[...SYNAPSE_SEGMENTED_BUTTON_SAMPLE_OPTIONS]}
          value={value}
          onChange={setValue}
        />
      </div>
    );
  },
};

export const TextThreeOptions: Story = {
  render: () => {
    const [value, setValue] = useState("weekly");
    return (
      <div style={{ width: 370 }}>
        <SynapseSegmentedButton
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
      </div>
    );
  },
};

export const IconTwoOptions: Story = {
  render: () => {
    const [value, setValue] = useState("list");
    return (
      <SynapseSegmentedButton
        type="icon"
        ariaLabel="Layout"
        items={[
          { value: "list", icon: "view-hamburger", ariaLabel: "List view" },
          { value: "grid", icon: "view-sort-grid-solid", ariaLabel: "Grid view" },
        ]}
        value={value}
        onChange={setValue}
      />
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
    const [value, setValue] = useState("option1");
    return (
      <div style={{ width: 260 }}>
        <SynapseSegmentedButton
          type="text"
          ariaLabel="Matrix reference"
          items={[...SYNAPSE_SEGMENTED_BUTTON_SAMPLE_OPTIONS]}
          value={value}
          onChange={setValue}
        />
      </div>
    );
  },
};

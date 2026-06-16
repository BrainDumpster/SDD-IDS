/* Spec Generated — IDS Dual List Box (design-spec intake wizard) */
import "../../../components/ids-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import React, { type ComponentProps } from "react";
import {
  IdsDualListBox,
  type DualListBoxItem,
  type DualListBoxDragDropDetail,
  type DualListBoxTransferDetail,
} from "./IdsDualListBox";

const DESIGN_SPEC_PATH = "components/ids/dual-list-box/design-spec.md";
const FIGMA_SPEC_ACCURATE_NODE = "12114:232557";

const onTransfer = (detail: DualListBoxTransferDetail) => {
  console.log("onTransfer", detail);
};

const onDragDrop = (detail: DualListBoxDragDropDetail) => {
  console.log("onDragDrop", detail);
};

const specAccurateAvailable: DualListBoxItem[] = Array.from({ length: 6 }, (_, i) => ({
  id: `avail-${i + 1}`,
  name: "List Item",
}));

const specAccurateArgs: ComponentProps<typeof IdsDualListBox> = {
  availableItems: specAccurateAvailable,
  selectedItems: [],
  availableTitle: "Available Items",
  selectedTitle: "Selected Items",
  availablePlaceholder: "Select items on the right to move",
  selectedPlaceholder: "Select items on the left to move",
  defaultAvailableSelection: [],
  showMetrics: true,
  metricsFormat: "total",
  enableDragDrop: true,
  moveSelectedRightTitle: "Move right",
  moveSelectedLeftTitle: "Move left",
  moveAllRightTitle: "Add all from Available Items",
  moveAllLeftTitle: "Remove all from Selected Items",
  onTransfer,
  onDragDrop,
};

const meta: Meta<typeof IdsDualListBox> = {
  title: "Spec Generated/IDS/Dual List Box",
  component: IdsDualListBox,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          `Spec-driven IDS Dual List Box. Source: \`${DESIGN_SPEC_PATH}\`.`,
          `Primary story: Figma \`${FIGMA_SPEC_ACCURATE_NODE}\`.`,
          "Theme: `components/ids-theme.css`.",
        ].join(" "),
      },
    },
  },
  args: specAccurateArgs,
};

export default meta;
type Story = StoryObj<typeof IdsDualListBox>;

function Frame(props: ComponentProps<typeof IdsDualListBox>) {
  return (
    <div
      style={{
        padding: 16,
        background: "var(--color-background-surface-1)",
        width: "100%",
        maxWidth: 724,
      }}
    >
      <IdsDualListBox onTransfer={onTransfer} onDragDrop={onDragDrop} enableDragDrop {...props} />
    </div>
  );
}

export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  render: (args) => <Frame {...args} />,
  args: specAccurateArgs,
};

export const WithItemsInSelected: Story = {
  name: "With Items In Selected",
  render: () => (
    <Frame
      availableTitle="Available Items"
      selectedTitle="Selected Items"
      availableItems={[
        {
          id: "a1",
          name: "List Item",
          tooltipTitle: "Alpha",
          tooltipDescription: "Move or drag to selected.",
        },
        { id: "a2", name: "List Item" },
      ]}
      selectedItems={[
        {
          id: "s1",
          name: "List Item",
          tooltipTitle: "Selected row",
          tooltipDescription: "Shows shape-check-thick when selected.",
        },
        { id: "s2", name: "List Item" },
      ]}
      defaultAvailableSelection={[]}
      defaultSelectedSelection={["s1"]}
      metricsFormat="total-and-selected"
    />
  ),
};

export const WithDescription: Story = {
  name: "With Description",
  render: () => (
    <Frame
      availableItems={[
        {
          id: "d1",
          name: "List Item",
          description:
            "Content - Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatu",
        },
      ]}
      selectedItems={[]}
    />
  ),
};

export const EmptyAvailablePane: Story = {
  name: "Empty Available Pane",
  render: () => (
    <Frame
      availableItems={[]}
      selectedItems={[
        { id: "s1", name: "List Item" },
        { id: "s2", name: "List Item" },
      ]}
    />
  ),
};

export const TransferBothMoveAllDefault: Story = {
  name: "Transfer — Both Move All Default",
  render: () => (
    <Frame
      availableItems={[
        { id: "a1", name: "List Item" },
        { id: "a2", name: "List Item" },
      ]}
      selectedItems={[{ id: "s1", name: "List Item" }]}
      defaultAvailableSelection={[]}
      defaultSelectedSelection={[]}
    />
  ),
};

export const TransferMoveSelectedRightDefault: Story = {
  name: "Transfer — Move Selected Right Default",
  render: () => (
    <Frame
      availableItems={[
        { id: "a1", name: "List Item" },
        { id: "a2", name: "List Item" },
      ]}
      selectedItems={[{ id: "s1", name: "List Item" }]}
      defaultAvailableSelection={["a1"]}
      defaultSelectedSelection={[]}
    />
  ),
};

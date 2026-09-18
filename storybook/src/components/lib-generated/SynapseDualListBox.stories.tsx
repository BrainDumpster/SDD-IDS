/**
 * Storybook: design-spec–generated Dual List Box from `lib/react/synapse/dual-list-box`
 * (IDS-fork reexport façade — React + CSS Modules).
 *
 * Anatomy (deterministic child order):
 *   SynapseDualListBox (SynapseDualListBoxRoot)
 *     SynapseDualListBoxListsParent
 *       SynapseDualListBoxAvailablePane
 *         SynapseDualListBoxAvailablePaneHeader → title + AvailableMetrics
 *         SynapseDualListBoxAvailableListGroup → ListItem[] | empty placeholder
 *           SynapseDualListBoxListItem → DragHandle + ItemContent + SelectionCheck?
 *       SynapseDualListBoxTransferButtonGroup
 *         MoveAllRight → MoveSelectedRight → MoveSelectedLeft → MoveAllLeft
 *       SynapseDualListBoxSelectedPane
 *         SynapseDualListBoxSelectedPaneHeader → title + SelectedMetrics
 *         SynapseDualListBoxSelectedListGroup → ListItem[] | empty placeholder
 *
 * Theme: components/synapse-theme.css
 * Spec: components/ids/dual-list-box/design-spec.md
 */
import React, { type ComponentProps, type CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/synapse-theme.css";
import {
  SYNAPSE_DUAL_LIST_BOX_DOCS_DESCRIPTION,
  SYNAPSE_DUAL_LIST_BOX_SOURCE_CODE,
} from "./synapse-dual-list-box.developer-usage";
import {
  SynapseDualListBox,
  SynapseDualListBoxAvailableListGroup,
  SynapseDualListBoxAvailablePane,
  SynapseDualListBoxAvailablePaneHeader,
  SynapseDualListBoxListsParent,
  SynapseDualListBoxMoveAllLeft,
  SynapseDualListBoxMoveAllRight,
  SynapseDualListBoxMoveSelectedLeft,
  SynapseDualListBoxMoveSelectedRight,
  SynapseDualListBoxSelectedListGroup,
  SynapseDualListBoxSelectedPane,
  SynapseDualListBoxSelectedPaneHeader,
  SynapseDualListBoxTransferButtonGroup,
  type SynapseDualListBoxDragDropDetail,
  type SynapseDualListBoxItem,
  type SynapseDualListBoxTransferDetail,
} from "@synapse/react/dual-list-box";

const DESIGN_SPEC_PATH = "components/ids/dual-list-box/design-spec.md";
const FIGMA_SPEC_ACCURATE_NODE = "12114:232557";

const onTransfer = (detail: SynapseDualListBoxTransferDetail) => {
  console.log("onTransfer", detail);
};

const onDragDrop = (detail: SynapseDualListBoxDragDropDetail) => {
  console.log("onDragDrop", detail);
};

const specAccurateAvailable: SynapseDualListBoxItem[] = Array.from({ length: 6 }, (_, i) => ({
  id: `avail-${i + 1}`,
  name: "List Item",
}));

const specAccurateArgs: ComponentProps<typeof SynapseDualListBox> = {
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

const frameStyle: CSSProperties = {
  padding: 16,
  background: "var(--color-background-surface-primary)",
  width: "100%",
  maxWidth: 724,
};

const meta: Meta<typeof SynapseDualListBox> = {
  tags: ["autodocs"],
  title: "Components/Synapse/Dual List Box",
  component: SynapseDualListBox,
  parameters: {
    layout: "padded",
    docs: {
      canvas: { sourceState: "open" },
      description: {
        component: SYNAPSE_DUAL_LIST_BOX_DOCS_DESCRIPTION,
      },
      source: {
        type: "code",
        language: "tsx",
        code: SYNAPSE_DUAL_LIST_BOX_SOURCE_CODE,
      },
    },
  },
  args: specAccurateArgs,
};

export default meta;
type Story = StoryObj<typeof SynapseDualListBox>;

function Frame(props: ComponentProps<typeof SynapseDualListBox>) {
  return (
    <div style={frameStyle}>
      <SynapseDualListBox onTransfer={onTransfer} onDragDrop={onDragDrop} enableDragDrop {...props} />
    </div>
  );
}

export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  render: (args) => <Frame {...args} />,
  args: specAccurateArgs,
};

/** Explicit Anatomy slots in Codegen Contract order (same tree the prop API emits). */
export const DeterministicAnatomy: Story = {
  name: "Deterministic Anatomy",
  render: () => (
    <div style={frameStyle}>
      <SynapseDualListBox
        availableItems={specAccurateAvailable}
        selectedItems={[]}
        availableTitle="Available Items"
        selectedTitle="Selected Items"
        onTransfer={onTransfer}
        onDragDrop={onDragDrop}
      >
        <SynapseDualListBoxListsParent>
          <SynapseDualListBoxAvailablePane>
            <SynapseDualListBoxAvailablePaneHeader />
            <SynapseDualListBoxAvailableListGroup />
          </SynapseDualListBoxAvailablePane>
          <SynapseDualListBoxTransferButtonGroup>
            <SynapseDualListBoxMoveAllRight />
            <SynapseDualListBoxMoveSelectedRight />
            <SynapseDualListBoxMoveSelectedLeft />
            <SynapseDualListBoxMoveAllLeft />
          </SynapseDualListBoxTransferButtonGroup>
          <SynapseDualListBoxSelectedPane>
            <SynapseDualListBoxSelectedPaneHeader />
            <SynapseDualListBoxSelectedListGroup />
          </SynapseDualListBoxSelectedPane>
        </SynapseDualListBoxListsParent>
      </SynapseDualListBox>
    </div>
  ),
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

export const TwelveItemsScrollbar: Story = {
  name: "12 Items + Scrollbar",
  render: () => (
    <Frame
      availableItems={Array.from({ length: 12 }, (_, i) => ({
        id: `avail-${i + 1}`,
        name: "List Item",
      }))}
      selectedItems={[]}
    />
  ),
};

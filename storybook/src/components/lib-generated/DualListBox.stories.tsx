/**
 * Storybook: design-spec–generated Dual List Box from `lib/react/ids/dual-list-box`
 * (React + CSS Modules, no @base-ui-components).
 *
 * Anatomy (deterministic child order):
 *   IdsDualListBox (DualListBoxRoot)
 *     IdsDualListBoxListsParent
 *       IdsDualListBoxAvailablePane
 *         IdsDualListBoxAvailablePaneHeader → title + AvailableMetrics
 *         IdsDualListBoxAvailableListGroup → ListItem[] | empty placeholder
 *           IdsDualListBoxListItem → DragHandle + ItemContent + SelectionCheck?
 *       IdsDualListBoxTransferButtonGroup
 *         MoveAllRight → MoveSelectedRight → MoveSelectedLeft → MoveAllLeft
 *       IdsDualListBoxSelectedPane
 *         IdsDualListBoxSelectedPaneHeader → title + SelectedMetrics
 *         IdsDualListBoxSelectedListGroup → ListItem[] | empty placeholder
 *
 * Theme: components/ids-theme.css
 * Spec: components/ids/dual-list-box/design-spec.md
 */
import React, { type ComponentProps, type CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/ids-theme.css";
import {
  DUAL_LIST_BOX_DOCS_DESCRIPTION,
  DUAL_LIST_BOX_SOURCE_CODE,
} from "./ids-dual-list-box.developer-usage";
import {
  IdsDualListBox,
  IdsDualListBoxAvailableListGroup,
  IdsDualListBoxAvailablePane,
  IdsDualListBoxAvailablePaneHeader,
  IdsDualListBoxListsParent,
  IdsDualListBoxMoveAllLeft,
  IdsDualListBoxMoveAllRight,
  IdsDualListBoxMoveSelectedLeft,
  IdsDualListBoxMoveSelectedRight,
  IdsDualListBoxSelectedListGroup,
  IdsDualListBoxSelectedPane,
  IdsDualListBoxSelectedPaneHeader,
  IdsDualListBoxTransferButtonGroup,
  type DualListBoxDragDropDetail,
  type DualListBoxItem,
  type DualListBoxTransferDetail,
} from "@ids/react/dual-list-box";

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

const frameStyle: CSSProperties = {
  padding: 16,
  background: "var(--color-background-surface-primary)",
  width: "100%",
  maxWidth: 724,
};

const meta: Meta<typeof IdsDualListBox> = {
  tags: ["autodocs"],
  title: "Components/IDS/Dual List Box",
  component: IdsDualListBox,
  parameters: {
    layout: "padded",
    docs: {
      canvas: { sourceState: "open" },
      description: {
        component: DUAL_LIST_BOX_DOCS_DESCRIPTION,
      },
      source: {
        type: "code",
        language: "tsx",
        code: DUAL_LIST_BOX_SOURCE_CODE,
      },
    },
  },
  args: specAccurateArgs,
};

export default meta;
type Story = StoryObj<typeof IdsDualListBox>;

function Frame(props: ComponentProps<typeof IdsDualListBox>) {
  return (
    <div style={frameStyle}>
      <IdsDualListBox onTransfer={onTransfer} onDragDrop={onDragDrop} enableDragDrop {...props} />
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
      <IdsDualListBox
        availableItems={specAccurateAvailable}
        selectedItems={[]}
        availableTitle="Available Items"
        selectedTitle="Selected Items"
        onTransfer={onTransfer}
        onDragDrop={onDragDrop}
      >
        <IdsDualListBoxListsParent>
          <IdsDualListBoxAvailablePane>
            <IdsDualListBoxAvailablePaneHeader />
            <IdsDualListBoxAvailableListGroup />
          </IdsDualListBoxAvailablePane>
          <IdsDualListBoxTransferButtonGroup>
            <IdsDualListBoxMoveAllRight />
            <IdsDualListBoxMoveSelectedRight />
            <IdsDualListBoxMoveSelectedLeft />
            <IdsDualListBoxMoveAllLeft />
          </IdsDualListBoxTransferButtonGroup>
          <IdsDualListBoxSelectedPane>
            <IdsDualListBoxSelectedPaneHeader />
            <IdsDualListBoxSelectedListGroup />
          </IdsDualListBoxSelectedPane>
        </IdsDualListBoxListsParent>
      </IdsDualListBox>
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

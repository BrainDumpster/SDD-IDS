/**
 * Storybook: IDS Lit Dual List Box from `lib/lit/ids/dual-list-box`
 *
 * Theme: components/ids-theme.css (via preview)
 * Spec: components/ids/dual-list-box/design-spec.md
 * API: lib/react/ids/dual-list-box
 * Examples: storybook/src/components/lib-generated/DualListBox.stories.tsx
 *
 * Live Figma: 0bHk3XhrjFhowgFkz9yLr4 — Spec Accurate `12114:232557`,
 * list item `12114:230677`, transfer `12337:28658`
 */
import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "@ids/core/dual-list-box/register.js";
import type {
  DualListBoxDragDropDetail,
  DualListBoxItem,
  DualListBoxItemsChangeDetail,
  DualListBoxMetricsFormat,
  DualListBoxTransferDetail,
  IdsDualListBox,
} from "@ids/core/dual-list-box";
import {
  DUAL_LIST_BOX_DOCS_DESCRIPTION,
  DUAL_LIST_BOX_SOURCE_CODE,
} from "./ids-dual-list-box.developer-usage";

const DESIGN_SPEC_PATH = "components/ids/dual-list-box/design-spec.md";
const FIGMA_SPEC_ACCURATE_NODE = "12114:232557";

type DualListBoxStoryArgs = {
  availableItems: DualListBoxItem[];
  selectedItems: DualListBoxItem[];
  availableTitle: string;
  selectedTitle: string;
  availablePlaceholder: string;
  selectedPlaceholder: string;
  moveSelectedRightTitle: string;
  moveSelectedLeftTitle: string;
  moveAllRightTitle: string;
  moveAllLeftTitle: string;
  defaultAvailableSelection: string[];
  defaultSelectedSelection: string[];
  showMetrics: boolean;
  metricsFormat: DualListBoxMetricsFormat;
  enableDragDrop: boolean;
  ariaLabel: string;
  onTransfer?: (detail: DualListBoxTransferDetail) => void;
  onDragDrop?: (detail: DualListBoxDragDropDetail) => void;
  onItemsChange?: (detail: DualListBoxItemsChangeDetail) => void;
};

const specAccurateAvailable: DualListBoxItem[] = Array.from(
  { length: 6 },
  (_, i) => ({
    id: `avail-${i + 1}`,
    name: "List Item",
  }),
);

const frameStyle = `
  padding: 16px;
  background: var(--color-background-surface-primary);
  width: 100%;
  max-width: 724px;
  box-sizing: border-box;
`;

function renderDualListBox(args: DualListBoxStoryArgs) {
  return html`
    <div style=${frameStyle}>
      <ids-dual-list-box
        available-title=${args.availableTitle}
        selected-title=${args.selectedTitle}
        available-placeholder=${args.availablePlaceholder}
        selected-placeholder=${args.selectedPlaceholder}
        move-selected-right-title=${args.moveSelectedRightTitle}
        move-selected-left-title=${args.moveSelectedLeftTitle}
        move-all-right-title=${args.moveAllRightTitle}
        move-all-left-title=${args.moveAllLeftTitle}
        metrics-format=${args.metricsFormat}
        aria-label=${args.ariaLabel}
        .showMetrics=${args.showMetrics}
        .enableDragDrop=${args.enableDragDrop}
        .availableItems=${args.availableItems}
        .selectedItems=${args.selectedItems}
        .defaultAvailableSelection=${args.defaultAvailableSelection}
        .defaultSelectedSelection=${args.defaultSelectedSelection}
        .onTransfer=${args.onTransfer}
        .onDragDrop=${args.onDragDrop}
        .onItemsChange=${args.onItemsChange}
      ></ids-dual-list-box>
    </div>
  `;
}

const meta: Meta<DualListBoxStoryArgs> = {
  title: "Spec Generated/IDS/Dual List Box",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          DUAL_LIST_BOX_DOCS_DESCRIPTION,
          `Source: \`${DESIGN_SPEC_PATH}\`. Figma node \`${FIGMA_SPEC_ACCURATE_NODE}\`.`,
        ].join("\n\n"),
      },
      source: { code: DUAL_LIST_BOX_SOURCE_CODE, language: "html" },
    },
  },
  argTypes: {
    availableItems: { control: "object" },
    selectedItems: { control: "object" },
    availableTitle: { control: "text" },
    selectedTitle: { control: "text" },
    availablePlaceholder: { control: "text" },
    selectedPlaceholder: { control: "text" },
    showMetrics: { control: "boolean" },
    metricsFormat: {
      control: "select",
      options: ["total", "total-and-selected"],
    },
    enableDragDrop: { control: "boolean" },
    onTransfer: {
      action: "onTransfer",
      description: "(detail: DualListBoxTransferDetail) => void — also fires transfer",
    },
    onDragDrop: {
      action: "onDragDrop",
      description: "(detail: DualListBoxDragDropDetail) => void — also fires drag-drop",
    },
    onItemsChange: {
      action: "onItemsChange",
      description: "(detail: DualListBoxItemsChangeDetail) => void — also fires items-change",
    },
  },
  args: {
    availableItems: specAccurateAvailable,
    selectedItems: [],
    availableTitle: "Available Items",
    selectedTitle: "Selected Items",
    availablePlaceholder: "Select items on the right to move",
    selectedPlaceholder: "Select items on the left to move",
    moveSelectedRightTitle: "Move right",
    moveSelectedLeftTitle: "Move left",
    moveAllRightTitle: "Add all from Available Items",
    moveAllLeftTitle: "Remove all from Selected Items",
    defaultAvailableSelection: [],
    defaultSelectedSelection: [],
    showMetrics: true,
    metricsFormat: "total",
    enableDragDrop: true,
    ariaLabel: "Dual list box",
  },
  render: (args) => renderDualListBox(args),
};

export default meta;
type Story = StoryObj<DualListBoxStoryArgs>;

/** Figma `12114:232557` — 6 available, empty selected, Move all right Default. */
export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
};

/** Same Spec Accurate defaults; documents deterministic anatomy via data-ids. */
export const DeterministicAnatomy: Story = {
  name: "Deterministic Anatomy",
  render: (args) => html`
    <div style=${frameStyle}>
      <ids-dual-list-box
        available-title=${args.availableTitle}
        selected-title=${args.selectedTitle}
        .availableItems=${specAccurateAvailable}
        .selectedItems=${[]}
        .enableDragDrop=${true}
        .onTransfer=${args.onTransfer}
        .onDragDrop=${args.onDragDrop}
      ></ids-dual-list-box>
    </div>
  `,
};

export const WithItemsInSelected: Story = {
  name: "With Items In Selected",
  render: (args) =>
    renderDualListBox({
      ...args,
      availableItems: [
        {
          id: "a1",
          name: "List Item",
          tooltipTitle: "Alpha",
          tooltipDescription: "Move or drag to selected.",
        },
        { id: "a2", name: "List Item" },
      ],
      selectedItems: [
        {
          id: "s1",
          name: "List Item",
          tooltipTitle: "Selected row",
          tooltipDescription: "Shows shape-check-thick when selected.",
        },
        { id: "s2", name: "List Item" },
      ],
      defaultAvailableSelection: [],
      defaultSelectedSelection: ["s1"],
      metricsFormat: "total-and-selected",
    }),
};

export const WithDescription: Story = {
  name: "With Description",
  render: (args) =>
    renderDualListBox({
      ...args,
      availableItems: [
        {
          id: "d1",
          name: "List Item",
          description:
            "Content - Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatu",
        },
      ],
      selectedItems: [],
    }),
};

export const EmptyAvailablePane: Story = {
  name: "Empty Available Pane",
  render: (args) =>
    renderDualListBox({
      ...args,
      availableItems: [],
      selectedItems: [
        { id: "s1", name: "List Item" },
        { id: "s2", name: "List Item" },
      ],
    }),
};

export const TransferBothMoveAllDefault: Story = {
  name: "Transfer — Both Move All Default",
  render: (args) =>
    renderDualListBox({
      ...args,
      availableItems: [
        { id: "a1", name: "List Item" },
        { id: "a2", name: "List Item" },
      ],
      selectedItems: [{ id: "s1", name: "List Item" }],
      defaultAvailableSelection: [],
      defaultSelectedSelection: [],
    }),
};

export const TransferMoveSelectedRightDefault: Story = {
  name: "Transfer — Move Selected Right Default",
  render: (args) =>
    renderDualListBox({
      ...args,
      availableItems: [
        { id: "a1", name: "List Item" },
        { id: "a2", name: "List Item" },
      ],
      selectedItems: [{ id: "s1", name: "List Item" }],
      defaultAvailableSelection: ["a1"],
      defaultSelectedSelection: [],
    }),
};

export const TwelveItemsScrollbar: Story = {
  name: "12 Items + Scrollbar",
  render: (args) =>
    renderDualListBox({
      ...args,
      availableItems: Array.from({ length: 12 }, (_, i) => ({
        id: `avail-${i + 1}`,
        name: "List Item",
      })),
      selectedItems: [],
    }),
};

/** Interactive demo — updates items from `items-change` events. */
export const InteractiveTransfer: Story = {
  name: "Interactive Transfer",
  render: (args) => {
    const available = [...specAccurateAvailable];
    const selected: DualListBoxItem[] = [];

    return html`
      <div style=${frameStyle}>
        <ids-dual-list-box
          available-title=${args.availableTitle}
          selected-title=${args.selectedTitle}
          .availableItems=${available}
          .selectedItems=${selected}
          .enableDragDrop=${true}
          .onTransfer=${args.onTransfer}
          .onDragDrop=${args.onDragDrop}
          @items-change=${(event: CustomEvent<DualListBoxItemsChangeDetail>) => {
            const el = event.currentTarget as IdsDualListBox;
            el.availableItems = event.detail.available;
            el.selectedItems = event.detail.selected;
          }}
        ></ids-dual-list-box>
      </div>
    `;
  },
};

import { applicationConfig, moduleMetadata } from "@storybook/angular";
import { provideZoneChangeDetection } from "@angular/core";
import { SPEC_ACCURATE_DESIGN_STORY } from "../../../compiled/component-contracts/common/story-meta.js";
import {
  DUAL_LIST_BOX_SPEC_ACCURATE_DEFAULTS,
} from "../../../compiled/component-contracts/ids/dual-list-box.contract.js";
import { IdsDualListBoxComponent } from "../../../compiled/lib/angular/ids/dual-list-box/ids-dual-list-box.component.js";
import { IDS_DUAL_LIST_BOX_IMPORTS } from "../../../compiled/lib/angular/ids/dual-list-box/index.js";
import {
  DUAL_LIST_BOX_DOCS_DESCRIPTION,
  DUAL_LIST_BOX_SOURCE_CODE,
  DUAL_LIST_BOX_SPEC_ACCURATE_TEMPLATE,
  DUAL_LIST_BOX_STORY_SOURCE_CODE,
} from "./ids-dual-list-box.developer-usage.js";

/** @type {import("@storybook/angular").Meta<IdsDualListBoxComponent>} */
const meta = {
  title: "Spec Generated/IDS/Dual List Box",
  component: IdsDualListBoxComponent,
  tags: ["autodocs"],
  decorators: [
    applicationConfig({
      providers: [provideZoneChangeDetection()],
    }),
    moduleMetadata({
      imports: [...IDS_DUAL_LIST_BOX_IMPORTS],
    }),
  ],
  parameters: {
    layout: "padded",
    docs: {
      canvas: { sourceState: "open" },
      description: { component: DUAL_LIST_BOX_DOCS_DESCRIPTION },
      source: {
        type: "code",
        language: "typescript",
        code: DUAL_LIST_BOX_SOURCE_CODE,
      },
    },
  },
  argTypes: {
    availableTitle: { control: "text" },
    selectedTitle: { control: "text" },
    showMetrics: { control: "boolean" },
    metricsFormat: { control: "select", options: ["total", "total-and-selected"] },
    enableDragDrop: { control: "boolean" },
    transfer: { action: "transfer" },
    dragDrop: { action: "dragDrop" },
    itemsChange: { action: "itemsChange" },
    availableSelectionChange: { action: "availableSelectionChange" },
    selectedSelectionChange: { action: "selectedSelectionChange" },
  },
};

export default meta;

/** @type {import("@storybook/angular").StoryObj<IdsDualListBoxComponent>} */
export const SpecAccurateDesign = {
  name: SPEC_ACCURATE_DESIGN_STORY,
  parameters: {
    docs: {
      description: {
        story:
          "Spec Accurate Design: Figma `12114:232557` with six available items, empty selected pane, and only move-all-right enabled.",
      },
      source: {
        type: "code",
        language: "html",
        code: DUAL_LIST_BOX_STORY_SOURCE_CODE,
      },
    },
  },
  render: (args) => ({
    props: {
      ...args,
      availableItems: [...args.availableItems],
      selectedItems: [...args.selectedItems],
      transfer: (detail) => args.transfer?.(detail),
      dragDrop: (detail) => args.dragDrop?.(detail),
      itemsChange: (detail) => args.itemsChange?.(detail),
      availableSelectionChange: (ids) => args.availableSelectionChange?.(ids),
      selectedSelectionChange: (ids) => args.selectedSelectionChange?.(ids),
    },
    template: DUAL_LIST_BOX_SPEC_ACCURATE_TEMPLATE,
  }),
  args: {
    availableItems: [...DUAL_LIST_BOX_SPEC_ACCURATE_DEFAULTS.availableItems],
    selectedItems: [...DUAL_LIST_BOX_SPEC_ACCURATE_DEFAULTS.selectedItems],
    availableTitle: DUAL_LIST_BOX_SPEC_ACCURATE_DEFAULTS.availableTitle,
    selectedTitle: DUAL_LIST_BOX_SPEC_ACCURATE_DEFAULTS.selectedTitle,
    availablePlaceholder: DUAL_LIST_BOX_SPEC_ACCURATE_DEFAULTS.availablePlaceholder,
    selectedPlaceholder: DUAL_LIST_BOX_SPEC_ACCURATE_DEFAULTS.selectedPlaceholder,
    availableSelection: [...DUAL_LIST_BOX_SPEC_ACCURATE_DEFAULTS.availableSelection],
    selectedSelection: [...DUAL_LIST_BOX_SPEC_ACCURATE_DEFAULTS.selectedSelection],
    showMetrics: DUAL_LIST_BOX_SPEC_ACCURATE_DEFAULTS.showMetrics,
    metricsFormat: DUAL_LIST_BOX_SPEC_ACCURATE_DEFAULTS.metricsFormat,
    enableDragDrop: DUAL_LIST_BOX_SPEC_ACCURATE_DEFAULTS.enableDragDrop,
    moveSelectedRightTitle: DUAL_LIST_BOX_SPEC_ACCURATE_DEFAULTS.moveSelectedRightTitle,
    moveSelectedLeftTitle: DUAL_LIST_BOX_SPEC_ACCURATE_DEFAULTS.moveSelectedLeftTitle,
    moveAllRightTitle: DUAL_LIST_BOX_SPEC_ACCURATE_DEFAULTS.moveAllRightTitle,
    moveAllLeftTitle: DUAL_LIST_BOX_SPEC_ACCURATE_DEFAULTS.moveAllLeftTitle,
  },
};

/** @type {import("@storybook/angular").StoryObj<IdsDualListBoxComponent>} */
export const WithItemsInSelected = {
  render: (args) => ({
    props: {
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
      availableSelection: [],
      selectedSelection: ["s1"],
    },
    template: DUAL_LIST_BOX_SPEC_ACCURATE_TEMPLATE,
  }),
  args: {
    availableTitle: DUAL_LIST_BOX_SPEC_ACCURATE_DEFAULTS.availableTitle,
    selectedTitle: DUAL_LIST_BOX_SPEC_ACCURATE_DEFAULTS.selectedTitle,
    availablePlaceholder: DUAL_LIST_BOX_SPEC_ACCURATE_DEFAULTS.availablePlaceholder,
    selectedPlaceholder: DUAL_LIST_BOX_SPEC_ACCURATE_DEFAULTS.selectedPlaceholder,
    showMetrics: true,
    metricsFormat: "total-and-selected",
    enableDragDrop: true,
    moveSelectedRightTitle: DUAL_LIST_BOX_SPEC_ACCURATE_DEFAULTS.moveSelectedRightTitle,
    moveSelectedLeftTitle: DUAL_LIST_BOX_SPEC_ACCURATE_DEFAULTS.moveSelectedLeftTitle,
    moveAllRightTitle: DUAL_LIST_BOX_SPEC_ACCURATE_DEFAULTS.moveAllRightTitle,
    moveAllLeftTitle: DUAL_LIST_BOX_SPEC_ACCURATE_DEFAULTS.moveAllLeftTitle,
  },
};

/** @type {import("@storybook/angular").StoryObj<IdsDualListBoxComponent>} */
export const TransferMoveSelectedRightDefault = {
  render: (args) => ({
    props: {
      ...args,
      availableItems: [
        { id: "a1", name: "List Item" },
        { id: "a2", name: "List Item" },
      ],
      selectedItems: [{ id: "s1", name: "List Item" }],
      availableSelection: ["a1"],
      selectedSelection: [],
    },
    template: DUAL_LIST_BOX_SPEC_ACCURATE_TEMPLATE,
  }),
  args: {
    availableTitle: DUAL_LIST_BOX_SPEC_ACCURATE_DEFAULTS.availableTitle,
    selectedTitle: DUAL_LIST_BOX_SPEC_ACCURATE_DEFAULTS.selectedTitle,
    availablePlaceholder: DUAL_LIST_BOX_SPEC_ACCURATE_DEFAULTS.availablePlaceholder,
    selectedPlaceholder: DUAL_LIST_BOX_SPEC_ACCURATE_DEFAULTS.selectedPlaceholder,
    showMetrics: true,
    metricsFormat: "total-and-selected",
    enableDragDrop: true,
    moveSelectedRightTitle: DUAL_LIST_BOX_SPEC_ACCURATE_DEFAULTS.moveSelectedRightTitle,
    moveSelectedLeftTitle: DUAL_LIST_BOX_SPEC_ACCURATE_DEFAULTS.moveSelectedLeftTitle,
    moveAllRightTitle: DUAL_LIST_BOX_SPEC_ACCURATE_DEFAULTS.moveAllRightTitle,
    moveAllLeftTitle: DUAL_LIST_BOX_SPEC_ACCURATE_DEFAULTS.moveAllLeftTitle,
  },
};

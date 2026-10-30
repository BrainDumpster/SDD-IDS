import { applicationConfig, moduleMetadata } from "@storybook/angular";
import { provideZoneChangeDetection } from "@angular/core";
import { IDS_DROPDOWN_IMPORTS } from "../../../compiled/lib/angular/ids/dropdown/index.js";
import {
  DROPDOWN_DOCS_DESCRIPTION,
  DROPDOWN_SOURCE_CODE,
  DROPDOWN_STORY_SOURCE_CODE,
} from "./ids-dropdown.developer-usage.js";

/** Decorators shared by all dropdown story files (indexer-safe: import fields explicitly). */
export const dropdownStoryDecorators = [
  applicationConfig({
    providers: [provideZoneChangeDetection()],
  }),
  moduleMetadata({
    imports: [...IDS_DROPDOWN_IMPORTS],
  }),
];

export const dropdownStoryParameters = {
  layout: "centered",
  docs: {
    canvas: { sourceState: "open" },
    description: { component: DROPDOWN_DOCS_DESCRIPTION },
    source: {
      type: "code",
      language: "typescript",
      code: DROPDOWN_SOURCE_CODE,
    },
  },
};

export const dropdownStoryArgTypes = {
  mode: {
    control: "select",
    options: ["combobox-single", "combobox-multi", "single-select", "multi-select"],
  },
  disabled: { control: "boolean" },
  /** React/spec name — radio option visuals (aliases `showSingleSelectRadio`). */
  showRadio: { control: "boolean" },
  valueChange: { action: "valueChange" },
  valuesChange: { action: "valuesChange" },
};

/**
 * Menu + shell controls aligned with React high-level / DropdownMenu props.
 * Composition maps: badge/tooltip → trigger-shell; action → menu-footer.
 */
export const dropdownMenuStoryArgTypes = {
  searchable: { control: "boolean", description: "React/spec — enables search row (aliases showSearch)" },
  showRadio: { control: "boolean", description: "React/spec — radio option visuals" },
  showClearAll: {
    control: "boolean",
    description: "React/spec — single-select Clear All row below search when a value is selected",
  },
  showSelectAllClearAll: {
    control: "boolean",
    description: "React/spec — Select All / Clear All row (multiselect)",
  },
  selectAllLabel: { control: "text", description: "React/spec — Select All label" },
  clearAllLabel: { control: "text", description: "React/spec — Clear All label" },
  clearAllDisabled: { control: "boolean", description: "React/spec — disable Clear All (no filter)" },
  showSelectedBadge: {
    control: "boolean",
    description: "React/spec — selected-count badge in the trigger field",
  },
  showSelectedTooltip: {
    control: "boolean",
    description: "React/spec — selected summary tooltip on the badge",
  },
  showSelectedPanel: {
    control: "boolean",
    description: "React/spec — Show/Hide Selected panel (combobox multi)",
  },
  menuWidth: {
    control: "select",
    options: ["trigger", "content"],
    description: "React/spec — trigger width vs content width",
  },
  maxVisibleItems: {
    control: { type: "number", min: 1, max: 20 },
    description: "React/spec — option rows before scroll (default 6)",
  },
  noResultsLabel: {
    control: "text",
    description: "React/spec — empty search result row label",
  },
  searchPlaceholder: { control: "text", description: "React/spec — search input placeholder" },
  ariaLabel: { control: "text", description: "React/spec — trigger aria-label" },
  ariaInvalid: { control: "boolean", description: "React/spec — trigger aria-invalid" },
  defaultOpen: { control: "boolean" },
  fullWidth: { control: "boolean" },
  size: {
    control: "select",
    options: ["small", "large"],
    description: "Trigger field size",
  },
};

/** Default args so Controls update the canvas when templates bind these props. */
export const dropdownStoryArgs = {
  disabled: false,
  showRadio: false,
  searchable: false,
  showClearAll: false,
  showSelectAllClearAll: false,
  selectAllLabel: "Select All",
  clearAllLabel: "Clear All",
  clearAllDisabled: false,
  showSelectedBadge: true,
  showSelectedTooltip: true,
  showSelectedPanel: false,
  menuWidth: "trigger",
  maxVisibleItems: 6,
  noResultsLabel: "No results found",
  searchPlaceholder: "Search",
  ariaLabel: "",
  ariaInvalid: false,
  defaultOpen: true,
  fullWidth: true,
  size: "large",
};

export const DROPDOWN_COMPOSITION_STORY_PARAMS = {
  docs: {
    description: {
      story: "Composition API: root + projected trigger, menu items, helper/error slots.",
    },
    source: {
      type: "code",
      language: "html",
      code: DROPDOWN_STORY_SOURCE_CODE,
    },
  },
};

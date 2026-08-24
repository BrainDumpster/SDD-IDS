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
  valueChange: { action: "valueChange" },
  valuesChange: { action: "valuesChange" },
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

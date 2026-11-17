/**
 * Storybook: IDS Lit Dropdown: Multiselect from `lib/lit/ids/dropdown-multiselect`
 *
 * Theme: components/ids-theme.css (via preview)
 * Spec: components/ids/dropdown-multiselect/design-spec.md
 * API: lib/react/ids/dropdown-multiselect · storybook/src/components/lib-generated/DropdownMultiSelect.stories.tsx
 *
 * Live Figma verified 2026-11-06 (file `0bHk3XhrjFhowgFkz9yLr4`): multiselect field
 * `12608:96588` → `Corner Radius/radius-none`.
 */
import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import "@ids/core/dropdown-multiselect/register.js";
import type { IdsDropdownMultiSelectOptionModel } from "@ids/core/dropdown-multiselect";
import {
  DROPDOWN_MULTISELECT_DOCS_DESCRIPTION,
  DROPDOWN_MULTISELECT_SOURCE_CODE,
} from "./ids-dropdown-multiselect.developer-usage";

const OPTIONS: IdsDropdownMultiSelectOptionModel[] = Array.from(
  { length: 6 },
  (_, i) => ({ id: `${i + 1}`, label: `Option ${i + 1}` }),
);

const LONG_OPTIONS: IdsDropdownMultiSelectOptionModel[] = Array.from(
  { length: 12 },
  (_, i) => ({ id: `l${i + 1}`, label: `Option ${i + 1}` }),
);

const sampleWidth = (content: unknown) => html`
  <div style="width: 300px; max-width: 100%">${content}</div>
`;

const page = (content: unknown) => html`
  <div style="display: flex; justify-content: center; padding: 120px 16px 160px">
    ${content}
  </div>
`;

type Args = Record<string, unknown>;

const dropdown = (
  args: Args,
  overrides: { open?: boolean; helper?: string; error?: string } = {},
) => html`
  <ids-dropdown-multiselect
    size=${ifDefined(args.size as string | undefined)}
    label=${ifDefined((args.label as string) || undefined)}
    placeholder=${ifDefined(args.placeholder as string | undefined)}
    menuwidth=${ifDefined(args.menuWidth as string | undefined)}
    helpertext=${ifDefined(overrides.helper)}
    errortext=${ifDefined(overrides.error)}
    ?required=${Boolean(args.required)}
    ?disabled=${Boolean(args.disabled)}
    ?searchable=${Boolean(args.searchable)}
    ?defaultopen=${Boolean(overrides.open)}
    ?showselectallclearall=${Boolean(args.showSelectAllClearAll)}
    .showSelectedBadge=${args.showSelectedBadge !== false}
    .showSelectedTooltip=${args.showSelectedTooltip !== false}
    .showSelectedPanel=${args.showSelectedPanel !== false}
    .options=${(args.options as IdsDropdownMultiSelectOptionModel[]) ?? OPTIONS}
    .defaultValue=${(args.defaultValue as string[]) ?? []}
  ></ids-dropdown-multiselect>
`;

const meta: Meta = {
  title: "Spec Generated/IDS/Dropdown/Multi Select",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      canvas: { sourceState: "shown" },
      description: { component: DROPDOWN_MULTISELECT_DOCS_DESCRIPTION },
      source: { code: DROPDOWN_MULTISELECT_SOURCE_CODE, language: "html" },
    },
  },
  args: {
    size: "large",
    label: "Environment",
    required: true,
    placeholder: "Select",
    searchable: false,
    showSelectAllClearAll: true,
    showSelectedBadge: true,
    showSelectedTooltip: true,
    showSelectedPanel: true,
    options: OPTIONS,
    defaultValue: ["1", "2"],
    menuWidth: "trigger",
    disabled: false,
  },
  argTypes: {
    size: { control: "select", options: ["large", "small"] },
    menuWidth: { control: "select", options: ["trigger", "content"] },
    label: { control: "text" },
    placeholder: { control: "text" },
    required: { control: "boolean" },
    searchable: { control: "boolean" },
    disabled: { control: "boolean" },
    showSelectAllClearAll: { control: "boolean" },
    showSelectedBadge: { control: "boolean" },
    showSelectedTooltip: { control: "boolean" },
    showSelectedPanel: { control: "boolean" },
    options: { control: false },
    defaultValue: { control: false },
  },
};

export default meta;
type Story = StoryObj;

/** Figma field `12608:96588` — badge "2" + value text, Select All | Clear All, helper text, menu open. */
export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  render: (args) =>
    page(sampleWidth(dropdown(args, { open: true, helper: "Helper text" }))),
};

/** Badge + shared tooltip (hover the field): `N Items` header + bulleted list. */
export const BadgeAndTooltip: Story = {
  name: "Badge + Tooltip",
  args: { defaultValue: ["1", "2", "3", "4"] },
  render: (args) =>
    page(sampleWidth(dropdown(args, { helper: "Hover the field for the selected list" }))),
};

/** Select All | Clear All + Show Selected panel (expand to see dismissible tags). */
export const SelectAllAndShowSelected: Story = {
  name: "Select All + Show Selected",
  args: { options: LONG_OPTIONS, defaultValue: ["l1", "l2", "l3"] },
  render: (args) => page(sampleWidth(dropdown(args, { open: true }))),
};

export const Small: Story = {
  name: "Small",
  args: { size: "small" },
  render: (args) =>
    page(sampleWidth(dropdown(args, { open: true, helper: "Small (32px)" }))),
};

export const Disabled: Story = {
  name: "Disabled",
  args: { disabled: true, defaultValue: ["1"] },
  render: (args) =>
    page(sampleWidth(dropdown(args, { helper: "Component is disabled" }))),
};

export const ErrorState: Story = {
  name: "Error",
  args: { defaultValue: [], required: false, label: "" },
  render: (args) =>
    page(sampleWidth(dropdown(args, { error: "Error message" }))),
};

export const Searchable: Story = {
  name: "Searchable",
  args: { searchable: true },
  render: (args) =>
    page(sampleWidth(dropdown(args, { open: true, helper: "Helper text" }))),
};

/** 12 options → scroll region after 6 rows. */
export const Overflow: Story = {
  name: "Overflow (12 options)",
  args: { options: LONG_OPTIONS, defaultValue: ["l1"] },
  render: (args) =>
    page(sampleWidth(dropdown(args, { open: true, helper: "Helper text" }))),
};

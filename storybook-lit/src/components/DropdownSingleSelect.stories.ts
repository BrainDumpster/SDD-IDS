/**
 * Storybook: IDS Lit Dropdown: Single-select from `lib/lit/ids/dropdown-single-select`
 *
 * Theme: components/ids-theme.css (via preview)
 * Spec: components/ids/dropdown-single-select/design-spec.md
 * API: lib/react/ids/dropdown-single-select · storybook/src/components/lib-generated/DropdownSingleSelect.stories.tsx
 *
 * Live Figma verified 2026-11-06 (file `0bHk3XhrjFhowgFkz9yLr4`): matrix `11099:58099`;
 * field Container `12579:77895` → `Corner Radius/radius-none`.
 */
import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import "@ids/core/dropdown-single-select/register.js";
import type { IdsDropdownSingleSelectOptionModel } from "@ids/core/dropdown-single-select";
import {
  DROPDOWN_SINGLE_SELECT_DOCS_DESCRIPTION,
  DROPDOWN_SINGLE_SELECT_SOURCE_CODE,
} from "./ids-dropdown-single-select.developer-usage";

const OPTIONS: IdsDropdownSingleSelectOptionModel[] = [
  { id: "1", label: "Option 1" },
  { id: "2", label: "Option 2" },
  { id: "3", label: "Option 3" },
  { id: "4", label: "Option 4" },
  { id: "5", label: "Option 5" },
];

const OVERFLOW_OPTIONS: IdsDropdownSingleSelectOptionModel[] = Array.from(
  { length: 12 },
  (_, i) => ({ id: `o${i + 1}`, label: `Option ${i + 1}` }),
);

const SECTION_OPTIONS: IdsDropdownSingleSelectOptionModel[] = [
  { id: "h1", label: "Section Title", kind: "section" },
  { id: "a1", label: "Option 1" },
  { id: "a2", label: "Option 2" },
  { id: "a3", label: "Option 3" },
  { id: "h2", label: "Section Title", kind: "section" },
  { id: "b1", label: "Option 4" },
  { id: "b2", label: "Option 5" },
  { id: "b3", label: "Option 6" },
];

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
  overrides: {
    open?: boolean;
    helper?: string;
    error?: string;
  } = {},
) => html`
  <ids-dropdown-single-select
    size=${ifDefined(args.size as string | undefined)}
    label=${ifDefined((args.label as string) || undefined)}
    placeholder=${ifDefined(args.placeholder as string | undefined)}
    menuwidth=${ifDefined(args.menuWidth as string | undefined)}
    resettodefaultlabel=${ifDefined(args.resetToDefaultLabel as string | undefined)}
    actionlabel=${ifDefined((args.actionLabel as string) || undefined)}
    defaultvalue=${ifDefined(args.defaultValue as string | undefined)}
    helpertext=${ifDefined(overrides.helper)}
    errortext=${ifDefined(overrides.error)}
    ?required=${Boolean(args.required)}
    ?disabled=${Boolean(args.disabled)}
    ?searchable=${Boolean(args.searchable)}
    ?showradio=${Boolean(args.showRadio)}
    ?defaultopen=${Boolean(overrides.open)}
    .showResetToDefault=${args.showResetToDefault !== false}
    .options=${(args.options as IdsDropdownSingleSelectOptionModel[]) ?? OPTIONS}
  ></ids-dropdown-single-select>
`;

const meta: Meta = {
  title: "Spec Generated/IDS/Dropdown/Single Select",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      canvas: { sourceState: "shown" },
      description: { component: DROPDOWN_SINGLE_SELECT_DOCS_DESCRIPTION },
      source: { code: DROPDOWN_SINGLE_SELECT_SOURCE_CODE, language: "html" },
    },
  },
  args: {
    size: "large",
    label: "Environment",
    required: true,
    placeholder: "Select",
    searchable: false,
    showRadio: true,
    showResetToDefault: true,
    resetToDefaultLabel: "Reset to Default",
    options: OPTIONS,
    defaultValue: "2",
    menuWidth: "trigger",
    disabled: false,
  },
  argTypes: {
    size: { control: "select", options: ["large", "small"] },
    menuWidth: { control: "select", options: ["trigger", "content"] },
    label: { control: "text" },
    placeholder: { control: "text" },
    required: { control: "boolean" },
    showRadio: { control: "boolean" },
    showResetToDefault: { control: "boolean" },
    resetToDefaultLabel: { control: "text" },
    searchable: { control: "boolean" },
    disabled: { control: "boolean" },
    defaultValue: { control: "text" },
    options: { control: false },
  },
};

export default meta;
type Story = StoryObj;

/** Figma matrix `11099:58099` — large, required, radio, default "Option 2", helper text, menu open. */
export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  render: (args) =>
    page(sampleWidth(dropdown(args, { open: true, helper: "Helper text" }))),
};

/** Small (32px) field. */
export const Small: Story = {
  name: "Small",
  args: { size: "small" },
  render: (args) =>
    page(sampleWidth(dropdown(args, { open: true, helper: "Small (32px)" }))),
};

export const Disabled: Story = {
  name: "Disabled",
  args: { disabled: true, defaultValue: "1" },
  render: (args) =>
    page(sampleWidth(dropdown(args, { helper: "Component is disabled" }))),
};

export const ErrorState: Story = {
  name: "Error",
  args: { defaultValue: "", required: false, label: "" },
  render: (args) =>
    page(sampleWidth(dropdown(args, { error: "Error message" }))),
};

/** `searchable` — search row, popup min-height 212px. */
export const Searchable: Story = {
  name: "Searchable",
  args: { searchable: true },
  render: (args) =>
    page(sampleWidth(dropdown(args, { open: true, helper: "Helper text" }))),
};

/** 12 options → scroll region after 6 rows (`maxVisibleItems`). */
export const Overflow: Story = {
  name: "Overflow (12 options)",
  args: { options: OVERFLOW_OPTIONS, defaultValue: "o2" },
  render: (args) =>
    page(sampleWidth(dropdown(args, { open: true, helper: "Helper text" }))),
};

/** Section headers (`kind: "section"`). */
export const SectionHeaders: Story = {
  name: "Section Headers",
  args: { options: SECTION_OPTIONS, defaultValue: "a2" },
  render: (args) =>
    page(sampleWidth(dropdown(args, { open: true }))),
};

/** `actionLabel` footer action (fires `ids-action`). */
export const ActionButton: Story = {
  name: "Action Button",
  args: { options: OVERFLOW_OPTIONS, defaultValue: "o2", actionLabel: "Action" },
  render: (args) =>
    page(sampleWidth(dropdown(args, { open: true }))),
};

/**
 * Storybook: IDS Lit Dropdown: Combo box from `lib/lit/ids/dropdown-combo-box`
 *
 * Theme: components/ids-theme.css (via preview)
 * Spec: components/ids/dropdown-combo-box/design-spec.md
 * API: lib/react/ids/dropdown-combo-box · storybook/src/components/lib-generated/DropdownComboBox.stories.tsx
 *
 * Live Figma verified 2026-11-06 (file `0bHk3XhrjFhowgFkz9yLr4`): combo box field
 * `29393:149487` → `Corner Radius/radius-none`.
 */
import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import "@ids/core/dropdown-combo-box/register.js";
import type { IdsDropdownComboBoxOption } from "@ids/core/dropdown-combo-box";
import {
  DROPDOWN_COMBO_BOX_DOCS_DESCRIPTION,
  DROPDOWN_COMBO_BOX_SOURCE_CODE,
} from "./ids-dropdown-combo-box.developer-usage";

const PRODUCT_OPTIONS: IdsDropdownComboBoxOption[] = [
  { id: "app-1", label: "Storage" },
  { id: "app-2", label: "Compute" },
  { id: "app-3", label: "Network" },
  { id: "app-4", label: "Security" },
];

const MULTI_OPTIONS: IdsDropdownComboBoxOption[] = [
  { id: "o1", label: "Observability" },
  { id: "o2", label: "Storage & Data Backup" },
  { id: "o3", label: "Compute & Networking" },
  { id: "o4", label: "Security & Compliance" },
  { id: "o5", label: "Analytics & Reporting" },
  { id: "o6", label: "Identity & Access" },
  { id: "o7", label: "Cost Management" },
  { id: "o8", label: "Developer Tools" },
  { id: "o9", label: "Machine Learning Platform" },
  { id: "o10", label: "Container Orchestration" },
  { id: "o11", label: "Message Queue Service" },
  { id: "o12", label: "Content Delivery Network" },
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

const combo = (
  args: Args,
  overrides: { open?: boolean; helper?: string; error?: string } = {},
) => html`
  <ids-dropdown-combo-box
    mode=${ifDefined(args.mode as string | undefined)}
    size=${ifDefined(args.size as string | undefined)}
    label=${ifDefined((args.label as string) || undefined)}
    placeholder=${ifDefined(args.placeholder as string | undefined)}
    menuwidth=${ifDefined(args.menuWidth as string | undefined)}
    resettodefaultlabel=${ifDefined(args.resetToDefaultLabel as string | undefined)}
    helpertext=${ifDefined(overrides.helper)}
    errortext=${ifDefined(overrides.error)}
    ?required=${Boolean(args.required)}
    ?disabled=${Boolean(args.disabled)}
    ?searchable=${Boolean(args.searchable)}
    ?showselectedpanel=${Boolean(args.showSelectedPanel)}
    ?defaultopen=${Boolean(overrides.open)}
    .showResetToDefault=${args.showResetToDefault !== false}
    .options=${(args.options as IdsDropdownComboBoxOption[]) ?? PRODUCT_OPTIONS}
    .defaultValue=${args.defaultValue as string | string[] | undefined}
  ></ids-dropdown-combo-box>
`;

const meta: Meta = {
  title: "Spec Generated/IDS/Dropdown/Combo Box",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      canvas: { sourceState: "shown" },
      description: { component: DROPDOWN_COMBO_BOX_DOCS_DESCRIPTION },
      source: { code: DROPDOWN_COMBO_BOX_SOURCE_CODE, language: "html" },
    },
  },
  args: {
    mode: "combobox-single",
    size: "large",
    label: "Environment",
    required: true,
    placeholder: "Select",
    searchable: true,
    showResetToDefault: true,
    resetToDefaultLabel: "Reset to Default",
    showSelectedPanel: false,
    options: PRODUCT_OPTIONS,
    defaultValue: "app-2",
    menuWidth: "trigger",
    disabled: false,
  },
  argTypes: {
    mode: { control: "select", options: ["combobox-single", "combobox-multi"] },
    size: { control: "select", options: ["large", "small"] },
    menuWidth: { control: "select", options: ["trigger", "content"] },
    label: { control: "text" },
    placeholder: { control: "text" },
    required: { control: "boolean" },
    searchable: { control: "boolean" },
    showResetToDefault: { control: "boolean" },
    resetToDefaultLabel: { control: "text" },
    showSelectedPanel: { control: "boolean" },
    disabled: { control: "boolean" },
    options: { control: false },
    defaultValue: { control: false },
  },
};

export default meta;
type Story = StoryObj;

/** Figma field `29393:149487` — `combobox-single`, search row, default "Compute", helper text, menu open. */
export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  render: (args) =>
    page(sampleWidth(combo(args, { open: true, helper: "Helper text" }))),
};

/** `combobox-multi` — badge + tooltip, Select All | Clear All, Show Selected panel. */
export const MultiSelectShowSelected: Story = {
  name: "Multi-select (Show Selected)",
  args: {
    mode: "combobox-multi",
    label: "",
    required: false,
    options: MULTI_OPTIONS,
    defaultValue: ["o1", "o2", "o3"],
    showSelectedPanel: true,
    menuWidth: "content",
  },
  render: (args) =>
    page(
      html`<div style="width: 60vw; min-width: 218px; max-width: 732px; padding: 16px; box-sizing: border-box">
        ${combo(args, { open: true, helper: "Choose one or more products" })}
      </div>`,
    ),
};

export const Small: Story = {
  name: "Small",
  args: { size: "small" },
  render: (args) =>
    page(sampleWidth(combo(args, { open: true, helper: "Small (32px)" }))),
};

export const Disabled: Story = {
  name: "Disabled",
  args: { disabled: true, defaultValue: "app-1" },
  render: (args) =>
    page(sampleWidth(combo(args, { helper: "Component is disabled" }))),
};

export const ErrorState: Story = {
  name: "Error",
  args: { defaultValue: undefined, required: false, label: "" },
  render: (args) => page(sampleWidth(combo(args, { error: "Error message" }))),
};

/** Type `Sto` — a unique prefix match renders ghost text `rage`; accept with Tab / → / End. */
export const GhostTextAutocomplete: Story = {
  name: "Ghost Text Autocomplete",
  args: { defaultValue: undefined },
  render: (args) =>
    page(sampleWidth(combo(args, { open: true, helper: "Type “Sto”, then Tab" }))),
};

/** 12 options → scroll region after 6 rows. */
export const Overflow: Story = {
  name: "Overflow (12 options)",
  args: { options: MULTI_OPTIONS, defaultValue: "o2" },
  render: (args) =>
    page(sampleWidth(combo(args, { open: true, helper: "Helper text" }))),
};

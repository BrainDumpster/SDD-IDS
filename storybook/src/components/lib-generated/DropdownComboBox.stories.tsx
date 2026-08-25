/**
 * Storybook: design-spec–generated Dropdown / Combo Box from `lib/react/ids/dropdown-combo-box`
 *
 * Anatomy:
 *   IdsDropdownComboBox (combobox-container)
 *     combobox → combobox-options → combobox-option*
 *     IdsHelper? | IdsError? (mutually exclusive)
 *
 * Theme: components/ids-theme.css
 * Spec: components/ids/dropdown-combo-box/design-spec.md
 */
import React, { useState, type ComponentProps, type CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/ids-theme.css";
import {
  DROPDOWN_COMBO_BOX_DOCS_DESCRIPTION,
  DROPDOWN_COMBO_BOX_SOURCE_CODE,
} from "./ids-dropdown-combo-box.developer-usage";
import {
  IdsDropdownComboBox,
  IdsComboboxOptions,
  IdsComboboxOption,
  type IdsDropdownComboBoxOption,
} from "@ids/react/dropdown-combo-box";
import { IdsError, IdsErrorText } from "@ids/react/error";
import { IdsHelper, IdsHelperText } from "@ids/react/helper";

const DESIGN_SPEC_PATH = "components/ids/dropdown-combo-box/design-spec.md";

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

const TIMEZONES: IdsDropdownComboBoxOption[] = [
  { id: "tz-0", label: "(UTC-08:00) Pacific Time (US & Canada)" },
  { id: "tz-1", label: "(UTC-07:00) Mountain Time (US & Canada)" },
  { id: "tz-2", label: "(UTC-06:00) Central Time (US & Canada)" },
  { id: "tz-3", label: "(UTC-05:00) Eastern Time (US & Canada)" },
  { id: "tz-4", label: "(UTC+00:00) Coordinated Universal Time (UTC)" },
  { id: "tz-5", label: "(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi" },
  {
    id: "tz-6",
    label:
      "(UTC+12:45) Chatham Islands, and other remote South Pacific island territories",
  },
];

type ComboProps = ComponentProps<typeof IdsDropdownComboBox>;

const sampleWidth: CSSProperties = { width: 300, maxWidth: "100%" };

const meta: Meta<typeof IdsDropdownComboBox> = {
  tags: ["autodocs"],
  title: "Components/IDS/Dropdown/Combo Box",
  component: IdsDropdownComboBox,
  parameters: {
    layout: "fullscreen",
    docs: {
      canvas: { sourceState: "open" },
      description: {
        component: DROPDOWN_COMBO_BOX_DOCS_DESCRIPTION,
      },
      source: {
        type: "code",
        language: "tsx",
        code: DROPDOWN_COMBO_BOX_SOURCE_CODE,
      },
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "120px 16px 32px",
        }}
      >
        <Story />
      </div>
    ),
  ],
  args: {
    mode: "combobox-single",
    size: "large",
    label: "Environment",
    required: true,
    placeholder: "Select",
    searchable: true,
    showClearAll: true,
    options: PRODUCT_OPTIONS,
    defaultValue: "app-2",
    menuWidth: "trigger",
  },
  argTypes: {
    mode: {
      control: "select",
      options: ["combobox-single", "combobox-multi"],
    },
    size: { control: "select", options: ["large", "small"] },
    menuWidth: { control: "select", options: ["trigger", "content"] },
    searchable: { control: "boolean" },
    showClearAll: { control: "boolean" },
    showSelectedPanel: { control: "boolean" },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    onChange: { action: "onChange" },
    onSearch: { action: "onSearch" },
    onOpenChange: { action: "onOpenChange" },
  },
};

export default meta;
type Story = StoryObj<typeof IdsDropdownComboBox>;

/** Spec Accurate Design — single-select + helper (Composition & API defaults). */
export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  render: (args) => (
    <div style={sampleWidth}>
      <IdsDropdownComboBox {...args} defaultOpen>
        <IdsHelper>
          <IdsHelperText>Helper text</IdsHelperText>
        </IdsHelper>
      </IdsDropdownComboBox>
    </div>
  ),
};

/** Mode B — compositional combobox-options / combobox-option. */
export const CompositionalOptions: Story = {
  name: "Compositional Options",
  render: () => {
    const [value, setValue] = useState<string>("app-2");
    return (
      <div style={sampleWidth}>
        <IdsDropdownComboBox
          mode="combobox-single"
          size="large"
          label="Product"
          required
          placeholder="Select"
          searchable
          showClearAll
          value={value}
          onChange={(next) => setValue(typeof next === "string" ? next : next[0] ?? "")}
          defaultOpen
        >
          <IdsComboboxOptions>
            <IdsComboboxOption id="app-1" label="Storage" />
            <IdsComboboxOption id="app-2" label="Compute" />
            <IdsComboboxOption id="app-3" label="Network" />
            <IdsComboboxOption id="app-4" label="Security" />
          </IdsComboboxOptions>
          <IdsHelper>
            <IdsHelperText>Choose one product</IdsHelperText>
          </IdsHelper>
        </IdsDropdownComboBox>
      </div>
    );
  },
};

/** Multi-select + Show Selected panel (Figma multi-select contract). */
export const MultiSelectShowSelected: Story = {
  name: "Multi-select Show Selected",
  render: () => {
    const [value, setValue] = useState<string[]>(MULTI_OPTIONS.map((o) => o.id));
    const [expanded, setExpanded] = useState(true);
    return (
      <div
        style={{
          width: "60vw",
          minWidth: 186 + 32,
          maxWidth: 700 + 32,
          boxSizing: "border-box",
          resize: "horizontal",
          overflow: "auto",
          padding: 16,
          border: "1px dashed var(--color-border-gray-neutral-base)",
        }}
      >
        <IdsDropdownComboBox
          mode="combobox-multi"
          size="large"
          placeholder="Select"
          searchable
          menuWidth="content"
          fullWidth
          options={MULTI_OPTIONS}
          value={value}
          onChange={(next) => setValue(Array.isArray(next) ? next : [next])}
          showSelectedPanel
          showSelectedExpanded={expanded}
          onShowSelectedExpandedChange={setExpanded}
          defaultOpen
        >
          <IdsHelper>
            <IdsHelperText>Choose one or more products</IdsHelperText>
          </IdsHelper>
        </IdsDropdownComboBox>
      </div>
    );
  },
};

/** Truncation — menuWidth trigger (menu matches 300px field). */
export const Truncation: Story = {
  name: "Truncation (menuWidth=trigger)",
  render: () => {
    const [value, setValue] = useState("tz-0");
    return (
      <div style={sampleWidth}>
        <IdsDropdownComboBox
          mode="combobox-single"
          options={TIMEZONES}
          value={value}
          onChange={(next) => setValue(typeof next === "string" ? next : next[0] ?? "")}
          searchable
          defaultOpen
        >
          <IdsHelper>
            <IdsHelperText>Time zone</IdsHelperText>
          </IdsHelper>
        </IdsDropdownComboBox>
      </div>
    );
  },
};

/** Size × label matrix (Large 40 / Small 32). */
export const SizeAndLabelMatrix: Story = {
  name: "Size & Label Matrix",
  render: () => (
    <div style={{ width: 760, display: "grid", gap: 24 }}>
      <IdsDropdownComboBox
        mode="combobox-single"
        size="large"
        label="Environment"
        required
        options={PRODUCT_OPTIONS}
        defaultValue="app-2"
        searchable
        fullWidth
        style={{ width: "100%" }}
      >
        <IdsHelper>
          <IdsHelperText>Large (40px)</IdsHelperText>
        </IdsHelper>
      </IdsDropdownComboBox>
      <IdsDropdownComboBox
        mode="combobox-single"
        size="small"
        label="Environment"
        options={PRODUCT_OPTIONS}
        defaultValue="app-2"
        searchable
        fullWidth
        style={{ width: "100%" }}
      >
        <IdsHelper>
          <IdsHelperText>Small (32px)</IdsHelperText>
        </IdsHelper>
      </IdsDropdownComboBox>
    </div>
  ),
};

/** Disabled + error states (ValidationError projection). */
export const DisabledAndErrorStates: Story = {
  name: "Disabled & Error",
  render: () => (
    <div style={{ width: 360, display: "grid", gap: 24 }}>
      <IdsDropdownComboBox
        mode="combobox-single"
        options={PRODUCT_OPTIONS}
        defaultValue="app-1"
        searchable
        disabled
      >
        <IdsHelper>
          <IdsHelperText>Component is disabled (no expand + disabled cursor)</IdsHelperText>
        </IdsHelper>
      </IdsDropdownComboBox>
      <IdsDropdownComboBox
        mode="combobox-single"
        options={PRODUCT_OPTIONS}
        placeholder="Type or Select"
        searchable
      >
        <IdsError>
          <IdsErrorText>Error message</IdsErrorText>
        </IdsError>
      </IdsDropdownComboBox>
    </div>
  ),
};

/** Long option — content-driven menu width clamped to 700px. */
export const ContentDrivenLongOption: Story = {
  name: "Content-driven Long Option",
  render: () => {
    const longOptions: IdsDropdownComboBoxOption[] = [
      {
        id: "o1",
        label:
          "Observability, Monitoring, Alerting & Automated Incident Response for an extremely long service catalog entry",
      },
      { id: "o2", label: "Storage & Data Backup" },
      { id: "o3", label: "Compute & Networking" },
      { id: "o4", label: "Security & Compliance" },
    ];
    return (
      <div style={{ width: 360 }}>
        <IdsDropdownComboBox
          mode="combobox-single"
          options={longOptions}
          defaultValue="o2"
          searchable
          menuWidth="content"
          defaultOpen
        >
          <IdsHelper>
            <IdsHelperText>menuWidth=&quot;content&quot; grows to widest option (max 700px)</IdsHelperText>
          </IdsHelper>
        </IdsDropdownComboBox>
      </div>
    );
  },
};

/** Controls playground — args-driven. */
export const Playground: Story = {
  name: "Playground",
  render: (args: ComboProps) => (
    <div style={sampleWidth}>
      <IdsDropdownComboBox {...args}>
        <IdsHelper>
          <IdsHelperText>Helper text</IdsHelperText>
        </IdsHelper>
      </IdsDropdownComboBox>
    </div>
  ),
};

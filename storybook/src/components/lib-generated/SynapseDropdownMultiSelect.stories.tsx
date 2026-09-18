/**
 * Storybook: design-spec–generated Dropdown Multiselect from `lib/react/synapse/dropdown-multiselect`
 *
 * Anatomy: root → Label? → field + menu → Options/Option* → SynapseHelper? | SynapseError?
 * Badge + tooltip per Composition & API (`showSelectedBadge` / `showSelectedTooltip`).
 *
 * Theme: components/synapse-theme.css
 * Spec: components/synapse/dropdown-multiselect/design-spec.md
 */
import React, { useState, type ComponentProps, type CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/synapse-theme.css";
import {
  SYNAPSE_DROPDOWN_MULTISELECT_DOCS_DESCRIPTION,
  SYNAPSE_DROPDOWN_MULTISELECT_SOURCE_CODE,
} from "./synapse-dropdown-multiselect.developer-usage";
import {
  SynapseDropdownMultiSelect,
  SynapseDropdownMultiSelectOptions,
  SynapseDropdownMultiSelectOption,
  type SynapseDropdownMultiSelectOptionModel,
} from "@synapse/react/dropdown-multiselect";
import { SynapseError, SynapseErrorText } from "@synapse/react/error";
import { SynapseHelper, SynapseHelperText } from "@synapse/react/helper";

const DESIGN_SPEC_PATH = "components/synapse/dropdown-multiselect/design-spec.md";

const OPTIONS: SynapseDropdownMultiSelectOptionModel[] = Array.from(
  { length: 6 },
  (_, i) => ({ id: `${i + 1}`, label: `Option ${i + 1}` }),
);

const LONG_OPTIONS: SynapseDropdownMultiSelectOptionModel[] = Array.from(
  { length: 12 },
  (_, i) => ({ id: `l${i + 1}`, label: `Option ${i + 1}` }),
);

const SECTION_OPTIONS: SynapseDropdownMultiSelectOptionModel[] = [
  { id: "1", label: "Option 1" },
  { id: "2", label: "Option 2" },
  { id: "3", label: "Option 3" },
  { id: "h1", label: "Section Title", kind: "section" },
  { id: "4", label: "Option 4" },
  { id: "5", label: "Option 5" },
  { id: "6", label: "Option 6" },
];

const sampleWidth: CSSProperties = { width: 300, maxWidth: "100%" };

const meta: Meta<typeof SynapseDropdownMultiSelect> = {
  tags: ["autodocs"],
  title: "Components/Synapse/Dropdown/Multi Select",
  component: SynapseDropdownMultiSelect,
  parameters: {
    layout: "fullscreen",
    docs: {
      canvas: { sourceState: "open" },
      description: {
        component: SYNAPSE_DROPDOWN_MULTISELECT_DOCS_DESCRIPTION,
      },
      source: {
        type: "code",
        language: "tsx",
        code: SYNAPSE_DROPDOWN_MULTISELECT_SOURCE_CODE,
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ display: "flex", justifyContent: "center", padding: "120px 16px 32px" }}>
        <Story />
      </div>
    ),
  ],
  args: {
    size: "large",
    label: "Environment",
    required: true,
    placeholder: "Select",
    searchable: true,
    showSelectAllClearAll: true,
    showSelectedBadge: true,
    showSelectedTooltip: true,
    options: OPTIONS,
    defaultValue: ["1", "2"],
    menuWidth: "trigger",
  },
  argTypes: {
    size: { control: "select", options: ["large", "small"] },
    menuWidth: { control: "select", options: ["trigger", "content"] },
    showSelectAllClearAll: { control: "boolean" },
    showSelectedBadge: { control: "boolean" },
    showSelectedTooltip: { control: "boolean" },
    searchable: { control: "boolean" },
    disabled: { control: "boolean" },
    onChange: { action: "onChange" },
    onAction: { action: "onAction" },
    onOpenChange: { action: "onOpenChange" },
  },
};

export default meta;
type Story = StoryObj<typeof SynapseDropdownMultiSelect>;

export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  render: (args) => (
    <div style={sampleWidth}>
      <SynapseDropdownMultiSelect {...args} defaultOpen>
        <SynapseHelper>
          <SynapseHelperText>Helper text</SynapseHelperText>
        </SynapseHelper>
      </SynapseDropdownMultiSelect>
    </div>
  ),
};

export const CompositionalOptions: Story = {
  name: "Compositional Options",
  render: () => {
    const [value, setValue] = useState<string[]>(["1", "2"]);
    return (
      <div style={sampleWidth}>
        <SynapseDropdownMultiSelect
          size="large"
          label="Products"
          required
          searchable
          showSelectAllClearAll
          showSelectedBadge
          showSelectedTooltip
          value={value}
          onChange={setValue}
          defaultOpen
        >
          <SynapseDropdownMultiSelectOptions>
            <SynapseDropdownMultiSelectOption id="1" label="Option 1" />
            <SynapseDropdownMultiSelectOption id="2" label="Option 2" />
            <SynapseDropdownMultiSelectOption id="3" label="Option 3" />
            <SynapseDropdownMultiSelectOption id="4" label="Option 4" disabled />
            <SynapseDropdownMultiSelectOption id="5" label="Option 5" />
            <SynapseDropdownMultiSelectOption id="6" label="Option 6" />
          </SynapseDropdownMultiSelectOptions>
          <SynapseHelper>
            <SynapseHelperText>Choose one or more</SynapseHelperText>
          </SynapseHelper>
        </SynapseDropdownMultiSelect>
      </div>
    );
  },
};

/** Figma main scenarios (frame 43406:39370). */
export const MainScenarios: Story = {
  name: "Main Scenarios",
  render: () => {
    const [none, setNone] = useState<string[]>([]);
    const [visible, setVisible] = useState<string[]>(["1", "2", "5", "6"]);
    const [section, setSection] = useState<string[]>(["2"]);
    const [action, setAction] = useState<string[]>(["2"]);
    const [actionEvent, setActionEvent] = useState("None");

    return (
      <div style={{ width: 1350, display: "flex", gap: 18, flexWrap: "wrap", alignItems: "flex-start" }}>
        <div style={{ ...sampleWidth, display: "grid", gap: 6 }}>
          <div style={{ fontSize: 14, opacity: 0.7 }}>No items selected</div>
          <SynapseDropdownMultiSelect
            options={OPTIONS}
            value={none}
            onChange={setNone}
            showSelectAllClearAll
            showSelectedBadge
            showSelectedTooltip
            defaultOpen
          />
        </div>
        <div style={{ ...sampleWidth, display: "grid", gap: 6 }}>
          <div style={{ fontSize: 14, opacity: 0.7 }}>Items selected (badge)</div>
          <SynapseDropdownMultiSelect
            options={LONG_OPTIONS}
            value={visible}
            onChange={setVisible}
            searchable
            showSelectAllClearAll
            showSelectedBadge
            showSelectedTooltip
            defaultOpen
          />
        </div>
        <div style={{ ...sampleWidth, display: "grid", gap: 6 }}>
          <div style={{ fontSize: 14, opacity: 0.7 }}>Section header</div>
          <SynapseDropdownMultiSelect
            options={SECTION_OPTIONS}
            value={section}
            onChange={setSection}
            showSelectAllClearAll
            showSelectedBadge
            defaultOpen
          />
        </div>
        <div style={{ ...sampleWidth, display: "grid", gap: 6 }}>
          <div style={{ fontSize: 14, opacity: 0.7 }}>Action button</div>
          <SynapseDropdownMultiSelect
            options={LONG_OPTIONS}
            value={action}
            onChange={setAction}
            showSelectAllClearAll
            showSelectedBadge
            actionLabel="Action"
            onAction={() => setActionEvent("Action clicked")}
            defaultOpen
            maxVisibleItems={4}
          />
          <div style={{ fontSize: 12, color: "var(--color-text-gray-neutral)" }}>
            onAction: {actionEvent}
          </div>
        </div>
      </div>
    );
  },
};

export const SizeAndLabelMatrix: Story = {
  name: "Size & Label Matrix",
  render: () => (
    <div style={{ width: 760, display: "grid", gap: 24 }}>
      <SynapseDropdownMultiSelect
        size="large"
        label="Environment"
        required
        options={OPTIONS}
        defaultValue={["1", "2"]}
        showSelectAllClearAll
        showSelectedBadge
        fullWidth
        style={{ width: "100%" }}
      >
        <SynapseHelper>
          <SynapseHelperText>Large (40px)</SynapseHelperText>
        </SynapseHelper>
      </SynapseDropdownMultiSelect>
      <SynapseDropdownMultiSelect
        size="small"
        label="Environment"
        options={OPTIONS}
        defaultValue={["1", "2"]}
        showSelectAllClearAll
        showSelectedBadge
        fullWidth
        style={{ width: "100%" }}
      >
        <SynapseHelper>
          <SynapseHelperText>Small (32px)</SynapseHelperText>
        </SynapseHelper>
      </SynapseDropdownMultiSelect>
    </div>
  ),
};

export const DisabledAndErrorStates: Story = {
  name: "Disabled & Error",
  render: () => (
    <div style={{ width: 360, display: "grid", gap: 24 }}>
      <SynapseDropdownMultiSelect
        options={OPTIONS}
        defaultValue={["1"]}
        showSelectAllClearAll
        showSelectedBadge
        disabled
      >
        <SynapseHelper>
          <SynapseHelperText>Component is disabled</SynapseHelperText>
        </SynapseHelper>
      </SynapseDropdownMultiSelect>
      <SynapseDropdownMultiSelect options={OPTIONS} showSelectAllClearAll placeholder="Select">
        <SynapseError>
          <SynapseErrorText>Error message</SynapseErrorText>
        </SynapseError>
      </SynapseDropdownMultiSelect>
    </div>
  ),
};

export const Playground: Story = {
  name: "Playground",
  render: (args: ComponentProps<typeof SynapseDropdownMultiSelect>) => (
    <div style={sampleWidth}>
      <SynapseDropdownMultiSelect {...args}>
        <SynapseHelper>
          <SynapseHelperText>Helper text</SynapseHelperText>
        </SynapseHelper>
      </SynapseDropdownMultiSelect>
    </div>
  ),
};

/**
 * Storybook: design-spec–generated Dropdown Single-select from `lib/react/synapse/dropdown-single-select`
 *
 * Anatomy: root → Label? → field + menu → Options/Option* → SynapseHelper? | SynapseError?
 *
 * Theme: components/synapse-theme.css
 * Spec: components/synapse/dropdown-single-select/design-spec.md
 */
import React, { useState, type ComponentProps, type CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/synapse-theme.css";
import {
  SYNAPSE_DROPDOWN_SINGLE_SELECT_DOCS_DESCRIPTION,
  SYNAPSE_DROPDOWN_SINGLE_SELECT_SOURCE_CODE,
} from "./synapse-dropdown-single-select.developer-usage";
import {
  SynapseDropdownSingleSelect,
  SynapseDropdownSingleSelectOptions,
  SynapseDropdownSingleSelectOption,
  type SynapseDropdownSingleSelectOptionModel,
} from "@synapse/react/dropdown-single-select";
import { SynapseError, SynapseErrorText } from "@synapse/react/error";
import { SynapseHelper, SynapseHelperText } from "@synapse/react/helper";

const DESIGN_SPEC_PATH = "components/synapse/dropdown-single-select/design-spec.md";

const OPTIONS: SynapseDropdownSingleSelectOptionModel[] = [
  { id: "1", label: "Option 1" },
  { id: "2", label: "Option 2" },
  { id: "3", label: "Option 3" },
  { id: "4", label: "Option 4" },
  { id: "5", label: "Option 5" },
];

const OVERFLOW_OPTIONS: SynapseDropdownSingleSelectOptionModel[] = Array.from(
  { length: 12 },
  (_, i) => ({ id: `o${i + 1}`, label: `Option ${i + 1}` }),
);

const SECTION_OPTIONS: SynapseDropdownSingleSelectOptionModel[] = [
  { id: "h1", label: "Section Title", kind: "section" },
  { id: "a1", label: "Option 1" },
  { id: "a2", label: "Option 2" },
  { id: "a3", label: "Option 3" },
  { id: "h2", label: "Section Title", kind: "section" },
  { id: "b1", label: "Option 4" },
  { id: "b2", label: "Option 5" },
  { id: "b3", label: "Option 6" },
];

const sampleWidth: CSSProperties = { width: 300, maxWidth: "100%" };

const meta: Meta<typeof SynapseDropdownSingleSelect> = {
  tags: ["autodocs"],
  title: "Components/Synapse/Dropdown/Single Select",
  component: SynapseDropdownSingleSelect,
  parameters: {
    layout: "fullscreen",
    docs: {
      canvas: { sourceState: "open" },
      description: {
        component: SYNAPSE_DROPDOWN_SINGLE_SELECT_DOCS_DESCRIPTION,
      },
      source: {
        type: "code",
        language: "tsx",
        code: SYNAPSE_DROPDOWN_SINGLE_SELECT_SOURCE_CODE,
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
    searchable: false,
    showRadio: true,
    showClearAll: true,
    options: OPTIONS,
    defaultValue: "2",
    menuWidth: "trigger",
  },
  argTypes: {
    size: { control: "select", options: ["large", "small"] },
    menuWidth: { control: "select", options: ["trigger", "content"] },
    showRadio: { control: "boolean" },
    showClearAll: { control: "boolean" },
    searchable: { control: "boolean" },
    disabled: { control: "boolean" },
    onChange: { action: "onChange" },
    onAction: { action: "onAction" },
    onOpenChange: { action: "onOpenChange" },
  },
};

export default meta;
type Story = StoryObj<typeof SynapseDropdownSingleSelect>;

export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  render: (args) => (
    <div style={sampleWidth}>
      <SynapseDropdownSingleSelect {...args} defaultOpen>
        <SynapseHelper>
          <SynapseHelperText>Helper text</SynapseHelperText>
        </SynapseHelper>
      </SynapseDropdownSingleSelect>
    </div>
  ),
};

export const CompositionalOptions: Story = {
  name: "Compositional Options",
  render: () => {
    const [value, setValue] = useState("2");
    return (
      <div style={sampleWidth}>
        <SynapseDropdownSingleSelect
          size="large"
          label="Product"
          required
          showRadio
          showClearAll
          value={value}
          onChange={setValue}
          defaultOpen
        >
          <SynapseDropdownSingleSelectOptions>
            <SynapseDropdownSingleSelectOption id="1" label="Option 1" />
            <SynapseDropdownSingleSelectOption id="2" label="Option 2" />
            <SynapseDropdownSingleSelectOption id="3" label="Option 3" />
            <SynapseDropdownSingleSelectOption id="4" label="Option 4" disabled />
          </SynapseDropdownSingleSelectOptions>
          <SynapseHelper>
            <SynapseHelperText>Choose one option</SynapseHelperText>
          </SynapseHelper>
        </SynapseDropdownSingleSelect>
      </div>
    );
  },
};

/** Figma main scenarios: small / overflow / section / action (frame 43264:181428). */
export const MainScenarios: Story = {
  name: "Main Scenarios",
  render: () => {
    const [small, setSmall] = useState("2");
    const [overflow, setOverflow] = useState("2");
    const [section, setSection] = useState("a2");
    const [action, setAction] = useState("2");
    const [actionEvent, setActionEvent] = useState("None");

    return (
      <div style={{ width: 1300, display: "flex", gap: 18, flexWrap: "wrap", alignItems: "flex-start" }}>
        <div style={{ ...sampleWidth, display: "grid", gap: 6 }}>
          <div style={{ fontSize: 14, opacity: 0.7 }}>Small menu</div>
          <SynapseDropdownSingleSelect
            options={[
              { id: "1", label: "Option 1" },
              { id: "2", label: "Option 2" },
              { id: "3", label: "Option 3", disabled: true },
              { id: "4", label: "Option 4" },
              { id: "5", label: "Option 5" },
            ]}
            value={small}
            onChange={setSmall}
            showRadio
            showClearAll
            defaultOpen
          />
        </div>
        <div style={{ ...sampleWidth, display: "grid", gap: 6 }}>
          <div style={{ fontSize: 14, opacity: 0.7 }}>Overflowing menu</div>
          <SynapseDropdownSingleSelect
            options={OVERFLOW_OPTIONS}
            value={overflow}
            onChange={setOverflow}
            showRadio
            defaultOpen
          />
        </div>
        <div style={{ ...sampleWidth, display: "grid", gap: 6 }}>
          <div style={{ fontSize: 14, opacity: 0.7 }}>Section header</div>
          <SynapseDropdownSingleSelect
            options={SECTION_OPTIONS}
            value={section}
            onChange={setSection}
            showRadio
            defaultOpen
          />
        </div>
        <div style={{ ...sampleWidth, display: "grid", gap: 6 }}>
          <div style={{ fontSize: 14, opacity: 0.7 }}>Action button</div>
          <SynapseDropdownSingleSelect
            options={OVERFLOW_OPTIONS}
            value={action}
            onChange={setAction}
            showRadio
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
      <SynapseDropdownSingleSelect
        size="large"
        label="Environment"
        required
        options={OPTIONS}
        defaultValue="2"
        showRadio
        fullWidth
        style={{ width: "100%" }}
      >
        <SynapseHelper>
          <SynapseHelperText>Large (40px)</SynapseHelperText>
        </SynapseHelper>
      </SynapseDropdownSingleSelect>
      <SynapseDropdownSingleSelect
        size="small"
        label="Environment"
        options={OPTIONS}
        defaultValue="2"
        showRadio
        fullWidth
        style={{ width: "100%" }}
      >
        <SynapseHelper>
          <SynapseHelperText>Small (32px)</SynapseHelperText>
        </SynapseHelper>
      </SynapseDropdownSingleSelect>
    </div>
  ),
};

export const DisabledAndErrorStates: Story = {
  name: "Disabled & Error",
  render: () => (
    <div style={{ width: 360, display: "grid", gap: 24 }}>
      <SynapseDropdownSingleSelect
        options={OPTIONS}
        defaultValue="1"
        showRadio
        disabled
      >
        <SynapseHelper>
          <SynapseHelperText>Component is disabled</SynapseHelperText>
        </SynapseHelper>
      </SynapseDropdownSingleSelect>
      <SynapseDropdownSingleSelect options={OPTIONS} showRadio placeholder="Select">
        <SynapseError>
          <SynapseErrorText>Error message</SynapseErrorText>
        </SynapseError>
      </SynapseDropdownSingleSelect>
    </div>
  ),
};

export const Playground: Story = {
  name: "Playground",
  render: (args: ComponentProps<typeof SynapseDropdownSingleSelect>) => (
    <div style={sampleWidth}>
      <SynapseDropdownSingleSelect {...args}>
        <SynapseHelper>
          <SynapseHelperText>Helper text</SynapseHelperText>
        </SynapseHelper>
      </SynapseDropdownSingleSelect>
    </div>
  ),
};

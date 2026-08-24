/**
 * Storybook: design-spec–generated Dropdown Multiselect from `lib/react/ids/dropdown-multiselect`
 *
 * Anatomy: root → Label? → field + menu → Options/Option* → IdsHelper? | IdsError?
 * Badge + tooltip per Composition & API (`showSelectedBadge` / `showSelectedTooltip`).
 *
 * Theme: components/ids-theme.css
 * Spec: components/ids/dropdown-multiselect/design-spec.md
 */
import React, { useState, type ComponentProps, type CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/ids-theme.css";
import {
  IdsDropdownMultiSelect,
  IdsDropdownMultiSelectOptions,
  IdsDropdownMultiSelectOption,
  type IdsDropdownMultiSelectOptionModel,
} from "../../../../lib/react/ids/dropdown-multiselect";
import { IdsError, IdsErrorText } from "../../../../lib/react/ids/error";
import { IdsHelper, IdsHelperText } from "../../../../lib/react/ids/helper";

const DESIGN_SPEC_PATH = "components/ids/dropdown-multiselect/design-spec.md";

const OPTIONS: IdsDropdownMultiSelectOptionModel[] = Array.from(
  { length: 6 },
  (_, i) => ({ id: `${i + 1}`, label: `Option ${i + 1}` }),
);

const LONG_OPTIONS: IdsDropdownMultiSelectOptionModel[] = Array.from(
  { length: 12 },
  (_, i) => ({ id: `l${i + 1}`, label: `Option ${i + 1}` }),
);

const SECTION_OPTIONS: IdsDropdownMultiSelectOptionModel[] = [
  { id: "1", label: "Option 1" },
  { id: "2", label: "Option 2" },
  { id: "3", label: "Option 3" },
  { id: "h1", label: "Section Title", kind: "section" },
  { id: "4", label: "Option 4" },
  { id: "5", label: "Option 5" },
  { id: "6", label: "Option 6" },
];

const sampleWidth: CSSProperties = { width: 300, maxWidth: "100%" };

const meta: Meta<typeof IdsDropdownMultiSelect> = {
  title: "Components/IDS/Dropdown/Multi Select",
  component: IdsDropdownMultiSelect,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          `React IDS Dropdown Multiselect from \`${DESIGN_SPEC_PATH}\`. ` +
          "Anatomy: container → field/menu → options/option*; optional `IdsHelper` or `IdsError`. " +
          "Theme: `components/ids-theme.css`.",
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
type Story = StoryObj<typeof IdsDropdownMultiSelect>;

export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  render: (args) => (
    <div style={sampleWidth}>
      <IdsDropdownMultiSelect {...args} defaultOpen>
        <IdsHelper>
          <IdsHelperText>Helper text</IdsHelperText>
        </IdsHelper>
      </IdsDropdownMultiSelect>
    </div>
  ),
};

export const CompositionalOptions: Story = {
  name: "Compositional Options",
  render: () => {
    const [value, setValue] = useState<string[]>(["1", "2"]);
    return (
      <div style={sampleWidth}>
        <IdsDropdownMultiSelect
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
          <IdsDropdownMultiSelectOptions>
            <IdsDropdownMultiSelectOption id="1" label="Option 1" />
            <IdsDropdownMultiSelectOption id="2" label="Option 2" />
            <IdsDropdownMultiSelectOption id="3" label="Option 3" />
            <IdsDropdownMultiSelectOption id="4" label="Option 4" disabled />
            <IdsDropdownMultiSelectOption id="5" label="Option 5" />
            <IdsDropdownMultiSelectOption id="6" label="Option 6" />
          </IdsDropdownMultiSelectOptions>
          <IdsHelper>
            <IdsHelperText>Choose one or more</IdsHelperText>
          </IdsHelper>
        </IdsDropdownMultiSelect>
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
          <IdsDropdownMultiSelect
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
          <IdsDropdownMultiSelect
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
          <IdsDropdownMultiSelect
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
          <IdsDropdownMultiSelect
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
      <IdsDropdownMultiSelect
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
        <IdsHelper>
          <IdsHelperText>Large (40px)</IdsHelperText>
        </IdsHelper>
      </IdsDropdownMultiSelect>
      <IdsDropdownMultiSelect
        size="small"
        label="Environment"
        options={OPTIONS}
        defaultValue={["1", "2"]}
        showSelectAllClearAll
        showSelectedBadge
        fullWidth
        style={{ width: "100%" }}
      >
        <IdsHelper>
          <IdsHelperText>Small (32px)</IdsHelperText>
        </IdsHelper>
      </IdsDropdownMultiSelect>
    </div>
  ),
};

export const DisabledAndErrorStates: Story = {
  name: "Disabled & Error",
  render: () => (
    <div style={{ width: 360, display: "grid", gap: 24 }}>
      <IdsDropdownMultiSelect
        options={OPTIONS}
        defaultValue={["1"]}
        showSelectAllClearAll
        showSelectedBadge
        disabled
      >
        <IdsHelper>
          <IdsHelperText>Component is disabled</IdsHelperText>
        </IdsHelper>
      </IdsDropdownMultiSelect>
      <IdsDropdownMultiSelect options={OPTIONS} showSelectAllClearAll placeholder="Select">
        <IdsError>
          <IdsErrorText>Error message</IdsErrorText>
        </IdsError>
      </IdsDropdownMultiSelect>
    </div>
  ),
};

export const Playground: Story = {
  name: "Playground",
  render: (args: ComponentProps<typeof IdsDropdownMultiSelect>) => (
    <div style={sampleWidth}>
      <IdsDropdownMultiSelect {...args}>
        <IdsHelper>
          <IdsHelperText>Helper text</IdsHelperText>
        </IdsHelper>
      </IdsDropdownMultiSelect>
    </div>
  ),
};

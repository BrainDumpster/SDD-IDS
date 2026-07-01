import "../../../components/synapse-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { IdsBadge } from "./IdsBadge";
import {
  SynapseDropdown,
  SynapseDropdownMenu,
  SynapseDropdownMenuFooter,
  SynapseDropdownMenuGroup,
  SynapseDropdownMenuItem,
  SynapseDropdownError,
  SynapseDropdownHelper,
  SynapseDropdownTriggerShell,
} from "./SynapseDropdown";
import { SynapseTooltip } from "./SynapseTooltip";
import {
  SYNAPSE_DROPDOWN_MULTISELECT_IDS_BASELINE_SPEC_PATH,
  SYNAPSE_DROPDOWN_MULTISELECT_MAIN_NODE_ID,
} from "../spec-contracts/synapse-dropdown-multiselect.contract";
import {
  SYNAPSE_DROPDOWN_DOCS_DESCRIPTION,
  SYNAPSE_DROPDOWN_STORY_SOURCE,
} from "./synapse-dropdown.developer-usage";

type Size = "small" | "large";

function MultiSelectTrigger({
  placeholder = "-Select-",
  selectedLabels = [],
  size = "large",
  disabled = false,
  error = false,
  hideSelectionList = false,
  showSelectedBadge = true,
  hover = false,
  focusVisible = false,
}: {
  placeholder?: string;
  selectedLabels?: string[];
  size?: Size;
  disabled?: boolean;
  error?: boolean;
  hideSelectionList?: boolean;
  showSelectedBadge?: boolean;
  hover?: boolean;
  focusVisible?: boolean;
}) {
  const selectedCount = selectedLabels.length;
  const showBadge = showSelectedBadge && selectedCount > 0;
  const listText =
    selectedCount === 0
      ? placeholder
      : hideSelectionList
        ? "Items selected"
        : selectedLabels.join(", ");

  return (
    <SynapseDropdownTriggerShell
      size={size}
      disabled={disabled}
      error={error}
      hover={hover}
      focusVisible={focusVisible}
      left={
        <>
          {showBadge ? (
            <SynapseTooltip
              side="top"
              align="start"
              title={`${selectedCount} Items`}
              content={`Display a comma separated list of items. Selected: ${selectedLabels.join(", ")}`}
              showArrow
            >
              <span style={{ display: "inline-flex" }}>
                <IdsBadge value={selectedCount} type={disabled ? "disabled" : "controls"} />
              </span>
            </SynapseTooltip>
          ) : null}
          <span
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              flex: "1 1 auto",
              minWidth: 0,
            }}
          >
            {listText}
          </span>
        </>
      }
    />
  );
}

function getAllEnabledLabels(options: { label: string; disabled?: boolean }[]) {
  return options.filter((option) => !option.disabled).map((option) => option.label);
}

function getSelectAllState(options: { label: string; disabled?: boolean }[], selected: string[]) {
  const enabled = getAllEnabledLabels(options);
  const selectedEnabledCount = enabled.filter((label) => selected.includes(label)).length;
  return {
    checked: enabled.length > 0 && selectedEnabledCount === enabled.length,
    indeterminate: selectedEnabledCount > 0 && selectedEnabledCount < enabled.length,
  };
}

const meta: Meta<typeof SynapseDropdown> = {
  title: "Spec Generated/Synapse/Dropdown/Multi Select",
  component: SynapseDropdown,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      canvas: { sourceState: "open" },
      description: {
        component: [
          SYNAPSE_DROPDOWN_DOCS_DESCRIPTION,
          `IDS baseline: \`${SYNAPSE_DROPDOWN_MULTISELECT_IDS_BASELINE_SPEC_PATH}\`.`,
          `Figma set: \`${SYNAPSE_DROPDOWN_MULTISELECT_MAIN_NODE_ID}\`.`,
        ].join("\n\n"),
      },
      source: { type: "code", language: "tsx", code: SYNAPSE_DROPDOWN_STORY_SOURCE },
    },
  },
};

export default meta;
type Story = StoryObj<typeof SynapseDropdown>;

function MultiSelectMenuItems({ count }: { count: number }) {
  return Array.from({ length: count }, (_, i) => (
    <SynapseDropdownMenuItem key={i} value={`Option ${i + 1}`} label={`Option ${i + 1}`} />
  ));
}

export const CompositionApi: Story = {
  name: "Composition API",
  render: () => {
    const [smallSelected, setSmallSelected] = useState<string[]>([]);
    const [visibleSelected, setVisibleSelected] = useState<string[]>([
      "Option 1",
      "Option 2",
      "Option 5",
      "Option 6",
    ]);
    const [hiddenSelected, setHiddenSelected] = useState<string[]>([
      "Option 1",
      "Option 2",
      "Option 5",
      "Option 6",
    ]);
    const [sectionSelected, setSectionSelected] = useState<string[]>(["Option 2"]);
    const [actionSelected, setActionSelected] = useState<string[]>(["Option 2"]);
    const [actionEvent, setActionEvent] = useState("None");

    const smallOptions = Array.from({ length: 6 }, (_, i) => ({ label: `Option ${i + 1}` }));
    const longOptions = Array.from({ length: 12 }, (_, i) => ({ label: `Option ${i + 1}` }));
    const sectionOptions = Array.from({ length: 6 }, (_, i) => ({ label: `Option ${i + 1}` }));

    const renderMultiMenu = (
      selected: string[],
      setSelected: (next: string[]) => void,
      options: { label: string; disabled?: boolean }[],
      extra?: { footer?: boolean; maxHeight?: number },
    ) => {
      const state = getSelectAllState(options, selected);
      return (
        <SynapseDropdownMenu
          defaultOpen
          maxHeight={extra?.maxHeight ?? 220}
          showSelectAllClearAll
          selectAllChecked={state.checked}
          selectAllIndeterminate={state.indeterminate}
          onSelectAllClick={() => setSelected(getAllEnabledLabels(options))}
          onClearAllClick={() => setSelected([])}
          clearAllDisabled={selected.length === 0}
          footerActionLabel={extra?.footer ? "Action" : undefined}
          onFooterActionClick={extra?.footer ? () => setActionEvent("Action clicked") : undefined}
        >
          <MultiSelectTrigger selectedLabels={selected} />
          <MultiSelectMenuItems count={options.length} />
        </SynapseDropdownMenu>
      );
    };

    return (
      <div style={{ width: 1350, display: "grid", gap: 16 }}>
        <a href="#" style={{ fontSize: 16, lineHeight: "24px", color: "var(--color-text-brand-base)" }}>
          Learn how to align form elements.
        </a>
        <div style={{ display: "flex", gap: 18, alignItems: "flex-start", flexWrap: "wrap" }}>
          <div style={{ width: 300, display: "grid", gap: 6 }}>
            <div style={{ color: "var(--annotation)", fontSize: 24, lineHeight: "32px" }}>No items selected</div>
            <SynapseDropdown mode="multi-select" values={smallSelected} onValuesChange={setSmallSelected}>
              {renderMultiMenu(smallSelected, setSmallSelected, smallOptions)}
            </SynapseDropdown>
          </div>

          <div style={{ width: 300, display: "grid", gap: 6 }}>
            <div style={{ color: "var(--annotation)", fontSize: 24, lineHeight: "32px" }}>
              Items selected and selection list is visible
            </div>
            <SynapseDropdown mode="multi-select" values={visibleSelected} onValuesChange={setVisibleSelected}>
              <SynapseDropdownMenu
                defaultOpen
                maxHeight={220}
                showSelectAllClearAll
                selectAllChecked={getSelectAllState(longOptions, visibleSelected).checked}
                selectAllIndeterminate={getSelectAllState(longOptions, visibleSelected).indeterminate}
                onSelectAllClick={() => setVisibleSelected(getAllEnabledLabels(longOptions))}
                onClearAllClick={() => setVisibleSelected([])}
                clearAllDisabled={visibleSelected.length === 0}
              >
                <MultiSelectTrigger selectedLabels={visibleSelected} />
                <MultiSelectMenuItems count={12} />
              </SynapseDropdownMenu>
            </SynapseDropdown>
          </div>

          <div style={{ width: 300, display: "grid", gap: 6 }}>
            <div style={{ color: "var(--annotation)", fontSize: 24, lineHeight: "32px" }}>
              Items selected and selection list is hidden
            </div>
            <SynapseDropdown mode="multi-select" values={hiddenSelected} onValuesChange={setHiddenSelected}>
              <SynapseDropdownMenu
                defaultOpen
                maxHeight={220}
                showSelectAllClearAll
                selectAllChecked={getSelectAllState(longOptions, hiddenSelected).checked}
                selectAllIndeterminate={getSelectAllState(longOptions, hiddenSelected).indeterminate}
                onSelectAllClick={() => setHiddenSelected(getAllEnabledLabels(longOptions))}
                onClearAllClick={() => setHiddenSelected([])}
                clearAllDisabled={hiddenSelected.length === 0}
              >
                <MultiSelectTrigger selectedLabels={hiddenSelected} hideSelectionList />
                <MultiSelectMenuItems count={12} />
              </SynapseDropdownMenu>
            </SynapseDropdown>
          </div>

          <div style={{ width: 300, display: "grid", gap: 6 }}>
            <div style={{ color: "var(--annotation)", fontSize: 24, lineHeight: "32px" }}>Section headers</div>
            <SynapseDropdown mode="multi-select" values={sectionSelected} onValuesChange={setSectionSelected}>
              <SynapseDropdownMenu
                defaultOpen
                maxHeight={220}
                showSelectAllClearAll
                selectAllChecked={getSelectAllState(sectionOptions, sectionSelected).checked}
                selectAllIndeterminate={getSelectAllState(sectionOptions, sectionSelected).indeterminate}
                onSelectAllClick={() => setSectionSelected(getAllEnabledLabels(sectionOptions))}
                onClearAllClick={() => setSectionSelected([])}
                clearAllDisabled={sectionSelected.length === 0}
              >
                <MultiSelectTrigger selectedLabels={sectionSelected} />
                <SynapseDropdownMenuGroup groupName="Section Title">
                  <SynapseDropdownMenuItem value="Option 1" label="Option 1" />
                  <SynapseDropdownMenuItem value="Option 2" label="Option 2" />
                  <SynapseDropdownMenuItem value="Option 3" label="Option 3" />
                </SynapseDropdownMenuGroup>
                <SynapseDropdownMenuGroup groupName="Section Title">
                  <SynapseDropdownMenuItem value="Option 4" label="Option 4" />
                  <SynapseDropdownMenuItem value="Option 5" label="Option 5" />
                  <SynapseDropdownMenuItem value="Option 6" label="Option 6" />
                </SynapseDropdownMenuGroup>
              </SynapseDropdownMenu>
            </SynapseDropdown>
          </div>

          <div style={{ width: 300, display: "grid", gap: 6 }}>
            <div style={{ color: "var(--annotation)", fontSize: 24, lineHeight: "32px" }}>Action button</div>
            <SynapseDropdown mode="multi-select" values={actionSelected} onValuesChange={setActionSelected}>
              <SynapseDropdownMenu
                defaultOpen
                maxHeight={180}
                showSelectAllClearAll
                selectAllChecked={getSelectAllState(longOptions, actionSelected).checked}
                selectAllIndeterminate={getSelectAllState(longOptions, actionSelected).indeterminate}
                onSelectAllClick={() => setActionSelected(getAllEnabledLabels(longOptions))}
                onClearAllClick={() => setActionSelected([])}
                clearAllDisabled={actionSelected.length === 0}
              >
                <MultiSelectTrigger selectedLabels={actionSelected} />
                <MultiSelectMenuItems count={12} />
                <SynapseDropdownMenuFooter actionLabel="Action" onAction={() => setActionEvent("Action clicked")} />
              </SynapseDropdownMenu>
              <SynapseDropdownHelper>onActionClick: {actionEvent}</SynapseDropdownHelper>
            </SynapseDropdown>
          </div>
        </div>
      </div>
    );
  },
};

export const StatesAndDetails: Story = {
  render: () => {
    const [selected, setSelected] = useState<string[]>(["Option 1", "Option 2", "Option 5", "Option 6"]);
    const options = [
      { label: "Option 1" },
      { label: "Option 2" },
      { label: "Option 3", disabled: true },
      { label: "Option 4" },
      { label: "Option 5" },
      { label: "Option 6" },
    ];
    const selectAll = getSelectAllState(options, selected);

    const menuProps = {
      showSelectAllClearAll: true as const,
      selectAllChecked: selectAll.checked,
      selectAllIndeterminate: selectAll.indeterminate,
      onSelectAllClick: () => setSelected(getAllEnabledLabels(options)),
      onClearAllClick: () => setSelected([]),
      clearAllDisabled: selected.length === 0,
    };

    return (
      <div style={{ width: 980, display: "grid", gap: 16 }}>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "flex-start" }}>
          <SynapseDropdown mode="multi-select" values={selected} onValuesChange={setSelected}>
            <SynapseDropdownMenu {...menuProps}>
              <MultiSelectTrigger selectedLabels={[]} size="large" hover />
              {options.map((option) => (
                <SynapseDropdownMenuItem
                  key={option.label}
                  value={option.label}
                  label={option.label}
                  disabled={option.disabled}
                />
              ))}
            </SynapseDropdownMenu>
          </SynapseDropdown>
          <SynapseDropdown mode="multi-select" values={selected} onValuesChange={setSelected}>
            <SynapseDropdownMenu {...menuProps}>
              <MultiSelectTrigger selectedLabels={selected} size="small" focusVisible />
              {options.map((option) => (
                <SynapseDropdownMenuItem
                  key={option.label}
                  value={option.label}
                  label={option.label}
                  disabled={option.disabled}
                />
              ))}
            </SynapseDropdownMenu>
          </SynapseDropdown>
        </div>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <SynapseDropdown mode="multi-select" values={selected} onValuesChange={setSelected} disabled>
            <SynapseDropdownMenu {...menuProps} disabled>
              <MultiSelectTrigger selectedLabels={selected} disabled />
              {options.map((option) => (
                <SynapseDropdownMenuItem
                  key={option.label}
                  value={option.label}
                  label={option.label}
                  disabled={option.disabled}
                />
              ))}
            </SynapseDropdownMenu>
            <SynapseDropdownHelper>Helper text</SynapseDropdownHelper>
          </SynapseDropdown>
          <SynapseDropdown mode="multi-select" values={selected} onValuesChange={setSelected}>
            <SynapseDropdownMenu {...menuProps}>
              <MultiSelectTrigger selectedLabels={selected} error />
              {options.map((option) => (
                <SynapseDropdownMenuItem
                  key={option.label}
                  value={option.label}
                  label={option.label}
                  disabled={option.disabled}
                />
              ))}
            </SynapseDropdownMenu>
            <SynapseDropdownError>Error message</SynapseDropdownError>
          </SynapseDropdown>
        </div>
      </div>
    );
  },
};

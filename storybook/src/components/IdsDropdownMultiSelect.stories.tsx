import "../../../components/ids-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import { useMemo, useState } from "react";
import { IdsBadge } from "./IdsBadge";
import { DropdownMenu } from "./DropdownMenu";
import { IdsTooltip } from "./IdsTooltip";
import { IdsDropdownTriggerShell } from "./IdsDropdownTriggerShell";
import statusCriticalSquareSolidIcon from "../../../assets/icons/status-critical-square-solid.svg";

type Size = "small" | "large";
type Option = { id: string; label: string; disabled?: boolean };

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
  const listText = selectedCount === 0
    ? placeholder
    : hideSelectionList
      ? "Items selected"
      : selectedLabels.join(", ");

  return (
    <IdsDropdownTriggerShell
      size={size}
      disabled={disabled}
      error={error}
      hover={hover}
      focusVisible={focusVisible}
      filled={selectedCount > 0}
      left={
        <>
          {showBadge ? (
            <span style={{ display: "inline-flex", flexShrink: 0 }}>
              <IdsTooltip
                side="top"
                align="start"
                title={`${selectedCount} Items`}
                content={`Display a comma separated list of items. Selected: ${selectedLabels.join(", ")}`}
              >
                <span style={{ display: "inline-flex" }}>
                  <IdsBadge value={selectedCount} type={disabled ? "disabled" : "controls"} />
                </span>
              </IdsTooltip>
            </span>
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

const meta: Meta<typeof DropdownMenu> = {
  title: "Components/IDS/Dropdown/Multi Select",
  component: DropdownMenu,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      // Headroom above the trigger so the badge tooltip (side="top") points UP
      // instead of Base UI flipping it below onto the open menu.
      <div style={{ display: "flex", justifyContent: "center", padding: "120px 16px 32px" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof DropdownMenu>;

function useMultiItems(
  options: Option[],
  selected: string[],
  setSelected: (next: string[]) => void
) {
  return options.map((option) => ({
    id: option.id,
    value: option.label,
    label: option.label,
    selectable: true,
    disabled: option.disabled,
    onClick: () => {
      if (option.disabled) return;
      const next = selected.includes(option.label)
        ? selected.filter((value) => value !== option.label)
        : [...selected, option.label];
      setSelected(next);
    },
  }));
}

function getAllEnabledLabels(options: Option[]) {
  return options.filter((option) => !option.disabled).map((option) => option.label);
}

function getSelectAllState(options: Option[], selected: string[]) {
  const enabled = getAllEnabledLabels(options);
  const selectedEnabledCount = enabled.filter((label) => selected.includes(label)).length;
  return {
    checked: enabled.length > 0 && selectedEnabledCount === enabled.length,
    indeterminate: selectedEnabledCount > 0 && selectedEnabledCount < enabled.length,
  };
}

export const MainScenarios: Story = {
  render: () => {
    const [smallSelected, setSmallSelected] = useState<string[]>([]);
    const [visibleSelected, setVisibleSelected] = useState<string[]>(["Option 1", "Option 2", "Option 5", "Option 6"]);
    const [hiddenSelected, setHiddenSelected] = useState<string[]>(["Option 1", "Option 2", "Option 5", "Option 6"]);
    const [sectionSelected, setSectionSelected] = useState<string[]>(["Option 2"]);
    const [actionSelected, setActionSelected] = useState<string[]>(["Option 2"]);
    const [actionEvent, setActionEvent] = useState("None");
    const [visibleSearch, setVisibleSearch] = useState("");
    const [hiddenSearch, setHiddenSearch] = useState("");

    const smallOptions = Array.from({ length: 6 }, (_, i) => ({ id: `s-${i + 1}`, label: `Option ${i + 1}` }));
    const longOptions = Array.from({ length: 12 }, (_, i) => ({ id: `l-${i + 1}`, label: `Option ${i + 1}` }));
    const sectionOptions = [
      { id: "sec-1", label: "Option 1" },
      { id: "sec-2", label: "Option 2" },
      { id: "sec-3", label: "Option 3" },
      { id: "sec-4", label: "Option 4" },
      { id: "sec-5", label: "Option 5" },
      { id: "sec-6", label: "Option 6" },
    ];
    const sectionItems = [
      ...useMultiItems(
        [
          { id: "sec-1", label: "Option 1" },
          { id: "sec-2", label: "Option 2" },
          { id: "sec-3", label: "Option 3" },
        ],
        sectionSelected,
        setSectionSelected
      ),
      { id: "h-1", label: "Section Title", kind: "section" as const },
      ...useMultiItems(
        [
          { id: "sec-4", label: "Option 4" },
          { id: "sec-5", label: "Option 5" },
          { id: "sec-6", label: "Option 6" },
        ],
        sectionSelected,
        setSectionSelected
      ),
    ];

    return (
      <div style={{ width: 1350, display: "grid", gap: 16 }}>
        <a href="#" style={{ fontSize: 16, lineHeight: "24px", color: "var(--color-text-brand-base)" }}>
          Learn how to align form elements.
        </a>
        <div style={{ display: "flex", gap: 18, alignItems: "flex-start", flexWrap: "wrap" }}>
          <div style={{ width: 300, display: "grid", gap: 6 }}>
            <div style={{ color: "var(--annotation)", fontSize: 24, lineHeight: "32px" }}>No items selected</div>
            <DropdownMenu
              trigger={<MultiSelectTrigger selectedLabels={smallSelected} />}
              items={useMultiItems(smallOptions, smallSelected, setSmallSelected)}
              selectionMode="multi"
              selectedValues={smallSelected}
              showSelectAllClearAll
              selectAllChecked={getSelectAllState(smallOptions, smallSelected).checked}
              selectAllIndeterminate={getSelectAllState(smallOptions, smallSelected).indeterminate}
              onSelectAllClick={(visible) => { const scope = visible ?? getAllEnabledLabels(smallOptions); setSmallSelected((prev) => { const allSelected = scope.every((label) => prev.includes(label)); return allSelected ? prev.filter((label) => !scope.includes(label)) : Array.from(new Set([...prev, ...scope])); }); }}
              onClearAllClick={() => setSmallSelected([])}
              clearAllDisabled={smallSelected.length === 0}
              defaultOpen
            />
          </div>

          <div style={{ width: 300, display: "grid", gap: 6 }}>
            <div style={{ color: "var(--annotation)", fontSize: 24, lineHeight: "32px" }}>Items selected with Show Selected panel</div>
            <DropdownMenu
              trigger={<MultiSelectTrigger selectedLabels={visibleSelected} />}
              items={useMultiItems(longOptions, visibleSelected, setVisibleSelected)}
              selectionMode="multi"
              selectedValues={visibleSelected}
              showSearch
              searchValue={visibleSearch}
              onSearchValueChange={setVisibleSearch}
              showSelectAllClearAll
              selectAllChecked={getSelectAllState(longOptions, visibleSelected).checked}
              selectAllIndeterminate={getSelectAllState(longOptions, visibleSelected).indeterminate}
              onSelectAllClick={(visible) => { const scope = visible ?? getAllEnabledLabels(longOptions); setVisibleSelected((prev) => { const allSelected = scope.every((label) => prev.includes(label)); return allSelected ? prev.filter((label) => !scope.includes(label)) : Array.from(new Set([...prev, ...scope])); }); }}
              onClearAllClick={() => setVisibleSelected([])}
              clearAllDisabled={visibleSelected.length === 0}
              showSelectedPanel
              defaultShowSelectedExpanded={false}
              onRemoveSelectedTag={(value) =>
                setVisibleSelected((prev) => prev.filter((entry) => entry !== value))
              }
              onShowSelectedPanelClear={() => setVisibleSelected([])}
              defaultOpen
            />
          </div>

          <div style={{ width: 300, display: "grid", gap: 6 }}>
            <div style={{ color: "var(--annotation)", fontSize: 24, lineHeight: "32px" }}>Items selected and selection list is hidden</div>
            <DropdownMenu
              trigger={<MultiSelectTrigger selectedLabels={hiddenSelected} hideSelectionList />}
              items={useMultiItems(longOptions, hiddenSelected, setHiddenSelected)}
              selectionMode="multi"
              selectedValues={hiddenSelected}
              showSearch
              searchValue={hiddenSearch}
              onSearchValueChange={setHiddenSearch}
              showSelectAllClearAll
              selectAllChecked={getSelectAllState(longOptions, hiddenSelected).checked}
              selectAllIndeterminate={getSelectAllState(longOptions, hiddenSelected).indeterminate}
              onSelectAllClick={(visible) => { const scope = visible ?? getAllEnabledLabels(longOptions); setHiddenSelected((prev) => { const allSelected = scope.every((label) => prev.includes(label)); return allSelected ? prev.filter((label) => !scope.includes(label)) : Array.from(new Set([...prev, ...scope])); }); }}
              onClearAllClick={() => setHiddenSelected([])}
              clearAllDisabled={hiddenSelected.length === 0}
              showSelectedPanel
              defaultShowSelectedExpanded={false}
              onRemoveSelectedTag={(value) =>
                setHiddenSelected((prev) => prev.filter((entry) => entry !== value))
              }
              onShowSelectedPanelClear={() => setHiddenSelected([])}
              defaultOpen
            />
          </div>

          <div style={{ width: 300, display: "grid", gap: 6 }}>
            <div style={{ color: "var(--annotation)", fontSize: 24, lineHeight: "32px" }}>Section headers</div>
            <DropdownMenu
              trigger={<MultiSelectTrigger selectedLabels={sectionSelected} />}
              items={sectionItems}
              selectionMode="multi"
              selectedValues={sectionSelected}
              showSelectAllClearAll
              selectAllChecked={getSelectAllState(sectionOptions, sectionSelected).checked}
              selectAllIndeterminate={getSelectAllState(sectionOptions, sectionSelected).indeterminate}
              onSelectAllClick={(visible) => { const scope = visible ?? getAllEnabledLabels(sectionOptions); setSectionSelected((prev) => { const allSelected = scope.every((label) => prev.includes(label)); return allSelected ? prev.filter((label) => !scope.includes(label)) : Array.from(new Set([...prev, ...scope])); }); }}
              onClearAllClick={() => setSectionSelected([])}
              clearAllDisabled={sectionSelected.length === 0}
              defaultOpen
            />
          </div>

          <div style={{ width: 300, display: "grid", gap: 6 }}>
            <div style={{ color: "var(--annotation)", fontSize: 24, lineHeight: "32px" }}>Action button</div>
            <DropdownMenu
              trigger={<MultiSelectTrigger selectedLabels={actionSelected} />}
              items={useMultiItems(longOptions, actionSelected, setActionSelected)}
              selectionMode="multi"
              selectedValues={actionSelected}
              showSelectAllClearAll
              selectAllChecked={getSelectAllState(longOptions, actionSelected).checked}
              selectAllIndeterminate={getSelectAllState(longOptions, actionSelected).indeterminate}
              onSelectAllClick={(visible) => { const scope = visible ?? getAllEnabledLabels(longOptions); setActionSelected((prev) => { const allSelected = scope.every((label) => prev.includes(label)); return allSelected ? prev.filter((label) => !scope.includes(label)) : Array.from(new Set([...prev, ...scope])); }); }}
              onClearAllClick={() => setActionSelected([])}
              clearAllDisabled={actionSelected.length === 0}
              footerActionLabel="Action"
              onFooterActionClick={() => setActionEvent("Action clicked")}
              defaultOpen
              maxHeight={180}
            />
            <div style={{ fontSize: 12, color: "var(--color-text-gray-neutral)" }}>
              <strong>onActionClick:</strong> {actionEvent}
            </div>
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
      { id: "1", label: "Option 1" },
      { id: "2", label: "Option 2" },
      { id: "3", label: "Option 3", disabled: true },
      { id: "4", label: "Option 4" },
      { id: "5", label: "Option 5" },
      { id: "6", label: "Option 6" },
    ];

    return (
      <div style={{ width: 980, display: "grid", gap: 16 }}>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "flex-start" }}>
          <DropdownMenu
            trigger={<MultiSelectTrigger selectedLabels={[]} size="large" hover />}
            items={useMultiItems(options, selected, setSelected)}
            selectionMode="multi"
            selectedValues={selected}
            showSelectAllClearAll
            selectAllChecked={getSelectAllState(options, selected).checked}
            selectAllIndeterminate={getSelectAllState(options, selected).indeterminate}
            onSelectAllClick={(visible) => { const scope = visible ?? getAllEnabledLabels(options); setSelected((prev) => { const allSelected = scope.every((label) => prev.includes(label)); return allSelected ? prev.filter((label) => !scope.includes(label)) : Array.from(new Set([...prev, ...scope])); }); }}
            onClearAllClick={() => setSelected([])}
            clearAllDisabled={selected.length === 0}
          />
          <DropdownMenu
            trigger={<MultiSelectTrigger selectedLabels={selected} size="small" focusVisible />}
            items={useMultiItems(options, selected, setSelected)}
            selectionMode="multi"
            selectedValues={selected}
            showSelectAllClearAll
            selectAllChecked={getSelectAllState(options, selected).checked}
            selectAllIndeterminate={getSelectAllState(options, selected).indeterminate}
            onSelectAllClick={(visible) => { const scope = visible ?? getAllEnabledLabels(options); setSelected((prev) => { const allSelected = scope.every((label) => prev.includes(label)); return allSelected ? prev.filter((label) => !scope.includes(label)) : Array.from(new Set([...prev, ...scope])); }); }}
            onClearAllClick={() => setSelected([])}
            clearAllDisabled={selected.length === 0}
          />
        </div>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <div style={{ width: 300, display: "grid", gap: 4 }}>
            <DropdownMenu
              trigger={<MultiSelectTrigger selectedLabels={selected} disabled />}
              items={useMultiItems(options, selected, setSelected)}
              selectionMode="multi"
              selectedValues={selected}
              showSelectAllClearAll
              selectAllChecked={getSelectAllState(options, selected).checked}
              selectAllIndeterminate={getSelectAllState(options, selected).indeterminate}
              onSelectAllClick={(visible) => { const scope = visible ?? getAllEnabledLabels(options); setSelected((prev) => { const allSelected = scope.every((label) => prev.includes(label)); return allSelected ? prev.filter((label) => !scope.includes(label)) : Array.from(new Set([...prev, ...scope])); }); }}
              onClearAllClick={() => setSelected([])}
              clearAllDisabled={selected.length === 0}
              disabled
            />
            <span style={{ color: "var(--color-text-gray-neutral)", fontSize: 14, lineHeight: "20px" }}>
              Helper text
            </span>
          </div>
          <div style={{ width: 300, display: "grid", gap: 4 }}>
            <DropdownMenu
              trigger={<MultiSelectTrigger selectedLabels={selected} error />}
              items={useMultiItems(options, selected, setSelected)}
              selectionMode="multi"
              selectedValues={selected}
              showSelectAllClearAll
              selectAllChecked={getSelectAllState(options, selected).checked}
              selectAllIndeterminate={getSelectAllState(options, selected).indeterminate}
              onSelectAllClick={(visible) => { const scope = visible ?? getAllEnabledLabels(options); setSelected((prev) => { const allSelected = scope.every((label) => prev.includes(label)); return allSelected ? prev.filter((label) => !scope.includes(label)) : Array.from(new Set([...prev, ...scope])); }); }}
              onClearAllClick={() => setSelected([])}
              clearAllDisabled={selected.length === 0}
            />
            <span style={{ color: "var(--color-text-alerting-critical-base)", fontSize: 14, lineHeight: "20px", display: "flex", alignItems: "center", gap: 8 }}>
              <img src={statusCriticalSquareSolidIcon} alt="" aria-hidden="true" width={16} height={16} />
              Error message
            </span>
          </div>
        </div>
      </div>
    );
  },
};

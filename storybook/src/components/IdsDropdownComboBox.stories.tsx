import type { Meta, StoryObj } from "@storybook/react";
import { useMemo, useState } from "react";
import { DropdownMenu } from "./DropdownMenu";
import { IdsDropdownTriggerShell } from "./IdsDropdownTriggerShell";
import statusCriticalSquareSolidIcon from "../../../assets/icons/status-critical-square-solid.svg";

type Size = "small" | "large";
type UserOption = { id: string; label: string; disabled?: boolean };

function ComboTrigger({
  value,
  placeholder = "Select",
  size = "large",
  disabled = false,
  error = false,
  hover = false,
  focusVisible = false,
}: {
  value?: string;
  placeholder?: string;
  size?: Size;
  disabled?: boolean;
  error?: boolean;
  hover?: boolean;
  focusVisible?: boolean;
}) {
  return (
    <IdsDropdownTriggerShell
      size={size}
      disabled={disabled}
      error={error}
      hover={hover}
      focusVisible={focusVisible}
      left={
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {value ?? placeholder}
        </span>
      }
    />
  );
}

const meta: Meta<typeof DropdownMenu> = {
  title: "Spec Generated/IDS/Dropdown/Combo Box",
  component: DropdownMenu,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof DropdownMenu>;

export const SingleSelectContractManual: Story = {
  render: () => {
    const [selected, setSelected] = useState("Compute");
    const [selectionEvent, setSelectionEvent] = useState<{
      csv: string;
      item: UserOption | null;
    }>({ csv: "Compute", item: { id: "app-2", label: "Compute" } });
    const placeholder = "Select product";
    const helperText = "Choose one product";
    const options: UserOption[] = [
      { id: "app-1", label: "Storage" },
      { id: "app-2", label: "Compute" },
      { id: "app-3", label: "Network" },
      { id: "app-4", label: "Security" },
    ];

    const items = useMemo(
      () =>
        options.map((option) => ({
          id: option.id,
          value: option.label,
          label: option.label,
          selectable: true,
          onClick: () => {
            setSelected(option.label);
            setSelectionEvent({ csv: option.label, item: option });
          },
        })),
      [options]
    );

    return (
      <div style={{ width: 300, display: "grid", gap: 8 }}>
        <DropdownMenu
          selectionMode="single"
          selectedValues={[selected]}
          trigger={<ComboTrigger value={selected} placeholder={placeholder} />}
          items={items}
          showSearch
          defaultOpen
          maxHeight={220}
        />
        <div style={{ fontSize: "var(--font-size-body-2)", color: "var(--color-text-neutral)" }}>{helperText}</div>
        <div style={{ fontSize: 12, color: "var(--color-text-neutral)" }}>
          <strong>onSelection (csv):</strong> {selectionEvent.csv}
        </div>
        <div style={{ fontSize: 12, color: "var(--color-text-neutral)", whiteSpace: "pre-wrap" }}>
          <strong>onSelection (item):</strong> {JSON.stringify(selectionEvent.item)}
        </div>
      </div>
    );
  },
};

export const MultiSelectContractManual: Story = {
  render: () => {
    const [selected, setSelected] = useState<string[]>(["Storage", "Compute"]);
    const [searchQuery, setSearchQuery] = useState("");
    const options: UserOption[] = [
      { id: "app-1", label: "Storage" },
      { id: "app-2", label: "Compute" },
      { id: "app-3", label: "Network" },
      { id: "app-4", label: "Security" },
    ];
    const [selectionEvent, setSelectionEvent] = useState({
      csv: "Storage, Compute",
      items: options.filter((o) => ["Storage", "Compute"].includes(o.label)),
    });

    const toggle = (option: UserOption) => {
      const next = selected.includes(option.label)
        ? selected.filter((label) => label !== option.label)
        : [...selected, option.label];
      setSelected(next);
      setSelectionEvent({
        csv: next.join(", "),
        items: options.filter((o) => next.includes(o.label)),
      });
    };

    const items = useMemo(
      () =>
        options.map((option) => ({
          id: option.id,
          value: option.label,
          label: option.label,
          selectable: true,
          onClick: () => toggle(option),
        })),
      [options, selected]
    );

    return (
      <div style={{ width: 300, display: "grid", gap: 8 }}>
        <DropdownMenu
          selectionMode="multi"
          selectedValues={selected}
          trigger={<ComboTrigger value={selected.join(", ")} placeholder="Select products" />}
          items={items}
          showSearch
          searchValue={searchQuery}
          onSearchValueChange={setSearchQuery}
          showSelectAllClearAll
          selectAllChecked={selected.length === options.length}
          selectAllIndeterminate={selected.length > 0 && selected.length < options.length}
          onSelectAllClick={() => setSelected(options.map((option) => option.label))}
          onClearAllClick={() => setSelected([])}
          clearAllDisabled={selected.length === 0}
          showSelectedPanel
          defaultShowSelectedExpanded
          onRemoveSelectedTag={(value) => setSelected((prev) => prev.filter((entry) => entry !== value))}
          onShowSelectedPanelClear={() => setSelected([])}
          defaultOpen
          maxHeight={220}
        />
        <div style={{ fontSize: "var(--font-size-body-2)", color: "var(--color-text-neutral)" }}>
          Choose one or more products
        </div>
        <div style={{ fontSize: 12, color: "var(--color-text-neutral)" }}>
          <strong>onSelection (csv):</strong> {selectionEvent.csv || "(empty)"}
        </div>
        <div style={{ fontSize: 12, color: "var(--color-text-neutral)", whiteSpace: "pre-wrap" }}>
          <strong>onSelection (items):</strong> {JSON.stringify(selectionEvent.items)}
        </div>
      </div>
    );
  },
};

export const DisabledState: Story = {
  render: () => {
    const items = [
      { id: "1", value: "Storage", label: "Storage", selectable: true },
      { id: "2", value: "Compute", label: "Compute", selectable: true },
    ];

    return (
      <div style={{ width: 360, display: "grid", gap: 8 }}>
        <DropdownMenu
          selectionMode="single"
          selectedValues={["Storage"]}
          trigger={<ComboTrigger value="Storage" disabled />}
          items={items}
          disabled
          showSearch
        />
        <div style={{ fontSize: "var(--font-size-body-2)", color: "var(--color-text-neutral)" }}>
          Component is disabled (no expand + disabled cursor)
        </div>
      </div>
    );
  },
};

export const ErrorState: Story = {
  render: () => {
    const items = [
      { id: "1", value: "Storage", label: "Storage", selectable: true },
      { id: "2", value: "Compute", label: "Compute", selectable: true },
    ];

    return (
      <div style={{ width: 360, display: "grid", gap: 8 }}>
        <DropdownMenu
          selectionMode="single"
          trigger={<ComboTrigger placeholder="-Type or Select-" error />}
          items={items}
          showSearch
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--spacing-space-8)",
            color: "var(--color-text-critical)",
            fontSize: "var(--font-size-body-2)",
          }}
        >
          <img src={statusCriticalSquareSolidIcon} alt="" aria-hidden="true" width={16} height={16} />
          Error message
        </div>
      </div>
    );
  },
};

export const MultiSelectShowSelectedPanel: Story = {
  render: () => {
    const options = Array.from({ length: 8 }, (_, i) => ({
      id: `opt-${i + 1}`,
      label: `Option ${i + 1}`,
    }));
    const [selected, setSelected] = useState<string[]>(["Option 1", "Option 2", "Option 4", "Option 6"]);
    const [searchQuery, setSearchQuery] = useState("opt");
    const [showSelectedExpanded, setShowSelectedExpanded] = useState(true);

    const items = useMemo(
      () =>
        options.map((option) => ({
          id: option.id,
          value: option.label,
          label: option.label,
          selectable: true,
          onClick: () =>
            setSelected((prev) =>
              prev.includes(option.label)
                ? prev.filter((entry) => entry !== option.label)
                : [...prev, option.label],
            ),
        })),
      [],
    );

    return (
      <div style={{ width: 300, display: "grid", gap: 8 }}>
        <DropdownMenu
          selectionMode="multi"
          selectedValues={selected}
          trigger={<ComboTrigger value={selected.join(", ")} placeholder="Select products" />}
          items={items}
          showSearch
          searchValue={searchQuery}
          onSearchValueChange={setSearchQuery}
          showSelectAllClearAll
          selectAllChecked={selected.length === options.length}
          selectAllIndeterminate={selected.length > 0 && selected.length < options.length}
          onSelectAllClick={() => setSelected(options.map((option) => option.label))}
          onClearAllClick={() => setSelected([])}
          clearAllDisabled={selected.length === 0}
          showSelectedPanel
          showSelectedExpanded={showSelectedExpanded}
          onShowSelectedExpandedChange={setShowSelectedExpanded}
          onRemoveSelectedTag={(value) => setSelected((prev) => prev.filter((entry) => entry !== value))}
          onShowSelectedPanelClear={() => setSelected([])}
          defaultOpen
          maxHeight={220}
        />
        <div style={{ fontSize: 12, color: "var(--color-text-neutral)" }}>
          Toggle Show/Hide Selected; dismiss tags individually; search clear appears when query is non-empty.
        </div>
      </div>
    );
  },
};

export const SizeMatrix: Story = {
  render: () => {
    const items = Array.from({ length: 6 }, (_, i) => ({
      id: `opt-${i + 1}`,
      value: `Option ${i + 1}`,
      label: `Option ${i + 1}`,
      selectable: true,
    }));

    return (
      <div style={{ width: 760, display: "flex", gap: 20, flexWrap: "wrap", alignItems: "flex-start" }}>
        <DropdownMenu
          trigger={<ComboTrigger size="large" placeholder="Large (40)" hover />}
          items={items}
          selectionMode="single"
          showSearch
          defaultOpen
          maxHeight={220}
        />
        <DropdownMenu
          trigger={<ComboTrigger size="small" placeholder="Small (32)" focusVisible />}
          items={items}
          selectionMode="single"
          showSearch
          defaultOpen
          maxHeight={220}
        />
      </div>
    );
  },
};


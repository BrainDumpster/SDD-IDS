import "../../../components/ids-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import { useCallback, useMemo, useRef, useState } from "react";
import { DropdownMenu } from "./DropdownMenu";
import { IdsBadge } from "./IdsBadge";
import { IdsDropdownTriggerShell } from "./IdsDropdownTriggerShell";
import { IdsTooltip } from "./IdsTooltip";
import statusCriticalSquareSolidIcon from "../../../assets/icons/status-critical-square-solid.svg";

type Size = "small" | "large";
type UserOption = { id: string; label: string; disabled?: boolean };

/**
 * Single-line value that truncates with an ellipsis; when (and only when) the
 * text is actually cut off, it is wrapped in the IDS Tooltip revealing the full
 * selection (Figma combo-box behavior: "if truncated, tooltip displays the
 * selected item" / "tooltip reveals the list of selected items").
 */
function TruncatingValue({ text, tooltip }: { text: string; tooltip?: string }) {
  const [truncated, setTruncated] = useState(false);
  const observerRef = useRef<ResizeObserver | null>(null);

  // Callback ref: re-attaches the observer whenever the measured node changes.
  // The conditional tooltip wrapper below swaps the span element, so a plain
  // useRef + effect would leave the observer watching a detached node.
  const measureRef = useCallback((el: HTMLSpanElement | null) => {
    observerRef.current?.disconnect();
    if (!el) return;
    const check = () => setTruncated(el.scrollWidth > el.clientWidth + 1);
    check();
    observerRef.current = new ResizeObserver(check);
    observerRef.current.observe(el);
  }, []);

  const valueSpan = (
    <span
      ref={measureRef}
      style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
    >
      {text}
    </span>
  );

  return truncated && tooltip ? (
    <IdsTooltip side="top" arrowAlign="start" content={tooltip} triggerDisplay="block">
      {valueSpan}
    </IdsTooltip>
  ) : (
    valueSpan
  );
}

function ComboTrigger({
  value,
  placeholder = "-Select-",
  size = "large",
  disabled = false,
  error = false,
  hover = false,
  focusVisible = false,
  showBadge = false,
  selectedCount = 0,
  fullWidth = false,
}: {
  value?: string;
  placeholder?: string;
  size?: Size;
  disabled?: boolean;
  error?: boolean;
  hover?: boolean;
  focusVisible?: boolean;
  /** Multi-select combo: optional count badge in front of the truncated list (Figma 4g). */
  showBadge?: boolean;
  selectedCount?: number;
  /** Fill the container width (for the responsive-width demo). */
  fullWidth?: boolean;
}) {
  const badgeVisible = showBadge && selectedCount > 0;
  return (
    <IdsDropdownTriggerShell
      size={size}
      disabled={disabled}
      error={error}
      hover={hover}
      focusVisible={focusVisible}
      filled={Boolean(value)}
      style={fullWidth ? { width: "100%" } : undefined}
      left={
        badgeVisible ? (
          <>
            {/* Badge carries the tooltip revealing the selected list (Figma 4k),
                so the list text itself doesn't need a second tooltip.
                `flexShrink: 0` keeps the badge at its natural size — `.main`'s
                `min-width: 0` (needed for the list truncation) would otherwise
                let a 2+ digit badge shrink and overlap the text. */}
            <span style={{ display: "inline-flex", flexShrink: 0 }}>
              <IdsTooltip side="top" arrowAlign="start" title={`${selectedCount} Items`} content={value ?? ""}>
                <span style={{ display: "inline-flex" }}>
                  <IdsBadge value={selectedCount} type={disabled ? "disabled" : "controls"} />
                </span>
              </IdsTooltip>
            </span>
            <TruncatingValue text={value || placeholder} />
          </>
        ) : (
          <TruncatingValue text={value || placeholder} tooltip={value} />
        )
      }
    />
  );
}

/**
 * Optional field `Label`. Sits to the LEFT of the field on the same row; body-2
 * / weight 400 / `--color-text-neutral-strong`. Two sizes track the field height:
 * Large 40px (`--padding-padding-10` top/bottom), Small 32px (`--padding-padding-6`).
 * The trailing `*` (required indicator) is optional.
 */
function FieldLabel({
  text,
  size = "large",
  required = false,
}: {
  text: string;
  size?: Size;
  required?: boolean;
}) {
  const small = size === "small";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        boxSizing: "border-box",
        height: small ? 32 : 40,
        padding: small ? "var(--padding-padding-6) 0" : "var(--padding-padding-10) 0",
        fontSize: "var(--font-size-body-2)",
        lineHeight: "var(--font-line-height-line-height-20)",
        fontWeight: 400,
        color: "var(--color-text-neutral-strong)",
        whiteSpace: "nowrap",
      }}
    >
      {text}
      {required ? <span aria-hidden="true">*</span> : null}
    </span>
  );
}

const meta: Meta<typeof DropdownMenu> = {
  title: "Spec Generated/IDS/Dropdown/Combo Box",
  component: DropdownMenu,
  parameters: {
    // Top-aligned (not vertically centered) so the open menu sits high on the
    // canvas and is fully visible without scrolling.
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      // Leave headroom above the trigger so the value tooltip (side="top",
      // sideOffset 16 + ~2 lines) points UP instead of Base UI flipping it below
      // and overlapping the open menu.
      <div style={{ display: "flex", justifyContent: "center", padding: "120px 16px 32px" }}>
        <Story />
      </div>
    ),
  ],
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
    const placeholder = "-Select-";
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
          selectedValues={selected ? [selected] : []}
          trigger={<ComboTrigger value={selected} placeholder={placeholder} />}
          items={items}
          showSearch
          showClearAll
          onClearAllClick={() => {
            setSelected("");
            setSelectionEvent({ csv: "", item: null });
          }}
          defaultOpen
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

/**
 * Comprehensive multi-select combo box — merges the responsive-width, show-
 * selected-panel, and contract demos into one:
 * - `menuWidth="content"` grows the menu to its widest option (clamped to 700px),
 *   so the menu can be **wider than the field** and excess option text truncates
 *   once the menu hits 700px.
 * - The field fills a **resizable** dashed box (`fullWidth`) — drag the handle to
 *   see the field clamp between 186px and 700px.
 * - Starts **all selected + panel expanded** so the Show Selected list exceeds 3
 *   rows and scrolls; the long tag truncates. Dismiss tags individually.
 * - Trigger shows the **count badge**; **Select All** toggles off when every
 *   visible option is already selected; **Clear All** empties the selection.
 */
export const MultiSelectContractManual: Story = {
  render: () => {
    const options: UserOption[] = [
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
    const [selected, setSelected] = useState<string[]>(options.map((o) => o.label));
    const [searchQuery, setSearchQuery] = useState("");
    const [showSelectedExpanded, setShowSelectedExpanded] = useState(true);

    // Single source of truth: update the selection state.
    const applySelection = (next: string[]) => {
      setSelected(next);
    };

    const items = useMemo(
      () =>
        options.map((option) => ({
          id: option.id,
          value: option.label,
          label: option.label,
          selectable: true,
          onClick: () =>
            applySelection(
              selected.includes(option.label)
                ? selected.filter((entry) => entry !== option.label)
                : [...selected, option.label]
            ),
        })),
      [selected]
    );

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
          border: "1px dashed var(--color-border-accessible)",
          display: "grid",
          gap: 8,
        }}
      >
        <DropdownMenu
          selectionMode="multi"
          selectedValues={selected}
          menuWidth="content"
          fullWidth
          trigger={
            <ComboTrigger
              value={selected.join(", ")}
              placeholder="-Select-"
              showBadge
              selectedCount={selected.length}
              fullWidth
            />
          }
          items={items}
          showSearch
          searchValue={searchQuery}
          onSearchValueChange={setSearchQuery}
          showSelectAllClearAll
          selectAllChecked={selected.length === options.length}
          selectAllIndeterminate={selected.length > 0 && selected.length < options.length}
          onSelectAllClick={(visible) => {
            // Select All toggles within the current scope (search result when
            // filtering, else all options): if everything in scope is already
            // selected, clicking again deselects it (Figma 4f).
            const scope = visible ?? options.map((option) => option.label);
            const allInScopeSelected = scope.every((label) => selected.includes(label));
            applySelection(
              allInScopeSelected
                ? selected.filter((label) => !scope.includes(label))
                : Array.from(new Set([...selected, ...scope]))
            );
          }}
          onClearAllClick={(visible) =>
            applySelection(visible ? selected.filter((entry) => !visible.includes(entry)) : [])
          }
          clearAllDisabled={selected.length === 0}
          showSelectedPanel
          showSelectedExpanded={showSelectedExpanded}
          onShowSelectedExpandedChange={setShowSelectedExpanded}
          onRemoveSelectedTag={(value) => applySelection(selected.filter((entry) => entry !== value))}
          onShowSelectedPanelClear={() => applySelection([])}
          defaultOpen
        />
        <div style={{ fontSize: "var(--font-size-body-2)", color: "var(--color-text-neutral)" }}>
          Resize the dashed box → the field clamps 186–700px; the menu grows to the widest option (up to 700, then truncates). Toggle Show/Hide Selected, dismiss tags, Select All toggles off when all visible are selected.
        </div>

      </div>
    );
  },
};

/**
 * A multi-select combo box with one extremely long option label. Demonstrates
 * `menuWidth="content"` growing the popup to the widest option and truncating
 * once it reaches 700px.
 */
export const MultiSelectLongOption: Story = {
  render: () => {
    const options: UserOption[] = [
      { id: "o1", label: "Observability, Monitoring, Alerting & Automated Incident Response for an extremely long service catalog entry" },
      { id: "o2", label: "Storage & Data Backup" },
      { id: "o3", label: "Compute & Networking" },
      { id: "o4", label: "Security & Compliance" },
    ];
    const [selected, setSelected] = useState<string[]>(options.map((o) => o.label));
    const [searchQuery, setSearchQuery] = useState("");
    const [showSelectedExpanded, setShowSelectedExpanded] = useState(true);

    const applySelection = (next: string[]) => {
      setSelected(next);
    };

    const items = useMemo(
      () =>
        options.map((option) => ({
          id: option.id,
          value: option.label,
          label: option.label,
          selectable: true,
          onClick: () =>
            applySelection(
              selected.includes(option.label)
                ? selected.filter((entry) => entry !== option.label)
                : [...selected, option.label]
            ),
        })),
      [selected]
    );

    return (
      <div
        style={{
          width: 360,
          padding: 16,
          border: "1px dashed var(--color-border-accessible)",
          display: "grid",
          gap: 8,
        }}
      >
        <DropdownMenu
          selectionMode="multi"
          selectedValues={selected}
          menuWidth="content"
          fullWidth
          trigger={
            <ComboTrigger
              value={selected.join(", ")}
              placeholder="-Select-"
              showBadge
              selectedCount={selected.length}
              fullWidth
            />
          }
          items={items}
          showSearch
          searchValue={searchQuery}
          onSearchValueChange={setSearchQuery}
          showSelectAllClearAll
          selectAllChecked={selected.length === options.length}
          selectAllIndeterminate={selected.length > 0 && selected.length < options.length}
          onSelectAllClick={(visible) => {
            const scope = visible ?? options.map((option) => option.label);
            const allInScopeSelected = scope.every((label) => selected.includes(label));
            applySelection(
              allInScopeSelected
                ? selected.filter((label) => !scope.includes(label))
                : Array.from(new Set([...selected, ...scope]))
            );
          }}
          onClearAllClick={(visible) =>
            applySelection(visible ? selected.filter((entry) => !visible.includes(entry)) : [])
          }
          clearAllDisabled={selected.length === 0}
          showSelectedPanel
          showSelectedExpanded={showSelectedExpanded}
          onShowSelectedExpandedChange={setShowSelectedExpanded}
          onRemoveSelectedTag={(value) => applySelection(selected.filter((entry) => entry !== value))}
          onShowSelectedPanelClear={() => applySelection([])}
          defaultOpen
        />
        <div style={{ fontSize: "var(--font-size-body-2)", color: "var(--color-text-neutral)" }}>
          The 360px field is narrower than the menu; the menu grows to the widest option and truncates at 700px. The selected long tag also truncates. Toggle Show/Hide Selected, dismiss tags, Select All toggles off when all visible are selected.
        </div>
      </div>
    );
  },
};

/**
 * Truncation (default `menuWidth="trigger"`). The menu matches the 300px field,
 * so labels longer than the field truncate with an ellipsis — both the selected
 * value in the field and each option row in the menu.
 */
export const Truncation: Story = {
  render: () => {
    const timezones = [
      "(UTC-08:00) Pacific Time (US & Canada)",
      "(UTC-07:00) Mountain Time (US & Canada)",
      "(UTC-06:00) Central Time (US & Canada)",
      "(UTC-05:00) Eastern Time (US & Canada)",
      "(UTC+00:00) Coordinated Universal Time (UTC)",
      "(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi",
      "(UTC+12:45) Chatham Islands, and other remote South Pacific island territories",
    ];
    const [selected, setSelected] = useState(timezones[0]);

    const items = useMemo(
      () =>
        timezones.map((label, index) => ({
          id: `tz-${index}`,
          value: label,
          label,
          selectable: true,
          onClick: () => setSelected(label),
        })),
      []
    );

    return (
      <div style={{ width: 300, display: "grid", gap: 8 }}>
        <DropdownMenu
          selectionMode="single"
          selectedValues={[selected]}
          trigger={<ComboTrigger value={selected} placeholder="-Select-" />}
          items={items}
          showSearch
          defaultOpen
        />
        <div style={{ fontSize: "var(--font-size-body-2)", color: "var(--color-text-neutral)" }}>Time zone</div>
      </div>
    );
  },
};

/**
 * Size matrix with an optional label toggle. Shows Large and Small combo boxes,
 * with or without a left-aligned label, controlled by a boolean `label` arg.
 */
export const SizeAndLabelMatrix: Story = {
  argTypes: {
    label: { control: "boolean" },
  } as any,
  args: {
    label: true,
  } as any,
  render: ({ label }: any) => {
    const [selected, setSelected] = useState("Compute");
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
          onClick: () => setSelected(option.label),
        })),
      [options]
    );

    const field = (size: Size, required: boolean) => (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-space-16)" }}>
        {label ? <FieldLabel text="Environment" size={size} required={required} /> : null}
        <div style={{ width: 300 }}>
          <DropdownMenu
            selectionMode="single"
            selectedValues={selected ? [selected] : []}
            trigger={<ComboTrigger value={size === "large" ? "Large (40)" : "Small (32)"} size={size} fullWidth />}
            items={items}
            showSearch
            fullWidth
          />
        </div>
      </div>
    );

    return (
      <div style={{ width: 760, display: "grid", gap: 24 }}>
        {field("large", true)}
        {field("small", false)}
      </div>
    );
  },
};


export const DisabledAndErrorStates: Story = {
  render: () => {
    const items = [
      { id: "1", value: "Storage", label: "Storage", selectable: true },
      { id: "2", value: "Compute", label: "Compute", selectable: true },
    ];

    return (
      <div style={{ width: 360, display: "grid", gap: 24 }}>
        <div style={{ display: "grid", gap: 8 }}>
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
        <div style={{ display: "grid", gap: 8 }}>
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
      </div>
    );
  },
};

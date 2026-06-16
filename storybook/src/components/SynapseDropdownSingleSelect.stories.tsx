import "../../../components/synapse-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import type React from "react";
import { useMemo, useState } from "react";
import { SynapseDropdownMenu } from "./SynapseDropdownMenu";
import { SynapseDropdownTriggerShell } from "./SynapseDropdownTriggerShell";
import {
  SYNAPSE_DROPDOWN_SINGLE_SELECT_FIELD_STATES_MATRIX_NODE_ID,
  SYNAPSE_DROPDOWN_SINGLE_SELECT_IDS_BASELINE_SPEC_PATH,
  SYNAPSE_DROPDOWN_SINGLE_SELECT_MAIN_NODE_ID,
} from "../spec-contracts/synapse-dropdown-single-select.contract";
import statusCriticalSquareSolidIcon from "../../../assets/icons/status-critical-square-solid.svg";

type Size = "small" | "large";
type Option = { id: string; label: string };

function SingleSelectTrigger({
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
    <SynapseDropdownTriggerShell
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

const meta: Meta<typeof SynapseDropdownMenu> = {
  title: "Spec Generated/Synapse/Dropdown/Single Select",
  component: SynapseDropdownMenu,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          `Spec-driven Synapse Dropdown Single Select (IDS-fork). IDS baseline: \`${SYNAPSE_DROPDOWN_SINGLE_SELECT_IDS_BASELINE_SPEC_PATH}\`.`,
          `Figma set: \`${SYNAPSE_DROPDOWN_SINGLE_SELECT_MAIN_NODE_ID}\`; field matrix: \`${SYNAPSE_DROPDOWN_SINGLE_SELECT_FIELD_STATES_MATRIX_NODE_ID}\`.`,
          "Theme: `components/synapse-theme.css`.",
        ].join(" "),
      },
    },
  },
  argTypes: {
    showSingleSelectRadio: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof SynapseDropdownMenu>;

function useSingleSelectItems(
  options: Option[],
  onSelect: (label: string) => void
) {
  return useMemo(
    () =>
      options.map((option) => ({
        id: option.id,
        value: option.label,
        label: option.label,
        selectable: true,
        onClick: () => onSelect(option.label),
      })),
    [options, onSelect]
  );
}

export const MainScenarios: Story = {
  args: { showSingleSelectRadio: true },
  render: ({ showSingleSelectRadio = true }) => {
    const [smallValue, setSmallValue] = useState("Option 2");
    const [overflowValue, setOverflowValue] = useState("Option 2");
    const [sectionValue, setSectionValue] = useState("Option 2");
    const [actionValue, setActionValue] = useState("Option 2");
    const [actionEvent, setActionEvent] = useState("None");

    const smallItems = useSingleSelectItems(
      [
        { id: "s1", label: "Option 1" },
        { id: "s2", label: "Option 2" },
        { id: "s3", label: "Option 3" },
        { id: "s4", label: "Option 4" },
        { id: "s5", label: "Option 5" },
      ],
      setSmallValue
    );

    const overflowingItems = useSingleSelectItems(
      Array.from({ length: 12 }, (_, i) => ({ id: `o${i + 1}`, label: `Option ${i + 1}` })),
      setOverflowValue
    );

    const disabledOptionItems = [
      { id: "do-1", value: "Option 1", label: "Option 1", selectable: true, onClick: () => setSmallValue("Option 1") },
      { id: "do-2", value: "Option 2", label: "Option 2", selectable: true, onClick: () => setSmallValue("Option 2") },
      { id: "do-3", value: "Option 3", label: "Option 3", selectable: true, disabled: true, onClick: () => setSmallValue("Option 3") },
      { id: "do-4", value: "Option 4", label: "Option 4", selectable: true, onClick: () => setSmallValue("Option 4") },
    ];

    const sectionItems = [
      { id: "h1", label: "Section Title", kind: "section" as const },
      ...useSingleSelectItems(
        [
          { id: "a1", label: "Option 1" },
          { id: "a2", label: "Option 2" },
          { id: "a3", label: "Option 3" },
        ],
        setSectionValue
      ),
      { id: "h2", label: "Section Title", kind: "section" as const },
      ...useSingleSelectItems(
        [
          { id: "b1", label: "Option 4" },
          { id: "b2", label: "Option 5" },
          { id: "b3", label: "Option 6" },
        ],
        setSectionValue
      ),
    ];

    const actionItems = [
      ...useSingleSelectItems(
        Array.from({ length: 12 }, (_, i) => ({
          id: `c${i + 1}`,
          label: `Option ${i + 1}`,
        })),
        setActionValue
      ),
    ];

    return (
      <div style={{ width: 1300, display: "grid", gap: 12 }}>
        <a href="#" style={{ fontSize: 16, lineHeight: "24px", color: "var(--color-text-brand-base)" }}>
          Learn how to align form elements.
        </a>
        <div style={{ display: "flex", gap: 18, alignItems: "flex-start", flexWrap: "wrap" }}>
          <div style={{ display: "grid", gap: 6, width: 300 }}>
            <div style={{ color: "var(--annotation)", fontSize: 24, lineHeight: "32px" }}>Small menu</div>
            <SynapseDropdownMenu
              trigger={<SingleSelectTrigger value={smallValue} />}
              items={disabledOptionItems}
              selectionMode="single"
              selectedValues={[smallValue]}
              showSingleSelectRadio={showSingleSelectRadio}
              defaultOpen
              maxHeight={220}
            />
          </div>
          <div style={{ display: "grid", gap: 6, width: 300 }}>
            <div style={{ color: "var(--annotation)", fontSize: 24, lineHeight: "32px" }}>Overflowing menu</div>
            <SynapseDropdownMenu
              trigger={<SingleSelectTrigger value={overflowValue} />}
              items={overflowingItems}
              selectionMode="single"
              selectedValues={[overflowValue]}
              showSingleSelectRadio={showSingleSelectRadio}
              defaultOpen
              maxHeight={220}
            />
          </div>
          <div style={{ display: "grid", gap: 6, width: 300 }}>
            <div style={{ color: "var(--annotation)", fontSize: 24, lineHeight: "32px" }}>Section header</div>
            <SynapseDropdownMenu
              trigger={<SingleSelectTrigger value={sectionValue} />}
              items={sectionItems}
              selectionMode="single"
              selectedValues={[sectionValue]}
              showSingleSelectRadio={showSingleSelectRadio}
              defaultOpen
              maxHeight={220}
            />
          </div>
          <div style={{ display: "grid", gap: 6, width: 300 }}>
            <div style={{ color: "var(--annotation)", fontSize: 24, lineHeight: "32px" }}>Action button</div>
            <SynapseDropdownMenu
              trigger={<SingleSelectTrigger value={actionValue} />}
              items={actionItems}
              selectionMode="single"
              selectedValues={[actionValue]}
              showSingleSelectRadio={showSingleSelectRadio}
              footerActionLabel="Action"
              onFooterActionClick={() => setActionEvent("Action clicked")}
              defaultOpen
              maxHeight={180}
            />
            <div style={{ fontSize: 12, color: "var(--color-text-neutral)" }}>
              <strong>onActionClick:</strong> {actionEvent}
            </div>
          </div>
        </div>
      </div>
    );
  },
};

/**
 * Field States Matrix — matches Figma component matrix `11099:58099`.
 * Columns: Size Large (Empty / Filled) × Size Small (Empty / Filled).
 * Rows: Default, Hover, Show Selected, Focus, Disabled, Error.
 */
export const FieldStatesMatrix: Story = {
  render: () => {
    const annotationStyle: React.CSSProperties = {
      fontSize: 14,
      lineHeight: "20px",
      color: "#e8178a",
      whiteSpace: "nowrap",
      textAlign: "right",
      paddingRight: 8,
      minWidth: 110,
    };
    const colHeaderStyle: React.CSSProperties = {
      fontSize: 14,
      lineHeight: "20px",
      color: "#e8178a",
      textAlign: "center",
    };
    const cellStyle: React.CSSProperties = { display: "grid", gap: 4, width: 240 };
    const helperStyle: React.CSSProperties = {
      fontSize: 14,
      lineHeight: "20px",
      color: "var(--color-text-neutral)",
      fontWeight: 500,
    };
    const errorMsgStyle: React.CSSProperties = {
      fontSize: 14,
      lineHeight: "20px",
      color: "var(--color-text-critical)",
      fontWeight: 500,
      display: "flex",
      alignItems: "center",
      gap: 8,
    };

    type CellDef = {
      value?: string;
      placeholder?: string;
      size: Size;
      disabled?: boolean;
      error?: boolean;
      hover?: boolean;
      focusVisible?: boolean;
      helperType?: "text" | "error";
    };

    const stateRows: { label: string; cells: CellDef[] }[] = [
      {
        label: "State: Default",
        cells: [
          { placeholder: "-Select-", size: "large" },
          { value: "Option 2", size: "large" },
          { placeholder: "-Select-", size: "small" },
          { value: "Option 2", size: "small" },
        ],
      },
      {
        label: "State: Hover",
        cells: [
          { placeholder: "-Select-", size: "large", hover: true },
          { value: "Option 2", size: "large", hover: true },
          { placeholder: "-Select-", size: "small", hover: true },
          { value: "Option 2", size: "small", hover: true },
        ],
      },
      {
        label: "State: Show Selected",
        cells: [
          { placeholder: "-Select-", size: "large" },
          { value: "Option 2", size: "large" },
          { placeholder: "-Select-", size: "small" },
          { value: "Option 2", size: "small" },
        ],
      },
      {
        label: "State: Focus",
        cells: [
          { placeholder: "-Select-", size: "large", focusVisible: true },
          { value: "Option 2", size: "large", focusVisible: true },
          { placeholder: "-Select-", size: "small", focusVisible: true },
          { value: "Option 2", size: "small", focusVisible: true },
        ],
      },
      {
        label: "State: Disabled",
        cells: [
          { placeholder: "-Select-", size: "large", disabled: true },
          { value: "Option 2", size: "large", disabled: true },
          { placeholder: "-Select-", size: "small", disabled: true },
          { value: "Option 2", size: "small", disabled: true },
        ],
      },
      {
        label: "State: Error",
        cells: [
          { placeholder: "-Select-", size: "large", error: true, helperType: "error" },
          { value: "Option 2", size: "large", error: true, helperType: "error" },
          { placeholder: "-Select-", size: "small", error: true, helperType: "error" },
          { value: "Option 2", size: "small", error: true, helperType: "error" },
        ],
      },
    ];

    return (
      <div style={{ display: "grid", gap: 24, padding: 24 }}>
        {/* Column headers */}
        <div style={{ display: "flex", gap: 12, paddingLeft: 118 }}>
          <div style={{ ...colHeaderStyle, width: 240 }}>Size: Large(40) — Empty</div>
          <div style={{ ...colHeaderStyle, width: 240 }}>Size: Large(40) — Filled</div>
          <div style={{ ...colHeaderStyle, width: 240 }}>Size: Small(32) — Empty</div>
          <div style={{ ...colHeaderStyle, width: 240 }}>Size: Small(32) — Filled</div>
        </div>

        {stateRows.map((row) => (
          <div key={row.label} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
            <div style={annotationStyle}>{row.label}</div>
            {row.cells.map((cell, i) => (
              <div key={i} style={cellStyle}>
                <SynapseDropdownTriggerShell
                  size={cell.size}
                  disabled={cell.disabled}
                  error={cell.error}
                  hover={cell.hover}
                  focusVisible={cell.focusVisible}
                  left={
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {cell.value ?? cell.placeholder ?? "-Select-"}
                    </span>
                  }
                />
                {cell.helperType === "error" ? (
                  <span style={errorMsgStyle}>
                    <img src={statusCriticalSquareSolidIcon} alt="" aria-hidden="true" width={16} height={16} />
                    Error message
                  </span>
                ) : row.label !== "State: Error" ? (
                  <span style={helperStyle}>Helper text</span>
                ) : null}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  },
};

export const OptionalRadioButton: Story = {
  render: () => {
    const [selected, setSelected] = useState("Option 2");
    const options = useSingleSelectItems(
      [
        { id: "r1", label: "Option 1" },
        { id: "r2", label: "Option 2" },
        { id: "r3", label: "Option 3" },
      ],
      setSelected
    );

    return (
      <div style={{ width: 640, display: "flex", gap: 20 }}>
        <div style={{ width: 300, display: "grid", gap: 6 }}>
          <div style={{ color: "var(--annotation)", fontSize: 14 }}>Radio: Off (default)</div>
          <SynapseDropdownMenu
            trigger={<SingleSelectTrigger value={selected} />}
            items={options}
            selectionMode="single"
            selectedValues={[selected]}
            showSingleSelectRadio={false}
            defaultOpen
            maxHeight={220}
          />
        </div>
        <div style={{ width: 300, display: "grid", gap: 6 }}>
          <div style={{ color: "var(--annotation)", fontSize: 14 }}>Radio: On (user input)</div>
          <SynapseDropdownMenu
            trigger={<SingleSelectTrigger value={selected} />}
            items={options}
            selectionMode="single"
            selectedValues={[selected]}
            showSingleSelectRadio
            defaultOpen
            maxHeight={220}
          />
        </div>
      </div>
    );
  },
};

export const DisabledOptionState: Story = {
  args: { showSingleSelectRadio: true },
  render: ({ showSingleSelectRadio = true }) => {
    const [selected, setSelected] = useState("Option 2");
    const items = [
      { id: "dso-1", value: "Option 1", label: "Option 1", selectable: true, onClick: () => setSelected("Option 1") },
      { id: "dso-2", value: "Option 2", label: "Option 2", selectable: true, onClick: () => setSelected("Option 2") },
      { id: "dso-3", value: "Option 3", label: "Option 3", selectable: true, disabled: true, onClick: () => setSelected("Option 3") },
      { id: "dso-4", value: "Option 4", label: "Option 4", selectable: true, onClick: () => setSelected("Option 4") },
    ];

    return (
      <div style={{ width: 320, display: "grid", gap: 8 }}>
        <SynapseDropdownMenu
          trigger={<SingleSelectTrigger value={selected} />}
          items={items}
          selectionMode="single"
          selectedValues={[selected]}
          showSingleSelectRadio={showSingleSelectRadio}
          defaultOpen
          maxHeight={220}
        />
        <span style={{ fontSize: 12, color: "var(--color-text-neutral)" }}>
          Option 3 is disabled at option level.
        </span>
      </div>
    );
  },
};

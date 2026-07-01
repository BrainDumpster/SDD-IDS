import "../../../components/synapse-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import type React from "react";
import { useState } from "react";
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
import {
  SYNAPSE_DROPDOWN_SINGLE_SELECT_FIELD_STATES_MATRIX_NODE_ID,
  SYNAPSE_DROPDOWN_SINGLE_SELECT_IDS_BASELINE_SPEC_PATH,
  SYNAPSE_DROPDOWN_SINGLE_SELECT_MAIN_NODE_ID,
} from "../spec-contracts/synapse-dropdown-single-select.contract";
import {
  SYNAPSE_DROPDOWN_DOCS_DESCRIPTION,
  SYNAPSE_DROPDOWN_STORY_SOURCE,
} from "./synapse-dropdown.developer-usage";
import statusCriticalSquareSolidIcon from "../../../assets/icons/status-critical-square-solid.svg";

type Size = "small" | "large";

const meta: Meta<typeof SynapseDropdown> = {
  title: "Spec Generated/Synapse/Dropdown/Single Select",
  component: SynapseDropdown,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      canvas: { sourceState: "open" },
      description: {
        component: [
          SYNAPSE_DROPDOWN_DOCS_DESCRIPTION,
          `IDS baseline: \`${SYNAPSE_DROPDOWN_SINGLE_SELECT_IDS_BASELINE_SPEC_PATH}\`.`,
          `Figma set: \`${SYNAPSE_DROPDOWN_SINGLE_SELECT_MAIN_NODE_ID}\`; field matrix: \`${SYNAPSE_DROPDOWN_SINGLE_SELECT_FIELD_STATES_MATRIX_NODE_ID}\`.`,
        ].join("\n\n"),
      },
      source: { type: "code", language: "tsx", code: SYNAPSE_DROPDOWN_STORY_SOURCE },
    },
  },
  argTypes: {
    showSingleSelectRadio: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof SynapseDropdown>;

export const CompositionApi: Story = {
  name: "Composition API",
  args: { showSingleSelectRadio: true },
  render: ({ showSingleSelectRadio = true }) => {
    const [smallValue, setSmallValue] = useState("Option 2");
    const [overflowValue, setOverflowValue] = useState("Option 2");
    const [sectionValue, setSectionValue] = useState("Option 2");
    const [actionValue, setActionValue] = useState("Option 2");
    const [actionEvent, setActionEvent] = useState("None");

    return (
      <div style={{ width: 1300, display: "grid", gap: 12 }}>
        <a href="#" style={{ fontSize: 16, lineHeight: "24px", color: "var(--color-text-brand-base)" }}>
          Learn how to align form elements.
        </a>
        <div style={{ display: "flex", gap: 18, alignItems: "flex-start", flexWrap: "wrap" }}>
          <div style={{ width: 300, display: "grid", gap: 6 }}>
            <div style={{ color: "var(--annotation)", fontSize: 24, lineHeight: "32px" }}>Small menu</div>
            <SynapseDropdown
              mode="single-select"
              value={smallValue}
              onValueChange={setSmallValue}
              showSingleSelectRadio={showSingleSelectRadio}
            >
              <SynapseDropdownMenu defaultOpen maxHeight={220}>
                <SynapseDropdownTriggerShell left={<span>{smallValue}</span>} />
                <SynapseDropdownMenuItem value="Option 1" label="Option 1" />
                <SynapseDropdownMenuItem value="Option 2" label="Option 2" />
                <SynapseDropdownMenuItem value="Option 3" label="Option 3" disabled />
                <SynapseDropdownMenuItem value="Option 4" label="Option 4" />
              </SynapseDropdownMenu>
            </SynapseDropdown>
          </div>

          <div style={{ width: 300, display: "grid", gap: 6 }}>
            <div style={{ color: "var(--annotation)", fontSize: 24, lineHeight: "32px" }}>Overflowing menu</div>
            <SynapseDropdown
              mode="single-select"
              value={overflowValue}
              onValueChange={setOverflowValue}
              showSingleSelectRadio={showSingleSelectRadio}
            >
              <SynapseDropdownMenu defaultOpen maxHeight={220}>
                <SynapseDropdownTriggerShell left={<span>{overflowValue}</span>} />
                {Array.from({ length: 12 }, (_, i) => (
                  <SynapseDropdownMenuItem
                    key={i}
                    value={`Option ${i + 1}`}
                    label={`Option ${i + 1}`}
                  />
                ))}
              </SynapseDropdownMenu>
            </SynapseDropdown>
          </div>

          <div style={{ width: 300, display: "grid", gap: 6 }}>
            <div style={{ color: "var(--annotation)", fontSize: 24, lineHeight: "32px" }}>Section header</div>
            <SynapseDropdown
              mode="single-select"
              value={sectionValue}
              onValueChange={setSectionValue}
              showSingleSelectRadio={showSingleSelectRadio}
            >
              <SynapseDropdownMenu defaultOpen maxHeight={220}>
                <SynapseDropdownTriggerShell left={<span>{sectionValue}</span>} />
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
            <SynapseDropdown
              mode="single-select"
              value={actionValue}
              onValueChange={setActionValue}
              showSingleSelectRadio={showSingleSelectRadio}
            >
              <SynapseDropdownMenu defaultOpen maxHeight={180}>
                <SynapseDropdownTriggerShell left={<span>{actionValue}</span>} />
                {Array.from({ length: 12 }, (_, i) => (
                  <SynapseDropdownMenuItem
                    key={i}
                    value={`Option ${i + 1}`}
                    label={`Option ${i + 1}`}
                  />
                ))}
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

/** Field States Matrix — matches Figma component matrix `11099:58099` (trigger shell + helper/error only). */
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
    return (
      <div style={{ width: 640, display: "flex", gap: 20 }}>
        <div style={{ width: 300, display: "grid", gap: 6 }}>
          <div style={{ color: "var(--annotation)", fontSize: 14 }}>Radio: Off (default)</div>
          <SynapseDropdown mode="single-select" value={selected} onValueChange={setSelected}>
            <SynapseDropdownMenu defaultOpen maxHeight={220}>
              <SynapseDropdownTriggerShell left={<span>{selected}</span>} />
              <SynapseDropdownMenuItem value="Option 1" label="Option 1" />
              <SynapseDropdownMenuItem value="Option 2" label="Option 2" />
              <SynapseDropdownMenuItem value="Option 3" label="Option 3" />
            </SynapseDropdownMenu>
          </SynapseDropdown>
        </div>
        <div style={{ width: 300, display: "grid", gap: 6 }}>
          <div style={{ color: "var(--annotation)", fontSize: 14 }}>Radio: On (user input)</div>
          <SynapseDropdown
            mode="single-select"
            value={selected}
            onValueChange={setSelected}
            showSingleSelectRadio
          >
            <SynapseDropdownMenu defaultOpen maxHeight={220}>
              <SynapseDropdownTriggerShell left={<span>{selected}</span>} />
              <SynapseDropdownMenuItem value="Option 1" label="Option 1" />
              <SynapseDropdownMenuItem value="Option 2" label="Option 2" />
              <SynapseDropdownMenuItem value="Option 3" label="Option 3" />
            </SynapseDropdownMenu>
          </SynapseDropdown>
        </div>
      </div>
    );
  },
};

export const DisabledOptionState: Story = {
  args: { showSingleSelectRadio: true },
  render: ({ showSingleSelectRadio = true }) => {
    const [selected, setSelected] = useState("Option 2");
    return (
      <div style={{ width: 320, display: "grid", gap: 8 }}>
        <SynapseDropdown
          mode="single-select"
          value={selected}
          onValueChange={setSelected}
          showSingleSelectRadio={showSingleSelectRadio}
        >
          <SynapseDropdownMenu defaultOpen maxHeight={220}>
            <SynapseDropdownTriggerShell left={<span>{selected}</span>} />
            <SynapseDropdownMenuItem value="Option 1" label="Option 1" />
            <SynapseDropdownMenuItem value="Option 2" label="Option 2" />
            <SynapseDropdownMenuItem value="Option 3" label="Option 3" disabled />
            <SynapseDropdownMenuItem value="Option 4" label="Option 4" />
          </SynapseDropdownMenu>
        </SynapseDropdown>
        <span style={{ fontSize: 12, color: "var(--color-text-neutral)" }}>
          Option 3 is disabled at option level.
        </span>
      </div>
    );
  },
};

export const HelperError: Story = {
  name: "Helper + Error",
  render: () => (
    <div style={{ width: 332, display: "grid", gap: 16 }}>
      <SynapseDropdown mode="single-select" value="Option 2">
        <SynapseDropdownMenu defaultOpen maxHeight={220}>
          <SynapseDropdownTriggerShell left={<span>Option 2</span>} />
          <SynapseDropdownMenuItem value="Option 1" label="Option 1" />
          <SynapseDropdownMenuItem value="Option 2" label="Option 2" />
        </SynapseDropdownMenu>
        <SynapseDropdownHelper>Helper text</SynapseDropdownHelper>
      </SynapseDropdown>

      <SynapseDropdown mode="single-select">
        <SynapseDropdownMenu>
          <SynapseDropdownTriggerShell error left={<span>-Select-</span>} />
          <SynapseDropdownMenuItem value="Option 1" label="Option 1" />
        </SynapseDropdownMenu>
        <SynapseDropdownError>Error message</SynapseDropdownError>
      </SynapseDropdown>
    </div>
  ),
};

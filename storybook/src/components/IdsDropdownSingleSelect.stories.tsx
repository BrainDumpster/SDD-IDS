import type { Meta, StoryObj } from "@storybook/react";
import { useMemo, useState } from "react";
import { DropdownMenu } from "./DropdownMenu";
import arrowDropTriCaretIcon from "../../../assets/icons/arrow-drop-tri-caret.svg";
import statusCriticalSquareSolidIcon from "../../../assets/icons/status-critical-square-solid.svg";

type Size = "small" | "large";
type Option = { id: string; label: string };

function SingleSelectTrigger({
  value,
  placeholder = "Select",
  size = "large",
  disabled = false,
  error = false,
}: {
  value?: string;
  placeholder?: string;
  size?: Size;
  disabled?: boolean;
  error?: boolean;
}) {
  const verticalPadding = size === "large" ? "10px" : "6px";
  const borderColor = error
    ? "var(--color-border-alerting-critical-base)"
    : "var(--color-border-accessible)";
  const textColor = disabled
    ? "var(--color-text-disabled)"
    : "var(--color-text-neutral)";
  const background = disabled
    ? "var(--color-background-gray-light)"
    : "var(--color-background-component)";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: 300,
        border: `1px solid ${borderColor}`,
        background,
        padding: `${verticalPadding} var(--padding-padding-16)`,
        fontSize: "var(--font-size-body-2)",
        lineHeight: "var(--font-line-height-line-height-20)",
        color: textColor,
        cursor: disabled ? "not-allowed" : "pointer",
        boxSizing: "border-box",
      }}
    >
      <span>{value ?? placeholder}</span>
      <span
        aria-hidden="true"
        style={{
          width: 10,
          height: 10,
          display: "inline-block",
          backgroundColor: "var(--color-icon-accessible)",
          WebkitMaskImage: `url('${arrowDropTriCaretIcon}')`,
          WebkitMaskRepeat: "no-repeat",
          WebkitMaskSize: "contain",
          WebkitMaskPosition: "center",
          maskImage: `url('${arrowDropTriCaretIcon}')`,
          maskRepeat: "no-repeat",
          maskSize: "contain",
          maskPosition: "center",
        }}
      />
    </div>
  );
}

const meta: Meta<typeof DropdownMenu> = {
  title: "IDS/Dropdown/Single Select",
  component: DropdownMenu,
  parameters: { layout: "centered" },
  argTypes: {
    showSingleSelectRadio: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof DropdownMenu>;

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
            <DropdownMenu
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
            <DropdownMenu
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
            <DropdownMenu
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
            <DropdownMenu
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

export const StatesAndSizes: Story = {
  args: { showSingleSelectRadio: true },
  render: ({ showSingleSelectRadio = true }) => {
    const emptyItems = [
      { id: "e1", value: "Option 1", label: "Option 1", selectable: true },
      { id: "e2", value: "Option 2", label: "Option 2", selectable: true },
    ];

    return (
      <div style={{ width: 700, display: "grid", gap: 16 }}>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <DropdownMenu
            trigger={<SingleSelectTrigger placeholder="Select" size="large" />}
            items={emptyItems}
            selectionMode="single"
            showSingleSelectRadio={showSingleSelectRadio}
          />
          <DropdownMenu
            trigger={<SingleSelectTrigger value="Option 2" size="small" />}
            items={emptyItems}
            selectionMode="single"
            selectedValues={["Option 2"]}
            showSingleSelectRadio={showSingleSelectRadio}
          />
        </div>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <div style={{ width: 300, display: "grid", gap: 4 }}>
            <DropdownMenu
              trigger={<SingleSelectTrigger value="Option 2" disabled />}
              items={emptyItems}
              selectionMode="single"
              selectedValues={["Option 2"]}
              showSingleSelectRadio={showSingleSelectRadio}
              disabled
            />
            <span style={{ color: "var(--color-text-neutral)", fontSize: 14, lineHeight: "20px" }}>
              Helper text
            </span>
          </div>
          <div style={{ width: 300, display: "grid", gap: 4 }}>
            <DropdownMenu
              trigger={<SingleSelectTrigger placeholder="-Type or Select-" error />}
              items={emptyItems}
              selectionMode="single"
              showSingleSelectRadio={showSingleSelectRadio}
            />
            <span style={{ color: "var(--color-text-critical)", fontSize: 14, lineHeight: "20px", display: "flex", alignItems: "center", gap: 8 }}>
              <img src={statusCriticalSquareSolidIcon} alt="" aria-hidden="true" width={16} height={16} />
              Error message
            </span>
          </div>
        </div>
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
          <DropdownMenu
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
          <DropdownMenu
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
        <DropdownMenu
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

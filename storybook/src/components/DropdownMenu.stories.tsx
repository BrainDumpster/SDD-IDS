import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { DropdownMenu } from "./DropdownMenu";
import { Button } from "./Button";

const meta: Meta<typeof DropdownMenu> = {
  title: "Synapse/DropdownMenu",
  component: DropdownMenu,
};

export default meta;
type Story = StoryObj<typeof DropdownMenu>;

export const Basic: Story = {
  args: {
    trigger: <Button variant="secondary">Actions</Button>,
    items: [
      { label: "Edit" },
      { label: "Duplicate" },
      { label: "Delete" },
    ],
  },
};

export const WithSeparator: Story = {
  args: {
    trigger: <Button variant="secondary">More Options</Button>,
    items: [
      { label: "View details" },
      { label: "Edit" },
      { label: "Section Title", kind: "section" },
      { label: "Export as CSV" },
      { label: "Export as PDF" },
      { label: "Section Title", kind: "section" },
      { label: "Delete" },
    ],
  },
};

export const WithDisabled: Story = {
  args: {
    trigger: <Button>File Menu</Button>,
    items: [
      { label: "New" },
      { label: "Open" },
      { label: "Save" },
      { label: "Save As..." },
      { label: "Section Title", kind: "section" },
      { label: "Print", disabled: true },
      { label: "Export", disabled: true },
      { label: "Section Title", kind: "section" },
      { label: "Close" },
    ],
  },
};

export const SimpleList: Story = {
  args: {
    trigger: <Button variant="ghost">Sort By</Button>,
    items: [
      { label: "Name (A-Z)" },
      { label: "Name (Z-A)" },
      { label: "Date (Newest)" },
      { label: "Date (Oldest)" },
      { label: "Size" },
    ],
  },
};

export const SectionedSingleSelect: Story = {
  render: () => {
    const [selected, setSelected] = useState("opt-1");
    return (
      <DropdownMenu
        trigger={<Button variant="secondary">Select Option</Button>}
        selectionMode="single"
        selectedValues={[selected]}
        items={[
          { label: "Section Title", kind: "section" },
          { id: "s1", value: "opt-1", label: "Option", selectable: true, onClick: () => setSelected("opt-1") },
          { id: "s2", value: "opt-2", label: "Option", selectable: true, onClick: () => setSelected("opt-2") },
          { id: "s3", value: "opt-3", label: "Option", selectable: true, onClick: () => setSelected("opt-3") },
          { label: "Section Title", kind: "section" },
          { id: "s4", value: "opt-4", label: "Option", selectable: true, onClick: () => setSelected("opt-4") },
        ]}
      />
    );
  },
  args: {
    trigger: undefined,
    items: [],
  },
};

export const ScrollableSectioned: Story = {
  args: {
    trigger: <Button variant="secondary">Long List</Button>,
    maxHeight: 220,
    items: [
      { label: "Section Title", kind: "section" },
      { label: "Option", selectable: true },
      { label: "Option", selectable: true },
      { label: "Option", selectable: true },
      { label: "Option", selectable: true },
      { label: "Section Title", kind: "section" },
      { label: "Option", selectable: true },
      { label: "Option", selectable: true },
      { label: "Option", selectable: true },
      { label: "Option", selectable: true },
      { label: "Option", selectable: true },
    ],
  },
};

export const SectionedMultiSelect: Story = {
  render: () => {
    const [selectedValues, setSelectedValues] = useState<string[]>(["opt-1", "opt-3"]);
    const toggle = (value: string) =>
      setSelectedValues((prev) =>
        prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
      );

    return (
      <DropdownMenu
        trigger={<Button variant="secondary">Select Multiple</Button>}
        selectionMode="multi"
        selectedValues={selectedValues}
        items={[
          { label: "Section Title", kind: "section" },
          { id: "m1", value: "opt-1", label: "Option", selectable: true, onClick: () => toggle("opt-1") },
          { id: "m2", value: "opt-2", label: "Option", selectable: true, onClick: () => toggle("opt-2") },
          { id: "m3", value: "opt-3", label: "Option", selectable: true, onClick: () => toggle("opt-3") },
          { label: "Section Title", kind: "section" },
          { id: "m4", value: "opt-4", label: "Option", selectable: true, onClick: () => toggle("opt-4") },
          { id: "m5", value: "opt-5", label: "Option", selectable: true, onClick: () => toggle("opt-5") },
        ]}
      />
    );
  },
  args: {
    trigger: undefined,
    items: [],
  },
};

export const PersistentOpenSelection: Story = {
  render: () => {
    const [single, setSingle] = useState("s-1");
    const [multi, setMulti] = useState<string[]>(["m-1"]);

    const toggleMulti = (value: string) =>
      setMulti((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));

    return (
      <div style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>
        <DropdownMenu
          trigger={<Button variant="secondary">Single-select (stays open)</Button>}
          selectionMode="single"
          selectedValues={[single]}
          items={[
            { label: "Section Title", kind: "section" },
            { id: "s-1", value: "s-1", label: "Option", selectable: true, onClick: () => setSingle("s-1") },
            { id: "s-2", value: "s-2", label: "Option", selectable: true, onClick: () => setSingle("s-2") },
            { id: "s-3", value: "s-3", label: "Option", selectable: true, onClick: () => setSingle("s-3") },
          ]}
        />
        <div style={{ fontSize: 12, color: "var(--color-text-neutral-strong)" }}>
          Selected single: <code>{single}</code>
        </div>
        <DropdownMenu
          trigger={<Button variant="secondary">Multi-select (stays open)</Button>}
          selectionMode="multi"
          selectedValues={multi}
          items={[
            { label: "Section Title", kind: "section" },
            { id: "m-1", value: "m-1", label: "Option", selectable: true, onClick: () => toggleMulti("m-1") },
            { id: "m-2", value: "m-2", label: "Option", selectable: true, onClick: () => toggleMulti("m-2") },
            { id: "m-3", value: "m-3", label: "Option", selectable: true, onClick: () => toggleMulti("m-3") },
          ]}
        />
        <div style={{ fontSize: 12, color: "var(--color-text-neutral-strong)" }}>
          Selected multi: <code>{multi.join(", ") || "(none)"}</code>
        </div>
      </div>
    );
  },
  args: {
    trigger: undefined,
    items: [],
  },
};

export const DisabledOptionsSelection: Story = {
  render: () => {
    const [single, setSingle] = useState("d-s-1");
    const [multi, setMulti] = useState<string[]>(["d-m-1"]);

    const toggleMulti = (value: string) =>
      setMulti((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));

    return (
      <div style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>
        <DropdownMenu
          trigger={<Button variant="secondary">Single-select + disabled</Button>}
          selectionMode="single"
          selectedValues={[single]}
          items={[
            { label: "Section Title", kind: "section" },
            { id: "d-s-1", value: "d-s-1", label: "Option", selectable: true, onClick: () => setSingle("d-s-1") },
            { id: "d-s-2", value: "d-s-2", label: "Option", selectable: true, disabled: true, onClick: () => setSingle("d-s-2") },
            { id: "d-s-3", value: "d-s-3", label: "Option", selectable: true, onClick: () => setSingle("d-s-3") },
          ]}
        />
        <DropdownMenu
          trigger={<Button variant="secondary">Multi-select + disabled</Button>}
          selectionMode="multi"
          selectedValues={multi}
          items={[
            { label: "Section Title", kind: "section" },
            { id: "d-m-1", value: "d-m-1", label: "Option", selectable: true, onClick: () => toggleMulti("d-m-1") },
            { id: "d-m-2", value: "d-m-2", label: "Option", selectable: true, disabled: true, onClick: () => toggleMulti("d-m-2") },
            { id: "d-m-3", value: "d-m-3", label: "Option", selectable: true, onClick: () => toggleMulti("d-m-3") },
          ]}
        />
      </div>
    );
  },
  args: {
    trigger: undefined,
    items: [],
  },
};

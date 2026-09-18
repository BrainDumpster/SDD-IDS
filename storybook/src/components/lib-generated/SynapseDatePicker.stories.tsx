/**
 * Storybook: design-spec–generated Date Picker from `lib/react/synapse/date-picker`
 * (IDS-fork reexport façade — React + CSS Modules).
 *
 * Anatomy:
 *   DatePickerRoot → Label? → FieldContainer(TextInput + CalendarIconTrigger)
 *     → FormatHint | ValidationError? → CalendarPopup?
 *
 * Theme: components/synapse-theme.css
 * Spec: components/synapse/date-picker/design-spec.md
 */
import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/synapse-theme.css";
import {
  SYNAPSE_DATE_PICKER_DOCS_DESCRIPTION,
  SYNAPSE_DATE_PICKER_SOURCE_CODE,
} from "./synapse-date-picker.developer-usage";
import { SynapseDatePicker } from "@synapse/react/date-picker";

const DESIGN_SPEC_PATH = "components/synapse/date-picker/design-spec.md";

const meta: Meta<typeof SynapseDatePicker> = {
  tags: ["autodocs"],
  title: "Components/Synapse/Date Picker",
  component: SynapseDatePicker,
  parameters: {
    layout: "padded",
    docs: {
      canvas: { sourceState: "open" },
      description: {
        component: SYNAPSE_DATE_PICKER_DOCS_DESCRIPTION,
      },
      source: {
        type: "code",
        language: "tsx",
        code: SYNAPSE_DATE_PICKER_SOURCE_CODE,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof SynapseDatePicker>;

export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  render: () => (
    <div style={{ padding: 24, maxWidth: 320 }}>
      <SynapseDatePicker size="large" label="Start date" placeholder="MM-DD-YYYY" />
    </div>
  ),
};

export const Sizes: Story = {
  name: "Large & Small",
  render: () => (
    <div style={{ padding: 24, display: "flex", gap: 48, alignItems: "flex-start" }}>
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", opacity: 0.6, marginBottom: 8 }}>
          Large (40 px)
        </div>
        <SynapseDatePicker size="large" label="Date" value={new Date(2026, 0, 18)} />
      </div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", opacity: 0.6, marginBottom: 8 }}>
          Small (32 px)
        </div>
        <SynapseDatePicker size="small" label="Date" value={new Date(2026, 0, 18)} />
      </div>
    </div>
  ),
};

export const FieldStates: Story = {
  name: "Field States",
  render: () => (
    <div style={{ padding: 24, display: "flex", gap: 48, flexWrap: "wrap", alignItems: "flex-start" }}>
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", opacity: 0.6, marginBottom: 8 }}>
          Default
        </div>
        <SynapseDatePicker size="large" label="Date" />
      </div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", opacity: 0.6, marginBottom: 8 }}>
          Filled
        </div>
        <SynapseDatePicker size="large" label="Date" value={new Date(2026, 0, 18)} />
      </div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", opacity: 0.6, marginBottom: 8 }}>
          Disabled (filled)
        </div>
        <SynapseDatePicker size="large" label="Date" disabled value={new Date(2026, 0, 18)} />
      </div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", opacity: 0.6, marginBottom: 8 }}>
          Disabled (empty)
        </div>
        <SynapseDatePicker size="large" label="Date" disabled />
      </div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", opacity: 0.6, marginBottom: 8 }}>
          Error
        </div>
        <SynapseDatePicker size="large" label="Date" error errorMessage="Invalid date format" />
      </div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", opacity: 0.6, marginBottom: 8 }}>
          Custom format
        </div>
        <SynapseDatePicker size="large" label="Date" formatHint="DD/MM/YYYY" dateFormat="DD/MM/YYYY" />
      </div>
    </div>
  ),
};

export const CalendarOpen: Story = {
  name: "Calendar Open",
  render: () => (
    <div style={{ padding: 24, paddingBottom: 520, maxWidth: 320 }}>
      <SynapseDatePicker size="large" label="Date" value={new Date(2026, 0, 18)} forceOpen />
    </div>
  ),
};

export const CalendarOpenSmall: Story = {
  name: "Calendar Open — Small",
  render: () => (
    <div style={{ padding: 24, paddingBottom: 520, maxWidth: 320 }}>
      <SynapseDatePicker size="small" label="Date" value={new Date(2026, 4, 25)} forceOpen />
    </div>
  ),
};

function InteractiveDemo() {
  const [value, setValue] = useState<Date | null>(new Date(2026, 0, 18));
  return (
    <div style={{ padding: 24, paddingBottom: 520, maxWidth: 320 }}>
      <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8 }}>
        Selected: {value ? value.toLocaleDateString() : "none"}
      </div>
      <SynapseDatePicker size="large" label="Pick a date" value={value} onChange={setValue} />
    </div>
  );
}

export const Interactive: Story = {
  render: () => <InteractiveDemo />,
};

export const RestrictedDates: Story = {
  name: "Restricted Dates — Unavailable",
  render: () => {
    const today = new Date();
    const viewMonth = today.getMonth();
    const viewYear = today.getFullYear();
    return (
      <div style={{ padding: 24, paddingBottom: 520, maxWidth: 320 }}>
        <SynapseDatePicker
          size="large"
          label="Availability"
          value={new Date(viewYear, viewMonth, 15)}
          forceOpen
          disabledDates={[
            new Date(viewYear, viewMonth, 10),
            new Date(viewYear, viewMonth, 11),
            new Date(viewYear, viewMonth, today.getDate()),
            new Date(viewYear, viewMonth, 20),
            new Date(viewYear, viewMonth, 21),
          ]}
        />
      </div>
    );
  },
};

function RangeDemo() {
  const [start, setStart] = useState<Date | null>(null);
  const [end, setEnd] = useState<Date | null>(null);
  return (
    <div style={{ padding: 24, paddingBottom: 520, maxWidth: 320 }}>
      <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8 }}>
        Range: {start ? start.toLocaleDateString() : "—"} → {end ? end.toLocaleDateString() : "—"}
      </div>
      <SynapseDatePicker
        size="large"
        label="Date range"
        rangeMode
        rangeStart={start}
        rangeEnd={end}
        onRangeChange={(s, e) => {
          setStart(s);
          setEnd(e);
        }}
        forceOpen
      />
    </div>
  );
}

export const RangeSelection: Story = {
  name: "Range Selection",
  render: () => <RangeDemo />,
};

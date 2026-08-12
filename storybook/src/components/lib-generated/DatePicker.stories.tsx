/**
 * Storybook: design-spec–generated Date Picker from `lib/react/ids/date-picker`
 * (React + CSS Modules, no @base-ui-components).
 *
 * Anatomy:
 *   DatePickerRoot → Label? → FieldContainer(TextInput + CalendarIconTrigger)
 *     → FormatHint | ValidationError? → CalendarPopup?
 *
 * Theme: components/ids-theme.css
 * Spec: components/ids/date-picker/design-spec.md
 */
import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/ids-theme.css";
import { IdsDatePicker } from "../../../../lib/react/ids/date-picker";

const DESIGN_SPEC_PATH = "components/ids/date-picker/design-spec.md";

const meta: Meta<typeof IdsDatePicker> = {
  title: "Lib Generated/IDS/Date Picker",
  component: IdsDatePicker,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          `React IDS Date Picker from \`${DESIGN_SPEC_PATH}\`. ` +
          "Sizes: large (40px) / small (32px). Range mode and unavailable dates per Figma. " +
          "Theme: `components/ids-theme.css`. No `@base-ui-components`.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof IdsDatePicker>;

export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  render: () => (
    <div style={{ padding: 24, maxWidth: 320 }}>
      <IdsDatePicker size="large" label="Start date" placeholder="MM-DD-YYYY" />
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
        <IdsDatePicker size="large" label="Date" value={new Date(2026, 0, 18)} />
      </div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", opacity: 0.6, marginBottom: 8 }}>
          Small (32 px)
        </div>
        <IdsDatePicker size="small" label="Date" value={new Date(2026, 0, 18)} />
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
        <IdsDatePicker size="large" label="Date" />
      </div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", opacity: 0.6, marginBottom: 8 }}>
          Filled
        </div>
        <IdsDatePicker size="large" label="Date" value={new Date(2026, 0, 18)} />
      </div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", opacity: 0.6, marginBottom: 8 }}>
          Disabled (filled)
        </div>
        <IdsDatePicker size="large" label="Date" disabled value={new Date(2026, 0, 18)} />
      </div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", opacity: 0.6, marginBottom: 8 }}>
          Disabled (empty)
        </div>
        <IdsDatePicker size="large" label="Date" disabled />
      </div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", opacity: 0.6, marginBottom: 8 }}>
          Error
        </div>
        <IdsDatePicker size="large" label="Date" error errorMessage="Invalid date format" />
      </div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", opacity: 0.6, marginBottom: 8 }}>
          Custom format
        </div>
        <IdsDatePicker size="large" label="Date" formatHint="DD/MM/YYYY" dateFormat="DD/MM/YYYY" />
      </div>
    </div>
  ),
};

export const CalendarOpen: Story = {
  name: "Calendar Open",
  render: () => (
    <div style={{ padding: 24, paddingBottom: 520, maxWidth: 320 }}>
      <IdsDatePicker size="large" label="Date" value={new Date(2026, 0, 18)} forceOpen />
    </div>
  ),
};

export const CalendarOpenSmall: Story = {
  name: "Calendar Open — Small",
  render: () => (
    <div style={{ padding: 24, paddingBottom: 520, maxWidth: 320 }}>
      <IdsDatePicker size="small" label="Date" value={new Date(2026, 4, 25)} forceOpen />
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
      <IdsDatePicker size="large" label="Pick a date" value={value} onChange={setValue} />
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
        <IdsDatePicker
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
      <IdsDatePicker
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

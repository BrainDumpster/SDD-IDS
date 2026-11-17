/**
 * Storybook: IDS Lit Date Picker from `lib/lit/ids/date-picker`
 *
 * Theme: components/ids-theme.css (via preview)
 * Spec: components/ids/date-picker/design-spec.md
 * API: lib/react/ids/date-picker · storybook/src/components/lib-generated/DatePicker.stories.tsx
 *
 * Live Figma verified 2026-11-06: overview `42159:132058`, field `42159:133115`,
 * calendar Default `42159:132612`, date cell `42159:132767`.
 */
import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { useArgs } from "@storybook/preview-api";
import "@ids/core/date-picker/register.js";
import {
  DATE_PICKER_DOCS_DESCRIPTION,
  DATE_PICKER_SOURCE_CODE,
} from "./ids-date-picker.developer-usage";

const host = (content: unknown, opts?: { maxWidth?: number; padBottom?: number }) => html`
  <div
    style="padding: 24px; max-width: ${opts?.maxWidth ?? 320}px; padding-bottom: ${opts?.padBottom ?? 24}px; box-sizing: border-box"
  >
    ${content}
  </div>
`;

const meta: Meta = {
  title: "Spec Generated/IDS/Date Picker",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: { component: DATE_PICKER_DOCS_DESCRIPTION },
      source: { code: DATE_PICKER_SOURCE_CODE, language: "html" },
    },
  },
  argTypes: {
    size: { control: "select", options: ["large", "small"] },
    label: { control: "text" },
    disabled: { control: "boolean" },
    error: { control: "boolean" },
    required: { control: "boolean" },
    forceOpen: { control: "boolean" },
  },
  args: {
    size: "large",
    label: "Start date",
    disabled: false,
    error: false,
    required: false,
    forceOpen: false,
  },
};

export default meta;
type Story = StoryObj;

/** Spec Accurate Design — large field with label (Figma overview / field `42159:133115`). */
export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  render: (args) =>
    host(html`
      <ids-date-picker
        size=${args.size as string}
        label=${args.label as string}
        placeholder="MM-DD-YYYY"
        ?disabled=${Boolean(args.disabled)}
        ?error=${Boolean(args.error)}
        ?required=${Boolean(args.required)}
        ?forceopen=${Boolean(args.forceOpen)}
      ></ids-date-picker>
    `),
};

export const Sizes: Story = {
  name: "Large & Small",
  render: () => html`
    <div
      style="padding: 24px; display: flex; gap: 48px; align-items: flex-start"
    >
      <div>
        <div
          style="font-size: 11px; font-weight: 600; text-transform: uppercase; opacity: 0.6; margin-bottom: 8px"
        >
          Large (40 px)
        </div>
        <ids-date-picker
          size="large"
          label="Date"
          .value=${new Date(2026, 0, 18)}
        ></ids-date-picker>
      </div>
      <div>
        <div
          style="font-size: 11px; font-weight: 600; text-transform: uppercase; opacity: 0.6; margin-bottom: 8px"
        >
          Small (32 px)
        </div>
        <ids-date-picker
          size="small"
          label="Date"
          .value=${new Date(2026, 0, 18)}
        ></ids-date-picker>
      </div>
    </div>
  `,
};

export const FieldStates: Story = {
  name: "Field States",
  render: () => html`
    <div
      style="padding: 24px; display: flex; gap: 48px; flex-wrap: wrap; align-items: flex-start"
    >
      <div>
        <div
          style="font-size: 11px; font-weight: 600; text-transform: uppercase; opacity: 0.6; margin-bottom: 8px"
        >
          Default
        </div>
        <ids-date-picker size="large" label="Date"></ids-date-picker>
      </div>
      <div>
        <div
          style="font-size: 11px; font-weight: 600; text-transform: uppercase; opacity: 0.6; margin-bottom: 8px"
        >
          Filled
        </div>
        <ids-date-picker
          size="large"
          label="Date"
          .value=${new Date(2026, 0, 18)}
        ></ids-date-picker>
      </div>
      <div>
        <div
          style="font-size: 11px; font-weight: 600; text-transform: uppercase; opacity: 0.6; margin-bottom: 8px"
        >
          Disabled (filled)
        </div>
        <ids-date-picker
          size="large"
          label="Date"
          disabled
          .value=${new Date(2026, 0, 18)}
        ></ids-date-picker>
      </div>
      <div>
        <div
          style="font-size: 11px; font-weight: 600; text-transform: uppercase; opacity: 0.6; margin-bottom: 8px"
        >
          Disabled (empty)
        </div>
        <ids-date-picker size="large" label="Date" disabled></ids-date-picker>
      </div>
      <div>
        <div
          style="font-size: 11px; font-weight: 600; text-transform: uppercase; opacity: 0.6; margin-bottom: 8px"
        >
          Error
        </div>
        <ids-date-picker
          size="large"
          label="Date"
          error
          errormessage="Invalid date format"
        ></ids-date-picker>
      </div>
      <div>
        <div
          style="font-size: 11px; font-weight: 600; text-transform: uppercase; opacity: 0.6; margin-bottom: 8px"
        >
          Custom format
        </div>
        <ids-date-picker
          size="large"
          label="Date"
          formathint="DD/MM/YYYY"
          dateformat="DD/MM/YYYY"
        ></ids-date-picker>
      </div>
    </div>
  `,
};

export const CalendarOpen: Story = {
  name: "Calendar Open",
  render: () =>
    host(
      html`
        <ids-date-picker
          size="large"
          label="Date"
          forceopen
          .value=${new Date(2026, 0, 18)}
        ></ids-date-picker>
      `,
      { padBottom: 520 },
    ),
};

export const CalendarOpenSmall: Story = {
  name: "Calendar Open — Small",
  render: () =>
    host(
      html`
        <ids-date-picker
          size="small"
          label="Date"
          forceopen
          .value=${new Date(2026, 4, 25)}
        ></ids-date-picker>
      `,
      { padBottom: 520 },
    ),
};

export const Interactive: Story = {
  name: "Interactive",
  render: function InteractiveRender() {
    const [args, updateArgs] = useArgs();
    const value = (args.value as Date | null | undefined) ?? new Date(2026, 0, 18);
    return host(
      html`
        <div style="font-size: 12px; opacity: 0.6; margin-bottom: 8px">
          Selected: ${value ? value.toLocaleDateString() : "none"}
        </div>
        <ids-date-picker
          size="large"
          label="Pick a date"
          .value=${value}
          @change=${(e: CustomEvent<{ date: Date | null }>) => {
            updateArgs({ value: e.detail.date });
          }}
        ></ids-date-picker>
      `,
      { padBottom: 520 },
    );
  },
};

export const RestrictedDates: Story = {
  name: "Restricted Dates — Unavailable",
  render: () => {
    const today = new Date();
    const viewMonth = today.getMonth();
    const viewYear = today.getFullYear();
    return host(
      html`
        <ids-date-picker
          size="large"
          label="Availability"
          forceopen
          .value=${new Date(viewYear, viewMonth, 15)}
          .disabledDates=${[
            new Date(viewYear, viewMonth, 10),
            new Date(viewYear, viewMonth, 11),
            new Date(viewYear, viewMonth, today.getDate()),
            new Date(viewYear, viewMonth, 20),
            new Date(viewYear, viewMonth, 21),
          ]}
        ></ids-date-picker>
      `,
      { padBottom: 520 },
    );
  },
};

export const RangeSelection: Story = {
  name: "Range Selection",
  render: function RangeRender() {
    const [args, updateArgs] = useArgs();
    const start = (args.rangeStart as Date | null | undefined) ?? null;
    const end = (args.rangeEnd as Date | null | undefined) ?? null;
    return host(
      html`
        <div style="font-size: 12px; opacity: 0.6; margin-bottom: 8px">
          Range: ${start ? start.toLocaleDateString() : "—"} →
          ${end ? end.toLocaleDateString() : "—"}
        </div>
        <ids-date-picker
          size="large"
          label="Date range"
          rangemode
          forceopen
          .rangeStart=${start}
          .rangeEnd=${end}
          @range-change=${(
            e: CustomEvent<{ start: Date | null; end: Date | null }>,
          ) => {
            updateArgs({ rangeStart: e.detail.start, rangeEnd: e.detail.end });
          }}
        ></ids-date-picker>
      `,
      { padBottom: 520 },
    );
  },
};

export const DateRangePicker: Story = {
  name: "Date Range Picker (two fields)",
  render: function TwoFieldRender() {
    const [args, updateArgs] = useArgs();
    const today = new Date();
    const y = today.getFullYear();
    const m = today.getMonth();
    const start =
      (args.rangeStart as Date | null | undefined) ?? new Date(y, m, 8);
    const end =
      (args.rangeEnd as Date | null | undefined) ?? new Date(y, m, 16);
    const onRange = (
      e: CustomEvent<{ start: Date | null; end: Date | null }>,
    ) => {
      updateArgs({ rangeStart: e.detail.start, rangeEnd: e.detail.end });
    };
    return html`
      <div style="padding: 24px; padding-bottom: 520px">
        <div style="display: flex; gap: 16px; align-items: flex-start">
          <div style="max-width: 220px">
            <ids-date-picker
              label="Start date"
              rangemode
              rangefield="start"
              .rangeStart=${start}
              .rangeEnd=${end}
              @range-change=${onRange}
            ></ids-date-picker>
          </div>
          <div style="max-width: 220px">
            <ids-date-picker
              label="End date"
              rangemode
              rangefield="end"
              .rangeStart=${start}
              .rangeEnd=${end}
              @range-change=${onRange}
            ></ids-date-picker>
          </div>
        </div>
        <p
          style="margin-top: 12px; font-size: 12px; color: var(--color-text-gray-neutral)"
        >
          Two horizontally aligned pickers share one range. Open either calendar
          and pick two dates — the overlay highlights the range while selecting,
          and both fields update.
        </p>
      </div>
    `;
  },
};

export const RangeValidation: Story = {
  name: "Date Range Validation (From / To)",
  render: function RangeValidationRender() {
    const [args, updateArgs] = useArgs();
    const start = (args.rangeStart as Date | null | undefined) ?? null;
    const end =
      (args.rangeEnd as Date | null | undefined) ?? new Date(2023, 0, 18);
    const onRange = (
      e: CustomEvent<{ start: Date | null; end: Date | null }>,
    ) => {
      updateArgs({ rangeStart: e.detail.start, rangeEnd: e.detail.end });
    };
    return html`
      <div
        style="padding: 24px; padding-bottom: 520px; display: flex; gap: 24px; flex-wrap: wrap; align-items: flex-start"
      >
        <div style="max-width: 260px">
          <ids-date-picker
            label="Start"
            required
            rangemode
            rangefield="start"
            .rangeStart=${start}
            .rangeEnd=${end}
            @range-change=${onRange}
          ></ids-date-picker>
        </div>
        <div style="max-width: 260px">
          <ids-date-picker
            label="End"
            required
            rangemode
            rangefield="end"
            .rangeStart=${start}
            .rangeEnd=${end}
            @range-change=${onRange}
          ></ids-date-picker>
        </div>
      </div>
    `;
  },
};

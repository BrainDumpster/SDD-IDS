import { applicationConfig, moduleMetadata } from "@storybook/angular";
import { provideZoneChangeDetection } from "@angular/core";
import { SPEC_ACCURATE_DESIGN_STORY } from "../../../compiled/component-contracts/common/story-meta.js";
import {
  DATE_PICKER_SPEC_ACCURATE_DEFAULTS,
  IDS_DATE_PICKER_SIZE_OPTIONS,
} from "../../../compiled/component-contracts/ids/date-picker.contract.js";
import { IdsDatePickerComponent } from "../../../compiled/lib/angular/ids/date-picker/ids-date-picker.component.js";
import { IDS_DATE_PICKER_IMPORTS } from "../../../compiled/lib/angular/ids/date-picker/index.js";
import {
  DATE_PICKER_COMPOSITION_DEMO_TEMPLATE,
  DATE_PICKER_DOCS_DESCRIPTION,
  DATE_PICKER_SOURCE_CODE,
  DATE_PICKER_STORY_SOURCE_CODE,
} from "./ids-date-picker.developer-usage.js";

/** @type {import("@storybook/angular").Meta<IdsDatePickerComponent>} */
const meta = {
  title: "Components/IDS/Date Picker",
  component: IdsDatePickerComponent,
  tags: ["autodocs"],
  decorators: [
    applicationConfig({
      providers: [provideZoneChangeDetection()],
    }),
    moduleMetadata({
      imports: [...IDS_DATE_PICKER_IMPORTS],
    }),
  ],
  parameters: {
    layout: "padded",
    docs: {
      canvas: { sourceState: "open" },
      description: { component: DATE_PICKER_DOCS_DESCRIPTION },
      source: {
        type: "code",
        language: "typescript",
        code: DATE_PICKER_SOURCE_CODE,
      },
    },
  },
  argTypes: {
    size: { control: "select", options: [...IDS_DATE_PICKER_SIZE_OPTIONS] },
    label: { control: "text" },
    placeholder: { control: "text" },
    dateFormat: { control: "text" },
    formatHint: { control: "text" },
    required: { control: "boolean" },
    disabled: { control: "boolean" },
    error: { control: "boolean" },
    errorMessage: { control: "text" },
    rangeMode: { control: "boolean" },
    forceOpen: { control: "boolean" },
    onChange: { action: "onChange" },
    onRangeChange: { action: "onRangeChange" },
  },
};

export default meta;

/** @type {import("@storybook/angular").StoryObj<IdsDatePickerComponent>} */
export const SpecAccurateDesign = {
  name: SPEC_ACCURATE_DESIGN_STORY,
  parameters: {
    docs: {
      description: { story: "Spec Accurate Design: large field, empty, format hint MM-DD-YYYY." },
      source: {
        type: "code",
        language: "html",
        code: DATE_PICKER_STORY_SOURCE_CODE,
      },
    },
  },
  render: (args) => {
    const state = { value: args.value ?? null };
    return {
      props: {
        ...args,
        state,
        onDateChange: (next) => {
          state.value = next;
          args.onChange?.(next);
        },
      },
      template: `<div style="padding: 24px;">${DATE_PICKER_COMPOSITION_DEMO_TEMPLATE}</div>`,
    };
  },
  args: {
    size: DATE_PICKER_SPEC_ACCURATE_DEFAULTS.size,
    label: DATE_PICKER_SPEC_ACCURATE_DEFAULTS.label,
    placeholder: DATE_PICKER_SPEC_ACCURATE_DEFAULTS.placeholder,
    dateFormat: DATE_PICKER_SPEC_ACCURATE_DEFAULTS.dateFormat,
    formatHint: DATE_PICKER_SPEC_ACCURATE_DEFAULTS.formatHint,
    required: DATE_PICKER_SPEC_ACCURATE_DEFAULTS.required,
    disabled: DATE_PICKER_SPEC_ACCURATE_DEFAULTS.disabled,
    error: DATE_PICKER_SPEC_ACCURATE_DEFAULTS.error,
  },
};

/** @type {import("@storybook/angular").StoryObj<IdsDatePickerComponent>} */
export const Sizes = {
  name: "Large & Small",
  render: () => ({
    props: { filled: new Date(2026, 0, 18) },
    template: `
      <div style="padding: 24px; display: flex; gap: 48px; align-items: flex-start;">
        <div>
          <div style="font-size: 11px; font-weight: 600; text-transform: uppercase; opacity: 0.6; margin-bottom: 8px;">Large (40 px)</div>
          <ids-date-picker size="large" label="Date" [value]="filled" />
        </div>
        <div>
          <div style="font-size: 11px; font-weight: 600; text-transform: uppercase; opacity: 0.6; margin-bottom: 8px;">Small (32 px)</div>
          <ids-date-picker size="small" label="Date" [value]="filled" />
        </div>
      </div>
    `,
  }),
};

/** @type {import("@storybook/angular").StoryObj<IdsDatePickerComponent>} */
export const States = {
  name: "Field States",
  render: () => ({
    props: { filled: new Date(2026, 0, 18) },
    template: `
      <div style="padding: 24px; display: flex; gap: 48px; flex-wrap: wrap; align-items: flex-start;">
        <div>
          <div style="font-size: 11px; font-weight: 600; text-transform: uppercase; opacity: 0.6; margin-bottom: 8px;">Default</div>
          <ids-date-picker size="large" label="Date" />
        </div>
        <div>
          <div style="font-size: 11px; font-weight: 600; text-transform: uppercase; opacity: 0.6; margin-bottom: 8px;">Filled</div>
          <ids-date-picker size="large" label="Date" [value]="filled" />
        </div>
        <div>
          <div style="font-size: 11px; font-weight: 600; text-transform: uppercase; opacity: 0.6; margin-bottom: 8px;">Disabled (filled)</div>
          <ids-date-picker size="large" label="Date" [disabled]="true" [value]="filled" />
        </div>
        <div>
          <div style="font-size: 11px; font-weight: 600; text-transform: uppercase; opacity: 0.6; margin-bottom: 8px;">Disabled (empty)</div>
          <ids-date-picker size="large" label="Date" [disabled]="true" />
        </div>
        <div>
          <div style="font-size: 11px; font-weight: 600; text-transform: uppercase; opacity: 0.6; margin-bottom: 8px;">Error</div>
          <ids-date-picker size="large" label="Date" [error]="true" errorMessage="Invalid date format" />
        </div>
        <div>
          <div style="font-size: 11px; font-weight: 600; text-transform: uppercase; opacity: 0.6; margin-bottom: 8px;">Custom format hint</div>
          <ids-date-picker size="large" label="Date" formatHint="DD/MM/YYYY" dateFormat="DD/MM/YYYY" />
        </div>
      </div>
    `,
  }),
};

/** @type {import("@storybook/angular").StoryObj<IdsDatePickerComponent>} */
export const CalendarOpen = {
  name: "Calendar Open — Standalone Popup Border",
  render: () => ({
    props: { filled: new Date(2026, 0, 18) },
    template: `
      <div style="padding: 24px; padding-bottom: 520px;">
        <div style="max-width: 320px;">
          <ids-date-picker size="large" label="Date" [value]="filled" [forceOpen]="true" />
        </div>
      </div>
    `,
  }),
};

/** @type {import("@storybook/angular").StoryObj<IdsDatePickerComponent>} */
export const CalendarOpenSmall = {
  name: "Calendar Open — Small",
  render: () => ({
    props: { filled: new Date(2026, 4, 25) },
    template: `
      <div style="padding: 24px; padding-bottom: 520px;">
        <div style="max-width: 320px;">
          <ids-date-picker size="small" label="Date" [value]="filled" [forceOpen]="true" />
        </div>
      </div>
    `,
  }),
};

/** @type {import("@storybook/angular").StoryObj<IdsDatePickerComponent>} */
export const Interactive = {
  render: () => {
    const state = { value: new Date(2026, 0, 18) };
    return {
      props: {
        state,
        onDateChange: (next) => {
          state.value = next;
        },
      },
      template: `
        <div style="padding: 24px; padding-bottom: 520px;">
          <div style="max-width: 320px;">
            <div style="font-size: 12px; opacity: 0.6; margin-bottom: 8px;">
              Selected: {{ state.value ? state.value.toLocaleDateString() : "none" }}
            </div>
            <ids-date-picker
              size="large"
              label="Pick a date"
              [value]="state.value"
              (onChange)="onDateChange($event)"
            />
          </div>
        </div>
      `,
    };
  },
};

/** @type {import("@storybook/angular").StoryObj<IdsDatePickerComponent>} */
export const RestrictedDates = {
  name: "Restricted Dates — Unavailable",
  render: () => {
    const today = new Date();
    const viewMonth = today.getMonth();
    const viewYear = today.getFullYear();
    return {
      props: {
        value: new Date(viewYear, viewMonth, 15),
        disabledDates: [
          new Date(viewYear, viewMonth, 10),
          new Date(viewYear, viewMonth, 11),
          new Date(viewYear, viewMonth, today.getDate()),
          new Date(viewYear, viewMonth, 20),
          new Date(viewYear, viewMonth, 21),
        ],
      },
      template: `
        <div style="padding: 24px; padding-bottom: 520px;">
          <div style="max-width: 320px;">
            <ids-date-picker
              size="large"
              label="Availability"
              [value]="value"
              [forceOpen]="true"
              [disabledDates]="disabledDates"
            />
          </div>
        </div>
      `,
    };
  },
};

/** @type {import("@storybook/angular").StoryObj<IdsDatePickerComponent>} */
export const RestrictedDatesInRange = {
  name: "Restricted Dates — Range Mode",
  render: () => {
    const today = new Date();
    const y = today.getFullYear();
    const m = today.getMonth();
    const state = {
      start: new Date(y, m, 5),
      end: new Date(y, m, 25),
      disabledDates: [
        new Date(y, m, 10),
        new Date(y, m, 11),
        new Date(y, m, 20),
        new Date(y, m, 21),
      ],
    };
    return {
      props: {
        state,
        onRange: (payload) => {
          state.start = payload.start;
          state.end = payload.end;
        },
      },
      template: `
        <div style="padding: 24px; padding-bottom: 520px;">
          <div style="max-width: 320px;">
            <div style="font-size: 12px; opacity: 0.6; margin-bottom: 8px;">
              Restricted dates show gray box, disabled border, and strikethrough (not selectable).
            </div>
            <ids-date-picker
              size="large"
              label="Date range"
              [rangeMode]="true"
              [rangeStart]="state.start"
              [rangeEnd]="state.end"
              [forceOpen]="true"
              [disabledDates]="state.disabledDates"
              (onRangeChange)="onRange($event)"
            />
          </div>
        </div>
      `,
    };
  },
};

/** @type {import("@storybook/angular").StoryObj<IdsDatePickerComponent>} */
export const RangeSelection = {
  render: () => {
    const state = { start: null, end: null };
    return {
      props: {
        state,
        onRange: (payload) => {
          state.start = payload.start;
          state.end = payload.end;
        },
      },
      template: `
        <div style="padding: 24px; padding-bottom: 520px;">
          <div style="max-width: 320px;">
            <div style="font-size: 12px; opacity: 0.6; margin-bottom: 8px;">
              Range: {{ state.start ? state.start.toLocaleDateString() : "—" }} → {{ state.end ? state.end.toLocaleDateString() : "—" }}
            </div>
            <ids-date-picker
              size="large"
              label="Date range"
              [rangeMode]="true"
              [rangeStart]="state.start"
              [rangeEnd]="state.end"
              [forceOpen]="true"
              (onRangeChange)="onRange($event)"
            />
          </div>
        </div>
      `,
    };
  },
};

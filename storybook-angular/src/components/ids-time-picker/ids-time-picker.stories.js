import { applicationConfig, moduleMetadata } from "@storybook/angular";
import { provideZoneChangeDetection } from "@angular/core";
import { SPEC_ACCURATE_DESIGN_STORY } from "../../../compiled/component-contracts/common/story-meta.js";
import {
  IDS_TIME_PICKER_CLOCK_TYPE_OPTIONS,
  IDS_TIME_PICKER_SIZE_OPTIONS,
  TIME_PICKER_SPEC_ACCURATE_DEFAULTS,
} from "../../../compiled/component-contracts/ids/time-picker.contract.js";
import { IdsTimePickerComponent } from "../../../compiled/lib/angular/ids/time-picker/ids-time-picker.component.js";
import { IDS_TIME_PICKER_IMPORTS } from "../../../compiled/lib/angular/ids/time-picker/index.js";
import {
  TIME_PICKER_COMPOSITION_DEMO_TEMPLATE,
  TIME_PICKER_DOCS_DESCRIPTION,
  TIME_PICKER_SOURCE_CODE,
  TIME_PICKER_STORY_SOURCE_CODE,
} from "./ids-time-picker.developer-usage.js";

/** @type {import("@storybook/angular").Meta<IdsTimePickerComponent>} */
const meta = {
  title: "Components/IDS/Time Picker",
  component: IdsTimePickerComponent,
  tags: ["autodocs"],
  decorators: [
    applicationConfig({
      providers: [provideZoneChangeDetection()],
    }),
    moduleMetadata({
      imports: [...IDS_TIME_PICKER_IMPORTS],
    }),
  ],
  parameters: {
    layout: "padded",
    docs: {
      canvas: { sourceState: "open" },
      description: { component: TIME_PICKER_DOCS_DESCRIPTION },
      source: {
        type: "code",
        language: "typescript",
        code: TIME_PICKER_SOURCE_CODE,
      },
    },
  },
  argTypes: {
    size: { control: "select", options: [...IDS_TIME_PICKER_SIZE_OPTIONS] },
    clockType: { control: "select", options: [...IDS_TIME_PICKER_CLOCK_TYPE_OPTIONS] },
    label: { control: "text" },
    placeholder: { control: "text" },
    formatHint: { control: "text" },
    value: { control: "text" },
    showSeconds: { control: "boolean" },
    required: { control: "boolean" },
    disabled: { control: "boolean" },
    error: { control: "boolean" },
    errorMessage: { control: "text" },
    forceOpen: { control: "boolean" },
    onChange: { action: "onChange" },
  },
};

export default meta;

/** @type {import("@storybook/angular").StoryObj<IdsTimePickerComponent>} */
export const SpecAccurateDesign = {
  name: SPEC_ACCURATE_DESIGN_STORY,
  parameters: {
    docs: {
      description: { story: "Spec Accurate Design: large · 12h · 09:30 PM · popup closed." },
      source: {
        type: "code",
        language: "html",
        code: TIME_PICKER_STORY_SOURCE_CODE,
      },
    },
  },
  render: (args) => {
    const state = { value: args.value ?? TIME_PICKER_SPEC_ACCURATE_DEFAULTS.value };
    return {
      props: {
        ...args,
        state,
        onTimeChange: (next) => {
          state.value = next;
          args.onChange?.(next);
        },
      },
      template: `<div style="padding: 24px; max-width: 320px;">${TIME_PICKER_COMPOSITION_DEMO_TEMPLATE}</div>`,
    };
  },
  args: {
    size: TIME_PICKER_SPEC_ACCURATE_DEFAULTS.size,
    label: TIME_PICKER_SPEC_ACCURATE_DEFAULTS.label,
    clockType: TIME_PICKER_SPEC_ACCURATE_DEFAULTS.clockType,
    showSeconds: TIME_PICKER_SPEC_ACCURATE_DEFAULTS.showSeconds,
    value: TIME_PICKER_SPEC_ACCURATE_DEFAULTS.value,
    formatHint: TIME_PICKER_SPEC_ACCURATE_DEFAULTS.formatHint,
    placeholder: TIME_PICKER_SPEC_ACCURATE_DEFAULTS.placeholder,
    disabled: TIME_PICKER_SPEC_ACCURATE_DEFAULTS.disabled,
    error: TIME_PICKER_SPEC_ACCURATE_DEFAULTS.error,
  },
};

/** @type {import("@storybook/angular").StoryObj<IdsTimePickerComponent>} */
export const Sizes = {
  name: "Large & Small",
  render: () => ({
    template: `
      <div style="padding: 24px; display: flex; gap: 48px; align-items: flex-start;">
        <div>
          <div style="font-size: 11px; font-weight: 600; text-transform: uppercase; opacity: 0.6; margin-bottom: 8px;">Large (40 px)</div>
          <ids-time-picker size="large" label="Time" value="09:30 PM" />
        </div>
        <div>
          <div style="font-size: 11px; font-weight: 600; text-transform: uppercase; opacity: 0.6; margin-bottom: 8px;">Small (32 px)</div>
          <ids-time-picker size="small" label="Time" value="09:30 PM" />
        </div>
      </div>
    `,
  }),
};

/** @type {import("@storybook/angular").StoryObj<IdsTimePickerComponent>} */
export const FieldStates = {
  name: "Field States",
  render: () => ({
    template: `
      <div style="padding: 24px; display: flex; gap: 48px; flex-wrap: wrap; align-items: flex-start;">
        <div style="max-width: 320px;">
          <div style="font-size: 11px; font-weight: 600; text-transform: uppercase; opacity: 0.6; margin-bottom: 8px;">Default</div>
          <ids-time-picker size="large" label="Time" />
        </div>
        <div style="max-width: 320px;">
          <div style="font-size: 11px; font-weight: 600; text-transform: uppercase; opacity: 0.6; margin-bottom: 8px;">Filled</div>
          <ids-time-picker size="large" label="Time" value="09:30 PM" />
        </div>
        <div style="max-width: 320px;">
          <div style="font-size: 11px; font-weight: 600; text-transform: uppercase; opacity: 0.6; margin-bottom: 8px;">Disabled</div>
          <ids-time-picker size="large" label="Time" [disabled]="true" value="09:30 PM" />
        </div>
        <div style="max-width: 320px;">
          <div style="font-size: 11px; font-weight: 600; text-transform: uppercase; opacity: 0.6; margin-bottom: 8px;">Error</div>
          <ids-time-picker size="large" label="Time" [error]="true" errorMessage="Invalid time format" />
        </div>
      </div>
    `,
  }),
};

/** @type {import("@storybook/angular").StoryObj<IdsTimePickerComponent>} */
export const PopupOpen12Hour = {
  name: "Popup Open — 12 Hour",
  render: () => ({
    template: `
      <div style="padding: 24px; padding-bottom: 200px; max-width: 320px;">
        <ids-time-picker
          size="large"
          label="Time"
          clockType="12h"
          value="09:30 PM"
          formatHint="HH:MM AM/PM"
          placeholder="HH:MM AM/PM"
          [forceOpen]="true"
        />
      </div>
    `,
  }),
};

/** @type {import("@storybook/angular").StoryObj<IdsTimePickerComponent>} */
export const PopupOpenSmall = {
  name: "Popup Open — Small",
  render: () => ({
    template: `
      <div style="padding: 24px; padding-bottom: 200px; max-width: 320px;">
        <ids-time-picker size="small" label="Time" value="09:30 PM" [forceOpen]="true" />
      </div>
    `,
  }),
};

/** @type {import("@storybook/angular").StoryObj<IdsTimePickerComponent>} */
export const Format24Hour = {
  name: "24 Hour — No Seconds",
  render: () => ({
    template: `
      <div style="padding: 24px; max-width: 320px;">
        <ids-time-picker
          size="large"
          label="Time"
          clockType="24h"
          value="13:30"
          formatHint="HH:MM"
          placeholder="HH:MM"
          [forceOpen]="true"
        />
      </div>
    `,
  }),
};

/** @type {import("@storybook/angular").StoryObj<IdsTimePickerComponent>} */
export const WithSeconds = {
  name: "12 Hour — With Seconds",
  render: () => ({
    template: `
      <div style="padding: 24px; padding-bottom: 220px; max-width: 360px;">
        <ids-time-picker
          size="large"
          label="Time"
          clockType="12h"
          [showSeconds]="true"
          value="09:30:00 PM"
          formatHint="HH:MM:SS AM/PM"
          [forceOpen]="true"
        />
      </div>
    `,
  }),
};

/** @type {import("@storybook/angular").StoryObj<IdsTimePickerComponent>} */
export const Interactive = {
  render: () => {
    const state = { value: "09:30 PM" };
    return {
      props: {
        state,
        onTimeChange: (next) => {
          state.value = next;
        },
      },
      template: `
        <div style="padding: 24px; padding-bottom: 200px; max-width: 320px;">
          <ids-time-picker
            size="large"
            label="Time"
            [value]="state.value"
            (onChange)="onTimeChange($event)"
          />
          <div style="font-size: 12px; opacity: 0.6; margin-top: 8px;">Selected: {{ state.value ?? "none" }}</div>
        </div>
      `,
    };
  },
};

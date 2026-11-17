/**
 * Storybook: IDS Lit Time Picker from `lib/lit/ids/time-picker`
 *
 * Theme: components/ids-theme.css (via preview)
 * Spec: components/ids/time-picker/design-spec.md
 * API: lib/react/ids/time-picker · storybook/src/components/lib-generated/TimePicker.stories.tsx
 *
 * Live Figma verified 2026-11-10: TimePicker-Main `42159:132203`,
 * TimePicker-Element-Dropdown `42159:132108`.
 */
import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { useArgs } from "@storybook/preview-api";
import "@ids/core/time-picker/register.js";
import {
  TIME_PICKER_DOCS_DESCRIPTION,
  TIME_PICKER_SOURCE_CODE,
} from "./ids-time-picker.developer-usage";

const host = (content: unknown, opts?: { maxWidth?: number; padBottom?: number }) => html`
  <div
    style="padding: 24px; max-width: ${opts?.maxWidth ?? 320}px; padding-bottom: ${opts?.padBottom ?? 24}px; box-sizing: border-box"
  >
    ${content}
  </div>
`;

const meta: Meta = {
  title: "Spec Generated/IDS/Time Picker",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: { component: TIME_PICKER_DOCS_DESCRIPTION },
      source: { code: TIME_PICKER_SOURCE_CODE, language: "html" },
    },
  },
  argTypes: {
    size: { control: "select", options: ["large", "small"] },
    clockType: { control: "select", options: ["12h", "24h"] },
    label: { control: "text" },
    value: { control: "text" },
    disabled: { control: "boolean" },
    error: { control: "boolean" },
    required: { control: "boolean" },
    showSeconds: { control: "boolean" },
    forceOpen: { control: "boolean" },
  },
  args: {
    size: "large",
    label: "Time",
    clockType: "12h",
    showSeconds: false,
    value: "09:30 PM",
    formatHint: "HH:MM AM/PM",
    placeholder: "HH:MM AM/PM",
    disabled: false,
    error: false,
    required: false,
    forceOpen: false,
  },
};

export default meta;
type Story = StoryObj;

/** Spec Accurate Design — large field with label (Figma TimePicker-Main). */
export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  render: (args) =>
    host(html`
      <ids-time-picker
        size=${args.size as string}
        label=${args.label as string}
        clocktype=${args.clockType as string}
        formathint=${args.formatHint as string}
        placeholder=${args.placeholder as string}
        .value=${(args.value as string) || null}
        ?showseconds=${Boolean(args.showSeconds)}
        ?disabled=${Boolean(args.disabled)}
        ?error=${Boolean(args.error)}
        ?required=${Boolean(args.required)}
        ?forceopen=${Boolean(args.forceOpen)}
      ></ids-time-picker>
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
        <ids-time-picker
          size="large"
          label="Time"
          .value=${"09:30 PM"}
        ></ids-time-picker>
      </div>
      <div>
        <div
          style="font-size: 11px; font-weight: 600; text-transform: uppercase; opacity: 0.6; margin-bottom: 8px"
        >
          Small (32 px)
        </div>
        <ids-time-picker
          size="small"
          label="Time"
          .value=${"09:30 PM"}
        ></ids-time-picker>
      </div>
    </div>
  `,
};

export const RequiredLabel: Story = {
  name: "Required Label",
  parameters: {
    docs: {
      description: {
        story:
          "Inline Form Label parity: `required` renders `*` in " +
          "`var(--color-text-gray-neutral-strong)`. The marker is `aria-hidden`; " +
          "the field announces required via `aria-required` on the input.",
      },
    },
  },
  render: () => html`
    <div
      style="padding: 24px; display: flex; gap: 48px; align-items: flex-start"
    >
      <div>
        <div
          style="font-size: 11px; font-weight: 600; text-transform: uppercase; opacity: 0.6; margin-bottom: 8px"
        >
          Large, required
        </div>
        <ids-time-picker
          size="large"
          label="Time"
          required
          .value=${"09:30 PM"}
        ></ids-time-picker>
      </div>
      <div>
        <div
          style="font-size: 11px; font-weight: 600; text-transform: uppercase; opacity: 0.6; margin-bottom: 8px"
        >
          Small, required
        </div>
        <ids-time-picker
          size="small"
          label="Time"
          required
          .value=${"09:30 PM"}
        ></ids-time-picker>
      </div>
      <div>
        <div
          style="font-size: 11px; font-weight: 600; text-transform: uppercase; opacity: 0.6; margin-bottom: 8px"
        >
          Not required
        </div>
        <ids-time-picker
          size="large"
          label="Time"
          .value=${"09:30 PM"}
        ></ids-time-picker>
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
      <div style="max-width: 320px">
        <div
          style="font-size: 11px; font-weight: 600; text-transform: uppercase; opacity: 0.6; margin-bottom: 8px"
        >
          Default
        </div>
        <ids-time-picker size="large" label="Time"></ids-time-picker>
      </div>
      <div style="max-width: 320px">
        <div
          style="font-size: 11px; font-weight: 600; text-transform: uppercase; opacity: 0.6; margin-bottom: 8px"
        >
          Filled
        </div>
        <ids-time-picker
          size="large"
          label="Time"
          .value=${"09:30 PM"}
        ></ids-time-picker>
      </div>
      <div style="max-width: 320px">
        <div
          style="font-size: 11px; font-weight: 600; text-transform: uppercase; opacity: 0.6; margin-bottom: 8px"
        >
          Disabled
        </div>
        <ids-time-picker
          size="large"
          label="Time"
          disabled
          .value=${"09:30 PM"}
        ></ids-time-picker>
      </div>
      <div style="max-width: 320px">
        <div
          style="font-size: 11px; font-weight: 600; text-transform: uppercase; opacity: 0.6; margin-bottom: 8px"
        >
          Error
        </div>
        <ids-time-picker
          size="large"
          label="Time"
          error
          errormessage="Invalid time format"
        ></ids-time-picker>
      </div>
    </div>
  `,
};

export const PopupOpen12Hour: Story = {
  name: "Popup Open — 12 Hour",
  args: {
    size: "large",
    label: "Time",
    clockType: "12h",
    value: "09:30 PM",
    formatHint: "HH:MM AM/PM",
    forceOpen: true,
  },
  render: (args) =>
    host(
      html`
        <ids-time-picker
          size=${args.size as string}
          label=${args.label as string}
          clocktype=${args.clockType as string}
          formathint=${args.formatHint as string}
          .value=${args.value as string}
          ?forceopen=${Boolean(args.forceOpen)}
        ></ids-time-picker>
      `,
      { padBottom: 200 },
    ),
};

export const PopupOpenSmall: Story = {
  name: "Popup Open — Small",
  render: () =>
    host(
      html`
        <ids-time-picker
          size="small"
          label="Time"
          .value=${"09:30 PM"}
          forceopen
        ></ids-time-picker>
      `,
      { padBottom: 200 },
    ),
};

export const Format24Hour: Story = {
  name: "24 Hour — No Seconds",
  render: () =>
    host(html`
      <ids-time-picker
        size="large"
        label="Time"
        clocktype="24h"
        .value=${"13:30"}
        formathint="HH:MM"
        placeholder="HH:MM"
        forceopen
      ></ids-time-picker>
    `),
};

export const WithSeconds: Story = {
  name: "12 Hour — With Seconds",
  render: () =>
    host(
      html`
        <ids-time-picker
          size="large"
          label="Time"
          clocktype="12h"
          showseconds
          .value=${"09:30:00 PM"}
          formathint="HH:MM:SS AM/PM"
          forceopen
        ></ids-time-picker>
      `,
      { maxWidth: 360, padBottom: 220 },
    ),
};

export const Interactive: Story = {
  name: "Interactive",
  render: function InteractiveRender(args) {
    const [, updateArgs] = useArgs();
    return host(
      html`
        <ids-time-picker
          size="large"
          label="Time"
          .value=${(args.value as string) ?? "09:30 PM"}
          @change=${(e: CustomEvent<{ value: string | null }>) => {
            updateArgs({ value: e.detail.value ?? "" });
          }}
        ></ids-time-picker>
        <div style="font-size: 12px; opacity: 0.6; margin-top: 8px">
          Selected: ${(args.value as string) || "none"}
        </div>
      `,
      { padBottom: 200 },
    );
  },
};

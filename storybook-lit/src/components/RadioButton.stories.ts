/**
 * Storybook: IDS Lit Radio Button from `lib/lit/ids/radio-button`
 *
 * Theme: components/ids-theme.css (via preview)
 * Spec: components/ids/radio-button/design-spec.md
 *
 * Labels are projected `<label>` children; `value` stays a prop on ids-radio-button.
 */
import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { useArgs } from "@storybook/preview-api";
import "@ids/core/radio-button/register.js";
import { RADIO_BUTTON_SPEC_ACCURATE_DEFAULTS } from "@ids/core/radio-button/radio-button.constants.js";
import {
  RADIO_BUTTON_DOCS_DESCRIPTION,
  RADIO_BUTTON_SOURCE_CODE,
} from "./ids-radio-button.developer-usage";

type RadioGroupArgs = {
  name: string;
  value?: string;
  defaultValue: string;
  disabled: boolean;
  orientation: "vertical" | "horizontal";
  groupLabel: string;
  showLabel: boolean;
  required: boolean;
  labelPosition: "left" | "top";
  labelIcon: boolean;
  error: boolean;
  errorText: string;
};

const meta: Meta<RadioGroupArgs> = {
  title: "Spec Generated/IDS/Radio Button",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: { component: RADIO_BUTTON_DOCS_DESCRIPTION },
      source: { code: RADIO_BUTTON_SOURCE_CODE, language: "html" },
    },
  },
  argTypes: {
    name: { control: "text" },
    value: { control: "text" },
    defaultValue: { control: "text" },
    disabled: { control: "boolean" },
    orientation: { control: "select", options: ["vertical", "horizontal"] },
    groupLabel: {
      control: "text",
      description: "Form label projected as a <label> child",
    },
    showLabel: { control: "boolean" },
    required: { control: "boolean" },
    labelPosition: { control: "select", options: ["left", "top"] },
    labelIcon: { control: "boolean" },
    error: { control: "boolean" },
    errorText: { control: "text" },
  },
  args: {
    name: RADIO_BUTTON_SPEC_ACCURATE_DEFAULTS.name,
    defaultValue: RADIO_BUTTON_SPEC_ACCURATE_DEFAULTS.defaultValue,
    disabled: RADIO_BUTTON_SPEC_ACCURATE_DEFAULTS.disabled,
    orientation: RADIO_BUTTON_SPEC_ACCURATE_DEFAULTS.orientation,
    groupLabel: `${RADIO_BUTTON_SPEC_ACCURATE_DEFAULTS.label}:`,
    showLabel: RADIO_BUTTON_SPEC_ACCURATE_DEFAULTS.showLabel,
    required: RADIO_BUTTON_SPEC_ACCURATE_DEFAULTS.required,
    labelPosition: RADIO_BUTTON_SPEC_ACCURATE_DEFAULTS.labelPosition,
    labelIcon: false,
    error: RADIO_BUTTON_SPEC_ACCURATE_DEFAULTS.error,
    errorText: "",
  },
};

export default meta;
type Story = StoryObj<RadioGroupArgs>;

/** Spec Accurate Design: vertical group · three options · option1 selected. */
export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  render: (args) => html`
    <ids-radio-button-group
      name=${args.name}
      defaultvalue=${args.defaultValue}
      ?disabled=${args.disabled}
      orientation=${args.orientation}
      ?showlabel=${args.showLabel}
      ?required=${args.required}
      labelposition=${args.labelPosition}
      ?labelicon=${args.labelIcon}
      ?error=${args.error}
      errortext=${args.errorText || ""}
    >
      <label>${args.groupLabel}</label>
      <ids-radio-button value="option1"><label>Option 1</label></ids-radio-button>
      <ids-radio-button value="option2"><label>Option 2</label></ids-radio-button>
      <ids-radio-button value="option3"><label>Option 3</label></ids-radio-button>
    </ids-radio-button-group>
  `,
};

export const RadioButtonGroup: Story = {
  name: "Radio Button Group",
  render: () => html`
    <ids-radio-button-group
      name="ids-radio-group-demo"
      defaultvalue="email"
      labelposition="left"
      orientation="vertical"
    >
      <label>Notifications:</label>
      <ids-radio-button value="email"><label>Email</label></ids-radio-button>
      <ids-radio-button value="sms"><label>SMS</label></ids-radio-button>
      <ids-radio-button value="push"
        ><label>Push notification</label></ids-radio-button
      >
    </ids-radio-button-group>
  `,
};

export const RadioButtonGroupError: Story = {
  name: "Radio Button Group Error",
  render: () => html`
    <ids-radio-button-group
      name="ids-radio-group-error"
      required
      labelicon
      error
      errortext="You must select an option to continue."
      orientation="vertical"
    >
      <label>Notifications:</label>
      <ids-radio-button value="email"><label>Email</label></ids-radio-button>
      <ids-radio-button value="sms"><label>SMS</label></ids-radio-button>
      <ids-radio-button value="push"
        ><label>Push notification</label></ids-radio-button
      >
    </ids-radio-button-group>
  `,
};

export const LongLabel: Story = {
  name: "Long Label",
  render: () => html`
    <ids-radio-button-group name="ids-radio-long" defaultvalue="long">
      <ids-radio-button value="long">
        <label
          >This is a deliberately long radio option label that keeps going until
          the row reaches its 900px maximum width including the radio control
          itself, at which point the text wraps onto a second line without ever
          truncating, while the radio stays aligned to the top on the first
          line.</label
        >
      </ids-radio-button>
    </ids-radio-button-group>
  `,
};

export const StateMatrix: Story = {
  name: "State Matrix",
  render: () => html`
    <div style="display: grid; gap: 20px;">
      <div
        style="font-size: 12px; color: var(--color-text-gray-neutral-strong);"
      >
        Live groups: hover the Hover row for pointer parity. Focus column pins
        simulatedState focus-visible per Figma node 8505:14225.
      </div>
      <div
        style="display: flex; gap: 28px; flex-wrap: wrap; align-items: flex-start;"
      >
        <ids-radio-button-group name="ids-radio-unselected">
          <ids-radio-button value="default"
            ><label>Default</label></ids-radio-button
          >
          <ids-radio-button value="hover"><label>Hover</label></ids-radio-button>
          <ids-radio-button value="focus" simulatedstate="focus-visible"
            ><label>Focus</label></ids-radio-button
          >
          <ids-radio-button value="disabled" disabled
            ><label>Disabled</label></ids-radio-button
          >
        </ids-radio-button-group>
        <ids-radio-button-group
          name="ids-radio-selected"
          defaultvalue="default"
        >
          <ids-radio-button value="default"
            ><label>Default</label></ids-radio-button
          >
          <ids-radio-button value="hover"><label>Hover</label></ids-radio-button>
          <ids-radio-button value="focus" simulatedstate="focus-visible"
            ><label>Focus</label></ids-radio-button
          >
          <ids-radio-button value="disabled" disabled
            ><label>Disabled</label></ids-radio-button
          >
        </ids-radio-button-group>
        <ids-radio-button-group
          name="ids-radio-selected-disabled"
          defaultvalue="selected-disabled"
        >
          <ids-radio-button value="selected-disabled" disabled
            ><label>Selected + Disabled</label></ids-radio-button
          >
          <ids-radio-button value="other"><label>Other</label></ids-radio-button>
        </ids-radio-button-group>
      </div>
    </div>
  `,
};

export const ErrorAndHelperText: Story = {
  name: "Error And Helper Text",
  render: () => html`
    <div style="display: grid; gap: 16px;">
      <ids-radio-button-group
        name="ids-radio-helper"
        defaultvalue="option1"
      >
        <ids-radio-button value="option1" helpertext="Recommended option.">
          <label>Option 1</label>
        </ids-radio-button>
        <ids-radio-button value="option2"
          ><label>Option 2</label></ids-radio-button
        >
        <ids-radio-button value="option3"
          ><label>Option 3</label></ids-radio-button
        >
      </ids-radio-button-group>
      <ids-radio-button-group name="ids-radio-error-unselected">
        <ids-radio-button
          value="option1"
          error
          helpertext="Error message — ring stays strong border, not critical red."
        >
          <label>Option 1</label>
        </ids-radio-button>
        <ids-radio-button value="option2"
          ><label>Option 2</label></ids-radio-button
        >
        <ids-radio-button value="option3"
          ><label>Option 3</label></ids-radio-button
        >
      </ids-radio-button-group>
      <ids-radio-button-group
        name="ids-radio-error-selected"
        defaultvalue="option1"
      >
        <ids-radio-button
          value="option1"
          error
          helpertext="Error message only — selected dot keeps brand tokens."
        >
          <label>Option 1</label>
        </ids-radio-button>
        <ids-radio-button value="option2"
          ><label>Option 2</label></ids-radio-button
        >
        <ids-radio-button value="option3"
          ><label>Option 3</label></ids-radio-button
        >
      </ids-radio-button-group>
    </div>
  `,
};

export const HorizontalOrientation: Story = {
  name: "Horizontal Orientation",
  render: () => html`
    <ids-radio-button-group
      name="ids-radio-horizontal"
      orientation="horizontal"
      defaultvalue="option2"
    >
      <ids-radio-button value="option1"
        ><label>Option 1</label></ids-radio-button
      >
      <ids-radio-button value="option2"
        ><label>Option 2</label></ids-radio-button
      >
      <ids-radio-button value="option3"
        ><label>Option 3</label></ids-radio-button
      >
    </ids-radio-button-group>
  `,
};

export const Controlled: Story = {
  name: "Controlled",
  args: {
    name: "ids-radio-controlled",
    value: "option1",
  },
  render: function ControlledRender(args) {
    const [{ value }, updateArgs] = useArgs();
    const selected = String(value ?? "option1");
    return html`
      <div style="display: grid; gap: 12px;">
        <ids-radio-button-group
          name=${args.name}
          .value=${selected}
          @value-change=${(event: CustomEvent<string>) => {
            updateArgs({ value: event.detail });
          }}
        >
          <ids-radio-button value="option1"
            ><label>Option 1</label></ids-radio-button
          >
          <ids-radio-button value="option2">
            <label>Option 2 (selected: ${selected})</label>
          </ids-radio-button>
          <ids-radio-button value="option3" disabled>
            <label>Option 3 (disabled)</label>
          </ids-radio-button>
        </ids-radio-button-group>
        <button
          type="button"
          @click=${() => updateArgs({ value: "option2" })}
        >
          Select Option 2 externally
        </button>
      </div>
    `;
  },
};

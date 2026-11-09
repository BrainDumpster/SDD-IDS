import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { useArgs } from "@storybook/preview-api";
import "@ids/lit/radio-button/register.js";
import {
  RADIO_BUTTON_DOCS_DESCRIPTION,
  RADIO_BUTTON_SOURCE_CODE,
} from "./ids-radio-button.developer-usage";

const meta: Meta = {
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
    orientation: {
      control: "select",
      options: ["vertical", "horizontal"],
    },
    disabled: { control: "boolean" },
    value: {
      control: "select",
      options: ["option1", "option2", "option3"],
    },
  },
  args: {
    name: "ids-radio-default",
    value: "option1",
    disabled: false,
    orientation: "vertical",
  },
};

export default meta;
type Story = StoryObj;

/** Spec Accurate Design — Figma `42077:26737`. */
export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  render: (args) => {
    const [, updateArgs] = useArgs();
    return html`
      <ids-radio-button-group
        name=${args.name}
        .value=${args.value}
        ?disabled=${Boolean(args.disabled)}
        orientation=${args.orientation}
        @value-change=${(e: CustomEvent<string>) => {
          updateArgs({ value: e.detail });
        }}
      >
        <ids-radio-button value="option1" label="Option 1"></ids-radio-button>
        <ids-radio-button value="option2" label="Option 2"></ids-radio-button>
        <ids-radio-button value="option3" label="Option 3"></ids-radio-button>
      </ids-radio-button-group>
    `;
  },
};

export const Horizontal: Story = {
  render: () => html`
    <ids-radio-button-group
      name="ids-radio-horizontal"
      defaultValue="option2"
      orientation="horizontal"
    >
      <ids-radio-button value="option1" label="Option 1"></ids-radio-button>
      <ids-radio-button value="option2" label="Option 2"></ids-radio-button>
      <ids-radio-button value="option3" label="Option 3"></ids-radio-button>
    </ids-radio-button-group>
  `,
};

export const Disabled: Story = {
  render: () => html`
    <ids-radio-button-group
      name="ids-radio-disabled"
      defaultValue="option1"
      disabled
    >
      <ids-radio-button value="option1" label="Option 1"></ids-radio-button>
      <ids-radio-button value="option2" label="Option 2"></ids-radio-button>
    </ids-radio-button-group>
  `,
};

export const ItemDisabled: Story = {
  name: "Item disabled",
  render: () => html`
    <ids-radio-button-group
      name="ids-radio-item-disabled"
      defaultValue="option1"
    >
      <ids-radio-button value="option1" label="Option 1"></ids-radio-button>
      <ids-radio-button
        value="option2"
        label="Option 2 (disabled)"
        disabled
      ></ids-radio-button>
      <ids-radio-button value="option3" label="Option 3"></ids-radio-button>
    </ids-radio-button-group>
  `,
};

export const ErrorHelper: Story = {
  name: "Error + helper",
  render: () => html`
    <ids-radio-button-group name="ids-radio-error" defaultValue="">
      <ids-radio-button
        value="option1"
        label="Option 1"
        error
        helperText="This field is required"
      ></ids-radio-button>
      <ids-radio-button value="option2" label="Option 2"></ids-radio-button>
    </ids-radio-button-group>
  `,
};

export const SimulatedStates: Story = {
  name: "Simulated states (demo)",
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 24px">
      <ids-radio-button-group name="ids-radio-sim-a" defaultValue="">
        <ids-radio-button
          value="a"
          label="Hover unselected"
          simulatedState="hover"
        ></ids-radio-button>
      </ids-radio-button-group>
      <ids-radio-button-group name="ids-radio-sim-b" defaultValue="b">
        <ids-radio-button
          value="b"
          label="Hover selected"
          simulatedState="hover"
        ></ids-radio-button>
      </ids-radio-button-group>
      <ids-radio-button-group name="ids-radio-sim-c" defaultValue="c">
        <ids-radio-button
          value="c"
          label="Focus selected"
          simulatedState="focus-visible"
        ></ids-radio-button>
      </ids-radio-button-group>
    </div>
  `,
};

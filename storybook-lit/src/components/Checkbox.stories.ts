import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { useArgs } from "@storybook/preview-api";
import "@ids/lit/checkbox/register.js";
import {
  CHECKBOX_DOCS_DESCRIPTION,
  CHECKBOX_SOURCE_CODE,
} from "./ids-checkbox.developer-usage";

const meta: Meta = {
  title: "Spec Generated/IDS/Checkbox",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: { component: CHECKBOX_DOCS_DESCRIPTION },
      source: { code: CHECKBOX_SOURCE_CODE, language: "html" },
    },
  },
  argTypes: {
    label: { control: "text" },
    checked: { control: "boolean" },
    indeterminate: { control: "boolean" },
    disabled: { control: "boolean" },
    error: { control: "boolean" },
    helperText: { control: "text" },
    simulateFocusVisible: { control: "boolean" },
  },
  args: {
    label: "Accept terms and conditions",
    checked: false,
    indeterminate: false,
    disabled: false,
    error: false,
    helperText: "",
    simulateFocusVisible: false,
  },
};

export default meta;
type Story = StoryObj;

/** Spec Accurate Design — Figma `41895:299521`. */
export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  render: (args) => {
    const [, updateArgs] = useArgs();
    return html`
      <ids-checkbox-group>
        <ids-checkbox
          label=${args.label}
          .checked=${Boolean(args.checked)}
          ?indeterminate=${Boolean(args.indeterminate)}
          ?disabled=${Boolean(args.disabled)}
          ?error=${Boolean(args.error)}
          helperText=${args.helperText || ""}
          ?simulateFocusVisible=${Boolean(args.simulateFocusVisible)}
          @checked-change=${(e: CustomEvent<boolean>) => {
            updateArgs({ checked: e.detail, indeterminate: false });
          }}
        ></ids-checkbox>
      </ids-checkbox-group>
    `;
  },
};

export const SelectionStates: Story = {
  name: "Selection states",
  render: () => html`
    <ids-checkbox-group>
      <ids-checkbox label="Option"></ids-checkbox>
      <ids-checkbox label="Option" checked></ids-checkbox>
      <ids-checkbox label="Option" indeterminate></ids-checkbox>
      <ids-checkbox label="Option" disabled></ids-checkbox>
      <ids-checkbox label="Option" checked disabled></ids-checkbox>
      <ids-checkbox label="Option" indeterminate disabled></ids-checkbox>
    </ids-checkbox-group>
  `,
};

export const GroupVertical: Story = {
  name: "Group (vertical)",
  render: () => html`
    <ids-checkbox-group orientation="vertical">
      <ids-checkbox
        label="Email notifications"
        helperText="Receive weekly summary updates."
      ></ids-checkbox>
      <ids-checkbox label="SMS alerts" checked></ids-checkbox>
      <ids-checkbox label="Push notifications"></ids-checkbox>
    </ids-checkbox-group>
  `,
};

export const GroupHorizontal: Story = {
  name: "Group (horizontal)",
  render: () => html`
    <ids-checkbox-group orientation="horizontal">
      <ids-checkbox label="Option A"></ids-checkbox>
      <ids-checkbox label="Option B" checked></ids-checkbox>
      <ids-checkbox label="Option C"></ids-checkbox>
    </ids-checkbox-group>
  `,
};

export const ErrorHelper: Story = {
  name: "Error + helper",
  render: () => html`
    <ids-checkbox-group>
      <ids-checkbox
        label="I agree to the terms"
        error
        helperText="This field is required"
      ></ids-checkbox>
    </ids-checkbox-group>
  `,
};

export const FocusMatrix: Story = {
  name: "Focus (simulated)",
  render: () => html`
    <ids-checkbox-group orientation="horizontal">
      <ids-checkbox label="Option" simulateFocusVisible></ids-checkbox>
      <ids-checkbox label="Option" checked simulateFocusVisible></ids-checkbox>
      <ids-checkbox
        label="Option"
        indeterminate
        simulateFocusVisible
      ></ids-checkbox>
    </ids-checkbox-group>
  `,
};

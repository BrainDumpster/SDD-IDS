/**
 * Storybook: IDS Lit Checkbox from `lib/lit/ids/checkbox`
 *
 * Theme: components/ids-theme.css (via preview)
 * Spec: components/ids/checkbox/design-spec.md
 *
 * Labels are projected `<label>` children (group form label + option label).
 */
import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { useArgs } from "@storybook/preview-api";
import "@ids/core/checkbox/register.js";
import {
  CHECKBOX_MATRIX_LABEL,
  CHECKBOX_SPEC_SAMPLE_LABEL,
} from "@ids/core/checkbox/checkbox.constants.js";
import {
  CHECKBOX_DOCS_DESCRIPTION,
  CHECKBOX_SOURCE_CODE,
} from "./ids-checkbox.developer-usage";

type CheckboxArgs = {
  label: string;
  groupLabel: string;
  checked?: boolean;
  defaultChecked?: boolean;
  partial: boolean;
  disabled: boolean;
  error: boolean;
  helperText: string;
  showLabel: boolean;
  simulateFocusVisible: boolean;
  density: "default" | "datagrid";
};

const meta: Meta<CheckboxArgs> = {
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
    label: {
      control: "text",
      description: "Option label projected as a <label> child of ids-checkbox",
    },
    groupLabel: {
      control: "text",
      description: "Form label projected as a <label> child of ids-checkbox-group",
    },
    checked: { control: "boolean" },
    defaultChecked: { control: "boolean" },
    partial: { control: "boolean" },
    disabled: { control: "boolean" },
    error: { control: "boolean" },
    helperText: { control: "text" },
    showLabel: { control: "boolean" },
    simulateFocusVisible: { control: "boolean" },
    density: { control: "select", options: ["default", "datagrid"] },
  },
  args: {
    label: CHECKBOX_SPEC_SAMPLE_LABEL,
    groupLabel: "Options:",
    partial: false,
    disabled: false,
    error: false,
    helperText: "",
    showLabel: true,
    simulateFocusVisible: false,
    density: "default",
  },
};

export default meta;
type Story = StoryObj<CheckboxArgs>;

/** Spec Accurate Design: default unchecked checkbox with projected labels. */
export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  render: (args) => html`
    <ids-checkbox-group labelposition="left">
      <label>${args.groupLabel}</label>
      <ids-checkbox
        ?partial=${args.partial}
        ?disabled=${args.disabled}
        ?error=${args.error}
        helpertext=${args.helperText || ""}
        ?showlabel=${args.showLabel}
        ?simulatefocusvisible=${args.simulateFocusVisible}
        density=${args.density}
      >
        <label>${args.label}</label>
      </ids-checkbox>
    </ids-checkbox-group>
  `,
};

export const SelectionStates: Story = {
  name: "Selection States",
  render: () => html`
    <div style="display: flex; gap: 24px; flex-wrap: wrap;">
      <ids-checkbox><label>Unchecked</label></ids-checkbox>
      <ids-checkbox checked><label>Checked</label></ids-checkbox>
      <ids-checkbox partial><label>Partial</label></ids-checkbox>
    </div>
  `,
};

/** Mirrors Figma main matrix: selection × (default | focus-visible | disabled). */
export const FigmaMainMatrix: Story = {
  name: "Figma Main Matrix",
  render: () => html`
    <div
      style="
        display: grid;
        grid-template-columns: 120px repeat(3, minmax(140px, 1fr));
        gap: 12px 16px;
        align-items: center;
        font-size: 12px;
        color: var(--color-text-gray-neutral-strong);
      "
    >
      <div></div>
      <div>Unselected</div>
      <div>Selected</div>
      <div>Partial</div>
      <div>Default</div>
      <ids-checkbox><label>${CHECKBOX_MATRIX_LABEL}</label></ids-checkbox>
      <ids-checkbox checked
        ><label>${CHECKBOX_MATRIX_LABEL}</label></ids-checkbox
      >
      <ids-checkbox partial
        ><label>${CHECKBOX_MATRIX_LABEL}</label></ids-checkbox
      >
      <div>Focus-visible (simulated)</div>
      <ids-checkbox simulatefocusvisible
        ><label>${CHECKBOX_MATRIX_LABEL}</label></ids-checkbox
      >
      <ids-checkbox checked simulatefocusvisible
        ><label>${CHECKBOX_MATRIX_LABEL}</label></ids-checkbox
      >
      <ids-checkbox partial simulatefocusvisible
        ><label>${CHECKBOX_MATRIX_LABEL}</label></ids-checkbox
      >
      <div>Disabled</div>
      <ids-checkbox disabled
        ><label>${CHECKBOX_MATRIX_LABEL}</label></ids-checkbox
      >
      <ids-checkbox checked disabled
        ><label>${CHECKBOX_MATRIX_LABEL}</label></ids-checkbox
      >
      <ids-checkbox partial disabled
        ><label>${CHECKBOX_MATRIX_LABEL}</label></ids-checkbox
      >
    </div>
  `,
};

export const DisabledStates: Story = {
  name: "Disabled States",
  render: () => html`
    <div style="display: flex; gap: 24px; flex-wrap: wrap;">
      <ids-checkbox disabled><label>Unchecked</label></ids-checkbox>
      <ids-checkbox checked disabled><label>Checked</label></ids-checkbox>
      <ids-checkbox partial disabled><label>Partial</label></ids-checkbox>
    </div>
  `,
};

export const LongLabel: Story = {
  name: "Long Label",
  render: () => html`
    <ids-checkbox checked>
      <label
        >This is a deliberately long checkbox option label that keeps going
        until the row reaches its 900px maximum width including the checkbox
        itself, at which point the text wraps onto a second line without ever
        truncating, while the checkbox stays aligned to the top on the first
        line.</label
      >
    </ids-checkbox>
  `,
};

export const WithHelperAndError: Story = {
  name: "With Helper And Error",
  render: () => html`
    <ids-checkbox-group>
      <ids-checkbox helpertext="Receive weekly summary updates.">
        <label>Email notifications</label>
      </ids-checkbox>
      <ids-checkbox
        error
        helpertext="You must accept this option to continue."
      >
        <label>Required acknowledgement</label>
      </ids-checkbox>
      <ids-checkbox
        disabled
        helpertext="This option is unavailable for your role."
      >
        <label>Disabled option</label>
      </ids-checkbox>
      <ids-checkbox
        checked
        error
        helpertext="Error message only — control keeps selected styling."
      >
        <label>Checked with validation error</label>
      </ids-checkbox>
    </ids-checkbox-group>
  `,
};

export const CheckboxGroup: Story = {
  name: "Checkbox Group",
  render: () => html`
    <ids-checkbox-group labelposition="left" orientation="vertical">
      <label>Notifications:</label>
      <ids-checkbox helpertext="Receive weekly summary updates.">
        <label>Email notifications</label>
      </ids-checkbox>
      <ids-checkbox checked><label>SMS alerts</label></ids-checkbox>
      <ids-checkbox><label>Push notifications</label></ids-checkbox>
    </ids-checkbox-group>
  `,
};

export const CheckboxGroupError: Story = {
  name: "Checkbox Group Error",
  render: () => html`
    <ids-checkbox-group
      required
      labelicon
      error
      errortext="You must select at least one option."
      orientation="vertical"
    >
      <label>Notifications:</label>
      <ids-checkbox><label>Email</label></ids-checkbox>
      <ids-checkbox checked><label>SMS</label></ids-checkbox>
      <ids-checkbox><label>Push notification</label></ids-checkbox>
    </ids-checkbox-group>
  `,
};

export const CheckboxGroupHorizontal: Story = {
  name: "Checkbox Group Horizontal",
  render: () => html`
    <ids-checkbox-group labelposition="top" orientation="horizontal">
      <label>Channels:</label>
      <ids-checkbox><label>Email</label></ids-checkbox>
      <ids-checkbox checked><label>SMS</label></ids-checkbox>
      <ids-checkbox><label>Push</label></ids-checkbox>
    </ids-checkbox-group>
  `,
};

export const Controlled: Story = {
  name: "Controlled",
  args: {
    label: "Controlled checkbox",
    checked: false,
  },
  render: function ControlledRender(args) {
    const [{ checked }, updateArgs] = useArgs();
    const isOn = Boolean(checked);
    return html`
      <div style="display: grid; gap: 12px;">
        <ids-checkbox-group>
          <ids-checkbox
            .checked=${isOn}
            helpertext=${`Current value: ${isOn ? "checked" : "unchecked"}`}
            @checked-change=${(event: CustomEvent<boolean>) => {
              updateArgs({ checked: event.detail });
            }}
          >
            <label>${args.label}</label>
          </ids-checkbox>
        </ids-checkbox-group>
        <button
          type="button"
          @click=${() => updateArgs({ checked: !isOn })}
        >
          Toggle externally
        </button>
      </div>
    `;
  },
};

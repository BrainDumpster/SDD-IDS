/**
 * Storybook: IDS Lit Toggle Switch from `lib/lit/ids/toggle-switch`
 *
 * Theme: components/ids-theme.css (via preview)
 * Spec: components/ids/toggle-switch/design-spec.md
 * API: lib/react/ids/toggle-switch + storybook/src/components/lib-generated/ToggleSwitch.stories.tsx
 */
import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { useArgs } from "@storybook/preview-api";
import "@ids/core/toggle-switch/register.js";
import {
  TOGGLE_SWITCH_DOCS_DESCRIPTION,
  TOGGLE_SWITCH_SOURCE_CODE,
} from "./ids-toggle-switch.developer-usage";

const meta: Meta = {
  title: "Spec Generated/IDS/Toggle Switch",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: { component: TOGGLE_SWITCH_DOCS_DESCRIPTION },
      source: { code: TOGGLE_SWITCH_SOURCE_CODE, language: "html" },
    },
  },
  argTypes: {
    checked: { control: "boolean" },
    defaultChecked: { control: "boolean" },
    disabled: { control: "boolean" },
    showStatus: { control: "boolean" },
    showLabel: { control: "boolean" },
    label: { control: "text" },
    labelRequired: { control: "boolean" },
    labelShowInfoIcon: { control: "boolean" },
    labelInfoLabel: { control: "text" },
    ariaLabel: { control: "text" },
  },
  args: {
    ariaLabel: "Enable alerts",
    defaultChecked: false,
    disabled: false,
    showStatus: true,
    showLabel: true,
    label: "Enable alerts",
    labelRequired: false,
    labelShowInfoIcon: false,
  },
};

export default meta;
type Story = StoryObj;

/** Spec Accurate Design — labeled off default (Composition & API / Figma Off Default). */
export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  render: (args) => html`
    <ids-toggle-switch
      arialabel=${args.ariaLabel}
      ?defaultchecked=${args.defaultChecked}
      ?disabled=${args.disabled}
      showstatus=${args.showStatus ? "true" : "false"}
      label=${args.showLabel ? args.label : ""}
      ?labelrequired=${args.labelRequired}
      ?labelshowinfoicon=${args.labelShowInfoIcon}
      labelinfolabel=${args.labelInfoLabel ?? ""}
    ></ids-toggle-switch>
  `,
};

export const Off: Story = {
  name: "Off",
  args: {
    ariaLabel: "Enable alerts",
    defaultChecked: false,
    showLabel: false,
  },
  render: (args) => html`
    <ids-toggle-switch
      arialabel=${args.ariaLabel}
      ?defaultchecked=${args.defaultChecked}
      showstatus=${args.showStatus ? "true" : "false"}
    ></ids-toggle-switch>
  `,
};

export const On: Story = {
  name: "On",
  args: {
    ariaLabel: "Enable alerts",
    defaultChecked: true,
    showLabel: false,
  },
  render: (args) => html`
    <ids-toggle-switch
      arialabel=${args.ariaLabel}
      ?defaultchecked=${args.defaultChecked}
      showstatus=${args.showStatus ? "true" : "false"}
    ></ids-toggle-switch>
  `,
};

export const DisabledOff: Story = {
  name: "Disabled Off",
  args: {
    ariaLabel: "Enable alerts",
    disabled: true,
    defaultChecked: false,
    showLabel: false,
  },
  render: (args) => html`
    <ids-toggle-switch
      arialabel=${args.ariaLabel}
      ?defaultchecked=${args.defaultChecked}
      ?disabled=${args.disabled}
      showstatus=${args.showStatus ? "true" : "false"}
    ></ids-toggle-switch>
  `,
};

export const DisabledOn: Story = {
  name: "Disabled On",
  args: {
    ariaLabel: "Enable alerts",
    disabled: true,
    defaultChecked: true,
    showLabel: false,
  },
  render: (args) => html`
    <ids-toggle-switch
      arialabel=${args.ariaLabel}
      ?defaultchecked=${args.defaultChecked}
      ?disabled=${args.disabled}
      showstatus=${args.showStatus ? "true" : "false"}
    ></ids-toggle-switch>
  `,
};

/** Accessible name via \`arialabel\` when visible label is absent. */
export const WithoutVisibleLabel: Story = {
  name: "Without Visible Label",
  args: {
    ariaLabel: "Enable alerts",
    defaultChecked: false,
    showLabel: false,
  },
  render: (args) => html`
    <ids-toggle-switch
      arialabel=${args.ariaLabel}
      ?defaultchecked=${args.defaultChecked}
      showstatus=${args.showStatus ? "true" : "false"}
    ></ids-toggle-switch>
  `,
};

export const Controlled: Story = {
  name: "Controlled",
  render: function ControlledRender(args) {
    const [{ checked }, updateArgs] = useArgs();
    const isOn = Boolean(checked);
    return html`
      <div style="display: grid; gap: 8px">
        <ids-toggle-switch
          arialabel=${args.ariaLabel || "Enable alerts"}
          .checked=${isOn}
          showstatus=${args.showStatus ? "true" : "false"}
          @checked-change=${(event: CustomEvent<boolean>) => {
            updateArgs({ checked: event.detail });
          }}
        ></ids-toggle-switch>
        <span style="color: var(--color-text-gray-neutral)">
          Checked: ${isOn ? "true" : "false"}
        </span>
      </div>
    `;
  },
  args: {
    ariaLabel: "Enable alerts",
    checked: false,
    showStatus: true,
  },
};

/** Variant matrix sample: checked × disabled. */
export const StateMatrix: Story = {
  name: "State Matrix",
  render: () => html`
    <div style="display: grid; gap: 12px">
      <div style="display: flex; gap: 24px">
        <ids-toggle-switch arialabel="Off"></ids-toggle-switch>
        <ids-toggle-switch
          arialabel="On"
          defaultchecked
        ></ids-toggle-switch>
      </div>
      <div style="display: flex; gap: 24px">
        <ids-toggle-switch
          arialabel="Disabled Off"
          disabled
        ></ids-toggle-switch>
        <ids-toggle-switch
          arialabel="Disabled On"
          disabled
          defaultchecked
        ></ids-toggle-switch>
      </div>
    </div>
  `,
};

/** Figma matrix frame \`42848:100536\` — dark surface + tokens. */
export const StateMatrixDark: Story = {
  name: "State Matrix Dark",
  parameters: {
    globals: { theme: "dark" },
  },
  render: () => html`
    <div style="display: grid; gap: 12px">
      <div style="display: flex; gap: 24px">
        <ids-toggle-switch arialabel="Off"></ids-toggle-switch>
        <ids-toggle-switch
          arialabel="On"
          defaultchecked
        ></ids-toggle-switch>
      </div>
      <div style="display: flex; gap: 24px">
        <ids-toggle-switch
          arialabel="Disabled Off"
          disabled
        ></ids-toggle-switch>
        <ids-toggle-switch
          arialabel="Disabled On"
          disabled
          defaultchecked
        ></ids-toggle-switch>
      </div>
    </div>
  `,
};

import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "@ids/lit/button/register.js";
import {
  BUTTON_DOCS_DESCRIPTION,
  BUTTON_SOURCE_CODE,
} from "./ids-button.developer-usage";

const meta: Meta = {
  title: "Spec Generated/IDS/Button",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: { component: BUTTON_DOCS_DESCRIPTION },
      source: { code: BUTTON_SOURCE_CODE, language: "html" },
    },
  },
  argTypes: {
    kind: {
      control: "select",
      options: ["primary", "secondary", "tertiary", "danger", "ghostNeutral"],
    },
    size: {
      control: "select",
      options: ["small", "medium", "large"],
    },
    disabled: { control: "boolean" },
    fluid: { control: "boolean" },
    loading: { control: "boolean" },
    iconOnly: { control: "boolean" },
  },
  args: {
    kind: "primary",
    size: "large",
    label: "Button",
    disabled: false,
    fluid: false,
    loading: false,
    iconOnly: false,
    iconSlug: "",
  },
};

export default meta;
type Story = StoryObj;

/** Spec Accurate Design — Figma Button board `41894:116123` / set `9662:25120`. */
export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  render: (args) => html`
    <ids-button
      kind=${args.kind}
      size=${args.size}
      ?disabled=${Boolean(args.disabled)}
      ?fluid=${Boolean(args.fluid)}
      ?loading=${Boolean(args.loading)}
      ?iconOnly=${Boolean(args.iconOnly)}
      .iconSlug=${args.iconSlug || ""}
      >${args.label}</ids-button
    >
  `,
};

export const Variants: Story = {
  render: () => html`
    <div style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center">
      <ids-button kind="primary">Primary</ids-button>
      <ids-button kind="secondary">Secondary</ids-button>
      <ids-button kind="tertiary">Tertiary</ids-button>
      <ids-button kind="danger">Danger</ids-button>
    </div>
  `,
};

export const Sizes: Story = {
  render: () => html`
    <div style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center">
      <ids-button kind="primary" size="small">Small</ids-button>
      <ids-button kind="primary" size="medium">Medium</ids-button>
      <ids-button kind="primary" size="large">Large</ids-button>
    </div>
  `,
};

export const Disabled: Story = {
  render: () => html`
    <div style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center">
      <ids-button kind="primary" disabled>Primary</ids-button>
      <ids-button kind="secondary" disabled>Secondary</ids-button>
      <ids-button kind="tertiary" disabled>Tertiary</ids-button>
      <ids-button kind="danger" disabled>Danger</ids-button>
    </div>
  `,
};

export const WithIcon: Story = {
  render: () => html`
    <div style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center">
      <ids-button kind="primary" iconSlug="settings-gear-detailed"
        >Settings</ids-button
      >
      <ids-button kind="secondary" iconSlug="settings-gear-detailed"
        >Settings</ids-button
      >
      <ids-button
        kind="primary"
        iconSlug="settings-gear-detailed"
        iconOnly
        size="small"
        ariaLabel="Settings"
      ></ids-button>
      <ids-button
        kind="ghostNeutral"
        iconSlug="settings-gear-detailed"
        iconOnly
        size="large"
        ariaLabel="Ghost Neutral"
      ></ids-button>
    </div>
  `,
};

export const IconOnly: Story = {
  name: "Icon Only",
  render: () => html`
    <div style="display: grid; gap: 16px">
      ${(["primary", "secondary", "tertiary", "ghostNeutral"] as const).map(
        (variant) => html`
          <div style="display: flex; flex-wrap: wrap; gap: 10px; align-items: center">
            <ids-button
              kind=${variant}
              iconSlug="settings-gear-detailed"
              iconOnly
              size="small"
              ariaLabel=${`${variant} small`}
            ></ids-button>
            <ids-button
              kind=${variant}
              iconSlug="settings-gear-detailed"
              iconOnly
              size="medium"
              ariaLabel=${`${variant} medium`}
            ></ids-button>
            <ids-button
              kind=${variant}
              iconSlug="settings-gear-detailed"
              iconOnly
              size="large"
              ariaLabel=${`${variant} large`}
            ></ids-button>
            <ids-button
              kind=${variant}
              iconSlug="settings-gear-detailed"
              iconOnly
              size="large"
              disabled
              ariaLabel=${`${variant} disabled`}
            ></ids-button>
          </div>
        `,
      )}
    </div>
  `,
};

export const Fluid: Story = {
  render: () => html`
    <div style="max-width: 320px">
      <ids-button kind="primary" fluid>Fluid button</ids-button>
    </div>
  `,
};

export const Loading: Story = {
  render: () => html`
    <ids-button kind="primary" loading>Loading</ids-button>
  `,
};

export const ForcedStates: Story = {
  name: "Forced states (demo)",
  render: () => html`
    <div style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center">
      <ids-button kind="primary" data-state="hover">Hover</ids-button>
      <ids-button kind="primary" data-state="press">Press</ids-button>
      <ids-button kind="primary" data-state="focus-visible"
        >Focus</ids-button
      >
      <ids-button kind="primary" data-state="disabled">Disabled</ids-button>
      <ids-button
        kind="secondary"
        data-state="focus-visible"
        >Secondary focus</ids-button
      >
      <ids-button
        kind="ghostNeutral"
        iconOnly
        iconSlug="settings-gear-detailed"
        ariaLabel="Ghost Neutral focus"
        data-state="focus-visible"
      ></ids-button>
    </div>
  `,
};

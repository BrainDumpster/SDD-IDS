/**
 * Storybook: IDS Lit Link from `lib/lit/ids/link`
 *
 * Theme: components/ids-theme.css (via preview)
 * Spec: components/ids/link/design-spec.md
 * API: lib/react/ids/link
 * Examples: storybook/src/components/Link.stories.tsx + lib-generated/Link.stories.tsx
 */
import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "@ids/core/link/register.js";
import {
  LINK_DOCS_DESCRIPTION,
  LINK_SOURCE_CODE,
} from "./ids-link.developer-usage";

const TYPES = ["standalone", "inline", "dark-bg"] as const;
const STATES = ["default", "hover", "press", "focus-visible"] as const;

const meta: Meta = {
  title: "Spec Generated/IDS/Link",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: { component: LINK_DOCS_DESCRIPTION },
      source: { code: LINK_SOURCE_CODE, language: "html" },
    },
  },
  argTypes: {
    label: { control: "text" },
    type: {
      control: "select",
      options: [...TYPES],
    },
    href: { control: "text" },
    showExternalLinkIcon: { control: "boolean" },
    target: {
      control: "select",
      options: ["_self", "_blank", "_parent", "_top"],
    },
    disabled: { control: "boolean" },
    dataState: {
      control: "select",
      options: ["", ...STATES],
    },
  },
  args: {
    label: "This is a link",
    type: "standalone",
    href: "#",
    showExternalLinkIcon: false,
    target: "_self",
    disabled: false,
    dataState: "",
  },
};

export default meta;
type Story = StoryObj;

/** Spec Accurate Design — Figma Link set `9628:25123` / Standalone Default `9628:25157`. */
export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  render: (args) => html`
    <ids-link
      label=${args.label}
      type=${args.type}
      href=${args.href || ""}
      target=${args.target}
      .showExternalLinkIcon=${Boolean(args.showExternalLinkIcon)}
      ?disabled=${Boolean(args.disabled)}
      data-state=${args.dataState || ""}
    ></ids-link>
  `,
};

export const Types: Story = {
  name: "Types",
  render: () => html`
    <div style="display: flex; gap: 24px; align-items: center; flex-wrap: wrap">
      <ids-link label="Standalone" type="standalone" href="#"></ids-link>
      <ids-link label="Inline" type="inline" href="#"></ids-link>
      <div
        style="background: var(--color-background-controls-base); padding: 8px 16px"
      >
        <ids-link label="Dark Bg" type="dark-bg" href="#"></ids-link>
      </div>
    </div>
  `,
};

export const WithExternalIcon: Story = {
  name: "With External Icon",
  args: {
    label: "This is a link",
    type: "standalone",
    href: "https://example.com",
    target: "_blank",
    showExternalLinkIcon: true,
  },
  render: (args) => html`
    <ids-link
      label=${args.label}
      type=${args.type}
      href=${args.href}
      target=${args.target}
      ?show-external-link-icon=${true}
    ></ids-link>
  `,
};

export const ActionButtonSemantics: Story = {
  name: "Action (no href)",
  args: {
    label: "Perform action",
    type: "standalone",
    href: "",
  },
  render: (args) => html`
    <ids-link label=${args.label} type=${args.type}></ids-link>
  `,
};

export const DarkBackground: Story = {
  name: "Dark Background",
  args: {
    label: "This is a link",
    type: "dark-bg",
    href: "#",
  },
  render: (args) => html`
    <div
      style="background: var(--color-background-controls-base); padding: 16px"
    >
      <ids-link
        label=${args.label}
        type="dark-bg"
        href=${args.href}
      ></ids-link>
    </div>
  `,
};

/** All 12 type × state cells (+ with-icon rows) from design-spec matrices. */
export const StateMatrixWithIcon: Story = {
  name: "State Matrix With Icon",
  render: () => html`
    <div
      style="background: var(--color-background-surface-primary); padding: 24px"
    >
      <div
        style="display: grid; grid-template-columns: 1fr 1fr 1fr; column-gap: 56px; margin-bottom: 20px"
      >
        <h3 style="margin: 0; font-weight: 400; font-size: 24px; line-height: 32px">
          Standalone
        </h3>
        <h3 style="margin: 0; font-weight: 400; font-size: 24px; line-height: 32px">
          Inline
        </h3>
        <h3 style="margin: 0; font-weight: 400; font-size: 24px; line-height: 32px">
          Dark Bg
        </h3>
      </div>
      <div
        style="display: grid; grid-template-columns: 1fr 1fr 134px; column-gap: 56px"
      >
        <div style="display: flex; flex-direction: column; gap: 14px">
          ${STATES.map(
            (state) => html`
              <ids-link
                label="This is a link"
                type="standalone"
                href="#"
                data-state=${state}
              ></ids-link>
            `,
          )}
          <div style="height: 22px"></div>
          ${STATES.map(
            (state) => html`
              <ids-link
                label="This is a link"
                type="standalone"
                href="https://example.com"
                target="_blank"
                show-external-link-icon
                data-state=${state}
              ></ids-link>
            `,
          )}
        </div>
        <div style="display: flex; flex-direction: column; gap: 14px">
          ${STATES.map(
            (state) => html`
              <ids-link
                label="This is a link"
                type="inline"
                href="#"
                data-state=${state}
              ></ids-link>
            `,
          )}
          <div style="height: 22px"></div>
          ${STATES.map(
            (state) => html`
              <ids-link
                label="This is a link"
                type="inline"
                href="https://example.com"
                target="_blank"
                show-external-link-icon
                data-state=${state}
              ></ids-link>
            `,
          )}
        </div>
        <div
          style="background: var(--color-background-controls-base); padding: 2px 18px; display: flex; flex-direction: column; gap: 14px"
        >
          ${STATES.map(
            (state) => html`
              <ids-link
                label="This is a link"
                type="dark-bg"
                href="#"
                data-state=${state}
              ></ids-link>
            `,
          )}
          <div style="height: 22px"></div>
          ${STATES.map(
            (state) => html`
              <ids-link
                label="This is a link"
                type="dark-bg"
                href="https://example.com"
                target="_blank"
                show-external-link-icon
                data-state=${state}
              ></ids-link>
            `,
          )}
        </div>
      </div>
    </div>
  `,
};

export const ForcedStates: Story = {
  name: "Forced States (dataState)",
  render: () => html`
    <div style="display: grid; gap: 16px">
      ${TYPES.map(
        (type) => html`
          <div
            style="display: flex; gap: 16px; flex-wrap: wrap; align-items: center; ${type ===
            "dark-bg"
              ? "background: var(--color-background-controls-base); padding: 12px;"
              : ""}"
          >
            ${STATES.map(
              (state) => html`
                <ids-link
                  label=${state}
                  type=${type}
                  href="#"
                  data-state=${state}
                ></ids-link>
              `,
            )}
          </div>
        `,
      )}
    </div>
  `,
};

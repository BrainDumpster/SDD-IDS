/**
 * Storybook: design-spec–generated Link from `lib/react/ids/link`
 * (React + CSS Modules, no @base-ui-components).
 *
 * Anatomy: root (`<a>` | `<button>`) → label → externalIcon?
 * Composition: external icon uses lib `IdsIcon` (`pop-up-square-corner-big`, 16px).
 *
 * Theme: components/ids-theme.css
 * Spec: components/ids/link/design-spec.md
 */
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/ids-theme.css";
import {
  IdsLink,
  type IdsLinkProps,
} from "../../../../lib/react/ids/link";

const DESIGN_SPEC_PATH = "components/ids/link/design-spec.md";

const TYPES = ["standalone", "inline", "dark-bg"] as const;
const STATES = ["default", "hover", "press", "focus-visible"] as const;

const meta: Meta<IdsLinkProps> = {
  title: "Components/IDS/Link",
  component: IdsLink,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          `React IDS Link from \`${DESIGN_SPEC_PATH}\`. ` +
          "Anatomy: root → label → externalIcon?. " +
          "`type`: standalone | inline | dark-bg. " +
          "External icon composes lib `IdsIcon` (`pop-up-square-corner-big`). " +
          "Theme: `components/ids-theme.css`. No `@base-ui-components`.",
      },
    },
  },
  args: {
    label: "This is a link",
    type: "standalone",
    href: "#",
    showExternalLinkIcon: false,
    disabled: false,
  },
  argTypes: {
    type: {
      control: "select",
      options: [...TYPES],
    },
    label: { control: "text" },
    href: { control: "text" },
    showExternalLinkIcon: { control: "boolean" },
    target: {
      control: "select",
      options: ["_self", "_blank", "_parent", "_top"],
    },
    disabled: { control: "boolean" },
    dataState: {
      control: "select",
      options: [undefined, ...STATES],
    },
    onClick: { action: "onClick" },
  },
};

export default meta;
type Story = StoryObj<IdsLinkProps>;

/** Canonical standalone default — Spec Accurate Design. */
export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  args: {
    label: "This is a link",
    type: "standalone",
    href: "#",
    showExternalLinkIcon: false,
  },
  render: (args) => <IdsLink {...args} />,
};

export const Types: Story = {
  name: "Types",
  render: () => (
    <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
      <IdsLink label="Standalone" type="standalone" href="#" />
      <IdsLink label="Inline" type="inline" href="#" />
      <div
        style={{
          background: "var(--color-background-controls-base)",
          padding: "8px 16px",
        }}
      >
        <IdsLink label="Dark Bg" type="dark-bg" href="#" />
      </div>
    </div>
  ),
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
  render: (args) => <IdsLink {...args} />,
};

export const ActionButtonSemantics: Story = {
  name: "Action (no href)",
  args: {
    label: "Perform action",
    type: "standalone",
    href: undefined,
  },
  render: (args) => <IdsLink {...args} />,
};

export const DarkBackground: Story = {
  name: "Dark Background",
  args: {
    label: "This is a link",
    type: "dark-bg",
    href: "#",
  },
  decorators: [
    (Story) => (
      <div
        style={{
          background: "var(--color-background-controls-base)",
          padding: 16,
        }}
      >
        <Story />
      </div>
    ),
  ],
};

/** All 12 type × state cells (+ with-icon rows) from design-spec matrices. */
export const StateMatrixWithIcon: Story = {
  name: "State Matrix With Icon",
  render: () => (
    <div
      style={{
        background: "var(--color-background-surface-primary)",
        padding: 24,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          columnGap: 56,
          marginBottom: 20,
        }}
      >
        <h3 style={{ margin: 0, fontWeight: 400, fontSize: 24, lineHeight: "32px" }}>
          Standalone
        </h3>
        <h3 style={{ margin: 0, fontWeight: 400, fontSize: 24, lineHeight: "32px" }}>
          Inline
        </h3>
        <h3 style={{ margin: 0, fontWeight: 400, fontSize: 24, lineHeight: "32px" }}>
          Dark Bg
        </h3>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 134px",
          columnGap: 56,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {STATES.map((state) => (
            <IdsLink
              key={`standalone-${state}`}
              label="This is a link"
              type="standalone"
              href="#"
              dataState={state}
            />
          ))}
          <div style={{ height: 22 }} />
          {STATES.map((state) => (
            <IdsLink
              key={`standalone-icon-${state}`}
              label="This is a link"
              type="standalone"
              href="https://example.com"
              target="_blank"
              showExternalLinkIcon
              dataState={state}
            />
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {STATES.map((state) => (
            <IdsLink
              key={`inline-${state}`}
              label="This is a link"
              type="inline"
              href="#"
              dataState={state}
            />
          ))}
          <div style={{ height: 22 }} />
          {STATES.map((state) => (
            <IdsLink
              key={`inline-icon-${state}`}
              label="This is a link"
              type="inline"
              href="https://example.com"
              target="_blank"
              showExternalLinkIcon
              dataState={state}
            />
          ))}
        </div>
        <div
          style={{
            background: "var(--color-background-controls-base)",
            padding: "2px 18px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          {STATES.map((state) => (
            <IdsLink
              key={`dark-${state}`}
              label="This is a link"
              type="dark-bg"
              href="#"
              dataState={state}
            />
          ))}
          <div style={{ height: 22 }} />
          {STATES.map((state) => (
            <IdsLink
              key={`dark-icon-${state}`}
              label="This is a link"
              type="dark-bg"
              href="https://example.com"
              target="_blank"
              showExternalLinkIcon
              dataState={state}
            />
          ))}
        </div>
      </div>
    </div>
  ),
};

export const ForcedStates: Story = {
  name: "Forced States (dataState)",
  render: () => (
    <div style={{ display: "grid", gap: 16 }}>
      {TYPES.map((type) => (
        <div
          key={type}
          style={{
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
            alignItems: "center",
            ...(type === "dark-bg"
              ? {
                  background: "var(--color-background-controls-base)",
                  padding: 12,
                }
              : {}),
          }}
        >
          {STATES.map((state) => (
            <IdsLink
              key={`${type}-${state}`}
              label={state}
              type={type}
              href="#"
              dataState={state}
            />
          ))}
        </div>
      ))}
    </div>
  ),
};

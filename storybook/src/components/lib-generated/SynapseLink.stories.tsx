/**
 * Storybook: design-spec–generated Link from `lib/react/synapse/link`
 * (IDS-fork reexport façade — React + CSS Modules).
 *
 * Anatomy: root (`<a>` | `<button>`) → label → externalIcon?
 * Composition: external icon uses lib `SynapseIcon` (`pop-up-square-corner-big`, 16px).
 *
 * Theme: components/synapse-theme.css
 * Spec: components/synapse/link/design-spec.md
 */
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/synapse-theme.css";
import {
  SYNAPSE_LINK_DOCS_DESCRIPTION,
  SYNAPSE_LINK_SOURCE_CODE,
} from "./synapse-link.developer-usage";
import {
  SynapseLink,
  type SynapseLinkProps,
} from "@synapse/react/link";

const DESIGN_SPEC_PATH = "components/synapse/link/design-spec.md";

const TYPES = ["standalone", "inline", "dark-bg"] as const;
const STATES = ["default", "hover", "press", "focus-visible"] as const;

const meta: Meta<SynapseLinkProps> = {
  tags: ["autodocs"],
  title: "Components/Synapse/Link",
  component: SynapseLink,
  parameters: {
    layout: "centered",
    docs: {
      canvas: { sourceState: "open" },
      description: {
        component: SYNAPSE_LINK_DOCS_DESCRIPTION,
      },
      source: {
        type: "code",
        language: "tsx",
        code: SYNAPSE_LINK_SOURCE_CODE,
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
type Story = StoryObj<SynapseLinkProps>;

/** Canonical standalone default — Spec Accurate Design. */
export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  args: {
    label: "This is a link",
    type: "standalone",
    href: "#",
    showExternalLinkIcon: false,
  },
  render: (args) => <SynapseLink {...args} />,
};

export const Types: Story = {
  name: "Types",
  render: () => (
    <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
      <SynapseLink label="Standalone" type="standalone" href="#" />
      <SynapseLink label="Inline" type="inline" href="#" />
      <div
        style={{
          background: "var(--color-background-controls-base)",
          padding: "8px 16px",
        }}
      >
        <SynapseLink label="Dark Bg" type="dark-bg" href="#" />
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
  render: (args) => <SynapseLink {...args} />,
};

export const ActionButtonSemantics: Story = {
  name: "Action (no href)",
  args: {
    label: "Perform action",
    type: "standalone",
    href: undefined,
  },
  render: (args) => <SynapseLink {...args} />,
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
            <SynapseLink
              key={`standalone-${state}`}
              label="This is a link"
              type="standalone"
              href="#"
              dataState={state}
            />
          ))}
          <div style={{ height: 22 }} />
          {STATES.map((state) => (
            <SynapseLink
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
            <SynapseLink
              key={`inline-${state}`}
              label="This is a link"
              type="inline"
              href="#"
              dataState={state}
            />
          ))}
          <div style={{ height: 22 }} />
          {STATES.map((state) => (
            <SynapseLink
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
            <SynapseLink
              key={`dark-${state}`}
              label="This is a link"
              type="dark-bg"
              href="#"
              dataState={state}
            />
          ))}
          <div style={{ height: 22 }} />
          {STATES.map((state) => (
            <SynapseLink
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
            <SynapseLink
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

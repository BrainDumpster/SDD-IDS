import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "@ids/lit/accordion/register.js";
import {
  ACCORDION_DOCS_DESCRIPTION,
  ACCORDION_SOURCE_CODE,
} from "./ids-accordion.developer-usage";

const meta: Meta = {
  title: "Spec Generated/IDS/Accordion",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: ACCORDION_DOCS_DESCRIPTION,
      },
      source: {
        code: ACCORDION_SOURCE_CODE,
        language: "html",
      },
    },
  },
  argTypes: {
    multiplePanelOpen: { control: "boolean" },
    chevronPosition: { control: "select", options: ["left", "right"] },
    firstActive: { control: "boolean" },
  },
  args: {
    multiplePanelOpen: false,
    chevronPosition: "left",
    firstActive: true,
  },
};

export default meta;
type Story = StoryObj;

const panels = (args: {
  firstActive?: boolean;
  disabledThird?: boolean;
}) => html`
  <ids-accordion-panel value="section1" ?active=${Boolean(args.firstActive)}>
    <ids-accordion-title>Network configuration</ids-accordion-title>
    <ids-accordion-content>
      Configure network policies and service endpoints for this workspace. Learn how
      network policies work in the admin guide.
    </ids-accordion-content>
  </ids-accordion-panel>
  <ids-accordion-panel value="section2">
    <ids-accordion-title>Security controls</ids-accordion-title>
    <ids-accordion-content>
      Manage access rules, authentication options, and audit controls for your
      environment.
    </ids-accordion-content>
  </ids-accordion-panel>
  <ids-accordion-panel
    value="section3"
    ?accordionPanelDisabled=${args.disabledThird !== false}
  >
    <ids-accordion-title>Integrations</ids-accordion-title>
    <ids-accordion-content>
      Connect external systems and event pipelines. This section is disabled in the
      demo matrix.
    </ids-accordion-content>
  </ids-accordion-panel>
`;

/** Spec Accurate Design — single-expand, first open, left chevron. */
export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  args: {
    multiplePanelOpen: false,
    chevronPosition: "left",
    firstActive: true,
  },
  render: (args) => html`
    <ids-accordion
      ?multiplePanelOpen=${args.multiplePanelOpen}
      chevron-position=${args.chevronPosition}
    >
      ${panels({ firstActive: args.firstActive, disabledThird: true })}
    </ids-accordion>
  `,
};

export const Basic: Story = {
  name: "Basic (edf demo)",
  render: () => html`
    <ids-accordion>
      <ids-accordion-panel>
        <ids-accordion-title>Title 1</ids-accordion-title>
        <ids-accordion-content>Content 1</ids-accordion-content>
      </ids-accordion-panel>
      <ids-accordion-panel>
        <ids-accordion-title>Title 2</ids-accordion-title>
        <ids-accordion-content>Content 2</ids-accordion-content>
      </ids-accordion-panel>
      <ids-accordion-panel>
        <ids-accordion-title>Title 3</ids-accordion-title>
        <ids-accordion-content>Content 3</ids-accordion-content>
      </ids-accordion-panel>
    </ids-accordion>
  `,
};

export const MultiplePanelOpen: Story = {
  name: "Open Multiple Accordion Panel",
  render: () => html`
    <ids-accordion idsMultiplePanelOpen>
      <ids-accordion-panel active>
        <ids-accordion-title>Title 1</ids-accordion-title>
        <ids-accordion-content>Content 1</ids-accordion-content>
      </ids-accordion-panel>
      <ids-accordion-panel active>
        <ids-accordion-title>Title 2</ids-accordion-title>
        <ids-accordion-content>Content 2</ids-accordion-content>
      </ids-accordion-panel>
      <ids-accordion-panel active>
        <ids-accordion-title>Title 3</ids-accordion-title>
        <ids-accordion-content>Content 3</ids-accordion-content>
      </ids-accordion-panel>
    </ids-accordion>
  `,
};

export const OpenOnLoad: Story = {
  name: "Open Accordion Panel on Load",
  render: () => html`
    <ids-accordion>
      <ids-accordion-panel active>
        <ids-accordion-title>Title 1</ids-accordion-title>
        <ids-accordion-content>Content 1</ids-accordion-content>
      </ids-accordion-panel>
      <ids-accordion-panel>
        <ids-accordion-title>Title 2</ids-accordion-title>
        <ids-accordion-content>Content 2</ids-accordion-content>
      </ids-accordion-panel>
      <ids-accordion-panel>
        <ids-accordion-title>Title 3</ids-accordion-title>
        <ids-accordion-content>Content 3</ids-accordion-content>
      </ids-accordion-panel>
    </ids-accordion>
  `,
};

export const ChevronRight: Story = {
  args: {
    chevronPosition: "right",
    firstActive: true,
  },
  render: (args) => html`
    <ids-accordion chevron-position=${args.chevronPosition}>
      ${panels({ firstActive: true, disabledThird: true })}
    </ids-accordion>
  `,
};

export const DisabledPanel: Story = {
  name: "First Panel Disabled",
  render: () => html`
    <ids-accordion>
      <ids-accordion-panel accordionPanelDisabled>
        <ids-accordion-title>Title 1</ids-accordion-title>
        <ids-accordion-content>Content 1</ids-accordion-content>
      </ids-accordion-panel>
      <ids-accordion-panel active>
        <ids-accordion-title>Title 2</ids-accordion-title>
        <ids-accordion-content>Content 2</ids-accordion-content>
      </ids-accordion-panel>
    </ids-accordion>
  `,
};

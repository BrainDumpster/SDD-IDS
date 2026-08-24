/**
 * Storybook: design-spec–generated Accordion from `lib/react/ids/accordion`
 * (React + CSS Modules, no @base-ui-components).
 *
 * Theme: components/ids-theme.css
 * Spec: components/ids/accordion/design-spec.md
 *
 * Nested hierarchy (Ids-prefixed):
 * IdsAccordion → IdsAccordionItem → IdsAccordionHeader / IdsAccordionBody →
 * IdsAccordionContent (generic children)
 *
 * CSS selectors: ids-accordion, ids-accordion-header, …
 */
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/ids-theme.css";
import {
  IdsAccordion,
  IdsAccordionBody,
  IdsAccordionContent,
  IdsAccordionHeader,
  IdsAccordionItem,
  type IdsAccordionItemInput,
  type IdsAccordionProps,
} from "../../../../lib/react/ids/accordion";

const demoItems: IdsAccordionItemInput[] = [
  {
    value: "network",
    title: "Network configuration",
    content: (
      <>
        <p>Configure network policies and service endpoints for this workspace.</p>
        <a href="#">Learn how network policies work</a>
      </>
    ),
  },
  {
    value: "security",
    title: "Security controls",
    content: "Manage access rules, authentication options, and audit controls.",
  },
  {
    value: "integrations",
    title: "Integrations",
    content: "Connect external systems and event pipelines.",
    disabled: true,
  },
];

const formItems: IdsAccordionItemInput[] = [
  {
    value: "contact",
    title: "Primary contact",
    content: (
      <>
        <p>Provide owner details for service notifications.</p>
        <label>
          Name
          <input defaultValue="Muthu" style={{ display: "block", width: "100%", marginTop: 4 }} />
        </label>
      </>
    ),
  },
  {
    value: "alerts",
    title: "Alert preferences",
    content: (
      <>
        <p>Select channels for critical and warning notifications.</p>
        <label>
          Channel
          <select defaultValue="email" style={{ display: "block", width: "100%", marginTop: 4 }}>
            <option value="email">Email</option>
            <option value="slack">Slack</option>
            <option value="pagerduty">PagerDuty</option>
          </select>
        </label>
      </>
    ),
  },
];

const meta: Meta<IdsAccordionProps> = {
  title: "Components/IDS/Accordion",
  component: IdsAccordion,
  parameters: {
    docs: {
      description: {
        component:
          "React IDS Accordion from `components/ids/accordion/design-spec.md`. " +
          "Parts: IdsAccordion, IdsAccordionItem, IdsAccordionHeader, IdsAccordionChevron, " +
          "IdsAccordionBody/Panel, IdsAccordionContent. " +
          "Selectors: `ids-accordion`, `ids-accordion-header`, …. " +
          "Theme: `components/ids-theme.css`. No `@base-ui-components`.",
      },
    },
  },
  args: {
    items: demoItems,
    multiple: false,
    chevronPosition: "left",
    variant: "default",
    defaultValue: ["network"],
  },
  argTypes: {
    multiple: { control: "boolean" },
    chevronPosition: { control: "radio", options: ["left", "right"] },
    variant: { control: "radio", options: ["default", "form"] },
  },
};

export default meta;
type Story = StoryObj<IdsAccordionProps>;

export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  render: (args) => <IdsAccordion {...args} />,
};

export const NestedHierarchy: Story = {
  name: "Nested Hierarchy",
  render: () => (
    <IdsAccordion defaultValue={["network"]} chevronPosition="left">
      <IdsAccordionItem value="network" first>
        <IdsAccordionHeader title="Network configuration" />
        <IdsAccordionBody>
          <IdsAccordionContent>
            <p>Configure network policies and service endpoints for this workspace.</p>
            <a href="#">Learn how network policies work</a>
          </IdsAccordionContent>
        </IdsAccordionBody>
      </IdsAccordionItem>

      <IdsAccordionItem value="security">
        <IdsAccordionHeader title="Security controls" />
        <IdsAccordionBody>
          <IdsAccordionContent>
            Manage access rules, authentication options, and audit controls.
          </IdsAccordionContent>
        </IdsAccordionBody>
      </IdsAccordionItem>

      <IdsAccordionItem value="integrations" disabled>
        <IdsAccordionHeader title="Integrations" />
        <IdsAccordionBody>
          <IdsAccordionContent>Connect external systems and event pipelines.</IdsAccordionContent>
        </IdsAccordionBody>
      </IdsAccordionItem>
    </IdsAccordion>
  ),
};

export const AllCollapsed: Story = {
  args: {
    defaultValue: [],
  },
};

export const MultiExpanded: Story = {
  args: {
    multiple: true,
    defaultValue: ["network", "security"],
  },
};

export const ChevronRight: Story = {
  args: {
    chevronPosition: "right",
    defaultValue: ["security"],
  },
};

export const WithFormContent: Story = {
  name: "With Form Content",
  args: {
    variant: "form",
    items: formItems,
    defaultValue: ["contact"],
  },
};

export const NestedGenericContent: Story = {
  name: "Nested Generic Content",
  render: () => (
    <IdsAccordion defaultValue={["contact"]}>
      <IdsAccordionItem value="contact" first>
        <IdsAccordionHeader title="Primary contact" />
        <IdsAccordionBody>
          <IdsAccordionContent>
            <p>Provide owner details for service notifications.</p>
            <label>
              Name
              <input defaultValue="Muthu" style={{ display: "block", width: "100%", marginTop: 4 }} />
            </label>
            <p style={{ marginTop: 12 }}>
              <a href="#">Learn more about contacts</a>
            </p>
          </IdsAccordionContent>
        </IdsAccordionBody>
      </IdsAccordionItem>
    </IdsAccordion>
  ),
};

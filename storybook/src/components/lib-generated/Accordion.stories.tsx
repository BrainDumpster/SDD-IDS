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
import { SPEC_ACCURATE_DESIGN_STORY } from "../../../../component-contracts/common/story-meta";
import "../../../../components/ids-theme.css";
import {
  ACCORDION_DOCS_DESCRIPTION,
  ACCORDION_SOURCE_CODE,
  ACCORDION_STORY_SOURCE_CODE,
} from "./ids-accordion.developer-usage";
import {
  IdsAccordion,
  IdsAccordionBody,
  IdsAccordionContent,
  IdsAccordionHeader,
  IdsAccordionItem,
  type IdsAccordionItemInput,
  type IdsAccordionProps,
} from "@ids/react/accordion";

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
  },
];

const meta: Meta<IdsAccordionProps> = {
  title: "Components/IDS/Accordion",
  component: IdsAccordion,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      canvas: { sourceState: "open" },
      description: {
        component: ACCORDION_DOCS_DESCRIPTION,
      },
      source: {
        type: "code",
        language: "tsx",
        code: ACCORDION_SOURCE_CODE,
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
    multiple: {
      control: "boolean",
      description: "When false, only one panel may be open.",
      table: { category: "Props", defaultValue: { summary: "false" } },
    },
    defaultValue: {
      control: "object",
      description: "Uncontrolled initially open panel `value` ids.",
      table: { category: "Props" },
    },
    value: {
      control: false,
      description: "Controlled open panel `value` ids.",
      table: { category: "Props" },
    },
    chevronPosition: {
      control: "radio",
      options: ["left", "right"],
      description: "Chevron placement on the header trigger.",
      table: { category: "Props", defaultValue: { summary: "left" } },
    },
    variant: {
      control: "radio",
      options: ["default", "form"],
      description: "Visual / layout variant.",
      table: { category: "Props", defaultValue: { summary: "default" } },
    },
    items: {
      control: false,
      description: "Convenience API — builds composition parts from an array.",
      table: { category: "Props" },
    },
    children: {
      control: false,
      description: "Composition API — project IdsAccordionItem children.",
      table: { category: "Props" },
    },
    onValueChange: {
      action: "onValueChange",
      description: "Emits open panel `value` ids after toggle.",
      table: { category: "Events" },
    },
    className: {
      control: false,
      table: { category: "Props" },
    },
  },
};

export default meta;
type Story = StoryObj<IdsAccordionProps>;

export const SpecAccurateDesign: Story = {
  name: SPEC_ACCURATE_DESIGN_STORY,
  parameters: {
    docs: {
      description: {
        story:
          "Spec Accurate Design: single-expand, first panel open (`network`), left chevron, default variant — composition markup.",
      },
      source: {
        type: "code",
        language: "tsx",
        code: ACCORDION_STORY_SOURCE_CODE,
      },
    },
  },
  render: (args) => (
    <IdsAccordion {...args} items={undefined} onValueChange={args.onValueChange}>
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

      <IdsAccordionItem value="integrations">
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

/** Long panel title clamps to two lines; hovering shows the native browser tooltip with the full text. */
export const TruncatedTitleTooltip: Story = {
  name: "Truncated Title Tooltip",
  args: {
    items: [
      {
        value: "long-title",
        title:
          "Network configuration with an unusually long and descriptive panel title that wraps to two lines and then truncates with an ellipsis so the full text is only reachable via the browser tooltip",
        content: "Hover the truncated title to see the full text in a native browser tooltip.",
      },
      ...demoItems,
    ],
    defaultValue: [],
  },
};


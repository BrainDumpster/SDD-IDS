import type { Meta, StoryObj } from "@storybook/react";
import "../tokens.css";
import Accordion from "./Accordion";
import type { AccordionItemInput } from "./Accordion";

/**
 * Joe-Generated Accordion — uses only:
 * - storybook/src/components/dap/joe-generated/Accordion/Accordion.tsx
 * - storybook/src/components/dap/joe-generated/Accordion/Accordion.css (imported by Accordion.tsx)
 * - storybook/src/components/dap/joe-generated/tokens.css
 * Spec MDX: components/DAP/joe-generated/Accordion/accordion.mdx
 */

const sampleItems: AccordionItemInput[] = [
  {
    value: "item-1",
    title: "Accordion item one",
    content: (
      <p>
        Panel content for item one.{" "}
        <a href="https://example.com" style={{ color: "var(--color-text-link-brand-base)" }}>
          Learn how
        </a>
      </p>
    ),
  },
  {
    value: "item-2",
    title: "Accordion item two",
    content: <p>Panel content for item two.</p>,
  },
  {
    value: "item-3",
    title: "Accordion item three",
    content: <p>Panel content for item three.</p>,
  },
];

const meta: Meta<typeof Accordion> = {
  title: "Spec Generated/DAP/Joe-Generated/Accordion",
  component: Accordion,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Joe-generated DAP Accordion. Implementation: `storybook/src/components/dap/joe-generated/Accordion/Accordion.tsx` + `Accordion.css`. Tokens: `storybook/src/components/dap/joe-generated/tokens.css`. Spec MDX: `components/DAP/joe-generated/Accordion/accordion.mdx`.",
      },
    },
  },
  argTypes: {
    multiple: { control: "boolean" },
    chevronPosition: { control: "select", options: ["left", "right"] },
    variant: { control: "select", options: ["default", "form"] },
    onValueChange: { action: "onValueChange" },
  },
  args: {
    items: sampleItems,
    multiple: false,
    defaultValue: [],
    chevronPosition: "left",
    variant: "default",
  },
  decorators: [
    (Story) => (
      <div style={{ width: "100%", maxWidth: 640 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Accordion>;

/** MDX scenario: all collapsed */
export const Default: Story = {
  args: {
    items: sampleItems,
    multiple: false,
    defaultValue: [],
    chevronPosition: "left",
    variant: "default",
  },
};

/** MDX scenario: one expanded */
export const OneExpanded: Story = {
  args: {
    items: sampleItems,
    multiple: false,
    defaultValue: ["item-1"],
    chevronPosition: "left",
    variant: "default",
  },
};

/** MDX scenario: multi expanded */
export const MultipleExpanded: Story = {
  args: {
    items: sampleItems,
    multiple: true,
    defaultValue: ["item-1", "item-3"],
    chevronPosition: "left",
    variant: "default",
  },
};

export const ChevronRight: Story = {
  args: {
    items: sampleItems,
    multiple: false,
    defaultValue: ["item-2"],
    chevronPosition: "right",
    variant: "default",
  },
};

export const WithDisabledItem: Story = {
  args: {
    items: [
      sampleItems[0],
      {
        value: "item-disabled",
        title: "Disabled item",
        content: <p>This panel should not open.</p>,
        disabled: true,
      },
      sampleItems[2],
    ],
    multiple: false,
    defaultValue: ["item-1"],
    chevronPosition: "left",
    variant: "default",
  },
};

export const WithMeta: Story = {
  args: {
    items: [
      {
        value: "item-meta",
        title: "Item with meta",
        content: <p>Primary panel content.</p>,
        meta: <p>Optional helper text / metadata.</p>,
      },
      sampleItems[1],
    ],
    multiple: false,
    defaultValue: ["item-meta"],
    chevronPosition: "left",
    variant: "default",
  },
};

/** MDX scenario: accordion with form */
export const WithForm: Story = {
  args: {
    items: [
      {
        value: "item-form",
        title: "Accordion with form",
        content: <p>Form-adjacent panel content.</p>,
        formSlot: (
          <label style={{ display: "grid", gap: 8 }}>
            <span>Label</span>
            <input type="text" defaultValue="" aria-label="Sample form field" />
          </label>
        ),
      },
      sampleItems[1],
    ],
    multiple: false,
    defaultValue: ["item-form"],
    chevronPosition: "left",
    variant: "form",
  },
};

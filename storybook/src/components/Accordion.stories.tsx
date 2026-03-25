import type { Meta, StoryObj } from "@storybook/react";
import { Accordion } from "./Accordion";

const meta: Meta<typeof Accordion> = {
  title: "Synapse/Accordion",
  component: Accordion,
};

export default meta;
type Story = StoryObj<typeof Accordion>;

const items = [
  {
    value: "section1",
    title: "What is Synapse?",
    content: "Synapse is a design system providing consistent, accessible UI components for enterprise applications.",
  },
  {
    value: "section2",
    title: "How do I get started?",
    content: "Install @base-ui-components/react and import the Synapse theme CSS. Then use the components in your React application.",
  },
  {
    value: "section3",
    title: "Is dark mode supported?",
    content: "Yes. Set data-theme=\"dark\" on your root element. All Synapse tokens automatically switch to dark values.",
  },
];

export const Default: Story = {
  args: { items },
};

export const FirstOpen: Story = {
  args: { items, defaultValue: ["section1"] },
};

export const Multiple: Story = {
  args: { items, multiple: true, defaultValue: ["section1", "section2"] },
};

export const WithDisabled: Story = {
  args: {
    items: [
      ...items,
      { value: "locked", title: "Premium features (locked)", content: "Upgrade to access.", disabled: true },
    ],
  },
};

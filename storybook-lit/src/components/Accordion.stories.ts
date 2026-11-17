import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "@ids/core/accordion/register.js";
import {
  ACCORDION_DOCS_DESCRIPTION,
  ACCORDION_SOURCE_CODE,
} from "./ids-accordion.developer-usage";

type DemoItem = {
  value: string;
  title: string;
  content: string;
  disabled?: boolean;
};

type AccordionArgs = {
  items: DemoItem[];
  multiple: boolean;
  chevronPosition: "left" | "right";
  defaultValue: string[];
  width: number | string | null;
  maxWidth: number | string | null;
  panelMaxHeight: number | string | null;
};

/** Mirrors `component-contracts/ids/accordion.contract.ts` (demo matrix). */
const DEMO_ITEMS: DemoItem[] = [
  {
    value: "section1",
    title: "Network configuration",
    content:
      "Configure network policies and service endpoints for this workspace. Learn how network policies work in the admin guide.",
  },
  {
    value: "section2",
    title: "Security controls",
    content:
      "Manage access rules, authentication options, and audit controls for your environment.",
  },
  {
    value: "section3",
    title: "Integrations",
    content:
      "Connect external systems and event pipelines. This section is disabled in the demo matrix.",
    disabled: true,
  },
];

const LONG_CONTENT = Array.from(
  { length: 12 },
  (_, i) =>
    `Paragraph ${i + 1}: Configure network policies, service endpoints, and audit controls for this workspace.`,
).join(" ");

function renderPanels(items: DemoItem[]) {
  return items.map(
    (item) => html`
      <ids-accordion-panel
        value=${item.value}
        ?accordionpaneldisabled=${Boolean(item.disabled)}
      >
        <ids-accordion-title>${item.title}</ids-accordion-title>
        <ids-accordion-content>${item.content}</ids-accordion-content>
      </ids-accordion-panel>
    `,
  );
}

const meta: Meta<AccordionArgs> = {
  title: "Spec Generated/IDS/Accordion",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: { component: ACCORDION_DOCS_DESCRIPTION },
      source: { code: ACCORDION_SOURCE_CODE, language: "html" },
    },
  },
  argTypes: {
    multiple: { control: "boolean" },
    chevronPosition: {
      control: "select",
      options: ["left", "right"],
    },
    defaultValue: { control: "object" },
    width: {
      control: "text",
      description: "Root width — fluid (100%) by default. Numbers are px.",
    },
    maxWidth: {
      control: "text",
      description: "Root max-width — unset by default. Numbers are px.",
    },
    panelMaxHeight: {
      control: "text",
      description: "Panel body max-height — unset by default; overflow scrolls. Numbers are px.",
    },
    items: { control: false },
  },
  args: {
    items: DEMO_ITEMS,
    multiple: false,
    chevronPosition: "left",
    defaultValue: [],
    width: null,
    maxWidth: null,
    panelMaxHeight: null,
  },
  render: (args) => html`
    <ids-accordion
      ?multiple=${args.multiple}
      chevron-position=${args.chevronPosition}
      .defaultValue=${args.defaultValue}
      .width=${args.width}
      .maxWidth=${args.maxWidth}
      .panelMaxHeight=${args.panelMaxHeight}
    >
      ${renderPanels(args.items)}
    </ids-accordion>
  `,
};

export default meta;
type Story = StoryObj<AccordionArgs>;

/** Spec Accurate Design: single-expand, first panel open, left chevron, default variant. */
export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  args: {
    items: DEMO_ITEMS,
    multiple: false,
    chevronPosition: "left",
    defaultValue: ["section1"],
  },
};

export const Default: Story = {};

export const FirstOpen: Story = {
  name: "First open",
  args: {
    defaultValue: ["section1"],
  },
};

export const MultipleOpen: Story = {
  name: "Multiple open",
  args: {
    multiple: true,
    defaultValue: ["section1", "section2"],
  },
};

export const ChevronLeft: Story = {
  name: "Chevron left",
  args: {
    chevronPosition: "left",
    defaultValue: ["section1"],
  },
};

export const ChevronRight: Story = {
  name: "Chevron right",
  args: {
    chevronPosition: "right",
    defaultValue: ["section1"],
  },
};

export const FixedWidth: Story = {
  name: "Fixed width (480px)",
  args: {
    width: 480,
    defaultValue: ["section1"],
  },
};

export const MaxWidth: Story = {
  name: "Max width (640px)",
  args: {
    maxWidth: 640,
    defaultValue: ["section1"],
  },
};

export const PanelMaxHeight: Story = {
  name: "Panel max height (120px)",
  args: {
    panelMaxHeight: 120,
    defaultValue: ["section1"],
    items: [
      {
        value: "long1",
        title: "Long section",
        content: LONG_CONTENT,
      },
      ...DEMO_ITEMS.slice(1, 2),
    ],
  },
};

export const TruncatedTitle: Story = {
  name: "Truncated title (2-line clamp)",
  args: {
    width: 320,
    defaultValue: ["long1"],
    items: [
      {
        value: "long1",
        title:
          "A very long accordion header title that keeps going well past two lines so the clamp truncates it with an ellipsis and exposes the full text as a tooltip",
        content: "Hover the truncated header to read the full title.",
      },
      ...DEMO_ITEMS.slice(1, 2),
    ],
  },
};

/** Optional `AccordionMetaSlot`: helper text placed in the header via `slot="meta"`. */
export const WithMeta: Story = {
  name: "With meta slot",
  render: () => html`
    <ids-accordion .defaultValue=${["section1"]}>
      <ids-accordion-panel value="section1">
        <ids-accordion-title>
          Network configuration
          <span slot="meta">3 policies</span>
        </ids-accordion-title>
        <ids-accordion-content>${DEMO_ITEMS[0]!.content}</ids-accordion-content>
      </ids-accordion-panel>
      <ids-accordion-panel value="section2">
        <ids-accordion-title>
          Security controls
          <span slot="meta">Updated today</span>
        </ids-accordion-title>
        <ids-accordion-content>${DEMO_ITEMS[1]!.content}</ids-accordion-content>
      </ids-accordion-panel>
    </ids-accordion>
  `,
};

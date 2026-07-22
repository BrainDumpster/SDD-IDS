import type { Meta, StoryObj } from "@storybook/react";
import "../tokens.css";
import Tab from "./Tab";
import type { TabItem } from "./Tab";

/**
 * Joe-Generated Tab — uses only:
 * - storybook/src/components/dap/joe-generated/Tab/Tab.tsx
 * - storybook/src/components/dap/joe-generated/Tab/Tab.css (imported by Tab.tsx)
 * - storybook/src/components/dap/joe-generated/tokens.css
 * Spec MDX: components/DAP/joe-generated/Tab/tab.mdx
 */

const sampleItems: TabItem[] = [
  {
    id: "overview",
    label: "Overview",
    content: <p>Overview panel content.</p>,
  },
  {
    id: "details",
    label: "Details",
    content: <p>Details panel content.</p>,
  },
  {
    id: "settings",
    label: "Settings",
    content: <p>Settings panel content.</p>,
  },
];

const itemsWithIcons: TabItem[] = [
  {
    id: "home",
    label: "Home",
    iconSlug: "home",
    content: <p>Home panel content.</p>,
  },
  {
    id: "info",
    label: "Info",
    iconSlug: "info-circ",
    content: <p>Info panel content.</p>,
  },
  {
    id: "alerts",
    label: "Alerts",
    iconSlug: "alert-bell",
    content: <p>Alerts panel content.</p>,
  },
];

const itemsWithBadgeAndAlert: TabItem[] = [
  {
    id: "inbox",
    label: "Inbox",
    badgeCount: 3,
    content: <p>Inbox panel content.</p>,
  },
  {
    id: "warnings",
    label: "Warnings",
    hasAlert: true,
    content: <p>Warnings panel content.</p>,
  },
  {
    id: "archive",
    label: "Archive",
    content: <p>Archive panel content.</p>,
  },
];

const itemsWithClosable: TabItem[] = [
  {
    id: "tab-1",
    label: "Tab One",
    closable: true,
    content: <p>Tab one panel content.</p>,
  },
  {
    id: "tab-2",
    label: "Tab Two",
    closable: true,
    content: <p>Tab two panel content.</p>,
  },
  {
    id: "tab-3",
    label: "Tab Three",
    content: <p>Tab three panel content.</p>,
  },
];

const itemsWithDisabled: TabItem[] = [
  {
    id: "active",
    label: "Active",
    content: <p>Active panel content.</p>,
  },
  {
    id: "disabled",
    label: "Disabled",
    disabled: true,
    content: <p>Disabled panel content.</p>,
  },
  {
    id: "other",
    label: "Other",
    content: <p>Other panel content.</p>,
  },
];

const meta: Meta<typeof Tab> = {
  title: "Spec Generated/DAP/Joe-Generated/Tab",
  component: Tab,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Joe-generated DAP Tab. Implementation: `storybook/src/components/dap/joe-generated/Tab/Tab.tsx` + `Tab.css`. Tokens: `storybook/src/components/dap/joe-generated/tokens.css`. Spec MDX: `components/DAP/joe-generated/Tab/tab.mdx`.",
      },
    },
  },
  argTypes: {
    type: {
      control: "select",
      options: ["primary", "secondary"],
    },
    allowAddTab: { control: "boolean" },
    addTabLabel: { control: "text" },
    overflow: { control: "boolean" },
    moreLabel: { control: "text" },
    defaultActiveItemId: { control: "text" },
    activeItemId: { control: "text" },
    onActiveItemChange: { action: "onActiveItemChange" },
    onTabSelect: { action: "onTabSelect" },
    onAddTab: { action: "onAddTab" },
    onOverflowSelection: { action: "onOverflowSelection" },
    onItemsChange: { action: "onItemsChange" },
  },
  args: {
    items: sampleItems,
    type: "secondary",
    defaultActiveItemId: "overview",
    allowAddTab: false,
    addTabLabel: "Add Tab",
    overflow: false,
    moreLabel: "More",
  },
  decorators: [
    (Story) => (
      <div style={{ width: "100%", maxWidth: 720 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Tab>;

/** MDX default: secondary type, at least two tabs */
export const Default: Story = {
  args: {
    items: sampleItems,
    type: "secondary",
    defaultActiveItemId: "overview",
  },
};

/** MDX variant axis: style = primary */
export const Primary: Story = {
  args: {
    items: sampleItems,
    type: "primary",
    defaultActiveItemId: "overview",
  },
};

/** Item decoration: icon */
export const WithIcons: Story = {
  args: {
    items: itemsWithIcons,
    type: "secondary",
    defaultActiveItemId: "home",
  },
};

/** Item decorations: badge + alert */
export const WithBadgeAndAlert: Story = {
  args: {
    items: itemsWithBadgeAndAlert,
    type: "secondary",
    defaultActiveItemId: "inbox",
  },
};

/** Item decoration: closable */
export const WithClosable: Story = {
  args: {
    items: itemsWithClosable,
    type: "secondary",
    defaultActiveItemId: "tab-1",
  },
};

/** MDX: allowAddTab + addTabLabel */
export const WithAddTab: Story = {
  args: {
    items: sampleItems,
    type: "secondary",
    defaultActiveItemId: "overview",
    allowAddTab: true,
    addTabLabel: "Add Tab",
  },
};

/** Item: disabled */
export const WithDisabledItem: Story = {
  args: {
    items: itemsWithDisabled,
    type: "secondary",
    defaultActiveItemId: "active",
  },
};

/** Primary + icons + badge (combined anatomy) */
export const PrimaryWithDecorations: Story = {
  args: {
    items: [
      {
        id: "overview",
        label: "Overview",
        iconSlug: "home",
        content: <p>Overview panel content.</p>,
      },
      {
        id: "messages",
        label: "Messages",
        iconSlug: "alert-bell",
        badgeCount: 5,
        content: <p>Messages panel content.</p>,
      },
      {
        id: "info",
        label: "Info",
        iconSlug: "info-circ",
        hasAlert: true,
        content: <p>Info panel content.</p>,
      },
    ],
    type: "primary",
    defaultActiveItemId: "overview",
  },
};

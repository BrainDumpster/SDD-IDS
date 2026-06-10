import "../../../components/ids-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import shieldEncryptAltIcon from "../../../assets/icons/shield-encrypt-alt.svg";
import { Tabs } from "./Tabs";

const baseItems = [
  {
    id: "overview",
    label: "Overview",
    panel: "Overview tab content area.",
  },
  {
    id: "security",
    label: "Security",
    panel: "Security tab content area.",
    icon: <img src={shieldEncryptAltIcon} alt="" width={16} height={16} />,
  },
  {
    id: "alerts",
    label: "Alerts",
    panel: "Alerts tab content area with related data.",
  },
];

const overflowItems = [
  { id: "summary", label: "Summary", panel: "Summary content." },
  { id: "details", label: "Details", panel: "Details content." },
  { id: "settings", label: "Settings", panel: "Settings content." },
  { id: "activity", label: "Activity", panel: "Activity content." },
  { id: "audit", label: "Audit Trail", panel: "Audit trail content." },
  { id: "integrations", label: "Integrations", panel: "Integrations content." },
  { id: "policies", label: "Policies", panel: "Policies content." },
];

const meta: Meta<typeof Tabs> = {
  title: "Spec Generated/IDS/Tabs",
  component: Tabs,
  args: {
    items: baseItems,
    variant: "secondary",
    surface: "elevated",
    showAddTab: false,
    addTabLabel: "Add Tab",
    minTabWidth: 80,
    maxTabWidth: 250,
    moreLabel: "More",
  },
  argTypes: {
    variant: { control: "select", options: ["primary", "secondary"] },
    surface: { control: "select", options: ["elevated", "transparent"] },
    showAddTab: { control: "boolean" },
    addTabLabel: { control: "text" },
    moreLabel: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const SecondaryDefault: Story = {
  args: {
    variant: "secondary",
    items: baseItems,
  },
};

export const PrimaryVariant: Story = {
  args: {
    variant: "primary",
    items: baseItems,
  },
};

export const TransparentOnGray: Story = {
  args: {
    variant: "secondary",
    surface: "transparent",
    items: baseItems,
  },
  render: (args) => (
    <div
      style={{
        maxWidth: 720,
        padding: 16,
        background: "var(--color-background-gray-light)",
      }}
    >
      <Tabs {...args} />
    </div>
  ),
};

export const OverflowResponsive: Story = {
  args: {
    items: overflowItems,
    variant: "secondary",
    showAddTab: false,
  },
  render: (args) => (
    <div style={{ maxWidth: 560 }}>
      <Tabs {...args} />
    </div>
  ),
};

export const AddTabDynamic: Story = {
  render: () => {
    const [items, setItems] = useState(overflowItems.slice(0, 4));

    return (
      <div style={{ maxWidth: 700 }}>
        <Tabs
          items={items}
          variant="secondary"
          showAddTab
          addTabLabel="Add Tab"
          onAddTab={() => {
            const nextIndex = items.length + 1;
            const id = `new-${nextIndex}`;
            setItems((prev) => [
              ...prev,
              {
                id,
                label: `Tab ${nextIndex}`,
                panel: `Dynamic tab content for Tab ${nextIndex}.`,
              },
            ]);
          }}
        />
      </div>
    );
  },
};

export const AddLabelSecondary: Story = {
  args: {
    items: overflowItems,
    variant: "secondary",
    showAddTab: true,
    addTabLabel: "Create Tab",
  },
  render: (args) => (
    <div style={{ maxWidth: 760 }}>
      <Tabs {...args} />
    </div>
  ),
};

export const AddLabelPrimary: Story = {
  args: {
    items: overflowItems,
    variant: "primary",
    showAddTab: true,
    addTabLabel: "Add Section",
  },
  render: (args) => (
    <div style={{ maxWidth: 760 }}>
      <Tabs {...args} />
    </div>
  ),
};

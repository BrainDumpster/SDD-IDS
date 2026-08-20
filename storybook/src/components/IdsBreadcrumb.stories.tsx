import "../../../components/ids-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import { IdsBreadcrumb } from "./IdsBreadcrumb";

const meta: Meta<typeof IdsBreadcrumb> = {
  title: "Spec Generated/IDS/Breadcrumb",
  component: IdsBreadcrumb,
  args: {
    items: [
      { label: "Breadcrumb 1", href: "#" },
      { label: "Breadcrumb 2", href: "#" },
      { label: "Breadcrumb 3", href: "#" },
      { label: "Breadcrumb 4", href: "#" },
    ],
    truncate: false,
    maxVisibleItems: 3,
    showDropdown: false,
  },
  argTypes: {
    items: {
      control: "object",
      description: "Array of breadcrumb items with label and href",
    },
    currentPage: {
      control: "text",
      description: "Current page text displayed on the second line",
    },
    truncate: { control: "boolean", description: "Whether to truncate with '...'" },
    maxVisibleItems: { control: "number", description: "Max items before truncation" },
    showDropdown: { control: "boolean", description: "Show dropdown on hover of '...'" },
  },
};

export default meta;
type Story = StoryObj<typeof IdsBreadcrumb>;

export const Default: Story = {
  args: {
    items: [
      { label: "Breadcrumb 1", href: "#" },
      { label: "Breadcrumb 2", href: "#" },
      { label: "Breadcrumb 3", href: "#" },
      { label: "Breadcrumb 4", href: "#" },
    ],
  },
  render: (args) => (
    <div
      style={{
        resize: "both",
        overflow: "auto",
        maxWidth: "100%",
        minWidth: 200,
        padding: 16,
        border: "1px dashed var(--color-border-gray-neutral-base, #757575)",
        borderRadius: 4,
      }}
    >
      <IdsBreadcrumb {...args} />
    </div>
  ),
};

export const TwoLinesOneItem: Story = {
  args: {
    items: [
      { label: "Breadcrumb 1", href: "#" },
    ],
    currentPage: "Current Page",
    truncate: false,
  },
};

export const TwoLinesTwoItems: Story = {
  args: {
    items: [
      { label: "Breadcrumb 1", href: "#" },
      { label: "Breadcrumb 2", href: "#" },
    ],
    currentPage: "Current Page",
    truncate: false,
  },
};

export const TwoLinesThreeItems: Story = {
  args: {
    items: [
      { label: "Breadcrumb 1", href: "#" },
      { label: "Breadcrumb 2", href: "#" },
      { label: "Breadcrumb 3", href: "#" },
    ],
    currentPage: "Current Page",
    truncate: false,
  },
};

export const TwoLinesFourItems: Story = {
  args: {
    items: [
      { label: "Breadcrumb 1", href: "#" },
      { label: "Breadcrumb 2", href: "#" },
      { label: "Breadcrumb 3", href: "#" },
      { label: "Breadcrumb 4", href: "#" },
    ],
    currentPage: "Current Page",
    truncate: false,
  },
};

export const TwoLinesFiveItemsTruncated: Story = {
  args: {
    items: [
      { label: "Breadcrumb 1", href: "#" },
      { label: "Breadcrumb 2", href: "#" },
      { label: "Breadcrumb 3", href: "#" },
      { label: "Breadcrumb 4", href: "#" },
      { label: "Breadcrumb 5", href: "#" },
    ],
    currentPage: "Current Page",
    truncate: true,
    maxVisibleItems: 3,
    showDropdown: true,
  },
};

export const VariantsMatrix: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 32 }}>
      <div>
        <h3>Breadcrumb - 1 Item</h3>
        <IdsBreadcrumb
          items={[
            { label: "Breadcrumb 1", href: "#" },
          ]}
          currentPage="Current Page"
          truncate={false}
        />
      </div>
      <div>
        <h3>Breadcrumb - 2 Items</h3>
        <IdsBreadcrumb
          items={[
            { label: "Breadcrumb 1", href: "#" },
            { label: "Breadcrumb 2", href: "#" },
          ]}
          currentPage="Current Page"
          truncate={false}
        />
      </div>
      <div>
        <h3>Breadcrumb - 3 Items</h3>
        <IdsBreadcrumb
          items={[
            { label: "Breadcrumb 1", href: "#" },
            { label: "Breadcrumb 2", href: "#" },
            { label: "Breadcrumb 3", href: "#" },
          ]}
          currentPage="Current Page"
          truncate={false}
        />
      </div>
      <div>
        <h3>Breadcrumb - 4 Items</h3>
        <IdsBreadcrumb
          items={[
            { label: "Breadcrumb 1", href: "#" },
            { label: "Breadcrumb 2", href: "#" },
            { label: "Breadcrumb 3", href: "#" },
            { label: "Breadcrumb 4", href: "#" },
          ]}
          currentPage="Current Page"
          truncate={false}
        />
      </div>
      <div>
        <h3>Breadcrumb - 5 Items Truncated (hover on "...")</h3>
        <IdsBreadcrumb
          items={[
            { label: "Breadcrumb 1", href: "#" },
            { label: "Breadcrumb 2", href: "#" },
            { label: "Breadcrumb 3", href: "#" },
            { label: "Breadcrumb 4", href: "#" },
            { label: "Breadcrumb 5", href: "#" },
          ]}
          currentPage="Current Page"
          truncate={true}
          maxVisibleItems={3}
          showDropdown={true}
        />
      </div>
    </div>
  ),
};

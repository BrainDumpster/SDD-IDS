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
    twoLines: false,
    truncate: false,
    maxVisibleItems: 4,
    showDropdown: false,
  },
  argTypes: {
    items: {
      control: "object",
      description: "Array of breadcrumb items with label and href",
    },
    currentPage: {
      control: "text",
      description: "Current page text (for two-line variant)",
    },
    twoLines: { control: "boolean", description: "Whether to use two-line layout" },
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
};

export const OneLineOneItem: Story = {
  args: {
    items: [
      { label: "Breadcrumb 1", href: "#" },
    ],
    twoLines: false,
    truncate: false,
  },
};

export const OneLineTwoItems: Story = {
  args: {
    items: [
      { label: "Breadcrumb 1", href: "#" },
      { label: "Breadcrumb 2", href: "#" },
    ],
    twoLines: false,
    truncate: false,
  },
};

export const OneLineThreeItems: Story = {
  args: {
    items: [
      { label: "Breadcrumb 1", href: "#" },
      { label: "Breadcrumb 2", href: "#" },
      { label: "Breadcrumb 3", href: "#" },
    ],
    twoLines: false,
    truncate: false,
  },
};

export const OneLineFourItems: Story = {
  args: {
    items: [
      { label: "Breadcrumb 1", href: "#" },
      { label: "Breadcrumb 2", href: "#" },
      { label: "Breadcrumb 3", href: "#" },
      { label: "Breadcrumb 4", href: "#" },
    ],
    twoLines: false,
    truncate: false,
  },
};

export const OneLineFiveItemsTruncated: Story = {
  args: {
    items: [
      { label: "Breadcrumb 1", href: "#" },
      { label: "Breadcrumb 2", href: "#" },
      { label: "Breadcrumb 3", href: "#" },
      { label: "Breadcrumb 4", href: "#" },
      { label: "Breadcrumb 5", href: "#" },
    ],
    twoLines: false,
    truncate: true,
    maxVisibleItems: 4,
    showDropdown: true,
  },
};

export const TwoLinesOneItem: Story = {
  args: {
    items: [
      { label: "Breadcrumb 1", href: "#" },
    ],
    twoLines: true,
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
    twoLines: true,
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
    twoLines: true,
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
    twoLines: true,
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
    twoLines: true,
    currentPage: "Current Page",
    truncate: true,
    maxVisibleItems: 4,
    showDropdown: true,
  },
};

export const VariantsMatrix: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 32 }}>
      <div>
        <h3>One Line - 1 Item</h3>
        <IdsBreadcrumb
          items={[
            { label: "Breadcrumb 1", href: "#" },
          ]}
          twoLines={false}
          truncate={false}
        />
      </div>
      <div>
        <h3>One Line - 2 Items</h3>
        <IdsBreadcrumb
          items={[
            { label: "Breadcrumb 1", href: "#" },
            { label: "Breadcrumb 2", href: "#" },
          ]}
          twoLines={false}
          truncate={false}
        />
      </div>
      <div>
        <h3>One Line - 3 Items</h3>
        <IdsBreadcrumb
          items={[
            { label: "Breadcrumb 1", href: "#" },
            { label: "Breadcrumb 2", href: "#" },
            { label: "Breadcrumb 3", href: "#" },
          ]}
          twoLines={false}
          truncate={false}
        />
      </div>
      <div>
        <h3>One Line - 4 Items</h3>
        <IdsBreadcrumb
          items={[
            { label: "Breadcrumb 1", href: "#" },
            { label: "Breadcrumb 2", href: "#" },
            { label: "Breadcrumb 3", href: "#" },
            { label: "Breadcrumb 4", href: "#" },
          ]}
          twoLines={false}
          truncate={false}
        />
      </div>
      <div>
        <h3>One Line - 5 Items Truncated (hover on "...")</h3>
        <IdsBreadcrumb
          items={[
            { label: "Breadcrumb 1", href: "#" },
            { label: "Breadcrumb 2", href: "#" },
            { label: "Breadcrumb 3", href: "#" },
            { label: "Breadcrumb 4", href: "#" },
            { label: "Breadcrumb 5", href: "#" },
          ]}
          twoLines={false}
          truncate={true}
          maxVisibleItems={4}
          showDropdown={true}
        />
      </div>
      <div>
        <h3>Two Lines - 1 Item</h3>
        <IdsBreadcrumb
          items={[
            { label: "Breadcrumb 1", href: "#" },
          ]}
          twoLines={true}
          currentPage="Current Page"
          truncate={false}
        />
      </div>
      <div>
        <h3>Two Lines - 2 Items</h3>
        <IdsBreadcrumb
          items={[
            { label: "Breadcrumb 1", href: "#" },
            { label: "Breadcrumb 2", href: "#" },
          ]}
          twoLines={true}
          currentPage="Current Page"
          truncate={false}
        />
      </div>
      <div>
        <h3>Two Lines - 3 Items</h3>
        <IdsBreadcrumb
          items={[
            { label: "Breadcrumb 1", href: "#" },
            { label: "Breadcrumb 2", href: "#" },
            { label: "Breadcrumb 3", href: "#" },
          ]}
          twoLines={true}
          currentPage="Current Page"
          truncate={false}
        />
      </div>
      <div>
        <h3>Two Lines - 4 Items</h3>
        <IdsBreadcrumb
          items={[
            { label: "Breadcrumb 1", href: "#" },
            { label: "Breadcrumb 2", href: "#" },
            { label: "Breadcrumb 3", href: "#" },
            { label: "Breadcrumb 4", href: "#" },
          ]}
          twoLines={true}
          currentPage="Current Page"
          truncate={false}
        />
      </div>
      <div>
        <h3>Two Lines - 5 Items Truncated (hover on "...")</h3>
        <IdsBreadcrumb
          items={[
            { label: "Breadcrumb 1", href: "#" },
            { label: "Breadcrumb 2", href: "#" },
            { label: "Breadcrumb 3", href: "#" },
            { label: "Breadcrumb 4", href: "#" },
            { label: "Breadcrumb 5", href: "#" },
          ]}
          twoLines={true}
          currentPage="Current Page"
          truncate={true}
          maxVisibleItems={4}
          showDropdown={true}
        />
      </div>
    </div>
  ),
};

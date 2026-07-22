import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import "../tokens.css";
import GlobalSearch from "./GlobalSearch";
import type { SearchResult } from "./GlobalSearch";

/**
 * Joe-Generated GlobalSearch — uses only:
 * - storybook/src/components/dap/joe-generated/GlobalSearch/GlobalSearch.tsx
 * - storybook/src/components/dap/joe-generated/GlobalSearch/GlobalSearch.css (imported by GlobalSearch.tsx)
 * - storybook/src/components/dap/joe-generated/tokens.css
 * Spec MDX: components/DAP/joe-generated/GlobalSearch/global-search.mdx
 */

const sampleResults: SearchResult[] = [
  {
    id: "r1",
    title: "PowerEdge R760",
    description: "2U rack server for dense compute workloads",
    category: "Products",
  },
  {
    id: "r2",
    title: "PowerStore documentation",
    description: "Admin guide and API reference",
    category: "Docs",
  },
  {
    id: "r3",
    title: "Create support request",
    description: "Open a case with Dell Technologies Support",
    category: "Support",
  },
  {
    id: "r4",
    title: "VxRail cluster health",
    description: "Monitor node status and alerts",
    category: "Products",
  },
];

const meta: Meta<typeof GlobalSearch> = {
  title: "Spec Generated/DAP/Joe-Generated/GlobalSearch",
  component: GlobalSearch,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Joe-generated DAP GlobalSearch. Implementation: `storybook/src/components/dap/joe-generated/GlobalSearch/GlobalSearch.tsx` + `GlobalSearch.css`. Tokens: `storybook/src/components/dap/joe-generated/tokens.css`. Spec MDX: `components/DAP/joe-generated/GlobalSearch/global-search.mdx`. Renders only when `isOpen` is true.",
      },
    },
  },
  argTypes: {
    disabled: { control: "boolean" },
    isOpen: { control: "boolean" },
    placeholder: { control: "text" },
    onSearch: { action: "onSearch" },
    onResultSelect: { action: "onResultSelect" },
    onOpenChange: { action: "onOpenChange" },
  },
  args: {
    placeholder: "Search...",
    searchResults: sampleResults,
    disabled: false,
    isOpen: true,
  },
};

export default meta;
type Story = StoryObj<typeof GlobalSearch>;

export const Default: Story = {
  args: {
    isOpen: true,
    searchResults: sampleResults,
    placeholder: "Search products, docs, and support...",
  },
};

export const WithCategories: Story = {
  args: {
    isOpen: true,
    searchResults: sampleResults,
    placeholder: "Search...",
  },
};

export const NoResultsDataset: Story = {
  args: {
    isOpen: true,
    searchResults: [],
    placeholder: "Search...",
  },
};

export const Disabled: Story = {
  args: {
    isOpen: true,
    searchResults: sampleResults,
    disabled: true,
    placeholder: "Search unavailable",
  },
};

/** Controlled open/close — component returns `null` when closed */
export const OpenClose: Story = {
  render: function OpenCloseStory(args) {
    const [open, setOpen] = useState(true);
    return (
      <div style={{ minHeight: "100vh", padding: 24 }}>
        <button type="button" onClick={() => setOpen(true)}>
          Open global search
        </button>
        <GlobalSearch
          {...args}
          isOpen={open}
          onOpenChange={setOpen}
          searchResults={sampleResults}
        />
      </div>
    );
  },
};

import "../../../../components/synapse-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import React, { useState, type ReactNode } from "react";
import { SynapsePagination } from "../../../../storybook/src/components/SynapsePagination";
import {
  SYNAPSE_PAGINATION_API_DEFAULTS,
  SYNAPSE_PAGINATION_BACKGROUND_OPTIONS,
  SYNAPSE_PAGINATION_DESIGN_SPEC_PATH,
  SYNAPSE_PAGINATION_DROPDOWN_STATES,
  SYNAPSE_PAGINATION_IDS_BASELINE_SPEC_PATH,
  SYNAPSE_PAGINATION_MAIN_NODE_ID,
  SYNAPSE_PAGINATION_SPEC_ACCURATE_NODE_ID,
} from "../../../../storybook/src/spec-contracts/synapse-pagination.contract";
import {
  PAGINATION_DROPDOWN_STATES,
} from "../../../../storybook/src/spec-contracts/ids-pagination.contract";

const frameStyle = { padding: 20, maxWidth: 960 } as const;
const stackStyle = { ...frameStyle, display: "grid", gap: 20 } as const;
const checkerboardStyle = {
  backgroundImage:
    "linear-gradient(45deg, #e8e8e8 25%, transparent 25%), linear-gradient(-45deg, #e8e8e8 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e8e8e8 75%), linear-gradient(-45deg, transparent 75%, #e8e8e8 75%)",
  backgroundSize: "12px 12px",
  backgroundPosition: "0 0, 0 6px, 6px -6px, -6px 0",
  padding: 12,
  borderRadius: 4,
} as const;

function StoryCaption({ children }: { children: string }) {
  return (
    <div
      style={{
        fontSize: 12,
        fontWeight: 600,
        lineHeight: "16px",
        color: "var(--color-text-neutral-strong)",
        marginBottom: 8,
      }}
    >
      {children}
    </div>
  );
}

function StoryRow({ caption, children }: { caption: string; children: ReactNode }) {
  return (
    <div>
      <StoryCaption>{caption}</StoryCaption>
      {children}
    </div>
  );
}

const meta: Meta<typeof SynapsePagination> = {
  title: "Components/Synapse/Pagination",
  component: SynapsePagination,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          `Spec-driven Synapse Pagination (IDS baseline). Source: \`${SYNAPSE_PAGINATION_DESIGN_SPEC_PATH}\`.`,
          `IDS baseline: \`${SYNAPSE_PAGINATION_IDS_BASELINE_SPEC_PATH}\`.`,
          `Layout reference: IDS Figma \`${SYNAPSE_PAGINATION_SPEC_ACCURATE_NODE_ID}\`; Synapse registry node \`${SYNAPSE_PAGINATION_MAIN_NODE_ID}\`.`,
          "Theme: `components/synapse-theme.css`. Component implementation reuses `IdsPagination` (shared Icon, background modes, navigation arrows, page-number text input).",
        ].join(" "),
      },
    },
  },
  argTypes: {
    background: { control: "radio", options: SYNAPSE_PAGINATION_BACKGROUND_OPTIONS },
    dropdownState: { control: "select", options: SYNAPSE_PAGINATION_DROPDOWN_STATES },
    pageOffsetDropdownState: { control: "select", options: PAGINATION_DROPDOWN_STATES },
    currentPage: { control: { type: "number", min: 1 } },
    totalPages: { control: { type: "number", min: 1 } },
    pageSize: { control: "select", options: [25, 50, 75, 100] },
    pageSizeOptions: { control: "object" },
    pageOffsetOptions: { control: "object" },
    showPerPage: { control: "boolean" },
    showFirstLast: { control: "boolean" },
    showPageOffset: { control: "boolean" },
    disabled: { control: "boolean" },
    onPageChange: { action: "onPageChange" },
    onPageSizeChange: { action: "onPageSizeChange" },
    onFirstPageNavigate: { action: "onFirstPageNavigate" },
    onPreviousPageNavigate: { action: "onPreviousPageNavigate" },
    onNextPageNavigate: { action: "onNextPageNavigate" },
    onLastPageNavigate: { action: "onLastPageNavigate" },
  },
  args: {
    ...SYNAPSE_PAGINATION_API_DEFAULTS,
    pageSizeOptions: [...SYNAPSE_PAGINATION_API_DEFAULTS.pageSizeOptions],
    dropdownState: "collapsed",
    pageOffsetDropdownState: "collapsed",
    background: "gray",
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof SynapsePagination>;

export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  render: (args) => {
    const [page, setPage] = useState(args.currentPage ?? 1);
    const [pageSize, setPageSize] = useState(args.pageSize ?? 25);

    return (
      <div style={frameStyle}>
        <SynapsePagination
          {...args}
          currentPage={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      </div>
    );
  },
};

export const BackgroundModes: Story = {
  render: () => (
    <div style={stackStyle}>
      <StoryRow caption='background="gray" (default) — var(--color-background-surface-1)'>
        <SynapsePagination
          {...SYNAPSE_PAGINATION_API_DEFAULTS}
          pageSizeOptions={[...SYNAPSE_PAGINATION_API_DEFAULTS.pageSizeOptions]}
          currentPage={1}
          totalPages={16}
          background="gray"
        />
      </StoryRow>
      <StoryRow caption='background="white" — var(--color-background-component)'>
        <SynapsePagination
          {...SYNAPSE_PAGINATION_API_DEFAULTS}
          pageSizeOptions={[...SYNAPSE_PAGINATION_API_DEFAULTS.pageSizeOptions]}
          currentPage={1}
          totalPages={16}
          background="white"
        />
      </StoryRow>
      <StoryRow caption='background="none" — transparent'>
        <div style={checkerboardStyle}>
          <SynapsePagination
            {...SYNAPSE_PAGINATION_API_DEFAULTS}
            pageSizeOptions={[...SYNAPSE_PAGINATION_API_DEFAULTS.pageSizeOptions]}
            currentPage={1}
            totalPages={16}
            background="none"
          />
        </div>
      </StoryRow>
    </div>
  ),
};

export const PageNavigationStates: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Inherits IDS behavior: all four navigation icons render on multi-page views; boundary positions use disabled styling.",
      },
    },
  },
  render: () => (
    <div style={stackStyle}>
      <StoryRow caption="First page — « and ‹ disabled; › and » active">
        <SynapsePagination
          {...SYNAPSE_PAGINATION_API_DEFAULTS}
          pageSizeOptions={[...SYNAPSE_PAGINATION_API_DEFAULTS.pageSizeOptions]}
          currentPage={1}
          totalPages={16}
        />
      </StoryRow>
      <StoryRow caption="Middle page — all navigation icons active">
        <SynapsePagination
          {...SYNAPSE_PAGINATION_API_DEFAULTS}
          pageSizeOptions={[...SYNAPSE_PAGINATION_API_DEFAULTS.pageSizeOptions]}
          currentPage={2}
          totalPages={16}
        />
      </StoryRow>
      <StoryRow caption="Last page — « and ‹ active; › and » disabled">
        <SynapsePagination
          {...SYNAPSE_PAGINATION_API_DEFAULTS}
          pageSizeOptions={[...SYNAPSE_PAGINATION_API_DEFAULTS.pageSizeOptions]}
          currentPage={16}
          totalPages={16}
        />
      </StoryRow>
      <StoryRow caption='Single page — summary text "1 page" only'>
        <SynapsePagination
          {...SYNAPSE_PAGINATION_API_DEFAULTS}
          pageSizeOptions={[...SYNAPSE_PAGINATION_API_DEFAULTS.pageSizeOptions]}
          currentPage={1}
          totalPages={1}
        />
      </StoryRow>
    </div>
  ),
};

export const PerPageDropdownOpen: Story = {
  render: () => (
    <div style={frameStyle}>
      <SynapsePagination
        {...SYNAPSE_PAGINATION_API_DEFAULTS}
        pageSizeOptions={[...SYNAPSE_PAGINATION_API_DEFAULTS.pageSizeOptions]}
        currentPage={1}
        totalPages={16}
        dropdownState="expanded-below"
      />
    </div>
  ),
};

export const PageOffsetDropdown: Story = {
  render: () => (
    <div style={frameStyle}>
      <SynapsePagination
        {...SYNAPSE_PAGINATION_API_DEFAULTS}
        pageSizeOptions={[...SYNAPSE_PAGINATION_API_DEFAULTS.pageSizeOptions]}
        currentPage={2}
        totalPages={16}
        showPageOffset
        pageOffsetOptions={[1, 2, 3, 4, 5, 8, 16]}
        pageOffsetDropdownState="expanded-below"
      />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={frameStyle}>
      <SynapsePagination
        {...SYNAPSE_PAGINATION_API_DEFAULTS}
        pageSizeOptions={[...SYNAPSE_PAGINATION_API_DEFAULTS.pageSizeOptions]}
        currentPage={2}
        totalPages={16}
        disabled
      />
    </div>
  ),
};

export const WithoutFirstLast: Story = {
  render: () => (
    <div style={frameStyle}>
      <SynapsePagination
        {...SYNAPSE_PAGINATION_API_DEFAULTS}
        pageSizeOptions={[...SYNAPSE_PAGINATION_API_DEFAULTS.pageSizeOptions]}
        currentPage={2}
        totalPages={16}
        showFirstLast={false}
      />
    </div>
  ),
};

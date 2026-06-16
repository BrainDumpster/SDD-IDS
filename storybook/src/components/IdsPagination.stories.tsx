import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { IdsPagination } from "./IdsPagination";
import "../../../components/ids-theme.css";
import {
  IDS_PAGINATION_DESIGN_SPEC_PATH,
  PAGINATION_API_DEFAULTS,
} from "../spec-contracts/ids-pagination.contract";

const frameStyle = {
  padding: 20,
  maxWidth: 960,
} as const;

const meta: Meta<typeof IdsPagination> = {
  title: "Spec Generated/IDS/Pagination",
  component: IdsPagination,
  parameters: {
    docs: {
      description: {
        component: `Spec-driven IDS Pagination aligned to \`${IDS_PAGINATION_DESIGN_SPEC_PATH}\` and the Figma map entry in \`data/component-figma-map.json\` (Pagination).`,
      },
    },
  },
  argTypes: {
    background: { control: "radio", options: ["none", "gray"] },
    dropdownState: { control: "select", options: ["collapsed", "expanded-below", "expanded-above"] },
    pageOffsetDropdownState: {
      control: "select",
      options: ["collapsed", "expanded-below", "expanded-above"],
    },
  },
  args: {
    ...PAGINATION_API_DEFAULTS,
    dropdownState: "collapsed",
    pageOffsetDropdownState: "collapsed",
    background: "none",
  },
};

export default meta;
type Story = StoryObj<typeof IdsPagination>;

export const DefaultManual: Story = {
  render: (args) => {
    const [page, setPage] = useState(args.currentPage ?? 1);
    const [pageSize, setPageSize] = useState(args.pageSize ?? 25);

    return (
      <div style={frameStyle}>
        <IdsPagination
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

export const BackgroundModesManual: Story = {
  render: () => (
    <div style={{ ...frameStyle, display: "grid", gap: 16 }}>
      <IdsPagination {...PAGINATION_API_DEFAULTS} currentPage={2} totalPages={16} background="none" />
      <IdsPagination {...PAGINATION_API_DEFAULTS} currentPage={2} totalPages={16} background="gray" />
    </div>
  ),
};

export const PageNavigationStatesManual: Story = {
  render: () => (
    <div style={{ ...frameStyle, display: "grid", gap: 16 }}>
      <IdsPagination {...PAGINATION_API_DEFAULTS} currentPage={1} totalPages={16} />
      <IdsPagination {...PAGINATION_API_DEFAULTS} currentPage={2} totalPages={16} />
      <IdsPagination {...PAGINATION_API_DEFAULTS} currentPage={16} totalPages={16} />
      <IdsPagination {...PAGINATION_API_DEFAULTS} currentPage={1} totalPages={1} />
    </div>
  ),
};

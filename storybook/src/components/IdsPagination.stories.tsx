import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { IdsPagination } from "./IdsPagination";
import {
  IDS_PAGINATION_DESIGN_SPEC_PATH,
  PAGINATION_API_DEFAULTS,
} from "../spec-contracts/ids-pagination.contract";

const frameStyle = {
  padding: 20,
  maxWidth: 860,
} as const;

const meta: Meta<typeof IdsPagination> = {
  title: "IDS/Pagination",
  component: IdsPagination,
  parameters: {
    docs: {
      description: {
        component: `Spec-driven IDS Pagination aligned to \`${IDS_PAGINATION_DESIGN_SPEC_PATH}\` (MCP-verified nodes \`44334:225319\` / \`11677:157840\`).`,
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

export const Default: Story = {
  render: (args) => {
    const [page, setPage] = useState(args.currentPage ?? 1);
    const [pageSize, setPageSize] = useState(args.pageSize ?? 25);

    return (
      <div style={frameStyle}>
        <IdsPagination
          {...args}
          currentPage={page}
          pageSize={pageSize}
          dropdownState="collapsed"
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      </div>
    );
  },
};

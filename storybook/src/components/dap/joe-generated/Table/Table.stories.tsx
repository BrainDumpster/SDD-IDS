import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import "../tokens.css";
import Table from "./Table";
import type { TableColumn } from "./Table";

/**
 * Joe-Generated Table — uses only:
 * - storybook/src/components/dap/joe-generated/Table/Table.tsx
 * - storybook/src/components/dap/joe-generated/Table/Table.css (imported by Table.tsx)
 * - storybook/src/components/dap/joe-generated/tokens.css
 * Spec MDX: components/DAP/joe-generated/Table/table.mdx
 */

const columns: TableColumn[] = [
  { id: "name", label: "Name", sortable: true, width: "30%" },
  { id: "status", label: "Status", sortable: true },
  { id: "owner", label: "Owner", sortable: true },
  { id: "updated", label: "Updated", sortable: true },
];

const sampleRows = [
  {
    id: "row-1",
    cells: ["PowerEdge R760", "Healthy", "Ops", "2026-07-01"],
  },
  {
    id: "row-2",
    cells: ["PowerStore 500T", "Warning", "Storage", "2026-07-10"],
  },
  {
    id: "row-3",
    cells: ["VxRail E660", "Healthy", "Compute", "2026-07-12"],
  },
  {
    id: "row-4",
    cells: ["PowerProtect DD", "Critical", "Backup", "2026-07-15"],
  },
];

const meta: Meta<typeof Table> = {
  title: "Spec Generated/DAP/Joe-Generated/Table",
  component: Table,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Joe-generated DAP Table. Implementation: `storybook/src/components/dap/joe-generated/Table/Table.tsx` + `Table.css`. Tokens: `storybook/src/components/dap/joe-generated/tokens.css`. Spec MDX: `components/DAP/joe-generated/Table/table.mdx`.",
      },
    },
  },
  argTypes: {
    selectable: { control: "boolean" },
    sortable: { control: "boolean" },
    hoverable: { control: "boolean" },
    striped: { control: "boolean" },
    bordered: { control: "boolean" },
    compact: { control: "boolean" },
    loading: { control: "boolean" },
    empty: { control: "boolean" },
    onRowSelect: { action: "onRowSelect" },
    onSort: { action: "onSort" },
    onPageChange: { action: "onPageChange" },
  },
  args: {
    columns,
    rows: sampleRows,
    selectable: false,
    sortable: true,
    hoverable: true,
    striped: false,
    bordered: false,
    compact: false,
    loading: false,
    empty: false,
  },
};

export default meta;
type Story = StoryObj<typeof Table>;

export const Default: Story = {
  args: {
    columns,
    rows: sampleRows,
    sortable: true,
    hoverable: true,
  },
};

export const Selectable: Story = {
  args: {
    columns,
    rows: sampleRows,
    selectable: true,
    sortable: true,
    hoverable: true,
  },
};

export const Striped: Story = {
  args: {
    columns,
    rows: sampleRows,
    striped: true,
    hoverable: true,
  },
};

export const Bordered: Story = {
  args: {
    columns,
    rows: sampleRows,
    bordered: true,
    hoverable: true,
  },
};

export const Compact: Story = {
  args: {
    columns,
    rows: sampleRows,
    compact: true,
    hoverable: true,
  },
};

export const Loading: Story = {
  args: {
    columns,
    rows: sampleRows,
    loading: true,
  },
};

export const Empty: Story = {
  args: {
    columns,
    rows: [],
    empty: true,
    emptyMessage: "No data available",
  },
};

export const WithPagination: Story = {
  render: function PaginatedTable() {
    const [page, setPage] = useState(1);
    const pageSize = 2;
    const totalPages = Math.ceil(sampleRows.length / pageSize);
    const pageRows = sampleRows.slice((page - 1) * pageSize, page * pageSize);
    return (
      <Table
        columns={columns}
        rows={pageRows}
        sortable
        hoverable
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    );
  },
};

export const AllModifiers: Story = {
  args: {
    columns,
    rows: sampleRows,
    selectable: true,
    sortable: true,
    hoverable: true,
    striped: true,
    bordered: true,
    compact: false,
  },
};

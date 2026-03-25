import type { Meta, StoryObj } from "@storybook/react";
import { DataGrid } from "./DataGrid";

const meta: Meta<typeof DataGrid> = {
  title: "Synapse/DataGrid",
  component: DataGrid,
};

export default meta;
type Story = StoryObj<typeof DataGrid>;

const columns = [
  { key: "name", header: "Name", sortable: true },
  { key: "department", header: "Department", sortable: true },
  { key: "tickets", header: "Tickets", sortable: true },
  { key: "status", header: "Status", sortable: false },
];

const data = [
  { name: "Alice Johnson", department: "Engineering", tickets: "42", status: "Active" },
  { name: "Bob Smith", department: "Design", tickets: "18", status: "Active" },
  { name: "Carol White", department: "Product", tickets: "7", status: "Away" },
  { name: "Dan Brown", department: "Engineering", tickets: "31", status: "Active" },
  { name: "Eve Davis", department: "QA", tickets: "56", status: "Offline" },
  { name: "Frank Lee", department: "Design", tickets: "23", status: "Active" },
  { name: "Grace Kim", department: "Engineering", tickets: "15", status: "Away" },
  { name: "Hank Miller", department: "Product", tickets: "9", status: "Active" },
];

export const Sortable: Story = {
  args: {
    columns,
    data,
  },
};

export const AllSortable: Story = {
  args: {
    columns: columns.map((c) => ({ ...c, sortable: true })),
    data,
  },
};

export const LargeDataSet: Story = {
  args: {
    columns: [
      { key: "id", header: "ID", sortable: true },
      { key: "name", header: "Name", sortable: true },
      { key: "value", header: "Value", sortable: true },
      { key: "date", header: "Date", sortable: true },
    ],
    data: Array.from({ length: 50 }, (_, i) => ({
      id: String(i + 1),
      name: `Item ${String.fromCharCode(65 + (i % 26))}${i}`,
      value: String(Math.floor(Math.random() * 1000)),
      date: `2025-${String(1 + (i % 12)).padStart(2, "0")}-${String(1 + (i % 28)).padStart(2, "0")}`,
    })),
  },
};

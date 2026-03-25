import type { Meta, StoryObj } from "@storybook/react";
import { Table } from "./Table";

const meta: Meta<typeof Table> = {
  title: "Synapse/Table",
  component: Table,
  argTypes: {
    striped: { control: "boolean" },
    hoverable: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Table>;

const columns = [
  { key: "name", header: "Name", width: "200px" },
  { key: "role", header: "Role" },
  { key: "status", header: "Status" },
  { key: "email", header: "Email" },
];

const sampleData = [
  { name: "Alice Johnson", role: "Engineer", status: "Active", email: "alice@example.com" },
  { name: "Bob Smith", role: "Designer", status: "Active", email: "bob@example.com" },
  { name: "Carol White", role: "PM", status: "Away", email: "carol@example.com" },
  { name: "Dan Brown", role: "Engineer", status: "Active", email: "dan@example.com" },
  { name: "Eve Davis", role: "QA", status: "Offline", email: "eve@example.com" },
];

export const Default: Story = {
  args: {
    columns,
    data: sampleData,
  },
};

export const Striped: Story = {
  args: {
    columns,
    data: sampleData,
    striped: true,
  },
};

export const Hoverable: Story = {
  args: {
    columns,
    data: sampleData,
    hoverable: true,
  },
};

export const StripedHoverable: Story = {
  args: {
    columns,
    data: sampleData,
    striped: true,
    hoverable: true,
  },
};

const manyRows = Array.from({ length: 20 }, (_, i) => ({
  name: `User ${i + 1}`,
  role: ["Engineer", "Designer", "PM", "QA"][i % 4],
  status: ["Active", "Away", "Offline"][i % 3],
  email: `user${i + 1}@example.com`,
}));

export const ManyRows: Story = {
  args: {
    columns,
    data: manyRows,
    striped: true,
    hoverable: true,
  },
};

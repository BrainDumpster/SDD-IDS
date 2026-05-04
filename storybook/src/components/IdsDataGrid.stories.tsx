import type { Meta, StoryObj } from "@storybook/react";
import "../../../components/ids-theme.css";
import { IdsDataGrid } from "./IdsDataGrid";

const columns = [
  { key: "name", title: "Name", sortable: true, filterable: true },
  { key: "type", title: "Type", sortable: true, filterable: true },
  { key: "status", title: "Status", sortable: true, filterable: true },
  { key: "owner", title: "Owner", sortable: true, filterable: false },
  { key: "region", title: "Region", sortable: false, filterable: true },
];

const rows = [
  { id: "r-1", values: { name: "North America Control Plane", type: "Service", status: "Active", owner: "Platform", region: "NA" } },
  { id: "r-2", values: { name: "Europe Billing Processor", type: "Job", status: "Warning", owner: "Finance", region: "EU" } },
  { id: "r-3", values: { name: "Asia Analytics Stream", type: "Pipeline", status: "Active", owner: "Data Ops", region: "APAC" } },
  { id: "r-4", values: { name: "Archive Worker", type: "Worker", status: "Paused", owner: "Storage", region: "NA" } },
  { id: "r-5", values: { name: "Policy Service", type: "Service", status: "Active", owner: "Security", region: "Global" } },
  { id: "r-6", values: { name: "Realtime Gateway", type: "Gateway", status: "Critical", owner: "Edge", region: "EU" } },
  { id: "r-7", values: { name: "Ingestion Adapter", type: "Adapter", status: "Active", owner: "Data Ops", region: "APAC" } },
  { id: "r-8", values: { name: "Partner Connector", type: "Connector", status: "Warning", owner: "Integrations", region: "NA" } },
];

const meta: Meta<typeof IdsDataGrid> = {
  title: "IDS/Datagrid",
  component: IdsDataGrid,
};

export default meta;
type Story = StoryObj<typeof IdsDataGrid>;

export const Default: Story = {
  args: {
    columns,
    rows,
    viewMode: "table",
    multiselect: true,
    withDetailPanel: false,
    pageSize: 6,
  },
};

export const WithDetailPanel: Story = {
  args: {
    columns,
    rows,
    viewMode: "treeview",
    multiselect: true,
    withDetailPanel: true,
    pageSize: 6,
  },
};

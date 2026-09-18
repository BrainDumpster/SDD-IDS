/**
 * Storybook: design-spec–generated Datagrid from `lib/react/synapse/datagrid`
 * (IDS-fork reexport façade — React + CSS Modules).
 *
 * Deterministic anatomy (children collected, host projects DOM):
 *   SynapseDatagrid
 *     SynapseDatagridColumn+ → SynapseDatagridColumnTitle? + SynapseDatagridFilter?
 *     SynapseDatagridBody → SynapseDatagridRow+ → SynapseDatagridCell+
 *     SynapseDatagridFooter?
 *     SynapseDatagridDetailPanel?
 *
 * Theme: components/synapse-theme.css
 * Spec: components/synapse/datagrid/design-spec.md
 */
import React, { useMemo, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/synapse-theme.css";
import {
  SYNAPSE_DATAGRID_DOCS_DESCRIPTION,
  SYNAPSE_DATAGRID_SOURCE_CODE,
} from "./synapse-datagrid.developer-usage";
import {
  SynapseDatagrid,
  SynapseDatagridBody,
  SynapseDatagridCell,
  SynapseDatagridColumn,
  SynapseDatagridColumnTitle,
  SynapseDatagridFilter,
  SynapseDatagridMultiselectFilter,
  SynapseDatagridNumericFilter,
  SynapseDatagridRow,
  SynapseDatagridTextFilter,
  defaultSynapseDatagridNumericFilterState,
  type SynapseDatagridNumericFilterState,
  type SynapseDatagridProps,
} from "@synapse/react/datagrid";

const DESIGN_SPEC_PATH = "components/synapse/datagrid/design-spec.md";

const meta: Meta<SynapseDatagridProps> = {
  tags: ["autodocs"],
  title: "Components/Synapse/Datagrid",
  component: SynapseDatagrid,
  parameters: {
    layout: "fullscreen",
    docs: {
      canvas: { sourceState: "open" },
      description: {
        component: SYNAPSE_DATAGRID_DOCS_DESCRIPTION,
      },
      source: {
        type: "code",
        language: "tsx",
        code: SYNAPSE_DATAGRID_SOURCE_CODE,
      },
    },
  },
};

export default meta;
type Story = StoryObj<SynapseDatagridProps>;

const FRAME: React.CSSProperties = {
  width: "100%",
  height: "100dvh",
  minHeight: 0,
  minWidth: 0,
  display: "flex",
  flexDirection: "column",
};

const SAMPLE_ROWS = [
  {
    id: "r-1",
    name: "North America Control Plane",
    type: "Service",
    owner: "Platform",
    region: "NA",
    amount: "3200",
  },
  {
    id: "r-2",
    name: "EMEA Edge Cluster",
    type: "Cluster",
    owner: "SRE",
    region: "EU",
    amount: "1800",
  },
  {
    id: "r-3",
    name: "APAC Observability",
    type: "Service",
    owner: "Observability",
    region: "APAC",
    amount: "940",
  },
  {
    id: "r-4",
    name: "Billing Ledger",
    type: "Database",
    owner: "Finance",
    region: "NA",
    amount: "4100",
  },
  {
    id: "r-5",
    name: "Identity Gateway",
    type: "Service",
    owner: "Security",
    region: "EU",
    amount: "1250",
  },
  {
    id: "r-6",
    name: "Partner Portal",
    type: "Application",
    owner: "Product",
    region: "NA",
    amount: "760",
  },
  {
    id: "r-7",
    name: "Telemetry Bus",
    type: "Cluster",
    owner: "Platform",
    region: "APAC",
    amount: "2100",
  },
] as const;

const SPEC_DEFAULTS: Pick<
  SynapseDatagridProps,
  | "rowSelection"
  | "selectionMode"
  | "showSingleSelectionRadio"
  | "withDetailPanel"
  | "headerColorAndBorder"
  | "rowVerticalIndicator"
  | "columnResizeEnabled"
  | "readOnly"
  | "pageSize"
  | "viewMode"
> = {
  rowSelection: true,
  selectionMode: "single",
  showSingleSelectionRadio: true,
  withDetailPanel: true,
  headerColorAndBorder: true,
  rowVerticalIndicator: true,
  columnResizeEnabled: true,
  readOnly: false,
  pageSize: 6,
  viewMode: "table",
};

function SpecAccurateAnatomy(props: SynapseDatagridProps) {
  const typeOptions = useMemo(
    () => [...new Set(SAMPLE_ROWS.map((row) => row.type))].sort(),
    [],
  );
  const [selectedTypes, setSelectedTypes] = useState<string[]>(() => [...typeOptions]);

  const visible = SAMPLE_ROWS.filter((row) => selectedTypes.includes(row.type));

  return (
    <div style={FRAME}>
      <SynapseDatagrid {...SPEC_DEFAULTS} {...props}>
        <SynapseDatagridColumn field="name" sortable filterable width={200} minWidth={90}>
          <SynapseDatagridColumnTitle>Name</SynapseDatagridColumnTitle>
          <SynapseDatagridFilter>
            <SynapseDatagridTextFilter aria-label="Search name column" />
          </SynapseDatagridFilter>
        </SynapseDatagridColumn>
        <SynapseDatagridColumn field="type" sortable filterable columnHideable width={140} minWidth={90}>
          <SynapseDatagridColumnTitle>Type</SynapseDatagridColumnTitle>
          <SynapseDatagridFilter>
            <SynapseDatagridMultiselectFilter
              groupLabel="Type"
              options={typeOptions}
              selectedValues={selectedTypes}
              onSelectedValuesChange={setSelectedTypes}
            />
          </SynapseDatagridFilter>
        </SynapseDatagridColumn>
        <SynapseDatagridColumn field="owner" sortable width={120} minWidth={90}>
          <SynapseDatagridColumnTitle>Owner</SynapseDatagridColumnTitle>
        </SynapseDatagridColumn>
        <SynapseDatagridColumn field="region" filterable columnHideable width={100} minWidth={90}>
          <SynapseDatagridColumnTitle>Region</SynapseDatagridColumnTitle>
          <SynapseDatagridFilter>
            <SynapseDatagridTextFilter aria-label="Search region column" />
          </SynapseDatagridFilter>
        </SynapseDatagridColumn>
        <SynapseDatagridBody>
          {visible.map((row) => (
            <SynapseDatagridRow key={row.id} id={row.id}>
              <SynapseDatagridCell field="name">{row.name}</SynapseDatagridCell>
              <SynapseDatagridCell field="type">{row.type}</SynapseDatagridCell>
              <SynapseDatagridCell field="owner">{row.owner}</SynapseDatagridCell>
              <SynapseDatagridCell field="region">{row.region}</SynapseDatagridCell>
            </SynapseDatagridRow>
          ))}
        </SynapseDatagridBody>
      </SynapseDatagrid>
    </div>
  );
}

export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  render: (args) => <SpecAccurateAnatomy {...args} />,
};

export const NestedHierarchy: Story = {
  name: "Nested Hierarchy",
  render: () => (
    <div style={FRAME}>
      <SynapseDatagrid
        rowSelection
        selectionMode="multiple"
        headerColorAndBorder
        columnResizeEnabled
        pageSize={6}
      >
        <SynapseDatagridColumn field="name" sortable filterable width={220}>
          <SynapseDatagridColumnTitle>Name</SynapseDatagridColumnTitle>
          <SynapseDatagridFilter>
            <SynapseDatagridTextFilter aria-label="Search name" />
          </SynapseDatagridFilter>
        </SynapseDatagridColumn>
        <SynapseDatagridColumn field="owner" sortable width={140}>
          Owner
        </SynapseDatagridColumn>
        <SynapseDatagridColumn field="region" width={100}>
          Region
        </SynapseDatagridColumn>
        <SynapseDatagridBody>
          {SAMPLE_ROWS.slice(0, 4).map((row) => (
            <SynapseDatagridRow key={row.id} id={row.id}>
              <SynapseDatagridCell field="name">{row.name}</SynapseDatagridCell>
              <SynapseDatagridCell field="owner">{row.owner}</SynapseDatagridCell>
              <SynapseDatagridCell field="region">{row.region}</SynapseDatagridCell>
            </SynapseDatagridRow>
          ))}
        </SynapseDatagridBody>
      </SynapseDatagrid>
    </div>
  ),
};

function FilterTypesHost() {
  const [numeric, setNumeric] = useState<SynapseDatagridNumericFilterState>(
    defaultSynapseDatagridNumericFilterState,
  );
  return (
    <div style={FRAME}>
      <SynapseDatagrid headerColorAndBorder columnResizeEnabled pageSize={6} showSettingsColumn={false}>
        <SynapseDatagridColumn field="name" sortable filterable width={220}>
          <SynapseDatagridColumnTitle>Name</SynapseDatagridColumnTitle>
          <SynapseDatagridFilter>
            <SynapseDatagridTextFilter aria-label="Search name" />
          </SynapseDatagridFilter>
        </SynapseDatagridColumn>
        <SynapseDatagridColumn field="amount" sortable filterable width={140}>
          <SynapseDatagridColumnTitle>Amount</SynapseDatagridColumnTitle>
          <SynapseDatagridFilter>
            <SynapseDatagridNumericFilter
              groupLabel="Amount"
              state={numeric}
              onStateChange={setNumeric}
              unitOptions={[
                { value: "KB", label: "KB" },
                { value: "MB", label: "MB" },
                { value: "GB", label: "GB" },
              ]}
            />
          </SynapseDatagridFilter>
        </SynapseDatagridColumn>
        <SynapseDatagridBody>
          {SAMPLE_ROWS.map((row) => (
            <SynapseDatagridRow key={row.id} id={row.id}>
              <SynapseDatagridCell field="name">{row.name}</SynapseDatagridCell>
              <SynapseDatagridCell field="amount">{row.amount}</SynapseDatagridCell>
            </SynapseDatagridRow>
          ))}
        </SynapseDatagridBody>
      </SynapseDatagrid>
    </div>
  );
}

export const FilterTypes: Story = {
  name: "Filter Types",
  render: () => <FilterTypesHost />,
};

/**
 * Storybook: design-spec–generated Datagrid from `lib/react/ids/datagrid`
 * (React + CSS Modules, no @base-ui-components).
 *
 * Deterministic anatomy (children collected, host projects DOM):
 *   IdsDatagrid
 *     IdsDatagridColumn+ → IdsDatagridColumnTitle? + IdsDatagridFilter?
 *     IdsDatagridBody → IdsDatagridRow+ → IdsDatagridCell+
 *     IdsDatagridFooter?
 *     IdsDatagridDetailPanel?
 *
 * Theme: components/ids-theme.css
 * Spec: components/ids/datagrid/design-spec.md
 */
import React, { useMemo, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/ids-theme.css";
import {
  DATAGRID_DOCS_DESCRIPTION,
  DATAGRID_SOURCE_CODE,
} from "./ids-datagrid.developer-usage";
import {
  IdsDatagrid,
  IdsDatagridBody,
  IdsDatagridCell,
  IdsDatagridColumn,
  IdsDatagridColumnTitle,
  IdsDatagridFilter,
  IdsDatagridMultiselectFilter,
  IdsDatagridNumericFilter,
  IdsDatagridRow,
  IdsDatagridTextFilter,
  defaultIdsDatagridNumericFilterState,
  type IdsDatagridNumericFilterState,
  type IdsDatagridProps,
} from "@ids/react/datagrid";

const DESIGN_SPEC_PATH = "components/ids/datagrid/design-spec.md";

const meta: Meta<IdsDatagridProps> = {
  tags: ["autodocs"],
  title: "Components/IDS/Datagrid",
  component: IdsDatagrid,
  parameters: {
    layout: "fullscreen",
    docs: {
      canvas: { sourceState: "open" },
      description: {
        component: DATAGRID_DOCS_DESCRIPTION,
      },
      source: {
        type: "code",
        language: "tsx",
        code: DATAGRID_SOURCE_CODE,
      },
    },
  },
};

export default meta;
type Story = StoryObj<IdsDatagridProps>;

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
  IdsDatagridProps,
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

function SpecAccurateAnatomy(props: IdsDatagridProps) {
  const typeOptions = useMemo(
    () => [...new Set(SAMPLE_ROWS.map((row) => row.type))].sort(),
    [],
  );
  const [selectedTypes, setSelectedTypes] = useState<string[]>(() => [...typeOptions]);

  const visible = SAMPLE_ROWS.filter((row) => selectedTypes.includes(row.type));

  return (
    <div style={FRAME}>
      <IdsDatagrid {...SPEC_DEFAULTS} {...props}>
        <IdsDatagridColumn field="name" sortable filterable width={200} minWidth={90}>
          <IdsDatagridColumnTitle>Name</IdsDatagridColumnTitle>
          <IdsDatagridFilter>
            <IdsDatagridTextFilter aria-label="Search name column" />
          </IdsDatagridFilter>
        </IdsDatagridColumn>
        <IdsDatagridColumn field="type" sortable filterable columnHideable width={140} minWidth={90}>
          <IdsDatagridColumnTitle>Type</IdsDatagridColumnTitle>
          <IdsDatagridFilter>
            <IdsDatagridMultiselectFilter
              groupLabel="Type"
              options={typeOptions}
              selectedValues={selectedTypes}
              onSelectedValuesChange={setSelectedTypes}
            />
          </IdsDatagridFilter>
        </IdsDatagridColumn>
        <IdsDatagridColumn field="owner" sortable width={120} minWidth={90}>
          <IdsDatagridColumnTitle>Owner</IdsDatagridColumnTitle>
        </IdsDatagridColumn>
        <IdsDatagridColumn field="region" filterable columnHideable width={100} minWidth={90}>
          <IdsDatagridColumnTitle>Region</IdsDatagridColumnTitle>
          <IdsDatagridFilter>
            <IdsDatagridTextFilter aria-label="Search region column" />
          </IdsDatagridFilter>
        </IdsDatagridColumn>
        <IdsDatagridBody>
          {visible.map((row) => (
            <IdsDatagridRow key={row.id} id={row.id}>
              <IdsDatagridCell field="name">{row.name}</IdsDatagridCell>
              <IdsDatagridCell field="type">{row.type}</IdsDatagridCell>
              <IdsDatagridCell field="owner">{row.owner}</IdsDatagridCell>
              <IdsDatagridCell field="region">{row.region}</IdsDatagridCell>
            </IdsDatagridRow>
          ))}
        </IdsDatagridBody>
      </IdsDatagrid>
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
      <IdsDatagrid
        rowSelection
        selectionMode="multiple"
        headerColorAndBorder
        columnResizeEnabled
        pageSize={6}
      >
        <IdsDatagridColumn field="name" sortable filterable width={220}>
          <IdsDatagridColumnTitle>Name</IdsDatagridColumnTitle>
          <IdsDatagridFilter>
            <IdsDatagridTextFilter aria-label="Search name" />
          </IdsDatagridFilter>
        </IdsDatagridColumn>
        <IdsDatagridColumn field="owner" sortable width={140}>
          Owner
        </IdsDatagridColumn>
        <IdsDatagridColumn field="region" width={100}>
          Region
        </IdsDatagridColumn>
        <IdsDatagridBody>
          {SAMPLE_ROWS.slice(0, 4).map((row) => (
            <IdsDatagridRow key={row.id} id={row.id}>
              <IdsDatagridCell field="name">{row.name}</IdsDatagridCell>
              <IdsDatagridCell field="owner">{row.owner}</IdsDatagridCell>
              <IdsDatagridCell field="region">{row.region}</IdsDatagridCell>
            </IdsDatagridRow>
          ))}
        </IdsDatagridBody>
      </IdsDatagrid>
    </div>
  ),
};

function FilterTypesHost() {
  const [numeric, setNumeric] = useState<IdsDatagridNumericFilterState>(
    defaultIdsDatagridNumericFilterState,
  );
  return (
    <div style={FRAME}>
      <IdsDatagrid headerColorAndBorder columnResizeEnabled pageSize={6} showSettingsColumn={false}>
        <IdsDatagridColumn field="name" sortable filterable width={220}>
          <IdsDatagridColumnTitle>Name</IdsDatagridColumnTitle>
          <IdsDatagridFilter>
            <IdsDatagridTextFilter aria-label="Search name" />
          </IdsDatagridFilter>
        </IdsDatagridColumn>
        <IdsDatagridColumn field="amount" sortable filterable width={140}>
          <IdsDatagridColumnTitle>Amount</IdsDatagridColumnTitle>
          <IdsDatagridFilter>
            <IdsDatagridNumericFilter
              groupLabel="Amount"
              state={numeric}
              onStateChange={setNumeric}
              unitOptions={[
                { value: "KB", label: "KB" },
                { value: "MB", label: "MB" },
                { value: "GB", label: "GB" },
              ]}
            />
          </IdsDatagridFilter>
        </IdsDatagridColumn>
        <IdsDatagridBody>
          {SAMPLE_ROWS.map((row) => (
            <IdsDatagridRow key={row.id} id={row.id}>
              <IdsDatagridCell field="name">{row.name}</IdsDatagridCell>
              <IdsDatagridCell field="amount">{row.amount}</IdsDatagridCell>
            </IdsDatagridRow>
          ))}
        </IdsDatagridBody>
      </IdsDatagrid>
    </div>
  );
}

export const FilterTypes: Story = {
  name: "Filter Types",
  render: () => <FilterTypesHost />,
};

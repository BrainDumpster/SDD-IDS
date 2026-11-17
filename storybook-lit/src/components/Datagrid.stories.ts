/**
 * Storybook: IDS Lit Datagrid from `lib/lit/ids/datagrid`
 *
 * Theme: components/ids-theme.css (via preview)
 * Spec: components/ids/datagrid/design-spec.md
 * API: lib/angular/ids/datagrid · lib/react/ids/datagrid · storybook/src/components
 *
 * Live Figma verified 2026-11-10 (MCP session): Column Header `37721:114663`,
 * row/cell `37721:114580`, redesign root `48122:183847`.
 */
import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { useArgs } from "@storybook/preview-api";
import "@ids/core/datagrid/register.js";
import {
  DATAGRID_SPEC_ACCURATE_DEFAULTS,
  defaultIdsDatagridDateFilterState,
  defaultIdsDatagridDateTimeFilterState,
  defaultIdsDatagridNumericFilterState,
  isIdsDatagridDateFilterActive,
  isIdsDatagridDateTimeFilterActive,
  isIdsDatagridNumericFilterActive,
  matchesIdsDatagridDateFilter,
  matchesIdsDatagridDateTimeFilter,
  matchesIdsDatagridNumericFilter,
  type IdsDatagridDateFilterState,
  type IdsDatagridDateTimeFilterState,
  type IdsDatagridNumericFilterState,
} from "@ids/core/datagrid";
import {
  DATAGRID_DOCS_DESCRIPTION,
  DATAGRID_SOURCE_CODE,
} from "./ids-datagrid.developer-usage";

type DatagridArgs = {
  rowSelection: boolean;
  selectionMode: "single" | "multiple";
  showSingleSelectionRadio: boolean;
  withDetailPanel: boolean;
  pageSize: number;
  readOnly: boolean;
  rowVerticalIndicator: boolean;
  headerColorAndBorder: boolean;
  columnResizeEnabled: boolean;
  nameQuery: string;
  selectedTypes: string[];
  selectedStatuses: string[];
  selectedOwner: string | null;
  selectedRegion: string | null;
  numericFilter: IdsDatagridNumericFilterState;
  dateFilter: IdsDatagridDateFilterState;
  dateTimeFilter: IdsDatagridDateTimeFilterState;
};

const SAMPLE_ROWS = [
  {
    id: "r-1",
    name: "North America Control Plane",
    type: "Service",
    status: "Active",
    owner: "Platform",
    region: "NA",
    amount: "3200",
    updated: "2026-11-09T10:30:00",
  },
  {
    id: "r-2",
    name: "Europe Billing Processor",
    type: "Job",
    status: "Warning",
    owner: "Finance",
    region: "EU",
    amount: "1800",
    updated: "2026-11-08T16:00:00",
  },
  {
    id: "r-3",
    name: "Asia Analytics Stream",
    type: "Pipeline",
    status: "Active",
    owner: "Data Ops",
    region: "APAC",
    amount: "940",
    updated: "2026-11-07T08:15:00",
  },
  {
    id: "r-4",
    name: "Archive Worker",
    type: "Worker",
    status: "Paused",
    owner: "Storage",
    region: "NA",
    amount: "4100",
    updated: "2026-10-20T12:00:00",
  },
  {
    id: "r-5",
    name: "Policy Service",
    type: "Service",
    status: "Active",
    owner: "Security",
    region: "EU",
    amount: "1250",
    updated: "2026-11-01T09:45:00",
  },
  {
    id: "r-6",
    name: "Partner Portal",
    type: "Application",
    status: "Active",
    owner: "Product",
    region: "NA",
    amount: "760",
    updated: "2026-09-15T14:20:00",
  },
  {
    id: "r-7",
    name: "Telemetry Bus",
    type: "Cluster",
    status: "Warning",
    owner: "Platform",
    region: "APAC",
    amount: "2100",
    updated: "2026-11-10T01:05:00",
  },
] as const;

const TYPE_OPTIONS = [...new Set(SAMPLE_ROWS.map((r) => r.type))];
const STATUS_OPTIONS = [...new Set(SAMPLE_ROWS.map((r) => r.status))];
const OWNER_OPTIONS = [...new Set(SAMPLE_ROWS.map((r) => r.owner))];
const REGION_OPTIONS = [...new Set(SAMPLE_ROWS.map((r) => r.region))];

const meta: Meta<DatagridArgs> = {
  title: "Spec Generated/IDS/Datagrid",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: { component: DATAGRID_DOCS_DESCRIPTION },
      source: { code: DATAGRID_SOURCE_CODE, language: "html" },
    },
  },
  argTypes: {
    rowSelection: { control: "boolean" },
    selectionMode: { control: "select", options: ["single", "multiple"] },
    showSingleSelectionRadio: { control: "boolean" },
    withDetailPanel: { control: "boolean" },
    pageSize: { control: "number" },
    readOnly: { control: "boolean" },
    rowVerticalIndicator: { control: "boolean" },
    headerColorAndBorder: { control: "boolean" },
    columnResizeEnabled: { control: "boolean" },
    nameQuery: { control: "text", table: { category: "Filters" } },
    selectedTypes: { control: false, table: { category: "Filters" } },
    selectedStatuses: { control: false, table: { category: "Filters" } },
    selectedOwner: { control: false, table: { category: "Filters" } },
    selectedRegion: { control: false, table: { category: "Filters" } },
  },
  args: {
    rowSelection: DATAGRID_SPEC_ACCURATE_DEFAULTS.rowSelection,
    selectionMode: DATAGRID_SPEC_ACCURATE_DEFAULTS.selectionMode,
    showSingleSelectionRadio: DATAGRID_SPEC_ACCURATE_DEFAULTS.showSingleSelectionRadio,
    withDetailPanel: DATAGRID_SPEC_ACCURATE_DEFAULTS.withDetailPanel,
    pageSize: DATAGRID_SPEC_ACCURATE_DEFAULTS.pageSize,
    readOnly: DATAGRID_SPEC_ACCURATE_DEFAULTS.readOnly,
    rowVerticalIndicator: DATAGRID_SPEC_ACCURATE_DEFAULTS.rowVerticalIndicator,
    headerColorAndBorder: DATAGRID_SPEC_ACCURATE_DEFAULTS.headerColorAndBorder,
    columnResizeEnabled: DATAGRID_SPEC_ACCURATE_DEFAULTS.columnResizeEnabled,
    nameQuery: "",
    selectedTypes: [],
    selectedStatuses: [],
    selectedOwner: null,
    selectedRegion: null,
    numericFilter: defaultIdsDatagridNumericFilterState(),
    dateFilter: defaultIdsDatagridDateFilterState(),
    dateTimeFilter: defaultIdsDatagridDateTimeFilterState(),
  },
};

export default meta;
type Story = StoryObj<DatagridArgs>;

function renderGrid(args: DatagridArgs, updateArgs: (patch: Partial<DatagridArgs>) => void) {
  const filtered = SAMPLE_ROWS.filter((row) => {
    if (args.nameQuery && !row.name.toLowerCase().includes(args.nameQuery.toLowerCase())) {
      return false;
    }
    if (args.selectedTypes.length && !args.selectedTypes.includes(row.type)) return false;
    if (args.selectedStatuses.length && !args.selectedStatuses.includes(row.status)) return false;
    if (args.selectedOwner && row.owner !== args.selectedOwner) return false;
    if (args.selectedRegion && row.region !== args.selectedRegion) return false;
    return true;
  });

  return html`
    <div
      style="width:100%;height:100dvh;min-height:0;min-width:0;display:flex;flex-direction:column;box-sizing:border-box;"
    >
      <ids-datagrid
        ?rowselection=${args.rowSelection}
        selectionmode=${args.selectionMode}
        ?showsingleselectionradio=${args.showSingleSelectionRadio}
        ?withdetailpanel=${args.withDetailPanel}
        pagesize=${args.pageSize}
        ?readonly=${args.readOnly}
        ?rowverticalindicator=${args.rowVerticalIndicator}
        ?headercolorandborder=${args.headerColorAndBorder}
        ?columnresizeenabled=${args.columnResizeEnabled}
      >
        <ids-datagrid-column
          field="name"
          sortable
          filterable
          width="200"
          minwidth="90"
          ?filteractive=${Boolean(args.nameQuery.trim())}
        >
          <ids-datagrid-column-title>Name</ids-datagrid-column-title>
          <ids-datagrid-filter>
            <ids-datagrid-filter-search-field
              arialabel="Search name column"
              .query=${args.nameQuery}
              @query-change=${(e: CustomEvent<{ query: string }>) =>
                updateArgs({ nameQuery: e.detail.query })}
            ></ids-datagrid-filter-search-field>
          </ids-datagrid-filter>
        </ids-datagrid-column>

        <ids-datagrid-column
          field="type"
          sortable
          filterable
          columnhideable
          width="140"
          minwidth="90"
          ?filteractive=${args.selectedTypes.length > 0}
        >
          <ids-datagrid-column-title>Type</ids-datagrid-column-title>
          <ids-datagrid-filter>
            <ids-datagrid-filter-multiselect
              grouplabel="Type"
              .options=${TYPE_OPTIONS}
              .selectedValues=${args.selectedTypes}
              @selected-values-change=${(e: CustomEvent<{ selectedValues: string[] }>) =>
                updateArgs({ selectedTypes: e.detail.selectedValues })}
            ></ids-datagrid-filter-multiselect>
          </ids-datagrid-filter>
        </ids-datagrid-column>

        <ids-datagrid-column
          field="status"
          sortable
          filterable
          columnhideable
          width="120"
          minwidth="90"
          ?filteractive=${args.selectedStatuses.length > 0}
        >
          <ids-datagrid-column-title>Status</ids-datagrid-column-title>
          <ids-datagrid-filter>
            <ids-datagrid-filter-multiselect
              grouplabel="Status"
              .options=${STATUS_OPTIONS}
              .selectedValues=${args.selectedStatuses}
              @selected-values-change=${(e: CustomEvent<{ selectedValues: string[] }>) =>
                updateArgs({ selectedStatuses: e.detail.selectedValues })}
            ></ids-datagrid-filter-multiselect>
          </ids-datagrid-filter>
        </ids-datagrid-column>

        <ids-datagrid-column
          field="owner"
          sortable
          filterable
          columnhideable
          width="120"
          minwidth="90"
          ?filteractive=${args.selectedOwner != null}
        >
          <ids-datagrid-column-title>Owner</ids-datagrid-column-title>
          <ids-datagrid-filter>
            <ids-datagrid-filter-single-select
              arialabel="Filter owner column"
              .options=${OWNER_OPTIONS}
              .selectedValue=${args.selectedOwner}
              @selected-value-change=${(e: CustomEvent<{ selectedValue: string | null }>) =>
                updateArgs({ selectedOwner: e.detail.selectedValue })}
            ></ids-datagrid-filter-single-select>
          </ids-datagrid-filter>
        </ids-datagrid-column>

        <ids-datagrid-column
          field="region"
          filterable
          columnhideable
          width="100"
          minwidth="90"
          ?filteractive=${args.selectedRegion != null}
        >
          <ids-datagrid-column-title>Region</ids-datagrid-column-title>
          <ids-datagrid-filter>
            <ids-datagrid-filter-single-select
              arialabel="Filter region column"
              .options=${REGION_OPTIONS}
              .selectedValue=${args.selectedRegion}
              @selected-value-change=${(e: CustomEvent<{ selectedValue: string | null }>) =>
                updateArgs({ selectedRegion: e.detail.selectedValue })}
            ></ids-datagrid-filter-single-select>
          </ids-datagrid-filter>
        </ids-datagrid-column>

        <ids-datagrid-body>
          ${filtered.map(
            (row) => html`
              <ids-datagrid-row row-id=${row.id}>
                <ids-datagrid-cell field="name" value=${row.name}></ids-datagrid-cell>
                <ids-datagrid-cell field="type" value=${row.type}></ids-datagrid-cell>
                <ids-datagrid-cell field="status" value=${row.status}></ids-datagrid-cell>
                <ids-datagrid-cell field="owner" value=${row.owner}></ids-datagrid-cell>
                <ids-datagrid-cell field="region" value=${row.region}></ids-datagrid-cell>
              </ids-datagrid-row>
            `,
          )}
        </ids-datagrid-body>
      </ids-datagrid>
    </div>
  `;
}

function renderTypedFilterGrid(
  args: DatagridArgs,
  updateArgs: (patch: Partial<DatagridArgs>) => void,
  kind: "numeric" | "date" | "datetime",
) {
  const filtered = SAMPLE_ROWS.filter((row) => {
    if (kind === "numeric") {
      return matchesIdsDatagridNumericFilter(row.amount, args.numericFilter);
    }
    if (kind === "date") {
      return matchesIdsDatagridDateFilter(row.updated, args.dateFilter);
    }
    return matchesIdsDatagridDateTimeFilter(row.updated, args.dateTimeFilter);
  });

  const filterActive =
    kind === "numeric"
      ? isIdsDatagridNumericFilterActive(args.numericFilter)
      : kind === "date"
        ? isIdsDatagridDateFilterActive(args.dateFilter)
        : isIdsDatagridDateTimeFilterActive(args.dateTimeFilter);

  return html`
    <div
      style="width:100%;height:100dvh;min-height:0;min-width:0;display:flex;flex-direction:column;box-sizing:border-box;"
    >
      <ids-datagrid
        ?rowselection=${args.rowSelection}
        selectionmode=${args.selectionMode}
        ?showsingleselectionradio=${args.showSingleSelectionRadio}
        ?withdetailpanel=${args.withDetailPanel}
        pagesize=${args.pageSize}
        ?readonly=${args.readOnly}
        ?rowverticalindicator=${args.rowVerticalIndicator}
        ?headercolorandborder=${args.headerColorAndBorder}
        ?columnresizeenabled=${args.columnResizeEnabled}
      >
        <ids-datagrid-column field="name" sortable width="200" minwidth="90">
          <ids-datagrid-column-title>Name</ids-datagrid-column-title>
        </ids-datagrid-column>
        ${kind === "numeric"
          ? html`
              <ids-datagrid-column
                field="amount"
                sortable
                filterable
                align="right"
                width="160"
                minwidth="90"
                ?filteractive=${filterActive}
              >
                <ids-datagrid-column-title>Amount</ids-datagrid-column-title>
                <ids-datagrid-filter>
                  <ids-datagrid-filter-numeric
                    grouplabel="Amount"
                    .state=${args.numericFilter}
                    @state-change=${(
                      e: CustomEvent<{ state: IdsDatagridNumericFilterState }>,
                    ) => updateArgs({ numericFilter: e.detail.state })}
                  ></ids-datagrid-filter-numeric>
                </ids-datagrid-filter>
              </ids-datagrid-column>
            `
          : kind === "date"
            ? html`
                <ids-datagrid-column
                  field="updated"
                  sortable
                  filterable
                  width="200"
                  minwidth="90"
                  ?filteractive=${filterActive}
                >
                  <ids-datagrid-column-title>Updated</ids-datagrid-column-title>
                  <ids-datagrid-filter>
                    <ids-datagrid-filter-date
                      grouplabel="Updated"
                      .state=${args.dateFilter}
                      @state-change=${(
                        e: CustomEvent<{ state: IdsDatagridDateFilterState }>,
                      ) => updateArgs({ dateFilter: e.detail.state })}
                    ></ids-datagrid-filter-date>
                  </ids-datagrid-filter>
                </ids-datagrid-column>
              `
            : html`
                <ids-datagrid-column
                  field="updated"
                  sortable
                  filterable
                  width="220"
                  minwidth="90"
                  ?filteractive=${filterActive}
                >
                  <ids-datagrid-column-title>Updated</ids-datagrid-column-title>
                  <ids-datagrid-filter>
                    <ids-datagrid-filter-datetime
                      grouplabel="Updated"
                      .state=${args.dateTimeFilter}
                      @state-change=${(
                        e: CustomEvent<{ state: IdsDatagridDateTimeFilterState }>,
                      ) => updateArgs({ dateTimeFilter: e.detail.state })}
                    ></ids-datagrid-filter-datetime>
                  </ids-datagrid-filter>
                </ids-datagrid-column>
              `}
        <ids-datagrid-body>
          ${filtered.map(
            (row) => html`
              <ids-datagrid-row row-id=${row.id}>
                <ids-datagrid-cell field="name" value=${row.name}></ids-datagrid-cell>
                ${kind === "numeric"
                  ? html`<ids-datagrid-cell
                      field="amount"
                      value=${row.amount}
                    ></ids-datagrid-cell>`
                  : html`<ids-datagrid-cell
                      field="updated"
                      value=${row.updated}
                    ></ids-datagrid-cell>`}
              </ids-datagrid-row>
            `,
          )}
        </ids-datagrid-body>
      </ids-datagrid>
    </div>
  `;
}

export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  render: (args) => {
    const [, updateArgs] = useArgs();
    return renderGrid(args, updateArgs);
  },
};

export const MultipleSelection: Story = {
  name: "Multiple Selection",
  args: {
    selectionMode: "multiple",
    withDetailPanel: false,
  },
  render: (args) => {
    const [, updateArgs] = useArgs();
    return renderGrid(args, updateArgs);
  },
};

export const ReadOnly: Story = {
  name: "Read Only",
  args: {
    readOnly: true,
    withDetailPanel: false,
    columnResizeEnabled: false,
  },
  render: (args) => {
    const [, updateArgs] = useArgs();
    return renderGrid(args, updateArgs);
  },
};

export const NumericFilter: Story = {
  name: "Numeric Filter",
  args: {
    withDetailPanel: false,
    pageSize: 10,
  },
  render: (args) => {
    const [, updateArgs] = useArgs();
    return renderTypedFilterGrid(args, updateArgs, "numeric");
  },
};

export const DateFilter: Story = {
  name: "Date Filter",
  args: {
    withDetailPanel: false,
    pageSize: 10,
  },
  render: (args) => {
    const [, updateArgs] = useArgs();
    return renderTypedFilterGrid(args, updateArgs, "date");
  },
};

export const DateTimeFilter: Story = {
  name: "Date and Time Filter",
  args: {
    withDetailPanel: false,
    pageSize: 10,
  },
  render: (args) => {
    const [, updateArgs] = useArgs();
    return renderTypedFilterGrid(args, updateArgs, "datetime");
  },
};

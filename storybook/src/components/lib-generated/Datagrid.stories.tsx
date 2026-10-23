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
  IdsDatagridDateFilter,
  IdsDatagridDateTimeFilter,
  IdsDatagridFilter,
  IdsDatagridMultiselectFilter,
  IdsDatagridNumericFilter,
  IdsDatagridRow,
  IdsDatagridTextFilter,
  defaultIdsDatagridDateFilterState,
  defaultIdsDatagridDateTimeFilterState,
  defaultIdsDatagridNumericFilterState,
  isIdsDatagridDateFilterActive,
  isIdsDatagridDateTimeFilterActive,
  isIdsDatagridNumericFilterActive,
  matchesIdsDatagridDateFilter,
  matchesIdsDatagridDateTimeFilter,
  matchesIdsDatagridNumericFilter,
  type IdsDatagridColumnDef,
  type IdsDatagridDateFilterState,
  type IdsDatagridDateTimeFilterState,
  type IdsDatagridNumericFilterState,
  type IdsDatagridProps,
  type IdsDatagridRowDef,
  type IdsDatagridTreeNode,
  type IdsDatagridViewMode,
} from "@ids/react/datagrid";
import { IdsSegmentedButton, IdsSegmentedText } from "@ids/react/segmented-button";

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
        <IdsDatagridColumn
          field="type"
          sortable
          filterable
          filterActive={selectedTypes.length < typeOptions.length}
          columnHideable
          width={140}
          minWidth={90}
        >
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
        <IdsDatagridColumn field="amount" sortable filterable align="right" width={140}>
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

/* -------------------------------------------------------------------------- */
/* Ported from the `src` Datagrid stories (storybook-generated/ids)           */
/* -------------------------------------------------------------------------- */

export const CompositionApi: Story = {
  name: "Composition API",
  render: (args) => <SpecAccurateAnatomy {...args} />,
};

/** Figma `colorAndBorder=false`: white header band, no bottom rule. */
export const HeaderMinimal: Story = {
  name: "Header Minimal",
  render: (args) => <SpecAccurateAnatomy {...args} />,
  args: { headerColorAndBorder: false },
};

/** Read-only table: rows are not selectable; hover uses `surface-primary`. */
export const ReadOnlyTableHover: Story = {
  name: "Read Only Table Hover",
  render: (args) => <SpecAccurateAnatomy {...args} />,
  args: { readOnly: true, rowSelection: false },
};

/** Selected rows without the 4px leading brand bar (`verticalBlueLine=false`). */
export const WithoutVerticalSelectionIndicator: Story = {
  name: "Without Vertical Selection Indicator",
  render: (args) => <SpecAccurateAnatomy {...args} />,
  args: { rowVerticalIndicator: false },
};

/** Attached detail panel: click a row to open it. */
export const WithDetailPanel: Story = {
  name: "With Detail Panel",
  render: (args) => <SpecAccurateAnatomy {...args} />,
  args: { withDetailPanel: true },
};

/* ----------------------------- Shared sample data ----------------------------- */

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

/** Timestamps relative to "now" so every date preset (Last 24 hours … Last year) has matches. */
function isoAgo(ms: number): string {
  return new Date(Date.now() - ms).toISOString();
}

/** Figma cell format: `2023-04-22 09:00 AM`. */
function formatDateTime(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  const hours = d.getHours() % 12 || 12;
  const meridiem = d.getHours() < 12 ? "AM" : "PM";
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(hours)}:${pad(d.getMinutes())} ${meridiem}`;
}

function formatDate(iso: string): string {
  return formatDateTime(iso).slice(0, 10);
}

interface SpecRecord {
  id: string;
  name: string;
  type: string;
  status: string;
  amount: number;
  dueDate: string;
  updatedAt: string;
  owner: string;
  region: string;
}

const SPEC_RECORDS: SpecRecord[] = [
  { id: "r-1", name: "North America Control Plane", type: "Service", status: "Active", amount: 3200, dueDate: isoAgo(3 * HOUR_MS), updatedAt: isoAgo(2 * HOUR_MS), owner: "Platform", region: "NA" },
  { id: "r-2", name: "Europe Billing Processor", type: "Job", status: "Warning", amount: 450, dueDate: isoAgo(3 * DAY_MS), updatedAt: isoAgo(20 * HOUR_MS), owner: "Finance", region: "EU" },
  { id: "r-3", name: "Asia Analytics Stream", type: "Pipeline", status: "Active", amount: 8900, dueDate: isoAgo(12 * DAY_MS), updatedAt: isoAgo(5 * DAY_MS), owner: "Data Ops", region: "APAC" },
  { id: "r-4", name: "Archive Worker", type: "Worker", status: "Paused", amount: 75, dueDate: isoAgo(400 * DAY_MS), updatedAt: isoAgo(380 * DAY_MS), owner: "Storage", region: "NA" },
  { id: "r-5", name: "Policy Service", type: "Service", status: "Active", amount: 1200, dueDate: isoAgo(25 * DAY_MS), updatedAt: isoAgo(9 * DAY_MS), owner: "Security", region: "Global" },
  { id: "r-6", name: "Realtime Gateway", type: "Gateway", status: "Critical", amount: 5400, dueDate: isoAgo(6 * HOUR_MS), updatedAt: isoAgo(30 * DAY_MS), owner: "Edge", region: "EU" },
  { id: "r-7", name: "Ingestion Adapter", type: "Adapter", status: "Active", amount: 2100, dueDate: isoAgo(90 * DAY_MS), updatedAt: isoAgo(120 * DAY_MS), owner: "Data Ops", region: "APAC" },
  { id: "r-8", name: "Partner Connector", type: "Connector", status: "Warning", amount: 980, dueDate: isoAgo(200 * DAY_MS), updatedAt: isoAgo(250 * DAY_MS), owner: "Integrations", region: "NA" },
];

const DEMO_UNIT_OPTIONS = [
  { value: "KB", label: "KB" },
  { value: "MB", label: "MB" },
  { value: "GB", label: "GB" },
  { value: "TB", label: "TB" },
];

/* ---------------------------------- Tree view --------------------------------- */

const TREE_COLUMNS: IdsDatagridColumnDef[] = [
  { key: "name", title: "Tree", sortable: true, minWidth: 120, width: 240 },
  { key: "type", title: "Type", sortable: true, minWidth: 90, width: 120 },
  { key: "status", title: "Status", sortable: true, minWidth: 90, width: 120 },
  { key: "amount", title: "Amount", sortable: true, minWidth: 90, width: 120, align: "right" },
];

const TREE_NODES: IdsDatagridTreeNode[] = [
  {
    id: "region-na",
    label: "North America",
    values: { type: "Region", status: "Active", amount: 3200 },
    children: [
      {
        id: "na-cp",
        label: "Control Plane",
        values: { type: "Service", status: "Active", amount: 1200 },
        children: [
          { id: "na-cp-a", label: "Alpha worker", values: { type: "Worker", status: "Active", amount: 400 } },
          { id: "na-cp-b", label: "Beta worker", values: { type: "Worker", status: "Warning", amount: 380 } },
        ],
      },
      { id: "na-bill", label: "Billing Processor", values: { type: "Job", status: "Warning", amount: 450 } },
    ],
  },
  {
    id: "region-eu",
    label: "Europe",
    values: { type: "Region", status: "Active", amount: 5400 },
    children: [
      { id: "eu-gw", label: "Realtime Gateway", values: { type: "Gateway", status: "Critical", amount: 5400 } },
    ],
  },
  {
    id: "region-apac",
    label: "Asia Pacific",
    values: { type: "Region", status: "Active", amount: 8900 },
    children: [
      { id: "apac-stream", label: "Analytics Stream", values: { type: "Pipeline", status: "Active", amount: 8900 } },
    ],
  },
];

/* Column filters on every column — Figma Data Grid shows a filter toggle on each column. */

type CellValues = Record<string, React.ReactNode>;

/** Tree node values plus its label under the tree column key (`name`). */
function treeNodeValues(node: IdsDatagridTreeNode): CellValues {
  return { ...node.values, name: node.label };
}

function collectTreeValues(nodes: IdsDatagridTreeNode[]): CellValues[] {
  return nodes.flatMap((node) => [treeNodeValues(node), ...collectTreeValues(node.children ?? [])]);
}

/** Keeps nodes that pass `matches`, plus the ancestors of any match. */
function filterTreeNodes(
  nodes: IdsDatagridTreeNode[],
  matches: (values: CellValues) => boolean,
): IdsDatagridTreeNode[] {
  return nodes.flatMap((node) => {
    const children = filterTreeNodes(node.children ?? [], matches);
    return matches(treeNodeValues(node)) || children.length > 0 ? [{ ...node, children }] : [];
  });
}

/**
 * Story-side filter model: Search on `name`, multiselect on `multiKeys`, numeric on `amount`.
 * `decorate` attaches the matching filter panel + `filterActive` to each column definition.
 */
function useColumnFilters(data: CellValues[], multiKeys: readonly string[]) {
  const options = useMemo(
    () =>
      Object.fromEntries(
        multiKeys.map((key) => [
          key,
          [...new Set(data.map((values) => String(values[key] ?? "")))].filter(Boolean).sort(),
        ]),
      ) as Record<string, string[]>,
    [data, multiKeys],
  );
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Record<string, string[]>>(options);
  const [amount, setAmount] = useState<IdsDatagridNumericFilterState>(
    defaultIdsDatagridNumericFilterState,
  );

  const matches = (values: CellValues) => {
    const q = query.trim().toLowerCase();
    if (q && !String(values.name ?? "").toLowerCase().includes(q)) return false;
    for (const key of multiKeys) {
      const value = values[key];
      if (value != null && !(selected[key] ?? []).includes(String(value))) return false;
    }
    return matchesIdsDatagridNumericFilter(values.amount, amount);
  };

  const decorate = (columns: IdsDatagridColumnDef[]): IdsDatagridColumnDef[] =>
    columns.map((column) => {
      if (column.key === "name") {
        return {
          ...column,
          filterable: true,
          filterActive: query.trim().length > 0,
          filterPanel: (
            <IdsDatagridTextFilter
              aria-label={`Search ${column.title} column`}
              value={query}
              onChange={setQuery}
            />
          ),
        };
      }
      if (column.key === "amount") {
        return {
          ...column,
          filterable: true,
          filterActive: isIdsDatagridNumericFilterActive(amount),
          filterPanel: (
            <IdsDatagridNumericFilter groupLabel={column.title} state={amount} onStateChange={setAmount} />
          ),
        };
      }
      const columnOptions = options[column.key];
      if (!columnOptions) return column;
      const columnSelected = selected[column.key] ?? columnOptions;
      return {
        ...column,
        filterable: true,
        filterActive: columnSelected.length < columnOptions.length,
        filterPanel: (
          <IdsDatagridMultiselectFilter
            groupLabel={column.title}
            options={columnOptions}
            selectedValues={columnSelected}
            onSelectedValuesChange={(next) =>
              setSelected((prev) => ({ ...prev, [column.key]: next }))
            }
          />
        ),
      };
    });

  return { matches, decorate };
}

const TREE_VALUES = collectTreeValues(TREE_NODES);
const TREE_MULTI_KEYS = ["type", "status"] as const;

function TreeviewHost({
  treeRowSelection,
  treeShowRowIcon,
}: Pick<IdsDatagridProps, "treeRowSelection" | "treeShowRowIcon">) {
  const filters = useColumnFilters(TREE_VALUES, TREE_MULTI_KEYS);
  return (
    <div style={FRAME}>
      <IdsDatagrid
        columns={filters.decorate(TREE_COLUMNS)}
        rows={[]}
        viewMode="treeview"
        treeNodes={filterTreeNodes(TREE_NODES, filters.matches)}
        treeColumnKey="name"
        treeRowSelection={treeRowSelection}
        treeShowRowIcon={treeShowRowIcon}
        rowSelection={false}
        withDetailPanel={false}
        pageSize={12}
        headerColorAndBorder
      />
    </div>
  );
}

/** Figma `Column Type=Tree` — chevron + label in the first column. */
export const TreeviewOnly: Story = {
  name: "Treeview Only",
  render: () => <TreeviewHost treeShowRowIcon={false} />,
};

/** Figma `Column Type=Tree + Checkbox` — checkbox inside the tree cell (multiple selection). */
export const TreeviewWithCheckbox: Story = {
  name: "Treeview With Checkbox",
  render: () => <TreeviewHost treeRowSelection="checkbox" treeShowRowIcon={false} />,
};

/** Figma `Cells Type=Tree with selection` + row icon. */
export const TreeviewWithCheckboxAndIcon: Story = {
  name: "Treeview With Checkbox and Icon",
  render: () => <TreeviewHost treeRowSelection="checkbox" treeShowRowIcon />,
};

/** Figma `Column Type=Tree + Radio` + row icon (single selection). */
export const TreeviewWithRadioAndIcon: Story = {
  name: "Treeview With Radio and Icon",
  render: () => <TreeviewHost treeRowSelection="radio" treeShowRowIcon />,
};

const SPEC_COLUMNS: IdsDatagridColumnDef[] = [
  { key: "name", title: "Name", sortable: true, minWidth: 90, width: 220 },
  { key: "type", title: "Type", sortable: true, minWidth: 90, width: 120 },
  { key: "status", title: "Status", sortable: true, minWidth: 90, width: 120 },
  { key: "amount", title: "Amount", sortable: true, minWidth: 90, width: 120, align: "right" },
  { key: "owner", title: "Owner", sortable: true, minWidth: 90, width: 140 },
  { key: "region", title: "Region", minWidth: 90, width: 100 },
];

const SPEC_ROW_DEFS: IdsDatagridRowDef[] = SPEC_RECORDS.map((r) => ({
  id: r.id,
  values: { name: r.name, type: r.type, status: r.status, amount: r.amount, owner: r.owner, region: r.region },
}));

const TOGGLE_VALUES: CellValues[] = [...SPEC_ROW_DEFS.map((row) => row.values), ...TREE_VALUES];
const TOGGLE_MULTI_KEYS = ["type", "status", "owner", "region"] as const;

function TableTreeToggleHost() {
  const [viewMode, setViewMode] = useState<IdsDatagridViewMode>("table");
  // One filter model shared by both modes (table rows and tree nodes).
  const filters = useColumnFilters(TOGGLE_VALUES, TOGGLE_MULTI_KEYS);
  return (
    <div style={{ ...FRAME, gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <IdsSegmentedButton
          type="text"
          ariaLabel="View mode"
          value={viewMode}
          onChange={(value) => setViewMode(value as IdsDatagridViewMode)}
        >
          <IdsSegmentedText value="table" label="Table" />
          <IdsSegmentedText value="treeview" label="Treeview" />
        </IdsSegmentedButton>
      </div>
      <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
        <IdsDatagrid
          columns={filters.decorate(viewMode === "table" ? SPEC_COLUMNS : TREE_COLUMNS)}
          rows={SPEC_ROW_DEFS.filter((row) => filters.matches(row.values))}
          viewMode={viewMode}
          treeNodes={filterTreeNodes(TREE_NODES, filters.matches)}
          treeColumnKey="name"
          rowSelection
          selectionMode="single"
          pageSize={8}
          headerColorAndBorder
        />
      </div>
    </div>
  );
}

/** IDS Segmented Button toggles one datagrid between table and tree view. */
export const TableAndTreeViewToggle: Story = {
  name: "Table and Treeview Toggle",
  render: () => <TableTreeToggleHost />,
};

/* ------------------------------- Column filters ------------------------------- */

function DateColumnFilterHost() {
  const [state, setState] = useState<IdsDatagridDateFilterState>(defaultIdsDatagridDateFilterState);
  const visible = SPEC_RECORDS.filter((r) => matchesIdsDatagridDateFilter(r.dueDate, state));
  return (
    <div style={FRAME}>
      <IdsDatagrid headerColorAndBorder pageSize={10}>
        <IdsDatagridColumn field="name" sortable width={240}>
          <IdsDatagridColumnTitle>Name</IdsDatagridColumnTitle>
        </IdsDatagridColumn>
        <IdsDatagridColumn
          field="dueDate"
          sortable
          filterable
          filterActive={isIdsDatagridDateFilterActive(state)}
          width={180}
        >
          <IdsDatagridColumnTitle>Due Date</IdsDatagridColumnTitle>
          <IdsDatagridFilter>
            <IdsDatagridDateFilter groupLabel="Due Date" state={state} onStateChange={setState} />
          </IdsDatagridFilter>
        </IdsDatagridColumn>
        <IdsDatagridColumn field="status" sortable width={120}>
          <IdsDatagridColumnTitle>Status</IdsDatagridColumnTitle>
        </IdsDatagridColumn>
        <IdsDatagridBody>
          {visible.map((r) => (
            <IdsDatagridRow key={r.id} id={r.id}>
              <IdsDatagridCell field="name">{r.name}</IdsDatagridCell>
              <IdsDatagridCell field="dueDate">{formatDate(r.dueDate)}</IdsDatagridCell>
              <IdsDatagridCell field="status">{r.status}</IdsDatagridCell>
            </IdsDatagridRow>
          ))}
        </IdsDatagridBody>
      </IdsDatagrid>
    </div>
  );
}

/** Figma date filter `37822:90838` — preset radios + date pickers. */
export const DateColumnFilter: Story = {
  name: "Date Column Filter",
  render: () => <DateColumnFilterHost />,
};

function DateAndTimeColumnFilterHost() {
  const [state, setState] = useState<IdsDatagridDateTimeFilterState>(
    defaultIdsDatagridDateTimeFilterState,
  );
  const visible = SPEC_RECORDS.filter((r) => matchesIdsDatagridDateTimeFilter(r.updatedAt, state));
  return (
    <div style={FRAME}>
      <IdsDatagrid headerColorAndBorder pageSize={10}>
        <IdsDatagridColumn field="name" sortable width={240}>
          <IdsDatagridColumnTitle>Name</IdsDatagridColumnTitle>
        </IdsDatagridColumn>
        <IdsDatagridColumn
          field="updatedAt"
          sortable
          filterable
          filterActive={isIdsDatagridDateTimeFilterActive(state)}
          width={220}
        >
          <IdsDatagridColumnTitle>Date and Time [ET]</IdsDatagridColumnTitle>
          <IdsDatagridFilter>
            <IdsDatagridDateTimeFilter groupLabel="Updated" state={state} onStateChange={setState} />
          </IdsDatagridFilter>
        </IdsDatagridColumn>
        <IdsDatagridColumn field="status" sortable width={120}>
          <IdsDatagridColumnTitle>Status</IdsDatagridColumnTitle>
        </IdsDatagridColumn>
        <IdsDatagridBody>
          {visible.map((r) => (
            <IdsDatagridRow key={r.id} id={r.id}>
              <IdsDatagridCell field="name">{r.name}</IdsDatagridCell>
              <IdsDatagridCell field="updatedAt">{formatDateTime(r.updatedAt)}</IdsDatagridCell>
              <IdsDatagridCell field="status">{r.status}</IdsDatagridCell>
            </IdsDatagridRow>
          ))}
        </IdsDatagridBody>
      </IdsDatagrid>
    </div>
  );
}

/** Figma date-time filter `44360:181306` — preset radios + date and time pickers. */
export const DateAndTimeColumnFilter: Story = {
  name: "Date and Time Column Filter",
  render: () => <DateAndTimeColumnFilterHost />,
};

function NumericColumnFilterHost() {
  const [state, setState] = useState<IdsDatagridNumericFilterState>(
    defaultIdsDatagridNumericFilterState,
  );
  const visible = SPEC_RECORDS.filter((r) => matchesIdsDatagridNumericFilter(r.amount, state));
  return (
    <div style={FRAME}>
      <IdsDatagrid headerColorAndBorder pageSize={10}>
        <IdsDatagridColumn field="name" sortable width={240}>
          <IdsDatagridColumnTitle>Name</IdsDatagridColumnTitle>
        </IdsDatagridColumn>
        <IdsDatagridColumn
          field="amount"
          sortable
          filterable
          filterActive={isIdsDatagridNumericFilterActive(state)}
          align="right"
          width={140}
        >
          <IdsDatagridColumnTitle>Amount</IdsDatagridColumnTitle>
          <IdsDatagridFilter>
            <IdsDatagridNumericFilter
              groupLabel="Amount"
              state={state}
              onStateChange={setState}
              unitOptions={DEMO_UNIT_OPTIONS}
            />
          </IdsDatagridFilter>
        </IdsDatagridColumn>
        <IdsDatagridColumn field="status" sortable width={120}>
          <IdsDatagridColumnTitle>Status</IdsDatagridColumnTitle>
        </IdsDatagridColumn>
        <IdsDatagridBody>
          {visible.map((r) => (
            <IdsDatagridRow key={r.id} id={r.id}>
              <IdsDatagridCell field="name">{r.name}</IdsDatagridCell>
              <IdsDatagridCell field="amount">{r.amount}</IdsDatagridCell>
              <IdsDatagridCell field="status">{r.status}</IdsDatagridCell>
            </IdsDatagridRow>
          ))}
        </IdsDatagridBody>
      </IdsDatagrid>
    </div>
  );
}

/** Figma numeric filter `44360:182265` — operator list + value fields + unit dropdown. */
export const NumericColumnFilter: Story = {
  name: "Numeric Column Filter",
  render: () => <NumericColumnFilterHost />,
};

/* -------------------------------- Column freeze ------------------------------- */

const FREEZE_COLUMNS: IdsDatagridColumnDef[] = [
  {
    key: "dataHeader",
    title: "Data Header",
    sortable: true,
    filterable: true,
    minWidth: 90,
    width: 160,
    filterPanel: <IdsDatagridTextFilter aria-label="Search data header column" />,
  },
  { key: "dateTimeEt", title: "Date and Time [ET]", sortable: true, minWidth: 120, width: 200 },
  ...Array.from({ length: 12 }, (_, index) => ({
    key: `metric${index + 1}`,
    title: `Metric ${index + 1}`,
    sortable: true,
    minWidth: 90,
    width: 140,
    columnHideable: true,
  })),
];

const FREEZE_ROWS: IdsDatagridRowDef[] = SPEC_RECORDS.map((r, index) => ({
  id: r.id,
  values: {
    dataHeader: r.name,
    dateTimeEt: formatDateTime(r.updatedAt),
    metric1: r.type,
    metric2: r.status,
    metric3: r.amount,
    metric4: formatDate(r.dueDate),
    metric5: r.owner,
    metric6: r.region,
    ...Object.fromEntries(
      Array.from({ length: 6 }, (_, i) => [`metric${i + 7}`, `Value ${index + 1}-${i + 7}`]),
    ),
  },
}));

const TWO_SECTION_COLUMNS: IdsDatagridColumnDef[] = [
  { key: "recordId", title: "ID", sortable: true, minWidth: 90, width: 96 },
  {
    key: "name",
    title: "Name",
    sortable: true,
    filterable: true,
    minWidth: 90,
    width: 200,
    filterPanel: <IdsDatagridTextFilter aria-label="Search name column" />,
  },
  { key: "status", title: "Status", sortable: true, minWidth: 90, width: 120, columnHideable: true },
  ...Array.from({ length: 10 }, (_, index) => ({
    key: `field${index + 1}`,
    title: `Field ${index + 1}`,
    sortable: true,
    minWidth: 90,
    width: 150,
    columnHideable: true,
  })),
];

const TWO_SECTION_ROWS: IdsDatagridRowDef[] = SPEC_RECORDS.map((r, index) => ({
  id: r.id,
  values: {
    recordId: `R-${1000 + index}`,
    name: r.name,
    status: r.status,
    field1: r.type,
    field2: r.amount,
    field3: r.owner,
    field4: r.region,
    field5: formatDate(r.dueDate),
    field6: formatDateTime(r.updatedAt),
    field7: `Extra ${index + 1}-7`,
    field8: `Extra ${index + 1}-8`,
    field9: `Extra ${index + 1}-9`,
    field10: `Extra ${index + 1}-10`,
  },
}));

/**
 * Two panes: the frozen section (checkbox + ID + Name + Status) stays fixed; the scrollable
 * section (Field 1–10 + settings) scrolls horizontally.
 */
export const ColumnFreezeTwoSections: Story = {
  name: "Column Freeze — Two Sections",
  render: (args) => (
    <div style={FRAME}>
      <IdsDatagrid {...args} />
    </div>
  ),
  args: {
    columns: TWO_SECTION_COLUMNS,
    rows: TWO_SECTION_ROWS,
    rowSelection: true,
    selectionMode: "multiple",
    withDetailPanel: false,
    headerColorAndBorder: true,
    freezeUntilColumnKey: "status",
    columnResizeEnabled: true,
    rowVerticalIndicator: false,
    pageSize: 25,
  },
};

/** Figma column-freeze scenario (`37721:115949`): pinned data columns + boundary gradient. */
export const ColumnFreeze: Story = {
  name: "Column Freeze",
  render: (args) => (
    <div style={FRAME}>
      <IdsDatagrid {...args} />
    </div>
  ),
  args: {
    columns: FREEZE_COLUMNS,
    rows: FREEZE_ROWS,
    rowSelection: true,
    selectionMode: "multiple",
    withDetailPanel: false,
    headerColorAndBorder: true,
    freezeUntilColumnKey: "dateTimeEt",
    columnResizeEnabled: true,
    pageSize: 25,
  },
};

/* ------------------------------- Token inspector ------------------------------ */

const SPEC_TOKENS: Array<{ token: string; refs: string[] }> = [
  { token: "--color-background-surface-component", refs: ["Default row fill on each body cell", "Header colorAndBorder=false", "Filter icon tab background"] },
  { token: "--color-background-surface-primary", refs: ["Row hover on read-only table"] },
  { token: "--color-background-gray-neutral-lighter", refs: ["Header colorAndBorder=true band"] },
  { token: "--color-background-brand-lighter-slate", refs: ["Row hover / selected"] },
  { token: "--color-background-brand-light-slate", refs: ["Row hover on selected"] },
  { token: "--color-border-gray-neutral-light", refs: ["Row bottom divider; header bottom rule and rails"] },
  { token: "--color-border-gray-neutral-base", refs: ["Grid frame; column filter L-frame border"] },
  { token: "--color-border-brand-base", refs: ["Row vertical selection accent (4px leading bar)"] },
  { token: "--color-text-gray-neutral-strong", refs: ["Column title (Body 2 Medium)"] },
  { token: "--color-text-gray-neutral", refs: ["Body cell text"] },
  { token: "--color-icon-gray-neutral-base", refs: ["Sort default; filter default / hover"] },
  { token: "--color-icon-brand-base", refs: ["Sort selected; filter applied"] },
  { token: "--color-icon-brand-strong", refs: ["Filter press; filter applied + hover"] },
  { token: "--color-icon-brand-stronger", refs: ["Sort selected + hover; filter applied + press"] },
];

export const TokenInspector: Story = {
  name: "Token Inspector",
  render: () => (
    <div style={{ display: "grid", gap: 8, maxWidth: 880, padding: 16 }}>
      <div style={{ fontSize: 12, opacity: 0.8 }}>{`Token inspector — ${DESIGN_SPEC_PATH}`}</div>
      {SPEC_TOKENS.map(({ token, refs }) => (
        <div
          key={token}
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(260px, 1fr) 72px 120px minmax(260px, 1fr)",
            alignItems: "start",
            gap: 12,
            padding: "6px 8px",
            border: "1px solid var(--color-border-gray-neutral-light)",
            borderRadius: 4,
            background: "var(--color-background-surface-component)",
          }}
        >
          <span style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 12 }}>
            {`var(${token})`}
          </span>
          <span
            style={{
              width: 64,
              height: 20,
              border: "1px solid var(--color-border-gray-neutral-base)",
              borderRadius: 2,
              background: `var(${token})`,
            }}
          />
          <span style={{ fontSize: 12, color: `var(${token})` }}>Sample</span>
          <div style={{ display: "grid", gap: 2, fontSize: 11, opacity: 0.9 }}>
            {refs.map((ref) => (
              <div key={ref}>{ref}</div>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};

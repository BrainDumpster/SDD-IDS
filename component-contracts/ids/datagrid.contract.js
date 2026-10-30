/**
 * IDS Datagrid — framework-agnostic spec contract.
 * Source: `components/ids/datagrid/design-spec.md`
 */
export const IDS_DATAGRID_DESIGN_SPEC_PATH = "components/ids/datagrid/design-spec.md";
export const DATAGRID_API_DEFAULTS = {
    viewMode: "table",
    rowSelection: false,
    selectionMode: "single",
    showSingleSelectionRadio: true,
    withDetailPanel: false,
    pageSize: 25,
    readOnly: false,
    rowVerticalIndicator: false,
    headerColorAndBorder: true,
    columnResizeEnabled: false,
    showSettingsColumn: true,
};
/** Spec Accurate Design defaults — `components/ids/datagrid/design-spec.md` → Composition & API. */
export const DATAGRID_SPEC_ACCURATE_DEFAULTS = {
    viewMode: "table",
    rowSelection: true,
    selectionMode: "single",
    showSingleSelectionRadio: true,
    withDetailPanel: true,
    pageSize: 6,
    readOnly: false,
    rowVerticalIndicator: true,
    headerColorAndBorder: true,
    columnResizeEnabled: true,
};
/** Canonical spec-accurate columns (Name, Type/Status sort+filter, Owner sort, Region filter). */
export const DATAGRID_SPEC_COLUMNS = [
    {
        key: "name",
        title: "Name",
        sortable: true,
        filterable: true,
        minWidth: 90,
        width: 200,
    },
    {
        key: "type",
        title: "Type",
        sortable: true,
        filterable: true,
        columnHideable: true,
        minWidth: 90,
        width: 140,
    },
    {
        key: "status",
        title: "Status",
        sortable: true,
        filterable: true,
        columnHideable: true,
        minWidth: 90,
        width: 120,
    },
    {
        key: "owner",
        title: "Owner",
        sortable: true,
        filterable: true,
        columnHideable: true,
        minWidth: 90,
        width: 120,
    },
    {
        key: "region",
        title: "Region",
        sortable: false,
        filterable: true,
        columnHideable: true,
        minWidth: 90,
        width: 100,
    },
];
export const DATAGRID_SPEC_ROWS = [
    {
        id: "r-1",
        values: {
            name: "North America Control Plane",
            type: "Service",
            status: "Active",
            owner: "Platform",
            region: "NA",
        },
    },
    {
        id: "r-2",
        values: {
            name: "Europe Billing Processor",
            type: "Job",
            status: "Warning",
            owner: "Finance",
            region: "EU",
        },
    },
    {
        id: "r-3",
        values: {
            name: "Asia Analytics Stream",
            type: "Pipeline",
            status: "Active",
            owner: "Data Ops",
            region: "APAC",
        },
    },
    {
        id: "r-4",
        values: {
            name: "Archive Worker",
            type: "Worker",
            status: "Paused",
            owner: "Storage",
            region: "NA",
        },
    },
    {
        id: "r-5",
        values: {
            name: "Policy Service",
            type: "Service",
            status: "Active",
            owner: "Security",
            region: "Global",
        },
    },
    {
        id: "r-6",
        values: {
            name: "Realtime Gateway",
            type: "Gateway",
            status: "Critical",
            owner: "Edge",
            region: "EU",
        },
    },
    {
        id: "r-7",
        values: {
            name: "Ingestion Adapter",
            type: "Adapter",
            status: "Active",
            owner: "Data Ops",
            region: "APAC",
        },
    },
    {
        id: "r-8",
        values: {
            name: "Partner Connector",
            type: "Connector",
            status: "Warning",
            owner: "Integrations",
            region: "NA",
        },
    },
];
export const DATAGRID_CHROME = {
    selectionColWidthPx: 48,
    settingsColWidthPx: 40,
    headerHeightPx: 48,
    bodyRowHeightPx: 40,
    defaultMinWidthPx: 90,
    defaultColumnWidthPx: 160,
};

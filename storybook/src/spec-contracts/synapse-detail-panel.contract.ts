/**
 * Synapse Detail Panel — ids-fork of IDS Detail Panel.
 * Spec: `components/synapse/detail-panel/design-spec.md`
 * Topology usage: Figma `54102:37235` (page layout `54012:298595`)
 */
export const SYNAPSE_DETAIL_PANEL_DESIGN_SPEC_PATH =
  "components/synapse/detail-panel/design-spec.md" as const;
export const SYNAPSE_DETAIL_PANEL_IDS_BASELINE_PATH =
  "components/ids/detail-panel/design-spec.md" as const;

export const SYNAPSE_DETAIL_PANEL_TOPOLOGY_NODE_ID = "54102:37235" as const;
export const SYNAPSE_DETAIL_PANEL_HEADER_NODE_ID = "54111:39513" as const;
export const SYNAPSE_DETAIL_PANEL_PAGE_LAYOUT_NODE_ID = "54012:298595" as const;

export const SYNAPSE_DETAIL_PANEL_EXPANDED_WIDTH = 398 as const;
export const SYNAPSE_DETAIL_PANEL_COLLAPSED_WIDTH = 40 as const;

export interface SynapseDetailPanelKeyValueRow {
  label: string;
  value: string;
  variant?: "text" | "link" | "status";
  href?: string;
  statusIconSlug?: string;
}

export const SYNAPSE_DETAIL_PANEL_SAMPLE_ROWS: SynapseDetailPanelKeyValueRow[] = [
  { label: "Status:", value: "Warning", variant: "status", statusIconSlug: "status-ok-circ-solid" },
  {
    label: "Resource:",
    value: "External management URL",
    variant: "link",
    href: "https://example.com",
  },
  { label: "Label:", value: "Single line content" },
  { label: "Label:", value: "Single line content" },
  { label: "Label:", value: "Single line content" },
];

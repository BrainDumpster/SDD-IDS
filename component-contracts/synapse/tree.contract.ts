/**
 * Synapse Tree — IDS-fork spec contract.
 * Full contract: `components/synapse/tree/design-spec.md`
 * IDS baseline: `components/ids/tree/design-spec.md`
 */
export const SYNAPSE_TREE_DESIGN_SPEC_PATH =
  "components/synapse/tree/design-spec.md" as const;

export const SYNAPSE_TREE_IDS_BASELINE_SPEC_PATH =
  "components/ids/tree/design-spec.md" as const;

export const SYNAPSE_TREE_SPEC_PATTERN = "ids-fork" as const;

export const SYNAPSE_TREE_FIGMA_FILE_KEY = "Td1bnsvRj1PCGs9RVJkIvJ" as const;

export const SYNAPSE_TREE_MAIN_NODE_ID = "11067:54609" as const;

export const SYNAPSE_TREE_SAMPLE_ITEMS = [
  { id: "row-1", label: "Text", badgeCount: 1 },
  { id: "row-2", label: "Text", badgeCount: 1 },
  { id: "row-3", label: "Text", badgeCount: 1 },
  { id: "row-4", label: "Text", badgeCount: 1 },
  { id: "row-5", label: "Text", badgeCount: 1 },
  { id: "row-6", label: "Text", badgeCount: 1 },
] as const;

export const SYNAPSE_TREE_HIERARCHY_ITEMS = [
  {
    id: "branch-a",
    label: "Text",
    badgeCount: 1,
    children: [
      { id: "branch-a-1", label: "Text", badgeCount: 1 },
      {
        id: "branch-a-2",
        label: "Text",
        badgeCount: 1,
        children: [{ id: "leaf-a-2-1", label: "Text", badgeCount: 1 }],
      },
    ],
  },
  { id: "branch-b", label: "Text", badgeCount: 1 },
  { id: "leaf-c", label: "Text", badgeCount: 1 },
] as const;

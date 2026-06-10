/**
 * Synapse Modal (Modal Dialog) — thin IDS-fork; programme delta: `--modal-control-radius`.
 * Full contract: `components/synapse/modal/design-spec.md`
 * IDS baseline: `components/ids/modal/design-spec.md`
 */
export const SYNAPSE_MODAL_CONTROL_RADIUS_ALIAS = "--modal-control-radius" as const;
export const SYNAPSE_MODAL_DESIGN_SPEC_PATH =
  "components/synapse/modal/design-spec.md" as const;

export const SYNAPSE_MODAL_IDS_BASELINE_SPEC_PATH =
  "components/ids/modal/design-spec.md" as const;

export const SYNAPSE_MODAL_SPEC_PATTERN = "ids-fork" as const;

export const SYNAPSE_MODAL_MAIN_NODE_ID = "43461:175960" as const;

export const SYNAPSE_MODAL_DIALOG_TYPE_NODES = {
  nonAlerting: "43461:175961",
  informational: "43461:175976",
  warning: "43461:175992",
  major: "43461:176008",
  critical: "43461:176024",
  destructive: "43461:176040",
} as const;

export const SYNAPSE_MODAL_ELEMENT_CONTENT_NODE_ID = "11348:62999" as const;

/** Footer/trigger button contract (Synapse programme chrome). */
export const SYNAPSE_MODAL_BUTTON_SPEC_PATH =
  "components/synapse/button/design-spec.md" as const;

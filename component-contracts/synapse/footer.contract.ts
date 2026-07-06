/**
 * Synapse Footer — IDS-fork application status bar.
 * Full contract: `components/synapse/footer/design-spec.md`
 * IDS baseline: `components/ids/footer/design-spec.md`
 */
export const SYNAPSE_FOOTER_DESIGN_SPEC_PATH = "components/synapse/footer/design-spec.md" as const;

export const SYNAPSE_FOOTER_IDS_BASELINE_SPEC_PATH = "components/ids/footer/design-spec.md" as const;

export const SYNAPSE_FOOTER_SPEC_PATTERN = "ids-fork" as const;

/** IDS application status bar — shared geometry/API. */
export const SYNAPSE_FOOTER_IDS_MAIN_NODE_ID = "38908:5818" as const;

export {
  FOOTER_SPEC_ACCURATE_DEFAULTS as SYNAPSE_FOOTER_SPEC_ACCURATE_DEFAULTS,
} from "../ids/footer.contract";

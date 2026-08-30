/**
 * IDS Toggle Switch — framework-agnostic spec contract.
 * Source: `components/ids/toggle-switch/design-spec.md`
 */
export const IDS_TOGGLE_SWITCH_DESIGN_SPEC_PATH =
  "components/ids/toggle-switch/design-spec.md" as const;

/** Sample visible label used by Spec Accurate Design / Off stories. */
export const TOGGLE_SWITCH_SPEC_SAMPLE_LABEL = "Enable alerts" as const;

export const TOGGLE_SWITCH_SPEC_ACCURATE_DEFAULTS = {
  checked: false,
  defaultChecked: false,
  disabled: false,
  label: TOGGLE_SWITCH_SPEC_SAMPLE_LABEL,
  id: undefined as string | undefined,
  name: undefined as string | undefined,
  value: undefined as string | undefined,
  className: undefined as string | undefined,
  ariaLabel: undefined as string | undefined,
  ariaDescribedBy: undefined as string | undefined,
} as const;

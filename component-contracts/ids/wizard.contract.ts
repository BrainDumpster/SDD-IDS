export const IDS_WIZARD_DESIGN_SPEC_PATH = "components/ids/wizard/design-spec.md";

export const WIZARD_SIZE_OPTIONS = ["medium", "large", "x-large", "full-screen"] as const;
export const WIZARD_MODE_OPTIONS = ["inline", "modal"] as const;

export const WIZARD_DEFAULTS = {
  mode: "inline",
  size: "large",
  title: "Header",
  showCloseButton: true,
} as const;

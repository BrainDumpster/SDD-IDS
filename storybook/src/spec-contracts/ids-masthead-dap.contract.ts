export const IDS_MASTHEAD_DAP_DESIGN_SPEC_PATH = "components/DAP/masthead-dap/design-spec.mdx";

export const MASTHEAD_DAP_CODEGEN_ANATOMY = [
  "MastheadDapRoot",
  "MastheadDapBackground",
  "MastheadDapProductInfo",
  "MastheadDapPrimaryProductLabel",
  "MastheadDapProductDivider",
  "MastheadDapSecondaryProductLabel",
  "MastheadDapActions",
  "MastheadDapSettingsAction",
  "MastheadDapHelpAction",
  "MastheadDapAppLauncherAction",
  "MastheadDapUserInitials",
  "MastheadDapHelpMenu",
  "MastheadDapAppLauncherMenu",
] as const;

export const MASTHEAD_DAP_DEFAULTS = {
  productName: "Dell Automation Platform",
  productAreaLabel: "Portal",
  userInitials: "DT",
  helpItems: ["Help", "What's New", "Get Started", "About"],
} as const;

export const MASTHEAD_DAP_HELP_MENU_SURFACE = {
  widthPx: 138,
  borderRadiusPx: 0,
} as const;

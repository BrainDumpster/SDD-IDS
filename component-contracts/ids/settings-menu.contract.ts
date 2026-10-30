import type { IdsSettingsMenuItem, IdsSettingsMenuProps } from "../components/dap/IdsSettingsMenu";

export const IDS_SETTINGS_MENU_DESIGN_SPEC_PATH =
  "components/DAP/settings-menu/design-spec.md" as const;

export const SETTINGS_MENU_ROOT_PROP_KEYS = [
  "title",
  "items",
  "selectedId",
  "defaultSelectedId",
  "interactive",
  "ariaLabel",
  "onSelect",
  "onNavigate",
] as const;

export const SETTINGS_MENU_CODEGEN_ANATOMY = [
  "SettingsMenuRoot",
  "SettingsMenuPanel",
  "SettingsMenuTitle",
  "SettingsMenuItem",
  "SettingsMenuItemActiveIndicator?",
] as const;

export const SETTINGS_MENU_DEFAULT_ITEMS: IdsSettingsMenuItem[] = [
  { id: "identity-management", label: "Identity Management", routeRef: "settings.identity-management" },
  { id: "entitlement", label: "Entitlement", routeRef: "settings.entitlement" },
  { id: "system-settings", label: "System Settings", routeRef: "settings.system-settings" },
  { id: "security", label: "Security", routeRef: "settings.security" },
  { id: "tags", label: "Tags", routeRef: "settings.tags" },
  { id: "audit-logs", label: "Audit Logs", routeRef: "settings.audit-logs" },
];

export const SETTINGS_MENU_API_DEFAULTS: Pick<
  IdsSettingsMenuProps,
  "title" | "interactive" | "defaultSelectedId" | "ariaLabel"
> = {
  title: "Settings",
  interactive: true,
  defaultSelectedId: "identity-management",
  ariaLabel: "Settings Menu",
};
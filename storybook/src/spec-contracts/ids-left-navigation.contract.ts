import type { IdsLeftNavigationItem, IdsLeftNavigationProps } from "../components/IdsLeftNavigation";

export const IDS_LEFT_NAVIGATION_DESIGN_SPEC_PATH =
  "components/ids/left-navigation/design-spec.mdx" as const;

export const LEFT_NAVIGATION_ROOT_PROP_KEYS = [
  "title",
  "items",
  "selectedId",
  "defaultSelectedId",
  "interactive",
  "ariaLabel",
  "onSelect",
  "onNavigate",
] as const;

export const LEFT_NAVIGATION_CODEGEN_ANATOMY = [
  "LeftNavigationRoot",
  "LeftNavigationPanel",
  "LeftNavigationTitle",
  "LeftNavigationItem",
  "LeftNavigationItemActiveIndicator?",
] as const;

export const LEFT_NAVIGATION_DEFAULT_ITEMS: IdsLeftNavigationItem[] = [
  { id: "identity-management", label: "Identity Management", routeRef: "settings.identity-management" },
  { id: "entitlement", label: "Entitlement", routeRef: "settings.entitlement" },
  { id: "system-settings", label: "System Settings", routeRef: "settings.system-settings" },
  { id: "security", label: "Security", routeRef: "settings.security" },
  { id: "tags", label: "Tags", routeRef: "settings.tags" },
  { id: "audit-logs", label: "Audit Logs", routeRef: "settings.audit-logs" },
];

export const LEFT_NAVIGATION_API_DEFAULTS: Pick<
  IdsLeftNavigationProps,
  "title" | "interactive" | "defaultSelectedId" | "ariaLabel"
> = {
  title: "Settings",
  interactive: true,
  defaultSelectedId: "identity-management",
  ariaLabel: "Left navigation",
};

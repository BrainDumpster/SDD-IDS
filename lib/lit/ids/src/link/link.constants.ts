/**
 * Link constants — from `components/ids/link/design-spec.md`
 * and React `lib/react/ids/link` / `component-contracts/ids/link.contract.ts`.
 */

export type IdsLinkType = "standalone" | "inline" | "dark-bg";

export type IdsLinkDataState =
  | "default"
  | "hover"
  | "press"
  | "focus-visible";

export type IdsLinkTarget = "_self" | "_blank" | "_parent" | "_top";

const LINK_TYPES = new Set<IdsLinkType>(["standalone", "inline", "dark-bg"]);

const LINK_TARGETS = new Set<IdsLinkTarget>([
  "_self",
  "_blank",
  "_parent",
  "_top",
]);

/** External icon asset from design-spec (`pop-up-square-corner-big`, 16px). */
export const LINK_EXTERNAL_ICON_SHAPE = "pop-up-square-corner-big" as const;
export const LINK_EXTERNAL_ICON_SIZE = 16 as const;

/** Unknown `type` → `standalone` (design-spec fallback). */
export function resolveType(value: unknown): IdsLinkType {
  if (typeof value === "string" && LINK_TYPES.has(value as IdsLinkType)) {
    return value as IdsLinkType;
  }
  return "standalone";
}

/** Empty label → `"Link"` (+ caller emits development warning). */
export function resolveLabel(label: string | null | undefined): string {
  if (label == null || String(label).trim() === "") {
    return "Link";
  }
  return String(label);
}

export function resolveTarget(value: unknown): IdsLinkTarget {
  if (typeof value === "string" && LINK_TARGETS.has(value as IdsLinkTarget)) {
    return value as IdsLinkTarget;
  }
  return "_self";
}

/** When `target="_blank"`, default `noopener noreferrer` unless `rel` is set. */
export function resolveRel(
  target: IdsLinkTarget,
  rel: string | undefined,
): string | undefined {
  if (rel != null && String(rel).trim() !== "") return String(rel);
  if (target === "_blank") return "noopener noreferrer";
  return undefined;
}

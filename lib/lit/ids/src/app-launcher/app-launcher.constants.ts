/**
 * IDS App Launcher — types + packing helpers (React `IdsAppLauncher` parity).
 * Spec: `components/ids/app-launcher/design-spec.md`
 */

export const APP_LAUNCHER_TRIGGER_ICON = "grid-square-9-16" as const;
export const APP_LAUNCHER_DEFAULT_PRODUCT_ICON = "shield-encrypt-alt" as const;
export const APP_LAUNCHER_LABEL_LINE_HEIGHT = 20;
export const APP_LAUNCHER_MAX_PRODUCT_ROWS = 2;
export const APP_LAUNCHER_VIEWPORT_MARGIN = 8;

export type IdsAppLauncherProgramme = "ids" | "synapse";
export type IdsAppLauncherTriggerVariant = "default" | "masthead";
export type IdsAppLauncherDividerVariant = "solid" | "dotted";
export type IdsAppLauncherTileDivider = "solid" | "dotted" | "none";
export type IdsAppLauncherTileDataState =
  | "default"
  | "hover"
  | "press"
  | "focus"
  | "no-icon";
export type IdsAppLauncherOptionDataState =
  | "default"
  | "hover"
  | "press"
  | "focus";

export interface IdsAppLauncherProduct {
  id?: string;
  name: string;
  /** Pass `null` for no-icon tile. Omit for default `shield-encrypt-alt`. */
  icon?: null;
  /**
   * Icon slug (`assets/icons/<slug>.svg`). Used when `icon` is omitted.
   * Alias of `shape`. Unknown / empty → `shield-encrypt-alt`.
   */
  iconSlug?: string;
  /** Alias of `iconSlug` (IdsIcon `shape` parity). */
  shape?: string;
  href?: string;
}

export interface IdsAppLauncherOption {
  id?: string;
  label: string;
}

export interface IdsAppLauncherFooterActionModel {
  label: string;
}

export interface IdsAppLauncherProductSelectDetail {
  id: string;
  name: string;
}

export interface IdsAppLauncherOptionSelectDetail {
  id: string;
  label: string;
}

export function resolveProgramme(value: unknown): IdsAppLauncherProgramme {
  return value === "synapse" ? "synapse" : "ids";
}

export function resolveTriggerVariant(
  value: unknown,
): IdsAppLauncherTriggerVariant {
  return value === "masthead" ? "masthead" : "default";
}

export function resolveColumns(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value) && value >= 1) {
    return Math.floor(value);
  }
  return 2;
}

export function resolveProductIconSlug(slug: unknown): string {
  if (typeof slug === "string" && slug.trim()) return slug.trim();
  return APP_LAUNCHER_DEFAULT_PRODUCT_ICON;
}

/** Prefer `shape`, then `iconSlug` (IdsIcon naming). */
export function resolveItemIconSlug(
  item: { shape?: string; iconSlug?: string } | null | undefined,
): string {
  return resolveProductIconSlug(item?.shape ?? item?.iconSlug);
}

export function productReflowKey(
  product: IdsAppLauncherProduct,
  index: number,
): string {
  return product.id && product.id.trim() ? product.id : `idx-${index}`;
}

export function isTextOnlyProduct(product: IdsAppLauncherProduct): boolean {
  return product.icon === null;
}

export function productKey(
  product: IdsAppLauncherProduct,
  fallback: string,
): string {
  return product.id && product.id.trim() ? product.id : fallback;
}

/** Pack products into rows; rows beyond the cap overflow into options. */
export function packProductRows(
  list: IdsAppLauncherProduct[],
  fullWidthKeys: Set<string>,
  columns: number,
): { rows: IdsAppLauncherProduct[][]; overflow: IdsAppLauncherProduct[] } {
  const cols = Math.max(1, columns);
  const rows: IdsAppLauncherProduct[][] = [];
  let current: IdsAppLauncherProduct[] = [];
  const flush = () => {
    if (current.length) {
      rows.push(current);
      current = [];
    }
  };
  list.forEach((product, index) => {
    if (fullWidthKeys.has(productReflowKey(product, index))) {
      flush();
      rows.push([product]);
    } else {
      current.push(product);
      if (current.length === cols) flush();
    }
  });
  flush();
  return {
    rows: rows.slice(0, APP_LAUNCHER_MAX_PRODUCT_ROWS),
    overflow: rows.slice(APP_LAUNCHER_MAX_PRODUCT_ROWS).flat(),
  };
}

export function productToOption(
  product: IdsAppLauncherProduct,
  index: number,
): IdsAppLauncherOption {
  return {
    id: product.id && product.id.trim() ? product.id : `overflow-${index}`,
    label: product.name,
    iconSlug:
      product.icon === null ? undefined : resolveItemIconSlug(product),
    shape: product.icon === null ? undefined : product.shape,
  };
}

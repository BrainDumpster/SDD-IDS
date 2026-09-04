/**
 * IDS App Launcher — React implementation generated from design-spec.
 *
 * Path: `lib/react/ids/app-launcher`
 * Source: `components/ids/app-launcher/design-spec.md`
 * Theme: `components/ids-theme.css`
 *
 * Anatomy (deterministic child order — root is AppLauncher, not AppLauncherRoot):
 *   IdsAppLauncher                         AppLauncher
 *     IdsAppLauncherTrigger                AppLauncherTrigger
 *     IdsAppLauncherSurface                AppLauncherSurface
 *       IdsAppLauncherProductRegion        ProductRegion
 *         IdsAppLauncherProductRowGroup[]  ProductRowGroup
 *           IdsAppLauncherRowDivider?      AppLauncherRowDivider
 *           IdsAppLauncherProductRow       ProductRow
 *             IdsAppLauncherColumnDivider? AppLauncherColumnDivider  (productCount ≥ 3)
 *             IdsAppLauncherProductTile    ProductTile
 *               IdsAppLauncherLabelCluster LabelCluster
 *                 IdsAppLauncherProductIcon? ProductIcon
 *                 IdsAppLauncherProductLabel ProductLabel
 *               IdsAppLauncherTileDividerRail? TileDividerRail (2 products, leading tile)
 *       IdsAppLauncherOptionsRegion?       OptionsRegion
 *         IdsAppLauncherOptionRow[]        OptionRow
 *         IdsAppLauncherFooterAction?      FooterAction
 *
 * Prop-driven `products` / `options` emit this tree.
 * Compound `children` replace the default tree when Trigger or Surface is present.
 * No @base-ui-components dependency.
 */

import React, {
  Children,
  createContext,
  forwardRef,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { useAnchorPosition } from "../../shared/utils/useAnchorPosition";
import { useControllableState } from "../../shared/utils/useControllableState";
import { IdsIcon } from "../icon";
import styles from "./IdsAppLauncher.module.css";

const DEFAULT_PRODUCT_ICON = "shield-encrypt-alt";
const TRIGGER_ICON = "grid-square-9-16";

const s = {
  root: styles["ids-app-launcher"],
  trigger: styles["ids-app-launcher-trigger"],
  triggerMasthead: styles["ids-app-launcher-trigger--masthead"],
  triggerIcon: styles["ids-app-launcher-trigger-icon"],
  popup: styles["ids-app-launcher-popup"],
  surface: styles["ids-app-launcher-surface"],
  surfaceTwoProduct: styles["ids-app-launcher-surface--two-product"],
  surfaceSingle: styles["ids-app-launcher-surface--single-product"],
  productRegion: styles["ids-app-launcher-product-region"],
  productRowGroup: styles["ids-app-launcher-product-row-group"],
  productRow: styles["ids-app-launcher-product-row"],
  productRowSingle: styles["ids-app-launcher-product-row--single"],
  columnDivider: styles["ids-app-launcher-column-divider"],
  columnDividerDotted: styles["ids-app-launcher-column-divider--dotted"],
  columnDividerSolid: styles["ids-app-launcher-column-divider--solid"],
  rowDivider: styles["ids-app-launcher-row-divider"],
  productTile: styles["ids-app-launcher-product-tile"],
  productTileTwoProduct: styles["ids-app-launcher-product-tile--two-product"],
  tileRail: styles["ids-app-launcher-tile-divider-rail"],
  tileRailDotted: styles["ids-app-launcher-tile-divider-rail--dotted"],
  tileRailSolid: styles["ids-app-launcher-tile-divider-rail--solid"],
  labelCluster: styles["ids-app-launcher-label-cluster"],
  labelClusterNoIcon: styles["ids-app-launcher-label-cluster--no-icon"],
  productIcon: styles["ids-app-launcher-product-icon"],
  productLabel: styles["ids-app-launcher-product-label"],
  optionsRegion: styles["ids-app-launcher-options-region"],
  optionsSeparator: styles["ids-app-launcher-options-region--separator"],
  optionsList: styles["ids-app-launcher-options-list"],
  optionRow: styles["ids-app-launcher-option-row"],
  optionLabel: styles["ids-app-launcher-option-label"],
  optionsFooter: styles["ids-app-launcher-options-footer"],
  footerAction: styles["ids-app-launcher-footer-action"],
};

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export type IdsAppLauncherProgramme = "ids" | "synapse";
export type IdsAppLauncherTriggerVariant = "default" | "masthead";
export type IdsAppLauncherDividerVariant = "solid" | "dotted";
export type IdsAppLauncherTileDivider = "solid" | "dotted" | "none";
export type IdsAppLauncherTileDataState =
  | "default"
  | "hover"
  | "press"
  | "selected"
  | "focus"
  | "no-icon";
export type IdsAppLauncherOptionDataState = "default" | "hover" | "press" | "focus";

export interface IdsAppLauncherProduct {
  id?: string;
  name: string;
  /** Omit for default `shield-encrypt-alt`. Pass `null` for no-icon tile. */
  icon?: ReactNode | null;
  /** Icon slug; used when `icon` is omitted. Unknown → `shield-encrypt-alt`. */
  iconSlug?: string;
  href?: string;
  onSelect?: () => void;
}

export interface IdsAppLauncherOption {
  id?: string;
  label: string;
  onSelect?: () => void;
}

export interface IdsAppLauncherFooterActionModel {
  label: string;
  onClick: () => void;
}

export interface IdsAppLauncherProductSelectDetail {
  id: string;
  name: string;
}

export interface IdsAppLauncherOptionSelectDetail {
  id: string;
  label: string;
}

export interface IdsAppLauncherProps {
  children?: ReactNode;
  /** Unknown → `ids`. This lib implements IDS chrome only. */
  programme?: IdsAppLauncherProgramme | string;
  products?: IdsAppLauncherProduct[];
  /** @deprecated Use `products`. Ignored when `products` is supplied. */
  apps?: IdsAppLauncherProduct[];
  options?: IdsAppLauncherOption[];
  footerAction?: IdsAppLauncherFooterActionModel;
  /** Unknown / invalid → `2`. */
  columns?: number;
  triggerVariant?: IdsAppLauncherTriggerVariant | string;
  /** Default `8` for the default trigger; `1` for `masthead` so the popup's top border sits right below the masthead's 1px bottom border. */
  sideOffset?: number;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onProductSelect?: (detail: IdsAppLauncherProductSelectDetail) => void;
  onOptionSelect?: (detail: IdsAppLauncherOptionSelectDetail) => void;
  /**
   * Render surface only (no trigger, no portal). Spec/layout matrix stories.
   */
  panelOnly?: boolean;
  className?: string;
  style?: CSSProperties;
  id?: string;
}

/* -------------------------------------------------------------------------- */
/* Slot markers                                                               */
/* -------------------------------------------------------------------------- */

const SLOT = Symbol.for("ids.app-launcher.slot");

export type IdsAppLauncherSlotName =
  | "app-launcher"
  | "trigger"
  | "surface"
  | "product-region"
  | "product-row-group"
  | "row-divider"
  | "product-row"
  | "column-divider"
  | "product-tile"
  | "label-cluster"
  | "tile-divider-rail"
  | "product-icon"
  | "product-label"
  | "options-region"
  | "option-row"
  | "footer-action";

function getSlot(type: unknown): IdsAppLauncherSlotName | undefined {
  if (typeof type !== "function" && typeof type !== "object") return undefined;
  return (type as { [SLOT]?: IdsAppLauncherSlotName })[SLOT];
}

function markSlot<T>(fn: T, name: IdsAppLauncherSlotName): T {
  (fn as { [SLOT]?: IdsAppLauncherSlotName })[SLOT] = name;
  return fn;
}

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

function resolveProgramme(value: unknown): IdsAppLauncherProgramme {
  return value === "synapse" ? "synapse" : "ids";
}

function resolveTriggerVariant(value: unknown): IdsAppLauncherTriggerVariant {
  return value === "masthead" ? "masthead" : "default";
}

function resolveColumns(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value) && value >= 1) {
    return Math.floor(value);
  }
  return 2;
}

function resolveProductIconSlug(slug: unknown): string {
  if (typeof slug === "string" && slug.trim()) return slug.trim();
  return DEFAULT_PRODUCT_ICON;
}

function chunkRows<T>(items: T[], columns: number): T[][] {
  const rows: T[][] = [];
  const cols = Math.max(1, columns);
  for (let i = 0; i < items.length; i += cols) {
    rows.push(items.slice(i, i + cols));
  }
  return rows;
}

function productKey(product: IdsAppLauncherProduct, fallback: string): string {
  return product.id && product.id.trim() ? product.id : fallback;
}

type ChromeState = "hover" | "press";

function isPressKey(key: string): boolean {
  return key === " " || key === "Enter";
}

/**
 * Runtime hover/press chrome. Forced `dataState` is demo-only and must not
 * block pointer/keyboard interaction (design-spec Interactions).
 */
function useChromeState(forced?: string): {
  chrome: ChromeState | undefined;
  pointerProps: {
    onPointerEnter: () => void;
    onPointerLeave: () => void;
    onPointerDown: (event: PointerEvent<HTMLElement>) => void;
    onKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
    onKeyUp: (event: KeyboardEvent<HTMLElement>) => void;
    onBlur: () => void;
  };
} {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    if (!pressed) return;
    const end = () => setPressed(false);
    window.addEventListener("pointerup", end);
    window.addEventListener("pointercancel", end);
    return () => {
      window.removeEventListener("pointerup", end);
      window.removeEventListener("pointercancel", end);
    };
  }, [pressed]);

  const runtime: ChromeState | undefined = pressed ? "press" : hovered ? "hover" : undefined;
  const demo: ChromeState | undefined =
    forced === "hover" || forced === "press" ? forced : undefined;

  return {
    chrome: runtime ?? demo,
    pointerProps: {
      onPointerEnter: () => setHovered(true),
      onPointerLeave: () => {
        setHovered(false);
        setPressed(false);
      },
      onPointerDown: (event) => {
        if (event.pointerType === "mouse" && event.button !== 0) return;
        setPressed(true);
      },
      onKeyDown: (event) => {
        if (isPressKey(event.key)) setPressed(true);
      },
      onKeyUp: (event) => {
        if (isPressKey(event.key)) setPressed(false);
      },
      onBlur: () => setPressed(false),
    },
  };
}

function resolveTileDataState(args: {
  chrome?: ChromeState;
  selected: boolean;
  forced?: IdsAppLauncherTileDataState;
}): IdsAppLauncherTileDataState | undefined {
  if (args.chrome) return args.chrome;
  if (args.selected) return "selected";
  if (args.forced && args.forced !== "default") return args.forced;
  return undefined;
}

/* -------------------------------------------------------------------------- */
/* Context                                                                    */
/* -------------------------------------------------------------------------- */

interface IdsAppLauncherContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  panelOnly: boolean;
  triggerVariant: IdsAppLauncherTriggerVariant;
  popupId: string;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  popupRef: React.RefObject<HTMLDivElement | null>;
  popupStyle: CSSProperties;
  list: IdsAppLauncherProduct[];
  rows: IdsAppLauncherProduct[][];
  columns: number;
  options: IdsAppLauncherOption[];
  footerAction?: IdsAppLauncherFooterActionModel;
  showOptions: boolean;
  useTwoProductInternalRail: boolean;
  useSingleProductWidth: boolean;
  onProductSelect?: (detail: IdsAppLauncherProductSelectDetail) => void;
  onOptionSelect?: (detail: IdsAppLauncherOptionSelectDetail) => void;
  selectedProductId: string | null;
  selectedOptionId: string | null;
  setSelectedProductId: (id: string | null) => void;
  setSelectedOptionId: (id: string | null) => void;
}

const IdsAppLauncherContext = createContext<IdsAppLauncherContextValue | null>(null);

function useAppLauncher(slot: string, optional = false): IdsAppLauncherContextValue | null {
  const ctx = useContext(IdsAppLauncherContext);
  if (!ctx && !optional) {
    throw new Error(`${slot} must be used within IdsAppLauncher.`);
  }
  return ctx;
}

interface ProductTileContextValue {
  name: string;
  id: string;
  icon: ReactNode | null | undefined;
  iconSlug: string;
  omitIcon: boolean;
  twoProductLayout: boolean;
  tileDivider: IdsAppLauncherTileDivider;
}

const ProductTileContext = createContext<ProductTileContextValue | null>(null);

function useProductTile(slot: string, optional = false): ProductTileContextValue | null {
  const ctx = useContext(ProductTileContext);
  if (!ctx && !optional) {
    throw new Error(`${slot} must be used within IdsAppLauncherProductTile.`);
  }
  return ctx;
}

function partitionRootChildren(children: ReactNode): {
  trigger: ReactElement | null;
  surface: ReactElement | null;
  other: ReactNode[];
} {
  let trigger: ReactElement | null = null;
  let surface: ReactElement | null = null;
  const other: ReactNode[] = [];

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) {
      if (child != null && child !== false) other.push(child);
      return;
    }
    const slot = getSlot(child.type);
    if (slot === "trigger" && !trigger) {
      trigger = child;
      return;
    }
    if (slot === "surface" && !surface) {
      surface = child;
      return;
    }
    other.push(child);
  });

  return { trigger, surface, other };
}

function hasCompoundRootSlots(children: ReactNode): boolean {
  let found = false;
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    const slot = getSlot(child.type);
    if (slot === "trigger" || slot === "surface") found = true;
  });
  return found;
}

function partitionTileChildren(children: ReactNode): {
  cluster: ReactElement | null;
  rail: ReactElement | null;
  other: ReactNode[];
} {
  let cluster: ReactElement | null = null;
  let rail: ReactElement | null = null;
  const other: ReactNode[] = [];

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) {
      if (child != null && child !== false) other.push(child);
      return;
    }
    const slot = getSlot(child.type);
    if (slot === "label-cluster" && !cluster) {
      cluster = child;
      return;
    }
    if (slot === "tile-divider-rail" && !rail) {
      rail = child;
      return;
    }
    other.push(child);
  });

  return { cluster, rail, other };
}

function partitionClusterChildren(children: ReactNode): {
  icon: ReactElement | null;
  label: ReactElement | null;
  other: ReactNode[];
} {
  let icon: ReactElement | null = null;
  let label: ReactElement | null = null;
  const other: ReactNode[] = [];

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) {
      if (child != null && child !== false) other.push(child);
      return;
    }
    const slot = getSlot(child.type);
    if (slot === "product-icon" && !icon) {
      icon = child;
      return;
    }
    if (slot === "product-label" && !label) {
      label = child;
      return;
    }
    other.push(child);
  });

  return { icon, label, other };
}

/* -------------------------------------------------------------------------- */
/* Dividers — standalone (state-matrix / anatomy)                             */
/* -------------------------------------------------------------------------- */

export interface IdsAppLauncherColumnDividerProps extends HTMLAttributes<HTMLDivElement> {
  variant?: IdsAppLauncherDividerVariant;
}

export function IdsAppLauncherColumnDivider({
  variant = "dotted",
  className,
  ...rest
}: IdsAppLauncherColumnDividerProps) {
  const resolved: IdsAppLauncherDividerVariant = variant === "solid" ? "solid" : "dotted";
  return (
    <div
      {...rest}
      className={cx(
        s.columnDivider,
        resolved === "solid" ? s.columnDividerSolid : s.columnDividerDotted,
        className,
      )}
      data-ids="ids-app-launcher-column-divider"
      data-slot="AppLauncherColumnDivider"
      data-variant={resolved}
      aria-hidden="true"
    />
  );
}
markSlot(IdsAppLauncherColumnDivider, "column-divider");
IdsAppLauncherColumnDivider.displayName = "IdsAppLauncherColumnDivider";

export interface IdsAppLauncherRowDividerProps extends HTMLAttributes<HTMLDivElement> {}

export function IdsAppLauncherRowDivider({
  className,
  ...rest
}: IdsAppLauncherRowDividerProps) {
  return (
    <div
      {...rest}
      className={cx(s.rowDivider, className)}
      data-ids="ids-app-launcher-row-divider"
      data-slot="AppLauncherRowDivider"
      aria-hidden="true"
    />
  );
}
markSlot(IdsAppLauncherRowDivider, "row-divider");
IdsAppLauncherRowDivider.displayName = "IdsAppLauncherRowDivider";

export interface IdsAppLauncherTileDividerRailProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: Exclude<IdsAppLauncherTileDivider, "none">;
}

export function IdsAppLauncherTileDividerRail({
  variant = "dotted",
  className,
  ...rest
}: IdsAppLauncherTileDividerRailProps) {
  const resolved = variant === "solid" ? "solid" : "dotted";
  return (
    <span
      {...rest}
      className={cx(
        s.tileRail,
        resolved === "solid" ? s.tileRailSolid : s.tileRailDotted,
        className,
      )}
      data-ids="ids-app-launcher-tile-divider-rail"
      data-slot="TileDividerRail"
      data-variant={resolved}
      aria-hidden="true"
    />
  );
}
markSlot(IdsAppLauncherTileDividerRail, "tile-divider-rail");
IdsAppLauncherTileDividerRail.displayName = "IdsAppLauncherTileDividerRail";

/* -------------------------------------------------------------------------- */
/* Product icon / label / cluster                                             */
/* -------------------------------------------------------------------------- */

export interface IdsAppLauncherProductIconProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  /** Override slug; unknown → `shield-encrypt-alt`. */
  shape?: string;
}

export function IdsAppLauncherProductIcon({
  children,
  className,
  shape,
  ...rest
}: IdsAppLauncherProductIconProps) {
  const tile = useProductTile("IdsAppLauncherProductIcon", true);
  if (tile?.omitIcon) return null;

  const graphic =
    children ??
    tile?.icon ??
    (
      <IdsIcon
        shape={resolveProductIconSlug(shape ?? tile?.iconSlug)}
        size={32}
        color="currentColor"
      />
    );

  if (graphic == null || graphic === false) return null;

  return (
    <div
      {...rest}
      className={cx(s.productIcon, className)}
      data-ids="ids-app-launcher-product-icon"
      data-slot="ProductIcon"
      aria-hidden="true"
    >
      {graphic}
    </div>
  );
}
markSlot(IdsAppLauncherProductIcon, "product-icon");
IdsAppLauncherProductIcon.displayName = "IdsAppLauncherProductIcon";

export interface IdsAppLauncherProductLabelProps extends HTMLAttributes<HTMLSpanElement> {
  children?: ReactNode;
}

export function IdsAppLauncherProductLabel({
  children,
  className,
  ...rest
}: IdsAppLauncherProductLabelProps) {
  const tile = useProductTile("IdsAppLauncherProductLabel", true);
  const text = children ?? tile?.name;
  if (text == null || text === false) return null;

  return (
    <span
      {...rest}
      className={cx(s.productLabel, className)}
      data-ids="ids-app-launcher-product-label"
      data-slot="ProductLabel"
    >
      {text}
    </span>
  );
}
markSlot(IdsAppLauncherProductLabel, "product-label");
IdsAppLauncherProductLabel.displayName = "IdsAppLauncherProductLabel";

export interface IdsAppLauncherLabelClusterProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export function IdsAppLauncherLabelCluster({
  children,
  className,
  ...rest
}: IdsAppLauncherLabelClusterProps) {
  const tile = useProductTile("IdsAppLauncherLabelCluster", true);
  const { icon, label, other } = partitionClusterChildren(children);
  const omitIcon = tile?.omitIcon ?? false;
  const hasProjected = icon != null || label != null || other.length > 0;

  const content = hasProjected ? (
    <>
      {omitIcon ? null : icon ?? <IdsAppLauncherProductIcon />}
      {label ?? <IdsAppLauncherProductLabel />}
      {other}
    </>
  ) : (
    <>
      {omitIcon ? null : <IdsAppLauncherProductIcon />}
      <IdsAppLauncherProductLabel />
    </>
  );

  return (
    <div
      {...rest}
      className={cx(s.labelCluster, omitIcon && s.labelClusterNoIcon, className)}
      data-ids="ids-app-launcher-label-cluster"
      data-slot="LabelCluster"
    >
      {content}
    </div>
  );
}
markSlot(IdsAppLauncherLabelCluster, "label-cluster");
IdsAppLauncherLabelCluster.displayName = "IdsAppLauncherLabelCluster";

/* -------------------------------------------------------------------------- */
/* ProductTile                                                                */
/* -------------------------------------------------------------------------- */

export interface IdsAppLauncherProductTileProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  id?: string;
  name?: string;
  icon?: ReactNode | null;
  iconSlug?: string;
  href?: string;
  onSelect?: () => void;
  tileDivider?: IdsAppLauncherTileDivider;
  /** Demo/testing visual override — does not block interaction. */
  dataState?: IdsAppLauncherTileDataState;
  /** @deprecated Alias of `dataState`. */
  demoState?: IdsAppLauncherTileDataState;
  twoProductLayout?: boolean;
}

export function IdsAppLauncherProductTile({
  children,
  id,
  name = "",
  icon,
  iconSlug,
  href,
  onSelect,
  tileDivider = "none",
  dataState,
  demoState,
  twoProductLayout = false,
  className,
  onClick,
  ...rest
}: IdsAppLauncherProductTileProps) {
  const root = useAppLauncher("IdsAppLauncherProductTile", true);
  const resolvedState = dataState ?? demoState;
  const omitIcon = icon === null || resolvedState === "no-icon";
  const resolvedId = id && id.trim() ? id : name || "product";
  const showRail = tileDivider !== "none";
  const twoProduct = twoProductLayout || showRail;
  const selected = root?.selectedProductId === resolvedId;
  const { chrome, pointerProps } = useChromeState(resolvedState);

  const tileCtx = useMemo<ProductTileContextValue>(
    () => ({
      name,
      id: resolvedId,
      icon: omitIcon ? null : icon,
      iconSlug: resolveProductIconSlug(iconSlug),
      omitIcon,
      twoProductLayout: twoProduct,
      tileDivider,
    }),
    [name, resolvedId, icon, iconSlug, omitIcon, twoProduct, tileDivider],
  );

  const { cluster, rail, other } = partitionTileChildren(children);
  const hasProjected = cluster != null || rail != null || other.length > 0;

  const inner = hasProjected ? (
    <>
      {cluster ?? <IdsAppLauncherLabelCluster />}
      {other}
      {rail ?? (showRail ? <IdsAppLauncherTileDividerRail variant={tileDivider === "solid" ? "solid" : "dotted"} /> : null)}
    </>
  ) : (
    <>
      <IdsAppLauncherLabelCluster />
      {showRail ? (
        <IdsAppLauncherTileDividerRail variant={tileDivider === "solid" ? "solid" : "dotted"} />
      ) : null}
    </>
  );

  const handleActivate = (event: MouseEvent<HTMLElement>) => {
    onClick?.(event as MouseEvent<HTMLButtonElement>);
    if (event.defaultPrevented) return;
    root?.setSelectedProductId(resolvedId);
    onSelect?.();
    root?.onProductSelect?.({ id: resolvedId, name });
  };

  const tileDataState = resolveTileDataState({
    chrome,
    selected,
    forced: resolvedState,
  });

  const shared = {
    className: cx(
      s.productTile,
      twoProduct && s.productTileTwoProduct,
      className,
    ),
    "data-ids": "ids-app-launcher-product-tile",
    "data-slot": "ProductTile",
    "data-state": tileDataState,
    onClick: handleActivate,
    onPointerEnter: (event: PointerEvent<HTMLElement>) => {
      pointerProps.onPointerEnter();
      (rest as HTMLAttributes<HTMLElement>).onPointerEnter?.(event);
    },
    onPointerLeave: (event: PointerEvent<HTMLElement>) => {
      pointerProps.onPointerLeave();
      (rest as HTMLAttributes<HTMLElement>).onPointerLeave?.(event);
    },
    onPointerDown: (event: PointerEvent<HTMLElement>) => {
      pointerProps.onPointerDown(event);
      (rest as HTMLAttributes<HTMLElement>).onPointerDown?.(event);
    },
    onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
      pointerProps.onKeyDown(event);
      (rest as HTMLAttributes<HTMLElement>).onKeyDown?.(event);
    },
    onKeyUp: (event: KeyboardEvent<HTMLElement>) => {
      pointerProps.onKeyUp(event);
      (rest as HTMLAttributes<HTMLElement>).onKeyUp?.(event);
    },
    onBlur: (event: React.FocusEvent<HTMLElement>) => {
      pointerProps.onBlur();
      (rest as HTMLAttributes<HTMLElement>).onBlur?.(event);
    },
  };

  return (
    <ProductTileContext.Provider value={tileCtx}>
      {href ? (
        <a
          {...(rest as HTMLAttributes<HTMLAnchorElement>)}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          {...shared}
        >
          {inner}
        </a>
      ) : (
        <button
          {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
          type="button"
          {...shared}
        >
          {inner}
        </button>
      )}
    </ProductTileContext.Provider>
  );
}
markSlot(IdsAppLauncherProductTile, "product-tile");
IdsAppLauncherProductTile.displayName = "IdsAppLauncherProductTile";

/* -------------------------------------------------------------------------- */
/* Product row / region                                                       */
/* -------------------------------------------------------------------------- */

export interface IdsAppLauncherProductRowProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  /** When true, center a single odd tile in a 2-column row. */
  single?: boolean;
}

export function IdsAppLauncherProductRow({
  children,
  className,
  single = false,
  ...rest
}: IdsAppLauncherProductRowProps) {
  return (
    <div
      {...rest}
      className={cx(s.productRow, single && s.productRowSingle, className)}
      data-ids="ids-app-launcher-product-row"
      data-slot="ProductRow"
    >
      {children}
    </div>
  );
}
markSlot(IdsAppLauncherProductRow, "product-row");
IdsAppLauncherProductRow.displayName = "IdsAppLauncherProductRow";

function emitRowCells(
  row: IdsAppLauncherProduct[],
  rowIndex: number,
  useTwoProductInternalRail: boolean,
  productCount: number,
): ReactNode[] {
  const nodes: ReactNode[] = [];
  row.forEach((product, cellIndex) => {
    const key = productKey(product, `r${rowIndex}-c${cellIndex}`);
    const showColumnDivider = cellIndex > 0 && productCount >= 3 && !useTwoProductInternalRail;
    if (showColumnDivider) {
      nodes.push(<IdsAppLauncherColumnDivider key={`${key}-divider`} variant="dotted" />);
    }
    nodes.push(
      <IdsAppLauncherProductTile
        key={key}
        id={key}
        name={product.name}
        icon={product.icon}
        iconSlug={product.iconSlug}
        href={product.href}
        onSelect={product.onSelect}
        twoProductLayout={useTwoProductInternalRail}
        tileDivider={
          useTwoProductInternalRail && cellIndex < row.length - 1 ? "dotted" : "none"
        }
      />,
    );
  });
  return nodes;
}

export interface IdsAppLauncherProductRowGroupProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  row?: IdsAppLauncherProduct[];
  rowIndex?: number;
}

export function IdsAppLauncherProductRowGroup({
  children,
  className,
  row,
  rowIndex = 0,
  ...rest
}: IdsAppLauncherProductRowGroupProps) {
  const root = useAppLauncher("IdsAppLauncherProductRowGroup", true);
  const list = root?.list ?? [];
  const useRail = root?.useTwoProductInternalRail ?? false;
  const columns = root?.columns ?? 2;

  const content =
    children ??
    (row ? (
      <>
        {rowIndex > 0 ? <IdsAppLauncherRowDivider /> : null}
        <IdsAppLauncherProductRow single={row.length === 1 && columns === 2}>
          {emitRowCells(row, rowIndex, useRail, list.length)}
        </IdsAppLauncherProductRow>
      </>
    ) : null);

  return (
    <div
      {...rest}
      className={cx(s.productRowGroup, className)}
      data-ids="ids-app-launcher-product-row-group"
      data-slot="ProductRowGroup"
    >
      {content}
    </div>
  );
}
markSlot(IdsAppLauncherProductRowGroup, "product-row-group");
IdsAppLauncherProductRowGroup.displayName = "IdsAppLauncherProductRowGroup";

export interface IdsAppLauncherProductRegionProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export function IdsAppLauncherProductRegion({
  children,
  className,
  ...rest
}: IdsAppLauncherProductRegionProps) {
  const root = useAppLauncher("IdsAppLauncherProductRegion", true);
  const rows = root?.rows ?? [];

  const content =
    children ??
    rows.map((row, rowIndex) => (
      <IdsAppLauncherProductRowGroup
        key={rowIndex}
        row={row}
        rowIndex={rowIndex}
      />
    ));

  if (children == null && rows.length === 0) return null;

  return (
    <div
      {...rest}
      className={cx(s.productRegion, className)}
      data-ids="ids-app-launcher-product-region"
      data-slot="ProductRegion"
    >
      {content}
    </div>
  );
}
markSlot(IdsAppLauncherProductRegion, "product-region");
IdsAppLauncherProductRegion.displayName = "IdsAppLauncherProductRegion";

/* -------------------------------------------------------------------------- */
/* Options                                                                    */
/* -------------------------------------------------------------------------- */

export interface IdsAppLauncherOptionRowProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onSelect"> {
  children?: ReactNode;
  option?: IdsAppLauncherOption;
  label?: string;
  optionId?: string;
  dataState?: IdsAppLauncherOptionDataState;
}

export function IdsAppLauncherOptionRow({
  children,
  option,
  label,
  optionId,
  dataState,
  className,
  onClick,
  onPointerEnter,
  onPointerLeave,
  onPointerDown,
  onKeyDown,
  onKeyUp,
  onBlur,
  ...rest
}: IdsAppLauncherOptionRowProps) {
  const root = useAppLauncher("IdsAppLauncherOptionRow", true);
  const resolvedLabel = label ?? option?.label ?? "";
  const resolvedId =
    optionId ??
    (option?.id && option.id.trim() ? option.id : resolvedLabel || "option");
  const selected = root?.selectedOptionId === resolvedId;
  const { chrome, pointerProps } = useChromeState(dataState);
  const visual: IdsAppLauncherOptionDataState | undefined =
    chrome ??
    (selected ? "press" : dataState && dataState !== "default" ? dataState : undefined);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    root?.setSelectedOptionId(resolvedId);
    option?.onSelect?.();
    root?.onOptionSelect?.({ id: resolvedId, label: resolvedLabel });
  };

  return (
    <button
      {...rest}
      type="button"
      className={cx(s.optionRow, className)}
      data-ids="ids-app-launcher-option-row"
      data-slot="OptionRow"
      data-state={visual}
      onClick={handleClick}
      onPointerEnter={(event) => {
        pointerProps.onPointerEnter();
        onPointerEnter?.(event);
      }}
      onPointerLeave={(event) => {
        pointerProps.onPointerLeave();
        onPointerLeave?.(event);
      }}
      onPointerDown={(event) => {
        pointerProps.onPointerDown(event);
        onPointerDown?.(event);
      }}
      onKeyDown={(event) => {
        pointerProps.onKeyDown(event);
        onKeyDown?.(event);
      }}
      onKeyUp={(event) => {
        pointerProps.onKeyUp(event);
        onKeyUp?.(event);
      }}
      onBlur={(event) => {
        pointerProps.onBlur();
        onBlur?.(event);
      }}
    >
      {children ?? <span className={s.optionLabel}>{resolvedLabel}</span>}
    </button>
  );
}
markSlot(IdsAppLauncherOptionRow, "option-row");
IdsAppLauncherOptionRow.displayName = "IdsAppLauncherOptionRow";

export interface IdsAppLauncherFooterActionProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  label?: string;
}

export function IdsAppLauncherFooterAction({
  children,
  label,
  className,
  onClick,
  ...rest
}: IdsAppLauncherFooterActionProps) {
  const root = useAppLauncher("IdsAppLauncherFooterAction", true);
  const resolvedLabel = label ?? root?.footerAction?.label;
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    root?.footerAction?.onClick();
  };

  if (children == null && !resolvedLabel && !root?.footerAction) return null;

  return (
    <div className={s.optionsFooter} data-ids="ids-app-launcher-options-footer">
      <button
        {...rest}
        type="button"
        className={cx(s.footerAction, className)}
        data-ids="ids-app-launcher-footer-action"
        data-slot="FooterAction"
        onClick={handleClick}
      >
        {children ?? resolvedLabel}
      </button>
    </div>
  );
}
markSlot(IdsAppLauncherFooterAction, "footer-action");
IdsAppLauncherFooterAction.displayName = "IdsAppLauncherFooterAction";

export interface IdsAppLauncherOptionsRegionProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export function IdsAppLauncherOptionsRegion({
  children,
  className,
  ...rest
}: IdsAppLauncherOptionsRegionProps) {
  const root = useAppLauncher("IdsAppLauncherOptionsRegion", true);
  const options = root?.options ?? [];
  const footer = root?.footerAction;
  const showSeparator = (root?.list.length ?? 0) > 0;

  if (children == null && options.length === 0 && !footer) return null;

  const content = children ?? (
    <>
      {options.length > 0 ? (
        <ul className={s.optionsList}>
          {options.map((opt, index) => (
            <li key={opt.id ?? index}>
              <IdsAppLauncherOptionRow option={opt} optionId={opt.id ?? `option-${index}`} />
            </li>
          ))}
        </ul>
      ) : null}
      {footer ? <IdsAppLauncherFooterAction /> : null}
    </>
  );

  return (
    <div
      {...rest}
      className={cx(s.optionsRegion, showSeparator && s.optionsSeparator, className)}
      data-ids="ids-app-launcher-options-region"
      data-slot="OptionsRegion"
    >
      {content}
    </div>
  );
}
markSlot(IdsAppLauncherOptionsRegion, "options-region");
IdsAppLauncherOptionsRegion.displayName = "IdsAppLauncherOptionsRegion";

/* -------------------------------------------------------------------------- */
/* Trigger                                                                    */
/* -------------------------------------------------------------------------- */

export interface IdsAppLauncherTriggerProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
}

export const IdsAppLauncherTrigger = forwardRef<HTMLButtonElement, IdsAppLauncherTriggerProps>(
  function IdsAppLauncherTrigger(
    { children, className, onClick, onKeyDown, ...rest },
    forwardedRef,
  ) {
    const root = useAppLauncher("IdsAppLauncherTrigger");
    if (!root) return null;

    const assignRef = (el: HTMLButtonElement | null) => {
      root.triggerRef.current = el;
      if (typeof forwardedRef === "function") forwardedRef(el);
      else if (forwardedRef) forwardedRef.current = el;
    };

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      if (event.defaultPrevented) return;
      root.setOpen(!root.open);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented || !root.open) return;
      if (event.key === "Tab" && !event.shiftKey) {
        const first = root.popupRef.current?.querySelector<HTMLElement>(
          "button, a[href], [tabindex]:not([tabindex='-1'])",
        );
        if (first) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    return (
      <button
        {...rest}
        ref={assignRef}
        type="button"
        className={cx(
          s.trigger,
          root.triggerVariant === "masthead" && s.triggerMasthead,
          className,
        )}
        aria-label={rest["aria-label"] ?? "App launcher"}
        aria-expanded={root.open}
        aria-haspopup="dialog"
        aria-controls={root.open ? root.popupId : undefined}
        data-ids="ids-app-launcher-trigger"
        data-slot="AppLauncherTrigger"
        data-state={root.open ? "open" : undefined}
        data-variant={root.triggerVariant}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      >
        {children ?? (
          <IdsIcon
            shape={TRIGGER_ICON}
            size={16}
            color="currentColor"
            className={s.triggerIcon}
          />
        )}
      </button>
    );
  },
);
markSlot(IdsAppLauncherTrigger, "trigger");
IdsAppLauncherTrigger.displayName = "IdsAppLauncherTrigger";

/* -------------------------------------------------------------------------- */
/* Surface                                                                    */
/* -------------------------------------------------------------------------- */

function DefaultSurfaceChildren(): ReactElement {
  const root = useAppLauncher("DefaultSurfaceChildren", true);
  return (
    <>
      {(root?.list.length ?? 0) > 0 ? <IdsAppLauncherProductRegion /> : null}
      {root?.showOptions ? <IdsAppLauncherOptionsRegion /> : null}
    </>
  );
}

export interface IdsAppLauncherSurfaceProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export function IdsAppLauncherSurface({
  children,
  className,
  ...rest
}: IdsAppLauncherSurfaceProps) {
  const root = useAppLauncher("IdsAppLauncherSurface");
  if (!root) return null;
  if (!root.panelOnly && !root.open) return null;

  const surface = (
    <div
      {...rest}
      className={cx(
        s.surface,
        root.useTwoProductInternalRail && s.surfaceTwoProduct,
        root.useSingleProductWidth && s.surfaceSingle,
        className,
      )}
      role={root.panelOnly ? undefined : "dialog"}
      id={root.panelOnly ? undefined : root.popupId}
      aria-label={root.panelOnly ? undefined : "App launcher"}
      data-ids="ids-app-launcher-surface"
      data-slot="AppLauncherSurface"
    >
      {children ?? <DefaultSurfaceChildren />}
    </div>
  );

  if (root.panelOnly) return surface;

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      ref={root.popupRef}
      className={s.popup}
      style={root.popupStyle}
      data-ids="ids-app-launcher-popup"
    >
      {surface}
    </div>,
    document.body,
  );
}
markSlot(IdsAppLauncherSurface, "surface");
IdsAppLauncherSurface.displayName = "IdsAppLauncherSurface";

/* -------------------------------------------------------------------------- */
/* Root — AppLauncher (not AppLauncherRoot)                                   */
/* -------------------------------------------------------------------------- */

function DefaultAppLauncherAnatomy({ panelOnly }: { panelOnly: boolean }): ReactElement {
  return (
    <>
      {panelOnly ? null : <IdsAppLauncherTrigger />}
      <IdsAppLauncherSurface />
    </>
  );
}

export function IdsAppLauncher({
  children,
  programme: programmeProp,
  products,
  apps,
  options,
  footerAction,
  columns: columnsProp,
  triggerVariant: triggerVariantProp,
  sideOffset,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  onProductSelect,
  onOptionSelect,
  panelOnly = false,
  className,
  style,
  id,
}: IdsAppLauncherProps) {
  const programme = resolveProgramme(programmeProp);
  const triggerVariant = resolveTriggerVariant(triggerVariantProp);
  const columns = resolveColumns(columnsProp);
  const list = products ?? apps ?? [];
  const optionList = options ?? [];
  const showOptions = optionList.length > 0 || footerAction != null;
  const useTwoProductInternalRail = list.length === 2 && !showOptions;
  const useSingleProductWidth = list.length === 1 && !showOptions;
  const rows = chunkRows(list, columns);
  const reactId = useId();
  const popupId = id ? `${id}-surface` : `ids-app-launcher-${reactId}`;

  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  const [open, setOpen] = useControllableState({
    value: panelOnly ? true : openProp,
    defaultValue: panelOnly ? true : defaultOpen,
    onChange: onOpenChange,
  });

  const positionerSideOffset =
    sideOffset ?? (triggerVariant === "masthead" ? 1 : 8);

  const position = useAnchorPosition({
    open: open && !panelOnly,
    anchorRef: triggerRef,
    floatingRef: popupRef,
    side: "bottom",
    align: "end",
    sideOffset: positionerSideOffset,
    collisionPadding: 8,
    collisionAvoidance: { side: "flip", align: "shift" },
  });

  useEffect(() => {
    if (!open || panelOnly) return;
    const onPointerDown = (event: globalThis.PointerEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (triggerRef.current?.contains(target)) return;
      if (popupRef.current?.contains(target)) return;
      setOpen(false);
    };
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, panelOnly, setOpen]);

  const ctx = useMemo<IdsAppLauncherContextValue>(
    () => ({
      open,
      setOpen,
      panelOnly,
      triggerVariant,
      popupId,
      triggerRef,
      popupRef,
      popupStyle: position.style,
      list,
      rows,
      columns,
      options: optionList,
      footerAction,
      showOptions,
      useTwoProductInternalRail,
      useSingleProductWidth,
      onProductSelect,
      onOptionSelect,
      selectedProductId,
      selectedOptionId,
      setSelectedProductId,
      setSelectedOptionId,
    }),
    [
      open,
      setOpen,
      panelOnly,
      triggerVariant,
      popupId,
      position.style,
      list,
      rows,
      columns,
      optionList,
      footerAction,
      showOptions,
      useTwoProductInternalRail,
      useSingleProductWidth,
      onProductSelect,
      onOptionSelect,
      selectedProductId,
      selectedOptionId,
    ],
  );

  const compound = hasCompoundRootSlots(children);
  const { trigger, surface, other } = partitionRootChildren(children);

  const tree = compound ? (
    <>
      {panelOnly ? null : trigger ?? <IdsAppLauncherTrigger />}
      {surface ?? <IdsAppLauncherSurface />}
      {other}
    </>
  ) : (
    <DefaultAppLauncherAnatomy panelOnly={panelOnly} />
  );

  return (
    <IdsAppLauncherContext.Provider value={ctx}>
      <span
        className={cx(s.root, className)}
        style={style}
        id={id}
        data-ids="ids-app-launcher"
        data-slot="AppLauncher"
        data-programme={programme}
        data-panel-only={panelOnly ? "true" : undefined}
      >
        {tree}
      </span>
    </IdsAppLauncherContext.Provider>
  );
}

IdsAppLauncher.displayName = "AppLauncher";

/** Compound namespace matching spec Anatomy (root = AppLauncher). */
export const IdsAppLauncherCompound = Object.assign(IdsAppLauncher, {
  Trigger: IdsAppLauncherTrigger,
  Surface: IdsAppLauncherSurface,
  ProductRegion: IdsAppLauncherProductRegion,
  ProductRowGroup: IdsAppLauncherProductRowGroup,
  RowDivider: IdsAppLauncherRowDivider,
  ProductRow: IdsAppLauncherProductRow,
  ColumnDivider: IdsAppLauncherColumnDivider,
  ProductTile: IdsAppLauncherProductTile,
  LabelCluster: IdsAppLauncherLabelCluster,
  TileDividerRail: IdsAppLauncherTileDividerRail,
  ProductIcon: IdsAppLauncherProductIcon,
  ProductLabel: IdsAppLauncherProductLabel,
  OptionsRegion: IdsAppLauncherOptionsRegion,
  OptionRow: IdsAppLauncherOptionRow,
  FooterAction: IdsAppLauncherFooterAction,
});

/** Anatomy alias — root is AppLauncher, not AppLauncherRoot. */
export const AppLauncher = IdsAppLauncherCompound;

export default IdsAppLauncherCompound;

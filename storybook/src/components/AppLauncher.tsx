import { Popover } from "@base-ui-components/react/popover";
import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from "react";
import { Icon } from "./Icon";
import styles from "./AppLauncher.module.css";

export interface AppLauncherProduct {
  id?: string;
  name: string;
  /** Omit to use default `shield-encrypt-alt` (Figma). Pass `null` for no-icon tile (`13231:109521`). */
  icon?: ReactNode | null;
  href?: string;
  onSelect?: () => void;
}

export interface AppLauncherOption {
  id?: string;
  label: string;
  /** Optional leading logo — `16px` wide, height auto, vertically centered with the label. */
  icon?: ReactNode;
  onSelect?: () => void;
}

export type AppLauncherDividerVariant = "solid" | "dotted";

export interface AppLauncherColumnDividerProps {
  variant?: AppLauncherDividerVariant;
  programme?: "ids" | "synapse";
}

export interface AppLauncherRowDividerProps {
  programme?: "ids" | "synapse";
}

/**
 * Vertical separator between product tiles in the same row.
 * Separate from the tile so hover/press fill does not cover the divider (IDS + Synapse).
 */
export function AppLauncherColumnDivider({
  variant = "dotted",
  programme = "ids",
}: AppLauncherColumnDividerProps) {
  return (
    <div
      className={
        variant === "solid" ? styles.columnDividerSolid : styles.columnDivider
      }
      aria-hidden="true"
    />
  );
}

/** Horizontal separator between product rows (262px stroke, 16px inset left/right). */
export function AppLauncherRowDivider({ programme = "ids" }: AppLauncherRowDividerProps) {
  return (
    <div
      className={styles.rowDivider}
      aria-hidden="true"
    />
  );
}

export type AppLauncherTileDivider = "solid" | "dotted" | "none";

export interface AppLauncherProductTileProps extends AppLauncherProduct {
  tileClassName?: string;
  /** 2-product internal dotted rail (`13231:109518`, 110px / 7px inset) on leading tile in each row. */
  tileDivider?: AppLauncherTileDivider;
  /** Demo/spec matrix only — maps to `data-state` on the tile control. */
  demoState?: "hover" | "press" | "focus";
}

function TileDividerRail({ variant }: { variant: AppLauncherTileDivider }) {
  if (variant === "none") return null;
  return (
    <span
      className={[
        styles.tileDivider,
        variant === "solid" ? styles.tileDividerSolid : styles.tileDividerDotted,
      ].join(" ")}
      aria-hidden="true"
    />
  );
}

export function AppLauncherProductTile({
  name,
  icon,
  href,
  onSelect,
  tileClassName,
  tileDivider = "none",
  demoState,
}: AppLauncherProductTileProps) {
  const graphic =
    icon === undefined ? (
      <Icon
        shapeName="shield-encrypt-alt"
        className={styles.defaultProductIcon}
        variant="inline"
      />
    ) : (
      icon
    );

  const inner = (
    <div className={[styles.labelStack, graphic ? "" : styles.labelStackNoIcon].filter(Boolean).join(" ")}>
      {graphic ? <div className={styles.iconSlot}>{graphic}</div> : null}
      <span className={styles.appName}>{name}</span>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        className={[styles.appTile, tileClassName].filter(Boolean).join(" ")}
        target="_blank"
        rel="noopener noreferrer"
      >
        {inner}
        <TileDividerRail variant={tileDivider} />
      </a>
    );
  }

  return (
    <button
      type="button"
      className={[styles.appTile, tileClassName].filter(Boolean).join(" ")}
      onClick={onSelect}
      {...(demoState ? { "data-state": demoState } : {})}
    >
      {inner}
      <TileDividerRail variant={tileDivider} />
    </button>
  );
}

export interface AppLauncherOptionsListProps {
  options: AppLauncherOption[];
  footerAction?: { label: string; onClick: () => void };
  showTopSeparator?: boolean;
}

/** Option label that exposes the full text via a native tooltip when the
 *  ellipsis cuts it off. */
function OptionRowLabel({ label }: { label: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [truncated, setTruncated] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (el) setTruncated(el.scrollWidth > el.clientWidth + 1);
  }, [label]);
  return (
    <span ref={ref} className={styles.optionLabel} title={truncated ? label : undefined}>
      {label}
    </span>
  );
}

/** Options list block below product grid (Figma `Dropdown-SingleSelect-Elements-Menu` pattern). */
export function AppLauncherOptionsList({
  options,
  footerAction,
  showTopSeparator = false,
}: AppLauncherOptionsListProps) {
  if (options.length === 0 && !footerAction) return null;

  return (
    <div
      className={[
        styles.optionsRegion,
        showTopSeparator ? styles.optionsRegionWithSeparator : "",
      ]
        .filter(Boolean)
        .join(" ")}
      data-focus-section="options"
    >
      {options.length > 0 ? (
        <ul className={styles.optionsList}>
          {options.map((opt, index) => (
            <li key={opt.id ?? index}>
              <button
                type="button"
                className={styles.optionItem}
                onClick={opt.onSelect}
              >
                {opt.icon ? (
                  <span className={styles.optionIcon} aria-hidden="true">
                    {opt.icon}
                  </span>
                ) : null}
                <OptionRowLabel label={opt.label} />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      {footerAction ? (
        <div className={styles.optionsFooter}>
          <button
            type="button"
            className={styles.footerAction}
            onClick={footerAction.onClick}
          >
            {footerAction.label}
          </button>
        </div>
      ) : null}
    </div>
  );
}

export interface AppLauncherProps {
  /** `synapse` → label-cluster hover/press + inset focus ring per Synapse Figma. */
  programme?: "ids" | "synapse";
  /** Product tiles (2-column rows with column dividers per Figma). */
  products?: AppLauncherProduct[];
  /** @deprecated Use `products` */
  apps?: AppLauncherProduct[];
  options?: AppLauncherOption[];
  footerAction?: { label: string; onClick: () => void };
  /** Grid columns for products; Figma uses 2. */
  columns?: number;
  /** Trigger visual mode. Use `masthead` for white icon on masthead bar. */
  triggerVariant?: "default" | "masthead";
  /**
   * Popover vertical offset from trigger (px).
   * Default is `8` for the default trigger; `masthead` defaults to `1` so the popup's top border sits right below the masthead's 1px bottom border.
   */
  sideOffset?: number;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /**
   * Render launcher surface only (no Base UI Popover).
   * Use in spec/layout matrix stories to avoid Popover hook issues in Storybook.
   */
  panelOnly?: boolean;
}

interface AppLauncherSurfaceProps {
  programme: "ids" | "synapse";
  list: AppLauncherProduct[];
  rows: AppLauncherProduct[][];
  columns: number;
  options?: AppLauncherOption[];
  footerAction?: { label: string; onClick: () => void };
  showOptions: boolean;
  isSynapse: boolean;
  useTwoProductLayout: boolean;
  useSingleProductWidth: boolean;
  useTwoProductInternalRail: boolean;
  columnDividerVariant: AppLauncherDividerVariant;
}

function AppLauncherSurface({
  programme,
  list,
  rows,
  columns,
  options,
  footerAction,
  showOptions,
  isSynapse,
  useTwoProductLayout,
  useSingleProductWidth,
  useTwoProductInternalRail,
  columnDividerVariant,
}: AppLauncherSurfaceProps) {
  return (
    <div
      className={[
        styles.launcherSurface,
        isSynapse ? styles.programmeSynapse : "",
        useTwoProductLayout ? styles.launcherSurfaceTwoProduct : "",
        useSingleProductWidth ? styles.launcherSurfaceSingleProduct : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {list.length > 0 ? (
        <div className={styles.productRegion} data-focus-section="products">
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className={styles.productRowGroup}>
              {rowIndex > 0 ? (
                <AppLauncherRowDivider programme={programme} />
              ) : null}
              <div
                className={[
                  styles.productRow,
                  row.length === 1 && columns === 2 ? styles.productRowSingle : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {row.flatMap((product, cellIndex) => {
                  const key = product.id ?? `${rowIndex}-${cellIndex}`;
                  const showColumnDivider =
                    cellIndex > 0 && !useTwoProductInternalRail;
                  const divider = showColumnDivider ? (
                    <AppLauncherColumnDivider
                      key={`${key}-divider`}
                      variant={columnDividerVariant}
                      programme={programme}
                    />
                  ) : null;
                  const tile = (
                    <AppLauncherProductTile
                      key={key}
                      {...product}
                      tileClassName={[
                        isSynapse ? styles.programmeSynapseTile : "",
                        useTwoProductInternalRail ? styles.appTileTwoProduct : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      tileDivider={
                        useTwoProductInternalRail && cellIndex < row.length - 1
                          ? "dotted"
                          : "none"
                      }
                    />
                  );
                  return divider ? [divider, tile] : [tile];
                })}
              </div>
            </div>
          ))}
        </div>
      ) : null}
      {showOptions ? (
        <AppLauncherOptionsList
          options={options ?? []}
          footerAction={footerAction}
          showTopSeparator={list.length > 0}
        />
      ) : null}
    </div>
  );
}

function chunkRows<T>(items: T[], columns: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += columns) {
    rows.push(items.slice(i, i + columns));
  }
  return rows;
}

/* Long-name reflow (see design-spec "Long-label reflow"): a text-only tile wraps
   to 3 lines, an icon tile to 1; a longer name promotes the tile to full-width
   (its own row). At most APP_LAUNCHER_MAX_PRODUCT_ROWS product rows show; the
   overflow becomes options. */
const APP_LAUNCHER_LABEL_LINE_HEIGHT = 20;
const APP_LAUNCHER_MAX_PRODUCT_ROWS = 2;

function productReflowKey(product: AppLauncherProduct, index: number): string {
  return product.id && product.id.trim() ? product.id : `idx-${index}`;
}

function packProductRows(
  list: AppLauncherProduct[],
  fullWidthKeys: Set<string>,
  columns: number,
): { rows: AppLauncherProduct[][]; overflow: AppLauncherProduct[] } {
  const cols = Math.max(1, columns);
  const rows: AppLauncherProduct[][] = [];
  let current: AppLauncherProduct[] = [];
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

function productToOption(product: AppLauncherProduct, index: number): AppLauncherOption {
  return {
    id: product.id && product.id.trim() ? product.id : `overflow-${index}`,
    label: product.name,
    icon: product.icon ?? undefined,
    onSelect: product.onSelect,
  };
}

export function AppLauncher({
  programme = "ids",
  products,
  apps,
  options,
  footerAction,
  columns = 2,
  triggerVariant = "default",
  sideOffset,
  defaultOpen = false,
  open,
  onOpenChange,
  panelOnly = false,
}: AppLauncherProps) {
  const isSynapse = programme === "synapse";
  const list = products ?? apps ?? [];
  const optionList = options ?? [];

  // Measure each name at the 111px tile width to promote overflowing labels to
  // full-width tiles; overflow past the row cap becomes options.
  const labelMeasureRefs = useRef<Map<string, HTMLSpanElement>>(new Map());
  const [fullWidthKeys, setFullWidthKeys] = useState<Set<string>>(() => new Set());
  useEffect(() => {
    const next = new Set<string>();
    list.forEach((product, index) => {
      const el = labelMeasureRefs.current.get(productReflowKey(product, index));
      if (!el) return;
      const lines = Math.round(el.scrollHeight / APP_LAUNCHER_LABEL_LINE_HEIGHT);
      const budget = product.icon === null ? 3 : 1;
      if (lines > budget) next.add(productReflowKey(product, index));
    });
    setFullWidthKeys((prev) =>
      prev.size === next.size && [...next].every((k) => prev.has(k)) ? prev : next,
    );
  }, [list]);

  const { rows, overflow: overflowProducts } = packProductRows(
    list,
    fullWidthKeys,
    Math.max(1, columns),
  );
  const mergedOptions = [...overflowProducts.map(productToOption), ...optionList];

  const showOptions = mergedOptions.length > 0 || footerAction != null;
  const useTwoProductLayout = list.length === 2 && !showOptions;
  const useSingleProductWidth = list.length === 1 && !showOptions;
  const useTwoProductInternalRail = useTwoProductLayout;
  const columnDividerVariant: AppLauncherDividerVariant = "dotted";
  const positionerSideOffset =
    sideOffset ?? (triggerVariant === "masthead" ? 1 : 8);

  const controlledOpen = open !== undefined;

  const triggerRef = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isOpen = controlledOpen ? Boolean(open) : uncontrolledOpen;
  const skipInitialFocusRef = useRef(defaultOpen);

  const handleOpenChange = (next: boolean) => {
    if (!controlledOpen) setUncontrolledOpen(next);
    onOpenChange?.(next);
  };

  // Match the dropdown: on open, Base UI Popover moves focus into the popup — we
  // don't want that. Keep focus on the trigger so the launcher opens quietly; the
  // user Tabs into the panel and Arrow keys navigate the tiles/options. Double rAF
  // lands after Base UI's own focus. Skip when `defaultOpen` (no false focus ring).
  useEffect(() => {
    if (!isOpen) return;
    if (skipInitialFocusRef.current) {
      skipInitialFocusRef.current = false;
      return;
    }
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => triggerRef.current?.focus());
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [isOpen]);

  // Cross-section Arrow-key navigation inside the panel (like the dropdown popup):
  // products are a `columns`-wide grid (Left/Right within a row, Up/Down across
  // rows); the options list is vertical; at the grid/list boundary focus jumps
  // between the two sections.
  const handlePopupKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (
      event.key !== "ArrowUp" &&
      event.key !== "ArrowDown" &&
      event.key !== "ArrowLeft" &&
      event.key !== "ArrowRight"
    ) {
      return;
    }
    const popup = popupRef.current;
    if (!popup) return;
    const active = popup.ownerDocument.activeElement as HTMLElement | null;
    if (!active || !popup.contains(active)) return;

    const focusableSelector =
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const getFocusables = (root: Element | null) =>
      root ? Array.from(root.querySelectorAll<HTMLElement>(focusableSelector)) : [];

    const productsSection = popup.querySelector<HTMLElement>('[data-focus-section="products"]');
    const optionsSection = popup.querySelector<HTMLElement>('[data-focus-section="options"]');
    const horizontal = event.key === "ArrowLeft" || event.key === "ArrowRight";
    const dir = event.key === "ArrowDown" || event.key === "ArrowRight" ? 1 : -1;
    const cols = Math.max(1, columns);
    const focus = (el?: HTMLElement) => {
      if (!el) return;
      event.preventDefault();
      event.stopPropagation();
      el.focus();
    };

    // Products grid.
    if (productsSection?.contains(active)) {
      const tiles = getFocusables(productsSection);
      const idx = tiles.indexOf(active);
      if (idx === -1) return;
      if (horizontal) {
        const nextIdx = idx + dir; // stay within the same row
        if (
          nextIdx >= 0 &&
          nextIdx < tiles.length &&
          Math.floor(nextIdx / cols) === Math.floor(idx / cols)
        ) {
          focus(tiles[nextIdx]);
        }
        return;
      }
      const nextIdx = idx + dir * cols; // move one row up/down
      if (nextIdx >= 0 && nextIdx < tiles.length) {
        focus(tiles[nextIdx]);
        return;
      }
      // Past the last grid row → first option (Down). Above the first row → stay.
      if (dir > 0) focus(getFocusables(optionsSection)[0]);
      return;
    }

    // Options list (vertical only).
    if (optionsSection?.contains(active)) {
      if (horizontal) return;
      const opts = getFocusables(optionsSection);
      const idx = opts.indexOf(active);
      if (idx === -1) return;
      const nextIdx = idx + dir;
      if (nextIdx >= 0 && nextIdx < opts.length) {
        focus(opts[nextIdx]);
        return;
      }
      // Above the first option → last product tile.
      if (dir < 0) {
        const tiles = getFocusables(productsSection);
        focus(tiles[tiles.length - 1]);
      }
    }
  };

  const surfaceProps: AppLauncherSurfaceProps = {
    programme,
    list,
    rows,
    columns,
    options: mergedOptions,
    footerAction,
    showOptions,
    isSynapse,
    useTwoProductLayout,
    useSingleProductWidth,
    useTwoProductInternalRail,
    columnDividerVariant,
  };

  // Off-screen label measurement for the long-name reflow (always rendered).
  const measureNodes = (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        left: "-9999px",
        top: 0,
        width: "111px",
        pointerEvents: "none",
        fontFamily: 'var(--typography-font-style-primary, "Roboto", sans-serif)',
      }}
    >
      {list.map((product, index) => {
        const key = productReflowKey(product, index);
        return (
          <span
            key={key}
            ref={(el) => {
              if (el) labelMeasureRefs.current.set(key, el);
              else labelMeasureRefs.current.delete(key);
            }}
            style={{
              display: "block",
              fontSize: "var(--font-size-body-2)",
              lineHeight: "var(--font-line-height-line-height-20)",
              fontWeight: 400,
              whiteSpace: "normal",
              overflowWrap: "break-word",
              wordBreak: "break-word",
              textAlign: "center",
            }}
          >
            {product.name}
          </span>
        );
      })}
    </div>
  );

  if (panelOnly) {
    return (
      <>
        {measureNodes}
        <AppLauncherSurface {...surfaceProps} />
      </>
    );
  }

  return (
    <>
      {measureNodes}
    <Popover.Root
      open={controlledOpen ? open : undefined}
      defaultOpen={controlledOpen ? undefined : defaultOpen}
      onOpenChange={handleOpenChange}
    >
      <Popover.Trigger
        ref={triggerRef}
        className={[
          styles.trigger,
          triggerVariant === "masthead" ? styles.triggerMasthead : "",
        ]
          .filter(Boolean)
          .join(" ")}
        aria-label="App launcher"
      >
        <Icon
          shapeName="grid-square-9-16"
          className={styles.triggerIcon}
          variant={triggerVariant === "masthead" ? "mask" : "inline"}
          color={
            triggerVariant === "masthead"
              ? undefined
              : "var(--color-text-gray-neutral-strong)"
          }
        />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner sideOffset={positionerSideOffset} align="end">
          <Popover.Popup
            ref={popupRef}
            className={styles.launcherPopup}
            onKeyDownCapture={handlePopupKeyDown}
          >
            <AppLauncherSurface {...surfaceProps} />
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
    </>
  );
}

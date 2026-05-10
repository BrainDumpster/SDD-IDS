import { Popover } from "@base-ui-components/react/popover";
import type { ReactNode } from "react";
import { Icon } from "./Icon";
import styles from "./AppLauncher.module.css";

export interface AppLauncherProduct {
  id?: string;
  name: string;
  /** Omit to use default `shield-encrypt-alt` asset (Figma sample). */
  icon?: ReactNode;
  href?: string;
  onSelect?: () => void;
}

export interface AppLauncherOption {
  id?: string;
  label: string;
  onSelect?: () => void;
}

export interface AppLauncherProductTileProps extends AppLauncherProduct {
  tileClassName?: string;
}

/** Single product cell: 148×125, 32×32 icon slot, body-2 label (Figma `AppLauncher-Element`). */
export function AppLauncherProductTile({
  name,
  icon,
  href,
  onSelect,
  tileClassName,
}: AppLauncherProductTileProps) {
  const graphic =
    icon ?? (
      <Icon
        shapeName="shield-encrypt-alt"
        className={styles.defaultProductIcon}
        variant="inline"
      />
    );

  const inner = (
    <div className={styles.labelStack}>
      <div className={styles.iconSlot}>{graphic}</div>
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
      </a>
    );
  }

  return (
    <button type="button" className={[styles.appTile, tileClassName].filter(Boolean).join(" ")} onClick={onSelect}>
      {inner}
    </button>
  );
}

export interface AppLauncherOptionsListProps {
  options: AppLauncherOption[];
  footerAction?: { label: string; onClick: () => void };
  showTopSeparator?: boolean;
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
                {opt.label}
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
  /** Popover vertical offset from trigger. Use `0` for attached masthead behavior. */
  sideOffset?: number;
}

function chunkRows<T>(items: T[], columns: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += columns) {
    rows.push(items.slice(i, i + columns));
  }
  return rows;
}

export function AppLauncher({
  products,
  apps,
  options,
  footerAction,
  columns = 2,
  triggerVariant = "default",
  sideOffset = 8,
}: AppLauncherProps) {
  const list = products ?? apps ?? [];
  const rows = chunkRows(list, Math.max(1, columns));
  const showOptions =
    (options && options.length > 0) || footerAction != null;
  const useTwoProductSeparator = list.length === 2 && !showOptions;

  return (
    <Popover.Root>
      <Popover.Trigger
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
          variant="inline"
          color={
            triggerVariant === "masthead"
              ? "var(--color-text-white)"
              : "var(--color-text-neutral-strong)"
          }
        />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner sideOffset={sideOffset} align="end">
          <Popover.Popup
            className={[
              styles.launcherSurface,
              useTwoProductSeparator ? styles.launcherSurfaceTwoProduct : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {list.length > 0 ? (
              <div className={styles.productRegion}>
                {rows.map((row, rowIndex) => (
                  <div key={rowIndex}>
                    {rowIndex > 0 ? <div className={styles.rowDivider} aria-hidden="true" /> : null}
                    <div
                      className={[
                        styles.productRow,
                        row.length === 1 && columns === 2 ? styles.productRowSingle : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      {row.map((product, cellIndex) => (
                        <div key={product.id ?? `${rowIndex}-${cellIndex}`} style={{ display: "contents" }}>
                          {cellIndex > 0 ? (
                            <div
                              className={
                                useTwoProductSeparator
                                  ? styles.columnDividerSolid
                                  : styles.columnDivider
                              }
                              aria-hidden="true"
                            />
                          ) : null}
                          <AppLauncherProductTile
                            {...product}
                            tileClassName={undefined}
                          />
                        </div>
                      ))}
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
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}

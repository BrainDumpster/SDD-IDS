import { type ComponentProps, type ReactNode } from "react";
import { Icon } from "./Icon";
import styles from "./IdsDetailPanel.module.css";

export type IdsDetailPanelAttachMode = "datagrid" | "page";

export interface IdsDetailPanelProps extends ComponentProps<"aside"> {
  attachMode: IdsDetailPanelAttachMode;
  isExpanded: boolean;
  onExpandedChange?: (next: boolean) => void;
  body: ReactNode;
  title?: string;
  showHeader?: boolean;
  showFooter?: boolean;
  ariaLabelExpand?: string;
  ariaLabelCollapse?: string;
  collapsedWidth?: number;
  expandedWidth?: number;
}

export function IdsDetailPanel({
  attachMode,
  isExpanded,
  onExpandedChange,
  body,
  title = "Details",
  showHeader = true,
  showFooter = true,
  ariaLabelExpand = "Expand details panel",
  ariaLabelCollapse = "Collapse details panel",
  collapsedWidth = 40,
  expandedWidth = 398,
  className,
  ...rest
}: IdsDetailPanelProps) {
  const panelWidth = isExpanded ? expandedWidth : collapsedWidth;
  const toggleIcon = isExpanded ? "double-chev-right" : "double-chev-left";
  const toggleAriaLabel = isExpanded ? ariaLabelCollapse : ariaLabelExpand;

  const handleToggle = () => {
    onExpandedChange?.(!isExpanded);
  };

  const toggleButton = (
    <button
      type="button"
      className={styles.toggleButton}
      aria-label={toggleAriaLabel}
      aria-expanded={isExpanded}
      onClick={handleToggle}
    >
      <Icon shapeName={toggleIcon} />
    </button>
  );

  return (
    <aside
      className={[styles.root, className].filter(Boolean).join(" ")}
      style={{ width: panelWidth }}
      aria-label={`${attachMode} details panel`}
      {...rest}
    >
      {isExpanded ? (
        <>
          {attachMode === "datagrid" && showHeader ? (
            <header className={styles.header}>
              <h3 className={styles.title}>{title}</h3>
              <div className={styles.controls}>{toggleButton}</div>
            </header>
          ) : null}

          <div className={styles.body}>{body}</div>

          {attachMode === "page" && showFooter ? (
            <footer className={styles.footer}>
              <div className={styles.controls}>{toggleButton}</div>
            </footer>
          ) : null}
        </>
      ) : (
        <div
          className={[
            styles.collapsedRail,
            attachMode === "page" ? styles.collapsedRailPage : styles.collapsedRailDatagrid,
          ].join(" ")}
        >
          <div className={styles.controls}>{toggleButton}</div>
        </div>
      )}
    </aside>
  );
}

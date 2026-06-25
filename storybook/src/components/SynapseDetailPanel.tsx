import { type ComponentProps, type ReactNode } from "react";

import { Button } from "./Button";
import { Icon } from "./Icon";
import { IdsDetailPanel, type IdsDetailPanelAttachMode, type IdsDetailPanelProps } from "./IdsDetailPanel";
import type { SynapseDetailPanelKeyValueRow } from "../spec-contracts/synapse-detail-panel.contract";
import { SYNAPSE_DETAIL_PANEL_EXPANDED_WIDTH } from "../spec-contracts/synapse-detail-panel.contract";
import styles from "./SynapseDetailPanel.module.css";

export type SynapseDetailPanelAttachMode = IdsDetailPanelAttachMode | "topology";

export interface SynapseDetailPanelAction {
  label: string;
  onClick?: () => void;
}

export interface SynapseDetailPanelProps extends Omit<ComponentProps<"aside">, "title"> {
  attachMode: SynapseDetailPanelAttachMode;
  /** Expanded (IDS) or open (topology). */
  isExpanded: boolean;
  onExpandedChange?: (next: boolean) => void;
  body?: ReactNode;
  title?: string;
  subtitle?: string;
  iconSlug?: string;
  rows?: SynapseDetailPanelKeyValueRow[];
  primaryAction?: SynapseDetailPanelAction;
  secondaryAction?: SynapseDetailPanelAction;
  showHeader?: boolean;
  showFooter?: boolean;
  ariaLabelExpand?: string;
  ariaLabelCollapse?: string;
  ariaLabelClose?: string;
  collapsedWidth?: number;
  expandedWidth?: number;
}

function SynapseDetailPanelTopology({
  isExpanded,
  onExpandedChange,
  body,
  title = "Details",
  subtitle,
  iconSlug = "objects-square",
  rows,
  primaryAction,
  secondaryAction,
  ariaLabelClose = "Close details panel",
  expandedWidth = SYNAPSE_DETAIL_PANEL_EXPANDED_WIDTH,
  className,
  ...rest
}: SynapseDetailPanelProps) {
  if (!isExpanded) return null;

  const handleClose = () => {
    onExpandedChange?.(false);
  };

  const resolvedBody =
    body ??
    (rows ? (
      <div className={styles.keyValueTable}>
        {rows.map((row, index) => (
          <div key={`${row.label}-${index}`} className={styles.keyValueRow}>
            <div className={styles.keyCell}>{row.label}</div>
            <div className={styles.valueCell}>
              {row.variant === "status" ? (
                <>
                  {row.statusIconSlug ? (
                    <Icon shapeName={row.statusIconSlug} variant="img" className={styles.statusIcon} />
                  ) : null}
                  <span>{row.value}</span>
                </>
              ) : row.variant === "link" && row.href ? (
                <>
                  <a className={styles.valueLink} href={row.href} target="_blank" rel="noreferrer">
                    {row.value}
                  </a>
                  <Icon shapeName="pop-up-square-corner-big" variant="img" className={styles.externalIcon} />
                </>
              ) : (
                <span>{row.value}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    ) : null);

  return (
    <aside
      className={[styles.root, styles.rootTopology, className].filter(Boolean).join(" ")}
      style={{ width: expandedWidth }}
      aria-label="Node details panel"
      {...rest}
    >
      <header className={styles.header}>
        <div className={styles.headerMain}>
          <div className={styles.iconShell} aria-hidden="true">
            <Icon shapeName={iconSlug} variant="img" className={styles.iconGlyph} />
          </div>
          <div className={styles.titles}>
            <h3 className={styles.title}>{title}</h3>
            {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
          </div>
        </div>
        <button type="button" className={styles.closeButton} aria-label={ariaLabelClose} onClick={handleClose}>
          <Icon shapeName="ctrl-close-16" variant="img" className={styles.closeIcon} />
        </button>
      </header>

      <div className={styles.body}>
        <div className={styles.bodyInner}>{resolvedBody}</div>
        {primaryAction || secondaryAction ? (
          <div className={styles.footerActions}>
            {primaryAction ? (
              <Button programme="synapse" variant="primary" size="sm" onClick={primaryAction.onClick}>
                {primaryAction.label}
              </Button>
            ) : null}
            {secondaryAction ? (
              <Button programme="synapse" variant="secondary" size="sm" onClick={secondaryAction.onClick}>
                {secondaryAction.label}
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>
    </aside>
  );
}

/**
 * Synapse Detail Panel — IDS ids-fork.
 * `attachMode="topology"` uses Synapse chrome (icon header, close, key-value template).
 * `datagrid` / `page` delegate to `IdsDetailPanel`.
 */
export function SynapseDetailPanel({ attachMode, ...props }: SynapseDetailPanelProps) {
  if (attachMode === "topology") {
    return <SynapseDetailPanelTopology attachMode={attachMode} {...props} />;
  }

  const idsProps: IdsDetailPanelProps = {
    attachMode,
    isExpanded: props.isExpanded,
    onExpandedChange: props.onExpandedChange,
    body: props.body ?? null,
    title: props.title,
    showHeader: props.showHeader,
    showFooter: props.showFooter,
    ariaLabelExpand: props.ariaLabelExpand,
    ariaLabelCollapse: props.ariaLabelCollapse,
    collapsedWidth: props.collapsedWidth,
    expandedWidth: props.expandedWidth,
    className: props.className,
  };

  return <IdsDetailPanel {...idsProps} />;
}

export type { IdsDetailPanelAttachMode };

import {
  Children,
  isValidElement,
  type ComponentProps,
  type ReactElement,
  type ReactNode,
  useId,
} from "react";
import { Icon } from "./Icon";
import styles from "./IdsDetailPanel.module.css";

export type IdsDetailPanelAttachMode = "datagrid" | "page";

export interface IdsDetailPanelProps extends Omit<ComponentProps<"aside">, "children"> {
  attachMode: IdsDetailPanelAttachMode;
  isExpanded: boolean;
  onExpandedChange?: (next: boolean) => void;
  onOpened?: () => void;
  onClosed?: () => void;
  /** @deprecated Prefer composition: `<IdsDetailPanel.Header>` + `<IdsDetailPanel.Body>`. */
  body?: ReactNode;
  /** Shorthand when `IdsDetailPanel.Header` is not used. */
  title?: string;
  showHeader?: boolean;
  showFooter?: boolean;
  ariaLabelExpand?: string;
  ariaLabelCollapse?: string;
  collapsedWidth?: number;
  expandedWidth?: number;
  children?: ReactNode;
}

function findChild<T>(
  children: ReactNode,
  component: (props: T) => ReactNode,
): ReactElement<T> | undefined {
  return Children.toArray(children).find(
    (child) => isValidElement(child) && child.type === component,
  ) as ReactElement<T> | undefined;
}

function emitExpandedChange(
  next: boolean,
  current: boolean,
  onExpandedChange?: (next: boolean) => void,
  onOpened?: () => void,
  onClosed?: () => void,
): void {
  if (next === current) {
    return;
  }
  onExpandedChange?.(next);
  if (next) {
    onOpened?.();
  } else {
    onClosed?.();
  }
}

export function IdsDetailPanelHeader({ children }: { children?: ReactNode }) {
  return <>{children}</>;
}

export function IdsDetailPanelBody({ children }: { children?: ReactNode }) {
  return <>{children}</>;
}

export function IdsDetailPanel({
  attachMode,
  isExpanded,
  onExpandedChange,
  onOpened,
  onClosed,
  body,
  title = "Details",
  showHeader = true,
  showFooter = true,
  ariaLabelExpand = "Expand details panel",
  ariaLabelCollapse = "Collapse details panel",
  collapsedWidth = 40,
  expandedWidth = 398,
  className,
  children,
  ...rest
}: IdsDetailPanelProps) {
  const bodyId = useId();
  const headerChild = children ? findChild(children, IdsDetailPanelHeader) : undefined;
  const bodyChild = children ? findChild(children, IdsDetailPanelBody) : undefined;
  const resolvedBody = bodyChild?.props.children ?? body;
  const resolvedTitle = headerChild?.props.children ?? title;

  const panelWidth = isExpanded ? expandedWidth : collapsedWidth;
  const toggleIcon = isExpanded ? "double-chev-right" : "double-chev-left";
  const toggleAriaLabel = isExpanded ? ariaLabelCollapse : ariaLabelExpand;

  const handleToggle = () => {
    emitExpandedChange(!isExpanded, isExpanded, onExpandedChange, onOpened, onClosed);
  };

  const toggleButton = (
    <button
      type="button"
      className={styles.toggleButton}
      aria-label={toggleAriaLabel}
      aria-expanded={isExpanded}
      aria-controls={isExpanded ? bodyId : undefined}
      onClick={handleToggle}
    >
      <Icon shapeName={toggleIcon} variant="img" className={styles.toggleIcon} />
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
                <h3 className={styles.title}>{resolvedTitle}</h3>
                <div className={styles.controls}>{toggleButton}</div>
              </header>
            ) : null}

            <div id={bodyId} className={styles.body}>
              {resolvedBody}
            </div>

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

IdsDetailPanel.Header = IdsDetailPanelHeader;
IdsDetailPanel.Body = IdsDetailPanelBody;

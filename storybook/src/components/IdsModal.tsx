import { Dialog as BaseDialog } from "@base-ui-components/react/dialog";
import {
  Children,
  createContext,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import styles from "./Dialog.module.css";
import shapeXIcon from "../../../assets/icons/shape-x.svg";
import statusCriticalSquareSolidIcon from "../../../assets/icons/status-critical-square-solid.svg";
import statusWarnTriSolidIcon from "../../../assets/icons/status-warn-tri-solid.svg";
import statusErrorDiamondSolidIcon from "../../../assets/icons/status-error-diamond-solid.svg";
import infoCircSolidIcon from "../../../assets/icons/info-circ-solid.svg";

export type IdsModalScenario = "single-page" | "multi-page" | "dialog";
export type IdsModalDialogType =
  | "non-alerting"
  | "informational"
  | "warning"
  | "major"
  | "critical"
  | "destructive";
export type IdsModalSize = "x-small" | "small" | "medium" | "large";

type NormalizedDialogType =
  | "Non-Alerting"
  | "Informational"
  | "Warning"
  | "Major"
  | "Critical"
  | "Destructive";

interface IdsModalContextValue {
  titleId: string;
  descriptionId: string;
  scenario: IdsModalScenario;
  type: IdsModalDialogType;
  scrollBar: boolean;
  showFooterBorder: boolean;
  footerCheckbox: boolean;
  bodyScrollable: boolean;
  registerContentElement: (element: HTMLElement | null) => void;
  onContentScroll: () => void;
}

const IdsModalContext = createContext<IdsModalContextValue | null>(null);

function useIdsModalContext(): IdsModalContextValue {
  const context = useContext(IdsModalContext);
  if (!context) {
    throw new Error("IdsModal.* slots must be used inside <IdsModal>.");
  }
  return context;
}

export interface IdsModalProps {
  trigger?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  scenario?: IdsModalScenario;
  type?: IdsModalDialogType;
  size?: IdsModalSize;
  closable?: boolean;
  scrollBar?: boolean;
  footerCheckbox?: boolean;
  onClose?: () => void;
  children: ReactNode;
}

const SIZE_CLASS: Record<IdsModalSize, string> = {
  "x-small": styles.sm,
  small: styles.sm,
  medium: styles.lg,
  large: styles.xl,
};

const TWO_BUTTON_TYPES: IdsModalDialogType[] = [
  "warning",
  "major",
  "critical",
  "destructive",
];

function findChild<T>(
  children: ReactNode,
  component: (props: T) => ReactNode,
): ReactElement<T> | undefined {
  return Children.toArray(children).find(
    (child) => isValidElement(child) && child.type === component,
  ) as ReactElement<T> | undefined;
}

export function IdsModal({
  trigger,
  open,
  defaultOpen = false,
  onOpenChange,
  scenario = "dialog",
  type = "non-alerting",
  size = "large",
  closable = true,
  scrollBar = false,
  footerCheckbox = false,
  onClose,
  children,
}: IdsModalProps) {
  const titleId = useId();
  const descriptionId = useId();
  const contentElementRef = useRef<HTMLElement | null>(null);
  const [bodyScrollable, setBodyScrollable] = useState(false);
  const [showScrollShadow, setShowScrollShadow] = useState(false);

  const titleChild = findChild(children, IdsModalTitle);
  const bodyChild = findChild(children, IdsModalBody);
  const footerChild = findChild(children, IdsModalFooter);

  const controlled = open !== undefined;
  if (!controlled && trigger == null) {
    throw new Error("IdsModal: pass `trigger`, or use controlled mode with `open`.");
  }

  const normalizedType = normalizeDialogType(type);
  const showSeverityIcon = scenario === "dialog" && type !== "non-alerting";
  const showFooterBorder = scenario !== "dialog";

  const registerContentElement = (element: HTMLElement | null) => {
    contentElementRef.current = element;
  };

  const updateContentOverflow = () => {
    const el = contentElementRef.current;
    if (!el) {
      setBodyScrollable(false);
      setShowScrollShadow(false);
      return;
    }
    const scrollable = scrollBar && el.scrollHeight - el.clientHeight > 1;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
    setBodyScrollable(scrollable);
    setShowScrollShadow(scrollable && !atBottom);
  };

  const onContentScroll = () => {
    updateContentOverflow();
  };

  useEffect(() => {
    updateContentOverflow();
    const el = contentElementRef.current;
    if (!el) {
      return;
    }
    const resizeObserver = new ResizeObserver(updateContentOverflow);
    resizeObserver.observe(el);
    return () => resizeObserver.disconnect();
  }, [bodyChild, scrollBar, scenario, type]);

  const contextValue = useMemo<IdsModalContextValue>(
    () => ({
      titleId,
      descriptionId,
      scenario,
      type,
      scrollBar,
      showFooterBorder,
      footerCheckbox,
      bodyScrollable,
      registerContentElement,
      onContentScroll,
    }),
    [
      titleId,
      descriptionId,
      scenario,
      type,
      scrollBar,
      showFooterBorder,
      footerCheckbox,
      bodyScrollable,
    ],
  );

  const triggerRender =
    trigger != null && isValidElement(trigger) ? (trigger as ReactNode) : undefined;

  return (
    <IdsModalContext.Provider value={contextValue}>
      <BaseDialog.Root
        modal
        open={controlled ? open : undefined}
        defaultOpen={controlled ? undefined : defaultOpen}
        onOpenChange={(next) => onOpenChange?.(next)}
      >
        {trigger != null ? (
          triggerRender ? (
            <BaseDialog.Trigger className={styles.triggerReset} render={triggerRender} />
          ) : (
            <BaseDialog.Trigger className={styles.triggerReset}>{trigger}</BaseDialog.Trigger>
          )
        ) : null}
        <BaseDialog.Portal>
          <BaseDialog.Backdrop className={styles.backdrop} />
          <BaseDialog.Popup className={[styles.popup, SIZE_CLASS[size]].filter(Boolean).join(" ")}>
            <div className={styles.header}>
              <div className={styles.headerLeft}>
                {showSeverityIcon ? (
                  <span className={styles.alertIcon} aria-hidden="true">
                    <DialogTypeIcon type={normalizedType} />
                  </span>
                ) : null}
                {titleChild}
              </div>
              {closable ? (
                <BaseDialog.Close
                  className={styles.close}
                  aria-label="Close"
                  onClick={() => onClose?.()}
                >
                  <DialogCloseGlyph />
                </BaseDialog.Close>
              ) : null}
            </div>

            {bodyChild}

            {showScrollShadow ? (
              <div className={styles.contentScrollShadow} aria-hidden="true" />
            ) : null}

            {footerChild}
          </BaseDialog.Popup>
        </BaseDialog.Portal>
      </BaseDialog.Root>
    </IdsModalContext.Provider>
  );
}

export function IdsModalTitle({ children }: { children: ReactNode }) {
  const { titleId } = useIdsModalContext();
  return (
    <BaseDialog.Title className={styles.title} id={titleId}>
      {children}
    </BaseDialog.Title>
  );
}

export interface IdsModalBodyProps {
  description?: string;
  children?: ReactNode;
}

export function IdsModalBody({ description, children }: IdsModalBodyProps) {
  const {
    descriptionId,
    scenario,
    bodyScrollable,
    registerContentElement,
    onContentScroll,
  } = useIdsModalContext();
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const hasChildren = Children.count(children) > 0;
  const showBodyShell = scenario !== "dialog" || hasChildren;

  useEffect(() => {
    registerContentElement(showBodyShell ? bodyRef.current : null);
    return () => registerContentElement(null);
  }, [registerContentElement, showBodyShell]);

  return (
    <>
      {description ? (
        <BaseDialog.Description className={styles.description} id={descriptionId}>
          {description}
        </BaseDialog.Description>
      ) : null}
      {showBodyShell ? (
        <div
          ref={bodyRef}
          className={[styles.body, bodyScrollable ? styles.bodyScrollable : ""]
            .filter(Boolean)
            .join(" ")}
          onScroll={onContentScroll}
        >
          {children}
        </div>
      ) : null}
    </>
  );
}

export function IdsModalFooter({ children }: { children: ReactNode }) {
  const { showFooterBorder, footerCheckbox } = useIdsModalContext();
  return (
    <div
      className={[styles.footer, showFooterBorder ? styles.footerBordered : ""]
        .filter(Boolean)
        .join(" ")}
    >
      {footerCheckbox ? (
        <label className={styles.footerCheckbox}>
          <input type="checkbox" />
          Don&apos;t show again until the next update
        </label>
      ) : null}
      <div className={styles.footerActions}>{children}</div>
    </div>
  );
}

IdsModal.Title = IdsModalTitle;
IdsModal.Body = IdsModalBody;
IdsModal.Footer = IdsModalFooter;

function DialogCloseGlyph() {
  return (
    <img
      src={shapeXIcon}
      alt=""
      className={styles.closeIcon}
      width={16}
      height={16}
      aria-hidden="true"
    />
  );
}

function DialogTypeIcon({ type }: { type: NormalizedDialogType }) {
  const iconByType = {
    Warning: statusWarnTriSolidIcon,
    Major: statusErrorDiamondSolidIcon,
    Critical: statusCriticalSquareSolidIcon,
    Destructive: statusCriticalSquareSolidIcon,
    Informational: infoCircSolidIcon,
  } as const;

  if (type === "Non-Alerting") {
    return null;
  }

  return (
    <img
      src={iconByType[type]}
      alt=""
      className={styles.typeIconImage}
      width={24}
      height={24}
      aria-hidden="true"
    />
  );
}

function normalizeDialogType(type: IdsModalDialogType): NormalizedDialogType {
  switch (type) {
    case "non-alerting":
      return "Non-Alerting";
    case "informational":
      return "Informational";
    case "warning":
      return "Warning";
    case "major":
      return "Major";
    case "critical":
      return "Critical";
    case "destructive":
      return "Destructive";
    default:
      return "Non-Alerting";
  }
}

export { TWO_BUTTON_TYPES };

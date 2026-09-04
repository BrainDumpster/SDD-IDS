import { useMemo, useRef, useState } from "react";
import { Icon } from "./Icon";
import styles from "./Tag.module.css";

type Tone = "info" | "success" | "minor" | "major" | "critical" | "non-alerting";
type Emphasis = "strong" | "light";
type Type = "read-only" | "clickable" | "editable" | "badge";
type Size = "sm" | "lg";
type VisualState = "default" | "hover" | "focus" | "error" | "disabled";

export interface TagProps {
  /** `synapse` → 4px focus ring + critical Light slate tokens per Synapse Figma. */
  programme?: "ids" | "synapse";
  label: string;
  tone?: Tone;
  emphasis?: Emphasis;
  type?: Type;
  size?: Size;
  selected?: boolean;
  defaultSelected?: boolean;
  showLabel?: boolean;
  labelPrefix?: string;
  closable?: boolean;
  badgeCount?: number;
  visualState?: VisualState;
  /** Optional max width for the tag; the label truncates with an ellipsis when
   *  it exceeds this. Opt-in — unset tags keep their intrinsic width. */
  maxWidth?: number | string;
  onClick?: () => void;
  onSelectedChange?: (selected: boolean) => void;
  onTextFocus?: () => void;
  onTextBlur?: () => void;
  onDismiss?: () => void;
}

export function Tag({
  programme = "ids",
  label,
  tone = "non-alerting",
  emphasis = "light",
  type = "read-only",
  size = "sm",
  selected,
  defaultSelected = false,
  showLabel = false,
  labelPrefix = "Label:",
  closable = false,
  badgeCount,
  visualState = "default",
  maxWidth,
  onClick,
  onSelectedChange,
  onTextFocus,
  onTextBlur,
  onDismiss,
}: TagProps) {
  const disabled = visualState === "disabled";
  const clickable = type === "clickable";
  const editable = type === "editable";
  const isBadgeType = type === "badge";
  const readOnly = type === "read-only";
  const effectiveTone = readOnly ? tone : "non-alerting";
  const hasBadge = isBadgeType && badgeCount != null;
  const isSelectedControlled = selected !== undefined;
  const [internalSelected, setInternalSelected] = useState(defaultSelected);
  const textFocusRef = useRef<HTMLSpanElement>(null);
  const isSelected = isSelectedControlled ? selected : internalSelected;
  const isInteractiveClickable = clickable && !disabled;
  const isEditableFocusable = editable && !disabled;
  const isBadgeFocusable = isBadgeType && !disabled;
  const typeClassName =
    type === "badge" ? styles.typeBadge : type === "clickable" ? styles.clickable : type === "editable" ? styles.editable : styles.readOnly;

  const handleTagClick = useMemo(
    () =>
      isInteractiveClickable
        ? () => {
            const next = !isSelected;
            if (!isSelectedControlled) {
              setInternalSelected(next);
            }
            onSelectedChange?.(next);
            onClick?.();
          }
        : undefined,
    [isInteractiveClickable, isSelected, isSelectedControlled, onClick, onSelectedChange]
  );

  const handleEditableContainerClick = useMemo(
    () =>
      isEditableFocusable
        ? () => {
            textFocusRef.current?.focus();
          }
        : undefined,
    [isEditableFocusable]
  );

  const handleRootClick = useMemo(() => {
    if (isInteractiveClickable) {
      return handleTagClick;
    }
    return handleEditableContainerClick;
  }, [handleEditableContainerClick, handleTagClick, isInteractiveClickable]);

  return (
    <span
      className={[
        styles.tag,
        programme === "synapse" ? styles.programmeSynapse : styles.programmeIds,
        styles[size],
        typeClassName,
        styles[`tone_${effectiveTone}`],
        styles[`emphasis_${emphasis}`],
        clickable && isSelected ? styles.selected : "",
        (closable || editable) ? styles.dismissible : "",
        maxWidth != null ? styles.truncated : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={maxWidth != null ? { maxWidth } : undefined}
      data-disabled={disabled || undefined}
      data-focus={visualState === "focus" || undefined}
      data-error={visualState === "error" || undefined}
      data-hover={visualState === "hover" || undefined}
      role={clickable ? "button" : undefined}
      aria-pressed={clickable ? isSelected : undefined}
      tabIndex={isInteractiveClickable ? 0 : isBadgeFocusable ? 0 : undefined}
      onClick={handleRootClick}
    >
      {hasBadge ? <span className={styles.badge}>{badgeCount}</span> : null}
      {editable ? (
        <span className={styles.textField}>
          {showLabel ? <span className={styles.prefix}>{labelPrefix}</span> : null}
          <span
            ref={textFocusRef}
            className={styles.label}
            contentEditable={!disabled}
            suppressContentEditableWarning
            role="textbox"
            tabIndex={isEditableFocusable ? 0 : undefined}
            aria-label={label}
            onFocus={onTextFocus}
            onBlur={onTextBlur}
          >
            {label}
          </span>
        </span>
      ) : (
        <>
          {showLabel ? <span className={styles.prefix}>{labelPrefix}</span> : null}
          <span className={styles.label}>{label}</span>
        </>
      )}
      {isBadgeType && hasBadge ? (
        <Icon
          shapeName="arrow-drop-tri-caret"
          className={styles.menuCaret}
          color={disabled ? "var(--color-icon-gray-disabled)" : "var(--color-icon-gray-neutral-accessible)"}
          style={{ width: 10, height: 10 }}
        />
      ) : null}
      {(closable || editable) && (
        <button
          className={styles.dismiss}
          onClick={(event) => {
            event.stopPropagation();
            onDismiss?.();
          }}
          disabled={disabled}
          aria-label={`Remove ${label}`}
          type="button"
        >
          <Icon
            shapeName="shape-x-thick"
            color={
              disabled
                ? "var(--color-icon-gray-disabled)"
                : "var(--color-icon-gray-neutral-accessible)"
            }
            style={{ width: 10, height: 10 }}
          />
        </button>
      )}
    </span>
  );
}

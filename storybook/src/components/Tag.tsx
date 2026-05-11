import { useMemo, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { Icon } from "./Icon";
import styles from "./Tag.module.css";

type Tone = "info" | "success" | "minor" | "major" | "critical" | "non-alerting";
type Emphasis = "strong" | "light";
type Type = "read-only" | "clickable" | "editable" | "badge";
type Size = "sm" | "lg";
type VisualState = "default" | "hover" | "focus" | "error" | "disabled";

interface TagProps {
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
  onClick?: () => void;
  onSelectedChange?: (selected: boolean) => void;
  onTextFocus?: () => void;
  onTextBlur?: () => void;
  onDismiss?: () => void;
}

export function Tag({
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
  const hasBadge = isBadgeType && badgeCount != null;
  const isSelectedControlled = selected !== undefined;
  const [internalSelected, setInternalSelected] = useState(defaultSelected);
  const textFocusRef = useRef<HTMLSpanElement>(null);
  const isSelected = isSelectedControlled ? selected : internalSelected;
  const isInteractiveClickable = clickable && !disabled;
  const isEditableFocusable = editable && !disabled;
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

  const handleEditableMouseDown = useMemo(
    () =>
      isEditableFocusable
        ? (event: MouseEvent<HTMLSpanElement>) => {
            const target = event.target as HTMLElement;
            if (target.closest("button")) {
              return;
            }
            event.preventDefault();
            textFocusRef.current?.focus();
          }
        : undefined,
    [isEditableFocusable]
  );

  return (
    <span
      className={[
        styles.tag,
        styles[size],
        typeClassName,
        styles[`tone_${tone}`],
        styles[`emphasis_${emphasis}`],
        clickable && isSelected ? styles.selected : "",
      ]
        .filter(Boolean)
        .join(" ")}
      data-disabled={disabled || undefined}
      data-focus={visualState === "focus" || undefined}
      data-error={visualState === "error" || undefined}
      data-hover={visualState === "hover" || undefined}
      role={clickable ? "button" : undefined}
      aria-pressed={clickable ? isSelected : undefined}
      tabIndex={isInteractiveClickable ? 0 : undefined}
      onClick={handleRootClick}
      onMouseDown={handleEditableMouseDown}
    >
      {hasBadge ? <span className={styles.badge}>{badgeCount}</span> : null}
      {editable ? (
        <span
          ref={textFocusRef}
          className={styles.textField}
          tabIndex={isEditableFocusable ? 0 : undefined}
          onFocus={onTextFocus}
          onBlur={onTextBlur}
        >
          {showLabel ? <span className={styles.prefix}>{labelPrefix}</span> : null}
          <span className={styles.label}>{label}</span>
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
          color={disabled ? "var(--color-icon-disabled)" : "var(--color-icon-accessible)"}
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
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
            <path
              d="M8 2L2 8M2 2L8 8"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
            />
          </svg>
        </button>
      )}
    </span>
  );
}

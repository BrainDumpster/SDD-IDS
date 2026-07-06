import { useMemo, useRef, useState } from "react";
import type { MouseEvent } from "react";
import type { TagSize, TagTone, TagType } from "@component-contracts/ids/tag.contract";
import { Icon } from "./Icon";
import styles from "./Tag.module.css";

type Emphasis = "strong" | "light";

/** Maps spec tone names to legacy CSS module class suffixes. */
function toneToCssClass(tone: TagTone): string {
  if (tone === "none") return "non-alerting";
  if (tone === "informational") return "info";
  return tone;
}

/** Maps spec size to CSS module class names. */
function sizeToCssClass(size: TagSize): "sm" | "lg" {
  return size === "small" ? "sm" : "lg";
}

function normalizeLabelPrefix(value: string): string {
  return value.replace(/:+\s*$/, "");
}

function TagContent({
  showLabel,
  labelPrefix,
  label,
  className,
}: {
  showLabel: boolean;
  labelPrefix: string;
  label: string;
  className: string;
}) {
  const prefixText = normalizeLabelPrefix(labelPrefix);

  return (
    <span className={className}>
      {showLabel ? (
        <span className={styles.prefix}>
          <span className={styles.prefixText}>{prefixText}</span>
          <span className={styles.prefixColon}>:</span>
        </span>
      ) : null}
      <span className={styles.label}>{label}</span>
    </span>
  );
}

export interface TagProps {
  /** `synapse` → 4px focus ring + critical Light slate tokens per Synapse Figma. */
  programme?: "ids" | "synapse";
  label: string;
  tone?: TagTone;
  emphasis?: Emphasis;
  type?: TagType;
  size?: TagSize;
  selected?: boolean;
  defaultSelected?: boolean;
  disabled?: boolean;
  error?: boolean;
  /** Demo/testing only — keyboard focus ring on tag root. */
  focusVisible?: boolean;
  /** Editable only — inner text field focus ring. */
  focusOnText?: boolean;
  /** Demo/testing only — forced hover chrome for Storybook matrices. */
  demoHover?: boolean;
  showLabel?: boolean;
  /** Field label text without trailing colon; runtime appends `:`. */
  labelPrefix?: string;
  badgeValue?: string | number;
  leadingIconSlug?: string | null;
  closeIconSlug?: string;
  onClick?: () => void;
  onSelectionChange?: (selected: boolean) => void;
  onTextFocus?: () => void;
  onTextBlur?: () => void;
  onDismiss?: () => void;
}

export function Tag({
  programme = "ids",
  label,
  tone = "none",
  emphasis = "light",
  type = "read-only",
  size = "small",
  selected,
  defaultSelected = false,
  disabled = false,
  error = false,
  focusVisible = false,
  focusOnText = false,
  demoHover = false,
  showLabel = false,
  labelPrefix = "Label",
  badgeValue,
  leadingIconSlug = null,
  closeIconSlug: _closeIconSlug = "shape-x-thick",
  onClick,
  onSelectionChange,
  onTextFocus,
  onTextBlur,
  onDismiss,
}: TagProps) {
  const clickable = type === "clickable";
  const editable = type === "editable";
  const isBadgeType = type === "badge";
  const hasBadge = isBadgeType && badgeValue != null;
  const isSelectedControlled = selected !== undefined;
  const [internalSelected, setInternalSelected] = useState(defaultSelected);
  const textFocusRef = useRef<HTMLSpanElement>(null);
  const isSelected = isSelectedControlled ? selected : internalSelected;
  const isInteractiveClickable = clickable && !disabled;
  const isEditableFocusable = editable && !disabled;
  const sizeClass = sizeToCssClass(size);
  const toneClass = toneToCssClass(tone);
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
            onSelectionChange?.(next);
            onClick?.();
          }
        : undefined,
    [isInteractiveClickable, isSelected, isSelectedControlled, onClick, onSelectionChange]
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
        programme === "synapse" ? styles.programmeSynapse : styles.programmeIds,
        styles[sizeClass],
        typeClassName,
        styles[`tone_${toneClass}`],
        styles[`emphasis_${emphasis}`],
        clickable && isSelected ? styles.selected : "",
      ]
        .filter(Boolean)
        .join(" ")}
      data-disabled={disabled || undefined}
      data-focus={focusVisible || undefined}
      data-error={error || undefined}
      data-hover={demoHover || undefined}
      role={clickable ? "button" : undefined}
      aria-pressed={clickable ? isSelected : undefined}
      tabIndex={isInteractiveClickable ? 0 : undefined}
      onClick={handleRootClick}
      onMouseDown={handleEditableMouseDown}
    >
      {leadingIconSlug ? (
        <Icon
          shapeName={leadingIconSlug}
          className={styles.leadingIcon}
          color={disabled ? "var(--color-icon-disabled)" : "var(--color-icon-accessible)"}
        />
      ) : null}
      {hasBadge ? <span className={styles.badge}>{badgeValue}</span> : null}
      {editable ? (
        <span
          ref={textFocusRef}
          className={styles.textField}
          tabIndex={isEditableFocusable ? 0 : undefined}
          data-focus-on-text={focusOnText || undefined}
          onFocus={onTextFocus}
          onBlur={onTextBlur}
        >
          <TagContent showLabel={showLabel} labelPrefix={labelPrefix} label={label} className={styles.content} />
        </span>
      ) : (
        <TagContent showLabel={showLabel} labelPrefix={labelPrefix} label={label} className={styles.content} />
      )}
      {isBadgeType && hasBadge ? (
        <Icon
          shapeName="arrow-drop-tri-caret"
          className={styles.menuCaret}
          color={disabled ? "var(--color-icon-disabled)" : "var(--color-icon-accessible)"}
        />
      ) : null}
      {editable ? (
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
      ) : null}
    </span>
  );
}

/**
 * IDS Tag — React implementation generated from design-spec.
 *
 * Path: `lib/react/ids/tag`
 * Source: `components/ids/tag/design-spec.md`
 * Theme: `components/ids-theme.css`
 * Figma: `0bHk3XhrjFhowgFkz9yLr4` / `42012:26686`
 *
 * Anatomy / slot order (Figma badge places TagBadge before TagLabel):
 *   TagRoot
 *     TagPrefixIcon?
 *     TagBadge?          (badge type only; Figma leading count chip)
 *     TagLabel | TagEditableField?
 *     menu caret?        (badge type; arrow-drop-tri-caret)
 *     TagCloseButton?    (editable / dismissible)
 *
 * No @base-ui-components dependency.
 * TagDropdown is host-composed (detached menu); not rendered here.
 */

import React, {
  useCallback,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
} from "react";
import { IdsIcon } from "../icon";
import styles from "./IdsTag.module.css";

export type IdsTagType = "read-only" | "clickable" | "editable" | "badge";
export type IdsTagSize = "small" | "large";
export type IdsTagTone =
  | "none"
  | "informational"
  | "success"
  | "minor"
  | "major"
  | "critical";

const TAG_TYPES = new Set<IdsTagType>([
  "read-only",
  "clickable",
  "editable",
  "badge",
]);
const TAG_SIZES = new Set<IdsTagSize>(["small", "large"]);
const TAG_TONES = new Set<IdsTagTone>([
  "none",
  "informational",
  "success",
  "minor",
  "major",
  "critical",
]);

export interface IdsTagProps
  extends Omit<HTMLAttributes<HTMLElement>, "onClick" | "children"> {
  /** Variant axis `type`. Unknown → `read-only`. */
  type?: IdsTagType | string;
  /** Size track. Defaults: read-only → small; others → large. Unknown → same rule. */
  size?: IdsTagSize | string;
  /** Alerting / non-alerting tone. Unknown → `none`. */
  tone?: IdsTagTone | string;
  /** Clickable only; ignored otherwise. Default `false`. */
  selected?: boolean;
  disabled?: boolean;
  /** Error chrome for read-only / editable / badge. */
  error?: boolean;
  /** Demo/testing only — does not block runtime focus-visible. */
  focusVisible?: boolean;
  /** Editable only — forces TagEditableField focus chrome. */
  focusOnText?: boolean;
  /** Required label text. */
  label: string;
  /** Badge count/status chip. Ignored when `type !== "badge"`. */
  badgeValue?: string | number;
  /** Optional leading icon slug (`assets/icons/<slug>.svg`). */
  leadingIconSlug?: string | null;
  /** Close icon slug. Default `shape-x-thick`. */
  closeIconSlug?: string;
  /** Clickable press handler (also fires after selection toggle). */
  onClick?: () => void;
  /** Editable dismiss. */
  onDismiss?: () => void;
  /** Clickable selection change. */
  onSelectionChange?: (selected: boolean) => void;
}

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

function resolveType(value: unknown): IdsTagType {
  if (typeof value === "string" && TAG_TYPES.has(value as IdsTagType)) {
    return value as IdsTagType;
  }
  return "read-only";
}

function resolveTone(value: unknown): IdsTagTone {
  if (typeof value === "string" && TAG_TONES.has(value as IdsTagTone)) {
    return value as IdsTagTone;
  }
  return "none";
}

function resolveSize(value: unknown, type: IdsTagType): IdsTagSize {
  if (typeof value === "string" && TAG_SIZES.has(value as IdsTagSize)) {
    return value as IdsTagSize;
  }
  return type === "read-only" ? "small" : "large";
}

export function IdsTag({
  type: typeProp,
  size: sizeProp,
  tone: toneProp = "none",
  selected = false,
  disabled = false,
  error = false,
  focusVisible = false,
  focusOnText = false,
  label,
  badgeValue,
  leadingIconSlug = null,
  closeIconSlug = "shape-x-thick",
  onClick,
  onDismiss,
  onSelectionChange,
  className,
  ...rest
}: IdsTagProps): ReactElement {
  const type = resolveType(typeProp);
  const size = resolveSize(sizeProp, type);
  const tone = resolveTone(toneProp);

  const isClickable = type === "clickable";
  const isEditable = type === "editable";
  const isBadge = type === "badge";

  const effectiveSelected = isClickable ? Boolean(selected) : false;
  const effectiveBadge =
    isBadge && badgeValue != null && badgeValue !== "" ? badgeValue : null;
  const showError = error && !isClickable && !disabled;
  const showClose = isEditable;
  const editableFieldRef = useRef<HTMLSpanElement>(null);
  const [textFocused, setTextFocused] = useState(false);

  const handleSelectionToggle = useCallback(() => {
    if (disabled || !isClickable) return;
    const next = !effectiveSelected;
    onSelectionChange?.(next);
    onClick?.();
  }, [disabled, effectiveSelected, isClickable, onClick, onSelectionChange]);

  const handleRootClick = useCallback(() => {
    if (disabled) return;
    if (isClickable) {
      handleSelectionToggle();
      return;
    }
    if (isEditable) {
      editableFieldRef.current?.focus();
    }
  }, [disabled, handleSelectionToggle, isClickable, isEditable]);

  const handleRootKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (disabled || !isClickable) return;
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleSelectionToggle();
      }
    },
    [disabled, handleSelectionToggle, isClickable],
  );

  const handleEditableMouseDown = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      if (disabled || !isEditable) return;
      const target = event.target as HTMLElement;
      if (target.closest("button")) return;
      event.preventDefault();
      editableFieldRef.current?.focus();
    },
    [disabled, isEditable],
  );

  const handleDismiss = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      if (disabled) return;
      onDismiss?.();
    },
    [disabled, onDismiss],
  );

  const toneClass =
    tone !== "none" ? styles[`ids-tag--tone-${tone}`] : undefined;

  const rootClassName = cx(
    styles["ids-tag"],
    styles[`ids-tag--${size}`],
    isClickable && styles["ids-tag--clickable"],
    isEditable && styles["ids-tag--editable"],
    showClose && styles["ids-tag--dismissible"],
    effectiveSelected && styles["ids-tag--selected"],
    disabled && styles["ids-tag--disabled"],
    showError && styles["ids-tag--error"],
    focusVisible && styles["ids-tag--focus-visible"],
    (focusOnText || textFocused) && styles["ids-tag--focus-on-text"],
    toneClass,
    className,
  );

  const labelNode = (
    <span className={styles["ids-tag-label"]} data-ids="ids-tag-label">
      {label}
    </span>
  );

  const prefixIcon =
    leadingIconSlug != null && leadingIconSlug !== "" ? (
      <span
        className={styles["ids-tag-prefix-icon"]}
        data-ids="ids-tag-prefix-icon"
        aria-hidden="true"
      >
        <IdsIcon
          shape={leadingIconSlug}
          size={10}
          color="currentColor"
        />
      </span>
    ) : null;

  const badgeNode =
    effectiveBadge != null ? (
      <span className={styles["ids-tag-badge"]} data-ids="ids-tag-badge">
        {effectiveBadge}
      </span>
    ) : null;

  const caretNode = isBadge ? (
    <span
      className={styles["ids-tag-menu-caret"]}
      data-ids="ids-tag-menu-caret"
      aria-hidden="true"
    >
      <IdsIcon
        shape="arrow-drop-tri-caret"
        size={10}
        color="currentColor"
      />
    </span>
  ) : null;

  const editableField = isEditable ? (
    <span
      ref={editableFieldRef}
      className={styles["ids-tag-editable-field"]}
      data-ids="ids-tag-editable-field"
      tabIndex={disabled ? undefined : 0}
      onFocus={() => setTextFocused(true)}
      onBlur={() => setTextFocused(false)}
    >
      {labelNode}
    </span>
  ) : null;

  const closeButton = showClose ? (
    <button
      type="button"
      className={styles["ids-tag-close"]}
      data-ids="ids-tag-close"
      aria-label={`Remove ${label}`}
      disabled={disabled}
      onClick={handleDismiss}
    >
      <IdsIcon shape={closeIconSlug} size={10} color="currentColor" />
    </button>
  ) : null;

  const interactiveProps = isClickable
    ? {
        role: "button" as const,
        tabIndex: disabled ? -1 : 0,
        "aria-pressed": effectiveSelected,
        "aria-disabled": disabled || undefined,
        onClick: handleRootClick,
        onKeyDown: handleRootKeyDown,
      }
    : isEditable
      ? {
          onClick: handleRootClick,
          onMouseDown: handleEditableMouseDown,
        }
      : isBadge && !disabled
        ? {
            role: "button" as const,
            tabIndex: 0,
          }
        : {};

  return (
    <span
      {...rest}
      {...interactiveProps}
      className={rootClassName}
      data-ids="ids-tag"
      data-type={type}
      data-size={size}
      data-tone={tone}
      data-selected={effectiveSelected || undefined}
      data-error={showError || undefined}
      data-disabled={disabled || undefined}
    >
      {prefixIcon}
      {badgeNode}
      {isEditable ? editableField : labelNode}
      {caretNode}
      {closeButton}
    </span>
  );
}

IdsTag.displayName = "IdsTag";

export default IdsTag;

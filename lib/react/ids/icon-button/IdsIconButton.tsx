/**
 * IDS Icon Button — React implementation from design-spec.
 *
 * Path: `lib/react/ids/icon-button`
 * Source: `components/ids/icon-button/design-spec.md`
 * Theme: `components/ids-theme.css`
 *
 * Anatomy:
 *   IdsIconButton
 *     IconButtonIcon slot → <IdsIcon shape={shape} size={12|14|16} variant="mask" />
 *
 * Selectors: ids-icon-button, ids-icon-button-icon
 */

import React, {
  forwardRef,
  useState,
  type ButtonHTMLAttributes,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import { IdsIcon } from "../icon";
import styles from "./IdsIconButton.module.css";

export type IdsIconButtonVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "ghostNeutral"
  /** Alias of `ghostNeutral`. */
  | "ghost";

export type IdsIconButtonSize = "small" | "medium" | "large";

export type IdsIconButtonDataState =
  | "default"
  | "hover"
  | "press"
  | "focus-visible"
  | "disabled";

export interface IdsIconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "children"> {
  variant?: IdsIconButtonVariant;
  size?: IdsIconButtonSize;
  /**
   * Required icon name (slug). Passed to `IdsIcon` `shape`.
   * Resolves `assets/icons/<shape>.svg`.
   */
  shape: string;
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit" | "reset";
  /** Required accessible name (native `aria-label` also accepted). */
  ariaLabel?: string;
  /** Demo/testing visual override only. */
  dataState?: IdsIconButtonDataState;
  /**
   * Successful activation callback (same contract as `IdsButton` `onClick`).
   * Not called when `disabled` or `loading`.
   */
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  onPressStart?: (event: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLButtonElement>) => void;
  onPressEnd?: (event: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLButtonElement>) => void;
}

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

function resolveVariant(v: unknown): Exclude<IdsIconButtonVariant, "ghost"> {
  if (v === "ghost" || v === "ghostNeutral" || v === "ghost-neutral") {
    return "ghostNeutral";
  }
  if (v === "secondary" || v === "tertiary") return v;
  return "primary";
}

function resolveSize(s: unknown): IdsIconButtonSize {
  if (s === "sm" || s === "small") return "small";
  if (s === "md" || s === "medium") return "medium";
  return "large";
}

/** Glyph size: small 12×12 / medium 14×14 / large 16×16. */
function iconGlyphSize(size: IdsIconButtonSize): number {
  if (size === "small") return 12;
  if (size === "medium") return 14;
  return 16;
}

const sizeClass: Record<IdsIconButtonSize, string> = {
  small: styles["ids-icon-button--small"],
  medium: styles["ids-icon-button--medium"],
  large: styles["ids-icon-button--large"],
};

const variantClass: Record<Exclude<IdsIconButtonVariant, "ghost">, string> = {
  primary: styles["ids-icon-button--primary"],
  secondary: styles["ids-icon-button--secondary"],
  tertiary: styles["ids-icon-button--tertiary"],
  ghostNeutral: styles["ids-icon-button--ghost-neutral"],
};

export const IdsIconButton = forwardRef<HTMLButtonElement, IdsIconButtonProps>(
  function IdsIconButton(
    {
      variant: variantProp,
      size: sizeProp,
      shape: shapeProp,
      disabled = false,
      loading = false,
      type = "button",
      ariaLabel,
      dataState,
      className,
      onClick,
      onFocus,
      onBlur,
      onKeyDown,
      onKeyUp,
      onMouseDown,
      onMouseUp,
      onMouseLeave,
      onPressStart,
      onPressEnd,
      ...rest
    },
    ref,
  ) {
    const variant = resolveVariant(variantProp);
    const size = resolveSize(sizeProp);
    const shape = (shapeProp ?? "").trim();
    const isDisabled = Boolean(disabled || loading || dataState === "disabled");
    const [isPressed, setIsPressed] = useState(false);
    const glyphPx = iconGlyphSize(size);
    const restAriaLabel =
      typeof (rest as { "aria-label"?: unknown })["aria-label"] === "string"
        ? ((rest as { "aria-label"?: string })["aria-label"] ?? "").trim()
        : "";
    const resolvedAriaLabel = (ariaLabel ?? "").trim() || restAriaLabel || undefined;

    if (!resolvedAriaLabel) {
      throw new Error("IdsIconButton: `ariaLabel` (or `aria-label`) is required.");
    }
    if (!shape) {
      throw new Error("IdsIconButton: `shape` (icon name) is required.");
    }

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
      if (isDisabled) {
        event.preventDefault();
        return;
      }
      onClick?.(event);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
      if (isDisabled) {
        event.preventDefault();
        return;
      }
      if (event.key === " " || event.key === "Enter") {
        setIsPressed(true);
        onPressStart?.(event);
      }
      onKeyDown?.(event);
    };

    const handleKeyUp = (event: KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === " " || event.key === "Enter") {
        setIsPressed(false);
        onPressEnd?.(event);
      }
      onKeyUp?.(event);
    };

    const handleMouseDown = (event: MouseEvent<HTMLButtonElement>) => {
      if (!isDisabled) {
        setIsPressed(true);
        onPressStart?.(event);
      }
      onMouseDown?.(event);
    };

    const handleMouseUp = (event: MouseEvent<HTMLButtonElement>) => {
      setIsPressed(false);
      onPressEnd?.(event);
      onMouseUp?.(event);
    };

    const handleMouseLeave = (event: MouseEvent<HTMLButtonElement>) => {
      setIsPressed(false);
      onPressEnd?.(event);
      onMouseLeave?.(event);
    };

    const handleFocus = (event: FocusEvent<HTMLButtonElement>) => {
      onFocus?.(event);
    };

    const handleBlur = (event: FocusEvent<HTMLButtonElement>) => {
      setIsPressed(false);
      onBlur?.(event);
    };

    return (
      <button
        {...rest}
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-label={resolvedAriaLabel}
        aria-disabled={isDisabled || undefined}
        aria-busy={loading || undefined}
        data-ids="ids-icon-button"
        data-variant={variant}
        data-size={size}
        data-shape={shape}
        data-state={isPressed ? "press" : dataState && dataState !== "default" ? dataState : undefined}
        data-loading={loading ? "true" : undefined}
        className={cx(
          styles["ids-icon-button"],
          variantClass[variant],
          sizeClass[size],
          loading && styles["ids-icon-button--loading"],
          isDisabled && styles["ids-icon-button--disabled"],
          className,
        )}
        onClick={handleClick}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {loading ? (
          <span className={styles["ids-icon-button-spinner"]} aria-hidden="true" />
        ) : null}
        <span
          className={cx(
            styles["ids-icon-button-icon"],
            loading && styles["ids-icon-button-icon--hidden"],
          )}
          data-ids="ids-icon-button-icon"
          aria-hidden="true"
        >
          <IdsIcon shape={shape} size={glyphPx} variant="mask" />
        </span>
      </button>
    );
  },
);

IdsIconButton.displayName = "IdsIconButton";

export default IdsIconButton;

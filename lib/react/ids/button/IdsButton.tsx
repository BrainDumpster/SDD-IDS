/**
 * IDS Button — React implementation generated from design-spec.
 *
 * Path: `lib/react/ids/button`
 * Source: `components/ids/button/design-spec.md`
 * Theme: `components/ids-theme.css`
 *
 * Content projection only:
 *   IdsButton
 *     IdsButtonLeadingIcon?  — project <IdsIcon /> (or any icon node)
 *     IdsButtonLabel?        — project any label content
 *
 * Selectors: ids-button, ids-button-leading-icon, ids-button-label
 * No @base-ui-components dependency.
 */

import React, {
  Children,
  forwardRef,
  isValidElement,
  type ButtonHTMLAttributes,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import styles from "./IdsButton.module.css";

export type IdsButtonVariant = "primary" | "secondary" | "tertiary" | "destructive";
export type IdsButtonSize = "small" | "medium" | "large";
export type IdsButtonDataState =
  | "default"
  | "hover"
  | "press"
  | "focus-visible"
  | "disabled";

export interface IdsButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "children"> {
  /**
   * Projected parts only: `IdsButtonLeadingIcon` and/or `IdsButtonLabel`.
   */
  children?: ReactNode;
  variant?: IdsButtonVariant;
  size?: IdsButtonSize;
  iconOnly?: boolean;
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit" | "reset";
  /** Required when `iconOnly` is true. */
  ariaLabel?: string;
  /** Demo/testing visual override only — does not replace interaction logic. */
  dataState?: IdsButtonDataState;
  onPressStart?: (event: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLButtonElement>) => void;
  onPressEnd?: (event: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLButtonElement>) => void;
}

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

function resolveVariant(v: unknown): IdsButtonVariant {
  if (v === "secondary" || v === "tertiary" || v === "destructive") return v;
  return "primary";
}

function resolveSize(s: unknown): IdsButtonSize {
  if (s === "small" || s === "medium") return s;
  return "large";
}

const sizeClass: Record<IdsButtonSize, string> = {
  small: styles["ids-button--small"],
  medium: styles["ids-button--medium"],
  large: styles["ids-button--large"],
};

const variantClass: Record<IdsButtonVariant, string> = {
  primary: styles["ids-button--primary"],
  secondary: styles["ids-button--secondary"],
  tertiary: styles["ids-button--tertiary"],
  destructive: styles["ids-button--destructive"],
};

/* -------------------------------------------------------------------------- */
/* IdsButtonLeadingIcon — project IdsIcon (or any icon node)                  */
/* -------------------------------------------------------------------------- */

export interface IdsButtonLeadingIconProps {
  /** Projected icon, typically `<IdsIcon shape="…" size={16} />`. */
  children?: ReactNode;
  className?: string;
  hidden?: boolean;
}

export function IdsButtonLeadingIcon({
  children,
  className,
  hidden,
}: IdsButtonLeadingIconProps) {
  if (children == null || children === false) return null;

  return (
    <span
      className={cx(
        styles["ids-button-leading-icon"],
        hidden && styles["ids-button-leading-icon--hidden"],
        className,
      )}
      data-ids="ids-button-leading-icon"
      aria-hidden="true"
    >
      {children}
    </span>
  );
}
IdsButtonLeadingIcon.displayName = "IdsButtonLeadingIcon";

/* -------------------------------------------------------------------------- */
/* IdsButtonLabel — projected label content                                   */
/* -------------------------------------------------------------------------- */

export interface IdsButtonLabelProps {
  children?: ReactNode;
  className?: string;
  hidden?: boolean;
}

export function IdsButtonLabel({ children, className, hidden }: IdsButtonLabelProps) {
  if (children == null || children === false) return null;
  return (
    <span
      className={cx(
        styles["ids-button-label"],
        hidden && styles["ids-button-label--hidden"],
        className,
      )}
      data-ids="ids-button-label"
    >
      {children}
    </span>
  );
}
IdsButtonLabel.displayName = "IdsButtonLabel";

function isLeadingIconElement(child: ReactElement): boolean {
  return (
    child.type === IdsButtonLeadingIcon ||
    (typeof child.type === "function" &&
      (child.type as { displayName?: string }).displayName === "IdsButtonLeadingIcon")
  );
}

function isLabelElement(child: ReactElement): boolean {
  return (
    child.type === IdsButtonLabel ||
    (typeof child.type === "function" &&
      (child.type as { displayName?: string }).displayName === "IdsButtonLabel")
  );
}

function partitionProjectedChildren(children: ReactNode): {
  projectedIcon: ReactElement<IdsButtonLeadingIconProps> | null;
  projectedLabel: ReactElement<IdsButtonLabelProps> | null;
} {
  let projectedIcon: ReactElement<IdsButtonLeadingIconProps> | null = null;
  let projectedLabel: ReactElement<IdsButtonLabelProps> | null = null;

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    if (isLeadingIconElement(child)) {
      projectedIcon = child as ReactElement<IdsButtonLeadingIconProps>;
      return;
    }
    if (isLabelElement(child)) {
      projectedLabel = child as ReactElement<IdsButtonLabelProps>;
    }
  });

  return { projectedIcon, projectedLabel };
}

/* -------------------------------------------------------------------------- */
/* IdsButton                                                                  */
/* -------------------------------------------------------------------------- */

export const IdsButton = forwardRef<HTMLButtonElement, IdsButtonProps>(function IdsButton(
  {
    children,
    variant: variantProp,
    size: sizeProp,
    iconOnly = false,
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
  const isDisabled = Boolean(disabled || loading || dataState === "disabled");

  const { projectedIcon, projectedLabel } = partitionProjectedChildren(children);

  const iconSlot =
    projectedIcon && loading
      ? React.cloneElement(projectedIcon, { hidden: true })
      : projectedIcon;

  const labelSlot =
    projectedLabel && loading
      ? React.cloneElement(projectedLabel, { hidden: true })
      : projectedLabel;

  const hasIcon = iconSlot != null;
  const hasLabel = labelSlot != null;

  if (iconOnly) {
    if (!ariaLabel) {
      throw new Error("IdsButton: `ariaLabel` is required when `iconOnly` is true.");
    }
    if (!hasIcon) {
      throw new Error(
        "IdsButton: project `IdsButtonLeadingIcon` when `iconOnly` is true.",
      );
    }
    if (size === "small") {
      throw new Error("IdsButton: `iconOnly` is not supported for size `small`.");
    }
  } else if (!hasLabel) {
    throw new Error(
      "IdsButton: project `IdsButtonLabel` (required unless `iconOnly` is true).",
    );
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
      onPressStart?.(event);
    }
    onKeyDown?.(event);
  };

  const handleKeyUp = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === " " || event.key === "Enter") {
      onPressEnd?.(event);
    }
    onKeyUp?.(event);
  };

  const handleMouseDown = (event: MouseEvent<HTMLButtonElement>) => {
    if (!isDisabled) onPressStart?.(event);
    onMouseDown?.(event);
  };

  const handleMouseUp = (event: MouseEvent<HTMLButtonElement>) => {
    onPressEnd?.(event);
    onMouseUp?.(event);
  };

  const handleMouseLeave = (event: MouseEvent<HTMLButtonElement>) => {
    onPressEnd?.(event);
    onMouseLeave?.(event);
  };

  const handleFocus = (event: FocusEvent<HTMLButtonElement>) => {
    onFocus?.(event);
  };

  const handleBlur = (event: FocusEvent<HTMLButtonElement>) => {
    onBlur?.(event);
  };

  return (
    <button
      {...rest}
      ref={ref}
      type={type}
      disabled={isDisabled}
      aria-label={ariaLabel}
      aria-disabled={isDisabled || undefined}
      aria-busy={loading || undefined}
      data-ids="ids-button"
      data-variant={variant}
      data-size={size}
      data-state={dataState && dataState !== "default" ? dataState : undefined}
      data-icon-only={iconOnly ? "true" : undefined}
      data-loading={loading ? "true" : undefined}
      className={cx(
        styles["ids-button"],
        variantClass[variant],
        sizeClass[size],
        iconOnly && styles["ids-button--icon-only"],
        loading && styles["ids-button--loading"],
        isDisabled && styles["ids-button--disabled"],
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
      {loading ? <span className={styles["ids-button-spinner"]} aria-hidden="true" /> : null}

      {iconOnly ? (
        hasIcon ? iconSlot : null
      ) : (
        <>
          {hasIcon ? iconSlot : null}
          {hasLabel ? labelSlot : null}
        </>
      )}
    </button>
  );
});

IdsButton.displayName = "IdsButton";

export const IdsButtonCompound = Object.assign(IdsButton, {
  LeadingIcon: IdsButtonLeadingIcon,
  Label: IdsButtonLabel,
});

export default IdsButtonCompound;

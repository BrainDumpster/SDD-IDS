import type { ComponentProps } from "react";
import { Button } from "../Button";
import styles from "./IdsButtonDap.module.css";

type DapButtonVariant = "primary" | "secondary" | "tertiary" | "destructive";
type DapButtonSize = "small" | "medium" | "large";
type DemoState = "default" | "hover" | "press" | "focus" | "disabled";

export interface IdsButtonDapProps extends Omit<ComponentProps<typeof Button>, "variant" | "size"> {
  variant?: DapButtonVariant;
  size?: DapButtonSize;
  /** Demo-only forced state for Storybook parity checks. */
  state?: DemoState;
}

const sizeToIds: Record<DapButtonSize, "sm" | "md" | "lg"> = {
  small: "sm",
  medium: "md",
  large: "lg",
};

const variantToIds: Record<DapButtonVariant, "primary" | "secondary" | "tertiary" | "danger"> = {
  primary: "primary",
  secondary: "secondary",
  tertiary: "tertiary",
  destructive: "danger",
};

export function IdsButtonDap({
  variant = "primary",
  size = "large",
  state = "default",
  className,
  disabled,
  ...rest
}: IdsButtonDapProps) {
  const forcedDisabled = disabled || state === "disabled";
  const stateClass =
    state === "hover"
      ? "dap-force-hover"
      : state === "press"
        ? "dap-force-press"
        : state === "focus"
          ? "dap-force-focus"
          : "";

  return (
    <Button
      {...rest}
      disabled={forcedDisabled}
      variant={variantToIds[variant]}
      size={sizeToIds[size]}
      className={[styles.root, stateClass, className].filter(Boolean).join(" ")}
    />
  );
}


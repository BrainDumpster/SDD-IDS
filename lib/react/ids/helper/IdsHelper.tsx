/**
 * IdsHelper — projected helper message (optional Icon + mandatory text).
 *
 * Path: `lib/react/ids/helper`
 *
 *   <IdsHelper>
 *     <IdsIcon shape="…" />        // optional
 *     <IdsHelperText>…</IdsHelperText>  // required
 *   </IdsHelper>
 */

import React, {
  Children,
  isValidElement,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import styles from "./IdsHelper.module.css";

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export interface IdsHelperTextProps {
  children?: ReactNode;
  className?: string;
}

export function IdsHelperText({ children, className }: IdsHelperTextProps) {
  if (children == null || children === false || children === "") {
    throw new Error("IdsHelperText: text content is required.");
  }
  return (
    <span className={cx(styles["ids-helper-text"], className)} data-ids="ids-helper-text">
      {children}
    </span>
  );
}
IdsHelperText.displayName = "IdsHelperText";

function isHelperText(child: ReactElement): boolean {
  return (
    child.type === IdsHelperText ||
    (typeof child.type === "function" &&
      (child.type as { displayName?: string }).displayName === "IdsHelperText")
  );
}

export interface IdsHelperProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  disabled?: boolean;
}

export function IdsHelper({ children, className, disabled, id, ...rest }: IdsHelperProps) {
  let text: ReactElement | null = null;
  let icon: ReactNode = null;

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    if (isHelperText(child)) {
      text = child;
      return;
    }
    icon = child;
  });

  if (!text) {
    throw new Error("IdsHelper: project mandatory `IdsHelperText`.");
  }

  return (
    <div
      {...rest}
      id={id}
      className={cx(styles["ids-helper"], className)}
      data-ids="ids-helper"
      data-disabled={disabled ? "true" : undefined}
    >
      {icon != null ? (
        <span className={styles["ids-helper-icon"]} data-ids="ids-helper-icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      {text}
    </div>
  );
}
IdsHelper.displayName = "IdsHelper";

export const IdsHelperCompound = Object.assign(IdsHelper, {
  Text: IdsHelperText,
});

export default IdsHelperCompound;

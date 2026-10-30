/**
 * IdsError — projected error message (optional Icon + mandatory text).
 *
 * Path: `lib/react/ids/error`
 *
 * Default icon shape: `status-critical-square-solid` (full-color img) when no Icon is projected.
 *
 *   <IdsError>
 *     <IdsErrorText>…</IdsErrorText>
 *   </IdsError>
 *
 *   <IdsError>
 *     <IdsIcon shape="…" variant="img" />
 *     <IdsErrorText>…</IdsErrorText>
 *   </IdsError>
 */

import React, {
  Children,
  isValidElement,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import { IdsIcon } from "../icon";
import styles from "../helper/IdsHelper.module.css";

const DEFAULT_ERROR_ICON_SHAPE = "status-critical-square-solid";

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export interface IdsErrorTextProps {
  children?: ReactNode;
  className?: string;
}

export function IdsErrorText({ children, className }: IdsErrorTextProps) {
  if (children == null || children === false || children === "") {
    throw new Error("IdsErrorText: text content is required.");
  }
  return (
    <span className={cx(styles["ids-error-text"], className)} data-ids="ids-error-text">
      {children}
    </span>
  );
}
IdsErrorText.displayName = "IdsErrorText";

function isErrorText(child: ReactElement): boolean {
  return (
    child.type === IdsErrorText ||
    (typeof child.type === "function" &&
      (child.type as { displayName?: string }).displayName === "IdsErrorText")
  );
}

export interface IdsErrorProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  disabled?: boolean;
}

export function IdsError({ children, className, disabled, id, ...rest }: IdsErrorProps) {
  let text: ReactElement | null = null;
  let icon: ReactNode = null;

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    if (isErrorText(child)) {
      text = child;
      return;
    }
    icon = child;
  });

  if (!text) {
    throw new Error("IdsError: project mandatory `IdsErrorText`.");
  }

  const resolvedIcon =
    icon ??
    (disabled ? null : (
      <IdsIcon shape={DEFAULT_ERROR_ICON_SHAPE} size={16} variant="img" />
    ));

  return (
    <div
      {...rest}
      id={id}
      className={cx(styles["ids-error"], className)}
      data-ids="ids-error"
      data-disabled={disabled ? "true" : undefined}
    >
      {resolvedIcon != null ? (
        <span className={styles["ids-error-icon"]} data-ids="ids-error-icon" aria-hidden="true">
          {resolvedIcon}
        </span>
      ) : null}
      {text}
    </div>
  );
}
IdsError.displayName = "IdsError";

export const IdsErrorCompound = Object.assign(IdsError, {
  Text: IdsErrorText,
});

export default IdsErrorCompound;

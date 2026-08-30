/**
 * React Storybook bridge — framework-agnostic alert contract + composition slots.
 */
export * from "./alert.contract";

import React, { Children, isValidElement, type ReactElement, type ReactNode } from "react";
import type { AlertGlobalSeverity } from "./alert.contract";

export interface AlertMessageProps {
  children: ReactNode;
}

export function AlertMessage({ children }: AlertMessageProps): ReactNode {
  return <>{children}</>;
}
AlertMessage.displayName = "AlertMessage";

export interface AlertTitleProps {
  children: ReactNode;
}

export function AlertTitle({ children }: AlertTitleProps): ReactNode {
  return <>{children}</>;
}
AlertTitle.displayName = "AlertTitle";

export interface AlertLinkProps {
  label: string;
  href?: string;
  onClick?: () => void;
}

export function AlertLink(_props: AlertLinkProps): null {
  return null;
}
AlertLink.displayName = "AlertLink";

export interface AlertActionProps {
  label: string;
}

export function AlertAction(_props: AlertActionProps): null {
  return null;
}
AlertAction.displayName = "AlertAction";

export interface AlertItemProps {
  severity: AlertGlobalSeverity;
  children?: ReactNode;
  /** Shorthand when `AlertMessage` is not composed. */
  message?: string;
  linkLabel?: string;
  linkHref?: string;
  actionLabel?: string;
}

/** Logical carousel item — consumed by `AlertGroup` via `Children` (not rendered). */
export function AlertItem(_props: AlertItemProps): null {
  return null;
}
AlertItem.displayName = "AlertItem";

export interface ParsedAlertSlots {
  message: ReactNode;
  messageText: string;
  title: string;
  linkLabel: string;
  linkHref: string;
  actionLabel: string;
}

function childText(node: ReactNode): string {
  if (node == null || typeof node === "boolean") {
    return "";
  }
  if (typeof node === "string" || typeof node === "number") {
    return String(node).trim();
  }
  if (Array.isArray(node)) {
    return node.map(childText).join("").trim();
  }
  if (isValidElement(node)) {
    return childText(node.props.children);
  }
  return "";
}

export function parseAlertSlots(children: ReactNode): ParsedAlertSlots {
  let message: ReactNode = "";
  let title = "";
  let linkLabel = "";
  let linkHref = "";
  let actionLabel = "";

  Children.forEach(children, (child: ReactNode) => {
    if (!isValidElement(child)) {
      return;
    }
    if (child.type === AlertMessage) {
      message = (child as ReactElement<AlertMessageProps>).props.children;
    } else if (child.type === AlertTitle) {
      title = childText((child as ReactElement<AlertTitleProps>).props.children);
    } else if (child.type === AlertLink) {
      const props = (child as ReactElement<AlertLinkProps>).props;
      linkLabel = props.label;
      linkHref = props.href ?? "";
    } else if (child.type === AlertAction) {
      actionLabel = (child as ReactElement<AlertActionProps>).props.label;
    }
  });

  return {
    message,
    messageText: childText(message),
    title,
    linkLabel,
    linkHref,
    actionLabel,
  };
}

export function isAlertItemElement(
  child: ReactNode,
): child is ReactElement<AlertItemProps> {
  return isValidElement(child) && child.type === AlertItem;
}

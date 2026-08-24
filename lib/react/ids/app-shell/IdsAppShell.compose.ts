import {
  Children,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";

/** Slot identity for App Shell anatomy (root is AppShell, not AppShellRoot). */
export const APP_SHELL_SLOT = Symbol.for("ids.app-shell.slot");

export type AppShellSlotName =
  | "masthead"
  | "body-row"
  | "main-menu"
  | "main-column"
  | "page-header"
  | "page-title"
  | "page-description"
  | "body-viewport"
  | "body-content"
  | "footer"
  | "header-actions"
  | "page-panel";

export function getAppShellSlot(type: unknown): AppShellSlotName | undefined {
  if (typeof type !== "function" && typeof type !== "object") return undefined;
  return (type as { [APP_SHELL_SLOT]?: AppShellSlotName })[APP_SHELL_SLOT];
}

export function markAppShellSlot<T>(fn: T, name: AppShellSlotName): T {
  (fn as { [APP_SHELL_SLOT]?: AppShellSlotName })[APP_SHELL_SLOT] = name;
  return fn;
}

export function findSlotElement(
  children: ReactNode,
  slot: AppShellSlotName,
): ReactElement | undefined {
  let found: ReactElement | undefined;
  Children.forEach(children, (child) => {
    if (found || !isValidElement(child)) return;
    if (getAppShellSlot(child.type) === slot) {
      found = child;
      return;
    }
    const nested = (child.props as { children?: ReactNode }).children;
    if (nested) {
      found = findSlotElement(nested, slot);
    }
  });
  return found;
}

export interface AppShellMainSlots {
  masthead?: ReactElement;
  bodyRow?: ReactElement;
  mainMenu?: ReactElement;
  mainColumn?: ReactElement;
  pageHeader?: ReactElement;
  pageTitle?: ReactElement;
  pageDescription?: ReactElement;
  bodyViewport?: ReactElement;
  bodyContent?: ReactElement;
  footer?: ReactElement;
  headerActions?: ReactElement;
}

export function collectMainSlots(children: ReactNode): AppShellMainSlots {
  let masthead: ReactElement | undefined;
  let bodyRow: ReactElement | undefined;
  let mainMenu: ReactElement | undefined;
  let mainColumn: ReactElement | undefined;
  let pageHeader: ReactElement | undefined;
  let pageTitle: ReactElement | undefined;
  let pageDescription: ReactElement | undefined;
  let bodyViewport: ReactElement | undefined;
  let bodyContent: ReactElement | undefined;
  let footer: ReactElement | undefined;
  let headerActions: ReactElement | undefined;

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    const slot = getAppShellSlot(child.type);
    if (slot === "masthead") masthead = child;
    else if (slot === "body-row") bodyRow = child;
    else if (slot === "main-menu") mainMenu = child;
    else if (slot === "main-column") mainColumn = child;
    else if (slot === "page-header") pageHeader = child;
    else if (slot === "page-title") pageTitle = child;
    else if (slot === "page-description") pageDescription = child;
    else if (slot === "body-viewport") bodyViewport = child;
    else if (slot === "body-content") bodyContent = child;
    else if (slot === "footer") footer = child;
    else if (slot === "header-actions") headerActions = child;
  });

  if (bodyRow) {
    const rowKids = (bodyRow.props as { children?: ReactNode }).children;
    if (!mainMenu) mainMenu = findSlotElement(rowKids, "main-menu");
    if (!mainColumn) mainColumn = findSlotElement(rowKids, "main-column");
  }

  if (mainColumn) {
    const columnKids = (mainColumn.props as { children?: ReactNode }).children;
    if (!pageHeader) pageHeader = findSlotElement(columnKids, "page-header");
    if (!bodyViewport) bodyViewport = findSlotElement(columnKids, "body-viewport");
    if (!footer) footer = findSlotElement(columnKids, "footer");
  }

  if (pageHeader) {
    const headerKids = (pageHeader.props as { children?: ReactNode }).children;
    if (!pageTitle) pageTitle = findSlotElement(headerKids, "page-title");
    if (!pageDescription) pageDescription = findSlotElement(headerKids, "page-description");
  }

  if (bodyViewport) {
    const viewportKids = (bodyViewport.props as { children?: ReactNode }).children;
    if (!bodyContent) bodyContent = findSlotElement(viewportKids, "body-content");
  }

  return {
    masthead,
    bodyRow,
    mainMenu,
    mainColumn,
    pageHeader,
    pageTitle,
    pageDescription,
    bodyViewport,
    bodyContent,
    footer,
    headerActions,
  };
}

export function hasAppShellAnatomyChildren(children: ReactNode): boolean {
  const slots = collectMainSlots(children);
  return Boolean(
    slots.masthead ||
      slots.bodyRow ||
      slots.mainMenu ||
      slots.mainColumn ||
      slots.pageHeader ||
      slots.pageTitle ||
      slots.pageDescription ||
      slots.bodyViewport ||
      slots.bodyContent ||
      slots.footer,
  );
}

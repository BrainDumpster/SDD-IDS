import {
  Children,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";

/** Slot identity for Masthead anatomy (root is Masthead, not MastheadRoot). */
export const MASTHEAD_SLOT = Symbol.for("ids.masthead.slot");

export type MastheadSlotName =
  | "brand"
  | "logo"
  | "product-name"
  | "actions-row"
  | "icons"
  | "app-launcher"
  | "avatar-slot"
  | "action-button-container"
  | "action-icon-button"
  | "avatar";

export function getMastheadSlot(type: unknown): MastheadSlotName | undefined {
  if (typeof type !== "function" && typeof type !== "object") return undefined;
  return (type as { [MASTHEAD_SLOT]?: MastheadSlotName })[MASTHEAD_SLOT];
}

export function markMastheadSlot<T>(fn: T, name: MastheadSlotName): T {
  (fn as { [MASTHEAD_SLOT]?: MastheadSlotName })[MASTHEAD_SLOT] = name;
  return fn;
}

export function flattenText(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(flattenText).join("");
  if (isValidElement(node)) {
    return flattenText((node.props as { children?: ReactNode }).children);
  }
  return "";
}

export function findSlotElement(
  children: ReactNode,
  slot: MastheadSlotName,
): ReactElement | undefined {
  let found: ReactElement | undefined;
  Children.forEach(children, (child) => {
    if (found || !isValidElement(child)) return;
    if (getMastheadSlot(child.type) === slot) {
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

export interface MastheadMainSlots {
  brand?: ReactElement;
  logo?: ReactElement;
  productName?: ReactElement;
  actionsRow?: ReactElement;
  icons?: ReactElement;
  appLauncher?: ReactElement;
  avatarSlot?: ReactElement;
}

export function collectMainSlots(children: ReactNode): MastheadMainSlots {
  let brand: ReactElement | undefined;
  let logo: ReactElement | undefined;
  let productName: ReactElement | undefined;
  let actionsRow: ReactElement | undefined;
  let icons: ReactElement | undefined;
  let appLauncher: ReactElement | undefined;
  let avatarSlot: ReactElement | undefined;

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    const slot = getMastheadSlot(child.type);
    if (slot === "brand") brand = child;
    else if (slot === "logo") logo = child;
    else if (slot === "product-name") productName = child;
    else if (slot === "actions-row") actionsRow = child;
    else if (slot === "icons") icons = child;
    else if (slot === "app-launcher") appLauncher = child;
    else if (slot === "avatar-slot") avatarSlot = child;
  });

  if (brand) {
    const brandKids = (brand.props as { children?: ReactNode }).children;
    if (!logo) logo = findSlotElement(brandKids, "logo");
    if (!productName) productName = findSlotElement(brandKids, "product-name");
  }

  if (actionsRow) {
    const actionKids = (actionsRow.props as { children?: ReactNode }).children;
    if (!icons) icons = findSlotElement(actionKids, "icons");
    if (!appLauncher) appLauncher = findSlotElement(actionKids, "app-launcher");
    if (!avatarSlot) avatarSlot = findSlotElement(actionKids, "avatar-slot");
  }

  return { brand, logo, productName, actionsRow, icons, appLauncher, avatarSlot };
}

export function hasMastheadAnatomyChildren(children: ReactNode): boolean {
  const slots = collectMainSlots(children);
  return Boolean(
    slots.brand ||
      slots.logo ||
      slots.productName ||
      slots.actionsRow ||
      slots.icons ||
      slots.appLauncher ||
      slots.avatarSlot,
  );
}

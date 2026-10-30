import {
  Children,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";

/** Slot identity for GetStarted anatomy (root is GetStarted, not GetStartedRoot). */
export const GET_STARTED_SLOT = Symbol.for("ids.get-started.slot");

export type GetStartedSlotName =
  | "hero-header"
  | "hero-background"
  | "hero-shadow-band"
  | "hero-honeycomb"
  | "masthead"
  | "hero-title"
  | "hero-subtitle"
  | "container"
  | "card-track"
  | "card-anchor"
  | "card"
  | "card-icon-badge"
  | "card-title-band"
  | "card-content-panel"
  | "card-description"
  | "card-note"
  | "card-configure-button"
  | "skip-button"
  | "overflow-edge"
  | "overflow-gradient"
  | "overflow-arrow"
  | "overflow-nav-button";

export function getGetStartedSlot(type: unknown): GetStartedSlotName | undefined {
  if (typeof type !== "function" && typeof type !== "object") return undefined;
  return (type as { [GET_STARTED_SLOT]?: GetStartedSlotName })[GET_STARTED_SLOT];
}

export function markGetStartedSlot<T>(fn: T, name: GetStartedSlotName): T {
  (fn as { [GET_STARTED_SLOT]?: GetStartedSlotName })[GET_STARTED_SLOT] = name;
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
  slot: GetStartedSlotName,
): ReactElement | undefined {
  let found: ReactElement | undefined;
  Children.forEach(children, (child) => {
    if (found || !isValidElement(child)) return;
    if (getGetStartedSlot(child.type) === slot) {
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

export function collectSlotElements(
  children: ReactNode,
  slot: GetStartedSlotName,
): ReactElement[] {
  const found: ReactElement[] = [];
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    if (getGetStartedSlot(child.type) === slot) {
      found.push(child);
      return;
    }
    const nested = (child.props as { children?: ReactNode }).children;
    if (nested) {
      found.push(...collectSlotElements(nested, slot));
    }
  });
  return found;
}

export interface GetStartedMainSlots {
  heroHeader?: ReactElement;
  heroTitle?: ReactElement;
  heroSubtitle?: ReactElement;
  masthead?: ReactElement;
  container?: ReactElement;
  cardTrack?: ReactElement;
  skipButton?: ReactElement;
  overflowEdges: ReactElement[];
  cards: ReactElement[];
}

export function collectMainSlots(children: ReactNode): GetStartedMainSlots {
  let heroHeader: ReactElement | undefined;
  let heroTitle: ReactElement | undefined;
  let heroSubtitle: ReactElement | undefined;
  let masthead: ReactElement | undefined;
  let container: ReactElement | undefined;
  let cardTrack: ReactElement | undefined;
  let skipButton: ReactElement | undefined;
  const overflowEdges: ReactElement[] = [];
  const cards: ReactElement[] = [];

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    const slot = getGetStartedSlot(child.type);
    if (slot === "hero-header") heroHeader = child;
    else if (slot === "hero-title") heroTitle = child;
    else if (slot === "hero-subtitle") heroSubtitle = child;
    else if (slot === "masthead") masthead = child;
    else if (slot === "container") container = child;
    else if (slot === "card-track") cardTrack = child;
    else if (slot === "skip-button") skipButton = child;
    else if (slot === "overflow-edge") overflowEdges.push(child);
    else if (slot === "card" || slot === "card-anchor") cards.push(child);
  });

  if (heroHeader) {
    const headerKids = (heroHeader.props as { children?: ReactNode }).children;
    if (!heroTitle) heroTitle = findSlotElement(headerKids, "hero-title");
    if (!heroSubtitle) heroSubtitle = findSlotElement(headerKids, "hero-subtitle");
    if (!masthead) masthead = findSlotElement(headerKids, "masthead");
  }

  if (container) {
    const containerKids = (container.props as { children?: ReactNode }).children;
    if (!cardTrack) cardTrack = findSlotElement(containerKids, "card-track");
    if (!skipButton) skipButton = findSlotElement(containerKids, "skip-button");
    if (cards.length === 0) {
      const anchors = collectSlotElements(containerKids, "card-anchor");
      cards.push(...(anchors.length > 0 ? anchors : collectSlotElements(containerKids, "card")));
    }
  }

  if (cards.length === 0 && cardTrack) {
    const trackKids = (cardTrack.props as { children?: ReactNode }).children;
    const anchors = collectSlotElements(trackKids, "card-anchor");
    cards.push(...(anchors.length > 0 ? anchors : collectSlotElements(trackKids, "card")));
  }

  return {
    heroHeader,
    heroTitle,
    heroSubtitle,
    masthead,
    container,
    cardTrack,
    skipButton,
    overflowEdges,
    cards,
  };
}

export function hasGetStartedAnatomyChildren(children: ReactNode): boolean {
  const slots = collectMainSlots(children);
  return Boolean(
    slots.heroHeader ||
      slots.container ||
      slots.cardTrack ||
      slots.skipButton ||
      slots.masthead ||
      slots.heroTitle ||
      slots.cards.length > 0 ||
      slots.overflowEdges.length > 0,
  );
}

export interface ParsedGetStartedCard {
  id: string;
  title: string;
  description: string;
  note?: string;
  icon?: string;
  cardState?: "not-completed" | "completed" | "required";
  isDisabled?: boolean;
  isRequired?: boolean;
  isConfigured?: boolean;
  actionButtonText?: string;
  actionButtonTextIfConfigured?: string;
  configureButtonTooltip?: string;
  titleNode?: ReactNode;
  descriptionNode?: ReactNode;
  noteNode?: ReactNode;
}

function readCardProps(el: ReactElement): ParsedGetStartedCard | null {
  const props = el.props as {
    id?: string | number;
    card?: { id?: string | number; title?: string };
    title?: string;
    description?: string;
    text?: string;
    note?: string;
    icon?: string;
    iconShapeName?: string;
    cardState?: ParsedGetStartedCard["cardState"];
    isDisabled?: boolean;
    isRequired?: boolean;
    isConfigured?: boolean;
    actionButtonText?: string;
    actionButtonTextIfConfigured?: string;
    configureButtonTooltip?: string;
    btnTooltip?: string;
    children?: ReactNode;
  };

  const nestedCard = props.card;
  const id = props.id ?? nestedCard?.id;
  if (id == null && getGetStartedSlot(el.type) !== "card-anchor") {
    return parseCardFromChildren(el);
  }

  const kids = props.children;
  const titleEl = findSlotElement(kids, "card-title-band");
  const descriptionEl = findSlotElement(kids, "card-description");
  const noteEl = findSlotElement(kids, "card-note");
  const badgeEl = findSlotElement(kids, "card-icon-badge");
  const innerCard = findSlotElement(kids, "card");

  const inner =
    innerCard && getGetStartedSlot(el.type) === "card-anchor"
      ? readCardProps(innerCard)
      : null;

  const titleNode = titleEl
    ? (titleEl.props as { children?: ReactNode }).children
    : undefined;
  const descriptionNode = descriptionEl
    ? (descriptionEl.props as { children?: ReactNode }).children
    : undefined;
  const noteNode = noteEl
    ? (noteEl.props as { children?: ReactNode }).children
    : undefined;
  const badgeShape = badgeEl
    ? (badgeEl.props as { shape?: string; icon?: string }).shape ??
      (badgeEl.props as { icon?: string }).icon
    : undefined;

  const title =
    flattenText(titleNode).trim() ||
    props.title ||
    nestedCard?.title ||
    inner?.title ||
    "";
  const description =
    flattenText(descriptionNode).trim() ||
    props.description ||
    props.text ||
    inner?.description ||
    "";
  const note =
    flattenText(noteNode).trim() || props.note || inner?.note || undefined;
  const resolvedId = id ?? inner?.id;
  if (resolvedId == null) return inner;

  return {
    id: String(resolvedId),
    title,
    description,
    note,
    icon: props.icon ?? props.iconShapeName ?? badgeShape ?? inner?.icon,
    cardState: props.cardState ?? inner?.cardState,
    isDisabled: props.isDisabled ?? inner?.isDisabled,
    isRequired: props.isRequired ?? inner?.isRequired,
    isConfigured: props.isConfigured ?? inner?.isConfigured,
    actionButtonText: props.actionButtonText ?? inner?.actionButtonText,
    actionButtonTextIfConfigured:
      props.actionButtonTextIfConfigured ?? inner?.actionButtonTextIfConfigured,
    configureButtonTooltip:
      props.configureButtonTooltip ?? props.btnTooltip ?? inner?.configureButtonTooltip,
    titleNode,
    descriptionNode,
    noteNode,
  };
}

function parseCardFromChildren(el: ReactElement): ParsedGetStartedCard | null {
  const kids = (el.props as { children?: ReactNode }).children;
  const innerCard = findSlotElement(kids, "card");
  if (innerCard) return readCardProps(innerCard);
  return null;
}

export function parseGetStartedCards(children: ReactNode): ParsedGetStartedCard[] {
  return collectMainSlots(children)
    .cards.map((child) => readCardProps(child))
    .filter((card): card is ParsedGetStartedCard => card != null && Boolean(card.id));
}

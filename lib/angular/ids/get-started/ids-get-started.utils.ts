import {
  GET_STARTED_DEFAULTS,
  type GetStartedCardState,
  type GetStartedOverflowPage,
} from "@component-contracts/ids/get-started.contract";
import type { IdsGetStartedCardInput } from "./ids-get-started.types";

export function resolveBoolean(value: unknown, fallback = false): boolean {
  return typeof value === "boolean" ? value : fallback;
}

export function resolveOverflowPage(value: unknown): GetStartedOverflowPage {
  if (value === "page1" || value === "page2") return value;
  return "single";
}

export function resolveCardState(card: IdsGetStartedCardInput): GetStartedCardState {
  if (
    card.cardState === "completed" ||
    card.cardState === "required" ||
    card.cardState === "not-completed"
  ) {
    return card.cardState;
  }
  if (card.isRequired) return "required";
  if (card.isConfigured) return "completed";
  return "not-completed";
}

export function cardDescription(card: IdsGetStartedCardInput): string {
  return card.description ?? card.text ?? "";
}

export function cardIconSlug(card: IdsGetStartedCardInput): string {
  return card.icon ?? card.iconShapeName ?? "";
}

export function sequentialActiveIndex(cards: IdsGetStartedCardInput[]): number {
  const firstIncomplete = cards.findIndex(
    (card) => resolveCardState(card) !== "completed",
  );
  return firstIncomplete >= 0 ? firstIncomplete : 0;
}

export function isSkipDisabled(
  sequential: boolean,
  overflowPage: GetStartedOverflowPage,
): boolean {
  return sequential && (overflowPage === "single" || overflowPage === "page1");
}

export function isConfigureEnabled(
  card: IdsGetStartedCardInput,
  sequential: boolean,
  cardIndex: number,
  activeIndex: number,
): boolean {
  if (card.isDisabled) return false;
  if (!sequential) return true;
  return cardIndex === activeIndex;
}

export function configureButtonLabel(card: IdsGetStartedCardInput): string {
  const state = resolveCardState(card);
  if (state === "completed" && card.actionButtonTextIfConfigured) {
    return card.actionButtonTextIfConfigured;
  }
  return card.actionButtonText ?? GET_STARTED_DEFAULTS.configureButtonText;
}

export function resolveTitle(
  title?: string,
  bannerTitle?: string,
): string {
  return title ?? bannerTitle ?? GET_STARTED_DEFAULTS.title;
}

export function resolveSubtitle(
  subtitle?: string,
  bannerDescription?: string,
): string {
  return subtitle ?? bannerDescription ?? GET_STARTED_DEFAULTS.subtitle;
}

export function resolveSkipLabel(
  skipButtonText?: string,
  launchButtonText?: string,
): string {
  return skipButtonText ?? launchButtonText ?? GET_STARTED_DEFAULTS.skipButtonText;
}

export function resolveShowMasthead(
  showMasthead?: boolean,
  isHeaderRequired?: boolean,
): boolean {
  return showMasthead ?? isHeaderRequired ?? GET_STARTED_DEFAULTS.showMasthead;
}

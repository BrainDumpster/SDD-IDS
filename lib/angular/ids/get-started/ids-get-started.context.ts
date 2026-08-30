import { InjectionToken } from "@angular/core";
import type {
  IdsGetStartedCardInput,
  IdsGetStartedCardState,
  IdsGetStartedMastheadProps,
  IdsGetStartedOverflowDirection,
  IdsGetStartedOverflowPage,
} from "./ids-get-started.types";

export interface IdsGetStartedRuntimeContext {
  readonly heroTitle: string;
  readonly heroSubtitle: string;
  readonly isOverflow: boolean;
  readonly isSequential: boolean;
  readonly overflowPage: IdsGetStartedOverflowPage;
  readonly isMastheadVisible: boolean;
  readonly headerActionsDisabled: boolean;
  readonly productName: string;
  readonly mastheadProps?: IdsGetStartedMastheadProps;
  readonly skipLabel: string;
  readonly skipTooltip?: string;
  readonly skipDisabled: boolean;
  readonly cards: IdsGetStartedCardInput[];
  readonly activeSequentialIndex: number;
  readonly canScrollLeft: boolean;
  readonly canScrollRight: boolean;
  readonly honeycombSrc: string;
  scrollByDirection(direction: IdsGetStartedOverflowDirection): void;
  emitConfigure(card: IdsGetStartedCardInput): void;
  emitSkip(): void;
  registerCardTrack(el: HTMLElement | null): void;
}

export interface IdsGetStartedCardRuntimeContext {
  readonly card: IdsGetStartedCardInput;
  readonly index: number;
  readonly state: IdsGetStartedCardState;
  readonly configureEnabled: boolean;
}

export const IDS_GET_STARTED_CONTEXT =
  new InjectionToken<IdsGetStartedRuntimeContext>("IDS_GET_STARTED_CONTEXT");

export const IDS_GET_STARTED_CARD_CONTEXT =
  new InjectionToken<IdsGetStartedCardRuntimeContext>(
    "IDS_GET_STARTED_CARD_CONTEXT",
  );

/**
 * IDS Get Started — React implementation generated from design-spec.
 *
 * Path: `lib/react/ids/get-started`
 * Source: `components/ids/get-started/design-spec.md`
 * Theme: `components/ids-theme.css`
 *
 * Anatomy (deterministic child order — root is GetStarted / IdsGetStarted, not GetStartedRoot):
 *   IdsGetStarted
 *     IdsGetStartedHeroHeader
 *       IdsGetStartedHeroBackground
 *       IdsGetStartedHeroShadowBand
 *       IdsGetStartedHeroHoneycomb
 *       IdsGetStartedMastheadSlot?
 *       IdsGetStartedHeroTitle
 *       IdsGetStartedHeroSubtitle
 *     IdsGetStartedContainer
 *       IdsGetStartedCardTrack
 *         IdsGetStartedCardAnchor[]
 *           IdsGetStartedCardIconBadge
 *           IdsGetStartedCard
 *             IdsGetStartedCardTitleBand
 *             IdsGetStartedCardContentPanel
 *               IdsGetStartedCardDescription
 *               IdsGetStartedCardNote?
 *               IdsGetStartedCardConfigureButton
 *       IdsGetStartedSkipButton
 *     IdsGetStartedOverflowEdge?
 *       IdsGetStartedOverflowGradient
 *       IdsGetStartedOverflowArrow
 *         IdsGetStartedOverflowNavButton
 *
 * Prop-driven `cards[]` emits this tree. Compound `children` fill the same slots.
 * No @base-ui-components dependency.
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { IdsButton, IdsButtonLabel } from "../button";
import { IdsIcon } from "../icon";
import {
  collectMainSlots,
  collectSlotElements,
  findSlotElement,
  flattenText,
  hasGetStartedAnatomyChildren,
  markGetStartedSlot,
  parseGetStartedCards,
  type ParsedGetStartedCard,
} from "./IdsGetStarted.compose";
import styles from "./IdsGetStarted.module.css";

const CARD_SCROLL_STEP = 345;
const DEFAULT_TITLE = "Get Started";
const DEFAULT_SUBTITLE =
  "Pre-configure key areas within the product below before launching the application.";
const DEFAULT_SKIP_LABEL = "Skip";
const DEFAULT_CONFIGURE_LABEL = "Configure";
const DEFAULT_PRODUCT_NAME = "Product Name";

const honeycombUrl = (() => {
  const modules = import.meta.glob<string>("../../../../assets/images/honeycomb.png", {
    eager: true,
    query: "?url",
    import: "default",
  });
  return Object.values(modules)[0];
})();

const s = {
  root: styles["IdsGetStarted"],
  hero: styles["IdsGetStartedHeroHeader"],
  heroBackground: styles["IdsGetStartedHeroBackground"],
  heroShadowBand: styles["IdsGetStartedHeroShadowBand"],
  heroHoneycomb: styles["IdsGetStartedHeroHoneycomb"],
  heroHoneycombImg: styles["IdsGetStartedHeroHoneycombImg"],
  heroCopy: styles["IdsGetStartedHeroCopy"],
  heroTitle: styles["IdsGetStartedHeroTitle"],
  heroSubtitle: styles["IdsGetStartedHeroSubtitle"],
  mastheadSlot: styles["IdsGetStartedMastheadSlot"],
  mastheadSlotDisabled: styles["IdsGetStartedMastheadSlot--actionsDisabled"],
  masthead: styles["IdsGetStartedMasthead"],
  mastheadLeft: styles["IdsGetStartedMastheadLeft"],
  mastheadLogo: styles["IdsGetStartedMastheadLogo"],
  mastheadProductName: styles["IdsGetStartedMastheadProductName"],
  mastheadActions: styles["IdsGetStartedMastheadActions"],
  mastheadAction: styles["IdsGetStartedMastheadAction"],
  mastheadAvatar: styles["IdsGetStartedMastheadAvatar"],
  container: styles["IdsGetStartedContainer"],
  cardTrack: styles["IdsGetStartedCardTrack"],
  cardTrackOverflow: styles["IdsGetStartedCardTrack--overflow"],
  cardTrackCentered: styles["IdsGetStartedCardTrack--centered"],
  cardAnchor: styles["IdsGetStartedCardAnchor"],
  card: styles["IdsGetStartedCard"],
  cardTitleBand: styles["IdsGetStartedCardTitleBand"],
  cardTitleBandRequired: styles["IdsGetStartedCardTitleBand--required"],
  cardTitle: styles["IdsGetStartedCardTitle"],
  cardRequired: styles["IdsGetStartedCardRequired"],
  iconBadge: styles["IdsGetStartedCardIconBadge"],
  iconBadgeIncomplete: styles["IdsGetStartedCardIconBadge--incomplete"],
  iconBadgeCompleted: styles["IdsGetStartedCardIconBadge--completed"],
  contentPanel: styles["IdsGetStartedCardContentPanel"],
  bodyGroup: styles["IdsGetStartedCardBodyGroup"],
  description: styles["IdsGetStartedCardDescription"],
  note: styles["IdsGetStartedCardNote"],
  noteLabel: styles["IdsGetStartedCardNoteLabel"],
  configureButton: styles["IdsGetStartedCardConfigureButton"],
  skipButton: styles["IdsGetStartedSkipButton"],
  overflowEdge: styles["IdsGetStartedOverflowEdge"],
  overflowEdgeRight: styles["IdsGetStartedOverflowEdge--right"],
  overflowEdgeLeft: styles["IdsGetStartedOverflowEdge--left"],
  overflowGradient: styles["IdsGetStartedOverflowGradient"],
  overflowArrow: styles["IdsGetStartedOverflowArrow"],
  overflowNavButton: styles["IdsGetStartedOverflowNavButton"],
};

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export type IdsGetStartedCardState = "not-completed" | "completed" | "required";
export type IdsGetStartedOverflowPage = "single" | "page1" | "page2";
export type IdsGetStartedOverflowSide = "left" | "right";

export interface IdsGetStartedCardInput {
  id: string | number;
  title: string;
  description?: string;
  /** Legacy alias for `description`. */
  text?: string;
  note?: string;
  icon?: string;
  /** Legacy alias for `icon`. */
  iconShapeName?: string;
  cardState?: IdsGetStartedCardState;
  isDisabled?: boolean;
  isRequired?: boolean;
  isConfigured?: boolean;
  actionButtonText?: string;
  actionButtonTextIfConfigured?: string;
  configureButtonTooltip?: string;
  /** Legacy alias for `configureButtonTooltip`. */
  btnTooltip?: string;
}

export interface IdsGetStartedMastheadProps {
  productName?: ReactNode;
  logo?: ReactNode;
  iconsSlot?: ReactNode;
  avatarSlot?: ReactNode;
}

export interface IdsGetStartedProps {
  title?: string;
  /** Legacy alias for `title`. */
  bannerTitle?: string;
  subtitle?: string;
  /** Legacy alias for `subtitle`. */
  bannerDescription?: string;
  cards?: IdsGetStartedCardInput[];
  overflow?: boolean;
  sequential?: boolean;
  overflowPage?: IdsGetStartedOverflowPage;
  showMasthead?: boolean;
  /** Legacy alias for `showMasthead`. */
  isHeaderRequired?: boolean;
  headerActionsDisabled?: boolean;
  productName?: string;
  mastheadProps?: IdsGetStartedMastheadProps;
  mastheadSlot?: ReactNode;
  skipButtonText?: string;
  /** Legacy alias for `skipButtonText`. */
  launchButtonText?: string;
  skipButtonTooltip?: string;
  /** Legacy alias for `skipButtonTooltip`. */
  launchButtonTooltip?: string;
  onConfigure?: (card: IdsGetStartedCardInput) => void;
  /** Legacy alias for `onConfigure`. */
  configureModuleAction?: (card: IdsGetStartedCardInput) => void;
  onSkip?: () => void;
  /** Legacy alias for `onSkip`. */
  launchModulesAction?: () => void;
  onOverflowNavigate?: (direction: "prev" | "next") => void;
  children?: ReactNode;
  className?: string;
}

function resolveBoolean(value: unknown, fallback = false): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function resolveOverflowPage(value: unknown): IdsGetStartedOverflowPage {
  if (value === "page1" || value === "page2") return value;
  return "single";
}

function resolveCardState(card: IdsGetStartedCardInput): IdsGetStartedCardState {
  if (card.cardState === "completed" || card.cardState === "required" || card.cardState === "not-completed") {
    return card.cardState;
  }
  if (card.isRequired) return "required";
  if (card.isConfigured) return "completed";
  return "not-completed";
}

function cardDescription(card: IdsGetStartedCardInput): string {
  return card.description ?? card.text ?? "";
}

function cardIconSlug(card: IdsGetStartedCardInput): string {
  return card.icon ?? card.iconShapeName ?? "";
}

function sequentialActiveIndex(cards: IdsGetStartedCardInput[]): number {
  const firstIncomplete = cards.findIndex((card) => resolveCardState(card) !== "completed");
  return firstIncomplete >= 0 ? firstIncomplete : 0;
}

function isSkipDisabled(sequential: boolean, overflowPage: IdsGetStartedOverflowPage): boolean {
  return sequential && (overflowPage === "single" || overflowPage === "page1");
}

function isConfigureEnabled(
  card: IdsGetStartedCardInput,
  sequential: boolean,
  cardIndex: number,
  activeIndex: number,
): boolean {
  if (card.isDisabled) return false;
  if (!sequential) return true;
  return cardIndex === activeIndex;
}

function configureButtonLabel(card: IdsGetStartedCardInput): string {
  const state = resolveCardState(card);
  if (state === "completed" && card.actionButtonTextIfConfigured) {
    return card.actionButtonTextIfConfigured;
  }
  return card.actionButtonText ?? DEFAULT_CONFIGURE_LABEL;
}

function parsedToCard(parsed: ParsedGetStartedCard): IdsGetStartedCardInput {
  return {
    id: parsed.id,
    title: parsed.title,
    description: parsed.description,
    note: parsed.note,
    icon: parsed.icon,
    cardState: parsed.cardState,
    isDisabled: parsed.isDisabled,
    isRequired: parsed.isRequired,
    isConfigured: parsed.isConfigured,
    actionButtonText: parsed.actionButtonText,
    actionButtonTextIfConfigured: parsed.actionButtonTextIfConfigured,
    configureButtonTooltip: parsed.configureButtonTooltip,
  };
}

/* -------------------------------------------------------------------------- */
/* Context                                                                    */
/* -------------------------------------------------------------------------- */

interface IdsGetStartedContextValue {
  title: string;
  subtitle: string;
  overflow: boolean;
  sequential: boolean;
  overflowPage: IdsGetStartedOverflowPage;
  showMasthead: boolean;
  headerActionsDisabled: boolean;
  productName: string;
  mastheadProps?: IdsGetStartedMastheadProps;
  mastheadSlot?: ReactNode;
  skipLabel: string;
  skipTooltip?: string;
  skipDisabled: boolean;
  cards: IdsGetStartedCardInput[];
  activeSequentialIndex: number;
  canScrollLeft: boolean;
  canScrollRight: boolean;
  trackRef: React.RefObject<HTMLDivElement | null>;
  scrollByDirection: (direction: "prev" | "next") => void;
  onConfigure?: (card: IdsGetStartedCardInput) => void;
  onSkip?: () => void;
}

interface IdsGetStartedCardContextValue {
  card: IdsGetStartedCardInput;
  index: number;
  state: IdsGetStartedCardState;
  configureEnabled: boolean;
}

const IdsGetStartedContext = createContext<IdsGetStartedContextValue | null>(null);
const IdsGetStartedCardContext = createContext<IdsGetStartedCardContextValue | null>(null);
const IdsGetStartedCardAnchorFlag = createContext(false);

function useGetStarted(slot: string): IdsGetStartedContextValue {
  const ctx = useContext(IdsGetStartedContext);
  if (!ctx) {
    throw new Error(`${slot} must be used within GetStarted.`);
  }
  return ctx;
}

function useGetStartedCard(slot: string): IdsGetStartedCardContextValue {
  const ctx = useContext(IdsGetStartedCardContext);
  if (!ctx) {
    throw new Error(`${slot} must be used within GetStarted.Card or GetStarted.CardAnchor.`);
  }
  return ctx;
}

/* -------------------------------------------------------------------------- */
/* Hero slots                                                                 */
/* -------------------------------------------------------------------------- */

export interface IdsGetStartedHeroBackgroundProps {
  className?: string;
}

export function IdsGetStartedHeroBackground({ className }: IdsGetStartedHeroBackgroundProps) {
  useGetStarted("GetStarted.HeroBackground");
  return (
    <div
      className={cx(s.heroBackground, className)}
      data-ids="IdsGetStartedHeroBackground"
      data-node-id="12189:231402"
      aria-hidden="true"
    />
  );
}
IdsGetStartedHeroBackground.displayName = "IdsGetStartedHeroBackground";
markGetStartedSlot(IdsGetStartedHeroBackground, "hero-background");

export interface IdsGetStartedHeroShadowBandProps {
  className?: string;
}

export function IdsGetStartedHeroShadowBand({ className }: IdsGetStartedHeroShadowBandProps) {
  useGetStarted("GetStarted.HeroShadowBand");
  return (
    <div
      className={cx(s.heroShadowBand, className)}
      data-ids="IdsGetStartedHeroShadowBand"
      data-node-id="12189:231403"
      aria-hidden="true"
    />
  );
}
IdsGetStartedHeroShadowBand.displayName = "IdsGetStartedHeroShadowBand";
markGetStartedSlot(IdsGetStartedHeroShadowBand, "hero-shadow-band");

export interface IdsGetStartedHeroHoneycombProps {
  className?: string;
  src?: string;
}

export function IdsGetStartedHeroHoneycomb({ className, src }: IdsGetStartedHeroHoneycombProps) {
  useGetStarted("GetStarted.HeroHoneycomb");
  const url = src ?? honeycombUrl;
  if (!url) return null;
  return (
    <div
      className={cx(s.heroHoneycomb, className)}
      data-ids="IdsGetStartedHeroHoneycomb"
      data-node-id="12189:231404"
      aria-hidden="true"
    >
      <img className={s.heroHoneycombImg} src={url} alt="" />
    </div>
  );
}
IdsGetStartedHeroHoneycomb.displayName = "IdsGetStartedHeroHoneycomb";
markGetStartedSlot(IdsGetStartedHeroHoneycomb, "hero-honeycomb");

function DefaultMastheadChrome({
  productName,
  actionsDisabled,
  mastheadProps,
}: {
  productName: string;
  actionsDisabled: boolean;
  mastheadProps?: IdsGetStartedMastheadProps;
}) {
  const name = mastheadProps?.productName ?? productName;
  const disabledProps = actionsDisabled
    ? ({ disabled: true, "aria-disabled": true } as const)
    : {};

  return (
    <header className={s.masthead} data-ids="IdsGetStartedMasthead">
      <div className={s.mastheadLeft}>
        <div className={s.mastheadLogo}>
          {mastheadProps?.logo ?? (
            <IdsIcon
              shape="appic-dp-cloud-blue"
              variant="img"
              size={32}
              title="Product logo"
            />
          )}
        </div>
        <span className={s.mastheadProductName}>{name}</span>
      </div>
      <div className={s.mastheadActions}>
        {mastheadProps?.iconsSlot ?? (
          <>
            <button
              type="button"
              className={s.mastheadAction}
              aria-label="Alerts"
              {...disabledProps}
            >
              <IdsIcon shape="alert-bell-16" size={16} color="var(--color-icon-gray-white)" />
            </button>
            <button
              type="button"
              className={s.mastheadAction}
              aria-label="Help"
              {...disabledProps}
            >
              <IdsIcon shape="help-circ-16" size={16} color="var(--color-icon-gray-white)" />
            </button>
          </>
        )}
        {mastheadProps?.avatarSlot ?? (
          <button
            type="button"
            className={s.mastheadAction}
            aria-label="User settings"
            {...disabledProps}
          >
            <span className={s.mastheadAvatar} aria-hidden="true">
              DT
            </span>
          </button>
        )}
      </div>
    </header>
  );
}

export interface IdsGetStartedMastheadSlotProps {
  children?: ReactNode;
  className?: string;
}

export function IdsGetStartedMastheadSlot({ children, className }: IdsGetStartedMastheadSlotProps) {
  const ctx = useGetStarted("GetStarted.MastheadSlot");
  if (!ctx.showMasthead) return null;
  return (
    <div
      className={cx(
        s.mastheadSlot,
        ctx.headerActionsDisabled && s.mastheadSlotDisabled,
        className,
      )}
      data-ids="IdsGetStartedMastheadSlot"
    >
      {children ??
        ctx.mastheadSlot ?? (
          <DefaultMastheadChrome
            productName={ctx.productName}
            actionsDisabled={ctx.headerActionsDisabled}
            mastheadProps={ctx.mastheadProps}
          />
        )}
    </div>
  );
}
IdsGetStartedMastheadSlot.displayName = "IdsGetStartedMastheadSlot";
markGetStartedSlot(IdsGetStartedMastheadSlot, "masthead");

export interface IdsGetStartedHeroTitleProps {
  children?: ReactNode;
  className?: string;
  id?: string;
}

export function IdsGetStartedHeroTitle({ children, className, id }: IdsGetStartedHeroTitleProps) {
  const ctx = useGetStarted("GetStarted.HeroTitle");
  return (
    <h1
      id={id}
      className={cx(s.heroTitle, className)}
      data-ids="IdsGetStartedHeroTitle"
    >
      {children ?? ctx.title}
    </h1>
  );
}
IdsGetStartedHeroTitle.displayName = "IdsGetStartedHeroTitle";
markGetStartedSlot(IdsGetStartedHeroTitle, "hero-title");

export interface IdsGetStartedHeroSubtitleProps {
  children?: ReactNode;
  className?: string;
}

export function IdsGetStartedHeroSubtitle({ children, className }: IdsGetStartedHeroSubtitleProps) {
  const ctx = useGetStarted("GetStarted.HeroSubtitle");
  return (
    <p
      className={cx(s.heroSubtitle, className)}
      data-ids="IdsGetStartedHeroSubtitle"
    >
      {children ?? ctx.subtitle}
    </p>
  );
}
IdsGetStartedHeroSubtitle.displayName = "IdsGetStartedHeroSubtitle";
markGetStartedSlot(IdsGetStartedHeroSubtitle, "hero-subtitle");

export interface IdsGetStartedHeroHeaderProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
}

export function IdsGetStartedHeroHeader({
  children,
  className,
  ...rest
}: IdsGetStartedHeroHeaderProps) {
  const ctx = useGetStarted("GetStarted.HeroHeader");
  const background = findSlotElement(children, "hero-background") ?? <IdsGetStartedHeroBackground />;
  const shadow = findSlotElement(children, "hero-shadow-band") ?? <IdsGetStartedHeroShadowBand />;
  const honeycomb = findSlotElement(children, "hero-honeycomb") ?? <IdsGetStartedHeroHoneycomb />;
  const masthead =
    findSlotElement(children, "masthead") ??
    (ctx.showMasthead ? <IdsGetStartedMastheadSlot /> : null);
  const title = findSlotElement(children, "hero-title") ?? <IdsGetStartedHeroTitle />;
  const subtitle = findSlotElement(children, "hero-subtitle") ?? <IdsGetStartedHeroSubtitle />;

  return (
    <header
      className={cx(s.hero, className)}
      data-ids="IdsGetStartedHeroHeader"
      data-node-id="12189:231401"
      {...rest}
    >
      {background}
      {shadow}
      {honeycomb}
      {masthead}
      <div className={s.heroCopy}>
        {title}
        {subtitle}
      </div>
    </header>
  );
}
IdsGetStartedHeroHeader.displayName = "IdsGetStartedHeroHeader";
markGetStartedSlot(IdsGetStartedHeroHeader, "hero-header");

/* -------------------------------------------------------------------------- */
/* Card slots                                                                 */
/* -------------------------------------------------------------------------- */

export interface IdsGetStartedCardIconBadgeProps {
  shape?: string;
  className?: string;
}

export function IdsGetStartedCardIconBadge({ shape, className }: IdsGetStartedCardIconBadgeProps) {
  const { card, state } = useGetStartedCard("GetStarted.CardIconBadge");
  const isCompleted = state === "completed";
  const slug = shape ?? cardIconSlug(card);
  return (
    <div
      className={cx(
        s.iconBadge,
        isCompleted ? s.iconBadgeCompleted : s.iconBadgeIncomplete,
        className,
      )}
      data-ids="IdsGetStartedCardIconBadge"
      aria-hidden={isCompleted ? undefined : true}
    >
      {isCompleted ? (
        <IdsIcon
          shape="shape-check-thick"
          size={32}
          color="var(--color-icon-gray-white)"
        />
      ) : slug ? (
        <IdsIcon
          shape={slug}
          size={32}
          color="var(--color-icon-gray-neutral-accessible)"
        />
      ) : null}
    </div>
  );
}
IdsGetStartedCardIconBadge.displayName = "IdsGetStartedCardIconBadge";
markGetStartedSlot(IdsGetStartedCardIconBadge, "card-icon-badge");

export interface IdsGetStartedCardTitleBandProps {
  children?: ReactNode;
  className?: string;
}

export function IdsGetStartedCardTitleBand({ children, className }: IdsGetStartedCardTitleBandProps) {
  const { card, index, state } = useGetStartedCard("GetStarted.CardTitleBand");
  const ctx = useGetStarted("GetStarted.CardTitleBand");
  const isRequired = state === "required";
  const label = children ?? (ctx.sequential ? `${index + 1}. ${card.title}` : card.title);
  return (
    <div
      className={cx(s.cardTitleBand, isRequired && s.cardTitleBandRequired, className)}
      data-ids="IdsGetStartedCardTitleBand"
    >
      <h2 className={s.cardTitle}>{label}</h2>
      {isRequired ? <p className={s.cardRequired}>Required</p> : null}
    </div>
  );
}
IdsGetStartedCardTitleBand.displayName = "IdsGetStartedCardTitleBand";
markGetStartedSlot(IdsGetStartedCardTitleBand, "card-title-band");

export interface IdsGetStartedCardDescriptionProps {
  children?: ReactNode;
  className?: string;
}

export function IdsGetStartedCardDescription({
  children,
  className,
}: IdsGetStartedCardDescriptionProps) {
  const { card } = useGetStartedCard("GetStarted.CardDescription");
  return (
    <p
      className={cx(s.description, className)}
      data-ids="IdsGetStartedCardDescription"
    >
      {children ?? cardDescription(card)}
    </p>
  );
}
IdsGetStartedCardDescription.displayName = "IdsGetStartedCardDescription";
markGetStartedSlot(IdsGetStartedCardDescription, "card-description");

export interface IdsGetStartedCardNoteProps {
  children?: ReactNode;
  className?: string;
}

export function IdsGetStartedCardNote({ children, className }: IdsGetStartedCardNoteProps) {
  const { card } = useGetStartedCard("GetStarted.CardNote");
  const note = children ?? card.note;
  if (!note) return null;
  const isPlainString = typeof note === "string";
  return (
    <p
      className={cx(s.note, className)}
      data-ids="IdsGetStartedCardNote"
    >
      {isPlainString ? (
        <>
          <span className={s.noteLabel}>Note:</span> {note}
        </>
      ) : (
        note
      )}
    </p>
  );
}
IdsGetStartedCardNote.displayName = "IdsGetStartedCardNote";
markGetStartedSlot(IdsGetStartedCardNote, "card-note");

export interface IdsGetStartedCardConfigureButtonProps {
  children?: ReactNode;
  className?: string;
}

export function IdsGetStartedCardConfigureButton({
  children,
  className,
}: IdsGetStartedCardConfigureButtonProps) {
  const { card, configureEnabled } = useGetStartedCard("GetStarted.CardConfigureButton");
  const ctx = useGetStarted("GetStarted.CardConfigureButton");
  const label = flattenText(children).trim() || configureButtonLabel(card);
  const tooltip = card.configureButtonTooltip ?? card.btnTooltip;
  return (
    <IdsButton
      type="button"
      variant="primary"
      size="large"
      disabled={!configureEnabled}
      ariaLabel={`${label} ${card.title}`}
      title={tooltip}
      className={cx(s.configureButton, className)}
      data-slot="IdsGetStartedCardConfigureButton"
      onClick={() => ctx.onConfigure?.(card)}
    >
      <IdsButtonLabel>{children ?? label}</IdsButtonLabel>
    </IdsButton>
  );
}
IdsGetStartedCardConfigureButton.displayName = "IdsGetStartedCardConfigureButton";
markGetStartedSlot(IdsGetStartedCardConfigureButton, "card-configure-button");

export interface IdsGetStartedCardContentPanelProps {
  children?: ReactNode;
  className?: string;
}

export function IdsGetStartedCardContentPanel({
  children,
  className,
}: IdsGetStartedCardContentPanelProps) {
  useGetStartedCard("GetStarted.CardContentPanel");
  const description = findSlotElement(children, "card-description") ?? <IdsGetStartedCardDescription />;
  const note = findSlotElement(children, "card-note") ?? <IdsGetStartedCardNote />;
  const configure =
    findSlotElement(children, "card-configure-button") ?? <IdsGetStartedCardConfigureButton />;
  return (
    <div
      className={cx(s.contentPanel, className)}
      data-ids="IdsGetStartedCardContentPanel"
    >
      <div className={s.bodyGroup}>
        {description}
        {note}
      </div>
      {configure}
    </div>
  );
}
IdsGetStartedCardContentPanel.displayName = "IdsGetStartedCardContentPanel";
markGetStartedSlot(IdsGetStartedCardContentPanel, "card-content-panel");

export interface IdsGetStartedCardShellProps {
  children?: ReactNode;
  className?: string;
}

export function IdsGetStartedCardShell({ children, className }: IdsGetStartedCardShellProps) {
  const { state } = useGetStartedCard("GetStarted.Card");
  const titleBand = findSlotElement(children, "card-title-band") ?? <IdsGetStartedCardTitleBand />;
  const panel = findSlotElement(children, "card-content-panel") ?? <IdsGetStartedCardContentPanel />;
  return (
    <article
      className={cx(s.card, className)}
      data-ids="IdsGetStartedCard"
      data-card-state={state}
    >
      {titleBand}
      {panel}
    </article>
  );
}
IdsGetStartedCardShell.displayName = "IdsGetStartedCardShell";

export interface IdsGetStartedCardAnchorProps extends Partial<IdsGetStartedCardInput> {
  card?: IdsGetStartedCardInput;
  index?: number;
  children?: ReactNode;
  className?: string;
}

function CardProvider({
  card,
  index,
  children,
}: {
  card: IdsGetStartedCardInput;
  index: number;
  children: ReactNode;
}) {
  const ctx = useGetStarted("GetStarted.CardAnchor");
  const state = resolveCardState(card);
  const value = useMemo<IdsGetStartedCardContextValue>(
    () => ({
      card,
      index,
      state,
      configureEnabled: isConfigureEnabled(card, ctx.sequential, index, ctx.activeSequentialIndex),
    }),
    [card, index, state, ctx.sequential, ctx.activeSequentialIndex],
  );
  return (
    <IdsGetStartedCardContext.Provider value={value}>{children}</IdsGetStartedCardContext.Provider>
  );
}

function DefaultCardInterior() {
  return (
    <>
      <IdsGetStartedCardIconBadge />
      <IdsGetStartedCardShell>
        <IdsGetStartedCardTitleBand />
        <IdsGetStartedCardContentPanel>
          <IdsGetStartedCardDescription />
          <IdsGetStartedCardNote />
          <IdsGetStartedCardConfigureButton />
        </IdsGetStartedCardContentPanel>
      </IdsGetStartedCardShell>
    </>
  );
}

export function IdsGetStartedCardAnchor({
  card: cardProp,
  index: indexProp,
  children,
  className,
  ...cardFields
}: IdsGetStartedCardAnchorProps) {
  const parentCard = useContext(IdsGetStartedCardContext);
  const host = useGetStarted("GetStarted.CardAnchor");
  const fromFields =
    cardFields.id != null
      ? ({ ...cardFields, id: cardFields.id, title: cardFields.title ?? "" } as IdsGetStartedCardInput)
      : undefined;
  const card = cardProp ?? fromFields ?? parentCard?.card;
  const index =
    indexProp ??
    parentCard?.index ??
    (card ? host.cards.findIndex((item) => String(item.id) === String(card.id)) : 0);

  const interior = children ?? <DefaultCardInterior />;
  const body = (
    <div
      className={cx(s.cardAnchor, className)}
      data-ids="IdsGetStartedCardAnchor"
    >
      {interior}
    </div>
  );

  if (parentCard) {
    return <IdsGetStartedCardAnchorFlag.Provider value={true}>{body}</IdsGetStartedCardAnchorFlag.Provider>;
  }
  if (!card) {
    return <IdsGetStartedCardAnchorFlag.Provider value={true}>{body}</IdsGetStartedCardAnchorFlag.Provider>;
  }
  return (
    <CardProvider card={card} index={Math.max(index, 0)}>
      <IdsGetStartedCardAnchorFlag.Provider value={true}>{body}</IdsGetStartedCardAnchorFlag.Provider>
    </CardProvider>
  );
}
IdsGetStartedCardAnchor.displayName = "IdsGetStartedCardAnchor";
markGetStartedSlot(IdsGetStartedCardAnchor, "card-anchor");

/** Public card slot — wraps CardAnchor + shell when used as a host child. */
export interface IdsGetStartedCardProps extends Partial<IdsGetStartedCardInput> {
  card?: IdsGetStartedCardInput;
  index?: number;
  children?: ReactNode;
  className?: string;
}

export function IdsGetStartedCard({
  card: cardProp,
  index,
  children,
  className,
  ...cardFields
}: IdsGetStartedCardProps) {
  const inAnchor = useContext(IdsGetStartedCardAnchorFlag);
  const parentCard = useContext(IdsGetStartedCardContext);
  const fromFields =
    cardFields.id != null
      ? ({ ...cardFields, id: cardFields.id, title: cardFields.title ?? "" } as IdsGetStartedCardInput)
      : undefined;
  const card = cardProp ?? fromFields ?? parentCard?.card;

  if (inAnchor) {
    return <IdsGetStartedCardShell className={className}>{children}</IdsGetStartedCardShell>;
  }

  if (!card) {
    return <IdsGetStartedCardShell className={className}>{children}</IdsGetStartedCardShell>;
  }

  return (
    <IdsGetStartedCardAnchor card={card} index={index} className={className}>
      {children ?? <DefaultCardInterior />}
    </IdsGetStartedCardAnchor>
  );
}
IdsGetStartedCard.displayName = "IdsGetStartedCard";
markGetStartedSlot(IdsGetStartedCard, "card");

/* -------------------------------------------------------------------------- */
/* Container / track / skip                                                   */
/* -------------------------------------------------------------------------- */

export interface IdsGetStartedCardTrackProps {
  children?: ReactNode;
  className?: string;
}

export function IdsGetStartedCardTrack({ children, className }: IdsGetStartedCardTrackProps) {
  const ctx = useGetStarted("GetStarted.CardTrack");
  const anchors = collectSlotElements(children, "card-anchor");
  const cards = collectSlotElements(children, "card");

  let content: ReactNode = children;
  if (anchors.length > 0) {
    content = anchors;
  } else if (cards.length > 0) {
    content = cards;
  } else if (!children) {
    content = ctx.cards.map((card, index) => (
      <SynthesizedCard key={String(card.id)} card={card} index={index} />
    ));
  }

  return (
    <div
      ref={ctx.trackRef}
      className={cx(
        s.cardTrack,
        ctx.overflow ? s.cardTrackOverflow : s.cardTrackCentered,
        className,
      )}
      data-ids="IdsGetStartedCardTrack"
      data-gs-card-track
    >
      {content}
    </div>
  );
}
IdsGetStartedCardTrack.displayName = "IdsGetStartedCardTrack";
markGetStartedSlot(IdsGetStartedCardTrack, "card-track");

export interface IdsGetStartedSkipButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "children"> {
  children?: ReactNode;
}

export function IdsGetStartedSkipButton({
  children,
  className,
  onClick,
  ...rest
}: IdsGetStartedSkipButtonProps) {
  const ctx = useGetStarted("GetStarted.SkipButton");
  const label = flattenText(children).trim() || ctx.skipLabel;
  return (
    <IdsButton
      {...rest}
      type="button"
      variant="primary"
      size="large"
      disabled={ctx.skipDisabled}
      title={ctx.skipTooltip}
      className={cx(s.skipButton, className)}
      data-slot="IdsGetStartedSkipButton"
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) ctx.onSkip?.();
      }}
    >
      <IdsButtonLabel>{children ?? label}</IdsButtonLabel>
    </IdsButton>
  );
}
IdsGetStartedSkipButton.displayName = "IdsGetStartedSkipButton";
markGetStartedSlot(IdsGetStartedSkipButton, "skip-button");

export interface IdsGetStartedContainerProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
}

export function IdsGetStartedContainer({
  children,
  className,
  ...rest
}: IdsGetStartedContainerProps) {
  useGetStarted("GetStarted.Container");
  const track = findSlotElement(children, "card-track") ?? <IdsGetStartedCardTrack />;
  const skip = findSlotElement(children, "skip-button") ?? <IdsGetStartedSkipButton />;
  return (
    <section
      className={cx(s.container, className)}
      data-ids="IdsGetStartedContainer"
      aria-label="Get started configuration cards"
      {...rest}
    >
      {track}
      {skip}
    </section>
  );
}
IdsGetStartedContainer.displayName = "IdsGetStartedContainer";
markGetStartedSlot(IdsGetStartedContainer, "container");

/* -------------------------------------------------------------------------- */
/* Overflow slots                                                             */
/* -------------------------------------------------------------------------- */

export interface IdsGetStartedOverflowGradientProps {
  className?: string;
}

export function IdsGetStartedOverflowGradient({ className }: IdsGetStartedOverflowGradientProps) {
  useGetStarted("GetStarted.OverflowGradient");
  return (
    <div
      className={cx(s.overflowGradient, className)}
      data-ids="IdsGetStartedOverflowGradient"
      aria-hidden="true"
    />
  );
}
IdsGetStartedOverflowGradient.displayName = "IdsGetStartedOverflowGradient";
markGetStartedSlot(IdsGetStartedOverflowGradient, "overflow-gradient");

export interface IdsGetStartedOverflowNavButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  direction?: "prev" | "next";
}

const IdsGetStartedOverflowSideContext = createContext<IdsGetStartedOverflowSide>("right");

export function IdsGetStartedOverflowNavButton({
  direction: directionProp,
  className,
  onClick,
  ...rest
}: IdsGetStartedOverflowNavButtonProps) {
  const ctx = useGetStarted("GetStarted.OverflowNavButton");
  const overflowCtx = useContext(IdsGetStartedOverflowSideContext);
  const direction = directionProp ?? (overflowCtx === "left" ? "prev" : "next");
  const label = direction === "prev" ? "Show previous cards" : "Show next cards";
  return (
    <button
      {...rest}
      type="button"
      className={cx(s.overflowNavButton, className)}
      data-ids="IdsGetStartedOverflowNavButton"
      aria-label={rest["aria-label"] ?? label}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) ctx.scrollByDirection(direction);
      }}
    >
      <IdsIcon shape="double-chev-right" size={32} />
    </button>
  );
}
IdsGetStartedOverflowNavButton.displayName = "IdsGetStartedOverflowNavButton";
markGetStartedSlot(IdsGetStartedOverflowNavButton, "overflow-nav-button");

export interface IdsGetStartedOverflowArrowProps {
  children?: ReactNode;
  className?: string;
}

export function IdsGetStartedOverflowArrow({ children, className }: IdsGetStartedOverflowArrowProps) {
  useGetStarted("GetStarted.OverflowArrow");
  const nav = findSlotElement(children, "overflow-nav-button") ?? <IdsGetStartedOverflowNavButton />;
  return (
    <div
      className={cx(s.overflowArrow, className)}
      data-ids="IdsGetStartedOverflowArrow"
    >
      {nav}
    </div>
  );
}
IdsGetStartedOverflowArrow.displayName = "IdsGetStartedOverflowArrow";
markGetStartedSlot(IdsGetStartedOverflowArrow, "overflow-arrow");

export interface IdsGetStartedOverflowEdgeProps {
  side?: IdsGetStartedOverflowSide;
  children?: ReactNode;
  className?: string;
}

export function IdsGetStartedOverflowEdge({
  side = "right",
  children,
  className,
}: IdsGetStartedOverflowEdgeProps) {
  const ctx = useGetStarted("GetStarted.OverflowEdge");
  const visible = side === "left" ? ctx.canScrollLeft : ctx.canScrollRight;
  if (!ctx.overflow || !visible) return null;

  const gradient = findSlotElement(children, "overflow-gradient") ?? <IdsGetStartedOverflowGradient />;
  const arrow = findSlotElement(children, "overflow-arrow") ?? (
    <IdsGetStartedOverflowArrow>
      <IdsGetStartedOverflowNavButton direction={side === "left" ? "prev" : "next"} />
    </IdsGetStartedOverflowArrow>
  );

  return (
    <IdsGetStartedOverflowSideContext.Provider value={side}>
      <aside
        className={cx(
          s.overflowEdge,
          side === "left" ? s.overflowEdgeLeft : s.overflowEdgeRight,
          className,
        )}
        data-ids="IdsGetStartedOverflowEdge"
        data-side={side}
        data-node-id={side === "left" ? "42682:125703" : "12189:232209"}
        aria-label={side === "left" ? "Previous configuration cards" : "More configuration cards"}
      >
        {gradient}
        {arrow}
      </aside>
    </IdsGetStartedOverflowSideContext.Provider>
  );
}
IdsGetStartedOverflowEdge.displayName = "IdsGetStartedOverflowEdge";
markGetStartedSlot(IdsGetStartedOverflowEdge, "overflow-edge");

/* -------------------------------------------------------------------------- */
/* Synthesized card                                                           */
/* -------------------------------------------------------------------------- */

function SynthesizedCard({ card, index }: { card: IdsGetStartedCardInput; index: number }) {
  return (
    <CardProvider card={card} index={index}>
      <IdsGetStartedCardAnchor>
        <DefaultCardInterior />
      </IdsGetStartedCardAnchor>
    </CardProvider>
  );
}

/* -------------------------------------------------------------------------- */
/* Root — GetStarted (not GetStartedRoot)                                     */
/* -------------------------------------------------------------------------- */

export function IdsGetStarted({
  title,
  bannerTitle,
  subtitle,
  bannerDescription,
  cards: cardsProp,
  overflow: overflowProp,
  sequential: sequentialProp,
  overflowPage: overflowPageProp,
  showMasthead,
  isHeaderRequired,
  headerActionsDisabled = false,
  productName = DEFAULT_PRODUCT_NAME,
  mastheadProps,
  mastheadSlot,
  skipButtonText,
  launchButtonText,
  skipButtonTooltip,
  launchButtonTooltip,
  onConfigure,
  configureModuleAction,
  onSkip,
  launchModulesAction,
  onOverflowNavigate,
  children,
  className,
}: IdsGetStartedProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);

  const overflow = resolveBoolean(overflowProp, false);
  const sequential = resolveBoolean(sequentialProp, false);
  const overflowPage = resolveOverflowPage(overflowPageProp);
  const resolvedTitle = title ?? bannerTitle ?? DEFAULT_TITLE;
  const resolvedSubtitle = subtitle ?? bannerDescription ?? DEFAULT_SUBTITLE;
  const resolvedShowMasthead = showMasthead ?? isHeaderRequired ?? true;
  const resolvedSkipLabel = skipButtonText ?? launchButtonText ?? DEFAULT_SKIP_LABEL;
  const resolvedSkipTooltip = skipButtonTooltip ?? launchButtonTooltip;
  const handleConfigure = onConfigure ?? configureModuleAction;
  const handleSkip = onSkip ?? launchModulesAction;

  const anatomy = hasGetStartedAnatomyChildren(children);
  const slots = useMemo(() => collectMainSlots(children), [children]);

  useEffect(() => {
    if (anatomy && cardsProp !== undefined && slots.cards.length > 0) {
      console.warn(
        "[GetStarted] `cards` prop takes precedence over GetStarted.Card child composition.",
      );
    }
  }, [anatomy, cardsProp, slots.cards.length]);

  const parsedFromChildren = useMemo(
    () => (anatomy ? parseGetStartedCards(children) : []),
    [anatomy, children],
  );

  const titleFromChildren = slots.heroTitle
    ? flattenText((slots.heroTitle.props as { children?: ReactNode }).children).trim()
    : undefined;
  const subtitleFromChildren = slots.heroSubtitle
    ? flattenText((slots.heroSubtitle.props as { children?: ReactNode }).children).trim()
    : undefined;

  const cards: IdsGetStartedCardInput[] = useMemo(() => {
    if (cardsProp !== undefined) return cardsProp;
    return parsedFromChildren.map(parsedToCard);
  }, [cardsProp, parsedFromChildren]);

  const activeSequentialIndex = useMemo(() => sequentialActiveIndex(cards), [cards]);
  const skipDisabled = isSkipDisabled(sequential, overflowPage);

  const updateOverflowVisibility = useCallback(() => {
    const track = trackRef.current;
    if (!track || !overflow) {
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }
    setCanScrollLeft(track.scrollLeft > 2);
    setCanScrollRight(track.scrollWidth - track.clientWidth - track.scrollLeft > 2);
  }, [overflow]);

  useEffect(() => {
    updateOverflowVisibility();
    const track = trackRef.current;
    if (!track || !overflow) return undefined;

    const onScroll = () => updateOverflowVisibility();
    track.addEventListener("scroll", onScroll, { passive: true });
    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => updateOverflowVisibility())
        : null;
    resizeObserver?.observe(track);
    window.addEventListener("resize", updateOverflowVisibility);
    return () => {
      track.removeEventListener("scroll", onScroll);
      resizeObserver?.disconnect();
      window.removeEventListener("resize", updateOverflowVisibility);
    };
  }, [overflow, cards, updateOverflowVisibility]);

  const scrollByDirection = useCallback(
    (direction: "prev" | "next") => {
      const track = trackRef.current;
      if (track) {
        const delta = direction === "next" ? CARD_SCROLL_STEP : -CARD_SCROLL_STEP;
        track.scrollBy({ left: delta, behavior: "smooth" });
      }
      onOverflowNavigate?.(direction);
    },
    [onOverflowNavigate],
  );

  const ctx: IdsGetStartedContextValue = {
    title: titleFromChildren || resolvedTitle,
    subtitle: subtitleFromChildren || resolvedSubtitle,
    overflow,
    sequential,
    overflowPage,
    showMasthead: resolvedShowMasthead,
    headerActionsDisabled: Boolean(headerActionsDisabled),
    productName,
    mastheadProps,
    mastheadSlot,
    skipLabel: resolvedSkipLabel,
    skipTooltip: resolvedSkipTooltip,
    skipDisabled,
    cards,
    activeSequentialIndex,
    canScrollLeft,
    canScrollRight,
    trackRef,
    scrollByDirection,
    onConfigure: handleConfigure,
    onSkip: handleSkip,
  };

  const providedRightEdge = slots.overflowEdges.find(
    (edge) => (edge.props as { side?: IdsGetStartedOverflowSide }).side !== "left",
  );
  const providedLeftEdge = slots.overflowEdges.find(
    (edge) => (edge.props as { side?: IdsGetStartedOverflowSide }).side === "left",
  );

  const tree = (
    <>
      {slots.heroHeader ?? (
        <IdsGetStartedHeroHeader>
          <IdsGetStartedHeroBackground />
          <IdsGetStartedHeroShadowBand />
          <IdsGetStartedHeroHoneycomb />
          {resolvedShowMasthead ? (
            slots.masthead ?? <IdsGetStartedMastheadSlot />
          ) : null}
          <IdsGetStartedHeroTitle>{ctx.title}</IdsGetStartedHeroTitle>
          <IdsGetStartedHeroSubtitle>{ctx.subtitle}</IdsGetStartedHeroSubtitle>
        </IdsGetStartedHeroHeader>
      )}
      {slots.container ?? (
        <IdsGetStartedContainer>
          {slots.cardTrack ?? (
            <IdsGetStartedCardTrack>
              {slots.cards.length > 0 && cardsProp === undefined
                ? slots.cards
                : cards.map((card, index) => (
                    <SynthesizedCard key={String(card.id)} card={card} index={index} />
                  ))}
            </IdsGetStartedCardTrack>
          )}
          {slots.skipButton ?? <IdsGetStartedSkipButton />}
        </IdsGetStartedContainer>
      )}
      {providedLeftEdge ?? <IdsGetStartedOverflowEdge side="left" />}
      {providedRightEdge ?? <IdsGetStartedOverflowEdge side="right" />}
    </>
  );

  return (
    <IdsGetStartedContext.Provider value={ctx}>
      <div
        className={cx(s.root, className)}
        data-ids="IdsGetStarted"
        data-overflow={overflow ? "true" : "false"}
        data-sequential={sequential ? "true" : "false"}
      >
        {tree}
      </div>
    </IdsGetStartedContext.Provider>
  );
}

IdsGetStarted.displayName = "GetStarted";

export const IdsGetStartedCompound = Object.assign(IdsGetStarted, {
  HeroHeader: IdsGetStartedHeroHeader,
  HeroBackground: IdsGetStartedHeroBackground,
  HeroShadowBand: IdsGetStartedHeroShadowBand,
  HeroHoneycomb: IdsGetStartedHeroHoneycomb,
  MastheadSlot: IdsGetStartedMastheadSlot,
  HeroTitle: IdsGetStartedHeroTitle,
  HeroSubtitle: IdsGetStartedHeroSubtitle,
  Container: IdsGetStartedContainer,
  CardTrack: IdsGetStartedCardTrack,
  CardAnchor: IdsGetStartedCardAnchor,
  Card: IdsGetStartedCard,
  CardIconBadge: IdsGetStartedCardIconBadge,
  CardTitleBand: IdsGetStartedCardTitleBand,
  CardContentPanel: IdsGetStartedCardContentPanel,
  CardDescription: IdsGetStartedCardDescription,
  CardNote: IdsGetStartedCardNote,
  CardConfigureButton: IdsGetStartedCardConfigureButton,
  SkipButton: IdsGetStartedSkipButton,
  OverflowEdge: IdsGetStartedOverflowEdge,
  OverflowGradient: IdsGetStartedOverflowGradient,
  OverflowArrow: IdsGetStartedOverflowArrow,
  OverflowNavButton: IdsGetStartedOverflowNavButton,
});

/** Anatomy alias — root is GetStarted, not GetStartedRoot. */
export const GetStarted = IdsGetStartedCompound;

export default IdsGetStartedCompound;

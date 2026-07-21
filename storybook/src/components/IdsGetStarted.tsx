import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ComponentProps, ReactNode } from "react";
import { Icon } from "./Icon";
import {
  Masthead,
  MastheadActionButtonContainer,
  MastheadActionIconButton,
  MastheadAvatar,
} from "./Masthead";
import honeycombPng from "../../../assets/images/honeycomb.png";
import styles from "./IdsGetStarted.module.css";

export type IdsGetStartedCardState = "not-completed" | "completed" | "required";

export interface IdsGetStartedCard {
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

export type IdsGetStartedOverflowPage = "single" | "page1" | "page2";

type MastheadConfig = Pick<
  ComponentProps<typeof Masthead>,
  "logo" | "productName" | "iconsSlot" | "appLauncherSlot" | "avatarSlot"
>;

export interface IdsGetStartedProps {
  title?: string;
  /** Legacy alias for `title`. */
  bannerTitle?: string;
  subtitle?: string;
  /** Legacy alias for `subtitle`. */
  bannerDescription?: string;
  cards: IdsGetStartedCard[];
  overflow?: boolean;
  sequential?: boolean;
  overflowPage?: IdsGetStartedOverflowPage;
  showMasthead?: boolean;
  /** Legacy alias for `showMasthead`. */
  isHeaderRequired?: boolean;
  headerActionsDisabled?: boolean;
  productName?: string;
  mastheadProps?: MastheadConfig;
  mastheadSlot?: ReactNode;
  skipButtonText?: string;
  /** Legacy alias for `skipButtonText`. */
  launchButtonText?: string;
  skipButtonTooltip?: string;
  /** Legacy alias for `skipButtonTooltip`. */
  launchButtonTooltip?: string;
  onConfigure?: (card: IdsGetStartedCard) => void;
  /** Legacy alias for `onConfigure`. */
  configureModuleAction?: (card: IdsGetStartedCard) => void;
  onSkip?: () => void;
  /** Legacy alias for `onSkip`. */
  launchModulesAction?: () => void;
  onOverflowNavigate?: (direction: "prev" | "next") => void;
}

const DEFAULT_TITLE = "Get Started";
const DEFAULT_SUBTITLE =
  "Pre-configure key areas within the product below before launching the application.";
const DEFAULT_SKIP_LABEL = "Skip";
const DEFAULT_CONFIGURE_LABEL = "Configure";

function cardDescription(card: IdsGetStartedCard): string {
  return card.description ?? card.text ?? "";
}

function cardIconSlug(card: IdsGetStartedCard): string {
  return card.icon ?? card.iconShapeName ?? "";
}

function resolveCardState(card: IdsGetStartedCard): IdsGetStartedCardState {
  if (card.cardState) return card.cardState;
  if (card.isRequired) return "required";
  if (card.isConfigured) return "completed";
  return "not-completed";
}

function sequentialActiveIndex(cards: IdsGetStartedCard[]): number {
  const firstIncomplete = cards.findIndex(
    (card) => resolveCardState(card) !== "completed",
  );
  return firstIncomplete >= 0 ? firstIncomplete : 0;
}

function isSkipDisabled(sequential: boolean, overflowPage: IdsGetStartedOverflowPage): boolean {
  return sequential && (overflowPage === "single" || overflowPage === "page1");
}

function isConfigureEnabled(
  card: IdsGetStartedCard,
  sequential: boolean,
  cardIndex: number,
  activeIndex: number,
): boolean {
  if (card.isDisabled) return false;
  if (!sequential) return true;
  return cardIndex === activeIndex;
}

function configureButtonLabel(card: IdsGetStartedCard): string {
  const state = resolveCardState(card);
  if (state === "completed" && card.actionButtonTextIfConfigured) {
    return card.actionButtonTextIfConfigured;
  }
  return card.actionButtonText ?? DEFAULT_CONFIGURE_LABEL;
}

function DefaultMasthead({
  productName,
  actionsDisabled,
  mastheadProps,
}: {
  productName: string;
  actionsDisabled?: boolean;
  mastheadProps?: MastheadConfig;
}) {
  const icon16 = { width: 16, height: 16 } as const;
  const disabledProps = actionsDisabled
    ? ({ disabled: true, "aria-disabled": true } as const)
    : {};

  if (mastheadProps) {
    return <Masthead {...mastheadProps} />;
  }

  return (
    <Masthead
      productName={productName}
      logo={
        <Icon
          shapeName="appic-dp-cloud-blue"
          variant="img"
          title="Product logo"
          style={{ width: 32, height: 32 }}
        />
      }
      iconsSlot={
        <MastheadActionButtonContainer>
          <MastheadActionIconButton
            aria-label="Alerts"
            icon={<Icon shapeName="alert-bell-16" style={icon16} />}
            {...disabledProps}
          />
          <MastheadActionIconButton
            aria-label="Help"
            icon={<Icon shapeName="help-circ-16" style={icon16} />}
            {...disabledProps}
          />
        </MastheadActionButtonContainer>
      }
      avatarSlot={
        <MastheadAvatar initials="DT" aria-label="User settings" {...disabledProps} />
      }
    />
  );
}

function GetStartedCardView({
  card,
  index,
  sequential,
  configureEnabled,
  onConfigure,
}: {
  card: IdsGetStartedCard;
  index: number;
  sequential: boolean;
  configureEnabled: boolean;
  onConfigure?: (card: IdsGetStartedCard) => void;
}) {
  const state = resolveCardState(card);
  const isCompleted = state === "completed";
  const isRequired = state === "required";
  const iconSlug = cardIconSlug(card);
  const configureLabel = configureButtonLabel(card);
  const configureTooltip = card.configureButtonTooltip ?? card.btnTooltip;

  return (
    <div className={styles.cardAnchor}>
      <div
        className={[
          styles.iconBadge,
          isCompleted ? styles.iconBadgeCompleted : styles.iconBadgeIncomplete,
        ].join(" ")}
        aria-hidden={isCompleted ? undefined : true}
      >
        <Icon
          shapeName={isCompleted ? "shape-check-thick" : iconSlug}
          className={isCompleted ? styles.cardIconCompleted : styles.cardIcon}
          style={{ width: 32, height: 32 }}
        />
      </div>

      <article className={styles.card} data-card-state={state}>
        <div
          className={[
            styles.cardTitleBand,
            isRequired ? styles.cardTitleBandRequired : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {sequential ? (
            <ol className={[styles.cardTitle, styles.cardTitleSequential].join(" ")} start={index + 1}>
              <li>{card.title}</li>
            </ol>
          ) : (
            <h2 className={styles.cardTitle}>{card.title}</h2>
          )}
          {isRequired ? <p className={styles.cardRequired}>Required</p> : null}
        </div>

        <div className={styles.contentPanel}>
          <div className={styles.bodyGroup}>
            <p className={styles.description}>{cardDescription(card)}</p>
            {card.note ? (
              <p className={styles.note}>
                <span className={styles.noteLabel}>Note:</span> {card.note}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            className={[
              styles.configureButton,
              configureEnabled
                ? styles.configureButtonEnabled
                : styles.configureButtonDisabled,
            ].join(" ")}
            disabled={!configureEnabled}
            aria-label={`${configureLabel} ${card.title}`}
            title={configureTooltip}
            onClick={() => onConfigure?.(card)}
          >
            {configureLabel}
          </button>
        </div>
      </article>
    </div>
  );
}

export function IdsGetStarted({
  title,
  bannerTitle,
  subtitle,
  bannerDescription,
  cards,
  overflow = false,
  sequential = false,
  overflowPage = "single",
  showMasthead,
  isHeaderRequired,
  headerActionsDisabled = false,
  productName = "Product Name",
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
}: IdsGetStartedProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const resolvedTitle = title ?? bannerTitle ?? DEFAULT_TITLE;
  const resolvedSubtitle = subtitle ?? bannerDescription ?? DEFAULT_SUBTITLE;
  const resolvedShowMasthead = showMasthead ?? isHeaderRequired ?? true;
  const resolvedSkipLabel = skipButtonText ?? launchButtonText ?? DEFAULT_SKIP_LABEL;
  const resolvedSkipTooltip = skipButtonTooltip ?? launchButtonTooltip;
  const handleConfigure = onConfigure ?? configureModuleAction;
  const handleSkip = onSkip ?? launchModulesAction;

  const activeSequentialIndex = useMemo(
    () => sequentialActiveIndex(cards),
    [cards],
  );
  const skipDisabled = isSkipDisabled(sequential, overflowPage);

  /**
   * Right overlay while more cards remain to the right (Figma `12189:233198`).
   * Left overlay while scrolled past the start (Figma `12189:233211`, rotate-180).
   * Each side hides when that edge’s last/first card is fully in view.
   */
  const updateOverflowVisibility = useCallback(() => {
    const track = trackRef.current;
    if (!track || !overflow) {
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }
    setCanScrollLeft(track.scrollLeft > 2);
    setCanScrollRight(
      track.scrollWidth - track.clientWidth - track.scrollLeft > 2,
    );
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

  const scrollByDirection = (direction: "prev" | "next") => {
    const track = trackRef.current;
    if (track) {
      const delta = direction === "next" ? 345 : -345;
      track.scrollBy({ left: delta, behavior: "smooth" });
    }
    onOverflowNavigate?.(direction);
  };

  const showOverflowRight = overflow && canScrollRight;
  const showOverflowLeft = overflow && canScrollLeft;

  return (
    <div className={styles.shell} data-overflow={overflow ? "true" : "false"} data-sequential={sequential ? "true" : "false"}>
      <header className={styles.hero} data-node-id="12189:231401">
        {/* Figma Background `12189:231401`: color → shadow → honeycomb @ 15% (Light layer empty) */}
        <div className={styles.heroBackground} data-node-id="12189:231402" aria-hidden="true" />
        <div className={styles.heroShadowBand} data-node-id="12189:231403" aria-hidden="true" />
        <div className={styles.heroHoneycomb} data-node-id="12189:231404" aria-hidden="true">
          <img
            className={styles.heroHoneycombImg}
            src={honeycombPng}
            alt=""
          />
        </div>
        {resolvedShowMasthead ? (
          <div
            className={[
              styles.mastheadSlot,
              headerActionsDisabled ? styles.mastheadSlotActionsDisabled : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {mastheadSlot ?? (
              <DefaultMasthead
                productName={productName}
                actionsDisabled={headerActionsDisabled}
                mastheadProps={mastheadProps}
              />
            )}
          </div>
        ) : null}
        <div className={styles.heroCopy}>
          <h1 className={styles.heroTitle}>{resolvedTitle}</h1>
          <p className={styles.heroSubtitle}>{resolvedSubtitle}</p>
        </div>
      </header>

      <section className={styles.container} aria-label="Get started configuration cards">
        <div className={styles.cardViewport}>
          <div
            ref={trackRef}
            className={[
              styles.cardTrack,
              overflow ? styles.cardTrackOverflow : styles.cardTrackNoOverflow,
            ].join(" ")}
            data-gs-card-track
          >
            {cards.map((card, index) => (
              <GetStartedCardView
                key={String(card.id)}
                card={card}
                index={index}
                sequential={sequential}
                configureEnabled={isConfigureEnabled(
                  card,
                  sequential,
                  index,
                  activeSequentialIndex,
                )}
                onConfigure={handleConfigure}
              />
            ))}
          </div>
        </div>

        <button
          type="button"
          className={[
            styles.skipButton,
            skipDisabled ? styles.skipButtonDisabled : styles.skipButtonEnabled,
          ].join(" ")}
          disabled={skipDisabled}
          title={resolvedSkipTooltip}
          onClick={() => handleSkip?.()}
        >
          {resolvedSkipLabel}
        </button>
      </section>

      {showOverflowLeft ? (
        <aside
          className={[styles.overflowEdge, styles.overflowEdgeLeft].join(" ")}
          data-node-id="42682:125703"
          aria-label="Previous configuration cards"
        >
          <div className={styles.overflowGradient} aria-hidden="true" />
          <div className={styles.overflowArrow} data-node-id="42682:125705">
            <button
              type="button"
              className={styles.overflowNavButton}
              aria-label="Show previous cards"
              onClick={() => scrollByDirection("prev")}
            >
              <Icon shapeName="double-chev-right" style={{ width: 32, height: 32 }} />
            </button>
          </div>
        </aside>
      ) : null}

      {showOverflowRight ? (
        <aside
          className={[styles.overflowEdge, styles.overflowEdgeRight].join(" ")}
          data-node-id="12189:232209"
          aria-label="More configuration cards"
        >
          <div className={styles.overflowGradient} aria-hidden="true" />
          <div className={styles.overflowArrow} data-node-id="42682:125705">
            <button
              type="button"
              className={styles.overflowNavButton}
              aria-label="Show next cards"
              onClick={() => scrollByDirection("next")}
            >
              <Icon shapeName="double-chev-right" style={{ width: 32, height: 32 }} />
            </button>
          </div>
        </aside>
      ) : null}
    </div>
  );
}

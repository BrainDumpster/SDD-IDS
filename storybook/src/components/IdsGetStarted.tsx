import { useMemo, useRef } from "react";
import type { ReactNode } from "react";
import { Icon } from "./Icon";
import {
  Masthead,
  MastheadActionButtonContainer,
  MastheadActionIconButton,
  MastheadAvatar,
} from "./Masthead";
import styles from "./IdsGetStarted.module.css";

export type IdsGetStartedCardState = "not-completed" | "completed" | "required";

export interface IdsGetStartedCard {
  id: string;
  title: string;
  description: string;
  note: string;
  iconShapeName: string;
  cardState?: IdsGetStartedCardState;
}

export type IdsGetStartedOverflowPage = "single" | "page1" | "page2";

export interface IdsGetStartedProps {
  title?: string;
  subtitle?: string;
  cards: IdsGetStartedCard[];
  overflow?: boolean;
  sequential?: boolean;
  overflowPage?: IdsGetStartedOverflowPage;
  showMasthead?: boolean;
  productName?: string;
  mastheadSlot?: ReactNode;
  onConfigure?: (cardId: string) => void;
  onSkip?: () => void;
  onOverflowNavigate?: (direction: "prev" | "next") => void;
}

const DEFAULT_TITLE = "Get Started";
const DEFAULT_SUBTITLE =
  "Pre-configure key areas within the product below before launching the application.";

function resolveCardState(card: IdsGetStartedCard): IdsGetStartedCardState {
  return card.cardState ?? "not-completed";
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
  sequential: boolean,
  cardIndex: number,
  activeIndex: number,
): boolean {
  if (!sequential) return true;
  return cardIndex === activeIndex;
}

function DefaultMasthead({ productName }: { productName: string }) {
  return (
    <Masthead
      productName={productName}
      iconsSlot={
        <MastheadActionButtonContainer>
          <MastheadActionIconButton
            aria-label="Alerts"
            icon={<Icon shapeName="alert-bell-16" style={{ width: 16, height: 16 }} />}
          />
          <MastheadActionIconButton
            aria-label="Help"
            icon={<Icon shapeName="help-circ-16" style={{ width: 16, height: 16 }} />}
          />
        </MastheadActionButtonContainer>
      }
      avatarSlot={<MastheadAvatar initials="DT" aria-label="User settings" />}
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
  onConfigure?: (cardId: string) => void;
}) {
  const state = resolveCardState(card);
  const isCompleted = state === "completed";
  const isRequired = state === "required";

  return (
    <article className={styles.card} data-card-state={state}>
      <div
        className={[
          styles.iconBadge,
          isCompleted ? styles.iconBadgeCompleted : styles.iconBadgeIncomplete,
        ].join(" ")}
        aria-hidden={isCompleted ? undefined : true}
      >
        <Icon
          shapeName={isCompleted ? "shape-check-thick" : card.iconShapeName}
          className={isCompleted ? styles.cardIconCompleted : styles.cardIcon}
          style={{ width: 32, height: 32 }}
        />
      </div>

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
          <p className={styles.description}>{card.description}</p>
          <p className={styles.note}>
            <span className={styles.noteLabel}>Note:</span> {card.note}
          </p>
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
          aria-label={`Configure ${card.title}`}
          onClick={() => onConfigure?.(card.id)}
        >
          Configure
        </button>
      </div>
    </article>
  );
}

export function IdsGetStarted({
  title = DEFAULT_TITLE,
  subtitle = DEFAULT_SUBTITLE,
  cards,
  overflow = false,
  sequential = false,
  overflowPage = "single",
  showMasthead = true,
  productName = "Product Name",
  mastheadSlot,
  onConfigure,
  onSkip,
  onOverflowNavigate,
}: IdsGetStartedProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const activeSequentialIndex = useMemo(
    () => sequentialActiveIndex(cards),
    [cards],
  );
  const skipDisabled = isSkipDisabled(sequential, overflowPage);
  const showOverflowEdge =
    overflow && (overflowPage === "page1" || overflowPage === "page2");

  const scrollByDirection = (direction: "prev" | "next") => {
    const track = trackRef.current;
    if (track) {
      const delta = direction === "next" ? 345 : -345;
      track.scrollBy({ left: delta, behavior: "smooth" });
    }
    onOverflowNavigate?.(direction);
  };

  return (
    <div className={styles.shell} data-overflow={overflow ? "true" : "false"} data-sequential={sequential ? "true" : "false"}>
      <header className={styles.hero}>
        <div className={styles.heroBackground} aria-hidden="true">
          <div className={styles.heroShadowBand} />
        </div>
        {showMasthead ? (
          <div className={styles.mastheadSlot}>
            {mastheadSlot ?? <DefaultMasthead productName={productName} />}
          </div>
        ) : null}
        <div className={styles.heroCopy}>
          <h1 className={styles.heroTitle}>{title}</h1>
          <p className={styles.heroSubtitle}>{subtitle}</p>
        </div>
      </header>

      <section className={styles.container} aria-label="Get started configuration cards">
        <div className={styles.cardViewport}>
          <div
            ref={trackRef}
            className={[
              styles.cardTrack,
              overflow ? "" : styles.cardTrackNoOverflow,
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {cards.map((card, index) => (
              <GetStartedCardView
                key={card.id}
                card={card}
                index={index}
                sequential={sequential}
                configureEnabled={isConfigureEnabled(
                  sequential,
                  index,
                  activeSequentialIndex,
                )}
                onConfigure={onConfigure}
              />
            ))}
          </div>

          {showOverflowEdge ? (
            <div
              className={[
                styles.overflowEdge,
                overflowPage === "page2"
                  ? styles.overflowEdgeLeft
                  : styles.overflowEdgeRight,
              ].join(" ")}
              aria-hidden={false}
            >
              <div className={styles.overflowGradient} aria-hidden="true" />
              <button
                type="button"
                className={styles.overflowNavButton}
                aria-label={
                  overflowPage === "page2" ? "Show previous cards" : "Show next cards"
                }
                onClick={() =>
                  scrollByDirection(overflowPage === "page2" ? "prev" : "next")
                }
              >
                <Icon shapeName="double-chev-right" style={{ width: 32, height: 32 }} />
              </button>
            </div>
          ) : null}
        </div>

        <button
          type="button"
          className={[
            styles.skipButton,
            skipDisabled ? styles.skipButtonDisabled : styles.skipButtonEnabled,
          ].join(" ")}
          disabled={skipDisabled}
          onClick={() => onSkip?.()}
        >
          Skip
        </button>
      </section>
    </div>
  );
}

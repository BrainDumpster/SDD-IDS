/**
 * Storybook: design-spec–generated Get Started from `lib/react/ids/get-started`
 * (React + CSS Modules, no @base-ui-components).
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
 *       IdsGetStartedCardTrack → IdsGetStartedCardAnchor[]
 *         IdsGetStartedCardIconBadge
 *         IdsGetStartedCard
 *           IdsGetStartedCardTitleBand
 *           IdsGetStartedCardContentPanel
 *             IdsGetStartedCardDescription
 *             IdsGetStartedCardNote?
 *             IdsGetStartedCardConfigureButton
 *       IdsGetStartedSkipButton
 *     IdsGetStartedOverflowEdge?
 *       IdsGetStartedOverflowGradient
 *       IdsGetStartedOverflowArrow → IdsGetStartedOverflowNavButton
 *
 * Theme: components/ids-theme.css
 * Spec: components/ids/get-started/design-spec.md
 */
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/ids-theme.css";
import {
  GetStarted,
  type IdsGetStartedCardInput,
  type IdsGetStartedProps,
} from "../../../../lib/react/ids/get-started";

const DESIGN_SPEC_PATH = "components/ids/get-started/design-spec.md";

const SAMPLE_DESCRIPTION =
  "This is where a short description of SupportAssist would be placed. This is where a short description of SupportAssist would be placed.";
const SAMPLE_NOTE =
  "This is where quick instructions for finding the SupportAssist feature within the product would be placed.";

/** Figma single-page sample cards — `12189:233185` */
const specCards: IdsGetStartedCardInput[] = [
  {
    id: "support-assist",
    title: "SupportAssist",
    description: SAMPLE_DESCRIPTION,
    note: SAMPLE_NOTE,
    icon: "wrench-alt-short",
    cardState: "not-completed",
  },
  {
    id: "email",
    title: "Email",
    description: SAMPLE_DESCRIPTION,
    note: SAMPLE_NOTE,
    icon: "mail",
    cardState: "not-completed",
  },
  {
    id: "autosupport",
    title: "AutoSupport",
    description: SAMPLE_DESCRIPTION,
    note: SAMPLE_NOTE,
    icon: "gear-arrows",
    cardState: "not-completed",
  },
  {
    id: "license",
    title: "License",
    description: SAMPLE_DESCRIPTION,
    note: SAMPLE_NOTE,
    icon: "licenses-ribbon",
    cardState: "not-completed",
  },
  {
    id: "disaster-recovery",
    title: "Disaster Recovery",
    description: SAMPLE_DESCRIPTION,
    note: SAMPLE_NOTE,
    icon: "settings-gear-reset",
    cardState: "not-completed",
  },
];

const overflowCards: IdsGetStartedCardInput[] = [
  ...specCards,
  {
    id: "extra-1",
    title: "Monitoring",
    description: SAMPLE_DESCRIPTION,
    note: SAMPLE_NOTE,
    icon: "gear-arrows",
  },
  {
    id: "extra-2",
    title: "Reporting",
    description: SAMPLE_DESCRIPTION,
    note: SAMPLE_NOTE,
    icon: "licenses-ribbon",
  },
];

function StoryFrame(props: IdsGetStartedProps) {
  return (
    <div style={{ width: "100%", height: "100dvh", minHeight: 0, overflow: "auto" }}>
      <div style={{ minWidth: props.overflow ? undefined : 1800, height: "100%" }}>
        {props.children ?? <GetStarted {...props} />}
      </div>
    </div>
  );
}

function CompoundCards({ cards }: { cards: IdsGetStartedCardInput[] }) {
  return (
    <>
      {cards.map((card) => (
        <GetStarted.CardAnchor key={String(card.id)} card={card}>
          <GetStarted.CardIconBadge />
          <GetStarted.Card>
            <GetStarted.CardTitleBand />
            <GetStarted.CardContentPanel>
              <GetStarted.CardDescription />
              <GetStarted.CardNote />
              <GetStarted.CardConfigureButton />
            </GetStarted.CardContentPanel>
          </GetStarted.Card>
        </GetStarted.CardAnchor>
      ))}
    </>
  );
}

const meta: Meta<IdsGetStartedProps> = {
  title: "Lib Generated/IDS/Get Started",
  component: GetStarted,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          `React IDS Get Started from \`${DESIGN_SPEC_PATH}\`. ` +
          "Root is `GetStarted` (`IdsGetStarted`) — not `GetStartedRoot`. " +
          "Deterministic anatomy: HeroHeader (Background, ShadowBand, Honeycomb, " +
          "MastheadSlot, HeroTitle, HeroSubtitle) → Container (CardTrack → CardAnchor → " +
          "CardIconBadge + Card → TitleBand + ContentPanel → Description, Note, " +
          "ConfigureButton) → SkipButton → OverflowEdge (Gradient, Arrow, NavButton). " +
          "Theme: `components/ids-theme.css`. No `@base-ui-components`.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<IdsGetStartedProps>;

/** Figma `Overflow=False, Sequential=False, Single-Page` — `12189:233185` */
export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  render: function SpecAccurateDesignRender() {
    return (
      <StoryFrame>
        <GetStarted cards={specCards} overflow={false} sequential={false} overflowPage="single">
          <GetStarted.HeroHeader>
            <GetStarted.HeroBackground />
            <GetStarted.HeroShadowBand />
            <GetStarted.HeroHoneycomb />
            <GetStarted.MastheadSlot />
            <GetStarted.HeroTitle>Get Started</GetStarted.HeroTitle>
            <GetStarted.HeroSubtitle>
              Pre-configure key areas within the product below before launching the application.
            </GetStarted.HeroSubtitle>
          </GetStarted.HeroHeader>
          <GetStarted.Container>
            <GetStarted.CardTrack>
              <CompoundCards cards={specCards} />
            </GetStarted.CardTrack>
            <GetStarted.SkipButton>Skip</GetStarted.SkipButton>
          </GetStarted.Container>
        </GetStarted>
      </StoryFrame>
    );
  },
};

export const NestedHierarchy: Story = {
  name: "Nested Hierarchy",
  render: function NestedHierarchyRender() {
    return (
      <StoryFrame>
        <GetStarted showMasthead={false} cards={specCards.slice(0, 3)}>
          <GetStarted.HeroHeader>
            <GetStarted.HeroBackground />
            <GetStarted.HeroShadowBand />
            <GetStarted.HeroHoneycomb />
            <GetStarted.HeroTitle>Get Started</GetStarted.HeroTitle>
            <GetStarted.HeroSubtitle>
              Nested slot hierarchy with three cards.
            </GetStarted.HeroSubtitle>
          </GetStarted.HeroHeader>
          <GetStarted.Container>
            <GetStarted.CardTrack>
              <CompoundCards cards={specCards.slice(0, 3)} />
            </GetStarted.CardTrack>
            <GetStarted.SkipButton />
          </GetStarted.Container>
        </GetStarted>
      </StoryFrame>
    );
  },
};

export const ConvenienceDataCards: Story = {
  name: "Convenience Data Cards",
  render: () => (
    <StoryFrame cards={specCards} overflow={false} />
  ),
};

/** Figma card element states — `12023:228883` */
export const CardStates: Story = {
  render: () => (
    <StoryFrame
      showMasthead={false}
      cards={[
        {
          id: "not-completed",
          title: "SupportAssist",
          description: SAMPLE_DESCRIPTION,
          note: SAMPLE_NOTE,
          icon: "wrench-alt-short",
          cardState: "not-completed",
        },
        {
          id: "completed",
          title: "SupportAssist",
          description: SAMPLE_DESCRIPTION,
          note: SAMPLE_NOTE,
          icon: "wrench-alt-short",
          cardState: "completed",
        },
        {
          id: "required",
          title: "SupportAssist",
          description: SAMPLE_DESCRIPTION,
          note: SAMPLE_NOTE,
          icon: "wrench-alt-short",
          cardState: "required",
        },
      ]}
    />
  ),
};

/** Figma `Overflow=True` — right-edge overlay while more cards remain (`12189:233198`) */
export const OverflowPageOne: Story = {
  name: "Overflow — more cards",
  render: () => (
    <div style={{ width: "100%", height: "100dvh" }}>
      <div style={{ width: "min(1100px, 100%)", height: "100%", margin: "0 auto" }}>
        <GetStarted cards={overflowCards} overflow>
          <GetStarted.OverflowEdge side="left">
            <GetStarted.OverflowGradient />
            <GetStarted.OverflowArrow>
              <GetStarted.OverflowNavButton direction="prev" />
            </GetStarted.OverflowArrow>
          </GetStarted.OverflowEdge>
          <GetStarted.OverflowEdge side="right">
            <GetStarted.OverflowGradient />
            <GetStarted.OverflowArrow>
              <GetStarted.OverflowNavButton direction="next" />
            </GetStarted.OverflowArrow>
          </GetStarted.OverflowEdge>
        </GetStarted>
      </div>
    </div>
  ),
};

function OverflowEndFrame() {
  const hostRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const track = hostRef.current?.querySelector("[data-gs-card-track]") as HTMLElement | null;
    if (!track) return;
    track.scrollLeft = track.scrollWidth;
    track.dispatchEvent(new Event("scroll"));
  }, []);

  return (
    <div ref={hostRef} style={{ width: "100%", height: "100dvh" }}>
      <div style={{ width: "min(1100px, 100%)", height: "100%", margin: "0 auto" }}>
        <GetStarted cards={overflowCards} overflow />
      </div>
    </div>
  );
}

export const OverflowPageTwo: Story = {
  name: "Overflow — left edge",
  render: () => <OverflowEndFrame />,
};

export const SequentialSinglePage: Story = {
  render: () => <StoryFrame cards={specCards.slice(0, 2)} sequential />,
};

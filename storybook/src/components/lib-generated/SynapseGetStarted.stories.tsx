/**
 * Storybook: design-spec–generated Get Started from `lib/react/synapse/get-started`
 * (IDS-fork reexport façade — React + CSS Modules).
 *
 * Anatomy (deterministic child order — root is GetStarted / SynapseGetStarted, not GetStartedRoot):
 *   SynapseGetStarted
 *     SynapseGetStartedHeroHeader
 *       SynapseGetStartedHeroBackground
 *       SynapseGetStartedHeroShadowBand
 *       SynapseGetStartedHeroHoneycomb
 *       SynapseGetStartedMastheadSlot?
 *       SynapseGetStartedHeroTitle
 *       SynapseGetStartedHeroSubtitle
 *     SynapseGetStartedContainer
 *       SynapseGetStartedCardTrack → SynapseGetStartedCardAnchor[]
 *         SynapseGetStartedCardIconBadge
 *         SynapseGetStartedCard
 *           SynapseGetStartedCardTitleBand
 *           SynapseGetStartedCardContentPanel
 *             SynapseGetStartedCardDescription
 *             SynapseGetStartedCardNote?
 *             SynapseGetStartedCardConfigureButton
 *       SynapseGetStartedSkipButton
 *     SynapseGetStartedOverflowEdge?
 *       SynapseGetStartedOverflowGradient
 *       SynapseGetStartedOverflowArrow → SynapseGetStartedOverflowNavButton
 *
 * Theme: components/synapse-theme.css
 * Spec: components/ids/get-started/design-spec.md
 */
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/synapse-theme.css";
import {
  SYNAPSE_GET_STARTED_DOCS_DESCRIPTION,
  SYNAPSE_GET_STARTED_SOURCE_CODE,
} from "./synapse-get-started.developer-usage";
import {
  SynapseGetStartedCompound as SynapseGetStarted,
  type SynapseGetStartedCardInput,
  type SynapseGetStartedProps,
} from "@synapse/react/get-started";

const DESIGN_SPEC_PATH = "components/ids/get-started/design-spec.md";

const SAMPLE_DESCRIPTION =
  "This is where a short description of SupportAssist would be placed. This is where a short description of SupportAssist would be placed.";
const SAMPLE_NOTE =
  "This is where quick instructions for finding the SupportAssist feature within the product would be placed.";

/** Figma single-page sample cards — `12189:233185` */
const specCards: SynapseGetStartedCardInput[] = [
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

const overflowCards: SynapseGetStartedCardInput[] = [
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

function StoryFrame(props: SynapseGetStartedProps) {
  return (
    <div style={{ width: "100%", height: "100dvh", minHeight: 0, overflow: "auto" }}>
      <div style={{ minWidth: props.overflow ? undefined : 1800, height: "100%" }}>
        {props.children ?? <SynapseGetStarted {...props} />}
      </div>
    </div>
  );
}

function CompoundCards({ cards }: { cards: SynapseGetStartedCardInput[] }) {
  return (
    <>
      {cards.map((card) => (
        <SynapseGetStarted.CardAnchor key={String(card.id)} card={card}>
          <SynapseGetStarted.CardIconBadge />
          <SynapseGetStarted.Card>
            <SynapseGetStarted.CardTitleBand />
            <SynapseGetStarted.CardContentPanel>
              <SynapseGetStarted.CardDescription />
              <SynapseGetStarted.CardNote />
              <SynapseGetStarted.CardConfigureButton />
            </SynapseGetStarted.CardContentPanel>
          </SynapseGetStarted.Card>
        </SynapseGetStarted.CardAnchor>
      ))}
    </>
  );
}

const meta: Meta<SynapseGetStartedProps> = {
  tags: ["autodocs"],
  title: "Components/Synapse/Get Started",
  component: SynapseGetStarted,
  parameters: {
    layout: "fullscreen",
    docs: {
      canvas: { sourceState: "open" },
      description: {
        component: SYNAPSE_GET_STARTED_DOCS_DESCRIPTION,
      },
      source: {
        type: "code",
        language: "tsx",
        code: SYNAPSE_GET_STARTED_SOURCE_CODE,
      },
    },
  },
};

export default meta;
type Story = StoryObj<SynapseGetStartedProps>;

/** Figma `Overflow=False, Sequential=False, Single-Page` — `12189:233185` */
export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  render: function SpecAccurateDesignRender() {
    return (
      <StoryFrame>
        <SynapseGetStarted cards={specCards} overflow={false} sequential={false} overflowPage="single">
          <SynapseGetStarted.HeroHeader>
            <SynapseGetStarted.HeroBackground />
            <SynapseGetStarted.HeroShadowBand />
            <SynapseGetStarted.HeroHoneycomb />
            <SynapseGetStarted.MastheadSlot />
            <SynapseGetStarted.HeroTitle>Get Started</SynapseGetStarted.HeroTitle>
            <SynapseGetStarted.HeroSubtitle>
              Pre-configure key areas within the product below before launching the application.
            </SynapseGetStarted.HeroSubtitle>
          </SynapseGetStarted.HeroHeader>
          <SynapseGetStarted.Container>
            <SynapseGetStarted.CardTrack>
              <CompoundCards cards={specCards} />
            </SynapseGetStarted.CardTrack>
            <SynapseGetStarted.SkipButton>Skip</SynapseGetStarted.SkipButton>
          </SynapseGetStarted.Container>
        </SynapseGetStarted>
      </StoryFrame>
    );
  },
};

export const NestedHierarchy: Story = {
  name: "Nested Hierarchy",
  render: function NestedHierarchyRender() {
    return (
      <StoryFrame>
        <SynapseGetStarted showMasthead={false} cards={specCards.slice(0, 3)}>
          <SynapseGetStarted.HeroHeader>
            <SynapseGetStarted.HeroBackground />
            <SynapseGetStarted.HeroShadowBand />
            <SynapseGetStarted.HeroHoneycomb />
            <SynapseGetStarted.HeroTitle>Get Started</SynapseGetStarted.HeroTitle>
            <SynapseGetStarted.HeroSubtitle>
              Nested slot hierarchy with three cards.
            </SynapseGetStarted.HeroSubtitle>
          </SynapseGetStarted.HeroHeader>
          <SynapseGetStarted.Container>
            <SynapseGetStarted.CardTrack>
              <CompoundCards cards={specCards.slice(0, 3)} />
            </SynapseGetStarted.CardTrack>
            <SynapseGetStarted.SkipButton />
          </SynapseGetStarted.Container>
        </SynapseGetStarted>
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
        <SynapseGetStarted cards={overflowCards} overflow>
          <SynapseGetStarted.OverflowEdge side="left">
            <SynapseGetStarted.OverflowGradient />
            <SynapseGetStarted.OverflowArrow>
              <SynapseGetStarted.OverflowNavButton direction="prev" />
            </SynapseGetStarted.OverflowArrow>
          </SynapseGetStarted.OverflowEdge>
          <SynapseGetStarted.OverflowEdge side="right">
            <SynapseGetStarted.OverflowGradient />
            <SynapseGetStarted.OverflowArrow>
              <SynapseGetStarted.OverflowNavButton direction="next" />
            </SynapseGetStarted.OverflowArrow>
          </SynapseGetStarted.OverflowEdge>
        </SynapseGetStarted>
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
        <SynapseGetStarted cards={overflowCards} overflow />
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

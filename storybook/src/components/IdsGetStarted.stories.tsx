import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../components/ids-theme.css";
import {
  IdsGetStarted,
  type IdsGetStartedCard,
  type IdsGetStartedProps,
} from "./IdsGetStarted";

const meta: Meta<typeof IdsGetStarted> = {
  title: "Spec Generated/IDS/Get Started",
  component: IdsGetStarted,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof IdsGetStarted>;

const SAMPLE_DESCRIPTION =
  "This is where a short description of SupportAssist would be placed. This is where a short description of SupportAssist would be placed.";
const SAMPLE_NOTE =
  "This is where quick instructions for finding the SupportAssist feature within the product would be placed.";

/** Figma single-page sample cards — `12189:233185` */
const specCards: IdsGetStartedCard[] = [
  {
    id: "support-assist",
    title: "SupportAssist",
    description: SAMPLE_DESCRIPTION,
    note: SAMPLE_NOTE,
    iconShapeName: "wrench-alt-short",
    cardState: "not-completed",
  },
  {
    id: "email",
    title: "Email",
    description: SAMPLE_DESCRIPTION,
    note: SAMPLE_NOTE,
    iconShapeName: "mail",
    cardState: "not-completed",
  },
  {
    id: "autosupport",
    title: "AutoSupport",
    description: SAMPLE_DESCRIPTION,
    note: SAMPLE_NOTE,
    iconShapeName: "gear-arrows",
    cardState: "not-completed",
  },
  {
    id: "license",
    title: "License",
    description: SAMPLE_DESCRIPTION,
    note: SAMPLE_NOTE,
    iconShapeName: "licenses-ribbon",
    cardState: "not-completed",
  },
  {
    id: "disaster-recovery",
    title: "Disaster Recovery",
    description: SAMPLE_DESCRIPTION,
    note: SAMPLE_NOTE,
    iconShapeName: "settings-gear-reset",
    cardState: "not-completed",
  },
];

function StoryFrame(props: IdsGetStartedProps) {
  return (
    <div style={{ width: "100%", height: "100dvh", minHeight: 0, overflow: "auto" }}>
      {/* Figma single-page frame is 1920 — keep Spec Accurate Design wide enough for 5 cards */}
      <div style={{ minWidth: props.overflow ? undefined : 1800, height: "100%" }}>
        <IdsGetStarted {...props} />
      </div>
    </div>
  );
}

/** Figma `Overflow=False, Sequential=False, Single-Page` — `12189:233185` */
export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  render: () => <StoryFrame cards={specCards} overflow={false} />,
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
          iconShapeName: "wrench-alt-short",
          cardState: "not-completed",
        },
        {
          id: "completed",
          title: "SupportAssist",
          description: SAMPLE_DESCRIPTION,
          note: SAMPLE_NOTE,
          iconShapeName: "wrench-alt-short",
          cardState: "completed",
        },
        {
          id: "required",
          title: "SupportAssist",
          description: SAMPLE_DESCRIPTION,
          note: SAMPLE_NOTE,
          iconShapeName: "wrench-alt-short",
          cardState: "required",
        },
      ]}
    />
  ),
};

const overflowCards: IdsGetStartedCard[] = [
  ...specCards,
  {
    id: "extra-1",
    title: "Monitoring",
    description: SAMPLE_DESCRIPTION,
    note: SAMPLE_NOTE,
    iconShapeName: "gear-arrows",
  },
  {
    id: "extra-2",
    title: "Reporting",
    description: SAMPLE_DESCRIPTION,
    note: SAMPLE_NOTE,
    iconShapeName: "licenses-ribbon",
  },
];

/** Figma `Overflow=True` page 1 — right-edge overlay visible while more cards remain (`12189:233198`) */
export const OverflowPageOne: Story = {
  name: "Overflow — more cards",
  render: () => (
    <div style={{ width: "100%", height: "100dvh" }}>
      <div style={{ width: "min(1100px, 100%)", height: "100%", margin: "0 auto" }}>
        <IdsGetStarted cards={overflowCards} overflow />
      </div>
    </div>
  ),
};

/** Last card fully in view — right overlay hidden; left overlay shown when scrolled (`12189:233211`) */
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
        <IdsGetStarted cards={overflowCards} overflow />
      </div>
    </div>
  );
}

/** Figma left-edge overflow — overlay at left when first cards are off-screen (`12189:233211`) */
export const OverflowPageTwo: Story = {
  name: "Overflow — left edge",
  render: () => <OverflowEndFrame />,
};

/** Figma `Overflow=False, Sequential=True, Single-Page` — `12189:233218` */
export const SequentialSinglePage: Story = {
  render: () => (
    <StoryFrame cards={specCards.slice(0, 2)} sequential />
  ),
};

/** Figma `Overflow=True, Sequential=True` — right overlay while more cards remain (`12189:233223`) */
export const SequentialOverflowPageOne: Story = {
  render: () => (
    <div style={{ width: "100%", height: "100dvh" }}>
      <div style={{ width: "min(900px, 100%)", height: "100%", margin: "0 auto" }}>
        <IdsGetStarted
          cards={overflowCards}
          sequential
          overflow
          overflowPage="page1"
        />
      </div>
    </div>
  ),
};

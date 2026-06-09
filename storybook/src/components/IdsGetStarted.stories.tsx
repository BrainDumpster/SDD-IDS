import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../components/ids-theme.css";
import {
  IdsGetStarted,
  type IdsGetStartedCard,
  type IdsGetStartedProps,
} from "./IdsGetStarted";

const meta: Meta<typeof IdsGetStarted> = {
  title: "IDS/Get Started",
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
export const specCards: IdsGetStartedCard[] = [
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
    <div style={{ width: "100%", height: "100dvh", minHeight: 0 }}>
      <IdsGetStarted {...props} />
    </div>
  );
}

/** Figma `Overflow=False, Sequential=False, Single-Page` — `12189:233185` */
export const SinglePage: Story = {
  render: () => <StoryFrame cards={specCards} />,
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

/** Figma `Overflow=True, Sequential=False, Page 1 of 2` — `12189:233198` */
export const OverflowPageOne: Story = {
  render: () => (
    <div style={{ width: "100%", height: "100dvh" }}>
      <div style={{ width: "min(1100px, 100%)", height: "100%", margin: "0 auto" }}>
        <IdsGetStarted cards={overflowCards} overflow overflowPage="page1" />
      </div>
    </div>
  ),
};

/** Figma `Overflow=True, Sequential=False, Page 2 of 2` — `12189:233211` */
export const OverflowPageTwo: Story = {
  render: () => (
    <div style={{ width: "100%", height: "100dvh" }}>
      <div style={{ width: "min(1100px, 100%)", height: "100%", margin: "0 auto" }}>
        <IdsGetStarted cards={overflowCards} overflow overflowPage="page2" />
      </div>
    </div>
  ),
};

/** Figma `Overflow=False, Sequential=True, Single-Page` — `12189:233218` */
export const SequentialSinglePage: Story = {
  render: () => (
    <StoryFrame cards={specCards.slice(0, 2)} sequential />
  ),
};

/** Figma `Overflow=True, Sequential=True, Page 1 of 2` — `12189:233223` */
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

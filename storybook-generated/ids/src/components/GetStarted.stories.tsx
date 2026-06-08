/* @generated from components/ids/get-started/design-spec.md */
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/ids-theme.css";
import {
  IdsGetStarted,
  type IdsGetStartedCard,
  type IdsGetStartedProps,
} from "../../../../storybook/src/components/IdsGetStarted";

const DESIGN_SPEC_PATH = "components/ids/get-started/design-spec.md";

const SAMPLE_DESCRIPTION =
  "This is where a short description of SupportAssist would be placed. This is where a short description of SupportAssist would be placed.";
const SAMPLE_NOTE =
  "This is where quick instructions for finding the SupportAssist feature within the product would be placed.";

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

const meta: Meta<typeof IdsGetStarted> = {
  title: "Spec Generated/IDS/Get Started",
  component: IdsGetStarted,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `Spec-driven IDS Get Started. Source of truth: \`${DESIGN_SPEC_PATH}\`. Import \`components/ids-theme.css\` in app shell.`,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof IdsGetStarted>;

function StoryFrame(props: IdsGetStartedProps) {
  return (
    <div style={{ width: "100%", height: "100dvh", minHeight: 0 }}>
      <IdsGetStarted {...props} />
    </div>
  );
}

/** Figma `12189:233185` — Overflow=False, Sequential=False, Single-Page */
export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  render: () => <StoryFrame cards={specCards} />,
};

/** Figma element `12023:228883` — card state matrix */
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

/** Figma `12189:233198` — Overflow=True, Page 1 of 2 */
export const OverflowPageOne: Story = {
  render: () => (
    <div style={{ width: "100%", height: "100dvh" }}>
      <div style={{ width: "min(1100px, 100%)", height: "100%", margin: "0 auto" }}>
        <IdsGetStarted cards={overflowCards} overflow overflowPage="page1" />
      </div>
    </div>
  ),
};

/** Figma `12189:233211` — Overflow=True, Page 2 of 2 */
export const OverflowPageTwo: Story = {
  render: () => (
    <div style={{ width: "100%", height: "100dvh" }}>
      <div style={{ width: "min(1100px, 100%)", height: "100%", margin: "0 auto" }}>
        <IdsGetStarted cards={overflowCards} overflow overflowPage="page2" />
      </div>
    </div>
  ),
};

/** Figma `12189:233218` — Sequential=True, Single-Page */
export const SequentialSinglePage: Story = {
  render: () => <StoryFrame cards={specCards.slice(0, 2)} sequential />,
};

/** Figma `12189:233223` — Sequential=True, Overflow=True, Page 1 of 2 */
export const SequentialOverflowPageOne: Story = {
  render: () => (
    <div style={{ width: "100%", height: "100dvh" }}>
      <div style={{ width: "min(900px, 100%)", height: "100%", margin: "0 auto" }}>
        <IdsGetStarted cards={overflowCards} sequential overflow overflowPage="page1" />
      </div>
    </div>
  ),
};

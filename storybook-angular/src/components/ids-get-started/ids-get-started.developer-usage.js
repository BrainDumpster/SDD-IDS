/** Developer usage + Docs tab copy for IDS Get Started (Angular). */

export const GET_STARTED_DOCS_DESCRIPTION = `
## Overview

Onboarding hero with module cards, configure actions, and optional masthead.

## Props

### \`ids-get-started\`

| Input | Type | Default |
|-------|------|---------|
| \`cards\` | \`IdsGetStartedCardInput[]\` | \`[]\` |
| \`overflow\` | \`boolean\` | \`GET_STARTED_DEFAULTS.overflow\` |
| \`sequential\` | \`boolean\` | \`GET_STARTED_DEFAULTS.sequential\` |
| \`overflowPage\` | \`IdsGetStartedOverflowPage\` | \`GET_STARTED_DEFAULTS.overflowPage\` |
| \`headerActionsDisabled\` | \`boolean\` | \`GET_STARTED_DEFAULTS.headerAction…\` |
| \`productName\` | \`string\` | \`GET_STARTED_DEFAULTS.productName\` |
| \`honeycombSrc\` | \`string\` | \`GET_STARTED_HONEYCOMB_SRC\` |

### \`ids-get-started-hero-background\`

| Input | Type | Default |
|-------|------|---------|
| \`hasProjectedContent\` | \`—\` | \`false\` |
| \`hasProjectedText\` | \`—\` | \`false\` |
| \`hasProjectedText\` | \`—\` | \`false\` |
| \`synthesizedCards\` | \`Array<{ card: IdsGetStartedCardInput\` | — |
| \`synthesizedCards\` | \`IdsGetStartedCardTrackComponent["synthesizedCards"]\` | \`[]\` |
| \`direction\` | \`IdsGetStartedOverflowDirection\` | \`"next"\` |
| \`direction\` | \`IdsGetStartedOverflowDirection\` | \`"next"\` |
| \`side\` | \`IdsGetStartedOverflowSide\` | \`"right"\` |

## Events

| Output | On | Payload |
|--------|----|---------|
| \`onConfigure\` | \`ids-get-started\` | \`IdsGetStartedCardInput\` |
| \`configureModuleAction\` | \`ids-get-started\` | \`IdsGetStartedCardInput\` |
| \`onSkip\` | \`ids-get-started\` | \`void\` |
| \`launchModulesAction\` | \`ids-get-started\` | \`void\` |
| \`onOverflowNavigate\` | \`ids-get-started\` | \`IdsGetStartedOverflowDirection\` |

## API

Import \`IDS_GET_STARTED_IMPORTS\` from the component imports barrel (compiled \`lib/angular/ids/get-started\`).

\`\`\`ts
import { IDS_GET_STARTED_IMPORTS } from "@ids/angular/get-started";
\`\`\`
`.trim();

export const GET_STARTED_SOURCE_CODE = `import { Component } from "@angular/core";
import { IDS_GET_STARTED_IMPORTS } from "./get-started";

@Component({
  standalone: true,
  imports: [...IDS_GET_STARTED_IMPORTS],
  template: \`
    <ids-get-started
      [cards]="cards"
      [overflow]="false"
      (onConfigure)="onConfigure($event)"
      (onSkip)="onSkip()"
    />
  \`,
})
export class AppComponent {
  cards = [
    {
      id: "support-assist",
      title: "SupportAssist",
      description: "…",
      note: "…",
      iconShapeName: "wrench-alt-short",
      cardState: "not-completed",
    },
  ];
  onConfigure(card) {}
  onSkip() {}
}`.trim();

export const GET_STARTED_STORY_SOURCE_CODE = `<ids-get-started
  [cards]="cards"
  [overflow]="false"
  [sequential]="false"
  overflowPage="single"
  [showMasthead]="true"
  (onConfigure)="onConfigure($event)"
  (onSkip)="onSkip()"
/>`.trim();

export const SAMPLE_DESCRIPTION =
  "This is where a short description of SupportAssist would be placed. This is where a short description of SupportAssist would be placed.";

export const SAMPLE_NOTE =
  "This is where quick instructions for finding the SupportAssist feature within the product would be placed.";

/** Figma single-page sample cards — \`12189:233185\` */
export const GET_STARTED_SPEC_CARDS = [
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

export const GET_STARTED_OVERFLOW_CARDS = [
  ...GET_STARTED_SPEC_CARDS,
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

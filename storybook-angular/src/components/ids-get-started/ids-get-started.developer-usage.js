/** Developer usage + Docs tab copy for IDS Get Started (Angular). */

export const GET_STARTED_DOCS_DESCRIPTION = `
IDS Get Started — Angular standalone API aligned to \`components/ids/get-started/design-spec.md\` and React \`lib/react/ids/get-started\`.

**Contract defaults:** \`component-contracts/ids/get-started.contract.ts\`

### Anatomy (deterministic child order)

\`\`\`
ids-get-started [title?, subtitle?, cards, overflow?, sequential?, overflowPage?, showMasthead?, …]
  ids-get-started-hero-header
    ids-get-started-hero-background
    ids-get-started-hero-shadow-band
    ids-get-started-hero-honeycomb
    ids-get-started-masthead-slot?
    ids-get-started-hero-title
    ids-get-started-hero-subtitle
  ids-get-started-container
    ids-get-started-card-track
      ids-get-started-card-anchor[]
        ids-get-started-card-icon-badge
        ids-get-started-card
          ids-get-started-card-title-band
          ids-get-started-card-content-panel
            ids-get-started-card-description
            ids-get-started-card-note?
            ids-get-started-card-configure-button
    ids-get-started-skip-button
  ids-get-started-overflow-edge? (left / right)
\`\`\`

Prop-driven \`cards\` builds the same tree (React \`IdsGetStarted\` default).

Import \`IDS_GET_STARTED_IMPORTS\` from \`lib/angular/ids/get-started\`.

Load \`components/ids-theme.css\` on the app root (\`data-design-system="ids"\`).
Ship \`assets/images/honeycomb.png\` with the package.
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

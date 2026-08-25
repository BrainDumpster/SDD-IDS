/** Developer usage + Docs tab copy for IDS Dashboard (Angular). */

export const DASHBOARD_DOCS_DESCRIPTION = `
## Overview

Responsive grid of dashboard items for summary widgets and panels.

## Props

### \`ids-dashboard\`

| Input | Type | Default |
|-------|------|---------|
| \`showDividerInCard\` | \`—\` | \`true\` |
| \`enableDragAndDrop\` | \`—\` | \`false\` |

## Events

| Output | On | Payload |
|--------|----|---------|
| \`cardsReorder\` | \`ids-dashboard\` | \`string[]\` |

## API

Import \`IDS_DASHBOARD_IMPORTS\` from the component imports barrel (compiled \`lib/angular/ids/dashboard\`).

\`\`\`ts
import { IDS_DASHBOARD_IMPORTS } from "@ids/angular/dashboard";
\`\`\`
`.trim();

export const DASHBOARD_SOURCE_CODE = `import { Component } from "@angular/core";
import { IDS_DASHBOARD_IMPORTS } from "./dashboard";

@Component({
  standalone: true,
  imports: [...IDS_DASHBOARD_IMPORTS],
  template: \`
    <ids-dashboard [showDividerInCard]="true" [enableDragAndDrop]="false">
      <ids-card title="Widget Title" secondaryTitle="Secondary Title" size="span-1">
        <ids-card-text-content sectionTitle="Critical events">
          Dashboard tile body — IDS Card Content Type=Text sample.
        </ids-card-text-content>
      </ids-card>
      <ids-card title="Health summary" size="span-2">
        <ids-card-text-content sectionTitle="Status overview">
          Dashboard tile body — IDS Card Content Type=Text sample.
        </ids-card-text-content>
      </ids-card>
    </ids-dashboard>
  \`,
})
export class AppComponent {}`.trim();

export const DASHBOARD_STORY_SOURCE_CODE = `<ids-dashboard
  [showDividerInCard]="showDividerInCard"
  [enableDragAndDrop]="enableDragAndDrop"
  (cardsReorder)="onCardsReorder($event)"
>
  <ids-card … size="span-1|span-2|span-3">…</ids-card>
</ids-dashboard>`.trim();

export const CARD_MENU = [
  { value: "edit", label: "Edit" },
  { value: "remove", label: "Remove from dashboard" },
];

export const SAMPLE_BODY = (label) =>
  `Dashboard tile body — IDS Card Content Type=Text sample. (${label})`;

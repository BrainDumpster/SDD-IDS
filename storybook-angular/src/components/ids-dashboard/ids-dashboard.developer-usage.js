/** Developer usage + Docs tab copy for IDS Dashboard (Angular). */

export const DASHBOARD_DOCS_DESCRIPTION = `
IDS Dashboard — Angular standalone API aligned to \`components/ids/dashboard/design-spec.md\` and React \`lib/react/ids/dashboard\`.

Wrapper surface for a responsive grid of IDS Cards (1 → 2 → 3 columns by viewport). Sets nested Card border color (\`--card-border-color\` → \`--color-border-gray-neutral-light\`) and injects \`showDivider\` via \`showDividerInCard\`. Page title and page-level actions are owned by the host layout — **not** Dashboard.

### Anatomy (deterministic child order)

\`\`\`
ids-dashboard [showDividerInCard?, enableDragAndDrop?, className?]
  ids-dashboard-grid? (auto-provided when omitted)
    ids-dashboard-item? → ids-card   OR   ids-card+ (tiles)
\`\`\`

Nested Card chrome follows Card design-spec except border color cascade + forced \`showDivider\` from Dashboard (\`IDS_DASHBOARD_CARD_OVERRIDE\`).

Import \`IDS_DASHBOARD_IMPORTS\` from \`lib/angular/ids/dashboard\`.

Load \`components/ids-theme.css\` on the app root (\`data-design-system="ids"\`).
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

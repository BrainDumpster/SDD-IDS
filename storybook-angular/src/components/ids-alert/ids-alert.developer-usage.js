/** Developer usage + Docs tab copy for IDS Alert (Angular, composition API). */

export const ALERT_DOCS_DESCRIPTION = `
## Overview

Status messages for informational, success, warning, and critical feedback (inline or stacked).

## Props

### \`ids-alert\`

| Input | Type | Default |
|-------|------|---------|
| \`display\` | \`AlertDisplay\` | \`ALERT_SPEC_ACCURATE_DEFAULTS.display\` |
| \`severity\` | \`AlertGlobalSeverity \\| AlertInlineSeverity\` | \`ALERT_SPEC_ACCURATE_DEFAULTS.seve…\` |
| \`message\` | \`string\` | \`ALERT_SPEC_ACCURATE_DEFAULTS.message\` |
| \`title\` | \`—\` | \`""\` |
| \`density\` | \`AlertDensity\` | \`ALERT_SPEC_ACCURATE_DEFAULTS.density\` |
| \`link\` | \`AlertLinkInput \\| null\` | \`null\` |
| \`linkLabel\` | \`—\` | \`""\` |
| \`linkHref\` | \`—\` | \`""\` |
| \`actionLabel\` | \`—\` | \`""\` |
| \`dismissible\` | \`boolean \\| null\` | \`ALERT_SPEC_ACCURATE_DEFAULTS.dism…\` |
| \`carousel\` | \`AlertCarouselInput \\| null\` | \`null\` |

### \`ids-alert-action\`

| Input | Type | Default |
|-------|------|---------|
| \`label\` | \`—\` | \`""\` |

### \`ids-alert-group\`

| Input | Type | Default |
|-------|------|---------|
| \`activeIndex\` | \`—\` | \`0\` |

### \`ids-alert-item\`

| Input | Type | Default |
|-------|------|---------|
| \`message\` | \`—\` | \`""\` |
| \`linkLabel\` | \`—\` | \`""\` |
| \`linkHref\` | \`—\` | \`""\` |
| \`actionLabel\` | \`—\` | \`""\` |

## Events

| Output | On | Payload |
|--------|----|---------|
| \`action\` | \`ids-alert\` | \`void\` |
| \`dismiss\` | \`ids-alert\` | \`void\` |
| \`linkClick\` | \`ids-alert\` | \`MouseEvent\` |
| \`carouselPrevious\` | \`ids-alert\` | \`void\` |
| \`carouselNext\` | \`ids-alert\` | \`void\` |
| \`activeIndexChange\` | \`ids-alert-group\` | \`number\` |
| \`dismiss\` | \`ids-alert-group\` | \`void\` |

## API

Import \`IDS_ALERT_IMPORTS\` from the component imports barrel (compiled \`lib/angular/ids/alert\`).

\`\`\`ts
import { IDS_ALERT_IMPORTS } from "@ids/angular/alert";
\`\`\`
`.trim();

export const ALERT_SOURCE_CODE = `import { Component } from "@angular/core";
import { provideZoneChangeDetection } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { IDS_ALERT_IMPORTS } from "./ids-alert/ids-alert.imports";
import { ALERT_SPEC_ACCURATE_DEFAULTS } from "@component-contracts/ids/alert.contract";

@Component({
  standalone: true,
  imports: [...IDS_ALERT_IMPORTS],
  template: \`
    <ids-alert
      [display]="display"
      [severity]="severity"
      [density]="density"
      [dismissible]="dismissible"
      (dismiss)="onDismiss()"
    >
      <ids-alert-message>
        This is informational inline alert text for context.
      </ids-alert-message>
    </ids-alert>
  \`,
})
export class AppComponent {
  readonly display = ALERT_SPEC_ACCURATE_DEFAULTS.display;
  readonly severity = ALERT_SPEC_ACCURATE_DEFAULTS.severity;
  readonly density = ALERT_SPEC_ACCURATE_DEFAULTS.density;
  readonly dismissible = ALERT_SPEC_ACCURATE_DEFAULTS.dismissible;

  onDismiss(): void {
    console.log("alert dismissed");
  }
}

bootstrapApplication(AppComponent, {
  providers: [provideZoneChangeDetection()],
});`;

export const ALERT_STORY_SOURCE_CODE = `<ids-alert
  display="inline"
  severity="informational"
  density="compact"
  [dismissible]="true"
  (dismiss)="onDismiss()"
>
  <ids-alert-message>
    This is informational inline alert text for context.
  </ids-alert-message>
</ids-alert>`;

export const ALERT_COMPOSITION_DEMO_TEMPLATE = `
<ids-alert
  [display]="display"
  [severity]="severity"
  [density]="density"
  [message]="messageText"
  [dismissible]="dismissible"
  [title]="title"
  [linkLabel]="linkLabel"
  [linkHref]="linkHref"
  [actionLabel]="actionLabel"
  (dismiss)="dismiss($event)"
>
  <ids-alert-message>{{ messageText }}</ids-alert-message>
</ids-alert>
`.trim();

export const ALERT_MULTIPLE_GROUP_SOURCE_CODE = `<ids-alert-group [activeIndex]="1">
  <ids-alert-item severity="critical">
    <ids-alert-message>
      Critical outage: immediate action required in region us-east-1.
    </ids-alert-message>
    <ids-alert-link label="View status page" href="#" />
    <ids-alert-action label="Retry" />
  </ids-alert-item>
  <ids-alert-item severity="warning-major">
    <ids-alert-message>
      Major degradation detected for alerting service.
    </ids-alert-message>
    <ids-alert-link label="Learn more" href="#" />
  </ids-alert-item>
  <ids-alert-item severity="warning-minor">
    <ids-alert-message>
      Minor warning: configuration drift found in workspace sync.
    </ids-alert-message>
  </ids-alert-item>
  <ids-alert-item severity="informational">
    <ids-alert-message>
      Multiple active alerts are available. Review the alert center.
    </ids-alert-message>
    <ids-alert-link label="Open alert center" href="#" />
    <ids-alert-action label="Acknowledge" />
  </ids-alert-item>
  <ids-alert-item severity="informational">
    <ids-alert-message>
      Scheduled maintenance window starts at 02:00 UTC.
    </ids-alert-message>
    <ids-alert-link label="Open schedule" href="#" />
  </ids-alert-item>
</ids-alert-group>`;

export const ALERT_MULTIPLE_GROUP_TEMPLATE = ALERT_MULTIPLE_GROUP_SOURCE_CODE;

export const ALERT_INLINE_COMPACT_TEMPLATE = `
<div style="display: grid; gap: 16px;">
  <ids-alert display="inline" density="compact" severity="informational" [dismissible]="true">
    <ids-alert-message>Informational inline alert.</ids-alert-message>
  </ids-alert>
  <ids-alert display="inline" density="compact" severity="success" [dismissible]="true">
    <ids-alert-message>Success inline alert.</ids-alert-message>
  </ids-alert>
  <ids-alert display="inline" density="compact" severity="warning-minor" [dismissible]="true" actionLabel="Action">
    <ids-alert-message>This is an page-level alert that communicates a warning (minor) message. It may include actions.</ids-alert-message>
  </ids-alert>
  <ids-alert display="inline" density="compact" severity="critical">
    <ids-alert-message>Critical inline alert (no dismiss per spec).</ids-alert-message>
  </ids-alert>
</div>
`.trim();

export const ALERT_INLINE_DETAILED_ALL_DETAILS_SOURCE_CODE = `<ids-alert display="inline" density="detailed" severity="warning-minor" [dismissible]="true">
  <ids-alert-title>Alert Title</ids-alert-title>
  <ids-alert-message>
    This is an page-level alert that communicates a warning (minor) message. It may include actions or a
  </ids-alert-message>
  <ids-alert-link label="link to another page." href="#" />
  <ids-alert-action label="Action" />
</ids-alert>`;

export const ALERT_INLINE_DETAILED_ALL_DETAILS_TEMPLATE =
  ALERT_INLINE_DETAILED_ALL_DETAILS_SOURCE_CODE;

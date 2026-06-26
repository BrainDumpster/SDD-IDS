/** Developer usage + Docs tab copy for IDS Alert (Angular, composition API). */

export const ALERT_DOCS_DESCRIPTION = `
IDS Alert — Angular 21 standalone **composition** API (\`storybook-angular\`, port **6007**).

**Spec:** \`components/ids/alert/design-spec.md\`  
**Contract defaults:** \`component-contracts/ids/alert.contract.ts\`

### Anatomy (deterministic child order)

**Single alert**

\`\`\`
ids-alert [display, severity, density, dismissible, carousel?]
  ids-alert-message          ← required primary copy (Clarity .alert-text)
  ids-alert-title?           ← inline detailed
  ids-alert-link?            ← optional link after message
  ids-alert-action?          ← optional outlined action (label input)
\`\`\`

**Global multi-alert group**

\`\`\`
ids-alert-group [activeIndex]
  ids-alert-item [severity]  ← one per logical alert (hidden carriers)
    ids-alert-message        ← required
    ids-alert-link?          ← optional
    ids-alert-action?        ← optional
\`\`\`

\`ids-alert-group\` renders **one** internal \`ids-alert\` banner and swaps the active item (maps to Clarity \`clr-alerts\` + pager).

Import \`IDS_ALERT_IMPORTS\` from \`ids-alert.imports.ts\`.

String props (\`message\`, \`title\`, \`linkLabel\`, \`actionLabel\`) remain as **shorthand** for Storybook controls when slots are not used.

### Root API

| Input | Default | Notes |
|-------|---------|-------|
| \`display\` | \`inline\` | \`global\` \| \`inline\` |
| \`severity\` | \`informational\` | Inline adds \`success\` |
| \`density\` | \`compact\` | Inline only |
| \`dismissible\` | \`true\` | Per spec dismiss rules |
| \`carousel\` | — | Global only |

| Output | Notes |
|--------|-------|
| \`action\` | Action button |
| \`dismiss\` | Dismiss |
| \`linkClick\` | Link activation |
| \`carouselPrevious\` / \`carouselNext\` | Carousel |

Load \`components/ids-theme.css\` on the app root (\`data-design-system="ids"\`).
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

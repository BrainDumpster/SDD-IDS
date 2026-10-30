/** Developer usage + Docs tab copy for IDS Toast (Angular). */

export const TOAST_DOCS_DESCRIPTION = `
## Overview

Transient notification viewport and toast items with auto-dismiss.

## Props

### \`ids-toast-item\`

| Input | Type | Default |
|-------|------|---------|
| \`type\` | \`IdsToastType \\| string\` | \`TOAST_API_DEFAULTS.type\` |
| \`duration\` | \`number\` | \`TOAST_API_DEFAULTS.duration\` |
| \`closable\` | \`boolean\` | \`TOAST_API_DEFAULTS.closable\` |
| \`role\` | \`IdsToastRole\` | \`TOAST_API_DEFAULTS.role\` |

### \`ids-toast-view-details-action\`

| Input | Type | Default |
|-------|------|---------|
| \`label\` | \`—\` | \`""\` |
| \`href\` | \`—\` | \`""\` |

### \`ids-toast-viewport\`

| Input | Type | Default |
|-------|------|---------|
| \`position\` | \`IdsToastPosition \\| string\` | \`TOAST_API_DEFAULTS.position\` |
| \`maxVisible\` | \`—\` | \`TOAST_API_DEFAULTS.maxVisible\` |
| \`queueStrategy\` | \`"FIFO"\` | \`TOAST_API_DEFAULTS.queueStrategy\` |
| \`defaultItems\` | \`IdsToastQueueItem[]\` | \`[]\` |

## Events

| Output | On | Payload |
|--------|----|---------|
| \`onClose\` | \`ids-toast-item\` | \`{ id?: string; reason: IdsToastCloseReason }\` |
| \`onTimeout\` | \`ids-toast-item\` | \`{ id?: string }\` |
| \`onItemsChange\` | \`ids-toast-viewport\` | \`IdsToastQueueItem[]\` |
| \`onItemClose\` | \`ids-toast-viewport\` | \`{
    id: string;
    reason: IdsToastCloseRe…\` |
| \`onItemTimeout\` | \`ids-toast-viewport\` | \`{ id: string }\` |

## API

Import \`IDS_TOAST_IMPORTS\` from the component imports barrel (compiled \`lib/angular/ids/toast\`).

\`\`\`ts
import { IDS_TOAST_IMPORTS } from "@ids/angular/toast";
\`\`\`
`.trim();

export const TOAST_SOURCE_CODE = `import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideZoneChangeDetection } from "@angular/core";
import { IDS_TOAST_IMPORTS } from "./toast";
import { TOAST_SPEC_ACCURATE_DEFAULTS } from "@component-contracts/ids/toast.contract";

@Component({
  standalone: true,
  imports: [...IDS_TOAST_IMPORTS],
  template: \`
    <ids-toast-viewport [position]="position">
      <ids-toast-item
        [type]="type"
        [message]="message"
        [duration]="duration"
        [closable]="closable"
        [link]="link"
        (onClose)="onClose($event)"
        (onTimeout)="onTimeout($event)"
      >
        <ids-toast-icon-container />
        <ids-toast-message />
        <ids-toast-view-details-action />
        <ids-toast-close-action />
      </ids-toast-item>
    </ids-toast-viewport>
  \`,
})
export class AppComponent {
  type = TOAST_SPEC_ACCURATE_DEFAULTS.type;
  message = TOAST_SPEC_ACCURATE_DEFAULTS.message;
  duration = TOAST_SPEC_ACCURATE_DEFAULTS.duration;
  closable = TOAST_SPEC_ACCURATE_DEFAULTS.closable;
  position = TOAST_SPEC_ACCURATE_DEFAULTS.position;
  link = TOAST_SPEC_ACCURATE_DEFAULTS.link;
  onClose(detail) {}
  onTimeout(detail) {}
}

bootstrapApplication(AppComponent, {
  providers: [provideZoneChangeDetection()],
});`;

export const TOAST_STORY_SOURCE_CODE = `<ids-toast-viewport position="top-right">
  <ids-toast-item
    type="info"
    message="This is a temporary and brief notification following a user action."
    [duration]="0"
    [link]="{ label: 'View Details' }"
  >
    <ids-toast-icon-container />
    <ids-toast-message />
    <ids-toast-view-details-action />
    <ids-toast-close-action />
  </ids-toast-item>
</ids-toast-viewport>`;

export const TOAST_COMPOSITION_DEMO_TEMPLATE = `
<ids-toast-viewport [position]="position">
  <ids-toast-item
    [id]="id"
    [type]="type"
    [message]="message"
    [duration]="duration"
    [closable]="closable"
    [link]="link"
    [role]="role"
    [className]="className"
    (onClose)="onClose($event)"
    (onTimeout)="onTimeout($event)"
  >
    <ids-toast-icon-container />
    <ids-toast-message />
    <ids-toast-view-details-action />
    <ids-toast-close-action />
  </ids-toast-item>
</ids-toast-viewport>`;

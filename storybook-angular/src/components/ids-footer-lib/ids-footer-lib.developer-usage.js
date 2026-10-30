/** Developer usage + Docs tab copy for IDS Footer (Angular library composition API). */

export const FOOTER_LIB_DOCS_DESCRIPTION = `
## Overview

Composition footer API for Angular (slots and projected content).

## Props

### \`ids-footer\`

| Input | Type | Default |
|-------|------|---------|
| \`ariaLabel\` | \`—\` | \`"Application status"\` |

### \`ids-footer-left-region\`

| Input | Type | Default |
|-------|------|---------|
| \`hostname\` | \`—\` | \`""\` |
| \`swid\` | \`—\` | \`""\` |
| \`copyDisabled\` | \`—\` | \`false\` |
| \`currentDateTime\` | \`—\` | \`""\` |
| \`timeZoneLabel\` | \`—\` | \`""\` |
| \`disabled\` | \`—\` | \`false\` |

## Events

| Output | On | Payload |
|--------|----|---------|
| \`copySwid\` | \`ids-footer-left-region\` | \`string\` |
| \`timeZoneClick\` | \`ids-footer-left-region\` | \`void\` |

## API

Import \`IDS_FOOTER_IMPORTS\` from the component imports barrel (compiled \`lib/angular/ids/footer\`).

\`\`\`ts
import { IDS_FOOTER_IMPORTS } from "@ids/angular/footer";
\`\`\`
`.trim();

export const FOOTER_LIB_STORY_FRAME_STYLE = `
  width: 100%;
  min-height: 120px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  background: var(--color-background-surface-component);
`.trim();

export const FOOTER_LIB_STORY_SOURCE_CODE = `
<div style="${FOOTER_LIB_STORY_FRAME_STYLE}">
  <ids-footer>
    <ids-footer-left-region>
      <ids-footer-host-name hostname="${FOOTER_SPEC_ACCURATE_DEFAULTS.hostname}" />
      <ids-footer-swid-group swid="${FOOTER_SPEC_ACCURATE_DEFAULTS.swid}" />
    </ids-footer-left-region>
    <ids-footer-time-group currentDateTime="${FOOTER_SPEC_ACCURATE_DEFAULTS.currentDateTime}" />
    <ids-footer-time-zone-group timeZoneLabel="${FOOTER_SPEC_ACCURATE_DEFAULTS.timeZoneLabel}" />
  </ids-footer>
</div>
`.trim();

export const FOOTER_LIB_SOURCE_CODE = `import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideZoneChangeDetection } from "@angular/core";
import { IDS_FOOTER_IMPORTS } from "lib/angular/ids";
import { FOOTER_SPEC_ACCURATE_DEFAULTS } from "@component-contracts/ids/footer.contract";

@Component({
  standalone: true,
  imports: [...IDS_FOOTER_IMPORTS],
  template: \`
    <ids-footer>
      <ids-footer-left-region>
        <ids-footer-host-name [hostname]="hostname" />
        <ids-footer-swid-group [swid]="swid" (copySwid)="onCopySwid($event)" />
      </ids-footer-left-region>
      <ids-footer-time-group [currentDateTime]="currentDateTime" />
      <ids-footer-time-zone-group
        [timeZoneLabel]="timeZoneLabel"
        (timeZoneClick)="onTimeZoneClick()"
      />
    </ids-footer>
  \`,
})
export class AppComponent {
  hostname = FOOTER_SPEC_ACCURATE_DEFAULTS.hostname;
  swid = FOOTER_SPEC_ACCURATE_DEFAULTS.swid;
  currentDateTime = FOOTER_SPEC_ACCURATE_DEFAULTS.currentDateTime;
  timeZoneLabel = FOOTER_SPEC_ACCURATE_DEFAULTS.timeZoneLabel;

  onCopySwid(swid: string): void {
    console.log("Copied SWID:", swid);
  }

  onTimeZoneClick(): void {
    console.log("Open time zone picker");
  }
}

bootstrapApplication(AppComponent, {
  providers: [provideZoneChangeDetection()],
});`.trim();

export const FOOTER_LIB_SPEC_ACCURATE_TEMPLATE = `
<div style="${FOOTER_LIB_STORY_FRAME_STYLE}">
  <ids-footer>
    <ids-footer-left-region>
      <ids-footer-host-name [hostname]="hostname"></ids-footer-host-name>
      <ids-footer-swid-group
        [swid]="swid"
        [copyDisabled]="copyDisabled"
        (copySwid)="copySwid($event)"
      ></ids-footer-swid-group>
    </ids-footer-left-region>
    <ids-footer-time-group [currentDateTime]="currentDateTime"></ids-footer-time-group>
    <ids-footer-time-zone-group
      [timeZoneLabel]="timeZoneLabel"
      [disabled]="timeZoneDisabled"
      (timeZoneClick)="timeZoneClick()"
    ></ids-footer-time-zone-group>
  </ids-footer>
</div>
`.trim();

export const FOOTER_LIB_HOST_ONLY_TEMPLATE = `
<div style="${FOOTER_LIB_STORY_FRAME_STYLE}">
  <ids-footer>
    <ids-footer-left-region>
      <ids-footer-host-name hostname="prod-cluster-01.example.com"></ids-footer-host-name>
      <ids-footer-swid-group swid="ELMCR00222GBPB"></ids-footer-swid-group>
    </ids-footer-left-region>
  </ids-footer>
</div>
`.trim();

export const FOOTER_LIB_TIME_ONLY_TEMPLATE = `
<div style="${FOOTER_LIB_STORY_FRAME_STYLE}">
  <ids-footer>
    <ids-footer-time-group currentDateTime="Wed, 2024-11-06 3:45 PM"></ids-footer-time-group>
    <ids-footer-time-zone-group
      timeZoneLabel="Pacific Time (US & Canada)"
    ></ids-footer-time-zone-group>
  </ids-footer>
</div>
`.trim();

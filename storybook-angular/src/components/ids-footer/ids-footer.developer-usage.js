/** Developer usage + Docs tab copy for IDS Footer (Angular). */

import { FOOTER_SPEC_ACCURATE_DEFAULTS } from "../../../compiled/component-contracts/ids/footer.contract.js";

export const FOOTER_DOCS_DESCRIPTION = `
IDS Footer — Angular 21 standalone application status bar (\`storybook-angular\`, port **6007**).

**Spec:** \`components/ids/footer/design-spec.md\`  
**Contract defaults:** \`component-contracts/ids/footer.contract.ts\`

32px persistent shell strip with optional host name, SWID (+ copy), date/time, and time-zone action.

Load \`components/ids-theme.css\` on the app root (\`data-design-system="ids"\`).
`.trim();

export const FOOTER_STORY_FRAME_STYLE = `
  width: 100%;
  min-height: 120px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  background: var(--color-background-surface-component);
`.trim();

export const FOOTER_SPEC_ACCURATE_TEMPLATE = `
<div style="${FOOTER_STORY_FRAME_STYLE}">
  <ids-footer
    hostname="${FOOTER_SPEC_ACCURATE_DEFAULTS.hostname}"
    swid="${FOOTER_SPEC_ACCURATE_DEFAULTS.swid}"
    currentDateTime="${FOOTER_SPEC_ACCURATE_DEFAULTS.currentDateTime}"
    timeZoneLabel="${FOOTER_SPEC_ACCURATE_DEFAULTS.timeZoneLabel}"
    [showHostname]="true"
    [showCurrentDateAndTime]="true"
    [showTimeZone]="true"
  />
</div>
`.trim();

export const FOOTER_SOURCE_CODE = `import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideZoneChangeDetection } from "@angular/core";
import { IDS_FOOTER_IMPORTS } from "./ids-footer/ids-footer.imports";
import { FOOTER_SPEC_ACCURATE_DEFAULTS } from "@component-contracts/ids/footer.contract";

@Component({
  standalone: true,
  imports: [...IDS_FOOTER_IMPORTS],
  template: \`
    <ids-footer
      [hostname]="hostname"
      [swid]="swid"
      [currentDateTime]="currentDateTime"
      [timeZoneLabel]="timeZoneLabel"
      (copySwid)="onCopySwid($event)"
      (timeZoneClick)="onTimeZoneClick()"
    />
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
});
`.trim();

export const FOOTER_STORY_SOURCE_CODE = FOOTER_SPEC_ACCURATE_TEMPLATE;

export const FOOTER_VISIBILITY_HOST_ONLY_TEMPLATE = `
<div style="${FOOTER_STORY_FRAME_STYLE}">
  <ids-footer
    hostname="prod-cluster-01.example.com"
    swid="ELMCR00222GBPB"
    [showHostname]="true"
    [showCurrentDateAndTime]="false"
    [showTimeZone]="false"
  />
</div>
`.trim();

export const FOOTER_VISIBILITY_TIME_ONLY_TEMPLATE = `
<div style="${FOOTER_STORY_FRAME_STYLE}">
  <ids-footer
    currentDateTime="Wed, 2024-11-06 3:45 PM"
    timeZoneLabel="Pacific Time (US & Canada)"
    [showHostname]="false"
    [showCurrentDateAndTime]="true"
    [showTimeZone]="true"
  />
</div>
`.trim();

export const FOOTER_DISABLED_CONTROLS_TEMPLATE = `
<div style="${FOOTER_STORY_FRAME_STYLE}">
  <ids-footer
    hostname="short_name_first_domain_name"
    swid="ELMCR00222GBPB"
    currentDateTime="Tue, 2023-04-23 12:30 AM"
    timeZoneLabel="Eastern Time (US & Canada)"
    [copyDisabled]="true"
    [timeZoneDisabled]="true"
  />
</div>
`.trim();

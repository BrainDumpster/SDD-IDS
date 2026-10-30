/** Developer usage + Docs tab copy for IDS Tab (Angular). */

export const TAB_DOCS_DESCRIPTION = `
## Overview

Tabbed navigation with tab buttons and corresponding content panels.

## Props

### \`ids-tab\`

| Input | Type | Default |
|-------|------|---------|
| \`type\` | \`TabType\` | \`TAB_SPEC_ACCURATE_DEFAULTS.type\` |
| \`surface\` | \`TabSurface\` | \`TAB_SPEC_ACCURATE_DEFAULTS.surface\` |
| \`defaultActiveItemId\` | \`—\` | \`TAB_SPEC_ACCURATE_DEFAULTS.defaul…\` |
| \`allowAddTab\` | \`—\` | \`TAB_API_DEFAULTS.allowAddTab\` |
| \`addTabLabel\` | \`—\` | \`TAB_API_DEFAULTS.addTabLabel\` |
| \`moreLabel\` | \`—\` | \`TAB_API_DEFAULTS.moreLabel\` |
| \`overflow\` | \`—\` | \`TAB_API_DEFAULTS.overflow\` |
| \`minTabWidth\` | \`—\` | \`TAB_API_DEFAULTS.minTabWidth\` |
| \`maxTabWidth\` | \`—\` | \`TAB_API_DEFAULTS.maxTabWidth\` |

### \`ids-tab-item\`

| Input | Type | Default |
|-------|------|---------|
| \`hasAlert\` | \`—\` | \`false\` |
| \`disabled\` | \`—\` | \`false\` |

## Events

| Output | On | Payload |
|--------|----|---------|
| \`activeItemChange\` | \`ids-tab\` | \`string\` |
| \`tabSelect\` | \`ids-tab\` | \`{ id: string; label: string }\` |
| \`addTab\` | \`ids-tab\` | \`void\` |
| \`overflowSelection\` | \`ids-tab\` | \`string\` |

## API

Import \`IDS_TAB_IMPORTS\` from the component imports barrel (compiled \`lib/angular/ids/tab\`).

\`\`\`ts
import { IDS_TAB_IMPORTS } from "@ids/angular/tab";
\`\`\`
`.trim();

export const TAB_SOURCE_CODE = `import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideZoneChangeDetection } from "@angular/core";
import { IDS_TAB_IMPORTS } from "./ids-tab/ids-tab.imports";
import { TAB_SPEC_ACCURATE_DEFAULTS } from "@component-contracts/ids/tab.contract";

@Component({
  standalone: true,
  imports: [...IDS_TAB_IMPORTS],
  template: \`
    <ids-tab
      [type]="type"
      [defaultActiveItemId]="defaultActiveItemId"
      (tabSelect)="onTabSelect($event)"
    >
      <ids-tab-item itemId="overview" label="Overview">
        <ids-tab-panel>Overview tab content area.</ids-tab-panel>
      </ids-tab-item>
      <ids-tab-item itemId="security" label="Security" iconSlug="shield-encrypt-alt">
        <ids-tab-panel>Security tab content area.</ids-tab-panel>
      </ids-tab-item>
      <ids-tab-item itemId="alerts" label="Alerts">
        <ids-tab-panel>Alerts tab content area with related data.</ids-tab-panel>
      </ids-tab-item>
    </ids-tab>
  \`,
})
export class AppComponent {
  readonly type = TAB_SPEC_ACCURATE_DEFAULTS.type;
  readonly defaultActiveItemId = TAB_SPEC_ACCURATE_DEFAULTS.defaultActiveItemId;

  onTabSelect(payload: { id: string; label: string }): void {
    console.log("tab selected", payload);
  }
}

bootstrapApplication(AppComponent, {
  providers: [provideZoneChangeDetection()],
});`;

export const TAB_STORY_SOURCE_CODE = `<ids-tab type="secondary" defaultActiveItemId="overview">
  <ids-tab-item itemId="overview" label="Overview">
    <ids-tab-panel>Overview tab content area.</ids-tab-panel>
  </ids-tab-item>
  <ids-tab-item itemId="security" label="Security" iconSlug="shield-encrypt-alt">
    <ids-tab-panel>Security tab content area.</ids-tab-panel>
  </ids-tab-item>
  <ids-tab-item itemId="alerts" label="Alerts">
    <ids-tab-panel>Alerts tab content area with related data.</ids-tab-panel>
  </ids-tab-item>
</ids-tab>`;

export const TAB_COMPOSITION_DEMO_TEMPLATE = `
<ids-tab
  [type]="type"
  [surface]="surface"
  [defaultActiveItemId]="defaultActiveItemId"
  [activeItemId]="state.activeId"
  [allowAddTab]="allowAddTab"
  [addTabLabel]="addTabLabel"
  [overflow]="overflow"
  [moreLabel]="moreLabel"
  (activeItemChange)="onActiveChange($event)"
  (tabSelect)="tabSelect($event)"
  (addTab)="onAddTab()"
>
  <ids-tab-item itemId="overview" label="Overview">
    <ids-tab-panel>Overview tab content area.</ids-tab-panel>
  </ids-tab-item>
  <ids-tab-item itemId="security" label="Security" iconSlug="shield-encrypt-alt">
    <ids-tab-panel>Security tab content area.</ids-tab-panel>
  </ids-tab-item>
  <ids-tab-item itemId="alerts" label="Alerts">
    <ids-tab-panel>Alerts tab content area with related data.</ids-tab-panel>
  </ids-tab-item>
</ids-tab>`.trim();

export const TAB_OVERFLOW_DEMO_TEMPLATE = `
<div [style.max-width.px]="maxWidth" [style.width.px]="maxWidth">
  <ids-tab [type]="tabType" [defaultActiveItemId]="overflowItems[0]?.id" [overflow]="true" [allowAddTab]="false">
    @for (item of overflowItems; track item.id) {
      <ids-tab-item [itemId]="item.id" [label]="item.label">
        <ids-tab-panel>{{ item.content }}</ids-tab-panel>
      </ids-tab-item>
    }
  </ids-tab>
</div>`.trim();

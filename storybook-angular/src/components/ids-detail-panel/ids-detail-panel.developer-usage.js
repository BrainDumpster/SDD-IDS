/** Developer usage + Docs tab copy for IDS Detail Panel (Angular). */

export const DETAIL_PANEL_DOCS_DESCRIPTION = `
## Overview

Expandable side panel with header, body, footer, and collapsed rail.

## Props

### \`ids-detail-panel\`

| Input | Type | Default |
|-------|------|---------|
| \`attachMode\` | \`DetailPanelAttachMode\` | \`DETAIL_PANEL_API_DEFAULTS.attachMode\` |
| \`expanded\` | \`boolean\` | \`DETAIL_PANEL_API_DEFAULTS.expanded\` |
| \`title\` | \`—\` | \`DETAIL_PANEL_API_DEFAULTS.title\` |
| \`showHeader\` | \`—\` | \`DETAIL_PANEL_API_DEFAULTS.showHeader\` |
| \`showFooter\` | \`—\` | \`DETAIL_PANEL_API_DEFAULTS.showFooter\` |
| \`ariaLabelExpand\` | \`—\` | \`DETAIL_PANEL_API_DEFAULTS.ariaLab…\` |
| \`ariaLabelCollapse\` | \`—\` | \`DETAIL_PANEL_API_DEFAULTS.ariaLab…\` |
| \`collapsedWidth\` | \`—\` | \`DETAIL_PANEL_API_DEFAULTS.collaps…\` |
| \`expandedWidth\` | \`—\` | \`DETAIL_PANEL_API_DEFAULTS.expande…\` |

## Events

| Output | On | Payload |
|--------|----|---------|
| \`expandedChange\` | \`ids-detail-panel\` | \`boolean\` |
| \`opened\` | \`ids-detail-panel\` | \`void\` |
| \`closed\` | \`ids-detail-panel\` | \`void\` |

## API

Import \`IDS_DETAIL_PANEL_IMPORTS\` from the component imports barrel (compiled \`lib/angular/ids/detail-panel\`).

\`\`\`ts
import { IDS_DETAIL_PANEL_IMPORTS } from "@ids/angular/detail-panel";
\`\`\`
`.trim();

export const DETAIL_PANEL_SOURCE_CODE = `import { Component } from "@angular/core";
import { IDS_DETAIL_PANEL_IMPORTS } from "./detail-panel";
import { DETAIL_PANEL_SPEC_ACCURATE_DEFAULTS } from "@component-contracts/ids/detail-panel.contract";

@Component({
  standalone: true,
  imports: [...IDS_DETAIL_PANEL_IMPORTS],
  template: \`
    <ids-detail-panel
      [attachMode]="attachMode"
      [expanded]="expanded"
      (expandedChange)="expanded = $event"
      (opened)="onOpened()"
      (closed)="onClosed()"
    >
      <ids-detail-panel-content>
        <ids-detail-panel-header>
          <ids-detail-panel-title>{{ title }}</ids-detail-panel-title>
        </ids-detail-panel-header>
        <ids-detail-panel-body>
          <p>Label: Single line content</p>
        </ids-detail-panel-body>
        <ids-detail-panel-footer />
      </ids-detail-panel-content>
      <ids-detail-panel-collapsed-rail>
        <ids-detail-panel-toggle-button />
      </ids-detail-panel-collapsed-rail>
    </ids-detail-panel>
  \`,
})
export class AppComponent {
  attachMode = DETAIL_PANEL_SPEC_ACCURATE_DEFAULTS.attachMode;
  expanded = DETAIL_PANEL_SPEC_ACCURATE_DEFAULTS.expanded;
  title = DETAIL_PANEL_SPEC_ACCURATE_DEFAULTS.title;

  onOpened(): void {
    console.log("[IDS Detail Panel] opened");
  }

  onClosed(): void {
    console.log("[IDS Detail Panel] closed");
  }
}`;

export const DETAIL_PANEL_STORY_SOURCE_CODE = `<ids-detail-panel
  [attachMode]="attachMode"
  [expanded]="expanded"
  (expandedChange)="onExpandedChange($event)"
  (opened)="onOpened()"
  (closed)="onClosed()"
>
  <ids-detail-panel-content>
    <ids-detail-panel-header>
      <ids-detail-panel-title>{{ title }}</ids-detail-panel-title>
    </ids-detail-panel-header>
    <ids-detail-panel-body>
      <div class="detail-panel-demo-content">
        <div class="detail-panel-demo-heading">Section Header</div>
        <div>Label: Single line content</div>
        <div>Status: Warning</div>
      </div>
    </ids-detail-panel-body>
    <ids-detail-panel-footer />
  </ids-detail-panel-content>
  <ids-detail-panel-collapsed-rail>
    <ids-detail-panel-toggle-button />
  </ids-detail-panel-collapsed-rail>
</ids-detail-panel>`;

export const DETAIL_PANEL_COMPOSITION_DEMO_TEMPLATE = `
<div class="detail-panel-story-shell">
  <div class="detail-panel-story-status">
    Attach mode: <strong>{{ attachMode }}</strong> |
    State: <strong>{{ expanded ? 'expanded' : 'collapsed' }}</strong>
  </div>
  <div class="detail-panel-story-frame">
    <main class="detail-panel-story-host">Host content</main>
    <ids-detail-panel
      [attachMode]="attachMode"
      [expanded]="expanded"
      (expandedChange)="onExpandedChange($event)"
      (opened)="onOpened()"
      (closed)="onClosed()"
    >
      <ids-detail-panel-content>
        @if (attachMode === 'datagrid') {
          <ids-detail-panel-header>
            <ids-detail-panel-title>{{ title }}</ids-detail-panel-title>
          </ids-detail-panel-header>
        }
        <ids-detail-panel-body>
          <div class="detail-panel-demo-content">
            <div class="detail-panel-demo-heading">Section Header</div>
            <div>Label: Single line content</div>
            <div>Status: Warning</div>
            <div class="detail-panel-demo-overflow">Overflow sample content area</div>
          </div>
        </ids-detail-panel-body>
        @if (attachMode === 'page') {
          <ids-detail-panel-footer />
        }
      </ids-detail-panel-content>
      <ids-detail-panel-collapsed-rail>
        <ids-detail-panel-toggle-button />
      </ids-detail-panel-collapsed-rail>
    </ids-detail-panel>
  </div>
</div>
`;

export const DETAIL_PANEL_STORY_STYLES = `
.detail-panel-story-shell {
  height: 100vh;
  background: var(--color-background-surface-primary);
  padding: 16px;
  box-sizing: border-box;
}
.detail-panel-story-status {
  margin-bottom: 12px;
  font-size: 14px;
  color: var(--color-text-gray-neutral-strong);
}
.detail-panel-story-frame {
  display: flex;
  height: 768px;
  border: 1px solid var(--color-border-gray-neutral-base);
  background: var(--color-background-surface-component);
}
.detail-panel-story-host {
  flex: 1;
  min-width: 0;
  padding: 16px;
  box-sizing: border-box;
  overflow: auto;
}
.detail-panel-demo-content {
  display: grid;
  gap: 12px;
  font-size: var(--font-size-body-2);
  line-height: var(--font-line-height-line-height-20);
  color: var(--color-text-gray-neutral);
}
.detail-panel-demo-heading {
  color: var(--color-text-gray-neutral-strong);
  font-weight: 500;
}
.detail-panel-demo-overflow {
  height: 600px;
  border: 1px dashed var(--color-border-gray-neutral-base);
  padding: 12px;
  box-sizing: border-box;
}
`;

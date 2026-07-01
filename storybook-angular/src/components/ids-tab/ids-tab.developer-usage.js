/** Developer usage + Docs tab copy for IDS Tab (Angular). */

export const TAB_DOCS_DESCRIPTION = `
IDS Tab — Angular 21 standalone **composition** API (\`storybook-angular\`, port **6007**).

**Spec:** \`components/ids/tab/design-spec.md\`  
**Contract:** \`component-contracts/ids/tab.contract.ts\`  
**Framework port notes:** \`storybook-angular/src/components/ids-tab/README.md\`

### Anatomy (deterministic child order)

\`\`\`
ids-tab [type, surface, activeItemId?, defaultActiveItemId?, allowAddTab?, overflow?, …]
  ids-tab-item [itemId, label, iconSlug?, badgeCount?, disabled?]
    ids-tab-panel
  ids-tab-item …
\`\`\`

Import \`IDS_TAB_IMPORTS\` from \`ids-tab.imports.ts\`.

### Root API (\`ids-tab\`)

| Input | Default | Notes |
|-------|---------|-------|
| \`type\` | \`secondary\` | \`primary\` \| \`secondary\` (selected indicator placement) |
| \`variant\` | — | Deprecated alias of \`type\`; \`type\` wins |
| \`surface\` | \`elevated\` | \`elevated\` \| \`transparent\` host background |
| \`activeItemId\` | — | Controlled active tab id |
| \`defaultActiveItemId\` | \`overview\` | Uncontrolled initial tab |
| \`allowAddTab\` | \`false\` | Shows add-tab affordance |
| \`addTabLabel\` | \`Add Tab\` | Localized add action label |
| \`overflow\` | \`true\` | Responsive \`More\` overflow |
| \`moreLabel\` | \`More\` | Overflow trigger fallback label |

| Output | Notes |
|--------|-------|
| \`activeItemChange\` | Emits selected tab \`itemId\` |
| \`tabSelect\` | Emits \`{ id, label }\` with selected tab name |
| \`addTab\` | Fired when add-tab action is triggered |
| \`overflowSelection\` | Fired when a hidden tab is chosen from overflow |

### Item API (\`ids-tab-item\`)

| Input | Required | Notes |
|-------|----------|-------|
| \`itemId\` | Yes | Stable tab id (maps to spec \`id\`) |
| \`label\` | Yes | Visible tab label (title case, 1–3 words) |
| \`iconSlug\` | No | \`assets/icons/<slug>.svg\` |
| \`badgeCount\` | No | Alert badge count |
| \`disabled\` | No | Disables tab selection |
| \`simulatedState\` | No | Storybook only: \`hover\` \| \`focus-visible\` |

Each \`ids-tab-item\` must project an \`ids-tab-panel\` child.

Load \`components/ids-theme.css\` on the app root (\`data-design-system="ids"\`).
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
  <ids-tab [type]="tabType" defaultActiveItemId="summary" [allowAddTab]="false">
    <ids-tab-item itemId="summary" label="Summary">
      <ids-tab-panel>Summary content.</ids-tab-panel>
    </ids-tab-item>
    <ids-tab-item itemId="details" label="Details">
      <ids-tab-panel>Details content.</ids-tab-panel>
    </ids-tab-item>
    <ids-tab-item itemId="settings" label="Settings">
      <ids-tab-panel>Settings content.</ids-tab-panel>
    </ids-tab-item>
    <ids-tab-item itemId="activity" label="Activity">
      <ids-tab-panel>Activity content.</ids-tab-panel>
    </ids-tab-item>
    <ids-tab-item itemId="audit" label="Audit Trail">
      <ids-tab-panel>Audit trail content.</ids-tab-panel>
    </ids-tab-item>
    <ids-tab-item itemId="integrations" label="Integrations">
      <ids-tab-panel>Integrations content.</ids-tab-panel>
    </ids-tab-item>
    <ids-tab-item itemId="policies" label="Policies">
      <ids-tab-panel>Policies content.</ids-tab-panel>
    </ids-tab-item>
  </ids-tab>
</div>`.trim();

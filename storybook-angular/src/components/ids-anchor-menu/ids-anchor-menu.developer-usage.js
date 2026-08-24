/** Developer usage + Docs tab copy for IDS Anchor Menu (Angular, composition API). */

export const ANCHOR_MENU_DOCS_DESCRIPTION = `
IDS Anchor Menu — Angular 21 standalone **composition** API. Library: \`lib/angular/ids/anchor-menu/\`. Storybook: \`storybook-angular\`, port **6007**.

**Spec:** \`components/ids/anchor-menu/design-spec.md\`  
**Contract defaults:** \`component-contracts/ids/anchor-menu.contract.ts\`

### Anatomy (deterministic child order)

\`\`\`
ids-anchor-menu [title?, sticky?]
  ids-anchor-menu-header [title?]     ← optional
  ids-anchor-menu-item [label, href, active?]
  ids-anchor-menu-item …
  ids-anchor-active-indicator
\`\`\`

Import \`IDS_ANCHOR_MENU_IMPORTS\` from \`lib/angular/ids\`.

### Root API (\`ids-anchor-menu\`)

| Input | Default | Notes |
|-------|---------|-------|
| \`title\` | \`On this page\` | \`aria-label\` on \`nav\`; header label fallback |
| \`sticky\` | \`true\` | \`position: sticky\` |

| Output | Notes |
|--------|-------|
| \`itemClick\` | Emits the item \`href\` after activation |

### Item API (\`ids-anchor-menu-item\`)

| Input | Required | Notes |
|-------|----------|-------|
| \`label\` | Yes | Visible Body 1 label |
| \`href\` | Yes | Target; empty/missing disables navigation |
| \`active\` | No | Initial selected item when true |

Load \`components/ids-theme.css\` on the app root (\`data-design-system="ids"\`).
`.trim();

export const ANCHOR_MENU_SOURCE_CODE = `import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideZoneChangeDetection } from "@angular/core";
import { IDS_ANCHOR_MENU_IMPORTS } from "@ids-angular/anchor-menu";
import { ANCHOR_MENU_API_DEFAULTS } from "@component-contracts/ids/anchor-menu.contract";

@Component({
  standalone: true,
  imports: [...IDS_ANCHOR_MENU_IMPORTS],
  template: \`
    <ids-anchor-menu [title]="title" [sticky]="sticky" (itemClick)="onItemClick($event)">
      <ids-anchor-menu-header />
      <ids-anchor-menu-item href="#overview" label="Overview" [active]="true" />
      <ids-anchor-menu-item href="#types" label="Types" />
      <ids-anchor-menu-item href="#anatomy" label="Anatomy" />
      <ids-anchor-active-indicator />
    </ids-anchor-menu>
  \`,
})
export class AppComponent {
  readonly title = ANCHOR_MENU_API_DEFAULTS.title;
  readonly sticky = ANCHOR_MENU_API_DEFAULTS.sticky;
  onItemClick(_href: string) {}
}

bootstrapApplication(AppComponent, {
  providers: [provideZoneChangeDetection()],
});`;

export const ANCHOR_MENU_STORY_SOURCE_CODE = `<ids-anchor-menu title="On this page">
  <ids-anchor-menu-item href="#overview" label="Overview" [active]="true" />
  <ids-anchor-menu-item href="#types" label="Types" />
  <ids-anchor-menu-item href="#anatomy" label="Anatomy" />
  <ids-anchor-menu-item href="#usage-rules" label="Usage Rules" />
  <ids-anchor-menu-item href="#states-and-colors" label="States and Colors" />
  <ids-anchor-menu-item href="#redlines" label="Redlines" />
  <ids-anchor-active-indicator />
</ids-anchor-menu>`;

export const ANCHOR_MENU_COMPOSITION_DEMO_TEMPLATE = `
<ids-anchor-menu [title]="title" [sticky]="sticky" (itemClick)="itemClick($event)">
  <ids-anchor-menu-item href="#overview" label="Overview" [active]="true"></ids-anchor-menu-item>
  <ids-anchor-menu-item href="#types" label="Types"></ids-anchor-menu-item>
  <ids-anchor-menu-item href="#anatomy" label="Anatomy"></ids-anchor-menu-item>
  <ids-anchor-menu-item href="#usage-rules" label="Usage Rules"></ids-anchor-menu-item>
  <ids-anchor-menu-item href="#states-and-colors" label="States and Colors"></ids-anchor-menu-item>
  <ids-anchor-menu-item href="#redlines" label="Redlines"></ids-anchor-menu-item>
  <ids-anchor-active-indicator></ids-anchor-active-indicator>
</ids-anchor-menu>`;

export const ANCHOR_MENU_WITH_HEADER_TEMPLATE = `
<ids-anchor-menu [title]="title" [sticky]="sticky" (itemClick)="itemClick($event)">
  <ids-anchor-menu-header></ids-anchor-menu-header>
  <ids-anchor-menu-item href="#overview" label="Overview" [active]="true"></ids-anchor-menu-item>
  <ids-anchor-menu-item href="#types" label="Types"></ids-anchor-menu-item>
  <ids-anchor-menu-item href="#anatomy" label="Anatomy"></ids-anchor-menu-item>
  <ids-anchor-menu-item href="#usage-rules" label="Usage Rules"></ids-anchor-menu-item>
  <ids-anchor-menu-item href="#states-and-colors" label="States and Colors"></ids-anchor-menu-item>
  <ids-anchor-menu-item href="#redlines" label="Redlines"></ids-anchor-menu-item>
  <ids-anchor-active-indicator></ids-anchor-active-indicator>
</ids-anchor-menu>`;

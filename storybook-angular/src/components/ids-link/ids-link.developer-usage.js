/** Developer usage + Docs tab copy for IDS Link (Angular lib). */

export const LINK_DOCS_DESCRIPTION = `
IDS Link — Angular 21 standalone API (\`storybook-angular\`, port **6007**).

**Spec:** \`components/ids/link/design-spec.md\`  
**Contract:** \`component-contracts/ids/link.contract.ts\`  
**Lib:** \`lib/angular/ids/link\` (parity with \`lib/react/ids/link\`)

### Anatomy

\`\`\`
ids-link [type, label, href?, showExternalLinkIcon?, target?, rel?, disabled?, dataState?]
  root (<a> | <button>)
    label
    externalIcon?   ← ids-icon pop-up-square-corner-big @ 16px (mask)
\`\`\`

Import \`IDS_LINK_IMPORTS\` from \`lib/angular/ids/link\`. Load \`components/ids-theme.css\` on the app root (\`data-design-system="ids"\`).

| Input | Default | Notes |
|-------|---------|-------|
| \`type\` | \`standalone\` | \`standalone\` \\| \`inline\` \\| \`dark-bg\` (unknown → standalone) |
| \`label\` | required | Empty → \`"Link"\` + dev warning |
| \`href\` | — | Present → \`<a>\`; omitted → \`<button type="button">\` |
| \`showExternalLinkIcon\` | \`false\` | Decorative external icon |
| \`target\` | \`_self\` | When \`_blank\`, default \`rel="noopener noreferrer"\` |
| \`disabled\` | \`false\` | Runtime safety (not in Figma matrix) |
| \`dataState\` | — | Demo/testing only (\`data-state\`) |

| Output | Notes |
|--------|-------|
| \`clicked\` | Maps design-spec / React \`onClick\` |
`.trim();

export const LINK_SOURCE_CODE = `import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideZoneChangeDetection } from "@angular/core";
import { IDS_LINK_IMPORTS } from "./link";
import { LINK_SPEC_ACCURATE_DEFAULTS } from "@component-contracts/ids/link.contract";

@Component({
  standalone: true,
  imports: [...IDS_LINK_IMPORTS],
  template: \`
    <ids-link
      [type]="type"
      [label]="label"
      [href]="href"
      [showExternalLinkIcon]="showExternalLinkIcon"
    ></ids-link>
  \`,
})
export class AppComponent {
  readonly type = LINK_SPEC_ACCURATE_DEFAULTS.type;
  readonly label = LINK_SPEC_ACCURATE_DEFAULTS.label;
  readonly href = LINK_SPEC_ACCURATE_DEFAULTS.href;
  readonly showExternalLinkIcon = LINK_SPEC_ACCURATE_DEFAULTS.showExternalLinkIcon;
}

bootstrapApplication(AppComponent, {
  providers: [provideZoneChangeDetection()],
});`;

export const LINK_STORY_SOURCE_CODE = `<ids-link
  type="standalone"
  label="This is a link"
  href="#"
></ids-link>`;

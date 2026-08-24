/** Developer usage + Docs tab copy for IDS Button (Angular, composition API). */

const DEMO_ICON = "settings-gear-detailed";

export const BUTTON_DOCS_DESCRIPTION = `
IDS Button — Angular 21 standalone **composition** API (\`storybook-angular\`, port **6007**).

**Spec:** \`components/ids/button/design-spec.md\`  
**Contract defaults:** \`component-contracts/ids/button.contract.ts\`

### Anatomy (deterministic child order)

\`\`\`
ids-button [variant, size, disabled, loading, iconOnly?, ariaLabel?, type?]
  ids-icon?                  ← optional leading icon (\`variant="mask"\` for token tint)
  {{ label }}                ← default slot (text or inline markup)
\`\`\`

Import \`IDS_BUTTON_IMPORTS\` from \`ids-button.imports.ts\` (includes \`ids-icon\`).

### Root API

| Input | Default | Notes |
|-------|---------|-------|
| \`variant\` | \`primary\` | \`primary\` \| \`secondary\` \| \`tertiary\` \| \`destructive\` |
| \`size\` | \`lg\` | \`sm\` \| \`md\` \| \`lg\` |
| \`disabled\` | \`false\` | Blocks interaction |
| \`loading\` | \`false\` | Shows spinner; blocks interaction |
| \`iconOnly\` | \`false\` | Icon-only layout; \`md\` / \`lg\` only |
| \`ariaLabel\` | — | **Required** when \`iconOnly=true\` |
| \`type\` | \`button\` | Native button type |

| Output | Notes |
|--------|-------|
| \`clicked\` | Successful activation |

**Leading icon:** project \`ids-icon\` with \`variant="mask"\` so \`var(--color-icon-*)\` tokens tint the glyph. Destructive buttons do not render a leading icon.

Load \`components/ids-theme.css\` on the app root (\`data-design-system="ids"\`).
`.trim();

export const BUTTON_SOURCE_CODE = `import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideZoneChangeDetection } from "@angular/core";
import { IDS_BUTTON_IMPORTS } from "./ids-button/ids-button.imports";
import { BUTTON_SPEC_ACCURATE_DEFAULTS } from "@component-contracts/ids/button.contract";

@Component({
  standalone: true,
  imports: [...IDS_BUTTON_IMPORTS],
  template: \`
    <ids-button
      [variant]="variant"
      [size]="size"
      [disabled]="disabled"
      [loading]="loading"
    >
      <ids-icon shapeName="${DEMO_ICON}" variant="mask" />
      Button
    </ids-button>
  \`,
})
export class AppComponent {
  readonly variant = BUTTON_SPEC_ACCURATE_DEFAULTS.variant;
  readonly size = BUTTON_SPEC_ACCURATE_DEFAULTS.size;
  readonly disabled = BUTTON_SPEC_ACCURATE_DEFAULTS.disabled;
  readonly loading = BUTTON_SPEC_ACCURATE_DEFAULTS.loading;
}

bootstrapApplication(AppComponent, {
  providers: [provideZoneChangeDetection()],
});`;

export const BUTTON_STORY_SOURCE_CODE = `<ids-button variant="primary" size="lg">
  <ids-icon shapeName="${DEMO_ICON}" variant="mask" />
  Button
</ids-button>`;

export const BUTTON_COMPOSITION_DEMO_TEMPLATE = `
<ids-button
  [variant]="variant"
  [size]="size"
  [disabled]="disabled"
  [loading]="loading"
  [iconOnly]="iconOnly"
  [ariaLabel]="ariaLabel"
>
  @if (!iconOnly && variant !== 'destructive') {
    <ids-icon shapeName="${DEMO_ICON}" variant="mask" />
  }
  @if (!iconOnly) {
    Button
  } @else {
    <ids-icon shapeName="${DEMO_ICON}" variant="mask" />
  }
</ids-button>
`.trim();

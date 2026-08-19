/** Developer usage + Docs tab copy for IDS Masthead (Angular, composition API). */

import {
  MASTHEAD_APP_LAUNCHER_ICON_SLUG,
  MASTHEAD_HELP_ICON_SLUG,
  MASTHEAD_PRODUCT_LOGO_SLUG,
  MASTHEAD_USER_ICON_SLUG,
} from "../../../compiled/component-contracts/ids/masthead.contract.js";

export const MASTHEAD_DOCS_DESCRIPTION = `
IDS Masthead — Angular 21 standalone **composition** API (\`storybook-angular\`, port **6007**).

**Spec:** \`components/ids/masthead/design-spec.md\`  
**Contract:** \`component-contracts/ids/masthead.contract.ts\`

### Anatomy (deterministic slot order)

\`\`\`
ids-masthead
  [mastheadLogo]?                    ← optional 32×32 product logo (ids-icon variant="img")
  productName                        ← required brand label
  ids-masthead-action-button-container
    ids-masthead-action-icon-button  ← projected ids-icon (16×16)
  [mastheadAppLauncher]?             ← app launcher trigger slot
  ids-masthead-avatar                ← initials | projected ids-icon | photo
\`\`\`

Import \`IDS_MASTHEAD_IMPORTS\` from \`ids-masthead.imports.ts\` in any parent that renders this markup.

### Root API (\`ids-masthead\`)

| Input | Type | Required | Notes |
|-------|------|----------|-------|
| \`productName\` | \`string\` | yes | Brand title in left slot |

### Action icon button (\`ids-masthead-action-icon-button\`)

| Input | Type | Default | Notes |
|-------|------|---------|-------|
| \`ariaLabel\` | \`string\` | required | Accessible name |
| \`badgeCount\` | \`number\` | — | Renders badge when > 0; caps at \`99+\` |
| \`badgeType\` | badge union | \`critical\` | Use \`success\` for Jobs, \`critical\` for Alerts |
| \`ariaExpanded\` | \`boolean\` | — | Open panel state |

Project \`ids-icon\` at **16×16** (\`variant="mask"\` for monochrome glyphs).

### Avatar (\`ids-masthead-avatar\`)

| Input | Type | Notes |
|-------|------|-------|
| \`initials\` | \`string\` | 32×32 white ring + body-2 text |
| \`imageSrc\` / \`imageAlt\` | \`string\` | Photo variant (fills chip) |
| \`ariaLabel\` | \`string\` | Required when not using initials |

Icon variant: project \`ids-icon shapeName="${MASTHEAD_USER_ICON_SLUG}"\` at **16×16**.

### Theme & assets

- Load \`components/ids-theme.css\` on the app root (\`data-design-system="ids"\`).
- Monochrome masthead icons use \`var(--color-icon-gray-white)\` via host \`color\` + \`ids-icon variant="mask"\`.
- Product logo: \`ids-icon shapeName="${MASTHEAD_PRODUCT_LOGO_SLUG}" variant="img" [size]="32"\`.
`.trim();

export const MASTHEAD_SOURCE_CODE = `import { Component } from "@angular/core";
import { provideZoneChangeDetection } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { IDS_MASTHEAD_IMPORTS } from "./ids-masthead/ids-masthead.imports";
import { MASTHEAD_SPEC_ACCURATE_DEFAULTS } from "@component-contracts/ids/masthead.contract";

@Component({
  standalone: true,
  imports: [...IDS_MASTHEAD_IMPORTS],
  template: \`
    <ids-masthead [productName]="productName">
      <ids-masthead-action-button-container>
        <ids-masthead-action-icon-button ariaLabel="Help">
          <ids-icon shapeName="${MASTHEAD_HELP_ICON_SLUG}" variant="mask" [size]="16" />
        </ids-masthead-action-icon-button>
      </ids-masthead-action-button-container>

      <ids-masthead-avatar
        [initials]="avatarInitials"
        ariaLabel="User settings"
      />
    </ids-masthead>
  \`,
})
export class AppShellComponent {
  readonly productName = MASTHEAD_SPEC_ACCURATE_DEFAULTS.productName;
  readonly avatarInitials = MASTHEAD_SPEC_ACCURATE_DEFAULTS.avatarInitials;
}

bootstrapApplication(AppShellComponent, {
  providers: [provideZoneChangeDetection()],
});`;

export const MASTHEAD_STORY_SOURCE_CODE = `<ids-masthead productName="Synapse">
  <ids-masthead-action-button-container>
    <ids-masthead-action-icon-button ariaLabel="Help">
      <ids-icon shapeName="${MASTHEAD_HELP_ICON_SLUG}" variant="mask" [size]="16" />
    </ids-masthead-action-icon-button>
  </ids-masthead-action-button-container>

  <ids-masthead-avatar initials="DT" ariaLabel="User settings" />
</ids-masthead>`;

export const MASTHEAD_COMPOSITION_DEMO_TEMPLATE = `
<ids-masthead [productName]="productName">
  @if (showLogo) {
    <ids-masthead-logo>
      <ids-icon
        shapeName="${MASTHEAD_PRODUCT_LOGO_SLUG}"
        variant="img"
        [size]="32"
      />
    </ids-masthead-logo>
  }

  <ids-masthead-action-button-container>
    <ids-masthead-action-icon-button [ariaLabel]="helpAriaLabel">
      <ids-icon shapeName="${MASTHEAD_HELP_ICON_SLUG}" variant="mask" [size]="16" />
    </ids-masthead-action-icon-button>
  </ids-masthead-action-button-container>

  @if (showAppLauncher) {
    <ids-masthead-action-icon-button
      mastheadAppLauncher
      ariaLabel="App launcher"
    >
      <ids-icon
        shapeName="${MASTHEAD_APP_LAUNCHER_ICON_SLUG}"
        variant="mask"
        [size]="16"
      />
    </ids-masthead-action-icon-button>
  }

  @if (avatarMode === 'initials') {
    <ids-masthead-avatar
      [initials]="avatarInitials"
      [ariaLabel]="avatarAriaLabel"
    />
  } @else {
    <ids-masthead-avatar [ariaLabel]="avatarAriaLabel">
      <ids-icon shapeName="${MASTHEAD_USER_ICON_SLUG}" variant="mask" [size]="16" />
    </ids-masthead-avatar>
  }
</ids-masthead>
`.trim();

export const MASTHEAD_WITH_APP_LAUNCHER_TEMPLATE = `
<ids-masthead productName="Synapse">
  <ids-masthead-action-button-container>
    <ids-masthead-action-icon-button ariaLabel="Help">
      <ids-icon shapeName="${MASTHEAD_HELP_ICON_SLUG}" variant="mask" [size]="16" />
    </ids-masthead-action-icon-button>
  </ids-masthead-action-button-container>

  <ids-masthead-action-icon-button mastheadAppLauncher ariaLabel="App launcher">
    <ids-icon shapeName="${MASTHEAD_APP_LAUNCHER_ICON_SLUG}" variant="mask" [size]="16" />
  </ids-masthead-action-icon-button>

  <ids-masthead-avatar initials="DT" ariaLabel="User settings" />
</ids-masthead>
`.trim();

export const MASTHEAD_WITH_PRODUCT_LOGO_TEMPLATE = `
<ids-masthead productName="Product Name">
  <ids-masthead-logo>
    <ids-icon shapeName="${MASTHEAD_PRODUCT_LOGO_SLUG}" variant="img" [size]="32" />
  </ids-masthead-logo>

  <ids-masthead-action-button-container>
    <ids-masthead-action-icon-button ariaLabel="Help">
      <ids-icon shapeName="${MASTHEAD_HELP_ICON_SLUG}" variant="mask" [size]="16" />
    </ids-masthead-action-icon-button>
  </ids-masthead-action-button-container>

  <ids-masthead-action-icon-button mastheadAppLauncher ariaLabel="App launcher">
    <ids-icon shapeName="${MASTHEAD_APP_LAUNCHER_ICON_SLUG}" variant="mask" [size]="16" />
  </ids-masthead-action-icon-button>

  <ids-masthead-avatar initials="DT" ariaLabel="User settings" />
</ids-masthead>
`.trim();

export const MASTHEAD_USER_ICON_AVATAR_TEMPLATE = `
<ids-masthead productName="Synapse">
  <ids-masthead-action-button-container>
    <ids-masthead-action-icon-button ariaLabel="Help">
      <ids-icon shapeName="${MASTHEAD_HELP_ICON_SLUG}" variant="mask" [size]="16" />
    </ids-masthead-action-icon-button>
  </ids-masthead-action-button-container>

  <ids-masthead-action-icon-button mastheadAppLauncher ariaLabel="App launcher">
    <ids-icon shapeName="${MASTHEAD_APP_LAUNCHER_ICON_SLUG}" variant="mask" [size]="16" />
  </ids-masthead-action-icon-button>

  <ids-masthead-avatar ariaLabel="User settings">
    <ids-icon shapeName="${MASTHEAD_USER_ICON_SLUG}" variant="mask" [size]="16" />
  </ids-masthead-avatar>
</ids-masthead>
`.trim();

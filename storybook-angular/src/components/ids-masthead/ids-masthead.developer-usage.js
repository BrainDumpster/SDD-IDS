/** Developer usage + Docs tab copy for IDS Masthead (Angular, composition API). */

export const MASTHEAD_DOCS_DESCRIPTION = `
## Overview

Top application bar with brand, product name, icons, and avatar slots.

## Props

### \`ids-masthead-action-icon-button\`

| Input | Type | Default |
|-------|------|---------|
| \`badgeType\` | \`BadgeType\` | \`"critical"\` |

### \`ids-masthead-avatar\`

| Input | Type | Default |
|-------|------|---------|
| \`imageAlt\` | \`—\` | \`"User avatar"\` |

## Events

No dedicated \`@Output()\` events beyond standard DOM handlers.

## API

Import \`IDS_MASTHEAD_IMPORTS\` from the component imports barrel (compiled \`lib/angular/ids/masthead\`).

\`\`\`ts
import { IDS_MASTHEAD_IMPORTS } from "@ids/angular/masthead";
\`\`\`
`.trim();

export const MASTHEAD_SOURCE_CODE = `import { Component } from "@angular/core";
import { provideZoneChangeDetection } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { IDS_MASTHEAD_IMPORTS } from "./ids-masthead/ids-masthead.imports";
import { IDS_APP_LAUNCHER_IMPORTS } from "lib/angular/ids/app-launcher";
import { MASTHEAD_SPEC_ACCURATE_DEFAULTS } from "@component-contracts/ids/masthead.contract";

@Component({
  standalone: true,
  imports: [...IDS_MASTHEAD_IMPORTS, ...IDS_APP_LAUNCHER_IMPORTS],
  template: \`
    <ids-masthead [productName]="productName">
      <ids-masthead-action-button-container>
        <ids-masthead-action-icon-button ariaLabel="Help">
          <ids-icon shapeName="${MASTHEAD_HELP_ICON_SLUG}" variant="mask" [size]="16" />
        </ids-masthead-action-icon-button>
      </ids-masthead-action-button-container>

      <ids-app-launcher
        mastheadAppLauncher
        triggerVariant="masthead"
        [sideOffset]="0"
        [products]="launcherProducts"
      />

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
  readonly launcherProducts = [
    { id: "p1", name: "Product Name 1" },
    { id: "p2", name: "Product Name 2" },
  ];
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

/** Shared Spec Accurate App Launcher products (design-spec two-product surface). */
export const MASTHEAD_LAUNCHER_PRODUCTS = [
  { id: "p1", name: "Product Name 1" },
  { id: "p2", name: "Product Name 2" },
];

const APP_LAUNCHER_SLOT = `
  <ids-app-launcher
    mastheadAppLauncher
    triggerVariant="masthead"
    [sideOffset]="0"
    [products]="launcherProducts"
  />
`.trim();

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
    ${APP_LAUNCHER_SLOT}
  }

  @if (avatarMode === 'initials') {
    <ids-masthead-avatar
      [initials]="avatarInitials"
      [ariaLabel]="avatarAriaLabel"
    />
  } @else {
    <ids-masthead-avatar
      [icon]="'${MASTHEAD_USER_ICON_SLUG}'"
      [ariaLabel]="avatarAriaLabel"
    />
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

  ${APP_LAUNCHER_SLOT}

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

  ${APP_LAUNCHER_SLOT}

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

  ${APP_LAUNCHER_SLOT}

  <ids-masthead-avatar
    [icon]="'${MASTHEAD_USER_ICON_SLUG}'"
    ariaLabel="User settings"
  />
</ids-masthead>
`.trim();

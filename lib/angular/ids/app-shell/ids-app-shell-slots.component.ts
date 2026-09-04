/**
 * IDS App Shell projection slots — CSS class names match React `IdsAppShell.module.css`.
 * Source: `components/ids/app-shell/design-spec.md` + `lib/react/ids/app-shell`.
 */
import { NgTemplateOutlet } from "@angular/common";
import {
  Component,
  Inject,
  Input,
  Optional,
  ViewEncapsulation,
} from "@angular/core";
import { IDS_FOOTER_IMPORTS } from "../footer/index";
import { IdsIconComponent } from "../icon/ids-icon.component";
import { IDS_MAIN_MENU_LEFT_IMPORTS } from "../main-menu-left/index";
import { IDS_MASTHEAD_IMPORTS } from "../masthead/index";
import {
  IDS_APP_SHELL_CONTEXT,
  type IdsAppShellContext,
} from "./ids-app-shell.context";
import type { MainMenuLeftSelectionDetail } from "./ids-app-shell.types";
import { resolvePageTitle } from "./ids-app-shell.utils";

function requireAppShell(ctx: IdsAppShellContext | null, slot: string): IdsAppShellContext {
  if (!ctx) {
    throw new Error(`${slot} must be used within ids-app-shell.`);
  }
  return ctx;
}

@Component({
  selector: "ids-app-shell-header-actions",
  standalone: true,
  template: `<div class="IdsAppShellHeaderActions" data-ids="IdsAppShellHeaderActions"><ng-content /></div>`,
  styles: [
    `
      :host {
        display: inline-flex;
        align-items: center;
        height: 100%;
      }
      .IdsAppShellHeaderActions {
        display: inline-flex;
        flex-direction: row;
        align-items: center;
        height: 100%;
        min-height: 0;
        box-sizing: border-box;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class IdsAppShellHeaderActionsComponent {}

@Component({
  selector: "ids-app-shell-page-panel",
  standalone: true,
  template: `
    <section
      class="IdsAppShellPagePanel"
      data-ids="IdsAppShellPagePanel"
      [attr.aria-label]="title"
    >
      <h2 class="IdsAppShellPagePanelTitle">{{ title }}</h2>
      <div class="IdsAppShellPagePanelBody"><ng-content /></div>
    </section>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class IdsAppShellPagePanelComponent {
  @Input({ required: true }) title!: string;
}

@Component({
  selector: "ids-app-shell-masthead-slot",
  standalone: true,
  imports: [...IDS_MASTHEAD_IMPORTS, IdsIconComponent],
  template: `
    <div class="IdsAppShellMastheadSlot" data-ids="IdsAppShellMastheadSlot">
      <ids-masthead [productName]="ctx.resolvedMastheadProductName">
        @if (ctx.resolvedMastheadProductIconSlug) {
          <ids-masthead-logo>
            <span class="IdsAppShellMastheadLogo" aria-hidden="true">
              <ids-icon
                [shape]="ctx.resolvedMastheadProductIconSlug"
                variant="img"
                [size]="32"
              />
            </span>
          </ids-masthead-logo>
        }
        <ng-content select="ids-app-shell-header-actions" />
        <ng-content select="ids-masthead-action-button-container" />
        <ng-content select="[mastheadAppLauncher]" />
        <ng-content select="ids-masthead-avatar" />
      </ids-masthead>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class IdsAppShellMastheadSlotComponent {
  readonly ctx: IdsAppShellContext;

  constructor(@Optional() @Inject(IDS_APP_SHELL_CONTEXT) ctx: IdsAppShellContext | null) {
    this.ctx = requireAppShell(ctx, "ids-app-shell-masthead-slot");
  }
}

@Component({
  selector: "ids-app-shell-main-menu-slot",
  standalone: true,
  imports: [...IDS_MAIN_MENU_LEFT_IMPORTS],
  template: `
    <div class="IdsAppShellMainMenuSlot" data-ids="IdsAppShellMainMenuSlot">
      <ids-main-menu-left
        [items]="ctx.resolvedMainMenu.items ?? []"
        [expanded]="ctx.resolvedMenuExpanded"
        [defaultSelectedItemId]="ctx.resolvedMainMenu.defaultSelectedItemId ?? null"
        [ariaLabel]="$any(menuAriaLabel)"
        (expandedChange)="ctx.handleMenuExpandedChange($event)"
        (navigate)="ctx.handleNavigate($event)"
        (selectedChange)="onSelected($event)"
      />
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class IdsAppShellMainMenuSlotComponent {
  readonly ctx: IdsAppShellContext;

  constructor(@Optional() @Inject(IDS_APP_SHELL_CONTEXT) ctx: IdsAppShellContext | null) {
    this.ctx = requireAppShell(ctx, "ids-app-shell-main-menu-slot");
  }

  get menuAriaLabel(): string {
    return this.ctx.resolvedMainMenu.ariaLabel || "Main menu left";
  }

  onSelected(detail: MainMenuLeftSelectionDetail): void {
    this.ctx.handleMenuSelected(detail);
  }
}

@Component({
  selector: "ids-app-shell-page-title",
  standalone: true,
  template: `
    @if (ctx.pageTitleLevel === 2) {
      <h2
        class="IdsAppShellPageTitle"
        data-ids="IdsAppShellPageTitle"
        [attr.tabindex]="ctx.focusManagementOnNavigate ? -1 : null"
      >
        {{ titleText }}
      </h2>
    } @else {
      <h1
        class="IdsAppShellPageTitle"
        data-ids="IdsAppShellPageTitle"
        [attr.tabindex]="ctx.focusManagementOnNavigate ? -1 : null"
      >
        {{ titleText }}
      </h1>
    }
  `,
  encapsulation: ViewEncapsulation.None,
})
export class IdsAppShellPageTitleComponent {
  readonly ctx: IdsAppShellContext;

  constructor(@Optional() @Inject(IDS_APP_SHELL_CONTEXT) ctx: IdsAppShellContext | null) {
    this.ctx = requireAppShell(ctx, "ids-app-shell-page-title");
  }

  get titleText(): string {
    return resolvePageTitle(this.ctx.activePage);
  }
}

@Component({
  selector: "ids-app-shell-page-description",
  standalone: true,
  template: `
    @if (visible) {
      <p
        id="page-description"
        class="IdsAppShellPageDescription"
        data-ids="IdsAppShellPageDescription"
      >
        {{ ctx.activePage?.description }}
      </p>
    }
  `,
  encapsulation: ViewEncapsulation.None,
})
export class IdsAppShellPageDescriptionComponent {
  readonly ctx: IdsAppShellContext;

  constructor(@Optional() @Inject(IDS_APP_SHELL_CONTEXT) ctx: IdsAppShellContext | null) {
    this.ctx = requireAppShell(ctx, "ids-app-shell-page-description");
  }

  get visible(): boolean {
    if (!this.ctx.showDescription) return false;
    const description = this.ctx.activePage?.description;
    return description != null && description !== "";
  }
}

@Component({
  selector: "ids-app-shell-page-header",
  standalone: true,
  imports: [IdsAppShellPageTitleComponent, IdsAppShellPageDescriptionComponent],
  template: `
    <div class="IdsAppShellPageHeader" data-ids="IdsAppShellPageHeader">
      <ids-app-shell-page-title />
      <ids-app-shell-page-description />
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class IdsAppShellPageHeaderComponent {
  constructor(@Optional() @Inject(IDS_APP_SHELL_CONTEXT) ctx: IdsAppShellContext | null) {
    requireAppShell(ctx, "ids-app-shell-page-header");
  }
}

@Component({
  selector: "ids-app-shell-body-content-slot",
  standalone: true,
  imports: [NgTemplateOutlet],
  template: `
    <div class="IdsAppShellBodyContentSlot" data-ids="IdsAppShellBodyContentSlot">
      @if (ctx.activePage?.content) {
        <ng-container
          *ngTemplateOutlet="
            ctx.activePage!.content!;
            context: { $implicit: ctx.activePage, name: ctx.activePage?.title }
          "
        />
      }
      <ng-content />
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class IdsAppShellBodyContentSlotComponent {
  readonly ctx: IdsAppShellContext;

  constructor(@Optional() @Inject(IDS_APP_SHELL_CONTEXT) ctx: IdsAppShellContext | null) {
    this.ctx = requireAppShell(ctx, "ids-app-shell-body-content-slot");
  }
}

@Component({
  selector: "ids-app-shell-body-viewport",
  standalone: true,
  imports: [IdsAppShellBodyContentSlotComponent],
  template: `
    <div class="IdsAppShellBodyViewport" data-ids="IdsAppShellBodyViewport">
      <ids-app-shell-body-content-slot />
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class IdsAppShellBodyViewportComponent {
  constructor(@Optional() @Inject(IDS_APP_SHELL_CONTEXT) ctx: IdsAppShellContext | null) {
    requireAppShell(ctx, "ids-app-shell-body-viewport");
  }
}

@Component({
  selector: "ids-app-shell-footer-slot",
  standalone: true,
  imports: [...IDS_FOOTER_IMPORTS],
  template: `
    <div class="IdsAppShellFooterSlot" data-ids="IdsAppShellFooterSlot">
      <ids-footer>
        @if (showLeftRegion) {
          <ids-footer-left-region>
            @if (ctx.resolvedFooter.showHostname && ctx.resolvedFooter.hostname) {
              <ids-footer-host-name [hostname]="ctx.resolvedFooter.hostname" />
            }
            @if (ctx.resolvedFooter.swid) {
              <ids-footer-swid-group
                [swid]="ctx.resolvedFooter.swid"
                [copyDisabled]="ctx.resolvedFooter.copyDisabled"
                (copySwid)="ctx.handleCopySwid($event)"
              />
            }
          </ids-footer-left-region>
        }
        @if (ctx.resolvedFooter.showCurrentDateAndTime && ctx.resolvedFooter.currentDateTime) {
          <ids-footer-time-group [currentDateTime]="ctx.resolvedFooter.currentDateTime" />
        }
        @if (ctx.resolvedFooter.showTimeZone) {
          <ids-footer-time-zone-group
            [timeZoneLabel]="ctx.resolvedFooter.timeZoneLabel ?? ''"
            [disabled]="ctx.resolvedFooter.timeZoneDisabled"
            (timeZoneClick)="ctx.handleTimeZoneClick()"
          />
        }
      </ids-footer>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class IdsAppShellFooterSlotComponent {
  readonly ctx: IdsAppShellContext;

  constructor(@Optional() @Inject(IDS_APP_SHELL_CONTEXT) ctx: IdsAppShellContext | null) {
    this.ctx = requireAppShell(ctx, "ids-app-shell-footer-slot");
  }

  get showLeftRegion(): boolean {
    const f = this.ctx.resolvedFooter;
    return Boolean((f.showHostname && f.hostname) || f.swid);
  }
}

@Component({
  selector: "ids-app-shell-main-column",
  standalone: true,
  imports: [
    IdsAppShellPageHeaderComponent,
    IdsAppShellBodyViewportComponent,
    IdsAppShellFooterSlotComponent,
  ],
  template: `
    <main
      id="main-content"
      class="IdsAppShellMainColumn"
      data-ids="IdsAppShellMainColumn"
      [attr.aria-describedby]="ctx.showDescription ? 'page-description' : null"
    >
      <ids-app-shell-page-header />
      <ids-app-shell-body-viewport />
      <ids-app-shell-footer-slot />
    </main>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class IdsAppShellMainColumnComponent {
  readonly ctx: IdsAppShellContext;

  constructor(@Optional() @Inject(IDS_APP_SHELL_CONTEXT) ctx: IdsAppShellContext | null) {
    this.ctx = requireAppShell(ctx, "ids-app-shell-main-column");
  }
}

@Component({
  selector: "ids-app-shell-body-row",
  standalone: true,
  imports: [IdsAppShellMainMenuSlotComponent, IdsAppShellMainColumnComponent],
  template: `
    <div class="IdsAppShellBodyRow" data-ids="IdsAppShellBodyRow">
      <ids-app-shell-main-menu-slot />
      <ids-app-shell-main-column />
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class IdsAppShellBodyRowComponent {
  constructor(@Optional() @Inject(IDS_APP_SHELL_CONTEXT) ctx: IdsAppShellContext | null) {
    requireAppShell(ctx, "ids-app-shell-body-row");
  }
}

/**
 * Storybook demo host for IDS App Shell Spec Accurate Design.
 * Defaults from `components/ids/app-shell/design-spec.md` Spec Accurate Design section.
 *
 * Masthead chrome uses TemplateRef inputs (React `headerActions` / `appLauncherSlot` / `avatarSlot`)
 * — nested ng-content into Masthead is unreliable in Angular.
 */
import { CommonModule } from "@angular/common";
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { FOOTER_SPEC_ACCURATE_DEFAULTS } from "@component-contracts/ids/footer.contract";
import { IdsAppLauncherComponent } from "../app-launcher/ids-app-launcher.component";
import { APP_SHELL_SPEC_ACCURATE_LAUNCHER_PRODUCTS } from "../app-launcher/ids-app-launcher.types";
import { IdsIconComponent } from "../icon/ids-icon.component";
import {
  IdsMastheadActionButtonContainerComponent,
  IdsMastheadActionIconButtonComponent,
  IdsMastheadAvatarComponent,
} from "../masthead/index";
import { IdsAppShellComponent } from "./ids-app-shell.component";
import {
  IdsAppShellHeaderActionsComponent,
  IdsAppShellPagePanelComponent,
} from "./ids-app-shell-slots.component";
import type {
  IdsAppShellBreakpointPreset,
  IdsAppShellPage,
  MainMenuLeftPrimaryItem,
} from "./ids-app-shell.types";

const PAGE_DESCRIPTION =
  "This subtitle is meant for instructional text that outlines the purpose of this page. It's advisable to include such text unless the page is a dashboard or self-explanatory.";

/** design-spec Spec Accurate Design menuItems */
export const APP_SHELL_SPEC_ACCURATE_MENU_ITEMS: MainMenuLeftPrimaryItem[] = [
  { id: "dashboard", name: "Dashboard", iconName: "home", routeRef: "/dashboard" },
  {
    id: "infrastructure",
    name: "Infrastructure",
    iconName: "network-share",
    routeRef: "/infrastructure",
    childrenMenu: "collapsed",
    children: [
      { id: "infra-a", name: "Clusters", routeRef: "/infrastructure/clusters" },
      { id: "infra-b", name: "Storage", routeRef: "/infrastructure/storage" },
    ],
  },
  { id: "protection", name: "Protection", iconName: "shield-encrypt-alt", routeRef: "/protection" },
  { id: "recovery", name: "Recovery", iconName: "arrows-spin", routeRef: "/recovery" },
  { id: "alerts", name: "Alerts and Events", iconName: "alert-bell", routeRef: "/alerts" },
  { id: "reports", name: "Reports", iconName: "productivity-alt", routeRef: "/reports" },
  {
    id: "administration",
    name: "Administration",
    iconName: "user-settings",
    routeRef: "/administration",
  },
  { id: "jobs", name: "Jobs", iconName: "time-detail", routeRef: "/jobs" },
];

@Component({
  selector: "ids-app-shell-demo-host",
  standalone: true,
  imports: [
    CommonModule,
    IdsAppShellComponent,
    IdsAppShellHeaderActionsComponent,
    IdsAppShellPagePanelComponent,
    IdsMastheadActionButtonContainerComponent,
    IdsMastheadActionIconButtonComponent,
    IdsMastheadAvatarComponent,
    IdsAppLauncherComponent,
    IdsIconComponent,
  ],
  template: `
    <ng-template #pagePanelTpl let-name="name">
      <ids-app-shell-page-panel [title]="(name || 'Page') + ' content'">
        <p style="margin: 0">
          Body content for <strong>{{ name || "Page" }}</strong> — swap this slot with
          product views.
        </p>
      </ids-app-shell-page-panel>
    </ng-template>

    <ng-template #headerActionsTpl>
      <ids-app-shell-header-actions>
        <ids-masthead-action-button-container>
          <ids-masthead-action-icon-button ariaLabel="Search">
            <ids-icon shape="search-16" variant="mask" [size]="16" />
          </ids-masthead-action-icon-button>
          <ids-masthead-action-icon-button
            ariaLabel="Alerts, 3 unread"
            [badgeCount]="3"
            badgeType="critical"
          >
            <ids-icon shape="alert-bell-16" variant="mask" [size]="16" />
          </ids-masthead-action-icon-button>
          <ids-masthead-action-icon-button
            ariaLabel="Jobs queue, 2 active"
            [badgeCount]="2"
            badgeType="success"
          >
            <ids-icon shape="jobs-queue-stack" variant="mask" [size]="16" />
          </ids-masthead-action-icon-button>
          <ids-masthead-action-icon-button ariaLabel="Settings">
            <ids-icon shape="setting-gear-16" variant="mask" [size]="16" />
          </ids-masthead-action-icon-button>
          <ids-masthead-action-icon-button ariaLabel="Help">
            <ids-icon shape="help-circ-16" variant="mask" [size]="16" />
          </ids-masthead-action-icon-button>
        </ids-masthead-action-button-container>
      </ids-app-shell-header-actions>
    </ng-template>

    <ng-template #appLauncherTpl>
      <ids-app-launcher
        triggerVariant="masthead"
        [sideOffset]="0"
        [products]="launcherProducts"
      />
    </ng-template>

    <ng-template #avatarTpl>
      <ids-masthead-avatar initials="DT" ariaLabel="User settings" />
    </ng-template>

    <ids-app-shell
      [pages]="pages"
      [menuItems]="menuItems"
      [defaultPageId]="defaultPageId"
      [defaultMenuExpanded]="defaultMenuExpanded"
      [breakpointPreset]="breakpointPreset"
      [mastheadProductName]="mastheadProductName"
      [mastheadProductIconSlug]="mastheadProductIconSlug"
      [headerActions]="headerActionsTpl"
      [appLauncherSlot]="appLauncherTpl"
      [avatarSlot]="avatarTpl"
      [footerHostname]="footerHostname"
      [footerSwid]="footerSwid"
      [footerCurrentDateTime]="footerCurrentDateTime"
      [footerTimeZoneLabel]="footerTimeZoneLabel"
      [showFooterHostname]="true"
      [showFooterDateTime]="true"
      [showFooterTimeZone]="true"
    />
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
        height: 100vh;
        height: 100dvh;
        min-height: 0;
      }
    `,
  ],
})
export class IdsAppShellDemoHostComponent implements AfterViewInit {
  @Input() breakpointPreset: IdsAppShellBreakpointPreset | string = "1920";
  @Input() defaultPageId = "dashboard";
  @Input() defaultMenuExpanded = true;
  @Input() mastheadProductName = "Product Name";
  @Input() mastheadProductIconSlug = "shield-cloud";
  @Input() footerHostname = FOOTER_SPEC_ACCURATE_DEFAULTS.hostname;
  @Input() footerSwid = FOOTER_SPEC_ACCURATE_DEFAULTS.swid;
  @Input() footerCurrentDateTime = FOOTER_SPEC_ACCURATE_DEFAULTS.currentDateTime;
  @Input() footerTimeZoneLabel = FOOTER_SPEC_ACCURATE_DEFAULTS.timeZoneLabel;
  @Input() menuItems: MainMenuLeftPrimaryItem[] = APP_SHELL_SPEC_ACCURATE_MENU_ITEMS;

  readonly launcherProducts = APP_SHELL_SPEC_ACCURATE_LAUNCHER_PRODUCTS;

  @ViewChild("pagePanelTpl") pagePanelTpl?: TemplateRef<{ name: string }>;

  pages: IdsAppShellPage[] = [];

  constructor(private readonly cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    const tpl = this.pagePanelTpl ?? null;
    this.pages = this.menuItems.map((item) => {
      const name = item.name ?? item.label ?? "Page";
      return {
        id: item.id ?? name,
        title: name,
        description: PAGE_DESCRIPTION,
        content: tpl,
      };
    });
    this.cdr.detectChanges();
  }
}

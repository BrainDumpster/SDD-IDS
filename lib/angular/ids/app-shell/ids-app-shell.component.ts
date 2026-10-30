/**
 * IDS App Shell — Angular implementation matching `lib/react/ids/app-shell`.
 * Source: `components/ids/app-shell/design-spec.md`
 * Theme: `components/ids-theme.css`
 */
import { NgTemplateOutlet } from "@angular/common";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { IdsIconComponent } from "../icon/ids-icon.component";
import { IDS_MASTHEAD_IMPORTS } from "../masthead/index";
import {
  IDS_APP_SHELL_CONTEXT,
  type IdsAppShellContext,
} from "./ids-app-shell.context";
import type { IdsFooterBundleFields } from "./ids-app-shell-footer.model";
import { IdsAppShellBodyRowComponent } from "./ids-app-shell-slots.component";
import type {
  IdsAppShellBreakpointPreset,
  IdsAppShellFooterBundle,
  IdsAppShellMainMenuBundle,
  IdsAppShellMastheadBundle,
  IdsAppShellPage,
  IdsAppShellPageTitleLevel,
  MainMenuLeftLogo,
  MainMenuLeftNavigationTarget,
  MainMenuLeftPrimaryItem,
  MainMenuLeftSelectionDetail,
} from "./ids-app-shell.types";
import {
  isDevBuild,
  MENU_EXPANDED_BREAKPOINT_PX,
  presetMenuExpandedDefault,
  readPersistedMenuExpanded,
  resolveBreakpointPreset,
  resolvePageIdFromTarget,
  shallowMergeDefined,
  writePersistedMenuExpanded,
} from "./ids-app-shell.utils";

@Component({
  selector: "ids-app-shell",
  standalone: true,
  imports: [
    NgTemplateOutlet,
    ...IDS_MASTHEAD_IMPORTS,
    IdsIconComponent,
    IdsAppShellBodyRowComponent,
  ],
  templateUrl: "./ids-app-shell.component.html",
  styleUrl: "./ids-app-shell.component.scss",
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: IDS_APP_SHELL_CONTEXT, useExisting: IdsAppShellComponent }],
  host: {
    class: "ids-app-shell-host",
    "[attr.data-ids]": "'IdsAppShell'",
  },
})
export class IdsAppShellComponent
  implements OnInit, OnChanges, OnDestroy, IdsAppShellContext
{
  @Input() pages: IdsAppShellPage[] = [];
  @Input() activePageId?: string;
  @Input() defaultPageId?: string;
  @Input() menuItems: MainMenuLeftPrimaryItem[] = [];
  @Input() menuLogo?: MainMenuLeftLogo;
  @Input() menuAriaLabel?: string;
  @Input() defaultMenuSelectedItemId?: string;
  @Input() menuExpanded?: boolean;
  @Input() defaultMenuExpanded?: boolean;
  @Input() persistMenuExpanded = false;
  @Input() mastheadProductName = "";
  @Input() mastheadProductIconSlug?: string;
  /**
   * React parity: `headerActions` → Masthead `iconsSlot`.
   * Prefer TemplateRef inputs over nested ng-content (Angular drops multi-level projection).
   */
  @Input() headerActions?: TemplateRef<unknown> | null;
  /** React parity: `appLauncherSlot` → Masthead `appLauncherSlot`. */
  @Input() appLauncherSlot?: TemplateRef<unknown> | null;
  /** React parity: `avatarSlot` → Masthead `avatarSlot`. */
  @Input() avatarSlot?: TemplateRef<unknown> | null;
  @Input() footerHostname?: string;
  @Input() footerSwid?: string;
  @Input() footerCurrentDateTime?: string;
  @Input() footerTimeZoneLabel?: string;
  @Input() showFooterHostname = true;
  @Input() showFooterDateTime = true;
  @Input() showFooterTimeZone = true;
  @Input() masthead?: IdsAppShellMastheadBundle | null;
  /** Nested Main Menu bundle (React `mainMenu`) — wins over flat props when set. */
  @Input() mainMenu?: IdsAppShellMainMenuBundle | null;
  /** Nested Footer bundle (React `footer`) — wins over flat props when set. */
  @Input() footer?: IdsAppShellFooterBundle | null;
  @Input() showPageDescription = true;
  @Input() focusManagementOnNavigate = true;
  @Input() pageTitleLevel: IdsAppShellPageTitleLevel = 1;
  @Input() breakpointPreset: IdsAppShellBreakpointPreset | string = "fluid";
  @Input() className?: string;

  @Output() readonly pageChange = new EventEmitter<{
    pageId: string;
    page: IdsAppShellPage;
  }>();
  @Output() readonly navigate = new EventEmitter<MainMenuLeftNavigationTarget>();
  @Output() readonly menuSelected = new EventEmitter<MainMenuLeftSelectionDetail>();
  @Output() readonly menuExpandedChange = new EventEmitter<boolean>();
  @Output() readonly copySwid = new EventEmitter<string>();
  @Output() readonly timeZoneClick = new EventEmitter<void>();

  @ViewChild("shellRoot", { read: ElementRef })
  private shellRoot?: ElementRef<HTMLElement>;

  private mediaQuery?: MediaQueryList;
  private mediaListener?: () => void;
  private breakpointExpandedDefault = true;
  private internalMenuExpanded = true;
  private internalPageId = "";

  constructor(private readonly cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.applyBreakpointDefault();
    if (this.defaultMenuExpanded !== undefined) {
      this.internalMenuExpanded = this.defaultMenuExpanded;
    } else if (this.persistMenuExpanded) {
      const stored = readPersistedMenuExpanded();
      this.internalMenuExpanded = stored ?? this.breakpointExpandedDefault;
    } else {
      this.internalMenuExpanded = this.breakpointExpandedDefault;
    }
    this.internalPageId = this.defaultPageId ?? this.pages[0]?.id ?? "";
    this.bindBreakpointListener();
    this.devValidate();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["breakpointPreset"] && !changes["breakpointPreset"].firstChange) {
      this.unbindBreakpointListener();
      this.applyBreakpointDefault();
      this.bindBreakpointListener();
      this.syncUncontrolledMenuFromBreakpoint();
    }
    if (
      (changes["pages"] || changes["defaultPageId"]) &&
      this.activePageId === undefined
    ) {
      const fallback = this.defaultPageId ?? this.pages[0]?.id ?? "";
      if (!this.pages.find((p) => p.id === this.internalPageId)) {
        this.internalPageId = fallback;
      }
    }
    this.devValidate();
    this.cdr.markForCheck();
  }

  ngOnDestroy(): void {
    this.unbindBreakpointListener();
  }

  get resolvedBreakpointPreset(): IdsAppShellBreakpointPreset {
    return resolveBreakpointPreset(this.breakpointPreset);
  }

  get rootClass(): string {
    return ["IdsAppShell", this.className].filter(Boolean).join(" ");
  }

  get resolvedMenuExpanded(): boolean {
    const fromBundle = this.mainMenu?.expanded;
    if (fromBundle !== undefined) return fromBundle;
    if (this.menuExpanded !== undefined) return this.menuExpanded;
    return this.internalMenuExpanded;
  }

  get activePage(): IdsAppShellPage | undefined {
    if (this.pages.length === 0) return undefined;
    const id =
      this.activePageId !== undefined ? this.activePageId : this.internalPageId;
    const found = this.pages.find((page) => page.id === id);
    if (found) return found;
    if (isDevBuild() && id) {
      const fallback = this.defaultPageId ?? this.pages[0].id;
      console.warn(
        `[AppShell] Unknown activePageId "${id}"; falling back to "${fallback}".`,
      );
    }
    return (
      this.pages.find((page) => page.id === (this.defaultPageId ?? "")) ?? this.pages[0]
    );
  }

  get showDescription(): boolean {
    const page = this.activePage;
    return (
      this.showPageDescription &&
      page?.showDescription !== false &&
      Boolean(page?.description)
    );
  }

  get resolvedMastheadProductName(): string {
    return this.masthead?.productName ?? this.mastheadProductName;
  }

  get resolvedMastheadProductIconSlug(): string | null {
    if (this.masthead?.logoSlug) return this.masthead.logoSlug;
    if (this.mastheadProductIconSlug) return this.mastheadProductIconSlug;
    return null;
  }

  get resolvedMainMenu(): IdsAppShellMainMenuBundle {
    const initialMenuSelectedItemId =
      this.defaultMenuSelectedItemId ??
      this.defaultPageId ??
      this.pages[0]?.menuItemId ??
      this.pages[0]?.id;
    return shallowMergeDefined<IdsAppShellMainMenuBundle>(
      {
        items: this.menuItems ?? [],
        logo: this.menuLogo,
        expanded: this.resolvedMenuExpanded,
        defaultSelectedItemId: initialMenuSelectedItemId,
        ariaLabel: this.menuAriaLabel,
      },
      this.mainMenu,
    );
  }

  get resolvedFooter(): IdsFooterBundleFields {
    return shallowMergeDefined<IdsFooterBundleFields>(
      {
        hostname: this.footerHostname,
        swid: this.footerSwid,
        currentDateTime: this.footerCurrentDateTime,
        timeZoneLabel: this.footerTimeZoneLabel,
        showHostname: this.showFooterHostname,
        showCurrentDateAndTime: this.showFooterDateTime,
        showTimeZone: this.showFooterTimeZone,
        copyDisabled: false,
        timeZoneDisabled: false,
      },
      {
        hostname: this.footer?.hostname,
        swid: this.footer?.swid,
        currentDateTime: this.footer?.currentDateTime,
        timeZoneLabel: this.footer?.timeZoneLabel,
        showHostname: this.footer?.showHostname,
        showCurrentDateAndTime: this.footer?.showCurrentDateAndTime,
        showTimeZone: this.footer?.showTimeZone,
        copyDisabled: this.footer?.copyDisabled,
        timeZoneDisabled: this.footer?.timeZoneDisabled,
      },
    );
  }

  handleMenuExpandedChange(expanded: boolean): void {
    const menuControlled =
      this.menuExpanded !== undefined || this.mainMenu?.expanded !== undefined;
    if (!menuControlled) {
      this.internalMenuExpanded = expanded;
    }
    if (this.persistMenuExpanded) {
      writePersistedMenuExpanded(expanded);
    }
    this.menuExpandedChange.emit(expanded);
    this.cdr.markForCheck();
  }

  handleNavigate(target: MainMenuLeftNavigationTarget): void {
    this.navigate.emit(target);
    const pageId = resolvePageIdFromTarget(target, this.pages);
    if (pageId) {
      this.setActivePage(pageId);
    }
  }

  handleMenuSelected(detail: MainMenuLeftSelectionDetail): void {
    this.menuSelected.emit(detail);
  }

  handleCopySwid(swid: string): void {
    this.copySwid.emit(swid);
  }

  handleTimeZoneClick(): void {
    this.timeZoneClick.emit();
  }

  private setActivePage(pageId: string): void {
    const page = this.pages.find((entry) => entry.id === pageId);
    if (!page) return;
    if (this.activePageId === undefined) {
      this.internalPageId = pageId;
    }
    this.pageChange.emit({ pageId, page });
    if (this.focusManagementOnNavigate) {
      requestAnimationFrame(() => this.focusPageTitle());
    }
    this.cdr.markForCheck();
  }

  focusPageTitle(): void {
    const root = this.shellRoot?.nativeElement;
    const title = root?.querySelector<HTMLElement>(".IdsAppShellPageTitle");
    title?.focus();
  }

  private applyBreakpointDefault(): void {
    const preset = resolveBreakpointPreset(this.breakpointPreset);
    const pinned = presetMenuExpandedDefault(preset);
    this.breakpointExpandedDefault =
      pinned ??
      (typeof window !== "undefined"
        ? window.matchMedia(`(min-width: ${MENU_EXPANDED_BREAKPOINT_PX}px)`).matches
        : true);
  }

  private bindBreakpointListener(): void {
    if (typeof window === "undefined") return;
    const preset = resolveBreakpointPreset(this.breakpointPreset);
    if (presetMenuExpandedDefault(preset) !== null) return;

    this.mediaQuery = window.matchMedia(
      `(min-width: ${MENU_EXPANDED_BREAKPOINT_PX}px)`,
    );
    this.mediaListener = () => {
      this.breakpointExpandedDefault = this.mediaQuery!.matches;
      this.syncUncontrolledMenuFromBreakpoint();
      this.cdr.markForCheck();
    };
    this.mediaQuery.addEventListener("change", this.mediaListener);
  }

  private unbindBreakpointListener(): void {
    if (this.mediaQuery && this.mediaListener) {
      this.mediaQuery.removeEventListener("change", this.mediaListener);
    }
    this.mediaQuery = undefined;
    this.mediaListener = undefined;
  }

  private syncUncontrolledMenuFromBreakpoint(): void {
    const menuControlled =
      this.menuExpanded !== undefined || this.mainMenu?.expanded !== undefined;
    if (menuControlled || this.defaultMenuExpanded !== undefined) return;
    if (this.persistMenuExpanded) {
      const stored = readPersistedMenuExpanded();
      if (stored !== null) {
        this.internalMenuExpanded = stored;
        return;
      }
    }
    this.internalMenuExpanded = this.breakpointExpandedDefault;
  }

  private devValidate(): void {
    if (!isDevBuild()) return;
    if (!this.resolvedMastheadProductName) {
      console.error(
        "[AppShell] mastheadProductName is required when MastheadSlot is not composed.",
      );
    }
    if (this.pages.length === 0) {
      console.error(
        "[AppShell] pages[] is empty; rendering page header with empty title and body.",
      );
    }
  }
}

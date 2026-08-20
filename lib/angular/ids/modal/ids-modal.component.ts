import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  MODAL_ALERTING_DIALOG_TYPES,
  MODAL_API_DEFAULTS,
  MODAL_DIALOG_STATUS_ICON,
  MODAL_FOOTER_CHECKBOX_LABEL,
  MODAL_TWO_BUTTON_DIALOG_TYPES,
  resolveModalScenario,
  type ModalDialogType,
  type ModalLayer,
  type ModalPage,
  type ModalScenario,
  type ModalSize,
  type ModalStatusIconBinding,
} from "@component-contracts/ids/modal.contract";
import { IdsButtonComponent } from "../button/ids-button.component";
import { IdsCheckboxComponent } from "../checkbox/ids-checkbox.component";
import { IdsIconComponent } from "../icon/ids-icon.component";
import { IDS_MODAL_CONTEXT, type IdsModalContext } from "./ids-modal-context";
import { IdsModalBodyComponent } from "./ids-modal-body.component";
import { IdsModalCloseComponent } from "./ids-modal-close.component";
import { IdsModalFooterComponent } from "./ids-modal-footer.component";
import { IdsModalTitleComponent } from "./ids-modal-title.component";

const FOCUSABLE =
  'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

@Component({
  selector: "ids-modal",
  standalone: true,
  imports: [CommonModule, IdsButtonComponent, IdsCheckboxComponent, IdsIconComponent],
  templateUrl: "./ids-modal.component.html",
  styleUrl: "./ids-modal.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: IDS_MODAL_CONTEXT, useExisting: IdsModalComponent }],
})
export class IdsModalComponent
  implements IdsModalContext, AfterViewInit, AfterContentInit, OnChanges, OnDestroy
{
  @ViewChild("dialogRef") dialogRef?: ElementRef<HTMLDialogElement>;
  @ViewChild("legacyContentRef") legacyContentRef?: ElementRef<HTMLElement>;

  @ContentChild(IdsModalTitleComponent) titleSlot?: IdsModalTitleComponent;
  @ContentChild(IdsModalBodyComponent) bodySlot?: IdsModalBodyComponent;
  @ContentChild(IdsModalFooterComponent) footerSlot?: IdsModalFooterComponent;
  @ContentChild(IdsModalCloseComponent) closeSlot?: IdsModalCloseComponent;

  @Input() open?: boolean;
  @Input() defaultOpen = false;
  @Input() scenario: ModalScenario = MODAL_API_DEFAULTS.scenario;
  @Input() type: ModalDialogType = MODAL_API_DEFAULTS.type;
  @Input() size: ModalSize = MODAL_API_DEFAULTS.size;
  @Input() layer: ModalLayer = MODAL_API_DEFAULTS.layer;
  /** Shorthand when `ids-modal-title` is not projected. */
  @Input() title = "";
  /** Shorthand when `ids-modal-body` is not projected. */
  @Input() description?: string;
  @Input() closable = MODAL_API_DEFAULTS.closable;
  @Input() scrollBar = MODAL_API_DEFAULTS.scrollBar;
  @Input() tabs = MODAL_API_DEFAULTS.tabs;
  @Input() footerCheckbox = MODAL_API_DEFAULTS.footerCheckbox;
  @Input() fullScreen = MODAL_API_DEFAULTS.fullScreen;
  @Input() pages: ModalPage[] = [];
  @Input() activePageId?: string;
  /** Shorthand when footer buttons are not projected in `ids-modal-footer`. */
  @Input() primaryActionLabel = "";
  @Input() tertiaryActionLabel?: string;
  @Input() enablePrimaryAction = MODAL_API_DEFAULTS.enablePrimaryAction;
  @Input() enableTertiaryAction = MODAL_API_DEFAULTS.enableTertiaryAction;
  /** Override `aria-labelledby` (defaults to generated title id). */
  @Input() labelledBy?: string;
  /** Override `aria-describedby` (defaults when description is present). */
  @Input() describedBy?: string;

  @Output() readonly openChange = new EventEmitter<boolean>();
  @Output() readonly closed = new EventEmitter<void>();
  @Output() readonly primaryAction = new EventEmitter<void>();
  @Output() readonly tertiaryAction = new EventEmitter<void>();
  @Output() readonly pageChange = new EventEmitter<string>();

  readonly titleId = `ids-modal-title-${Math.random().toString(36).slice(2, 9)}`;
  readonly descriptionId = `ids-modal-desc-${Math.random().toString(36).slice(2, 9)}`;
  readonly footerCheckboxLabel = MODAL_FOOTER_CHECKBOX_LABEL;

  activePage = "";
  bodyScrollable = false;
  showScrollShadow = false;

  private hasLegacyBodyContent = false;
  private contentElement: HTMLElement | null = null;
  private contentResizeObserver: ResizeObserver | null = null;
  private focusTrapHandler: ((event: KeyboardEvent) => void) | null = null;
  private previouslyFocused: HTMLElement | null = null;

  constructor(private readonly cdr: ChangeDetectorRef) {}

  ngAfterContentInit(): void {
    this.cdr.markForCheck();
  }

  ngAfterViewInit(): void {
    this.ensureActivePage();
    this.syncDialogOpenState();
    queueMicrotask(() => {
      this.syncContentElement();
      this.detectLegacyBodyContent();
      this.updateContentOverflow();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["pages"] || changes["activePageId"]) {
      this.ensureActivePage();
    }
    if (changes["open"] || changes["defaultOpen"]) {
      this.syncDialogOpenState();
    }
    if (changes["scrollBar"]) {
      queueMicrotask(() => this.updateContentOverflow());
    }
  }

  ngOnDestroy(): void {
    this.teardownFocusTrap();
    this.contentResizeObserver?.disconnect();
  }

  get hasTitleSlot(): boolean {
    return Boolean(this.titleSlot);
  }

  get hasBodySlot(): boolean {
    return Boolean(this.bodySlot);
  }

  get hasFooterSlot(): boolean {
    return Boolean(this.footerSlot);
  }

  get hasCloseSlot(): boolean {
    return Boolean(this.closeSlot);
  }

  get controlled(): boolean {
    return this.open !== undefined;
  }

  get resolvedScenario(): ModalScenario {
    return resolveModalScenario(this.scenario);
  }

  get showSeverityIcon(): boolean {
    return this.resolvedScenario === "dialog" && this.type !== "non-alerting";
  }

  get severityIconSlug(): string {
    return this.severityIcon.shape;
  }

  get severityIcon(): ModalStatusIconBinding {
    if (this.type === "non-alerting") {
      return { shape: "", variant: "img" };
    }
    return MODAL_DIALOG_STATUS_ICON[this.type];
  }

  get showTabs(): boolean {
    return this.resolvedScenario === "multi-page" && this.tabs && this.pages.length > 0;
  }

  get showLegacyDescription(): boolean {
    return !this.hasBodySlot && Boolean(this.description);
  }

  get showLegacyContentRegion(): boolean {
    if (this.hasBodySlot) {
      return false;
    }
    if (this.showTabs) {
      return true;
    }
    if (this.resolvedScenario !== "dialog") {
      return true;
    }
    return this.hasLegacyBodyContent;
  }

  get showTertiaryAction(): boolean {
    if (this.hasFooterSlot) {
      return false;
    }
    if (!this.tertiaryActionLabel) {
      return false;
    }
    if (this.resolvedScenario === "dialog") {
      return MODAL_TWO_BUTTON_DIALOG_TYPES.includes(this.type);
    }
    return true;
  }

  get primaryButtonVariant(): "primary" | "destructive" {
    return this.type === "destructive" ? "destructive" : "primary";
  }

  get activePageContent(): string {
    const page = this.pages.find((item) => item.id === this.activePage);
    return page?.content ?? "";
  }

  get descriptionTypeClass(): string {
    return `ids-modal__description--${this.type}`;
  }

  get contentTypeClass(): string {
    if (MODAL_ALERTING_DIALOG_TYPES.includes(this.type)) {
      return `ids-modal__content--${this.type}`;
    }
    return "";
  }

  get layerClass(): string {
    return `ids-modal--layer-${this.layer}`;
  }

  get sizeClass(): string {
    return `ids-modal--${this.size}`;
  }

  get surfaceClass(): string {
    return [
      "ids-modal__surface",
      this.sizeClass,
      this.fullScreen ? "ids-modal__surface--fullscreen" : "",
    ]
      .filter(Boolean)
      .join(" ");
  }

  get ariaLabelledBy(): string {
    return this.labelledBy ?? this.titleId;
  }

  get ariaDescribedBy(): string | null {
    if (this.describedBy) {
      return this.describedBy;
    }
    if (this.hasBodySlot && this.bodySlot?.resolvedDescription) {
      return this.descriptionId;
    }
    if (this.showLegacyDescription) {
      return this.descriptionId;
    }
    return null;
  }

  registerContentElement(element: HTMLElement | null): void {
    this.contentElement = element;
    this.observeContentElement(element);
    queueMicrotask(() => this.updateContentOverflow());
  }

  openModal(): void {
    if (this.controlled) {
      this.openChange.emit(true);
      return;
    }
    this.dialogRef?.nativeElement.showModal();
    this.setupFocusTrap();
    this.cdr.markForCheck();
    queueMicrotask(() => {
      this.syncContentElement();
      this.detectLegacyBodyContent();
      this.updateContentOverflow();
    });
  }

  closeModal(): void {
    if (!this.closable) {
      return;
    }
    if (this.controlled) {
      this.openChange.emit(false);
      this.closed.emit();
      return;
    }
    this.dialogRef?.nativeElement.close();
    this.teardownFocusTrap();
    this.closed.emit();
    this.cdr.markForCheck();
  }

  onDialogCancel(event: Event): void {
    if (!this.closable) {
      event.preventDefault();
      return;
    }
    if (this.controlled) {
      event.preventDefault();
      this.openChange.emit(false);
      this.closed.emit();
      return;
    }
    this.teardownFocusTrap();
    this.closed.emit();
    this.cdr.markForCheck();
  }

  onDialogClose(): void {
    if (this.controlled) {
      this.openChange.emit(false);
    }
    this.teardownFocusTrap();
    this.closed.emit();
    this.cdr.markForCheck();
  }

  onPrimaryClick(): void {
    this.primaryAction.emit();
  }

  onTertiaryClick(): void {
    this.tertiaryAction.emit();
  }

  selectPage(pageId: string): void {
    if (pageId === this.activePage) {
      return;
    }
    this.activePage = pageId;
    this.pageChange.emit(pageId);
    this.cdr.markForCheck();
    queueMicrotask(() => this.updateContentOverflow());
  }

  isPageActive(pageId: string): boolean {
    return this.activePage === pageId;
  }

  onContentScroll(): void {
    this.updateContentOverflow();
  }

  @HostListener("window:resize")
  onWindowResize(): void {
    this.updateContentOverflow();
  }

  private syncContentElement(): void {
    if (this.hasBodySlot) {
      return;
    }
    this.contentElement = this.legacyContentRef?.nativeElement ?? null;
    this.observeContentElement(this.contentElement);
  }

  private ensureActivePage(): void {
    if (!this.pages.length) {
      this.activePage = "";
      return;
    }
    const preferred = this.activePageId ?? this.activePage;
    const exists = this.pages.some((page) => page.id === preferred);
    this.activePage = exists ? preferred : this.pages[0].id;
  }

  private syncDialogOpenState(): void {
    const dialog = this.dialogRef?.nativeElement;
    if (!dialog) {
      return;
    }
    const shouldOpen = this.controlled ? Boolean(this.open) : this.defaultOpen;
    if (shouldOpen && !dialog.open) {
      dialog.showModal();
      this.setupFocusTrap();
    } else if (!shouldOpen && dialog.open) {
      dialog.close();
      this.teardownFocusTrap();
    }
    this.cdr.markForCheck();
  }

  private updateContentOverflow(): void {
    const el = this.contentElement;
    if (!el) {
      this.bodyScrollable = false;
      this.showScrollShadow = false;
      this.cdr.markForCheck();
      return;
    }

    const scrollable = this.scrollBar && el.scrollHeight - el.clientHeight > 1;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
    this.bodyScrollable = scrollable;
    this.showScrollShadow = scrollable && !atBottom;
    this.cdr.markForCheck();
  }

  private detectLegacyBodyContent(): void {
    const el = this.legacyContentRef?.nativeElement;
    const next = Boolean(
      el && (el.children.length > 0 || (el.textContent?.trim().length ?? 0) > 0),
    );
    if (next !== this.hasLegacyBodyContent) {
      this.hasLegacyBodyContent = next;
      this.cdr.markForCheck();
    }
  }

  private observeContentElement(element: HTMLElement | null): void {
    this.contentResizeObserver?.disconnect();
    if (!element) {
      this.contentResizeObserver = null;
      return;
    }
    this.contentResizeObserver = new ResizeObserver(() => this.updateContentOverflow());
    this.contentResizeObserver.observe(element);
  }

  private setupFocusTrap(): void {
    const dialog = this.dialogRef?.nativeElement;
    if (!dialog?.open) {
      return;
    }
    this.teardownFocusTrap();
    this.previouslyFocused = document.activeElement as HTMLElement | null;
    const focusables = this.getFocusable(dialog);
    (focusables[0] ?? dialog).focus();

    this.focusTrapHandler = (event: KeyboardEvent) => {
      if (event.key === "Tab") {
        const items = this.getFocusable(dialog);
        if (items.length === 0) {
          event.preventDefault();
          return;
        }
        const first = items[0];
        const last = items[items.length - 1];
        const active = document.activeElement as HTMLElement | null;
        if (event.shiftKey) {
          if (active === first || !dialog.contains(active)) {
            event.preventDefault();
            last.focus();
          }
        } else if (active === last) {
          event.preventDefault();
          first.focus();
        }
        return;
      }
    };
    document.addEventListener("keydown", this.focusTrapHandler);
  }

  private teardownFocusTrap(): void {
    if (this.focusTrapHandler) {
      document.removeEventListener("keydown", this.focusTrapHandler);
      this.focusTrapHandler = null;
    }
    this.previouslyFocused?.focus?.();
    this.previouslyFocused = null;
  }

  private getFocusable(container: HTMLElement): HTMLElement[] {
    return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      (el) => !el.hasAttribute("disabled") && el.tabIndex !== -1,
    );
  }
}

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewEncapsulation,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  GET_STARTED_CARD_SCROLL_STEP,
  GET_STARTED_DEFAULTS,
  GET_STARTED_HONEYCOMB_SRC,
} from "@component-contracts/ids/get-started.contract";
import { cx } from "../../shared/utils/cx";
import {
  IDS_GET_STARTED_CONTEXT,
  type IdsGetStartedRuntimeContext,
} from "./ids-get-started.context";
import {
  IdsGetStartedContainerComponent,
  IdsGetStartedHeroHeaderComponent,
  IdsGetStartedOverflowEdgeComponent,
} from "./ids-get-started-slots.component";
import type {
  IdsGetStartedCardInput,
  IdsGetStartedMastheadProps,
  IdsGetStartedOverflowDirection,
  IdsGetStartedOverflowPage,
} from "./ids-get-started.types";
import {
  isConfigureEnabled,
  isSkipDisabled,
  resolveBoolean,
  resolveCardState,
  resolveOverflowPage,
  resolveShowMasthead,
  resolveSkipLabel,
  resolveSubtitle,
  resolveTitle,
  sequentialActiveIndex,
} from "./ids-get-started.utils";

/**
 * IDS Get Started — Angular port of `lib/react/ids/get-started`.
 *
 * Path: `lib/angular/ids/get-started`
 * Source: `components/ids/get-started/design-spec.md`
 * Theme: `components/ids-theme.css`
 *
 * Prop-driven `cards[]` synthesizes the deterministic anatomy tree (React default).
 */
@Component({
  selector: "ids-get-started",
  standalone: true,
  imports: [
    CommonModule,
    IdsGetStartedHeroHeaderComponent,
    IdsGetStartedContainerComponent,
    IdsGetStartedOverflowEdgeComponent,
  ],
  templateUrl: "./ids-get-started.component.html",
  styleUrl: "./ids-get-started.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    { provide: IDS_GET_STARTED_CONTEXT, useExisting: IdsGetStartedComponent },
  ],
  host: {
    "[class]": "hostClass",
    "[attr.data-ids]": "'IdsGetStarted'",
    "[attr.data-overflow]": "isOverflow ? 'true' : 'false'",
    "[attr.data-sequential]": "isSequential ? 'true' : 'false'",
  },
})
export class IdsGetStartedComponent
  implements IdsGetStartedRuntimeContext, OnChanges, OnDestroy
{
  @Input() title?: string;
  /** Legacy alias for `title`. */
  @Input() bannerTitle?: string;
  @Input() subtitle?: string;
  /** Legacy alias for `subtitle`. */
  @Input() bannerDescription?: string;
  @Input() cards: IdsGetStartedCardInput[] = [];
  @Input() overflow: boolean = GET_STARTED_DEFAULTS.overflow;
  @Input() sequential: boolean = GET_STARTED_DEFAULTS.sequential;
  @Input() overflowPage: IdsGetStartedOverflowPage =
    GET_STARTED_DEFAULTS.overflowPage;
  @Input() showMasthead?: boolean;
  /** Legacy alias for `showMasthead`. */
  @Input() isHeaderRequired?: boolean;
  @Input() headerActionsDisabled: boolean =
    GET_STARTED_DEFAULTS.headerActionsDisabled;
  @Input() productName: string = GET_STARTED_DEFAULTS.productName;
  @Input() mastheadProps?: IdsGetStartedMastheadProps;
  @Input() skipButtonText?: string;
  /** Legacy alias for `skipButtonText`. */
  @Input() launchButtonText?: string;
  @Input() skipButtonTooltip?: string;
  /** Legacy alias for `skipButtonTooltip`. */
  @Input() launchButtonTooltip?: string;
  @Input() honeycombSrc: string = GET_STARTED_HONEYCOMB_SRC;
  @Input() className?: string;

  @Output() readonly onConfigure = new EventEmitter<IdsGetStartedCardInput>();
  /** Legacy alias for `onConfigure`. */
  @Output() readonly configureModuleAction =
    new EventEmitter<IdsGetStartedCardInput>();
  @Output() readonly onSkip = new EventEmitter<void>();
  /** Legacy alias for `onSkip`. */
  @Output() readonly launchModulesAction = new EventEmitter<void>();
  @Output() readonly onOverflowNavigate =
    new EventEmitter<IdsGetStartedOverflowDirection>();

  canScrollLeft = false;
  canScrollRight = false;

  private trackEl: HTMLElement | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private readonly onScroll = () => this.updateOverflowVisibility();
  private readonly onResize = () => this.updateOverflowVisibility();

  constructor(private readonly cdr: ChangeDetectorRef) {}

  get heroTitle(): string {
    return resolveTitle(this.title, this.bannerTitle);
  }

  get heroSubtitle(): string {
    return resolveSubtitle(this.subtitle, this.bannerDescription);
  }

  get isOverflow(): boolean {
    return resolveBoolean(this.overflow, false);
  }

  get isSequential(): boolean {
    return resolveBoolean(this.sequential, false);
  }

  get isMastheadVisible(): boolean {
    return resolveShowMasthead(this.showMasthead, this.isHeaderRequired);
  }

  get skipLabel(): string {
    return resolveSkipLabel(this.skipButtonText, this.launchButtonText);
  }

  get skipTooltip(): string | undefined {
    return this.skipButtonTooltip ?? this.launchButtonTooltip;
  }

  get skipDisabled(): boolean {
    return isSkipDisabled(this.isSequential, resolveOverflowPage(this.overflowPage));
  }

  get activeSequentialIndex(): number {
    return sequentialActiveIndex(this.cards ?? []);
  }

  get synthesizedCards(): Array<{
    card: IdsGetStartedCardInput;
    index: number;
    state: ReturnType<typeof resolveCardState>;
    configureEnabled: boolean;
  }> {
    const cards = this.cards ?? [];
    const active = this.activeSequentialIndex;
    const sequential = this.isSequential;
    return cards.map((card, index) => ({
      card,
      index,
      state: resolveCardState(card),
      configureEnabled: isConfigureEnabled(card, sequential, index, active),
    }));
  }

  get hostClass(): string {
    return cx("IdsGetStarted", this.className);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["overflow"] || changes["cards"]) {
      queueMicrotask(() => this.updateOverflowVisibility());
    }
  }

  ngOnDestroy(): void {
    this.teardownTrackListeners();
  }

  registerCardTrack(el: HTMLElement | null): void {
    this.teardownTrackListeners();
    this.trackEl = el;
    if (!el || !this.isOverflow) {
      this.canScrollLeft = false;
      this.canScrollRight = false;
      this.cdr.markForCheck();
      return;
    }
    el.addEventListener("scroll", this.onScroll, { passive: true });
    if (typeof ResizeObserver !== "undefined") {
      this.resizeObserver = new ResizeObserver(() =>
        this.updateOverflowVisibility(),
      );
      this.resizeObserver.observe(el);
    }
    window.addEventListener("resize", this.onResize);
    this.updateOverflowVisibility();
  }

  scrollByDirection(direction: IdsGetStartedOverflowDirection): void {
    const track = this.trackEl;
    if (track) {
      const delta =
        direction === "next"
          ? GET_STARTED_CARD_SCROLL_STEP
          : -GET_STARTED_CARD_SCROLL_STEP;
      track.scrollBy({ left: delta, behavior: "smooth" });
    }
    this.onOverflowNavigate.emit(direction);
  }

  emitConfigure(card: IdsGetStartedCardInput): void {
    this.onConfigure.emit(card);
    this.configureModuleAction.emit(card);
  }

  emitSkip(): void {
    this.onSkip.emit();
    this.launchModulesAction.emit();
  }

  private updateOverflowVisibility(): void {
    const track = this.trackEl;
    if (!track || !this.isOverflow) {
      this.canScrollLeft = false;
      this.canScrollRight = false;
      this.cdr.markForCheck();
      return;
    }
    this.canScrollLeft = track.scrollLeft > 2;
    this.canScrollRight =
      track.scrollWidth - track.clientWidth - track.scrollLeft > 2;
    this.cdr.markForCheck();
  }

  private teardownTrackListeners(): void {
    if (this.trackEl) {
      this.trackEl.removeEventListener("scroll", this.onScroll);
    }
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    window.removeEventListener("resize", this.onResize);
  }
}

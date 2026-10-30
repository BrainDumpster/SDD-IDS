import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  Input,
  OnDestroy,
  Optional,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  GET_STARTED_HONEYCOMB_SRC,
} from "@component-contracts/ids/get-started.contract";
import { idsAssetUrl } from "../../../shared/ids-assets-base.js";
import { IdsButtonComponent } from "../button/ids-button.component";
import { IdsIconComponent } from "../icon/ids-icon.component";
import { cx } from "../../shared/utils/cx";
import {
  IDS_GET_STARTED_CARD_CONTEXT,
  IDS_GET_STARTED_CONTEXT,
  type IdsGetStartedCardRuntimeContext,
  type IdsGetStartedRuntimeContext,
} from "./ids-get-started.context";
import type {
  IdsGetStartedCardInput,
  IdsGetStartedOverflowDirection,
  IdsGetStartedOverflowSide,
} from "./ids-get-started.types";
import {
  cardDescription,
  cardIconSlug,
  configureButtonLabel,
} from "./ids-get-started.utils";

@Component({
  selector: "ids-get-started-hero-background",
  standalone: true,
  template: `
    <div
      class="IdsGetStartedHeroBackground"
      data-ids="IdsGetStartedHeroBackground"
      data-node-id="12189:231402"
      aria-hidden="true"
    ></div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class IdsGetStartedHeroBackgroundComponent {}

@Component({
  selector: "ids-get-started-hero-shadow-band",
  standalone: true,
  template: `
    <div
      class="IdsGetStartedHeroShadowBand"
      data-ids="IdsGetStartedHeroShadowBand"
      data-node-id="12189:231403"
      aria-hidden="true"
    ></div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class IdsGetStartedHeroShadowBandComponent {}

@Component({
  selector: "ids-get-started-hero-honeycomb",
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (resolvedSrc) {
      <div
        class="IdsGetStartedHeroHoneycomb"
        data-ids="IdsGetStartedHeroHoneycomb"
        data-node-id="12189:231404"
        aria-hidden="true"
      >
        <img class="IdsGetStartedHeroHoneycombImg" [src]="resolvedSrc" alt="" />
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class IdsGetStartedHeroHoneycombComponent {
  @Input() src?: string;

  constructor(
    @Optional()
    @Inject(IDS_GET_STARTED_CONTEXT)
    private readonly host?: IdsGetStartedRuntimeContext,
  ) {}

  get resolvedSrc(): string | undefined {
    const raw = this.src ?? this.host?.honeycombSrc ?? GET_STARTED_HONEYCOMB_SRC;
    if (!raw) return undefined;
    if (/^(https?:|data:|blob:)/i.test(raw)) return raw;
    return idsAssetUrl(raw);
  }
}

@Component({
  selector: "ids-get-started-masthead-slot",
  standalone: true,
  imports: [CommonModule, IdsIconComponent],
  template: `
    @if (ctx.isMastheadVisible) {
      <div
        [class]="
          cx(
            'IdsGetStartedMastheadSlot',
            ctx.headerActionsDisabled && 'IdsGetStartedMastheadSlot--actionsDisabled'
          )
        "
        data-ids="IdsGetStartedMastheadSlot"
      >
        <ng-content />
        @if (!hasProjectedContent) {
          <header class="IdsGetStartedMasthead" data-ids="IdsGetStartedMasthead">
            <div class="IdsGetStartedMastheadLeft">
              <div class="IdsGetStartedMastheadLogo">
                <ids-icon
                  [shape]="logoShape"
                  variant="img"
                  [size]="32"
                  title="Product logo"
                />
              </div>
              <span class="IdsGetStartedMastheadProductName">{{ productName }}</span>
            </div>
            <div class="IdsGetStartedMastheadActions">
              <button
                type="button"
                class="IdsGetStartedMastheadAction"
                [attr.aria-label]="alertsAriaLabel"
                [disabled]="ctx.headerActionsDisabled"
                [attr.aria-disabled]="ctx.headerActionsDisabled ? true : null"
              >
                <ids-icon
                  shape="alert-bell-16"
                  [size]="16"
                  color="var(--color-icon-gray-white)"
                />
              </button>
              <button
                type="button"
                class="IdsGetStartedMastheadAction"
                [attr.aria-label]="helpAriaLabel"
                [disabled]="ctx.headerActionsDisabled"
                [attr.aria-disabled]="ctx.headerActionsDisabled ? true : null"
              >
                <ids-icon
                  shape="help-circ-16"
                  [size]="16"
                  color="var(--color-icon-gray-white)"
                />
              </button>
              <button
                type="button"
                class="IdsGetStartedMastheadAction"
                [attr.aria-label]="avatarAriaLabel"
                [disabled]="ctx.headerActionsDisabled"
                [attr.aria-disabled]="ctx.headerActionsDisabled ? true : null"
              >
                <span class="IdsGetStartedMastheadAvatar" aria-hidden="true">{{
                  avatarInitials
                }}</span>
              </button>
            </div>
          </header>
        }
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class IdsGetStartedMastheadSlotComponent {
  readonly cx = cx;
  /** Set true when consumers project custom masthead chrome. */
  @Input() hasProjectedContent = false;

  constructor(
    @Inject(IDS_GET_STARTED_CONTEXT)
    readonly ctx: IdsGetStartedRuntimeContext,
  ) {}

  get productName(): string {
    return this.ctx.mastheadProps?.productName ?? this.ctx.productName;
  }

  get logoShape(): string {
    return this.ctx.mastheadProps?.logoShape ?? "appic-dp-cloud-blue";
  }

  get alertsAriaLabel(): string {
    return this.ctx.mastheadProps?.alertsAriaLabel ?? "Alerts";
  }

  get helpAriaLabel(): string {
    return this.ctx.mastheadProps?.helpAriaLabel ?? "Help";
  }

  get avatarInitials(): string {
    return this.ctx.mastheadProps?.avatarInitials ?? "DT";
  }

  get avatarAriaLabel(): string {
    return this.ctx.mastheadProps?.avatarAriaLabel ?? "User settings";
  }
}

@Component({
  selector: "ids-get-started-hero-title",
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1 class="IdsGetStartedHeroTitle" data-ids="IdsGetStartedHeroTitle" [attr.id]="id || null">
      <ng-content />
      @if (!hasProjectedText) {
        {{ ctx.heroTitle }}
      }
    </h1>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class IdsGetStartedHeroTitleComponent {
  @Input() id?: string;
  @Input() hasProjectedText = false;

  constructor(
    @Inject(IDS_GET_STARTED_CONTEXT)
    readonly ctx: IdsGetStartedRuntimeContext,
  ) {}
}

@Component({
  selector: "ids-get-started-hero-subtitle",
  standalone: true,
  imports: [CommonModule],
  template: `
    <p class="IdsGetStartedHeroSubtitle" data-ids="IdsGetStartedHeroSubtitle">
      <ng-content />
      @if (!hasProjectedText) {
        {{ ctx.heroSubtitle }}
      }
    </p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class IdsGetStartedHeroSubtitleComponent {
  @Input() hasProjectedText = false;

  constructor(
    @Inject(IDS_GET_STARTED_CONTEXT)
    readonly ctx: IdsGetStartedRuntimeContext,
  ) {}
}

@Component({
  selector: "ids-get-started-hero-header",
  standalone: true,
  imports: [
    CommonModule,
    IdsGetStartedHeroBackgroundComponent,
    IdsGetStartedHeroShadowBandComponent,
    IdsGetStartedHeroHoneycombComponent,
    IdsGetStartedMastheadSlotComponent,
    IdsGetStartedHeroTitleComponent,
    IdsGetStartedHeroSubtitleComponent,
  ],
  template: `
    <header
      class="IdsGetStartedHeroHeader"
      data-ids="IdsGetStartedHeroHeader"
      data-node-id="12189:231401"
    >
      <ids-get-started-hero-background />
      <ids-get-started-hero-shadow-band />
      <ids-get-started-hero-honeycomb />
      <ids-get-started-masthead-slot />
      <div class="IdsGetStartedHeroCopy">
        <ids-get-started-hero-title />
        <ids-get-started-hero-subtitle />
      </div>
    </header>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class IdsGetStartedHeroHeaderComponent {}

@Component({
  selector: "ids-get-started-card-icon-badge",
  standalone: true,
  imports: [CommonModule, IdsIconComponent],
  template: `
    <div
      [class]="
        cx(
          'IdsGetStartedCardIconBadge',
          cardCtx.state === 'completed'
            ? 'IdsGetStartedCardIconBadge--completed'
            : 'IdsGetStartedCardIconBadge--incomplete'
        )
      "
      data-ids="IdsGetStartedCardIconBadge"
      [attr.aria-hidden]="cardCtx.state === 'completed' ? null : true"
    >
      @if (cardCtx.state === 'completed') {
        <ids-icon
          shape="shape-check-thick"
          [size]="32"
          color="var(--color-icon-gray-white)"
        />
      } @else if (iconSlug) {
        <ids-icon
          [shape]="iconSlug"
          [size]="32"
          color="var(--color-icon-gray-neutral-accessible)"
        />
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class IdsGetStartedCardIconBadgeComponent {
  readonly cx = cx;
  @Input() shape?: string;

  constructor(
    @Inject(IDS_GET_STARTED_CARD_CONTEXT)
    readonly cardCtx: IdsGetStartedCardRuntimeContext,
  ) {}

  get iconSlug(): string {
    return this.shape ?? cardIconSlug(this.cardCtx.card);
  }
}

@Component({
  selector: "ids-get-started-card-title-band",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      [class]="
        cx(
          'IdsGetStartedCardTitleBand',
          cardCtx.state === 'required' && 'IdsGetStartedCardTitleBand--required'
        )
      "
      data-ids="IdsGetStartedCardTitleBand"
    >
      <h2 class="IdsGetStartedCardTitle">{{ titleLabel }}</h2>
      @if (cardCtx.state === 'required') {
        <p class="IdsGetStartedCardRequired">Required</p>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class IdsGetStartedCardTitleBandComponent {
  readonly cx = cx;

  constructor(
    @Inject(IDS_GET_STARTED_CONTEXT)
    readonly ctx: IdsGetStartedRuntimeContext,
    @Inject(IDS_GET_STARTED_CARD_CONTEXT)
    readonly cardCtx: IdsGetStartedCardRuntimeContext,
  ) {}

  get titleLabel(): string {
    if (this.ctx.isSequential) {
      return `${this.cardCtx.index + 1}. ${this.cardCtx.card.title}`;
    }
    return this.cardCtx.card.title;
  }
}

@Component({
  selector: "ids-get-started-card-description",
  standalone: true,
  imports: [CommonModule],
  template: `
    <p class="IdsGetStartedCardDescription" data-ids="IdsGetStartedCardDescription">
      {{ description }}
    </p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class IdsGetStartedCardDescriptionComponent {
  constructor(
    @Inject(IDS_GET_STARTED_CARD_CONTEXT)
    readonly cardCtx: IdsGetStartedCardRuntimeContext,
  ) {}

  get description(): string {
    return cardDescription(this.cardCtx.card);
  }
}

@Component({
  selector: "ids-get-started-card-note",
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (note) {
      <p class="IdsGetStartedCardNote" data-ids="IdsGetStartedCardNote">
        <span class="IdsGetStartedCardNoteLabel">Note:</span> {{ note }}
      </p>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class IdsGetStartedCardNoteComponent {
  constructor(
    @Inject(IDS_GET_STARTED_CARD_CONTEXT)
    readonly cardCtx: IdsGetStartedCardRuntimeContext,
  ) {}

  get note(): string | undefined {
    return this.cardCtx.card.note;
  }
}

@Component({
  selector: "ids-get-started-card-configure-button",
  standalone: true,
  imports: [CommonModule, IdsButtonComponent],
  template: `
    <ids-button
      class="IdsGetStartedCardConfigureButton"
      data-slot="IdsGetStartedCardConfigureButton"
      type="button"
      variant="primary"
      size="lg"
      [disabled]="$any(!cardCtx.configureEnabled)"
      [attr.title]="tooltip || null"
      (clicked)="onConfigure()"
    >
      {{ label }}
    </ids-button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class IdsGetStartedCardConfigureButtonComponent implements AfterViewInit {
  constructor(
    @Inject(IDS_GET_STARTED_CONTEXT)
    readonly ctx: IdsGetStartedRuntimeContext,
    @Inject(IDS_GET_STARTED_CARD_CONTEXT)
    readonly cardCtx: IdsGetStartedCardRuntimeContext,
    private readonly host: ElementRef<HTMLElement>,
  ) {}

  get label(): string {
    return configureButtonLabel(this.cardCtx.card);
  }

  get tooltip(): string | undefined {
    return (
      this.cardCtx.card.configureButtonTooltip ?? this.cardCtx.card.btnTooltip
    );
  }

  onConfigure(): void {
    this.ctx.emitConfigure(this.cardCtx.card);
  }

  ngAfterViewInit(): void {
    const button = this.host.nativeElement.querySelector("button");
    button?.setAttribute(
      "aria-label",
      `${this.label} ${this.cardCtx.card.title}`,
    );
  }
}

@Component({
  selector: "ids-get-started-card-content-panel",
  standalone: true,
  imports: [
    CommonModule,
    IdsGetStartedCardDescriptionComponent,
    IdsGetStartedCardNoteComponent,
    IdsGetStartedCardConfigureButtonComponent,
  ],
  template: `
    <div
      class="IdsGetStartedCardContentPanel"
      data-ids="IdsGetStartedCardContentPanel"
    >
      <div class="IdsGetStartedCardBodyGroup">
        <ids-get-started-card-description />
        <ids-get-started-card-note />
      </div>
      <ids-get-started-card-configure-button />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class IdsGetStartedCardContentPanelComponent {}

@Component({
  selector: "ids-get-started-card",
  standalone: true,
  imports: [
    CommonModule,
    IdsGetStartedCardTitleBandComponent,
    IdsGetStartedCardContentPanelComponent,
  ],
  template: `
    <article
      class="IdsGetStartedCard"
      data-ids="IdsGetStartedCard"
      [attr.data-card-state]="cardCtx.state"
    >
      <ids-get-started-card-title-band />
      <ids-get-started-card-content-panel />
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class IdsGetStartedCardShellComponent {
  constructor(
    @Inject(IDS_GET_STARTED_CARD_CONTEXT)
    readonly cardCtx: IdsGetStartedCardRuntimeContext,
  ) {}
}

@Component({
  selector: "ids-get-started-card-anchor",
  standalone: true,
  imports: [
    CommonModule,
    IdsGetStartedCardIconBadgeComponent,
    IdsGetStartedCardShellComponent,
  ],
  template: `
    <div class="IdsGetStartedCardAnchor" data-ids="IdsGetStartedCardAnchor">
      <ids-get-started-card-icon-badge />
      <ids-get-started-card />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: IDS_GET_STARTED_CARD_CONTEXT,
      useExisting: IdsGetStartedCardAnchorComponent,
    },
  ],
})
export class IdsGetStartedCardAnchorComponent
  implements IdsGetStartedCardRuntimeContext
{
  @Input({ required: true }) card!: IdsGetStartedCardInput;
  @Input({ required: true }) index!: number;
  @Input({ required: true }) state!: IdsGetStartedCardRuntimeContext["state"];
  @Input({ required: true }) configureEnabled!: boolean;
}

@Component({
  selector: "ids-get-started-card-track",
  standalone: true,
  imports: [CommonModule, IdsGetStartedCardAnchorComponent],
  template: `
    <div
      #track
      [class]="
        cx(
          'IdsGetStartedCardTrack',
          ctx.isOverflow
            ? 'IdsGetStartedCardTrack--overflow'
            : 'IdsGetStartedCardTrack--centered'
        )
      "
      data-ids="IdsGetStartedCardTrack"
      data-gs-card-track
    >
      <ng-content />
      @for (item of synthesizedCards; track item.card.id) {
        <ids-get-started-card-anchor
          [card]="item.card"
          [index]="item.index"
          [state]="item.state"
          [configureEnabled]="item.configureEnabled"
        />
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class IdsGetStartedCardTrackComponent
  implements AfterViewInit, OnDestroy
{
  readonly cx = cx;
  @Input() synthesizedCards: Array<{
    card: IdsGetStartedCardInput;
    index: number;
    state: IdsGetStartedCardRuntimeContext["state"];
    configureEnabled: boolean;
  }> = [];

  @ViewChild("track", { static: true })
  private trackRef?: ElementRef<HTMLDivElement>;

  constructor(
    @Inject(IDS_GET_STARTED_CONTEXT)
    readonly ctx: IdsGetStartedRuntimeContext,
  ) {}

  ngAfterViewInit(): void {
    this.ctx.registerCardTrack(this.trackRef?.nativeElement ?? null);
  }

  ngOnDestroy(): void {
    this.ctx.registerCardTrack(null);
  }
}

@Component({
  selector: "ids-get-started-skip-button",
  standalone: true,
  imports: [CommonModule, IdsButtonComponent],
  template: `
    <ids-button
      class="IdsGetStartedSkipButton"
      data-slot="IdsGetStartedSkipButton"
      type="button"
      variant="primary"
      size="lg"
      [disabled]="$any(ctx.skipDisabled)"
      [attr.title]="ctx.skipTooltip || null"
      (clicked)="ctx.emitSkip()"
    >
      {{ ctx.skipLabel }}
    </ids-button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class IdsGetStartedSkipButtonComponent {
  constructor(
    @Inject(IDS_GET_STARTED_CONTEXT)
    readonly ctx: IdsGetStartedRuntimeContext,
  ) {}
}

@Component({
  selector: "ids-get-started-container",
  standalone: true,
  imports: [
    CommonModule,
    IdsGetStartedCardTrackComponent,
    IdsGetStartedSkipButtonComponent,
  ],
  template: `
    <section
      class="IdsGetStartedContainer"
      data-ids="IdsGetStartedContainer"
      aria-label="Get started configuration cards"
    >
      <ids-get-started-card-track [synthesizedCards]="synthesizedCards" />
      <ids-get-started-skip-button />
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class IdsGetStartedContainerComponent {
  @Input() synthesizedCards: IdsGetStartedCardTrackComponent["synthesizedCards"] =
    [];
}

@Component({
  selector: "ids-get-started-overflow-gradient",
  standalone: true,
  template: `
    <div
      class="IdsGetStartedOverflowGradient"
      data-ids="IdsGetStartedOverflowGradient"
      aria-hidden="true"
    ></div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class IdsGetStartedOverflowGradientComponent {}

@Component({
  selector: "ids-get-started-overflow-nav-button",
  standalone: true,
  imports: [CommonModule, IdsIconComponent],
  template: `
    <button
      type="button"
      class="IdsGetStartedOverflowNavButton"
      data-ids="IdsGetStartedOverflowNavButton"
      [attr.aria-label]="ariaLabel"
      (click)="onClick()"
    >
      <ids-icon shape="double-chev-right" [size]="32" />
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class IdsGetStartedOverflowNavButtonComponent {
  @Input() direction: IdsGetStartedOverflowDirection = "next";

  constructor(
    @Inject(IDS_GET_STARTED_CONTEXT)
    readonly ctx: IdsGetStartedRuntimeContext,
  ) {}

  get ariaLabel(): string {
    return this.direction === "prev"
      ? "Show previous cards"
      : "Show next cards";
  }

  onClick(): void {
    this.ctx.scrollByDirection(this.direction);
  }
}

@Component({
  selector: "ids-get-started-overflow-arrow",
  standalone: true,
  imports: [CommonModule, IdsGetStartedOverflowNavButtonComponent],
  template: `
    <div class="IdsGetStartedOverflowArrow" data-ids="IdsGetStartedOverflowArrow">
      <ids-get-started-overflow-nav-button [direction]="direction" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class IdsGetStartedOverflowArrowComponent {
  @Input() direction: IdsGetStartedOverflowDirection = "next";
}

@Component({
  selector: "ids-get-started-overflow-edge",
  standalone: true,
  imports: [
    CommonModule,
    IdsGetStartedOverflowGradientComponent,
    IdsGetStartedOverflowArrowComponent,
  ],
  template: `
    <aside
      [class]="
        cx(
          'IdsGetStartedOverflowEdge',
          side === 'left'
            ? 'IdsGetStartedOverflowEdge--left'
            : 'IdsGetStartedOverflowEdge--right'
        )
      "
      data-ids="IdsGetStartedOverflowEdge"
      [attr.data-side]="side"
      [attr.data-node-id]="
        side === 'left' ? '42682:125703' : '12189:232209'
      "
      [attr.aria-label]="
        side === 'left'
          ? 'Previous configuration cards'
          : 'More configuration cards'
      "
    >
      <ids-get-started-overflow-gradient />
      <ids-get-started-overflow-arrow [direction]="navDirection" />
    </aside>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class IdsGetStartedOverflowEdgeComponent {
  readonly cx = cx;
  @Input() side: IdsGetStartedOverflowSide = "right";

  get navDirection(): IdsGetStartedOverflowDirection {
    return this.side === "left" ? "prev" : "next";
  }
}

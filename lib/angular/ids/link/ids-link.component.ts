/**
 * IDS Link — Angular implementation from design-spec.
 *
 * Path: `lib/angular/ids/link`
 * Source: `components/ids/link/design-spec.md`
 * Parity: `lib/react/ids/link` (usr/muthu/lib)
 * Theme: `components/ids-theme.css`
 *
 * Anatomy:
 *   root (`<a>` | `<button>`)
 *     label
 *     externalIcon?  — lib `IdsIcon` (`pop-up-square-corner-big`, 16px)
 */
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
  isDevMode,
} from "@angular/core";
import {
  LINK_EXTERNAL_ICON_SHAPE,
  LINK_EXTERNAL_ICON_SIZE,
  LINK_RUNTIME_DEFAULTS,
  LINK_TYPES,
  type IdsLinkDataState,
  type IdsLinkTarget,
  type IdsLinkType,
} from "@component-contracts/ids/link.contract";
import { IdsIconComponent } from "../icon/ids-icon.component";

const LINK_TYPE_SET = new Set<string>(LINK_TYPES);

@Component({
  selector: "ids-link",
  standalone: true,
  imports: [IdsIconComponent],
  templateUrl: "./ids-link.component.html",
  styleUrl: "./ids-link.component.scss",
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    style: "display: contents",
  },
})
export class IdsLinkComponent {
  readonly externalIconShape = LINK_EXTERNAL_ICON_SHAPE;
  readonly externalIconSize = LINK_EXTERNAL_ICON_SIZE;

  /** Required visible label. Empty → `"Link"` + development warning. */
  @Input() label: string = LINK_RUNTIME_DEFAULTS.label;

  /** Variant axis `Type`. Unknown → `standalone`. */
  @Input() type: IdsLinkType | string = LINK_RUNTIME_DEFAULTS.type;

  /** When set (non-empty), renders native `<a>`; otherwise button semantics. */
  @Input() href?: string;

  @Input() showExternalLinkIcon = LINK_RUNTIME_DEFAULTS.showExternalLinkIcon;

  @Input() target: IdsLinkTarget = LINK_RUNTIME_DEFAULTS.target;

  /** When `target="_blank"`, defaults to `noopener noreferrer` unless set. */
  @Input() rel?: string;

  @Input() disabled = LINK_RUNTIME_DEFAULTS.disabled;

  /** Demo/testing visual override only — does not replace interaction logic. */
  @Input() dataState?: IdsLinkDataState;

  /** Angular mapping of design-spec / React `onClick`. */
  @Output() readonly clicked = new EventEmitter<MouseEvent>();

  get resolvedType(): IdsLinkType {
    if (typeof this.type === "string" && LINK_TYPE_SET.has(this.type)) {
      return this.type as IdsLinkType;
    }
    return "standalone";
  }

  get resolvedLabel(): string {
    if (this.label == null || String(this.label).trim() === "") {
      if (isDevMode()) {
        console.warn('IdsLink: empty `label` — rendering fallback text "Link".');
      }
      return "Link";
    }
    return String(this.label);
  }

  get isAnchor(): boolean {
    return this.href != null && this.href !== "";
  }

  get resolvedHref(): string | undefined {
    if (!this.isAnchor || this.disabled) {
      return undefined;
    }
    return this.href;
  }

  get resolvedTarget(): string | undefined {
    return this.target === "_self" ? undefined : this.target;
  }

  get resolvedRel(): string | undefined {
    if (this.rel != null) {
      return this.rel;
    }
    if (this.target === "_blank") {
      return "noopener noreferrer";
    }
    return undefined;
  }

  get stateAttr(): string | undefined {
    return this.dataState && this.dataState !== "default"
      ? this.dataState
      : undefined;
  }

  get rootClass(): string {
    return `ids-link ids-link--${this.resolvedType}`;
  }

  onActivate(event: MouseEvent): void {
    if (this.disabled) {
      event.preventDefault();
      return;
    }
    this.clicked.emit(event);
  }
}

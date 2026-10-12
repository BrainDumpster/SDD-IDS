/**
 * IdsIcon — reusable Lit icon for `lib/lit/ids/*` (React IdsIcon parity).
 *
 * Path: `lib/lit/ids/src/icon`
 * Assets: `assets/icons/<shape>.svg` via `idsIconUrl`
 *
 * Props:
 * - shape / shapeName — icon slug (e.g. `chev-down-thick`)
 * - color — CSS color (prefer `var(--color-icon-…)`)
 * - size — px number or CSS length (default `16`)
 * - variant — `mask` (default) | `img` | `inline` (inline falls back to mask when
 *   no curated SVG is loaded yet; matches Angular IdsIcon)
 * - title / aria-label — accessibility
 * - class-name — extra host class
 */
import { LitElement, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { idsIconUrl } from "../assets/ids-assets.js";
import { idsIconStyles } from "./ids-icon.styles.js";

const SHAPE_PATTERN = /^[a-z0-9-]+$/;

export type IdsIconVariant = "mask" | "img" | "inline";

/** Always return a valid CSS length (unitless attribute values get `px`). */
export function resolveIconSize(size: number | string | undefined): string {
  if (size == null || size === "") return "16px";
  if (typeof size === "number" && Number.isFinite(size)) return `${size}px`;
  const raw = String(size).trim();
  if (!raw) return "16px";
  if (/^-?\d+(\.\d+)?$/.test(raw)) return `${raw}px`;
  return raw;
}

export class IdsIcon extends LitElement {
  static override styles = [idsIconStyles];

  /** Icon slug matching `assets/icons/<shape>.svg`. */
  @property({ type: String, reflect: true })
  shape = "";

  /** Alias used by edf-core / Angular templates. */
  @property({ type: String, attribute: "shape-name" })
  set shapeName(value: string) {
    this.shape = value ?? "";
  }
  get shapeName(): string {
    return this.shape;
  }

  @property({ type: String })
  color?: string;

  /**
   * Box size. Accepts number (px), numeric string (`"16"`), or CSS length (`"1rem"`).
   * Default 16px.
   */
  @property({ type: String })
  size: number | string = 16;

  @property({ type: String, reflect: true })
  variant: IdsIconVariant = "mask";

  @property({ type: String, attribute: "class-name" })
  className = "";

  @property({ type: String })
  title = "";

  @property({ type: String, attribute: "aria-label" })
  ariaLabel = "";

  @state()
  private missing = false;

  @state()
  private inlineSvg = "";

  private lastInlineShape = "";

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-icon");
    // Apply size before first paint so host is never 0×0.
    this.applyBoxSize();
  }

  override updated(changed: Map<string, unknown>): void {
    if (changed.has("shape") || changed.has("variant")) {
      this.missing = false;
      if (changed.has("shape")) {
        this.inlineSvg = "";
        this.lastInlineShape = "";
      }
    }

    this.applyBoxSize();

    if (this.color) {
      this.style.setProperty("--ids-icon-color", this.color);
      this.style.color = this.color;
    } else {
      this.style.removeProperty("--ids-icon-color");
    }

    if (this.className) {
      for (const token of this.className.split(/\s+/).filter(Boolean)) {
        this.classList.add(token);
      }
    }

    const decorative = !this.ariaLabel && !this.title;
    const url = this.resolveUrl();
    this.setAttribute("data-shape", this.shape || "");
    this.setAttribute("data-variant", this.effectiveVariant);
    // Only mark missing when shape is set but URL/file failed — empty shape is unset, not missing.
    this.toggleAttribute("data-missing", Boolean(this.shape) && (this.missing || !url));
    this.setAttribute("role", decorative ? "presentation" : "img");
    if (decorative) {
      this.setAttribute("aria-hidden", "true");
      this.removeAttribute("aria-label");
    } else {
      this.removeAttribute("aria-hidden");
      this.setAttribute("aria-label", this.ariaLabel || this.title);
    }
    if (this.title) {
      this.setAttribute("title", this.title);
    } else if (this.missing && this.shape) {
      this.setAttribute("title", `Missing icon: ${this.shape}`);
    } else {
      this.removeAttribute("title");
    }

    this.applyMaskStyles();

    if (this.variant === "inline" && this.shape && this.shape !== this.lastInlineShape) {
      void this.loadInlineSvg(this.shape);
    }
  }

  private applyBoxSize(): void {
    const box = resolveIconSize(this.size);
    this.style.setProperty("--ids-icon-size", box);
    this.style.width = box;
    this.style.height = box;
    this.style.minWidth = box;
    this.style.minHeight = box;
  }

  /** Inline without a loaded SVG → mask (Angular parity). */
  private get effectiveVariant(): IdsIconVariant {
    if (this.variant === "inline" && !this.inlineSvg) return "mask";
    return this.variant;
  }

  private resolveUrl(): string | undefined {
    if (!SHAPE_PATTERN.test(this.shape)) return undefined;
    try {
      return idsIconUrl(this.shape);
    } catch {
      return undefined;
    }
  }

  private applyMaskStyles(): void {
    const useMask =
      this.effectiveVariant === "mask" && Boolean(this.resolveUrl()) && !this.missing;

    if (!useMask) {
      this.style.removeProperty("mask-image");
      this.style.removeProperty("-webkit-mask-image");
      return;
    }

    const mask = `url("${this.resolveUrl()}")`;
    this.style.setProperty("mask-image", mask);
    this.style.setProperty("-webkit-mask-image", mask);
  }

  private async loadInlineSvg(shape: string): Promise<void> {
    const url = this.resolveUrl();
    if (!url) {
      this.missing = true;
      return;
    }
    try {
      const res = await fetch(url);
      if (!res.ok) {
        this.missing = true;
        return;
      }
      let svg = await res.text();
      svg = svg.replace(/<\?xml[^>]*>\s*/i, "").trim();
      svg = svg.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");
      this.inlineSvg = svg;
      this.lastInlineShape = shape;
      this.missing = false;
    } catch {
      this.missing = true;
    }
  }

  private onAssetError = (): void => {
    this.missing = true;
    this.applyMaskStyles();
  };

  override render() {
    const url = this.resolveUrl();

    if (this.variant === "inline" && this.inlineSvg) {
      return html`${unsafeHTML(this.inlineSvg)}`;
    }

    if (!url || this.missing) {
      return nothing;
    }

    if (this.effectiveVariant === "img") {
      return html`<img src=${url} alt="" @error=${this.onAssetError} />`;
    }

    // Mask: glyph is the host background; probe asset for 404 → data-missing
    return html`<img
      src=${url}
      alt=""
      hidden
      aria-hidden="true"
      @error=${this.onAssetError}
      @load=${() => {
        this.missing = false;
      }}
    />`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ids-icon": IdsIcon;
  }
}

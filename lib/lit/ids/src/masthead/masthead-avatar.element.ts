/**
 * IdsMastheadAvatar — masthead account control.
 *
 * Tag: `ids-masthead-avatar`
 * Spec: `components/ids/masthead/design-spec.md` → MastheadAvatar
 * Figma: `.Masthead-Element-UserInitials` `10130:29944`
 *   Initials `10130:29943` · Icon `10130:29945`
 *
 * Priority: imageSrc → icon slot / iconSlug → initials.
 */
import { LitElement, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import "../icon/register.js";
import { avatarStyles } from "./masthead.styles.js";

export class IdsMastheadAvatar extends LitElement {
  static override styles = [avatarStyles];

  @property({ type: String })
  initials = "";

  /** Icon asset slug (e.g. `user-single`). Used when icon slot empty. */
  @property({ type: String, attribute: "iconslug" })
  iconSlug = "";

  @property({ type: String, attribute: "imagesrc" })
  imageSrc = "";

  @property({ type: String, attribute: "imagealt" })
  imageAlt = "User avatar";

  /** Required accessible name (React `aria-label`). */
  @property({ type: String, attribute: "arialabel", reflect: true })
  ariaLabel = "";

  /**
   * Open account menu (React `aria-expanded`).
   * Named `expanded` — HTMLElement already owns `ariaExpanded` as string|null.
   */
  @property({ type: Boolean, attribute: "ariaexpanded", reflect: true })
  expanded = false;

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @state()
  private hasIconSlot = false;

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "IdsMastheadAvatar");
  }

  private onIconSlotChange = (event: Event): void => {
    const slot = event.target as HTMLSlotElement;
    this.hasIconSlot = slot.assignedNodes({ flatten: true }).length > 0;
  };

  private get computedAriaLabel(): string {
    const explicit = this.ariaLabel || this.getAttribute("aria-label") || "";
    if (this.imageSrc || this.hasIconSlot || this.iconSlug) {
      return explicit || this.imageAlt;
    }
    if (this.initials) {
      return explicit || `User initials ${this.initials}`;
    }
    return explicit || this.imageAlt;
  }

  private renderChipContent() {
    if (this.imageSrc) {
      return html`
        <img
          class="IdsMastheadAvatarImage"
          src=${this.imageSrc}
          alt=${this.imageAlt}
        />
      `;
    }

    if (this.hasIconSlot) {
      return html`
        <span class="IdsMastheadAvatarIcon" aria-hidden="true">
          <slot name="icon" @slotchange=${this.onIconSlotChange}></slot>
        </span>
      `;
    }

    if (this.iconSlug) {
      return html`
        <span class="IdsMastheadAvatarIcon" aria-hidden="true">
          <slot name="icon" @slotchange=${this.onIconSlotChange}></slot>
          <ids-icon
            shape=${this.iconSlug}
            variant="mask"
            size="16"
            color="var(--color-icon-gray-white)"
          ></ids-icon>
        </span>
      `;
    }

    // Keep icon slot listening so consumers can project later.
    return html`
      <slot name="icon" @slotchange=${this.onIconSlotChange}></slot>
      ${this.initials || nothing}
    `;
  }

  override render() {
    const chipClasses = {
      IdsMastheadAvatarChip: true,
      "IdsMastheadAvatarChip--photo": Boolean(this.imageSrc),
    };

    return html`
      <button
        type="button"
        class="IdsMastheadAvatar"
        data-ids="IdsMastheadAvatar"
        aria-label=${this.computedAriaLabel}
        aria-expanded=${this.expanded ? "true" : nothing}
        ?disabled=${this.disabled}
      >
        <span class=${classMap(chipClasses)}>${this.renderChipContent()}</span>
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ids-masthead-avatar": IdsMastheadAvatar;
  }
}

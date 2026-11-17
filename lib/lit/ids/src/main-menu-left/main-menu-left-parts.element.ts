/**
 * IDS Main Menu/Left — composable Mode B children (Tree-style).
 *
 * Tags:
 *   `ids-main-menu-left-item` — primary row; nested items become secondary children
 *
 * Spec: `components/ids/main-menu-left/design-spec.md`
 * API parity: React `IdsMainMenuLeft` items + children
 */
import { LitElement, html, css } from "lit";
import { property } from "lit/decorators.js";
import type {
  MainMenuLeftLink,
  MainMenuLeftPrimaryItem,
  MainMenuLeftPrimaryState,
  MainMenuLeftSecondaryItem,
} from "./main-menu-left.constants.js";

const hostHidden = css`
  :host {
    display: none !important;
  }
`;

/** Primary (or nested secondary) nav row. */
export class IdsMainMenuLeftItem extends LitElement {
  static override styles = [hostHidden];

  @property({ type: String, reflect: true })
  override id = "";

  @property({ type: String })
  name = "";

  /** Alias for `name` (Tree-style label attr). */
  @property({ type: String })
  label = "";

  @property({ type: String, attribute: "icon-name" })
  iconName?: string;

  @property({ type: String })
  tooltip?: string;

  @property({ attribute: false })
  link?: MainMenuLeftLink;

  /** @deprecated Prefer `link`. */
  @property({ type: String })
  href?: string;

  /** @deprecated Prefer `link`. */
  @property({ type: String, attribute: "route-ref" })
  routeRef?: string;

  /** Force open/closed secondary list when parent `forceStates` is on. */
  @property({ type: String, attribute: "children-menu" })
  childrenMenu?: "expanded" | "collapsed";

  @property({ type: String })
  state?: MainMenuLeftPrimaryState;

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "IdsMainMenuLeftItem");
  }

  override render() {
    return html`<slot></slot>`;
  }
}

function toSecondary(el: IdsMainMenuLeftItem): MainMenuLeftSecondaryItem {
  return {
    id: el.id || undefined,
    name: el.name || el.label || undefined,
    label: el.label || undefined,
    tooltip: el.tooltip,
    link: el.link,
    href: el.href,
    routeRef: el.routeRef,
  };
}

function toPrimary(el: IdsMainMenuLeftItem): MainMenuLeftPrimaryItem {
  const nested = Array.from(el.children).filter(
    (child): child is IdsMainMenuLeftItem => child instanceof IdsMainMenuLeftItem,
  );
  return {
    id: el.id || undefined,
    name: el.name || el.label || undefined,
    label: el.label || undefined,
    tooltip: el.tooltip,
    iconName: el.iconName,
    link: el.link,
    href: el.href,
    routeRef: el.routeRef,
    childrenMenu: el.childrenMenu,
    state: el.state,
    children: nested.length ? nested.map(toSecondary) : undefined,
  };
}

/** Convert slotted Mode B children into data-driven `items`. */
export function collectSlottedMainMenuLeftItems(
  host: HTMLElement,
): MainMenuLeftPrimaryItem[] {
  return Array.from(host.children)
    .filter((el): el is IdsMainMenuLeftItem => el instanceof IdsMainMenuLeftItem)
    .map(toPrimary);
}

declare global {
  interface HTMLElementTagNameMap {
    "ids-main-menu-left-item": IdsMainMenuLeftItem;
  }
}

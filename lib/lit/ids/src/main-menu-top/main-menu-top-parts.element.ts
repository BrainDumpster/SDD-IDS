/**
 * IDS Main Menu/Top — composable Mode B children (Tree-style).
 *
 * Tags:
 *   `ids-main-menu-top-item`
 *   `ids-main-menu-top-menu`
 *   `ids-main-menu-top-menu-item`
 *   `ids-main-menu-top-menu-group`
 *   `ids-main-menu-top-submenu`
 *
 * Declarative config nodes projected into `<ids-main-menu-top>` light DOM.
 * The root scrapes them into `NavItemConfig` when `items` is empty.
 *
 * Spec: `components/ids/main-menu-top/design-spec.md`
 * React: `MainMenuTop.Item` / `.Menu` / `.MenuItem` / `.MenuGroup` / `.Submenu`
 */
import { LitElement, html, css } from "lit";
import { property } from "lit/decorators.js";
import type {
  MainMenuTopItem,
  MainMenuTopLink,
  MainMenuTopMenuNode,
  MainMenuTopMenuOption,
} from "./main-menu-top.constants.js";

const hostHidden = css`
  :host {
    display: none !important;
  }
`;

const optionalBooleanConverter = {
  fromAttribute: (value: string | null): boolean | undefined => {
    if (value === null) return undefined;
    if (value === "false") return false;
    return true;
  },
  toAttribute: (value: boolean | undefined): string | null => {
    if (value === undefined) return null;
    return value ? "" : "false";
  },
};

/** Top-bar nav item — React `MainMenuTop.Item`. */
export class IdsMainMenuTopItem extends LitElement {
  static override styles = [hostHidden];

  @property({ type: String, reflect: true })
  override id = "";

  @property({ type: String })
  name = "";

  @property({ type: String, attribute: "icon-name" })
  iconName?: string;

  @property({ attribute: "show-icon", converter: optionalBooleanConverter })
  showIcon?: boolean;

  @property({ type: String })
  tooltip?: string;

  @property({ type: Boolean, reflect: true })
  dropdown = false;

  @property({ attribute: false })
  link?: MainMenuTopLink;

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "IdsMainMenuTopItem");
  }

  override render() {
    return html`<slot></slot>`;
  }
}

/** Dropdown wrapper under an item — React `MainMenuTop.Menu`. */
export class IdsMainMenuTopMenu extends LitElement {
  static override styles = [hostHidden];

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "IdsMainMenuTopMenu");
  }

  override render() {
    return html`<slot></slot>`;
  }
}

/** Leaf menu option — React `MainMenuTop.MenuItem`. */
export class IdsMainMenuTopMenuItem extends LitElement {
  static override styles = [hostHidden];

  @property({ type: String, reflect: true })
  override id = "";

  @property({ type: String })
  label = "";

  @property({ type: Boolean, reflect: true })
  disabled = false;

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "IdsMainMenuTopMenuItem");
  }

  override render() {
    return html`<slot></slot>`;
  }
}

/** Option group with label — React `MainMenuTop.MenuGroup`. */
export class IdsMainMenuTopMenuGroup extends LitElement {
  static override styles = [hostHidden];

  @property({ type: String, reflect: true })
  override id = "";

  @property({ type: String })
  label = "";

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "IdsMainMenuTopMenuGroup");
  }

  override render() {
    return html`<slot></slot>`;
  }
}

/** Nested submenu flyout — React `MainMenuTop.Submenu`. */
export class IdsMainMenuTopSubmenu extends LitElement {
  static override styles = [hostHidden];

  @property({ type: String, reflect: true })
  override id = "";

  @property({ type: String })
  label = "";

  @property({ type: Boolean, reflect: true })
  disabled = false;

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "IdsMainMenuTopSubmenu");
  }

  override render() {
    return html`<slot></slot>`;
  }
}

function parseMenuChildren(parent: HTMLElement): MainMenuTopMenuNode[] {
  const nodes: MainMenuTopMenuNode[] = [];
  for (const child of Array.from(parent.children)) {
    if (child instanceof IdsMainMenuTopMenuItem) {
      nodes.push({
        kind: "item",
        id: child.id,
        label: child.label || child.id,
        disabled: child.disabled || undefined,
      });
      continue;
    }
    if (child instanceof IdsMainMenuTopMenuGroup) {
      nodes.push({
        kind: "group",
        id: child.id || undefined,
        label: child.label,
        children: parseMenuChildren(child),
      });
      continue;
    }
    if (child instanceof IdsMainMenuTopSubmenu) {
      nodes.push({
        kind: "submenu",
        id: child.id,
        label: child.label || child.id,
        disabled: child.disabled || undefined,
        children: parseMenuChildren(child),
      });
      continue;
    }
    if (child instanceof IdsMainMenuTopMenu) {
      nodes.push(...parseMenuChildren(child));
    }
  }
  return nodes;
}

/** Build data-model nodes from a top-level `ids-main-menu-top-item`. */
export function extractMenuNodesFromItem(
  item: IdsMainMenuTopItem,
): MainMenuTopMenuNode[] | undefined {
  const menu = Array.from(item.children).find(
    (el): el is IdsMainMenuTopMenu => el instanceof IdsMainMenuTopMenu,
  );
  if (!menu) return undefined;
  const nodes = parseMenuChildren(menu);
  return nodes.length ? nodes : undefined;
}

function menuNodesToOptions(
  nodes: MainMenuTopMenuNode[],
): MainMenuTopMenuOption[] {
  return nodes.map((node) => {
    if (node.kind === "group") {
      return {
        id: node.id ?? node.label,
        label: node.label,
        kind: "group" as const,
        children: menuNodesToOptions(node.children),
      };
    }
    if (node.kind === "submenu") {
      return {
        id: node.id,
        label: node.label,
        disabled: node.disabled,
        kind: "submenu" as const,
        children: menuNodesToOptions(node.children),
      };
    }
    return {
      id: node.id,
      label: node.label,
      disabled: node.disabled,
      kind: "item" as const,
    };
  });
}

/** Convert slotted Mode B children into data-driven `items` (Tree Mode B parity). */
export function collectSlottedMainMenuTopItems(
  host: HTMLElement,
): MainMenuTopItem[] {
  const items: MainMenuTopItem[] = [];
  for (const child of Array.from(host.children)) {
    if (!(child instanceof IdsMainMenuTopItem)) continue;
    const menuNodes = extractMenuNodesFromItem(child);
    items.push({
      id: child.id,
      name: child.name || child.id,
      iconName: child.iconName,
      showIcon: child.showIcon,
      tooltip: child.tooltip,
      dropdown: child.dropdown || Boolean(menuNodes?.length) || undefined,
      link: child.link,
      menuOptions: menuNodes ? menuNodesToOptions(menuNodes) : undefined,
    });
  }
  return items;
}

declare global {
  interface HTMLElementTagNameMap {
    "ids-main-menu-top-item": IdsMainMenuTopItem;
    "ids-main-menu-top-menu": IdsMainMenuTopMenu;
    "ids-main-menu-top-menu-item": IdsMainMenuTopMenuItem;
    "ids-main-menu-top-menu-group": IdsMainMenuTopMenuGroup;
    "ids-main-menu-top-submenu": IdsMainMenuTopSubmenu;
  }
}

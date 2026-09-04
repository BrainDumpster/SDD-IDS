"""Deterministic Main Menu/Left composition codegen.

Mirrors `component-contracts/ids/main-menu-left.contract.ts`:
  MAIN_MENU_LEFT_COMPOSITION_ANATOMY
  MAIN_MENU_LEFT_GROUP_ANATOMY
  MAIN_MENU_LEFT_ITEM_ANATOMY
  MAIN_MENU_LEFT_SPEC_ACCURATE_ITEMS
  MAIN_MENU_LEFT_PRIMARY_STATE_MATRIX

Emits framework markup in deterministic anatomy order (composition pattern).
"""

from __future__ import annotations

from typing import Any, Mapping, Sequence

DESIGN_SPEC_PATH = "components/ids/main-menu-left/design-spec.md"
CONTRACT_PATH = "component-contracts/ids/main-menu-left.contract.ts"

# Keep in sync with contract anatomy constants (validated in tests).
MAIN_MENU_LEFT_COMPOSITION_ANATOMY: tuple[str, ...] = (
    "MainMenuLeftRoot",
    "MainMenuLeftLogo?",
    "MainMenuList",
    "MainMenuLeftItem | MainMenuLeftGroup",
    "MainMenuLeftExpandCollapse",
)

MAIN_MENU_LEFT_GROUP_ANATOMY: tuple[str, ...] = (
    "MainMenuLeftGroup",
    "MainMenuLeftItem",
    "MainMenuLeftChildren",
    "MainMenuLeftItem",
)

MAIN_MENU_LEFT_ITEM_ANATOMY: tuple[str, ...] = (
    "MainMenuLeftItem",
    "linkHost",
    "MainMenuLeftItemIcon?",
    "label",
)

# Mirror of MAIN_MENU_LEFT_SPEC_ACCURATE_ITEMS in the contract.
SPEC_ACCURATE_ITEMS: tuple[dict[str, Any], ...] = (
    {"id": "dashboard", "name": "Dashboard", "iconName": "home", "routeRef": "/dashboard"},
    {
        "id": "infrastructure",
        "name": "Infrastructure",
        "iconName": "network-share",
        "routeRef": "/infrastructure",
        "childrenMenu": "collapsed",
        "children": (
            {"id": "secondary-a", "name": "Secondary Item", "routeRef": "/infrastructure/a"},
            {"id": "secondary-b", "name": "Secondary Item", "routeRef": "/infrastructure/b"},
        ),
    },
    {
        "id": "protection",
        "name": "Protection",
        "iconName": "shield-encrypt-alt",
        "routeRef": "/protection",
    },
    {"id": "recovery", "name": "Recovery", "iconName": "arrows-spin", "routeRef": "/recovery"},
    {
        "id": "alerts",
        "name": "Alerts and Events",
        "iconName": "alert-bell",
        "routeRef": "/alerts",
    },
    {"id": "reports", "name": "Reports", "iconName": "productivity-alt", "routeRef": "/reports"},
    {
        "id": "administration",
        "name": "Administration",
        "iconName": "user-settings",
        "routeRef": "/administration",
    },
    {"id": "jobs", "name": "Jobs", "iconName": "time-detail", "routeRef": "/jobs"},
)

PRIMARY_STATE_MATRIX: tuple[dict[str, Any], ...] = (
    {"id": "default", "name": "Default", "iconName": "home", "state": "default"},
    {"id": "hover", "name": "Hover", "iconName": "home", "state": "hover"},
    {"id": "press", "name": "Press", "iconName": "home", "state": "press"},
    {"id": "selected", "name": "Selected", "iconName": "home", "state": "selected"},
    {"id": "default-focus", "name": "Default focus", "iconName": "home", "state": "default-focus"},
    {
        "id": "selected-focus",
        "name": "Selected focus",
        "iconName": "home",
        "state": "selected-focus",
    },
)

SECONDARY_STATE_MATRIX: tuple[dict[str, Any], ...] = (
    {"id": "sec-default", "name": "Default", "state": "default"},
    {"id": "sec-hover", "name": "Hover", "state": "hover"},
    {"id": "sec-press", "name": "Press", "state": "press"},
    {"id": "sec-selected", "name": "Selected", "state": "selected"},
    {"id": "sec-default-focus", "name": "Default focus", "state": "default-focus"},
    {"id": "sec-selected-focus", "name": "Selected focus", "state": "selected-focus"},
)


def _indent_block(text: str, spaces: int) -> str:
    pad = " " * spaces
    return "\n".join(f"{pad}{line}" if line.strip() else line for line in text.splitlines())


def resolve_item_href(item: Mapping[str, Any]) -> str:
    return str(item.get("href") or item.get("routeRef") or f"/{item['id']}")


def resolve_item_label(item: Mapping[str, Any]) -> str:
    return str(item.get("name") or item.get("label") or item.get("id", ""))


def _group_default_expanded(item: Mapping[str, Any]) -> bool:
    return item.get("childrenMenu") == "expanded"


def emit_react_link_host(
    item: Mapping[str, Any],
    *,
    level: str = "primary",
    href: str | None = None,
) -> str:
    """ITEM_ANATOMY: linkHost → MainMenuLeftItemIcon? → label."""
    target_href = href or resolve_item_href(item)
    label = resolve_item_label(item)
    if level == "secondary":
        return f'<a href="{target_href}">{label}</a>'
    icon = item.get("iconName", "home")
    return f"""<a href="{target_href}">
          <MainMenuLeftItemIcon shapeName="{icon}" />
          <span className={{styles.primaryLabel}}>{label}</span>
        </a>"""


def emit_angular_link_host(
    item: Mapping[str, Any],
    *,
    level: str = "primary",
    href: str | None = None,
) -> str:
    target_href = href or resolve_item_href(item)
    label = resolve_item_label(item)
    if level == "secondary":
        return f'<a href="{target_href}">{label}</a>'
    icon = item.get("iconName", "home")
    return f"""<a href="{target_href}">
      <ids-main-menu-left-item-icon shapeName="{icon}" />
      <span class="ids-main-menu-left__primary-label">{label}</span>
    </a>"""


def emit_react_primary_item(item: Mapping[str, Any], *, indent: int = 6) -> str:
    item_id = item["id"]
    label = resolve_item_label(item)
    body = f"""<MainMenuLeftItem itemId="{item_id}" tooltip="{label}">
        {emit_react_link_host(item)}
      </MainMenuLeftItem>"""
    return _indent_block(body, indent)


def emit_react_secondary_item(
    item: Mapping[str, Any],
    *,
    indent: int = 10,
) -> str:
    item_id = item["id"]
    body = f"""<MainMenuLeftItem itemId="{item_id}" level="secondary">
            {emit_react_link_host(item, level="secondary")}
          </MainMenuLeftItem>"""
    return _indent_block(body, indent)


def emit_react_group(item: Mapping[str, Any], *, indent: int = 6) -> str:
    """GROUP_ANATOMY: Group → Item(primary) → Children → Item(secondary)*."""
    item_id = item["id"]
    label = resolve_item_label(item)
    children = item.get("children") or ()
    default_expanded = _group_default_expanded(item)
    secondary_lines = "\n".join(emit_react_secondary_item(child) for child in children)
    body = f"""<MainMenuLeftGroup groupId="{item_id}" defaultExpanded={{{str(default_expanded).lower()}}}>
        <MainMenuLeftItem itemId="{item_id}" tooltip="{label}">
          {emit_react_link_host(item)}
        </MainMenuLeftItem>
        <MainMenuLeftChildren>
{secondary_lines}
        </MainMenuLeftChildren>
      </MainMenuLeftGroup>"""
    return _indent_block(body, indent)


def emit_react_menu_list(items: Sequence[Mapping[str, Any]] = SPEC_ACCURATE_ITEMS) -> str:
    """COMPOSITION_ANATOMY list slot: Item | Group in contract order."""
    blocks: list[str] = []
    for item in items:
        if item.get("children"):
            blocks.append(emit_react_group(item))
        else:
            blocks.append(emit_react_primary_item(item))
    return "\n\n".join(blocks)


def emit_angular_primary_item(item: Mapping[str, Any], *, indent: int = 2) -> str:
    item_id = item["id"]
    label = resolve_item_label(item)
    body = f"""<ids-main-menu-left-item itemId="{item_id}" tooltip="{label}">
    {emit_angular_link_host(item)}
  </ids-main-menu-left-item>"""
    return _indent_block(body, indent)


def emit_angular_secondary_item(item: Mapping[str, Any], *, indent: int = 6) -> str:
    item_id = item["id"]
    body = f"""<ids-main-menu-left-item itemId="{item_id}" level="secondary">
      {emit_angular_link_host(item, level="secondary")}
    </ids-main-menu-left-item>"""
    return _indent_block(body, indent)


def emit_angular_group(item: Mapping[str, Any], *, indent: int = 2) -> str:
    item_id = item["id"]
    label = resolve_item_label(item)
    children = item.get("children") or ()
    default_expanded = _group_default_expanded(item)
    secondary_lines = "\n".join(emit_angular_secondary_item(child) for child in children)
    body = f"""<ids-main-menu-left-group groupId="{item_id}" [defaultExpanded]="{str(default_expanded).lower()}">
    <ids-main-menu-left-item itemId="{item_id}" tooltip="{label}">
      {emit_angular_link_host(item)}
    </ids-main-menu-left-item>
    <ids-main-menu-left-children>
{secondary_lines}
    </ids-main-menu-left-children>
  </ids-main-menu-left-group>"""
    return _indent_block(body, indent)


def emit_angular_menu_list(
    items: Sequence[Mapping[str, Any]] = SPEC_ACCURATE_ITEMS,
    *,
    indent: int = 2,
) -> str:
    blocks: list[str] = []
    for item in items:
        if item.get("children"):
            blocks.append(emit_angular_group(item, indent=indent))
        else:
            blocks.append(emit_angular_primary_item(item, indent=indent))
    return "\n\n".join(blocks)


def emit_angular_composition_root(
    items: Sequence[Mapping[str, Any]] = SPEC_ACCURATE_ITEMS,
) -> str:
    """Root + MainMenuList children (logo omitted in spec-accurate demo)."""
    menu = emit_angular_menu_list(items, indent=2)
    return f"""<ids-main-menu-left
  [compositionMode]="true"
  [expanded]="expanded"
  [defaultSelectedItemId]="defaultSelectedItemId"
  [forceStates]="forceStates"
  [ariaLabel]="ariaLabel"
>
{menu}
</ids-main-menu-left>"""


def emit_react_primary_state_matrix(
    matrix: Sequence[Mapping[str, Any]] = PRIMARY_STATE_MATRIX,
) -> str:
    rows: list[str] = []
    for item in matrix:
        item_id = item["id"]
        state = item["state"]
        label = resolve_item_label(item)
        icon = item.get("iconName", "home")
        rows.append(
            f"""        <MainMenuLeftItem itemId="{item_id}" forceState="{state}">
          <a href="#">
            <MainMenuLeftItemIcon shapeName="{icon}" />
            <span className={{styles.primaryLabel}}>{label}</span>
          </a>
        </MainMenuLeftItem>"""
        )
    return "\n".join(rows)


def emit_react_secondary_state_matrix(
    matrix: Sequence[Mapping[str, Any]] = SECONDARY_STATE_MATRIX,
) -> str:
    rows: list[str] = []
    for item in matrix:
        item_id = item["id"]
        state = item["state"]
        label = resolve_item_label(item)
        rows.append(
            f"""          <MainMenuLeftItem itemId="{item_id}" level="secondary" forceState="{state}">
            <a href="#">{label}</a>
          </MainMenuLeftItem>"""
        )
    children = "\n".join(rows)
    return f"""        <MainMenuLeftGroup groupId="secondary-focus-matrix" defaultExpanded={{true}}>
          <MainMenuLeftItem itemId="secondary-parent">
            <a href="#">
              <MainMenuLeftItemIcon shapeName="network-share" />
              <span className={{styles.primaryLabel}}>Infrastructure</span>
            </a>
          </MainMenuLeftItem>
          <MainMenuLeftChildren>
{children}
          </MainMenuLeftChildren>
        </MainMenuLeftGroup>"""


def emit_angular_primary_state_matrix(
    matrix: Sequence[Mapping[str, Any]] = PRIMARY_STATE_MATRIX,
) -> str:
    rows: list[str] = []
    for item in matrix:
        item_id = item["id"]
        state = item["state"]
        label = resolve_item_label(item)
        icon = item.get("iconName", "home")
        rows.append(
            f"""          <ids-main-menu-left-item itemId="{item_id}" forceState="{state}">
            <a href="#"><ids-main-menu-left-item-icon shapeName="{icon}" /><span class="ids-main-menu-left__primary-label">{label}</span></a>
          </ids-main-menu-left-item>"""
        )
    return "\n".join(rows)


def emit_angular_secondary_state_matrix(
    matrix: Sequence[Mapping[str, Any]] = SECONDARY_STATE_MATRIX,
) -> str:
    rows: list[str] = []
    for item in matrix:
        item_id = item["id"]
        state = item["state"]
        label = resolve_item_label(item)
        rows.append(
            f"""            <ids-main-menu-left-item itemId="{item_id}" level="secondary" forceState="{state}">
              <a href="#">{label}</a>
            </ids-main-menu-left-item>"""
        )
    children = "\n".join(rows)
    return f"""          <ids-main-menu-left-group groupId="secondary-focus-matrix" [defaultExpanded]="true">
            <ids-main-menu-left-item itemId="secondary-parent">
              <a href="#"><ids-main-menu-left-item-icon shapeName="network-share" /><span class="ids-main-menu-left__primary-label">Infrastructure</span></a>
            </ids-main-menu-left-item>
            <ids-main-menu-left-children>
{children}
            </ids-main-menu-left-children>
          </ids-main-menu-left-group>"""

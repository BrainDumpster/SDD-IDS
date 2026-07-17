from __future__ import annotations

import re
from dataclasses import dataclass


def _parse_duration_default(spec_text: str) -> int:
    for pat in (
        r"-\s*`duration`:\s*number,\s*default\s+`(\d+)`",
        r"`duration`:\s*number,\s*default\s+`(\d+)`",
        r"default\s+`(\d+)`\s*\([^)]*timeout",
    ):
        m = re.search(pat, spec_text, re.I)
        if m:
            return int(m.group(1))
    return 8000


def _parse_demo_strings(spec_text: str) -> tuple[str, str]:
    """Parse `- Demo message:` / `- Demo link label:` (scan full layered spec; last wins)."""
    message = "This is a temporary and brief notification following a user action."
    link = "View Details"
    for raw in spec_text.splitlines():
        line = raw.strip()
        if line.startswith("- Demo message:"):
            m = re.search(r"`([^`]+)`", line)
            if m:
                message = m.group(1).strip()
        if line.startswith("- Demo link label:"):
            m = re.search(r"`([^`]+)`", line)
            if m:
                link = m.group(1).strip()
    return message, link


def _parse_root_surface_vars(line: str) -> tuple[str, str, str]:
    vars_found = re.findall(r"var\((--[a-zA-Z0-9\-]+)\)", line)
    br_m = re.search(r"border-radius:\s*`?(\d+)px`?", line, re.I)
    if len(vars_found) >= 3:
        bg, bc, br = vars_found[0], vars_found[1], vars_found[2]
        if "radius" not in br and "corner" not in br:
            for v in vars_found:
                if "radius" in v or "corner" in v:
                    br = v
                    break
        return bg, bc, br
    if len(vars_found) >= 2:
        if br_m:
            rpx = int(br_m.group(1))
            br_map = {
                2: "--corner-radius-radius-2",
                4: "--corner-radius-radius-4",
                6: "--corner-radius-radius-6",
                8: "--corner-radius-radius-8",
            }
            br = br_map.get(rpx, "--corner-radius-radius-8")
            return vars_found[0], vars_found[1], br
        return vars_found[0], vars_found[1], "--corner-radius-radius-8"
    raise ValueError(f"Toast spec: expected ≥2 var() on Root surface line, got {line!r}")


def _first_var_in_line(line: str) -> str | None:
    m = re.search(r"var\((--[a-zA-Z0-9\-]+)\)", line)
    return m.group(1) if m else None


def _parse_layout(spec_text: str) -> dict[str, str]:
    """Scan the full layered spec so program root lines win over baseline IDS Toast (last match)."""
    out: dict[str, str] = {}
    for raw in spec_text.splitlines():
        line = raw.strip()
        if "Root surface" in line and "var(--" in line:
            bg, bc, br = _parse_root_surface_vars(line)
            out["root_background"] = bg
            out["root_border_color"] = bc
            out["root_radius"] = br
        if "Row composition" in line and "gap" in line:
            v = _first_var_in_line(line)
            if v:
                out["root_row_gap"] = v
        if "Content row" in line and "icon/message" in line:
            v = _first_var_in_line(line)
            if v:
                out["content_gap"] = v
        if "Action row" in line and "link/close" in line:
            v = _first_var_in_line(line)
            if v:
                out["action_gap"] = v
        if "Status icon column" in line and "padding-block" in line:
            v = _first_var_in_line(line)
            if v:
                out["icon_padding_block"] = v
        if "Item container" in line and "padding-inline" in line:
            m = re.search(r"padding-inline:\s*`?(\d+)px`?", line)
            if m and int(m.group(1)) == 24:
                out["padding_inline"] = "--padding-padding-24"
            m2 = re.search(r"padding-block:\s*`?(\d+)px`?", line)
            if m2 and int(m2.group(1)) == 14:
                out["padding_block"] = "--padding-padding-14"
        if "617px" in line and "with link" in line:
            out["viewport_max_px"] = "617"

    # Defaults aligned with IDS theme when spec uses bare px in a bullet
    out.setdefault("root_row_gap", "--spacing-space-32")
    out.setdefault("content_gap", "--spacing-space-8")
    out.setdefault("action_gap", "--spacing-space-24")
    out.setdefault("icon_padding_block", "--padding-padding-2")
    out.setdefault("padding_inline", "--padding-padding-24")
    out.setdefault("padding_block", "--padding-padding-14")
    out.setdefault("viewport_max_px", "617")
    return out


def _parse_core_tokens(spec_text: str) -> dict[str, str]:
    """Core + shape bullets; full spec scan (last wins over layered baseline)."""
    out: dict[str, str] = {}
    for raw in spec_text.splitlines():
        line = raw.strip()
        if line.startswith("- Surface:"):
            m = re.search(r"var\((--[^)]+)\)", line)
            if m:
                out["surface"] = m.group(1)
        if line.startswith("- Border:") and "alerting" not in line.lower():
            m = re.search(r"var\((--[^)]+)\)", line)
            if m:
                out["border"] = m.group(1)
        if line.startswith("- Message text:"):
            m = re.search(r"var\((--[^)]+)\)", line)
            if m:
                out["message_text"] = m.group(1)
        if line.startswith("- Link text:"):
            m = re.search(r"var\((--[^)]+)\)", line)
            if m:
                out["link_text"] = m.group(1)
        if line.startswith("- Close icon:") or line.startswith("- Close button icon:"):
            m = re.search(r"var\((--[^)]+)\)", line)
            if m:
                out["close_icon"] = m.group(1)
        if "**Border radius:**" in line or line.startswith("- **Border radius:**"):
            m = re.search(r"var\((--[^)]+)\)", line)
            if m:
                out["shape_radius"] = m.group(1)
    return out


def _parse_variant_icon_map(spec_text: str) -> dict[str, str]:
    """Parse status table(s); last complete table wins (program layer over baseline IDS)."""
    out: dict[str, str] = {}
    in_table = False
    for raw in spec_text.splitlines():
        line = raw.strip()
        if "| Type |" in line and "Icon" in line:
            out = {}
            in_table = True
            continue
        if in_table:
            if not line.startswith("|"):
                in_table = False
                continue
            if line.startswith("| ---"):
                continue
            cells = [c.strip() for c in line.strip("|").split("|")]
            if len(cells) < 3:
                continue
            typ = cells[0].strip("`").strip()
            icon_var_cell = cells[2]
            m = re.search(r"var\((--[^)]+)\)", icon_var_cell)
            if typ and m:
                css_class = typ.replace(" ", "-")
                out[css_class] = m.group(1)
    return out


@dataclass(frozen=True)
class ToastSpecModel:
    root_background: str
    root_border_color: str
    root_radius: str
    root_row_gap: str
    content_gap: str
    action_gap: str
    icon_padding_block: str
    padding_inline: str
    padding_block: str
    border_width: str
    message_color: str
    link_color: str
    close_color: str
    typography_primary: str
    font_size_body_2: str
    line_height_20: str
    focus_ring_width: str
    focus_ring_color: str
    link_radius: str
    close_radius: str
    viewport_max_px: str
    variant_icon: dict[str, str]
    default_message: str
    default_link_label: str
    default_duration: int


def parse_toast_spec(spec_text: str) -> ToastSpecModel:
    layout = _parse_layout(spec_text)
    core = _parse_core_tokens(spec_text)
    variants = _parse_variant_icon_map(spec_text)
    msg, link = _parse_demo_strings(spec_text)
    duration = _parse_duration_default(spec_text)

    root_bg = layout.get("root_background") or core.get("surface") or "--color-static-gray-900"
    root_bc = layout.get("root_border_color") or core.get("border") or "--color-border-white"
    root_radius = layout.get("root_radius") or core.get("shape_radius") or "--corner-radius-radius-8"
    msg_color = core.get("message_text") or "--color-static-gray-white"

    if not variants:
        variants = {
            "info": "--color-icon-alerting-info",
            "critical": "--color-icon-alerting-critical",
            "major-warning": "--color-icon-alerting-major",
            "minor-warning": "--color-icon-alerting-minor",
            "success": "--color-icon-alerting-success",
        }

    return ToastSpecModel(
        root_background=root_bg,
        root_border_color=root_bc,
        root_radius=root_radius,
        root_row_gap=layout["root_row_gap"],
        content_gap=layout["content_gap"],
        action_gap=layout["action_gap"],
        icon_padding_block=layout["icon_padding_block"],
        padding_inline=layout["padding_inline"],
        padding_block=layout["padding_block"],
        border_width="--border-width-border-default",
        message_color=msg_color,
        link_color=core.get("link_text") or "--color-text-white",
        close_color=core.get("close_icon") or "--color-icon-white",
        typography_primary="--typography-font-style-primary",
        font_size_body_2="--font-size-body-2",
        line_height_20="--font-line-height-line-height-20",
        focus_ring_width="--border-width-border-thick",
        focus_ring_color="--color-border-brand-base",
        link_radius="--corner-radius-radius-2",
        close_radius="--corner-radius-radius-2",
        viewport_max_px=layout["viewport_max_px"],
        variant_icon=variants,
        default_message=msg,
        default_link_label=link,
        default_duration=duration,
    )


def _v(name: str) -> str:
    return f"var({name})"


def render_toast_module_css(model: ToastSpecModel) -> str:
    """Emit Toast.module.css — single source is `parse_toast_spec` + this template."""
    lines = [
        "/* Generated from design-spec.md (strict_spec_storybook_gate --deterministic-story). Do not edit by hand. */",
        "",
        ".viewport {",
        "  position: fixed;",
        "  top: var(--padding-padding-16);",
        "  right: var(--padding-padding-16);",
        "  z-index: 1100;",
        "  display: flex;",
        "  flex-direction: column;",
        "  gap: var(--spacing-space-8);",
        f"  width: min({model.viewport_max_px}px, calc(100vw - 32px));",
        "  max-width: calc(100vw - 32px);",
        "  outline: none;",
        "}",
        "",
        ".viewport[data-position=\"top-left\"] {",
        "  top: var(--padding-padding-16);",
        "  left: var(--padding-padding-16);",
        "  right: auto;",
        "}",
        "",
        ".viewport[data-position=\"top-center\"] {",
        "  top: var(--padding-padding-16);",
        "  left: 50%;",
        "  right: auto;",
        "  transform: translateX(-50%);",
        "}",
        "",
        ".viewport[data-position=\"top-right\"] {",
        "  top: var(--padding-padding-16);",
        "  right: var(--padding-padding-16);",
        "  left: auto;",
        "}",
        "",
        ".viewport[data-position=\"bottom-left\"] {",
        "  bottom: var(--padding-padding-16);",
        "  left: var(--padding-padding-16);",
        "  top: auto;",
        "  right: auto;",
        "}",
        "",
        ".viewport[data-position=\"bottom-center\"] {",
        "  bottom: var(--padding-padding-16);",
        "  left: 50%;",
        "  right: auto;",
        "  top: auto;",
        "  transform: translateX(-50%);",
        "}",
        "",
        ".viewport[data-position=\"bottom-right\"] {",
        "  bottom: var(--padding-padding-16);",
        "  right: var(--padding-padding-16);",
        "  top: auto;",
        "  left: auto;",
        "}",
        "",
        ".root {",
        "  display: flex;",
        "  align-items: center;",
        f"  gap: {_v(model.root_row_gap)};",
        "  box-sizing: border-box;",
        "  width: 100%;",
        "  min-height: 48px;",
        f"  padding: {_v(model.padding_block)} {_v(model.padding_inline)};",
        f"  border-radius: {_v(model.root_radius)};",
        f"  border-width: {_v(model.border_width)};",
        "  border-style: solid;",
        f"  border-color: {_v(model.root_border_color)};",
        f"  background: {_v(model.root_background)};",
        "  font-family: inherit;",
        "}",
        "",
    ]
    for cls, icon_var in sorted(model.variant_icon.items()):
        lines.extend(
            [
                f".{cls} {{",
                f"  color: {_v(model.message_color)};",
                "}",
                f".{cls} .iconWrap {{",
                f"  color: {_v(icon_var)};",
                "}",
                "",
            ]
        )
    lines.extend(
        [
            ".contentGroup {",
            "  display: flex;",
            "  align-items: center;",
            f"  gap: {_v(model.content_gap)};",
            "  flex: 1 1 auto;",
            "  min-width: 0;",
            "}",
            "",
            ".iconWrap {",
            "  flex-shrink: 0;",
            "  display: flex;",
            "  align-items: center;",
            "  justify-content: center;",
            f"  padding-block: {_v(model.icon_padding_block)};",
            "}",
            "",
            ".variantIcon {",
            "  width: var(--scale-16);",
            "  height: var(--scale-16);",
            "  display: inline-block;",
            "  object-fit: contain;",
            "}",
            "",
            ".content {",
            "  flex: 1 1 auto;",
            "  min-width: 0;",
            "}",
            "",
            ".actionsGroup {",
            "  display: inline-flex;",
            "  align-items: center;",
            "  justify-content: center;",
            f"  gap: {_v(model.action_gap)};",
            "  flex-shrink: 0;",
            "}",
            "",
            ".description {",
            f"  font-family: {_v(model.typography_primary)}, sans-serif;",
            f"  font-size: {_v(model.font_size_body_2)};",
            "  font-weight: 400;",
            f"  color: {_v(model.message_color)};",
            "  margin: 0;",
            f"  line-height: {_v(model.line_height_20)};",
            "}",
            "",
            ".link {",
            "  flex-shrink: 0;",
            "  display: inline-flex;",
            "  align-items: center;",
            "  gap: var(--spacing-space-2);",
            "  border: none;",
            "  background: transparent;",
            f"  color: {_v(model.link_color)};",
            "  padding: 0;",
            "  cursor: pointer;",
            f"  font-family: {_v(model.typography_primary)}, sans-serif;",
            f"  font-size: {_v(model.font_size_body_2)};",
            "  font-weight: 400;",
            f"  line-height: {_v(model.line_height_20)};",
            "  text-decoration: underline;",
            "  text-decoration-skip-ink: none;",
            f"  border-radius: {_v(model.link_radius)};",
            "}",
            ".link:focus-visible {",
            f"  outline: {_v(model.focus_ring_width)} solid {_v(model.focus_ring_color)};",
            "  outline-offset: 2px;",
            "}",
            "",
            ".closeButton.closeButton.closeButton {",
            "  width: calc(var(--scale-24) + (2 * var(--border-width-border-1)));",
            "  height: calc(var(--scale-24) + (2 * var(--border-width-border-1)));",
            "  min-height: calc(var(--scale-24) + (2 * var(--border-width-border-1)));",
            "  padding: var(--padding-padding-6);",
            "  box-sizing: border-box;",
            f"  color: {_v(model.close_color)};",
            "}",
            "",
            ".closeButton.closeButton > span {",
            "  width: 100%;",
            "  height: 100%;",
            "}",
            "",
            ".closePlaceholder {",
            "  width: calc(var(--scale-24) + (2 * var(--border-width-border-1)));",
            "  height: calc(var(--scale-24) + (2 * var(--border-width-border-1)));",
            "  flex-shrink: 0;",
            "}",
            "",
        ]
    )
    return "\n".join(lines)

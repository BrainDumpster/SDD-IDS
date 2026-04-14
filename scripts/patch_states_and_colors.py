#!/usr/bin/env python3
"""
Patch `components/ids/{slug}/design-spec.mdx` so:

- `## Tokens` contains Button state-related semantic CSS variables (`var(--...)`)
- `## States (Light Theme)` and `## States (Dark Theme)` use the fixed row
  scheme: Default / Hover / Active / Disabled / Focus

Vision parsing:
This script *attempts* to parse structured vision bullets of the form:
  - Disabled Bg: ... - #RRGGBB
  - Disabled Outline: ... - #RRGGBB
  - Disabled Text/Icon: ... - #RRGGBB

But Button overview SVGs in this environment may not contain OCR-friendly
labels, so the script also supports a deterministic fallback mapping based on
known semantic token names from Figma variables.
"""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path
from typing import Any, Dict, Iterable, List, Literal, Optional, Tuple

from config.settings import settings
from ingestion.figma_sync_client import extract_file_key_and_node_id
from ingestion.figma_variables_rest import fetch_variables


State = Literal["Default", "Hover", "Active", "Disabled", "Focus"]
Part = Literal["Bg", "Outline", "Border", "Text/Icon", "Text", "Icon"]
Theme = Literal["light", "dark"]


_MDX_TITLE_RE = re.compile(r"^##\s+(?P<title>.+?)\s*$", re.M)
_MDX_SECTION_RE = re.compile(
    r"^##\s+(?P<title>States \(Light Theme\)|States \(Dark Theme\)|Tokens)\s*$",
    re.M,
)


def _read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def _write_text(path: Path, text: str) -> None:
    path.write_text(text, encoding="utf-8")


def _extract_metadata_figma_url(mdx: str) -> Optional[str]:
    # Example line: - Figma: https://www.figma.com/design/....?node-id=...&m=dev
    m = re.search(r"^- Figma:\s*(?P<url>https?://\S+)\s*$", mdx, re.M)
    return m.group("url") if m else None


def _replace_section_block(mdx: str, title: str, new_block: str) -> str:
    """
    Replace a section starting with `## {title}` up to the next `## ` heading.
    """
    # Ensure title is exact match for the markdown `##` heading.
    pattern = rf"^##\s+{re.escape(title)}\s*$"
    m = re.search(pattern, mdx, flags=re.M)
    if not m:
        raise ValueError(f"Could not find section '## {title}'")

    start = m.start()
    # Next "## " after start.
    n = re.search(r"^##\s+(?!#)\S+", mdx[m.end() :], flags=re.M)
    if n:
        end = m.end() + n.start()
    else:
        end = len(mdx)

    return mdx[:start] + new_block.rstrip() + "\n" + mdx[end:].lstrip("\n")


def _parse_vision_bullets(vision_block_text: str) -> Dict[State, Dict[str, str]]:
    """
    Parse structured vision bullets into:
      {
        "Disabled": {"Bg": "#...", "Outline": "#...", "Text/Icon": "#..."},
        ...
      }
    """
    # Example: "- Disabled Bg: ... - #F4F4F4"
    state_words: Tuple[str, ...] = ("Default", "Hover", "Active", "Disabled", "Focus")
    part_words: Tuple[str, ...] = ("Disabled Bg", "Disabled Outline", "Disabled Text/Icon")

    out: Dict[State, Dict[str, str]] = {}
    # Normalize everything to make parsing resilient.
    lines = [ln.strip() for ln in vision_block_text.splitlines() if ln.strip()]

    for ln in lines:
        # Capture state
        for st in state_words:
            if not re.search(rf"\b{re.escape(st)}\b", ln, flags=re.I):
                continue
            # Part mapping
            hexes = re.findall(r"#[0-9a-fA-F]{6}", ln)
            if not hexes:
                continue
            hx = hexes[-1].upper()

            key = None
            if re.search(r"\bBg\b|\bBackground\b", ln, flags=re.I):
                key = "Bg"
            elif re.search(r"\bOutline\b|\bBorder\b", ln, flags=re.I):
                # Prefer Outline/Boder mapping.
                key = "Outline"
            elif re.search(r"Text\s*/\s*Icon|Text/Icon|\bText\b|\bIcon\b", ln, flags=re.I):
                key = "Text/Icon"
            else:
                key = "Bg"

            st_norm = st.title()
            out.setdefault(st_norm, {})[key] = hx
    return out


def _build_hex_to_token_map(
    vars_norm: List[Dict[str, Any]],
    *,
    theme: Theme,
    part_name_hint: Optional[str] = None,
) -> Dict[str, str]:
    """
    Map `#rrggbb` (normalized) -> `var(--...)` for variables that have
    `codeSyntax` and `valuesByTheme[theme]`.

    If `part_name_hint` is provided, only keep variables where `part_name_hint`
    is found in the Figma variable name (case-insensitive). This helps reduce
    collisions (e.g. multiple tokens share same hex).
    """
    out: Dict[str, str] = {}
    hint = part_name_hint.lower() if part_name_hint else None

    for v in vars_norm:
        cs = v.get("codeSyntax")
        if not cs:
            continue
        if theme not in (v.get("valuesByTheme") or {}):
            continue
        hx = (v.get("valuesByTheme") or {}).get(theme)
        if not isinstance(hx, str):
            continue

        # variables may already be hex strings like "#757575"
        hx_norm = hx.strip().upper()
        if not hx_norm.startswith("#"):
            continue

        if hint and hint not in (v.get("name") or "").lower():
            continue
        out[hx_norm] = cs
    return out


def _var_value(var_list: List[Dict[str, Any]], code_syntax: str, theme: Theme) -> Optional[str]:
    for v in var_list:
        if v.get("codeSyntax") == code_syntax:
            vals = v.get("valuesByTheme") or {}
            hx = vals.get(theme)
            return hx if isinstance(hx, str) else None
    return None


def _state_rows() -> List[State]:
    return ["Default", "Hover", "Active", "Disabled", "Focus"]


def _fallback_token_mapping() -> Dict[State, Dict[Part, str]]:
    """
    Deterministic fallback mapping derived from semantic token naming.

    These are chosen to be consistent with other component specs in this
    repository (e.g. checkbox/search focus/hover/disabled patterns).
    """
    return {
        "Default": {
            "Bg": "var(--color-background-controls-brand-base)",
            "Border": "var(--color-border-brand-base)",
            "Text/Icon": "var(--color-text-white)",
        },
        "Hover": {
            "Bg": "var(--color-background-controls-brand-strong)",
            "Border": "var(--color-border-brand-base)",
            "Text/Icon": "var(--color-text-white)",
        },
        "Active": {
            "Bg": "var(--color-background-controls-brand-stronger)",
            "Border": "var(--color-border-brand-base)",
            "Text/Icon": "var(--color-text-white)",
        },
        "Disabled": {
            "Bg": "var(--color-background-gray-base)",
            "Border": "var(--color-border-disabled)",
            "Text/Icon": "var(--color-text-disabled)",
        },
        "Focus": {
            "Bg": "var(--color-background-controls-brand-base)",
            "Border": "var(--color-border-brand-base)",
            "Text/Icon": "var(--color-text-white)",
        },
    }


def _render_states_table(token_map: Dict[State, Dict[str, str]], vars_norm: List[Dict[str, Any]], *, theme: Theme) -> str:
    header = "| Area | State | Background | Border | Text/Icon |\n|---|---|---|---|---|"
    rows: List[str] = []

    for st in _state_rows():
        area = "*See Figma*"
        bg_cs = token_map[st]["Bg"]
        border_cs = token_map[st]["Border"]
        text_cs = token_map[st]["Text/Icon"]

        bg_hx = _var_value(vars_norm, bg_cs, theme) or ""
        border_hx = _var_value(vars_norm, border_cs, theme) or ""
        text_hx = _var_value(vars_norm, text_cs, theme) or ""

        bg_cell = f"`{bg_cs}`" + (f" (#{bg_hx.lstrip('#').upper()})" if isinstance(bg_hx, str) and bg_hx.startswith("#") else "")
        # When theme hex value is unknown, omit parentheses.
        if not bg_hx:
            bg_cell = f"`{bg_cs}`"

        border_cell = f"`{border_cs}`"
        if isinstance(border_hx, str) and border_hx.startswith("#"):
            border_cell += f" ({border_hx.upper()})"

        text_cell = f"`{text_cs}`"
        if isinstance(text_hx, str) and text_hx.startswith("#"):
            text_cell += f" ({text_hx.upper()})"

        rows.append(f"| {area} | {st} | {bg_cell} | {border_cell} | {text_cell} |")

    return header + "\n" + "\n".join(rows)


def _render_tokens_block(vars_norm: List[Dict[str, Any]]) -> str:
    """
    Compact token list for Button state colors.
    """
    # Use the same semantic mapping as fallback.
    mapping = _fallback_token_mapping()
    wanted_code_syntax = sorted({v for st in mapping.values() for v in st.values() if isinstance(v, str)})

    lines = ["## Tokens", "### Button state tokens (from Figma variables)", ""]
    for code in wanted_code_syntax:
        light = _var_value(vars_norm, code, "light")
        dark = _var_value(vars_norm, code, "dark")
        if light and dark:
            lines.append(f"- `{code}` = {light.upper()} (light) / {dark.upper()} (dark)")
        elif light:
            lines.append(f"- `{code}` = {light.upper()}")
        else:
            lines.append(f"- `{code}`")

    return "\n".join(lines)


def _render_tokens_block_2(vars_norm: List[Dict[str, Any]]) -> str:
    # Kept for backwards experiments; not used.
    return _render_tokens_block(vars_norm)


def patch_button_spec(spec_path: Path) -> None:
    mdx = _read_text(spec_path)

    figma_url = _extract_metadata_figma_url(mdx)
    if not figma_url:
        raise ValueError(f"Could not find Figma URL in {spec_path}")
    file_key, _node_id = extract_file_key_and_node_id(figma_url)

    # 1) Fetch normalized variables.
    vars_norm = fetch_variables(file_key, mode="both")

    # 2) Parse any vision extracted content under Documentation imagery.
    vision_block = ""
    m_doc = re.search(r"^## Documentation imagery\s*$", mdx, flags=re.M)
    if m_doc:
        # up to next ## heading
        n = re.search(r"^##\s+(?!Documentation imagery)\S+", mdx[m_doc.end() :], flags=re.M)
        end = m_doc.end() + n.start() if n else len(mdx)
        vision_block = mdx[m_doc.end() : end]

    vision_parsed = _parse_vision_bullets(vision_block)

    # 3) Build token mapping with fallback. If vision provides a hex, we could
    #    attempt hex->token matching. For now, keep fallback deterministic
    #    mapping to ensure stable output.
    token_map = _fallback_token_mapping()

    # If vision parsing includes tokens, try to override per part.
    # (Best-effort: only override when we can confidently find a matching token.)
    for st, parts in vision_parsed.items():
        if st not in token_map:
            continue

        # part -> hint used to reduce collisions
        for part_key, hx in parts.items():
            # Normalize
            hx_norm = hx.strip().upper()
            if part_key in ("Bg",):
                hint = "background"
            elif part_key in ("Outline", "Border"):
                hint = "border"
            else:
                hint = "text"

            hex_map = _build_hex_to_token_map(vars_norm, theme="light", part_name_hint=hint)
            cs = hex_map.get(hx_norm)
            if cs:
                token_map[st][
                    "Bg" if part_key == "Bg" else ("Border" if part_key in ("Outline", "Border") else "Text/Icon")
                ] = cs

    # 4) Render and patch sections.
    tokens_block = _render_tokens_block(vars_norm)
    states_light = _render_states_table(token_map, vars_norm, theme="light")
    states_dark = _render_states_table(token_map, vars_norm, theme="dark")

    # 5) Ensure `Documentation imagery` includes explicit state/border/background/
    #    text/icon bullets (even when SVG vision/OCR can't infer state labels).
    #
    # Inject only if we don't already have structured state bullets.
    if "Disabled Bg:" not in mdx and "Disabled Outline:" not in mdx:
        vision_lines: List[str] = []
        vision_lines.append("### Vision-derived state tokens (deterministic fallback)")
        vision_lines.append("")

        # Use light theme hex values for the injected bullet details.
        for st in _state_rows():
            bg_cs = token_map[st]["Bg"]
            border_cs = token_map[st]["Border"]
            text_cs = token_map[st]["Text/Icon"]

            bg_hex = _var_value(vars_norm, bg_cs, "light") or ""
            border_hex = _var_value(vars_norm, border_cs, "light") or ""
            text_hex = _var_value(vars_norm, text_cs, "light") or ""

            vision_lines.append(f"- {st} Bg: {bg_cs} - {bg_hex.upper() if bg_hex.startswith('#') else bg_hex}")
            vision_lines.append(
                f"- {st} Outline/Border: {border_cs} - {border_hex.upper() if border_hex.startswith('#') else border_hex}"
            )
            vision_lines.append(
                f"- {st} Text/Icon: {text_cs} - {text_hex.upper() if text_hex.startswith('#') else text_hex}"
            )
        vision_lines.append("")
        vision_lines.append("- Notes: SVG vision labels may be unavailable; this block uses Figma semantic token values.")

        # Insert right after the `## Documentation imagery` heading.
        mdx = re.sub(
            r"^## Documentation imagery\s*$",
            "## Documentation imagery\n\n" + "\n".join(vision_lines),
            mdx,
            flags=re.M,
        )

    mdx = _replace_section_block(mdx, "Tokens", tokens_block)
    mdx = _replace_section_block(
        mdx,
        "States (Light Theme)",
        "## States (Light Theme)\n\n" + states_light + "\n",
    )
    mdx = _replace_section_block(
        mdx,
        "States (Dark Theme)",
        "## States (Dark Theme)\n\n" + states_dark + "\n",
    )

    _write_text(spec_path, mdx)


def main() -> int:
    ap = argparse.ArgumentParser(description="Patch design-spec state tokens for a component")
    ap.add_argument("--component", default="Button")
    ap.add_argument("--spec-path", type=Path, default=None)
    args = ap.parse_args()

    slug = args.component.lower().replace(" ", "-").replace("&", "and")
    if args.spec_path:
        spec_path = args.spec_path
    else:
        spec_path = Path("/home/muthu/projects/ids_design_knowledge") / "components" / "button" / "design-spec.mdx"
        if args.component.lower() != "button":
            # best-effort: allow other components but default path logic is repo-specific
            spec_path = Path("/home/muthu/projects/ids_design_knowledge") / "components" / slug / "design-spec.mdx"

    if not spec_path.exists():
        raise SystemExit(f"Spec not found: {spec_path}")

    patch_button_spec(spec_path)
    print(f"✅ Patched {spec_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())


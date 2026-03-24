#!/usr/bin/env python3
"""Generate a spec-driven Lit button + visual demo from Button design-spec."""

from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path("/home/muthu/projects/ids_design_knowledge")
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from ingestion.figma_sync_client import extract_file_key_and_node_id
from ingestion.figma_variables_rest import fetch_variables

SPEC_PATH = ROOT / "components" / "button" / "design-spec.mdx"
OUT_DIR = ROOT / "generated-components"
OUT_COMPONENT = OUT_DIR / "button.js"
OUT_DEMO = OUT_DIR / "button-demo.html"
OUT_GLOBAL_VARS = OUT_DIR / "button-global-vars.css"


STATE_ORDER = ["Default", "Hover", "Active", "Disabled", "Focus"]


def _read(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def _extract_section(text: str, title: str) -> str:
    m = re.search(rf"^## {re.escape(title)}\s*$", text, flags=re.M)
    if not m:
        raise ValueError(f"Section not found: {title}")
    n = re.search(r"^##\s+", text[m.end() :], flags=re.M)
    end = m.end() + n.start() if n else len(text)
    return text[m.end() : end].strip()


def _extract_figma_url(text: str) -> str:
    m = re.search(r"^- Figma:\s*(https?://\S+)\s*$", text, flags=re.M)
    if not m:
        raise ValueError("Could not find Figma URL in Metadata section")
    return m.group(1).strip()


def _parse_tokens(tokens_section: str) -> dict[str, dict[str, str]]:
    """
    Parse bullets:
    - `var(--token)` = #XXXXXX (light) / #YYYYYY (dark)
    """
    out: dict[str, dict[str, str]] = {}
    rx = re.compile(
        r"^\-\s+`(?P<token>var\(--[^`]+\))`\s*=\s*(?P<light>#[0-9A-Fa-f]{6})\s*\(light\)\s*/\s*(?P<dark>#[0-9A-Fa-f]{6})\s*\(dark\)\s*$"
    )
    for line in tokens_section.splitlines():
        m = rx.match(line.strip())
        if not m:
            continue
        out[m.group("token")] = {
            "light": m.group("light").upper(),
            "dark": m.group("dark").upper(),
        }
    if not out:
        raise ValueError("Could not parse any tokens from ## Tokens")
    return out


def _parse_states(states_section: str) -> dict[str, dict[str, str]]:
    """
    Parse state table rows and return:
      {State: {"background": var(--..), "border": var(--..), "text": var(--..)}}
    """
    out: dict[str, dict[str, str]] = {}
    for line in states_section.splitlines():
        line = line.strip()
        if not line.startswith("| *See Figma* |"):
            continue
        cells = [c.strip() for c in line.strip("|").split("|")]
        if len(cells) < 5:
            continue
        state = cells[1]
        if state not in STATE_ORDER:
            continue
        vars_found = re.findall(r"`(var\(--[^`]+\))`", line)
        if len(vars_found) < 3:
            continue
        out[state] = {
            "background": vars_found[0],
            "border": vars_found[1],
            "text": vars_found[2],
        }
    missing = [s for s in STATE_ORDER if s not in out]
    if missing:
        raise ValueError(f"Missing states in table parse: {missing}")
    return out


def _parse_layout_signatures(layout_section: str) -> dict[str, dict[str, int]]:
    """
    Parse lines like:
    | Small | 24px | 2 / 16 / 2 / 16 | 8px | 2px |
    """
    out: dict[str, dict[str, int]] = {}
    for line in layout_section.splitlines():
        line = line.strip()
        if not line.startswith("|") or "px" not in line:
            continue
        cells = [c.strip() for c in line.strip("|").split("|")]
        if len(cells) < 5:
            continue
        label = cells[0].lower()
        if "small" in label:
            key = "small"
        elif "medium" in label and "compact" in label:
            key = "medium-compact"
        elif "medium" in label:
            key = "medium"
        elif "large" in label and "loose" in label:
            key = "large-loose"
        elif "large" in label:
            key = "large"
        else:
            continue

        h = int(re.search(r"(\d+)\s*px", cells[1], re.I).group(1))
        pad = [int(x.strip()) for x in cells[2].split("/") if x.strip().isdigit()]
        if len(pad) != 4:
            continue
        gap = int(re.search(r"(\d+)\s*px", cells[3], re.I).group(1))
        radius = int(re.search(r"(\d+)\s*px", cells[4], re.I).group(1))
        out[key] = {
            "height": h,
            "pt": pad[0],
            "pr": pad[1],
            "pb": pad[2],
            "pl": pad[3],
            "gap": gap,
            "radius": radius,
        }
    return out


def _generate_component(
    light_states: dict[str, dict[str, str]],
    layout: dict[str, dict[str, int]],
    tokens: dict[str, dict[str, str]],
) -> str:
    default_bg = light_states["Default"]["background"]
    default_border = light_states["Default"]["border"]
    default_text = light_states["Default"]["text"]
    hover_bg = light_states["Hover"]["background"]
    hover_border = light_states["Hover"]["border"]
    hover_text = light_states["Hover"]["text"]
    active_bg = light_states["Active"]["background"]
    active_border = light_states["Active"]["border"]
    active_text = light_states["Active"]["text"]
    focus_bg = light_states["Focus"]["background"]
    focus_border = light_states["Focus"]["border"]
    focus_text = light_states["Focus"]["text"]
    disabled_bg = light_states["Disabled"]["background"]
    disabled_border = light_states["Disabled"]["border"]
    disabled_text = light_states["Disabled"]["text"]

    # Defaults from parsed layout table; fall back to legacy values.
    large = layout.get("large", {"height": 40, "pt": 10, "pr": 16, "pb": 10, "pl": 16, "gap": 8, "radius": 2})
    medium = layout.get("medium", {"height": 32, "pt": 8, "pr": 16, "pb": 8, "pl": 16, "gap": 8, "radius": 2})
    small = layout.get("small", {"height": 24, "pt": 2, "pr": 16, "pb": 2, "pl": 16, "gap": 8, "radius": 2})

    def with_fallback(token: str) -> str:
        """
        Build CSS var expression with light fallback from parsed tokens.
        e.g. var(--color-text-disabled) -> var(--color-text-disabled, #757575)
        """
        fallback = (tokens.get(token) or {}).get("light")
        if fallback:
            return f"var({token[4:-1]}, {fallback})"
        return token

    return f"""import {{ LitElement, css, html }} from 'https://esm.sh/lit@3';

export class ButtonComponent extends LitElement {{
  static properties = {{
    disabled: {{ type: Boolean, reflect: true }},
    dataState: {{ type: String, attribute: 'data-state', reflect: true }},
    size: {{ type: String, reflect: true }},
    density: {{ type: String, reflect: true }},
  }};

  constructor() {{
    super();
    this.disabled = false;
    this.dataState = 'default';
    this.size = 'large';
    this.density = 'standard';
  }}

  static styles = css`
    :host {{
      display: inline-block;
    }}

    button {{
      appearance: none;
      border: 1px solid {with_fallback(default_border)};
      background: {with_fallback(default_bg)};
      color: {with_fallback(default_text)};
      border-radius: var(--radius-button, {large["radius"]}px);
      height: var(--button-height, {large["height"]}px);
      min-width: 56px;
      max-width: 320px;
      padding: var(--button-padding-top, {large["pt"]}px) var(--button-padding-x, {large["pr"]}px)
        var(--button-padding-bottom, {large["pb"]}px) var(--button-padding-left, {large["pl"]}px);
      font: 500 14px/20px Roboto, Arial, sans-serif;
      cursor: pointer;
      transition: background-color 140ms ease, border-color 140ms ease, color 140ms ease;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--button-gap, {large["gap"]}px);
      white-space: nowrap;
    }}

    :host([size="medium"]) button {{
      height: {medium["height"]}px;
      padding: {medium["pt"]}px {medium["pr"]}px {medium["pb"]}px {medium["pl"]}px;
      gap: {medium["gap"]}px;
      border-radius: {medium["radius"]}px;
    }}

    :host([size="small"]) button {{
      height: {small["height"]}px;
      padding: {small["pt"]}px {small["pr"]}px {small["pb"]}px {small["pl"]}px;
      gap: {small["gap"]}px;
      border-radius: {small["radius"]}px;
      font-size: 13px;
      line-height: 16px;
    }}

    /* Density overrides (vertical rhythm), derived from Density Primitive */
    :host([density="compact"][size="large"]) button {{
      padding-top: 8px;
      padding-bottom: 8px;
    }}

    :host([density="standard"][size="large"]) button {{
      padding-top: 10px;
      padding-bottom: 10px;
    }}

    :host([density="loose"][size="large"]) button {{
      padding-top: 12px;
      padding-bottom: 12px;
    }}

    :host([density="compact"][size="medium"]) button {{
      padding-top: 6px;
      padding-bottom: 6px;
    }}

    :host([density="standard"][size="medium"]) button {{
      padding-top: 8px;
      padding-bottom: 8px;
    }}

    :host([density="compact"][size="small"]) button {{
      padding-top: 2px;
      padding-bottom: 2px;
    }}

    button:hover {{
      background: {with_fallback(hover_bg)};
      border-color: {with_fallback(hover_border)};
      color: {with_fallback(hover_text)};
    }}

    button:active {{
      background: {with_fallback(active_bg)};
      border-color: {with_fallback(active_border)};
      color: {with_fallback(active_text)};
    }}

    button:focus-visible {{
      outline: 2px solid {with_fallback(focus_border)};
      outline-offset: 2px;
      background: {with_fallback(focus_bg)};
      border-color: {with_fallback(focus_border)};
      color: {with_fallback(focus_text)};
    }}

    :host([disabled]) button,
    button:disabled {{
      background: {with_fallback(disabled_bg)};
      border-color: {with_fallback(disabled_border)};
      color: {with_fallback(disabled_text)};
      cursor: not-allowed;
      pointer-events: none;
    }}

    :host([data-state="hover"]:not([disabled])) button {{
      background: {with_fallback(hover_bg)};
      border-color: {with_fallback(hover_border)};
      color: {with_fallback(hover_text)};
    }}

    :host([data-state="active"]:not([disabled])) button {{
      background: {with_fallback(active_bg)};
      border-color: {with_fallback(active_border)};
      color: {with_fallback(active_text)};
    }}

    :host([data-state="focus"]:not([disabled])) button {{
      outline: 2px solid {with_fallback(focus_border)};
      outline-offset: 2px;
      background: {with_fallback(focus_bg)};
      border-color: {with_fallback(focus_border)};
      color: {with_fallback(focus_text)};
    }}

    :host([data-state="disabled"]) button {{
      background: {with_fallback(disabled_bg)};
      border-color: {with_fallback(disabled_border)};
      color: {with_fallback(disabled_text)};
      cursor: not-allowed;
      pointer-events: none;
    }}

    ::slotted([slot="icon"]) {{
      width: 14px;
      height: 14px;
      color: currentColor;
      fill: currentColor;
      flex: 0 0 auto;
    }}
  `;

  render() {{
    const isDisabled = this.disabled || this.dataState === 'disabled';
    return html`
      <button type="button" ?disabled=${{isDisabled}} aria-disabled=${{String(isDisabled)}}>
        <slot name="icon"></slot>
        <slot>Button</slot>
      </button>
    `;
  }}
}}

customElements.define('button-component', ButtonComponent);
"""


def _generate_demo(tokens: dict[str, dict[str, str]]) -> str:
    def css_vars(theme: str) -> str:
        lines: list[str] = []
        for token, vals in sorted(tokens.items()):
            var_name = token[4:-1]  # var(--token) -> --token
            lines.append(f"  {var_name}: {vals[theme]};")
        return "\n".join(lines)

    light_vars = css_vars("light")
    dark_vars = css_vars("dark")

    demo_buttons = "\n".join(
        [
            f'<button-component data-state="{s.lower()}">{s}</button-component>'
            if s != "Default"
            else '<button-component data-state="default">Default</button-component>'
            for s in STATE_ORDER
        ]
    )

    return f"""<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Button Lit Demo</title>
    <link rel="stylesheet" href="./button-global-vars.css" />
    <style>
      :root {{
{light_vars}
      }}

      body {{
        margin: 0;
        font-family: Roboto, Arial, sans-serif;
        background: #f4f4f4;
        color: #111619;
      }}

      .page {{
        padding: 24px;
        display: grid;
        gap: 24px;
      }}

      .theme {{
        border: 1px solid #d4d4d4;
        border-radius: 8px;
        padding: 16px;
        background: #fff;
      }}

      .theme.theme-dark {{
{dark_vars}
        background: #111619;
        color: #fff;
      }}

      .row {{
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        align-items: center;
      }}

      .theme h2 {{
        margin: 0 0 12px 0;
        font-size: 16px;
      }}
    </style>
  </head>
  <body>
    <div class="page">
      <section class="theme theme-light">
        <h2>Light Theme - Primary Button States (Large)</h2>
        <div class="row">
          {demo_buttons}
        </div>
        <div class="row" style="margin-top:12px">
          <button-component size="medium">Medium</button-component>
          <button-component size="small">Small</button-component>
        </div>
        <div class="row" style="margin-top:12px">
          <button-component size="large" density="compact">Large Compact</button-component>
          <button-component size="large" density="standard">Large Standard</button-component>
          <button-component size="large" density="loose">Large Loose</button-component>
        </div>
      </section>

      <section class="theme theme-dark">
        <h2>Dark Theme - Primary Button States (Large)</h2>
        <div class="row">
          {demo_buttons}
        </div>
        <div class="row" style="margin-top:12px">
          <button-component size="medium">Medium</button-component>
          <button-component size="small">Small</button-component>
        </div>
        <div class="row" style="margin-top:12px">
          <button-component size="large" density="compact">Large Compact</button-component>
          <button-component size="large" density="standard">Large Standard</button-component>
          <button-component size="large" density="loose">Large Loose</button-component>
        </div>
      </section>
    </div>
    <script type="module" src="./button.js"></script>
  </body>
</html>
"""


def _generate_global_vars_css(tokens: dict[str, dict[str, str]]) -> str:
    light_lines: list[str] = []
    dark_lines: list[str] = []
    for token, vals in sorted(tokens.items()):
        name = token[4:-1]  # var(--foo) -> --foo
        light = vals.get("light")
        dark = vals.get("dark")
        if light:
            light_lines.append(f"  {name}: {light};")
        if dark:
            dark_lines.append(f"  {name}: {dark};")
    return (
        ":root {\n"
        + "\n".join(light_lines)
        + "\n}\n\n"
        + "[data-theme=\"dark\"], .theme-dark {\n"
        + "\n".join(dark_lines)
        + "\n}\n"
    )


def _collect_full_global_tokens_from_figma(figma_url: str) -> dict[str, dict[str, str]]:
    """
    Build a global CSS token map from Figma collections:
    - Tokens
    - Primitive
    - Density Primitive
    """
    file_key, _ = extract_file_key_and_node_id(figma_url)
    vars_norm = fetch_variables(file_key, mode="both")
    collections = {"tokens", "primitive", "density primitive"}
    out: dict[str, dict[str, str]] = {}

    for v in vars_norm:
        coll = (v.get("variableCollectionName") or "").strip().lower()
        if coll not in collections:
            continue
        code = v.get("codeSyntax")
        if not isinstance(code, str) or not code.startswith("var(--"):
            continue

        # Prefer themed values; fallback to first mode value for non-themed vars.
        themed = v.get("valuesByTheme") or {}
        light = themed.get("light")
        dark = themed.get("dark")
        if light is None:
            mode_vals = list((v.get("valuesByMode") or {}).values())
            light = str(mode_vals[0]) if mode_vals else None
        if dark is None:
            dark = light
        if light is None:
            continue

        out[code] = {
            "light": str(light).upper() if str(light).startswith("#") else str(light),
            "dark": str(dark).upper() if str(dark).startswith("#") else str(dark),
        }
    return out


def main() -> int:
    spec = _read(SPEC_PATH)
    figma_url = _extract_figma_url(spec)
    tokens = _parse_tokens(_extract_section(spec, "Tokens"))
    layout = _parse_layout_signatures(_extract_section(spec, "Layout & Measurements"))
    light_states = _parse_states(_extract_section(spec, "States (Light Theme)"))
    _parse_states(_extract_section(spec, "States (Dark Theme)"))  # assert structure present

    component_js = _generate_component(light_states, layout, tokens)
    demo_html = _generate_demo(tokens)
    # Build full global vars from Figma; fallback to spec subset on failure.
    try:
        full_tokens = _collect_full_global_tokens_from_figma(figma_url)
        global_css = _generate_global_vars_css(full_tokens or tokens)
    except Exception:
        global_css = _generate_global_vars_css(tokens)

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    OUT_COMPONENT.write_text(component_js, encoding="utf-8")
    OUT_DEMO.write_text(demo_html, encoding="utf-8")
    OUT_GLOBAL_VARS.write_text(global_css, encoding="utf-8")

    print(f"wrote {OUT_COMPONENT}")
    print(f"wrote {OUT_DEMO}")
    print(f"wrote {OUT_GLOBAL_VARS}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())


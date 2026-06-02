#!/usr/bin/env python3
"""Generate a spec-driven Lit accordion + demo + global vars."""

from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path("/home/muthu/projects/ids_design_knowledge")
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from ingestion.figma_sync_client import extract_file_key_and_node_id
from ingestion.figma_variables_rest import fetch_variables

SPEC_PATH = ROOT / "components" / "ids" / "accordion" / "design-spec.md"
OUT_DIR = ROOT / "generated-components"
OUT_COMPONENT = OUT_DIR / "accordion.js"
OUT_DEMO = OUT_DIR / "accordion-demo.html"
OUT_GLOBAL_VARS = OUT_DIR / "accordion-global-vars.css"


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
    rx = re.compile(
        r"^\-\s+`(?P<token>var\(--[^`]+\))`\s*=\s*(?P<light>#[0-9A-Fa-f]{6})\s*\(light\)\s*/\s*(?P<dark>#[0-9A-Fa-f]{6})\s*\(dark\)\s*$"
    )
    out: dict[str, dict[str, str]] = {}
    for line in tokens_section.splitlines():
        m = rx.match(line.strip())
        if not m:
            continue
        out[m.group("token")] = {"light": m.group("light").upper(), "dark": m.group("dark").upper()}
    if not out:
        raise ValueError("Could not parse Accordion tokens")
    return out


def _parse_value_px(line: str) -> int:
    m = re.search(r"(\d+)\s*px", line)
    if not m:
        raise ValueError(f"Missing px value in line: {line}")
    return int(m.group(1))


def _parse_layout(layout_section: str) -> dict[str, int]:
    out: dict[str, int | float] = {}
    for line in layout_section.splitlines():
        row = line.strip()
        if not row.startswith("|"):
            continue
        if "| Header height |" in row:
            out["header_height"] = _parse_value_px(row)
        elif "| Accordion group container |" in row:
            m = re.search(r"itemSpacing:\s*(-?\d+)", row, flags=re.I)
            if m:
                out["group_item_spacing"] = int(m.group(1))
        elif "| Header left padding (expanded with active bar) |" in row:
            out["header_left_expanded"] = _parse_value_px(row)
        elif "| Active indicator bar |" in row:
            out["active_bar_width"] = _parse_value_px(row)
            inset = re.search(r"inset\s*([0-9]*\.?[0-9]+)px", row, flags=re.I)
            if inset:
                out["active_bar_inset"] = float(inset.group(1))
        elif "| Chevron icon |" in row:
            out["icon_size"] = _parse_value_px(row)
        elif "| Header padding |" in row:
            nums = [int(x) for x in re.findall(r"(\d+)\s*px", row)]
            if len(nums) >= 4:
                out["header_pt"], out["header_pr"], out["header_pb"], out["header_pl"] = nums[:4]
        elif "| Content container padding |" in row:
            nums = [int(x) for x in re.findall(r"(\d+)\s*px", row)]
            if len(nums) >= 4:
                out["content_pt"], out["content_pr"], out["content_pb"], out["content_pl"] = nums[:4]
        elif "| Content card padding |" in row:
            out["card_padding"] = _parse_value_px(row)
        elif "| Content card heading/body gap |" in row:
            out["card_gap"] = _parse_value_px(row)
    return out


def _resolve_required_tokens(tokens: dict[str, dict[str, str]]) -> dict[str, str]:
    needed = {
        "bg_component": "var(--color-background-component)",
        "bg_brand_lighter": "var(--color-background-brand-lighter)",
        "bg_brand_light": "var(--color-background-brand-light)",
        "border_accessible": "var(--color-border-accessible)",
        "border_brand_base": "var(--color-border-brand-base)",
        "border_brand_dark": "var(--color-border-brand-dark)",
        "border_strong": "var(--color-border-strong)",
        "text_neutral": "var(--color-text-neutral-strong)",
        "text_link": "var(--color-text-link-brand-base)",
        "icon_accessible": "var(--color-icon-accessible)",
    }
    missing = [v for v in needed.values() if v not in tokens]
    if missing:
        raise ValueError(f"Required Accordion tokens missing in spec: {missing}")
    return needed


def _generate_component(tokens: dict[str, dict[str, str]], layout: dict[str, int | float]) -> str:
    t = _resolve_required_tokens(tokens)

    def with_fallback(token: str) -> str:
        fallback = (tokens.get(token) or {}).get("light")
        if fallback:
            return f"var({token[4:-1]}, {fallback})"
        return token

    hh = layout.get("header_height", 40)
    pt = layout.get("header_pt", 12)
    pr = layout.get("header_pr", 16)
    pb = layout.get("header_pb", 12)
    pl = layout.get("header_pl", 16)
    pl_expanded = layout.get("header_left_expanded", pl)
    bar_w = layout.get("active_bar_width", 4)
    icon = layout.get("icon_size", 16)
    cpt = layout.get("content_pt", 8)
    cpr = layout.get("content_pr", 24)
    cpb = layout.get("content_pb", 16)
    cpl = layout.get("content_pl", 40)
    card_gap = layout.get("card_gap", 4)
    bar_inset = layout.get("active_bar_inset", 0.5)

    return f"""import {{ LitElement, css, html }} from 'https://esm.sh/lit@3';

export class AccordionComponent extends LitElement {{
  static properties = {{
    title: {{ type: String }},
    expanded: {{ type: Boolean, reflect: true }},
    dataState: {{ type: String, attribute: 'data-state', reflect: true }},
    managed: {{ type: Boolean, reflect: true }},
  }};

  constructor() {{
    super();
    this.title = 'Accordion title';
    this.expanded = false;
    this.dataState = '';
    this.managed = false;
  }}

  _toggle() {{
    if (this.dataState) return;
    const nextExpanded = !this.expanded;
    if (!this.managed) {{
      this.expanded = nextExpanded;
    }}
    this.dispatchEvent(
      new CustomEvent('accordion-toggle', {{
        detail: {{ expanded: nextExpanded }},
        bubbles: true,
        composed: true,
      }})
    );
  }}

  static styles = css`
    :host {{
      display: block;
      position: relative;
      width: 100%;
      box-sizing: border-box;
      border: 1px solid {with_fallback(t["border_accessible"])};
      background: {with_fallback(t["bg_component"])};
      font-family: Roboto, Arial, sans-serif;
    }}

    .header {{
      width: 100%;
      min-height: {hh}px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 8px;
      padding: {pt}px {pr}px {pb}px {pl}px;
      border: 0;
      border-bottom: 1px solid {with_fallback(t["border_accessible"])};
      background: {with_fallback(t["bg_component"])};
      color: {with_fallback(t["text_neutral"])};
      font: 400 14px/20px Roboto, Arial, sans-serif;
      text-align: left;
      cursor: pointer;
      position: relative;
      transition: background-color 140ms ease, color 140ms ease;
    }}

    .icon {{
      width: {icon}px;
      height: {icon}px;
      color: {with_fallback(t["icon_accessible"])};
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      transition: color 140ms ease, transform 140ms ease;
    }}

    .content-wrap {{
      display: none;
      padding: {cpt}px {cpr}px {cpb}px {cpl}px;
      background: {with_fallback(t["bg_component"])};
      color: {with_fallback(t["text_neutral"])};
    }}

    .card {{
      background: transparent;
      border: 0;
      padding: 0;
      display: grid;
      gap: 12px;
    }}

    .rows {{
      display: grid;
      gap: {card_gap}px;
    }}

    .row {{
      display: grid;
      grid-template-columns: 64px minmax(0, 1fr);
      gap: 0;
      font: 400 12px/18px Roboto, Arial, sans-serif;
      color: {with_fallback(t["text_neutral"])};
    }}

    .label {{
      color: {with_fallback(t["text_neutral"])};
    }}

    .value {{
      color: {with_fallback(t["text_neutral"])};
    }}

    .card h4 {{
      margin: 0;
      font: 500 18px/25px Roboto, Arial, sans-serif;
      color: {with_fallback(t["text_neutral"])};
    }}

    .card p {{
      margin: 0;
      font: 400 12px/18px Roboto, Arial, sans-serif;
      color: {with_fallback(t["text_neutral"])};
    }}

    .card a {{
      color: {with_fallback(t["text_link"])};
      text-decoration: underline;
    }}

    :host([expanded]) .header {{
      background: {with_fallback(t["bg_brand_lighter"])};
      padding-left: {pl_expanded}px;
      border-bottom: 0;
    }}

    :host([expanded])::before,
    :host([data-state="expanded-default"])::before,
    :host([data-state="expanded-hover"])::before {{
      content: '';
      position: absolute;
      left: 0;
      top: {bar_inset}px;
      bottom: {bar_inset}px;
      width: {bar_w}px;
      background: {with_fallback(t["border_brand_base"])};
      pointer-events: none;
      z-index: 2;
    }}

    :host([expanded]) .icon {{
      color: {with_fallback(t["border_strong"])};
      transform: rotate(180deg);
    }}

    :host([expanded]) .content-wrap {{
      display: block;
    }}

    .header,
    .content-wrap {{
      position: relative;
      z-index: 1;
    }}

    .header:hover {{
      background: {with_fallback(t["bg_brand_lighter"])};
    }}

    :host([expanded]) .header:hover {{
      background: {with_fallback(t["bg_brand_light"])};
    }}

    .header:hover .icon,
    :host([expanded]) .header .icon {{
      color: {with_fallback(t["border_strong"])};
    }}

    .header:focus-visible {{
      outline: 2px solid {with_fallback(t["border_brand_base"])};
      outline-offset: 2px;
    }}

    /* Forced visual states for demo */
    :host([data-state="collapsed-default"]) .header {{
      background: {with_fallback(t["bg_component"])};
      color: {with_fallback(t["text_neutral"])};
    }}
    :host([data-state="collapsed-default"]) .icon {{
      color: {with_fallback(t["icon_accessible"])};
      transform: rotate(0deg);
    }}

    :host([data-state="collapsed-hover"]) .header {{
      background: {with_fallback(t["bg_brand_lighter"])};
    }}
    :host([data-state="collapsed-hover"]) .icon {{
      color: {with_fallback(t["border_strong"])};
      transform: rotate(0deg);
    }}

    :host([data-state="expanded-default"]) .header {{
      background: {with_fallback(t["bg_brand_lighter"])};
      padding-left: {pl_expanded}px;
      border-bottom: 0;
    }}
    :host([data-state="expanded-default"]) .icon {{
      color: {with_fallback(t["border_strong"])};
      transform: rotate(180deg);
    }}
    :host([data-state="expanded-default"]) .content-wrap {{
      display: block;
    }}

    :host([data-state="expanded-hover"]) .header {{
      background: {with_fallback(t["bg_brand_light"])};
      padding-left: {pl_expanded}px;
      border-bottom: 0;
    }}
    :host([data-state="expanded-hover"]) .icon {{
      color: {with_fallback(t["border_strong"])};
      transform: rotate(180deg);
    }}
    :host([data-state="expanded-hover"]) .content-wrap {{
      display: block;
    }}
  `;

  render() {{
    const force = this.dataState;
    const isExpanded = force
      ? force === 'expanded-default' || force === 'expanded-hover'
      : this.expanded;
    const icon = isExpanded ? '▴' : '▾';
    return html`
      <button class="header" type="button" @click=${{() => this._toggle()}} aria-expanded=${{String(isExpanded)}}>
        <span class="icon" aria-hidden="true">${{icon}}</span>
        <span>${{this.title}}</span>
      </button>
      <div class="content-wrap">
        <div class="card">
          <h4><slot name="heading">Swap content</slot></h4>
          <div class="rows">
            <div class="row"><span class="label">Label:</span><span class="value">Single line content</span></div>
            <div class="row"><span class="label">Label:</span><span class="value">Single line content</span></div>
            <div class="row"><span class="label">Label:</span><span class="value">Some really long description that takes more than one or two lines.</span></div>
          </div>
          <a href="#" @click=${{(e) => e.preventDefault()}}>Action link</a>
        </div>
      </div>
    `;
  }}
}}

customElements.define('accordion-component', AccordionComponent);

export class AccordionGroupComponent extends LitElement {{
  static properties = {{
    mode: {{ type: String, reflect: true }},
    openIndexes: {{ state: true }},
    items: {{ type: Array }},
  }};

  constructor() {{
    super();
    this.mode = 'single';
    this.openIndexes = [0];
    this.items = [
      {{ title: 'Panel 1' }},
      {{ title: 'Panel 2' }},
      {{ title: 'Panel 3' }},
      {{ title: 'Panel 4' }},
    ];
  }}

  _isOpen(index) {{
    return this.openIndexes.includes(index);
  }}

  _toggleIndex(index) {{
    if (this.mode === 'single') {{
      this.openIndexes = this._isOpen(index) ? [] : [index];
      return;
    }}
    if (this._isOpen(index)) {{
      this.openIndexes = this.openIndexes.filter((i) => i !== index);
    }} else {{
      this.openIndexes = [...this.openIndexes, index].sort((a, b) => a - b);
    }}
  }}

  render() {{
    return html`
      <div class="group">
        ${{
          this.items.map(
            (item, idx) => html`
              <accordion-component
                .title=${{item.title}}
                ?expanded=${{this._isOpen(idx)}}
                ?managed=${{true}}
                @accordion-toggle=${{() => this._toggleIndex(idx)}}
              ></accordion-component>
            `
          )
        }}
      </div>
    `;
  }}

  static styles = css`
    :host {{
      display: block;
      width: 100%;
    }}
    .group {{
      display: grid;
      gap: 0;
    }}
    .group accordion-component + accordion-component {{
      margin-top: -1px;
    }}
  `;
}}

customElements.define('accordion-group', AccordionGroupComponent);
"""


def _generate_demo(tokens: dict[str, dict[str, str]]) -> str:
    def css_vars(theme: str) -> str:
        lines: list[str] = []
        for token, vals in sorted(tokens.items()):
            lines.append(f"  {token[4:-1]}: {vals[theme]};")
        return "\n".join(lines)

    light_vars = css_vars("light")
    dark_vars = css_vars("dark")
    demo_row = """
          <accordion-component data-state="collapsed-default" title="Collapsed default"></accordion-component>
          <accordion-component data-state="collapsed-hover" title="Collapsed hover"></accordion-component>
          <accordion-component data-state="expanded-default" title="Expanded default"></accordion-component>
          <accordion-component data-state="expanded-hover" title="Expanded hover"></accordion-component>
    """
    return f"""<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Accordion Lit Demo</title>
    <link rel="stylesheet" href="./accordion-global-vars.css" />
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
        border: 0;
        border-radius: 0;
        padding: 0;
        background: transparent;
      }}

      .theme.theme-dark {{
{dark_vars}
        background: #111619;
        color: #fff;
      }}

      .stack {{
        display: grid;
        gap: 0;
        width: 480px;
        max-width: 100%;
      }}

      .stack accordion-component + accordion-component {{
        margin-top: -1px;
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
        <h2>Light Theme - Accordion States</h2>
        <div class="stack">
{demo_row}
        </div>
      </section>

      <section class="theme theme-dark">
        <h2>Dark Theme - Accordion States</h2>
        <div class="stack">
{demo_row}
        </div>
      </section>

      <section class="theme theme-light">
        <h2>Interaction - Single Open (mode="single")</h2>
        <div class="stack">
          <accordion-group mode="single"></accordion-group>
        </div>
      </section>

      <section class="theme theme-light">
        <h2>Interaction - Multiple Open (mode="multiple")</h2>
        <div class="stack">
          <accordion-group mode="multiple"></accordion-group>
        </div>
      </section>
    </div>
    <script type="module" src="./accordion.js"></script>
  </body>
</html>
"""


def _generate_global_vars_css(tokens: dict[str, dict[str, str]]) -> str:
    light_lines: list[str] = []
    dark_lines: list[str] = []
    for token, vals in sorted(tokens.items()):
        name = token[4:-1]
        if vals.get("light"):
            light_lines.append(f"  {name}: {vals['light']};")
        if vals.get("dark"):
            dark_lines.append(f"  {name}: {vals['dark']};")
    return (
        ":root {\n"
        + "\n".join(light_lines)
        + "\n}\n\n"
        + "[data-theme=\"dark\"], .theme-dark {\n"
        + "\n".join(dark_lines)
        + "\n}\n"
    )


def _collect_full_global_tokens_from_figma(figma_url: str) -> dict[str, dict[str, str]]:
    file_key, _ = extract_file_key_and_node_id(figma_url)
    vars_norm = fetch_variables(file_key, mode="both")
    collections = {"tokens", "primitive", "density primitive"}
    priority = {"tokens": 3, "primitive": 2, "density primitive": 1}
    out: dict[str, dict[str, str]] = {}
    chosen_priority: dict[str, int] = {}

    for v in vars_norm:
        coll = (v.get("variableCollectionName") or "").strip().lower()
        if coll not in collections:
            continue
        code = v.get("codeSyntax")
        if not isinstance(code, str) or not code.startswith("var(--"):
            continue
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
        p = priority.get(coll, 0)
        if code in chosen_priority and chosen_priority[code] > p:
            continue
        chosen_priority[code] = p
        out[code] = {
            "light": str(light).upper() if str(light).startswith("#") else str(light),
            "dark": str(dark).upper() if str(dark).startswith("#") else str(dark),
        }
    return out


def main() -> int:
    spec = _read(SPEC_PATH)
    figma_url = _extract_figma_url(spec)
    tokens = _parse_tokens(_extract_section(spec, "Tokens"))
    layout = _parse_layout(_extract_section(spec, "Layout & Measurements"))

    component_js = _generate_component(tokens, layout)
    demo_html = _generate_demo(tokens)
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

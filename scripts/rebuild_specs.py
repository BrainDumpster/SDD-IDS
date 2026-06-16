"""
Rebuild Synapse Design Specs (Framework-Agnostic)
==================================================
Generates a root-spec.md (global tokens, baselines, theming) plus per-component
override design-spec.md files. Component specs inherit from root and only
document what is specific to that component.

Sources of truth:
- synapse-theme.css (Figma-extracted token values)
- *.module.css files (which tokens are used, in which states)
- synapse-component-figma-map.json (Figma node IDs)
- synapse.yaml (breakpoints, elevation, typography, framework options)
- synapse-component-aliases.json (name mapping)
- synapse-interaction-templates.json (component-specific interactions)
- synapse-figma-layout-cache.json (extracted measurements)
"""

import argparse
import json
import re
import sys
from pathlib import Path
from datetime import datetime, timezone
from collections import defaultdict

PROJECT = Path(__file__).resolve().parent.parent
CSS_DIR = PROJECT / "storybook" / "src" / "components"
SPECS_DIR = PROJECT / "components" / "synapse"
THEME_CSS = PROJECT / "storybook" / "src" / "synapse-theme.css"
REGISTRY = PROJECT / "data" / "synapse-component-registry.json"
FIGMA_MAP = PROJECT / "data" / "synapse-component-figma-map.json"
ALIASES = PROJECT / "data" / "synapse-component-aliases.json"
INTERACTIONS = PROJECT / "data" / "synapse-interaction-templates.json"
LAYOUT_CACHE = PROJECT / "data" / "synapse-figma-layout-cache.json"
CONFIG_YAML = PROJECT / "config" / "design_systems" / "synapse.yaml"


# ---------------------------------------------------------------------------
# CSS parser: extract design intent from implementation
# ---------------------------------------------------------------------------

def parse_theme(css_path: Path) -> dict:
    """Parse theme CSS into {token: {light, dark}}."""
    text = css_path.read_text()
    tokens = {}
    root = re.search(r':root\s*\{([^}]+(?:\{[^}]*\}[^}]*)*)\}', text, re.DOTALL)
    dark = re.search(r'\[data-theme="dark"\]\s*\{([^}]+)\}', text, re.DOTALL)
    if root:
        for m in re.finditer(r'(--[\w-]+)\s*:\s*([^;]+);', root.group(1)):
            tokens[m.group(1)] = {"light": m.group(2).strip(), "dark": None}
    if dark:
        for m in re.finditer(r'(--[\w-]+)\s*:\s*([^;]+);', dark.group(1)):
            n = m.group(1)
            if n in tokens:
                tokens[n]["dark"] = m.group(2).strip()
            else:
                tokens[n] = {"light": None, "dark": m.group(2).strip()}
    for v in tokens.values():
        if v["dark"] is None:
            v["dark"] = v["light"]
    return tokens


def parse_css_states(css_path: Path) -> list:
    """Parse a CSS module into selector/property blocks."""
    text = css_path.read_text()
    blocks = []
    for m in re.finditer(r'([^{]+)\{([^}]+)\}', text):
        selector = m.group(1).strip()
        props = {}
        for pm in re.finditer(r'([\w-]+)\s*:\s*([^;]+);', m.group(2)):
            props[pm.group(1).strip()] = pm.group(2).strip()
        if props:
            blocks.append({"selector": selector, "properties": props})
    return blocks


def extract_design_states(blocks: list, theme: dict) -> dict:
    """Convert CSS blocks into a framework-agnostic state map."""
    STATE_MAP = {
        ":hover": "hover",
        ":active": "active",
        ":focus": "focus",
        ":focus-visible": "focus",
        ":disabled": "disabled",
        "[data-checked]": "checked",
        "[data-selected]": "selected",
        "[data-open]": "open",
        "[data-disabled]": "disabled",
        "[data-highlighted]": "highlighted",
        "[data-focus-visible]": "focus",
        "[data-indeterminate]": "indeterminate",
        "[data-pressed]": "pressed",
    }

    ROLE_MAP = {
        "background": "background",
        "background-color": "background",
        "color": "text",
        "border-color": "border",
        "border": "border",
        "outline": "focus-ring",
        "outline-color": "focus-ring",
        "box-shadow": "shadow",
        "opacity": "opacity",
        "border-radius": "radius",
        "padding": "padding",
        "height": "height",
        "font-size": "typography",
        "line-height": "line-height",
    }

    states = defaultdict(lambda: defaultdict(dict))

    for block in blocks:
        sel = block["selector"]
        variant = "default"
        state = "default"

        classes = re.findall(r'\.(\w[\w-]*)', sel)
        for pattern, state_name in STATE_MAP.items():
            if pattern in sel:
                state = state_name
                break

        known_variants = {"primary", "secondary", "tertiary", "ghost", "danger",
                          "info", "success", "warning", "error",
                          "sm", "md", "lg",
                          "default", "elevated", "outlined", "dot", "text", "circle", "rectangle"}
        for cls in classes:
            if cls in known_variants:
                variant = cls
                break

        for prop, value in block["properties"].items():
            role = ROLE_MAP.get(prop)
            if not role:
                continue
            token_refs = re.findall(r'var\((--[\w-]+)\)', value)
            if token_refs:
                resolved = [f"`var({t})`" for t in token_refs]
                states[variant][state][role] = " ".join(resolved)
            elif prop == "opacity":
                states[variant][state][role] = value

    return dict(states)


def extract_anatomy(css_path: Path) -> list:
    """Extract component anatomy from CSS class names."""
    text = css_path.read_text()
    classes = set()
    for m in re.finditer(r'(?:^|\}[^{]*|,\s*)\.([a-zA-Z][\w-]*)', text, re.MULTILINE):
        classes.add(m.group(1))

    skip = {"sm", "md", "lg", "xs", "xl",
            "primary", "secondary", "tertiary", "ghost", "danger",
            "info", "success", "warning", "error",
            "default", "elevated", "outlined",
            "dot", "circle", "rectangle",
            "horizontal", "vertical",
            "wide", "narrow", "striped", "hoverable"}

    return [c for c in sorted(classes) if c not in skip and not c.startswith("_")]


def extract_all_tokens(css_path: Path) -> list:
    """Extract all unique token references from CSS."""
    text = css_path.read_text()
    refs = re.findall(r'var\((--[\w-]+)\)', text)
    framework_vars = {"--anchor-width", "--radix-popover-width"}
    return sorted(set(r for r in refs if r not in framework_vars))


# ---------------------------------------------------------------------------
# Alias-aware Figma entry resolution
# ---------------------------------------------------------------------------

def load_aliases(path: Path) -> dict:
    """Load alias mapping file, return empty structure if missing."""
    if path.exists():
        return json.loads(path.read_text())
    return {"figma_to_slug": {}, "aliases": {}}


def resolve_figma_entry(slug: str, figma_map: list, aliases: dict) -> dict:
    """
    Find the best Figma map entry for a component slug.
    1. Direct slug match
    2. Alias file figma_to_slug reverse lookup
    3. Fuzzy fallback (strip hyphens)
    """
    # 1. Direct match
    entry = next((e for e in figma_map if slugify(e["component"]) == slug), None)
    if entry:
        return entry

    # 2. Alias file: check if any Figma display name maps to this slug
    figma_to_slug = aliases.get("figma_to_slug", {})
    for figma_name, mapped_slug in figma_to_slug.items():
        if mapped_slug == slug:
            entry = next((e for e in figma_map if e["component"] == figma_name), None)
            if entry:
                return entry

    # 3. Fuzzy fallback: strip hyphens
    entry = next((e for e in figma_map
                  if slugify(e["component"]).replace("-", "") == slug.replace("-", "")), None)
    return entry or {}


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def slugify(name: str) -> str:
    return re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')


def _load_config() -> dict:
    """Load synapse.yaml config."""
    import yaml
    if CONFIG_YAML.exists():
        with open(CONFIG_YAML) as f:
            return yaml.safe_load(f) or {}
    return {}


def _categorize_tokens(theme: dict) -> dict:
    """Group all theme tokens by role for the root spec."""
    categories = {
        "background": [],
        "border": [],
        "text": [],
        "icon": [],
        "shadow": [],
        "gradient": [],
        "static": [],
        "spacing": [],
        "sizing": [],
        "padding": [],
        "corner-radius": [],
        "border-width": [],
        "font-size": [],
        "font-line-height": [],
        "primitive-alert": [],
        "primitive-palette": [],
        "primitive-opacity": [],
        "primitive-scale": [],
        "other": [],
    }

    for token in sorted(theme.keys()):
        if token.startswith("--color-background"):
            categories["background"].append(token)
        elif token.startswith("--color-border"):
            categories["border"].append(token)
        elif token.startswith("--color-text"):
            categories["text"].append(token)
        elif token.startswith("--color-icon"):
            categories["icon"].append(token)
        elif token.startswith("--shadow"):
            categories["shadow"].append(token)
        elif token.startswith("--color-gradient"):
            categories["gradient"].append(token)
        elif token.startswith("--color-static"):
            categories["static"].append(token)
        elif token.startswith("--spacing"):
            categories["spacing"].append(token)
        elif token.startswith("--sizing"):
            categories["sizing"].append(token)
        elif token.startswith("--padding"):
            categories["padding"].append(token)
        elif token.startswith("--corner-radius"):
            categories["corner-radius"].append(token)
        elif token.startswith("--border-width"):
            categories["border-width"].append(token)
        elif token.startswith("--font-size"):
            categories["font-size"].append(token)
        elif token.startswith("--font-line-height"):
            categories["font-line-height"].append(token)
        elif token.startswith("--alert-"):
            categories["primitive-alert"].append(token)
        elif any(token.startswith(p) for p in ("--ui-palette-", "--secondary-palette-")):
            categories["primitive-palette"].append(token)
        elif token.startswith("--opacity"):
            categories["primitive-opacity"].append(token)
        elif token.startswith("--scale"):
            categories["primitive-scale"].append(token)
        else:
            categories["other"].append(token)

    return categories


def _token_table(tokens: list, theme: dict) -> str:
    """Build a markdown table of tokens with light/dark values."""
    rows = ["| Token | Light | Dark |", "|---|---|---|"]
    for t in tokens:
        vals = theme.get(t, {})
        light = vals.get("light", "—")
        dark = vals.get("dark", light)
        rows.append(f"| `{t}` | {light} | {dark} |")
    return "\n".join(rows)


def _invariant_token_table(tokens: list, theme: dict) -> str:
    """Build a markdown table for tokens that don't change between themes."""
    rows = ["| Token | Value |", "|---|---|"]
    for t in tokens:
        vals = theme.get(t, {})
        val = vals.get("light", "—")
        rows.append(f"| `{t}` | {val} |")
    return "\n".join(rows)


# ---------------------------------------------------------------------------
# Root spec builder
# ---------------------------------------------------------------------------

def build_root_spec(theme: dict, config: dict) -> str:
    """Generate the root-spec.md with all global design system content."""
    now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    cats = _categorize_tokens(theme)

    # Framework options
    fw_options = config.get("framework_options", [])
    fw_lines = "\n".join(f"- **{o['id']}**: {o['display']}" for o in fw_options) if fw_options else "- base-ui: React + Base UI"

    # Typography scale
    typo = config.get("typography", {})
    font_family = typo.get("font_family", "Roboto")
    weights = typo.get("weights", [400, 500, 700])
    scale = typo.get("scale", {})
    typo_rows = ["| Level | Size | Line Height |", "|---|---|---|"]
    for level, vals in scale.items():
        if isinstance(vals, dict):
            typo_rows.append(f"| {level} | {vals.get('size', '—')} | {vals.get('line_height', '—')} |")

    # Breakpoints
    bps = config.get("breakpoints", {})
    bp_rows = ["| Name | Min Width |", "|---|---|"]
    for name, width in bps.items():
        bp_rows.append(f"| {name} | {width} |")

    # Elevation levels
    elevations = config.get("elevation_levels", {})
    elev_rows = ["| Level | Shadow Token Set | Use Cases |", "|---|---|---|"]
    shadow_sizes = ["2", "4", "8", "16", "32"]
    for level, desc in sorted(elevations.items()):
        idx = int(level) if level.isdigit() else 0
        shadow_name = shadow_sizes[idx] if idx < len(shadow_sizes) else shadow_sizes[-1]
        if idx == 0:
            elev_rows.append(f"| {level} | *(none — flat)* | {desc} |")
        else:
            elev_rows.append(f"| {level} | `--shadow-drop-shadow-{shadow_name}-*` | {desc} |")

    spec = f"""<!-- auto:generated:start -->
# Synapse Design System — Root Spec

> Generated {now}. Global design system specification — framework-agnostic.
> All component specs inherit from this document. Component specs only override what is specific.

<!-- ds:section id=identity -->
## Design System Identity

| Property | Value |
|---|---|
| Name | Synapse |
| Framework Layer | {config.get('framework_layer', 'base-ui')} |
| Figma File | Synapse Hi Fi components |
| Figma URL (reference) | `https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components?node-id=11067-54471` |
| Theme Mechanism | CSS Custom Properties + `data-theme` attribute |

### Supported Frameworks

{fw_lines}

<!-- ds:section id=color-system -->
## Color System

All colors are expressed as CSS custom properties. Semantic tokens resolve to different values in Light vs Dark themes. Primitive palette tokens are static across themes.

### Background Tokens ({len(cats['background'])} tokens)

{_token_table(cats['background'], theme)}

### Border Tokens ({len(cats['border'])} tokens)

{_token_table(cats['border'], theme)}

### Text Tokens ({len(cats['text'])} tokens)

{_token_table(cats['text'], theme)}

### Icon Tokens ({len(cats['icon'])} tokens)

{_token_table(cats['icon'], theme)}

### Gradient Tokens ({len(cats['gradient'])} tokens)

{_token_table(cats['gradient'], theme)}

### Static Color Tokens ({len(cats['static'])} tokens)

These do not change between themes.

{_invariant_token_table(cats['static'], theme)}

### Primitive Palette — Alert ({len(cats['primitive-alert'])} tokens)

{_invariant_token_table(cats['primitive-alert'], theme)}

### Primitive Palette — UI & Secondary ({len(cats['primitive-palette'])} tokens)

{_invariant_token_table(cats['primitive-palette'], theme)}

<!-- ds:section id=typography -->
## Typography Scale

- **Font Family**: {font_family}
- **Weights**: {', '.join(str(w) for w in weights)}

{chr(10).join(typo_rows)}

### Font Size Tokens

{_invariant_token_table(cats['font-size'], theme)}

### Line Height Tokens

{_invariant_token_table(cats['font-line-height'], theme)}

<!-- ds:section id=spacing -->
## Spacing & Sizing

### Padding Tokens

{_invariant_token_table(cats['padding'], theme)}

### Spacing Tokens

{_invariant_token_table(cats['spacing'], theme)}

### Sizing Tokens

{_invariant_token_table(cats['sizing'], theme)}

### Primitive Scale

{_invariant_token_table(cats['primitive-scale'], theme)}

<!-- ds:section id=border -->
## Border Width

{_invariant_token_table(cats['border-width'], theme)}

<!-- ds:section id=corner-radius -->
## Corner Radius

{_invariant_token_table(cats['corner-radius'], theme)}

<!-- ds:section id=elevation -->
## Elevation System

{chr(10).join(elev_rows)}

### Shadow Tokens ({len(cats['shadow'])} tokens)

{_token_table(cats['shadow'], theme)}

<!-- ds:section id=opacity -->
## Opacity Scale

{_invariant_token_table(cats['primitive-opacity'], theme)}

<!-- ds:section id=breakpoints -->
## Responsive Breakpoints

{chr(10).join(bp_rows)}

- Component width is determined by its container (`width: 100%` or intrinsic)
- Typography tokens are fixed (no fluid type) — responsive adjustments come from layout, not component internals

<!-- ds:section id=interactions-baseline -->
## Interaction Baseline

All components inherit these baseline interaction behaviors unless overridden in their component spec.

### Focus Management
- Focus ring: `var(--color-border-brand-base)` outline with `var(--border-width-border-2)` width
- All interactive elements must have visible focus indicators
- Focus follows keyboard navigation order (DOM order or explicit tabindex)

### Keyboard Baseline
- **Tab**: Move focus to/from component
- **Enter / Space**: Activate the focused element
- **Escape**: Dismiss overlays, cancel operations (where applicable)

### Mouse
- **Hover**: Visual feedback on interactive elements (background/border color change)
- **Click/Press**: Active state feedback, triggers primary action

### Touch
- Touch targets must be at least 44x44px per WCAG 2.1
- Hover states must not be required for functionality

<!-- ds:section id=accessibility-baseline -->
## Accessibility Baseline

All components must meet these requirements. Component specs only document additional, component-specific accessibility needs.

- **Contrast**: Minimum 4.5:1 for normal text, 3:1 for large text (WCAG AA)
- **Focus**: All interactive elements must have visible focus indicators
- **Semantic HTML**: Use elements appropriate to the component role
- **ARIA**: Provide ARIA attributes where semantic HTML is insufficient
- **Screen Readers**: Support announcements for state changes
- **Keyboard**: Ensure keyboard operability for all interactions

<!-- ds:section id=theming -->
## Theming Mechanism

- All color tokens resolve to different values per theme (see Color System tables)
- Spacing, typography, and radius tokens are theme-invariant
- Shadow color tokens change between themes (slightly cooler in dark)
- Theme is set via `data-theme` attribute on a parent element
- Implementation must NOT use separate stylesheets per theme — use the same CSS custom properties

<!-- ds:section id=variable-collections -->
## Variable Collections (Figma)

- **Color Mode** — primary semantic COLOR variables (Light / Dark). Maps to most `--color-*` tokens.
- **Tokens** — supplemental semantic COLOR + shadow COLOR + shadow FLOAT geometry (Light / Dark where applicable). Maps to `--color-*`, `--shadow-drop-shadow-*`.
- **Primitive** — base palette values (static across themes). Maps to `--alert-*`, `--ui-palette-*`, `--secondary-palette-*`, `--opacity-*`, `--scale-*`.
- **Sizes** — spacing, padding, corner radius, font sizes, border widths. Maps to `--padding-*`, `--spacing-*`, `--sizing-*`, `--corner-radius-*`, `--border-width-*`, `--font-*`.

## Source Mapping

| Source | Location |
|---|---|
| Figma variables | `GET /v1/files/Td1bnsvRj1PCGs9RVJkIvJ/variables/local` (Figma REST API); last sync timestamp in `components/synapse-theme.css` header |
| Figma reference node | File `Td1bnsvRj1PCGs9RVJkIvJ`, node `11067:54471` (CANVAS `-- Form Elements` — page context for this sync) |
| Theme CSS | `components/synapse-theme.css` |
| Component map | `data/synapse-component-figma-map.json` |
| Config | `config/design_systems/synapse.yaml` |
| Theme sync script | `scripts/sync_synapse_theme_from_figma.py` |
<!-- auto:generated:end -->
"""
    return spec


# ---------------------------------------------------------------------------
# Layout section builder
# ---------------------------------------------------------------------------

def build_layout_section(slug: str, layout_cache: dict) -> str:
    """Build layout section from cached Figma measurements."""
    entry = layout_cache.get(slug)
    if not entry:
        return """<!-- ds:section id=layout -->
## Layout & Measurements

> Layout data not yet extracted. Run `python scripts/figma_layout_enricher.py` to populate.
"""

    layout = entry.get("layout", {})
    variants_data = entry.get("variants", {})
    typo_data = entry.get("typography", [])

    lines = ["<!-- ds:section id=layout -->", "## Layout & Measurements", ""]

    # Default dimensions
    if layout.get("width") or layout.get("height"):
        lines.append("### Default Dimensions")
        lines.append("")
        if layout.get("width"):
            lines.append(f"- **Width**: {layout['width']}px")
        if layout.get("height"):
            lines.append(f"- **Height**: {layout['height']}px")
        lines.append("")

    # Padding
    padding = layout.get("padding", {})
    if any(padding.get(k) for k in ("top", "right", "bottom", "left")):
        lines.append("### Padding")
        lines.append("")
        lines.append(f"- Top: {padding.get('top', 0)}px")
        lines.append(f"- Right: {padding.get('right', 0)}px")
        lines.append(f"- Bottom: {padding.get('bottom', 0)}px")
        lines.append(f"- Left: {padding.get('left', 0)}px")
        lines.append("")

    # Border radius
    if layout.get("border_radius"):
        lines.append(f"- **Border Radius**: {layout['border_radius']}px")
        lines.append("")

    # Item spacing
    if layout.get("item_spacing"):
        lines.append(f"- **Item Spacing**: {layout['item_spacing']}px")
        lines.append("")

    # Variant dimensions table
    if variants_data:
        lines.append("### Size Variants")
        lines.append("")
        lines.append("| Variant | Height | Padding | Font Size |")
        lines.append("|---|---|---|---|")
        for v_name, v_data in sorted(variants_data.items()):
            h = f"{v_data.get('height', '—')}px" if v_data.get('height') else "—"
            p = v_data.get('padding', '—')
            if isinstance(p, dict):
                p = f"{p.get('top', 0)}/{p.get('right', 0)}/{p.get('bottom', 0)}/{p.get('left', 0)}"
            fs = f"{v_data.get('font_size', '—')}px" if v_data.get('font_size') else "—"
            lines.append(f"| {v_name} | {h} | {p} | {fs} |")
        lines.append("")

    # Typography
    if typo_data:
        lines.append("### Typography")
        lines.append("")
        for t in typo_data:
            lines.append(f"- **{t.get('text', 'Label')}**: {t.get('font', 'Roboto')} {t.get('size', '?')}px / {t.get('weight', 400)}")
        lines.append("")

    return "\n".join(lines)


# ---------------------------------------------------------------------------
# Interactions section builder
# ---------------------------------------------------------------------------

def build_interactions_section(slug: str, interaction_templates: dict) -> str:
    """Build component-specific interaction section from templates."""
    template = interaction_templates.get(slug)
    if not template:
        # No override — component inherits from root spec baseline
        return ""

    lines = [
        "<!-- ds:section id=interactions -->",
        "## Interactions (Component-Specific)",
        "",
        "> Baseline interactions (focus management, Tab/Enter/Space/Escape, touch targets) are defined in root-spec.md.",
        "> This section documents additional or overriding behaviors for this component.",
        "",
        f"**Pattern**: {template.get('pattern', 'custom')}",
        "",
    ]

    # Behaviors
    behaviors = template.get("behaviors", [])
    if behaviors:
        lines.append("### Behaviors")
        lines.append("")
        for b in behaviors:
            lines.append(f"- {b}")
        lines.append("")

    # Keyboard overrides
    keyboard = template.get("keyboard", {})
    if keyboard:
        lines.append("### Keyboard")
        lines.append("")
        lines.append("| Key | Action |")
        lines.append("|---|---|")
        for key, action in keyboard.items():
            lines.append(f"| {key} | {action} |")
        lines.append("")

    # ARIA requirements
    aria = template.get("aria", {})
    if aria:
        lines.append("### ARIA")
        lines.append("")
        lines.append("| Element | Attributes |")
        lines.append("|---|---|")
        for element, attrs in aria.items():
            if isinstance(attrs, list):
                lines.append(f"| {element} | {', '.join(attrs)} |")
            else:
                lines.append(f"| {element} | {attrs} |")
        lines.append("")

    return "\n".join(lines)


# ---------------------------------------------------------------------------
# Component spec builder (overrides-only)
# ---------------------------------------------------------------------------

def build_component_spec(
    name: str,
    slug: str,
    figma_entry: dict,
    anatomy: list,
    tokens: list,
    theme: dict,
    design_states: dict,
    layout_cache: dict,
    interaction_templates: dict,
) -> str:
    """Generate a per-component override spec that inherits from root-spec.md."""
    now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    node_id = figma_entry.get("nodeId", "")
    category = figma_entry.get("category", "")
    page = figma_entry.get("page", "")

    # Token documentation — component-specific tokens only
    token_lines = []
    for t in tokens:
        vals = theme.get(t, {})
        light = vals.get("light", "?")
        dark = vals.get("dark", light)
        if light == dark:
            token_lines.append(f"- `var({t})` = {light}")
        else:
            token_lines.append(f"- `var({t})` = {light} (light) / {dark} (dark)")

    # State tables
    def state_table(mode: str) -> str:
        rows = [
            "| Variant | State | Background | Border | Text / Icon | Other |",
            "|---|---|---|---|---|---|",
        ]

        if not design_states:
            rows.append("| *(all)* | Default | *(see Tokens section)* | | | |")
            return "\n".join(rows)

        size_keys = {"sm", "md", "lg", "xs", "xl"}

        for variant in sorted(design_states.keys()):
            if variant in size_keys:
                continue
            variant_states = design_states[variant]
            for state_name in sorted(variant_states.keys()):
                props = variant_states[state_name]
                bg = props.get("background", "")
                border = props.get("border", "")
                text = props.get("text", "")
                other_parts = []
                for role in ["shadow", "focus-ring", "opacity", "radius"]:
                    if role in props:
                        other_parts.append(f"{role}: {props[role]}")
                other = "; ".join(other_parts)

                def add_hex(token_str: str, m=mode) -> str:
                    if not token_str:
                        return ""
                    result = token_str
                    for t_match in re.findall(r'var\((--[\w-]+)\)', token_str):
                        vals = theme.get(t_match, {})
                        hex_val = vals.get(m, "")
                        if hex_val:
                            result = result.replace(f"`var({t_match})`", f"`var({t_match})` ({hex_val})")
                    return result

                bg = add_hex(bg)
                border = add_hex(border)
                text = add_hex(text)

                rows.append(f"| {variant} | {state_name} | {bg} | {border} | {text} | {other} |")

        return "\n".join(rows)

    # Build layout section
    layout_section = build_layout_section(slug, layout_cache)

    # Build interactions section
    interactions_section = build_interactions_section(slug, interaction_templates)

    # Assemble spec
    sections = [f"""<!-- auto:generated:start -->
<!-- ds:inherits root-spec -->
# {name} Design Spec

> Generated {now}. Component-specific override spec — inherits global tokens, baselines, and theming from root-spec.md.

<!-- ds:section id=metadata -->
## Metadata

| Property | Value |
|---|---|
| Component | {name} |
| Category | {category} |
| Figma Page | {page} |
| Node ID | {node_id} |
| Design System | Synapse |

<!-- ds:section id=anatomy -->
## Anatomy

The component is composed of these structural parts:

{chr(10).join(f'- **{part}**' for part in anatomy)}

Implementations must render these parts in order. Each part maps to a single DOM element (or equivalent in the target framework). Parts can be omitted if marked optional.
"""]

    # Layout section
    sections.append(layout_section)

    # Tokens section
    sections.append(f"""<!-- ds:section id=tokens -->
## Component Tokens

> Global tokens (colors, spacing, typography, elevation): see [root-spec.md](../root-spec.md).
> Below are tokens referenced by this component's CSS module.

{chr(10).join(token_lines)}

<!-- ds:section id=states-light -->
## States (Light Theme)

{state_table("light")}

<!-- ds:section id=states-dark -->
## States (Dark Theme)

{state_table("dark")}
""")

    # Interactions section (component-specific, or empty)
    if interactions_section:
        sections.append(interactions_section)

    # Source mapping
    sections.append("""## Source Mapping

| Source | Location |
|---|---|
| Root spec | `components/synapse/root-spec.md` |
| Figma variables | Extracted via `figma_get_local_variables` MCP tool |
| Theme CSS | `components/synapse-theme.css` |
| Component map | `data/synapse-component-figma-map.json` |
<!-- auto:generated:end -->
""")

    return "\n".join(sections)


# ---------------------------------------------------------------------------
# Registry rebuilder
# ---------------------------------------------------------------------------

def rebuild_registry(components: dict, theme: dict, figma_map: list, aliases: dict) -> dict:
    """Build a framework-agnostic registry from CSS analysis."""
    registry = {}

    for name, data in sorted(components.items()):
        slug = slugify(name)
        fig = resolve_figma_entry(slug, figma_map, aliases)

        variants = []
        sizes = []
        for v in sorted(data["states"].keys()):
            if v in ("sm", "md", "lg", "xs", "xl"):
                sizes.append(v)
            elif v != "default":
                variants.append(v)

        all_states = set()
        for variant_states in data["states"].values():
            for s in variant_states.keys():
                all_states.add(s)

        registry[slug] = {
            "name": name,
            "slug": slug,
            "category": fig.get("category", ""),
            "figmaPage": fig.get("page", ""),
            "nodeId": fig.get("nodeId", ""),
            "anatomy": data["anatomy"],
            "states": sorted(all_states),
            "variants": variants if variants else ["default"],
            "sizes": sizes if sizes else ["md"],
            "tokens": data["tokens"],
        }

    return registry


# ---------------------------------------------------------------------------
# Verification
# ---------------------------------------------------------------------------

BOILERPLATE_MARKERS = [
    "Touch targets must be at least 44x44px",
    "Minimum contrast ratio: 4.5:1 for normal text",
    "All interactive elements must have visible focus indicators",
    "Use semantic HTML elements appropriate to the component role",
    "Provide ARIA attributes where semantic HTML is insufficient",
    "Support screen reader announcements for state changes",
    "Ensure keyboard operability for all interactions",
    "This component supports Light and Dark themes via CSS custom properties",
    "Implementation must NOT use separate stylesheets per theme",
    "Typography tokens are fixed (no fluid type)",
]


def verify(theme: dict, config: dict, registry: dict) -> list:
    """Run automated verification checks. Returns list of issues."""
    issues = []

    # 1. Root spec exists and has required sections
    root_path = SPECS_DIR / "root-spec.md"
    if not root_path.exists():
        issues.append("FAIL: root-spec.md does not exist")
    else:
        root_text = root_path.read_text()
        for section in ["Color System", "Typography Scale", "Elevation System",
                        "Interaction Baseline", "Accessibility Baseline",
                        "Theming Mechanism", "Responsive Breakpoints"]:
            if section not in root_text:
                issues.append(f"FAIL: root-spec.md missing section: {section}")

    # 2. No component spec contains boilerplate
    for spec_dir in sorted(SPECS_DIR.iterdir()):
        spec_file = spec_dir / "design-spec.md"
        if not spec_dir.is_dir() or not spec_file.exists():
            continue
        text = spec_file.read_text()
        for marker in BOILERPLATE_MARKERS:
            if marker in text:
                issues.append(f"WARN: {spec_dir.name}/design-spec.md contains boilerplate: '{marker[:50]}...'")
                break

    # 3. Every component spec has inherits marker
    for spec_dir in sorted(SPECS_DIR.iterdir()):
        spec_file = spec_dir / "design-spec.md"
        if not spec_dir.is_dir() or not spec_file.exists():
            continue
        text = spec_file.read_text()
        if "<!-- ds:inherits root-spec -->" not in text:
            issues.append(f"FAIL: {spec_dir.name}/design-spec.md missing inherits marker")

    # 4. Framework layer in root spec matches config
    if root_path.exists():
        root_text = root_path.read_text()
        fw = config.get("framework_layer", "base-ui")
        if fw not in root_text:
            issues.append(f"FAIL: root-spec.md doesn't mention framework_layer '{fw}'")

    # 5. Registry has expected count
    if len(registry) < 40:
        issues.append(f"WARN: Registry only has {len(registry)} components (expected ~46)")

    return issues


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(description="Rebuild Synapse design specs")
    parser.add_argument("--verify", action="store_true", help="Run verification checks after generation")
    parser.add_argument("--root-only", action="store_true", help="Only regenerate root-spec.md")
    parser.add_argument("--component", help="Only regenerate a single component spec")
    args = parser.parse_args()

    theme = parse_theme(THEME_CSS)
    config = _load_config()
    figma_map = json.loads(FIGMA_MAP.read_text()) if FIGMA_MAP.exists() else []
    aliases = load_aliases(ALIASES)
    interaction_templates = json.loads(INTERACTIONS.read_text()) if INTERACTIONS.exists() else {}
    layout_cache = json.loads(LAYOUT_CACHE.read_text()) if LAYOUT_CACHE.exists() else {}

    # --- Generate root spec ---
    root_spec = build_root_spec(theme, config)
    root_path = SPECS_DIR / "root-spec.md"
    root_path.parent.mkdir(parents=True, exist_ok=True)
    root_path.write_text(root_spec)
    print(f"Root spec generated: {root_path}")

    if args.root_only:
        if args.verify:
            _run_verify(theme, config, {})
        return

    # --- Discover components ---
    components = {}
    for css_file in sorted(CSS_DIR.glob("*.module.css")):
        name = css_file.stem.replace(".module", "")
        tsx_file = CSS_DIR / f"{name}.tsx"
        if not tsx_file.exists():
            continue

        anatomy = extract_anatomy(css_file)
        tokens = extract_all_tokens(css_file)
        blocks = parse_css_states(css_file)
        design_states = extract_design_states(blocks, theme)

        components[name] = {
            "anatomy": anatomy,
            "tokens": tokens,
            "states": design_states,
        }

    print(f"Discovered {len(components)} components\n")

    # --- Rebuild registry ---
    registry = rebuild_registry(components, theme, figma_map, aliases)
    registry_path = PROJECT / "data" / "synapse-component-registry.json"
    with open(registry_path, "w") as f:
        json.dump(registry, f, indent=2)
    print(f"Registry rebuilt: {len(registry)} components -> {registry_path}")

    # --- Generate component specs ---
    specs_written = 0
    for name, data in sorted(components.items()):
        slug = slugify(name)

        if args.component and slug != slugify(args.component):
            continue

        fig = resolve_figma_entry(slug, figma_map, aliases)

        spec = build_component_spec(
            name=name,
            slug=slug,
            figma_entry=fig,
            anatomy=data["anatomy"],
            tokens=data["tokens"],
            theme=theme,
            design_states=data["states"],
            layout_cache=layout_cache,
            interaction_templates=interaction_templates,
        )

        spec_dir = SPECS_DIR / slug
        spec_dir.mkdir(parents=True, exist_ok=True)
        (spec_dir / "design-spec.md").write_text(spec)
        specs_written += 1

    print(f"Specs generated: {specs_written} -> {SPECS_DIR}/*/design-spec.md")

    # --- Summary ---
    total_tokens = sum(len(d["tokens"]) for d in components.values())
    total_states = sum(
        sum(len(vs) for vs in d["states"].values())
        for d in components.values()
    )
    print(f"\nTotal unique tokens referenced: {total_tokens}")
    print(f"Total state entries: {total_states}")

    # --- Verify ---
    if args.verify:
        _run_verify(theme, config, registry)


def _run_verify(theme: dict, config: dict, registry: dict):
    print("\n" + "=" * 60)
    print("VERIFICATION")
    print("=" * 60)
    issues = verify(theme, config, registry)
    if issues:
        for issue in issues:
            print(f"  {issue}")
        print(f"\n{len(issues)} issue(s) found.")
    else:
        print("  All checks passed.")


if __name__ == "__main__":
    main()

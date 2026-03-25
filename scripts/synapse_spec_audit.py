"""
Synapse Design Spec Audit Agent (Persistent Watcher)
=====================================================
Watches Storybook CSS modules, theme CSS, and design-spec.mdx files for changes.
On any change it re-audits affected components and auto-regenerates specs.

Modes:
    python scripts/synapse_spec_audit.py --watch        # persistent watcher (default port 8099 for status)
    python scripts/synapse_spec_audit.py --once         # single audit pass, no fix
    python scripts/synapse_spec_audit.py --once --fix   # single audit + generate missing specs
    python scripts/synapse_spec_audit.py --component button --fix

The audit pipeline:
1. Load Figma-truth tokens from synapse-theme.css
2. For each Synapse component:
   a. Parse component CSS module for token references
   b. Cross-reference against allowed tokens and theme CSS
   c. Detect hardcoded values that should be tokens
   d. Detect token names that don't exist in the theme
   e. Compare state table in design-spec.mdx against actual CSS usage
3. Output a gap report and optionally generate/update design-spec.mdx
"""

import json
import os
import re
import sys
import time
import hashlib
import threading
from http.server import HTTPServer, BaseHTTPRequestHandler
from pathlib import Path
from datetime import datetime, timezone

PROJECT = Path(__file__).resolve().parent.parent

# Import shared functions from rebuild_specs to avoid duplication
sys.path.insert(0, str(PROJECT / "scripts"))
from rebuild_specs import (
    slugify,
    parse_theme as _parse_theme_rebuild,
    build_component_spec,
    resolve_figma_entry,
    load_aliases,
    extract_all_tokens as _extract_all_tokens,
    extract_anatomy as _extract_anatomy,
    parse_css_states as _parse_css_states,
    extract_design_states as _extract_design_states,
)
STORYBOOK_COMPONENTS = PROJECT / "storybook" / "src" / "components"
SYNAPSE_SPECS = PROJECT / "components" / "synapse"
THEME_CSS = PROJECT / "storybook" / "src" / "synapse-theme.css"
THEME_CSS_CANONICAL = PROJECT / "components" / "synapse-theme.css"
ALLOWED_TOKENS = PROJECT / "data" / "synapse-allowed-tokens.json"
REGISTRY = PROJECT / "data" / "synapse-component-registry.json"
FIGMA_MAP = PROJECT / "data" / "synapse-component-figma-map.json"

STATUS_PORT = int(os.getenv("AUDIT_PORT", "8099"))
POLL_INTERVAL = float(os.getenv("AUDIT_POLL", "2.0"))  # seconds


# ---------------------------------------------------------------------------
# Shared audit state (thread-safe via GIL for reads; lock for writes)
# ---------------------------------------------------------------------------

class AuditState:
    def __init__(self):
        self.lock = threading.Lock()
        self.last_run = None
        self.component_results = {}  # name -> audit result dict
        self.total_issues = 0
        self.total_components = 0
        self.specs_regenerated = 0
        self.watch_running = False

    def update(self, results: list, specs_regenerated: int):
        with self.lock:
            self.last_run = datetime.now(timezone.utc).isoformat()
            self.component_results = {r["component"]: r for r in results}
            self.total_issues = sum(
                len(r["invalid_tokens"]) + len(r["hardcoded_values"])
                for r in results
            )
            self.total_components = len(results)
            self.specs_regenerated = specs_regenerated

    def to_json(self) -> str:
        with self.lock:
            issues_list = []
            for name, r in sorted(self.component_results.items()):
                for t in r.get("invalid_tokens", []):
                    issues_list.append({"component": name, "type": "invalid_token", "detail": t})
                for h in r.get("hardcoded_values", []):
                    issues_list.append({"component": name, "type": "hardcoded_value", "detail": f"line {h['line']}: {h['value']}"})

            return json.dumps({
                "status": "watching" if self.watch_running else "idle",
                "last_run": self.last_run,
                "total_components": self.total_components,
                "total_issues": self.total_issues,
                "specs_regenerated": self.specs_regenerated,
                "components": {
                    name: {
                        "css_exists": r["css_exists"],
                        "spec_exists": r["spec_exists"],
                        "token_count": len(r["token_refs"]),
                        "issue_count": len(r["invalid_tokens"]) + len(r["hardcoded_values"]),
                    }
                    for name, r in sorted(self.component_results.items())
                },
                "issues": issues_list,
            }, indent=2)


AUDIT = AuditState()


# ---------------------------------------------------------------------------
# Token extraction helpers
# ---------------------------------------------------------------------------

def parse_theme_tokens(css_path: Path) -> dict:
    """Parse synapse-theme.css into {var_name: {light: val, dark: val}}."""
    text = css_path.read_text()
    tokens = {}

    root_match = re.search(r':root\s*\{([^}]+(?:\{[^}]*\}[^}]*)*)\}', text, re.DOTALL)
    dark_match = re.search(r'\[data-theme="dark"\]\s*\{([^}]+)\}', text, re.DOTALL)

    if root_match:
        for m in re.finditer(r'(--[\w-]+)\s*:\s*([^;]+);', root_match.group(1)):
            tokens[m.group(1)] = {"light": m.group(2).strip(), "dark": None}

    if dark_match:
        for m in re.finditer(r'(--[\w-]+)\s*:\s*([^;]+);', dark_match.group(1)):
            name = m.group(1)
            if name in tokens:
                tokens[name]["dark"] = m.group(2).strip()
            else:
                tokens[name] = {"light": None, "dark": m.group(2).strip()}

    for vals in tokens.values():
        if vals["dark"] is None:
            vals["dark"] = vals["light"]

    return tokens


def extract_css_token_refs(css_path: Path) -> list:
    text = css_path.read_text()
    return re.findall(r'var\((--[\w-]+)\)', text)


def detect_hardcoded_colors(css_path: Path) -> list:
    text = css_path.read_text()
    issues = []
    for i, line in enumerate(text.splitlines(), 1):
        if line.strip().startswith('/*') or line.strip().startswith('*'):
            continue
        for m in re.finditer(r':\s*([^;]*#[0-9a-fA-F]{3,8})', line):
            if 'var(' not in m.group(1):
                issues.append({"line": i, "value": m.group(1).strip(), "type": "hardcoded_hex"})
        for m in re.finditer(r'rgba?\([^)]+\)', line):
            if 'var(' not in line[:m.start()]:
                issues.append({"line": i, "value": m.group(0), "type": "hardcoded_rgb"})
    return issues


def detect_invalid_tokens(refs: list, theme_tokens: dict) -> list:
    valid = set(theme_tokens.keys())
    # Framework runtime variables that aren't design tokens
    framework_vars = {"--anchor-width"}
    return [r for r in set(refs) if r not in valid and r not in framework_vars]


# ---------------------------------------------------------------------------
# Spec generation (delegates to rebuild_specs)
# ---------------------------------------------------------------------------

ALIASES_PATH = PROJECT / "data" / "synapse-component-aliases.json"
INTERACTIONS_PATH = PROJECT / "data" / "synapse-interaction-templates.json"
LAYOUT_CACHE_PATH = PROJECT / "data" / "synapse-figma-layout-cache.json"


def _generate_spec_for_audit(name: str, slug: str, fig_entry: dict,
                              theme_tokens: dict, css_path: Path) -> str:
    """Generate a design spec using the shared rebuild_specs pipeline."""
    anatomy = _extract_anatomy(css_path) if css_path.exists() else []
    tokens = _extract_all_tokens(css_path) if css_path.exists() else []
    blocks = _parse_css_states(css_path) if css_path.exists() else []
    design_states = _extract_design_states(blocks, theme_tokens) if blocks else {}
    interaction_templates = json.loads(INTERACTIONS_PATH.read_text()) if INTERACTIONS_PATH.exists() else {}
    layout_cache = json.loads(LAYOUT_CACHE_PATH.read_text()) if LAYOUT_CACHE_PATH.exists() else {}

    return build_component_spec(
        name=name,
        slug=slug,
        figma_entry=fig_entry,
        anatomy=anatomy,
        tokens=tokens,
        theme=theme_tokens,
        design_states=design_states,
        layout_cache=layout_cache,
        interaction_templates=interaction_templates,
    )


# ---------------------------------------------------------------------------
# Audit runner
# ---------------------------------------------------------------------------

def audit_component(name: str, theme_tokens: dict, registry: dict, figma_map: list) -> dict:
    slug = slugify(name)
    css_path = STORYBOOK_COMPONENTS / f"{name}.module.css"

    result = {
        "component": name,
        "slug": slug,
        "css_exists": css_path.exists(),
        "spec_exists": (SYNAPSE_SPECS / slug / "design-spec.mdx").exists(),
        "token_refs": [],
        "invalid_tokens": [],
        "hardcoded_values": [],
        "missing_spec": False,
    }

    if css_path.exists():
        refs = extract_css_token_refs(css_path)
        result["token_refs"] = sorted(set(refs))
        result["invalid_tokens"] = detect_invalid_tokens(refs, theme_tokens)
        result["hardcoded_values"] = detect_hardcoded_colors(css_path)

    if not result["spec_exists"]:
        result["missing_spec"] = True

    return result


def run_audit(component_filter: str = None, fix: bool = False, quiet: bool = False) -> list:
    """Run audit, return results list. Optionally fix missing specs."""
    theme_tokens = parse_theme_tokens(THEME_CSS)
    registry = json.loads(REGISTRY.read_text()) if REGISTRY.exists() else {}
    figma_map = json.loads(FIGMA_MAP.read_text()) if FIGMA_MAP.exists() else []

    components = []
    for f in sorted(STORYBOOK_COMPONENTS.glob("*.tsx")):
        if ".stories." in f.name:
            continue
        name = f.stem
        if component_filter and slugify(name) != slugify(component_filter):
            continue
        components.append(name)

    if not quiet:
        print(f"Auditing {len(components)} components...\n")

    results = []
    specs_generated = 0

    for name in components:
        result = audit_component(name, theme_tokens, registry, figma_map)
        results.append(result)
        slug = result["slug"]
        issues = len(result["invalid_tokens"]) + len(result["hardcoded_values"])

        if not quiet:
            status = "OK" if issues == 0 else f"{issues} issues"
            spec_status = "exists" if result["spec_exists"] else "MISSING"
            print(f"  {name:25s} css={result['css_exists']}  spec={spec_status:8s}  tokens={len(result['token_refs']):2d}  {status}")
            for t in result["invalid_tokens"]:
                print(f"    INVALID TOKEN: {t}")
            for h in result["hardcoded_values"][:5]:
                print(f"    HARDCODED: line {h['line']}: {h['value']}")

        # Generate/update spec when fix mode is on
        if fix and (result["missing_spec"] or _spec_stale(name, result)):
            aliases = load_aliases(ALIASES_PATH)
            fig_entry = resolve_figma_entry(slug, figma_map, aliases)
            css_path = STORYBOOK_COMPONENTS / f"{name}.module.css"
            spec_dir = SYNAPSE_SPECS / slug
            spec_dir.mkdir(parents=True, exist_ok=True)
            spec = _generate_spec_for_audit(name, slug, fig_entry, theme_tokens, css_path)
            (spec_dir / "design-spec.mdx").write_text(spec)
            result["spec_exists"] = True
            result["missing_spec"] = False
            specs_generated += 1
            if not quiet:
                print(f"    -> Generated design-spec.mdx")

    total_issues = sum(len(r["invalid_tokens"]) + len(r["hardcoded_values"]) for r in results)

    if not quiet:
        print(f"\n{'='*60}")
        print(f"Total components: {len(results)}")
        print(f"Total issues: {total_issues}")
        if fix:
            print(f"Specs generated/updated: {specs_generated}")

    AUDIT.update(results, specs_generated)
    return results


def _spec_stale(name: str, result: dict) -> bool:
    """Check if spec needs regeneration (CSS has tokens the spec doesn't list)."""
    slug = slugify(name)
    spec_path = SYNAPSE_SPECS / slug / "design-spec.mdx"
    if not spec_path.exists():
        return True
    spec_text = spec_path.read_text()
    for token in result["token_refs"]:
        if token not in spec_text:
            return True
    return False


# ---------------------------------------------------------------------------
# File change watcher (polling-based, no external deps)
# ---------------------------------------------------------------------------

def _hash_file(p: Path) -> str:
    if not p.exists():
        return ""
    return hashlib.md5(p.read_bytes()).hexdigest()


def _snapshot_watched_files() -> dict:
    """Return {path_str: md5} for all watched files."""
    snap = {}
    # CSS modules
    for f in STORYBOOK_COMPONENTS.glob("*.module.css"):
        snap[str(f)] = _hash_file(f)
    # TSX components (detect new/removed)
    for f in STORYBOOK_COMPONENTS.glob("*.tsx"):
        if ".stories." not in f.name:
            snap[str(f)] = _hash_file(f)
    # Theme CSS
    snap[str(THEME_CSS)] = _hash_file(THEME_CSS)
    if THEME_CSS_CANONICAL.exists():
        snap[str(THEME_CSS_CANONICAL)] = _hash_file(THEME_CSS_CANONICAL)
    # Data files
    for p in [ALLOWED_TOKENS, REGISTRY, FIGMA_MAP]:
        if p.exists():
            snap[str(p)] = _hash_file(p)
    return snap


def watch_loop():
    """Poll for changes and re-audit when files change."""
    AUDIT.watch_running = True
    print(f"[audit-agent] Watching for changes (poll every {POLL_INTERVAL}s)...")
    print(f"[audit-agent] Status endpoint: http://localhost:{STATUS_PORT}/status")
    print(f"[audit-agent] Press Ctrl+C to stop.\n")

    # Initial audit
    run_audit(fix=True, quiet=False)
    prev_snap = _snapshot_watched_files()

    while True:
        time.sleep(POLL_INTERVAL)
        curr_snap = _snapshot_watched_files()

        if curr_snap != prev_snap:
            # Find what changed
            changed = []
            for path in set(list(curr_snap.keys()) + list(prev_snap.keys())):
                if curr_snap.get(path) != prev_snap.get(path):
                    changed.append(Path(path).name)

            ts = datetime.now().strftime("%H:%M:%S")
            print(f"\n[{ts}] Change detected: {', '.join(changed[:5])}")
            run_audit(fix=True, quiet=False)
            prev_snap = curr_snap


# ---------------------------------------------------------------------------
# Status HTTP server
# ---------------------------------------------------------------------------

class StatusHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/status":
            body = AUDIT.to_json().encode()
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
        elif self.path == "/health":
            body = b'{"ok":true}'
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
        else:
            self.send_response(404)
            self.end_headers()

    def log_message(self, format, *args):
        pass  # suppress request logs


def start_status_server():
    server = HTTPServer(("0.0.0.0", STATUS_PORT), StatusHandler)
    t = threading.Thread(target=server.serve_forever, daemon=True)
    t.start()
    return server


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Synapse Design Spec Audit Agent")
    parser.add_argument("--watch", action="store_true", help="Persistent watch mode (default)")
    parser.add_argument("--once", action="store_true", help="Single audit pass then exit")
    parser.add_argument("--component", help="Audit single component by name")
    parser.add_argument("--fix", action="store_true", help="Generate/update missing or stale specs")
    parser.add_argument("--port", type=int, default=STATUS_PORT, help=f"Status server port (default {STATUS_PORT})")
    args = parser.parse_args()

    STATUS_PORT = args.port

    if args.once or args.component:
        run_audit(component_filter=args.component, fix=args.fix)
    else:
        # Default: persistent watch mode
        start_status_server()
        try:
            watch_loop()
        except KeyboardInterrupt:
            print("\n[audit-agent] Stopped.")

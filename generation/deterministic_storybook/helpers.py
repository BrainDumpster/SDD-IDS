from __future__ import annotations

import json
import re
from pathlib import Path


def pascal_from_slug(slug: str) -> str:
    parts = [p for p in slug.replace("_", "-").split("-") if p]
    return "".join(p[:1].upper() + p[1:] for p in parts)


def ids_component_export_name(component_slug: str) -> str:
    return f"Ids{pascal_from_slug(component_slug)}"


def prefixed_component_export_name(component_slug: str, prefix: str) -> str:
    raw_prefix = (prefix or "Ids").strip() or "Ids"
    prefix_parts = [p for p in raw_prefix.replace("_", "-").split("-") if p]
    safe_prefix = "".join(p[:1].upper() + p[1:] for p in prefix_parts) or "Ids"
    return f"{safe_prefix}{pascal_from_slug(component_slug)}"


def ts_array(items: list[str]) -> str:
    return "[" + ", ".join(json.dumps(item) for item in items) + "]"


# Canonical theme CSS for Spec Generated stories (root Storybook: IDS + DAP only).
THEME_CSS_BY_DESIGN_SYSTEM: dict[str, str] = {
    "ids": "components/ids-theme.css",
    "dap": "components/dap-theme.css",
    "powerflex": "components/powerflex-theme.css",
}


def theme_css_path_for_design_system(design_system_slug: str) -> str:
    slug = (design_system_slug or "ids").strip().lower()
    return THEME_CSS_BY_DESIGN_SYSTEM.get(slug, THEME_CSS_BY_DESIGN_SYSTEM["ids"])


def storybook_theme_import_line(design_system_slug: str) -> str:
    """Relative import from storybook-generated/<ds>/src/components/*.stories.tsx."""
    path = theme_css_path_for_design_system(design_system_slug)
    return f'import "../../../../{path}";'


_GENERATED_HEADER_RE = re.compile(
    r"^/\* @(?:generated)[^*]*\*/\s*\n?"
    r"(?:/\* component:[^*]*\*/\s*\n)?"
    r"(?:/\* spec_hash:[^*]*\*/\s*\n)?",
    re.MULTILINE,
)


def strip_generated_story_header(text: str) -> str:
    """Remove prior strict-spec-storybook-gate headers so the gate can rewrite them."""
    return _GENERATED_HEADER_RE.sub("", text.lstrip(), count=1)


def adapt_storybook_src_story(text: str) -> str:
    """
    Rewrite a hand story under `storybook/src/components/` so it can live under
    `storybook-generated/<ds>/src/components/` (deeper relative imports).
    """
    text = strip_generated_story_header(text)
    text = text.replace(
        'import "../../../components/',
        'import "../../../../components/',
    )
    text = text.replace(
        "import '../../../components/",
        "import '../../../../components/",
    )
    # Already-generated depth stays as-is when re-emitting.
    text = re.sub(
        r'from "\./([^"]+)"',
        r'from "../../../../storybook/src/components/\1"',
        text,
    )
    text = re.sub(
        r"from '\./([^']+)'",
        r"from '../../../../storybook/src/components/\1'",
        text,
    )
    text = text.replace(
        'from "../spec-contracts/',
        'from "../../../../storybook/src/spec-contracts/',
    )
    text = text.replace(
        "from '../spec-contracts/",
        "from '../../../../storybook/src/spec-contracts/",
    )
    return text.rstrip() + "\n"


def load_adapted_story(repo_root: Path, relative_source: str) -> str:
    """Load a story file and adapt imports for storybook-generated emission."""
    source = (repo_root / relative_source).resolve()
    if not source.is_file():
        raise FileNotFoundError(f"Story source not found: {relative_source}")
    text = source.read_text(encoding="utf-8")
    # Hand stories under storybook/src need deeper imports; generated seeds already match.
    if "storybook/src/" in source.as_posix():
        return adapt_storybook_src_story(text)
    return strip_generated_story_header(text).rstrip() + "\n"


def ensure_gate_coverage_comment(text: str, states: str) -> str:
    """Inject a gate state-coverage comment near the top if missing."""
    marker = f"/* Gate coverage: {states} */"
    if "Gate coverage:" in text:
        return text
    # Prefer after theme import.
    theme_import = re.search(
        r'^import\s+"[^"]*components/[^"]*theme\.css";\s*\n',
        text,
        re.MULTILINE,
    )
    if theme_import:
        i = theme_import.end()
        return text[:i] + marker + "\n" + text[i:]
    return marker + "\n" + text


def ensure_spec_accurate_export(
    text: str,
    *,
    from_export: str,
    story_name: str = "Spec Accurate Design",
) -> str:
    """Rename a primary story export to SpecAccurateDesign when missing."""
    if "export const SpecAccurateDesign" in text:
        return text
    pattern = rf"export const {re.escape(from_export)}: Story = \{{"
    replacement = (
        f'export const SpecAccurateDesign: Story = {{\n  name: "{story_name}",'
    )
    updated, count = re.subn(pattern, replacement, text, count=1)
    return updated if count else text

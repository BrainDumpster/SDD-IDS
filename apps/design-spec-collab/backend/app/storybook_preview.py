"""Resolve Storybook preview URLs for Collab (prefer Spec Accurate Design)."""

from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any

# Storybook CSF sanitize (approximate; prefer index.json when present)
_PUNCT = re.compile(r"[!#$%&()*+,./:;<=>?@\[\]^`{|}~'\"]+")
_MULTI_SPACE = re.compile(r"\s+")
_TITLE_RE = re.compile(
    r"""title\s*:\s*["']([^"']+)["']""",
    re.MULTILINE,
)
_META_TITLE_RE = re.compile(
    r"""(?:const\s+meta\b[^=]*=\s*\{[\s\S]*?|Meta\s*<[^>]*>\s*=\s*\{[\s\S]*?)"""
    r"""title\s*:\s*["']([^"']+)["']""",
    re.MULTILINE,
)
_SPEC_GENERATED_TITLE_RE = re.compile(
    r"""title\s*:\s*["'](Spec Generated/[^"']+)["']""",
    re.MULTILINE,
)
_SPEC_EXPORT_RE = re.compile(
    r"""export\s+const\s+SpecAccurateDesign\b"""
    r"""|name\s*:\s*["']Spec Accurate Design["']""",
    re.MULTILINE,
)
_STORY_EXPORT_RE = re.compile(
    r"""export\s+const\s+([A-Za-z][A-Za-z0-9_]*)\s*:\s*Story\b""",
    re.MULTILINE,
)

# Prefer Spec Accurate Design; then common primary exports in generated files
_FALLBACK_EXPORT_ORDER = (
    "SpecAccurateDesign",
    "Playground",
    "Default",
    "Primary",
)


def slug_to_pascal(slug: str) -> str:
    return "".join(p.capitalize() for p in slug.split("-") if p)


def storybook_programme_dir(programme: str) -> str:
    return programme.strip().lower()


def sanitize_storybook_segment(text: str) -> str:
    s = (text or "").lower()
    s = s.replace("\u2019", " ").replace("\u2013", " ").replace("\u2014", " ")
    s = _PUNCT.sub(" ", s)
    s = _MULTI_SPACE.sub("-", s.strip())
    s = re.sub(r"-+", "-", s).strip("-")
    return s


def story_id_from_title_and_name(title: str, story_name: str) -> str:
    parts = [sanitize_storybook_segment(p) for p in title.split("/") if p.strip()]
    kind_id = "-".join(p for p in parts if p)
    name_id = sanitize_storybook_segment(story_name)
    return f"{kind_id}--{name_id}"


def export_name_to_story_name(export_name: str) -> str:
    """CSF default display name from export (SpecAccurateDesign → Spec Accurate Design)."""
    if export_name == "SpecAccurateDesign":
        return "Spec Accurate Design"
    # Insert spaces before capitals: ChevronPositions → Chevron Positions
    spaced = re.sub(r"(?<!^)(?=[A-Z])", " ", export_name)
    return spaced.strip() or export_name


def resolve_stories_path(repo_root: Path, programme: str, slug: str) -> Path | None:
    prog = storybook_programme_dir(programme)
    pascal = slug_to_pascal(slug)
    candidates = [
        repo_root / "storybook-generated" / prog / "src" / "components" / f"{pascal}.stories.tsx",
        repo_root
        / "storybook-generated"
        / programme
        / "src"
        / "components"
        / f"{pascal}.stories.tsx",
    ]
    for path in candidates:
        if path.is_file():
            return path
    return None


def parse_meta_title(stories_path: Path) -> str | None:
    try:
        text = stories_path.read_text(encoding="utf-8")
    except OSError:
        return None
    # Prefer CSF meta title (avoid matching title fields in sample args/data)
    for pattern in (_META_TITLE_RE, _SPEC_GENERATED_TITLE_RE):
        m = pattern.search(text)
        if m:
            return m.group(1).strip()
    # Last resort: first title that looks like a Storybook kind path
    for m in _TITLE_RE.finditer(text):
        val = m.group(1).strip()
        if "/" in val and not val.startswith("http"):
            return val
    return None


def has_spec_accurate_design(stories_path: Path) -> bool:
    try:
        text = stories_path.read_text(encoding="utf-8")
    except OSError:
        return False
    return bool(_SPEC_EXPORT_RE.search(text))


def list_story_exports(stories_path: Path) -> list[str]:
    try:
        text = stories_path.read_text(encoding="utf-8")
    except OSError:
        return []
    return [m.group(1) for m in _STORY_EXPORT_RE.finditer(text)]


def pick_fallback_export(exports: list[str]) -> str | None:
    if not exports:
        return None
    for preferred in _FALLBACK_EXPORT_ORDER:
        if preferred in exports:
            return preferred
    return exports[0]


def load_story_index(static_dir: Path) -> dict[str, Any] | None:
    for name in ("index.json", "stories.json"):
        path = static_dir / name
        if not path.is_file():
            continue
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError):
            continue
        if isinstance(data, dict):
            return data
    return None


def _is_spec_accurate_entry(meta: dict[str, Any], sid: str) -> bool:
    entry_name = str(meta.get("name") or meta.get("story") or "")
    if entry_name == "Spec Accurate Design":
        return True
    if str(meta.get("exportName") or "") == "SpecAccurateDesign":
        return True
    return "spec-accurate-design" in str(sid).lower()


def find_story_in_index(
    index: dict[str, Any],
    *,
    title: str | None,
    programme: str,
    slug: str,
) -> tuple[str, str, bool] | None:
    """
    Return (storyId, storyName, isSpecAccurate) or None.
    Prefers Spec Accurate Design; otherwise Playground/Default/first story
    under the component's CSF title.
    """
    entries = index.get("entries") or index.get("stories") or {}
    if not isinstance(entries, dict):
        return None

    title_norm = (title or "").strip()
    slug_tok = sanitize_storybook_segment(slug)
    prog_tok = sanitize_storybook_segment(programme)
    slug_parts = [t for t in slug.split("-") if t]

    matched: list[tuple[int, str, str, str, bool]] = []
    # score, sid, name, exportName, is_spec

    for sid, meta in entries.items():
        if not isinstance(meta, dict):
            continue
        entry_type = str(meta.get("type") or "story").lower()
        if entry_type not in ("story", ""):
            continue
        entry_title = str(meta.get("title") or "")
        entry_name = str(meta.get("name") or meta.get("story") or "") or "Story"
        export_name = str(meta.get("exportName") or "")
        sid_l = str(sid).lower()
        is_spec = _is_spec_accurate_entry(meta, str(sid))

        score = 0
        if title_norm and entry_title == title_norm:
            score = 100
        elif title_norm and entry_title.lower() == title_norm.lower():
            score = 90
        else:
            # Id-token match: must include programme + all slug parts
            if prog_tok and prog_tok not in sid_l:
                continue
            if slug_parts and not all(p in sid_l for p in slug_parts):
                continue
            # Avoid matching longer sibling ids (e.g. accordion vs accordion-item)
            # when we have an exact title available elsewhere — weak score only
            score = 20
            if slug_tok and f"-{slug_tok}--" in f"-{sid_l}":
                score = 40

        if score <= 0:
            continue

        boost = 0
        if is_spec:
            boost = 1000
        elif entry_name == "Playground" or export_name == "Playground":
            boost = 50
        elif entry_name == "Default" or export_name == "Default":
            boost = 40

        matched.append((score + boost, str(sid), entry_name, export_name, is_spec))

    if not matched:
        return None

    # Prefer exact title matches over weak id matches
    exact = [m for m in matched if m[0] >= 90]
    pool = exact if exact else matched
    pool.sort(key=lambda x: (-x[0], x[1]))
    _sc, sid, name, _export, is_spec = pool[0]
    return sid, name, is_spec


def find_story_id_in_index(
    index: dict[str, Any],
    *,
    title: str | None,
    programme: str,
    slug: str,
) -> str | None:
    """Back-compat: Spec Accurate Design id only."""
    found = find_story_in_index(
        index, title=title, programme=programme, slug=slug
    )
    if found and found[2]:
        return found[0]
    return None


def resolve_storybook_static_dir(
    *,
    configured: Path | None,
    app_root: Path,
    repo_root: Path,
) -> Path | None:
    candidates: list[Path] = []
    if configured is not None:
        candidates.append(configured)
    candidates.extend(
        [
            app_root / "storybook-static",
            repo_root / "storybook-static",
            repo_root / "storybook" / "storybook-static",
        ]
    )
    for path in candidates:
        try:
            resolved = path.resolve()
        except OSError:
            continue
        if (resolved / "iframe.html").is_file():
            return resolved
    return None


def _rel_repo(path: Path, repo_root: Path) -> str:
    try:
        return str(path.resolve().relative_to(repo_root.resolve())).replace("\\", "/")
    except ValueError:
        return str(path).replace("\\", "/")


def build_preview_payload(
    *,
    programme: str,
    slug: str,
    repo_root: Path,
    static_dir: Path | None,
    theme: str | None = None,
    cache_bust: str | None = None,
) -> dict[str, Any]:
    programme = (programme or "").strip()
    slug = (slug or "").strip()
    if not programme or not slug:
        return {
            "available": False,
            "reason": "missing_params",
            "message": "programme and slug are required",
        }

    stories_path = resolve_stories_path(repo_root, programme, slug)
    if stories_path is None:
        return {
            "available": False,
            "reason": "no_generated_story",
            "message": (
                f"No generated Storybook file for {programme}/{slug} "
                "under storybook-generated/"
            ),
            "programme": programme,
            "slug": slug,
        }

    title = parse_meta_title(stories_path)
    is_spec = has_spec_accurate_design(stories_path)
    exports = list_story_exports(stories_path)
    stories_rel = _rel_repo(stories_path, repo_root)

    if static_dir is None:
        return {
            "available": False,
            "reason": "build_missing",
            "message": (
                "Storybook static build not found. Build with "
                "scripts/build_collab_storybook_static.sh or rebuild the Collab Docker image."
            ),
            "programme": programme,
            "slug": slug,
            "title": title,
            "storiesPath": stories_rel,
            "staticReady": False,
            "hasSpecAccurateDesign": is_spec,
        }

    index = load_story_index(static_dir)
    story_id: str | None = None
    story_name: str | None = None
    resolved_spec = False

    if index:
        found = find_story_in_index(
            index, title=title, programme=programme, slug=slug
        )
        if found:
            story_id, story_name, resolved_spec = found

    if not story_id and title:
        export = pick_fallback_export(exports)
        if export:
            story_name = export_name_to_story_name(export)
            story_id = story_id_from_title_and_name(title, story_name)
            resolved_spec = export == "SpecAccurateDesign"

    if not story_id:
        return {
            "available": False,
            "reason": "story_id_unresolved",
            "message": (
                f"Found {stories_rel} but could not resolve a preview story id"
            ),
            "programme": programme,
            "slug": slug,
            "title": title,
            "storiesPath": stories_rel,
            "staticReady": True,
            "hasSpecAccurateDesign": is_spec,
            "exports": exports,
        }

    theme_val = (theme or "light").strip().lower()
    if theme_val not in ("light", "dark"):
        theme_val = "light"

    qs = f"id={story_id}&viewMode=story&globals=theme:{theme_val}"
    if cache_bust:
        qs += f"&t={cache_bust}"

    iframe_url = f"/storybook/iframe.html?{qs}"
    note = None
    if not resolved_spec:
        note = (
            "No Spec Accurate Design export — previewing "
            f"“{story_name}” instead."
        )

    return {
        "available": True,
        "reason": None,
        "message": note,
        "programme": programme,
        "slug": slug,
        "title": title,
        "storyId": story_id,
        "storyName": story_name,
        "iframeUrl": iframe_url,
        "managerUrl": f"/storybook/?path=/story/{story_id}",
        "storiesPath": stories_rel,
        "theme": theme_val,
        "staticReady": True,
        "hasSpecAccurateDesign": resolved_spec,
    }

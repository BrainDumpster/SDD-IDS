"""List programmes/components from GitHub (or local repo fallback)."""

from __future__ import annotations

import base64
import json
import logging
import re
from pathlib import Path
from typing import Any

import httpx
import yaml

from .config import settings
from .github_publish import GithubRepo, github_configured, parse_github_repo

logger = logging.getLogger(__name__)

_SKIP_DIR_NAMES = {
    "joe-generated",
    "node_modules",
    "__pycache__",
    ".git",
}


def _headers() -> dict[str, str]:
    return {
        "Authorization": f"Bearer {settings.github_token}",
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "design-spec-collab",
    }


def _starting_ref() -> str:
    return (settings.github_starting_ref or "master").strip()


def _slugify(name: str) -> str:
    s = name.strip().lower()
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return s.strip("-") or "component"


def read_repo_file(path: str, *, ref: str | None = None) -> str | None:
    """Return UTF-8 text for a repo-relative path, or None if missing.

    Prefer local disk (fast). Fall back to GitHub Contents API when missing.
    """
    ref = ref or _starting_ref()
    local = settings.repo_root / path
    if local.is_file():
        try:
            return local.read_text(encoding="utf-8")
        except OSError:
            pass

    ok, _ = github_configured()
    repo = parse_github_repo()
    if ok and repo is not None:
        return _github_get_file(repo, path, ref=ref)
    return None


def file_exists_on_starting_ref(path: str, *, ref: str | None = None) -> bool:
    """True if ``path`` exists on the GitHub publish base (starting ref).

    Local-only / untracked files do **not** count — Collab must still create and
    publish programme foundation (theme CSS, root-spec, yaml) when they are
    absent from the remote base branch (see PR gaps like missing powerflex theme).
    Falls back to local disk only when GitHub is not configured.
    """
    norm = (path or "").replace("\\", "/").lstrip("./")
    if not norm:
        return False
    ref = ref or _starting_ref()
    ok, _ = github_configured()
    repo = parse_github_repo()
    if ok and repo is not None:
        return _github_get_file(repo, norm, ref=ref) is not None
    return (settings.repo_root / norm).is_file()


def _read_for_context(path: str, *, prefer_accepted: bool = False) -> str | None:
    """Read a context/baseline file; optionally prefer Review ``accepted_workspace``."""
    if prefer_accepted:
        overlay = settings.app_root / "data" / "accepted_workspace" / path
        if overlay.is_file():
            try:
                return overlay.read_text(encoding="utf-8")
            except OSError:
                pass
    return read_repo_file(path)


def _github_get_file(repo: GithubRepo, path: str, *, ref: str) -> str | None:
    encoded = "/".join(part for part in path.split("/") if part)
    url = f"{repo.api_base}/repos/{repo.full_name}/contents/{encoded}"
    try:
        with httpx.Client(timeout=45.0) as client:
            res = client.get(url, headers=_headers(), params={"ref": ref})
            if res.status_code == 404:
                return None
            res.raise_for_status()
            data = res.json()
            if not isinstance(data, dict):
                return None
            content = data.get("content")
            if not content:
                return None
            encoding = (data.get("encoding") or "base64").lower()
            raw = content.replace("\n", "")
            if encoding == "base64":
                return base64.b64decode(raw).decode("utf-8")
            return str(content)
    except Exception as exc:  # noqa: BLE001
        logger.warning("GitHub read failed for %s: %s", path, exc)
        return None


def _github_tree_paths(repo: GithubRepo, *, ref: str) -> list[str] | None:
    url = f"{repo.api_base}/repos/{repo.full_name}/git/trees/{ref}"
    try:
        with httpx.Client(timeout=90.0) as client:
            res = client.get(url, headers=_headers(), params={"recursive": "1"})
            if res.status_code == 404:
                # try resolve branch SHA then tree
                ref_url = f"{repo.api_base}/repos/{repo.full_name}/git/ref/heads/{ref}"
                r2 = client.get(ref_url, headers=_headers())
                r2.raise_for_status()
                sha = (r2.json().get("object") or {}).get("sha")
                if not sha:
                    return None
                res = client.get(
                    f"{repo.api_base}/repos/{repo.full_name}/git/trees/{sha}",
                    headers=_headers(),
                    params={"recursive": "1"},
                )
            res.raise_for_status()
            tree = res.json().get("tree") or []
            return [
                str(item["path"])
                for item in tree
                if isinstance(item, dict) and item.get("type") == "blob" and item.get("path")
            ]
    except Exception as exc:  # noqa: BLE001
        logger.warning("GitHub tree failed: %s", exc)
        return None


def _local_design_spec_paths() -> list[str]:
    root = settings.repo_root / "components"
    if not root.is_dir():
        return []
    out: list[str] = []
    for path in root.rglob("design-spec.md"):
        try:
            rel = path.relative_to(settings.repo_root).as_posix()
        except ValueError:
            continue
        out.append(rel)
    return out


def _all_design_spec_paths() -> tuple[list[str], str]:
    """Return (paths, source) where source is github|local.

    Prefer local repo tree when present (fast collab UX). Use GitHub when
    local has no specs or CATALOGUE_SOURCE=github.
    """
    import os

    prefer = (os.getenv("CATALOGUE_SOURCE") or "auto").strip().lower()
    local = _local_design_spec_paths()
    if prefer == "local" or (prefer == "auto" and local):
        return local, "local"

    ok, _ = github_configured()
    repo = parse_github_repo()
    if ok and repo is not None and prefer in ("github", "auto"):
        paths = _github_tree_paths(repo, ref=_starting_ref())
        if paths is not None:
            specs = [
                p
                for p in paths
                if p.startswith("components/")
                and p.endswith("/design-spec.md")
                and p.count("/") >= 3
            ]
            if specs:
                return specs, "github"
    return local, "local"


def _load_yaml_display(slug: str) -> str | None:
    text = read_repo_file(f"config/design_systems/{slug}.yaml")
    if not text:
        # case variants (DAP)
        for cand in (slug.lower(), slug.upper(), slug.capitalize()):
            text = read_repo_file(f"config/design_systems/{cand}.yaml")
            if text:
                break
    if not text:
        return None
    try:
        data = yaml.safe_load(text) or {}
    except Exception:  # noqa: BLE001
        return None
    if isinstance(data, dict) and data.get("display_name"):
        return str(data["display_name"])
    return None


def _components_dir_for_programme(programme: str) -> str:
    """Resolve components_dir from yaml or convention."""
    for cand in (programme, programme.lower(), programme.upper()):
        text = read_repo_file(f"config/design_systems/{cand}.yaml")
        if not text:
            continue
        try:
            data = yaml.safe_load(text) or {}
        except Exception:  # noqa: BLE001
            continue
        if isinstance(data, dict) and data.get("components_dir"):
            return str(data["components_dir"]).rstrip("/")
        if isinstance(data, dict) and data.get("name"):
            # Prefer folder that matches yaml name casing under components/
            name = str(data["name"])
            return f"components/{name}"
    # Prefer existing folder casing on disk
    root = settings.repo_root / "components"
    if root.is_dir():
        for child in root.iterdir():
            if child.is_dir() and child.name.lower() == programme.lower():
                return f"components/{child.name}"
    return f"components/{programme}"


def _figma_map_path_for_programme(programme: str) -> str:
    for cand in (programme, programme.lower(), programme.upper()):
        text = read_repo_file(f"config/design_systems/{cand}.yaml")
        if not text:
            continue
        try:
            data = yaml.safe_load(text) or {}
        except Exception:  # noqa: BLE001
            continue
        if isinstance(data, dict) and data.get("figma_map_path"):
            return str(data["figma_map_path"])
    slug = programme.lower()
    if slug in ("ids", "dap"):
        return "data/component-figma-map.json"
    return f"data/{slug}-component-figma-map.json"


def _load_map_entries(map_path: str, *, prefer_accepted: bool = False) -> list[dict[str, Any]]:
    """Load map rows from list-shaped or programme object-shaped Figma maps.

    List shape (IDS): ``[{ designSpecPath, figmaUrl, ... }, ...]``
    Object shape (programmes): ``{ programme, components: { slug: { ... } } }``
    """
    text = _read_for_context(map_path, prefer_accepted=prefer_accepted)
    if not text:
        return []
    try:
        data = json.loads(text)
    except json.JSONDecodeError:
        return []
    return _entries_from_map_json(data, map_path=map_path)


def _entries_from_map_json(
    data: Any, *, map_path: str = ""
) -> list[dict[str, Any]]:
    if isinstance(data, list):
        return [e for e in data if isinstance(e, dict)]
    if not isinstance(data, dict):
        return []

    comps = data.get("components")
    if isinstance(comps, dict):
        programme = str(data.get("programme") or "").strip().lower()
        if not programme and map_path:
            # data/<programme>-component-figma-map.json
            base = Path(map_path).name
            m = re.match(r"^([a-z0-9-]+)-component-figma-map\.json$", base, re.I)
            if m:
                programme = m.group(1).lower()
        file_key = str(data.get("figmaFileKey") or data.get("fileKey") or "").strip()
        out: list[dict[str, Any]] = []
        for slug, entry in comps.items():
            if not isinstance(entry, dict):
                continue
            row = dict(entry)
            slug_s = str(slug).strip()
            row.setdefault("slug", slug_s)
            row.setdefault(
                "component",
                row.get("displayName") or slug_s.replace("-", " ").title(),
            )
            if not row.get("fileKey") and file_key:
                row["fileKey"] = file_key
            if not row.get("designSpecPath") and programme and slug_s:
                row["designSpecPath"] = (
                    f"components/{programme}/{slug_s}/design-spec.md"
                )
            out.append(row)
        return out

    # Single-entry object with designSpecPath
    if data.get("designSpecPath") or data.get("figmaUrl"):
        return [data]
    return []


def _match_map_entry(
    entries: list[dict[str, Any]],
    *,
    programme: str,
    components_dir: str,
    slug: str,
    design_spec_path: str,
) -> dict[str, Any] | None:
    prog = programme.lower()
    by_path = [
        e
        for e in entries
        if isinstance(e, dict)
        and str(e.get("designSpecPath") or "").replace("\\", "/") == design_spec_path
    ]
    if prog == "dap":
        dap = [
            e
            for e in by_path
            if str(e.get("group") or "").upper() == "DAP"
            or str(e.get("designSpecPath") or "").startswith("components/DAP/")
        ]
        if dap:
            return dap[0]
    if by_path:
        return by_path[0]

    # Object-map rows often key by slug
    for e in entries:
        if not isinstance(e, dict):
            continue
        if str(e.get("slug") or "").lower() == slug.lower():
            return e

    for e in entries:
        if not isinstance(e, dict):
            continue
        name = str(e.get("component") or e.get("displayName") or "")
        if _slugify(name) != slug:
            continue
        path = str(e.get("designSpecPath") or "")
        if path and not path.startswith(components_dir + "/") and prog != "dap":
            # Prefer entries under this programme dir when path is set
            if prog == "ids" and "components/ids/" not in path:
                continue
        if prog == "dap":
            group = str(e.get("group") or "")
            if group.upper() != "DAP" and "components/DAP/" not in path:
                continue
        return e
    return None


def _has_storybook(programme: str, slug: str) -> bool:
    # PascalCase story name
    pascal = "".join(p.capitalize() for p in slug.split("-") if p)
    prog = programme.lower()
    # DAP folder is DAP but storybook dir is dap
    story_prog = "dap" if prog == "dap" else prog
    candidates = [
        f"storybook-generated/{story_prog}/src/components/{pascal}.stories.tsx",
        f"storybook-generated/{programme}/src/components/{pascal}.stories.tsx",
    ]
    for path in candidates:
        if read_repo_file(path) is not None:
            return True
        local = settings.repo_root / path
        if local.is_file():
            return True
    return False


def _has_dropdown_single_select(programme: str, components_dir: str) -> bool:
    path = f"{components_dir.rstrip('/')}/dropdown-single-select/design-spec.md"
    if read_repo_file(path) is not None:
        return True
    return (settings.repo_root / path).is_file()


def list_update_programmes() -> dict[str, Any]:
    specs, source = _all_design_spec_paths()
    by_prog: dict[str, int] = {}
    folder_case: dict[str, str] = {}
    for path in specs:
        parts = path.split("/")
        if len(parts) < 4:
            continue
        folder = parts[1]
        if folder in _SKIP_DIR_NAMES or folder.endswith(".css"):
            continue
        key = folder.lower()
        by_prog[key] = by_prog.get(key, 0) + 1
        folder_case.setdefault(key, folder)

    programmes: list[dict[str, Any]] = []
    for key, count in sorted(by_prog.items(), key=lambda x: x[0]):
        folder = folder_case[key]
        display = _load_yaml_display(folder) or _load_yaml_display(key) or folder
        components_dir = _components_dir_for_programme(folder)
        programmes.append(
            {
                "slug": key,
                "folder": folder,
                "displayName": display,
                "componentsDir": components_dir,
                "componentCount": count,
                "figmaMapPath": _figma_map_path_for_programme(folder),
                "hasDropdownSingleSelect": _has_dropdown_single_select(
                    key, components_dir
                ),
                "themeCssPath": _theme_css_for(key, folder),
            }
        )
    return {
        "programmes": programmes,
        "source": source,
        "ref": _starting_ref() if source == "github" else "local",
    }


def _theme_css_for(slug: str, folder: str) -> str:
    for cand in (folder, slug, slug.lower()):
        text = read_repo_file(f"config/design_systems/{cand}.yaml")
        if not text:
            continue
        try:
            data = yaml.safe_load(text) or {}
        except Exception:  # noqa: BLE001
            continue
        if isinstance(data, dict) and data.get("theme_css_path"):
            return str(data["theme_css_path"])
    if slug.lower() == "dap":
        return "components/dap-theme.css"
    if slug.lower() == "synapse":
        return "components/synapse-theme.css"
    return "components/ids-theme.css"


def list_update_components(programme: str) -> dict[str, Any]:
    prog_key = programme.strip()
    if not prog_key:
        raise ValueError("programme is required")

    specs, source = _all_design_spec_paths()
    components_dir = _components_dir_for_programme(prog_key)
    map_path = _figma_map_path_for_programme(prog_key)
    entries = _load_map_entries(map_path)

    # Normalize programme folder match
    prefix = components_dir.rstrip("/") + "/"
    alt_prefixes = {prefix}
    # also accept lower/upper folder names
    parts = components_dir.split("/")
    if len(parts) == 2:
        alt_prefixes.add(f"components/{parts[1].lower()}/")
        alt_prefixes.add(f"components/{parts[1].upper()}/")
        alt_prefixes.add(f"components/{parts[1]}/")

    components: list[dict[str, Any]] = []
    seen: set[str] = set()
    for path in specs:
        if not any(path.startswith(p) for p in alt_prefixes):
            continue
        # components/<prog>/<slug>/design-spec.md
        bits = path.split("/")
        if len(bits) < 4 or bits[-1] != "design-spec.md":
            continue
        slug = bits[-2]
        if slug in _SKIP_DIR_NAMES or slug in seen:
            continue
        seen.add(slug)
        entry = _match_map_entry(
            entries,
            programme=prog_key,
            components_dir=components_dir,
            slug=slug,
            design_spec_path=path,
        )
        display = (
            str(entry.get("component") or entry.get("displayName") or slug)
            if entry
            else slug.replace("-", " ").title()
        )
        figma_url = str(entry.get("figmaUrl") or "") if entry else ""
        node_id = str(entry.get("nodeId") or entry.get("mainComponentSetNodeId") or "") if entry else ""
        file_key = str(entry.get("fileKey") or "") if entry else ""
        spec_pattern = str(entry.get("specPattern") or "") if entry else ""
        components.append(
            {
                "slug": slug,
                "displayName": display,
                "designSpecPath": path,
                "figmaUrl": figma_url or None,
                "nodeId": node_id or None,
                "fileKey": file_key or None,
                "mapPath": map_path,
                "specPattern": spec_pattern or None,
                "hasStorybook": _has_storybook(prog_key, slug),
                "mapEntryFound": entry is not None,
            }
        )

    components.sort(key=lambda c: str(c["displayName"]).lower())
    return {
        "programme": prog_key.lower(),
        "componentsDir": components_dir,
        "figmaMapPath": map_path,
        "components": components,
        "source": source,
        "ref": _starting_ref() if source == "github" else "local",
        "hasDropdownSingleSelect": _has_dropdown_single_select(
            prog_key.lower(), components_dir
        ),
        "themeCssPath": _theme_css_for(prog_key.lower(), prog_key),
        "dropdownThemeProgramme": (
            prog_key.lower()
            if _has_dropdown_single_select(prog_key.lower(), components_dir)
            else "ids"
        ),
    }


def _pack_item(
    name: str,
    content: str,
    *,
    role: str = "context",
    read_only: bool = True,
) -> dict[str, Any]:
    return {
        "name": name,
        "content": content,
        "role": role,
        "readOnly": read_only,
    }


def _append_map_slice(
    arts: list[dict[str, Any]],
    *,
    figma_map_path: str,
    design_spec_path: str,
    prefer_accepted: bool = False,
) -> None:
    if not figma_map_path:
        return
    map_text = _read_for_context(figma_map_path, prefer_accepted=prefer_accepted)
    if map_text is None:
        return
    try:
        data = json.loads(map_text)
        entries = _entries_from_map_json(data, map_path=figma_map_path)
        if entries and design_spec_path:
            matched = [
                e
                for e in entries
                if isinstance(e, dict)
                and str(e.get("designSpecPath") or "").replace("\\", "/")
                == design_spec_path.replace("\\", "/")
            ]
            if not matched:
                # try slug from path
                bits = design_spec_path.replace("\\", "/").split("/")
                slug = bits[-2] if len(bits) >= 2 else ""
                matched = [
                    e
                    for e in entries
                    if isinstance(e, dict)
                    and str(e.get("slug") or "").lower() == slug.lower()
                ]
            if matched:
                arts.append(
                    _pack_item(
                        f"{figma_map_path}#entry",
                        json.dumps(matched[0], indent=2) + "\n",
                    )
                )
                return
        arts.append(_pack_item(figma_map_path, map_text))
    except json.JSONDecodeError:
        arts.append(_pack_item(figma_map_path, map_text))


def _authoring_contract_excerpt(limit: int = 6000) -> str | None:
    text = read_repo_file("docs/design-spec-authoring-contract.md")
    if text is None:
        return None
    if len(text) <= limit:
        return text
    return text[:limit] + "\n\n…(truncated for session payload; full contract is on the server)\n"


def load_context_pack(
    preview: dict[str, Any],
    *,
    job_kind: str = "create",
) -> list[dict[str, Any]]:
    """
    Read-only supporting files for the client LLM (no local filesystem needed).

    Always packages theme / root-spec / programme yaml / map / contract excerpt when
    found. On update, also packages existing design-spec + Storybook baselines.
    When programme foundation is missing, packages IDS donor templates under
    `donor:` names so the client can author without disk search.
    """
    arts: list[dict[str, Any]] = []
    seen: set[str] = set()

    def add(item: dict[str, Any]) -> None:
        name = str(item.get("name") or "")
        if not name or name in seen:
            return
        seen.add(name)
        arts.append(item)

    programme = str(preview.get("programme") or "ids").lower()
    slug = str(preview.get("slug") or "")
    design_spec_path = str(
        preview.get("design_spec_path")
        or preview.get("designSpecPath")
        or ""
    ).replace("\\", "/")
    figma_map_path = str(
        preview.get("figma_map_path") or preview.get("figmaMapPath") or ""
    ).replace("\\", "/")

    theme_path = str(
        preview.get("theme_css_path")
        or preview.get("themeCssPath")
        or f"components/{programme}-theme.css"
    ).replace("\\", "/")
    root_path = str(
        preview.get("root_spec_path")
        or preview.get("rootSpecPath")
        or f"components/{programme}/root-spec.md"
    ).replace("\\", "/")
    yaml_path = f"config/design_systems/{programme}.yaml"
    donor_theme = str(
        preview.get("donor_theme_css_path")
        or preview.get("donorThemeCssPath")
        or "components/ids-theme.css"
    ).replace("\\", "/")
    donor_root = str(
        preview.get("donor_root_spec_path")
        or preview.get("donorRootSpecPath")
        or "components/ids/root-spec.md"
    ).replace("\\", "/")

    existing_paths: list[str] = []

    theme_text = read_repo_file(theme_path)
    theme_on_base = file_exists_on_starting_ref(theme_path)
    if theme_text is not None:
        add(_pack_item(theme_path, theme_text))
        # Only skip client create/publish when the file is already on the PR base.
        if theme_on_base:
            existing_paths.append(theme_path)
    else:
        donor = read_repo_file(donor_theme)
        if donor is not None:
            add(_pack_item(f"donor:{donor_theme}", donor))

    root_text = read_repo_file(root_path)
    root_on_base = file_exists_on_starting_ref(root_path)
    if root_text is not None:
        add(_pack_item(root_path, root_text))
        if root_on_base:
            existing_paths.append(root_path)
    else:
        donor = read_repo_file(donor_root)
        if donor is not None:
            add(_pack_item(f"donor:{donor_root}", donor))

    yaml_text = read_repo_file(yaml_path)
    yaml_on_base = file_exists_on_starting_ref(yaml_path)
    if yaml_text is not None:
        add(_pack_item(yaml_path, yaml_text))
        if yaml_on_base:
            existing_paths.append(yaml_path)
    elif programme != "ids":
        ids_yaml = read_repo_file("config/design_systems/ids.yaml")
        if ids_yaml is not None:
            add(_pack_item("donor:config/design_systems/ids.yaml", ids_yaml))

    _append_map_slice(
        arts,
        figma_map_path=figma_map_path,
        design_spec_path=design_spec_path,
        prefer_accepted=job_kind == "review_revise",
    )
    for a in arts:
        n = str(a.get("name") or "")
        if n:
            seen.add(n)

    registry = read_repo_file("data/programme-inheritance-registry.json")
    if registry is not None:
        add(_pack_item("data/programme-inheritance-registry.json", registry))

    excerpt = _authoring_contract_excerpt()
    if excerpt:
        add(
            _pack_item(
                "docs/design-spec-authoring-contract.md#excerpt",
                excerpt,
            )
        )

    # Update / Review-revise baselines (also tagged baseline for change-hints)
    if job_kind in ("update", "review_revise") and design_spec_path:
        spec = _read_for_context(design_spec_path, prefer_accepted=job_kind == "review_revise")
        if spec is not None:
            add(
                {
                    "name": design_spec_path,
                    "content": spec,
                    "role": "baseline",
                    "readOnly": True,
                }
            )

    include_storybook = bool(
        preview.get("storybook_examples")
        or preview.get("storybookExamples")
        or preview.get("has_storybook")
    )
    pascal = "".join(p.capitalize() for p in slug.split("-") if p) if slug else ""
    story_prog = "dap" if programme == "dap" else programme
    existing_runtime_component: str | None = None
    existing_runtime_css: str | None = None
    existing_stories_path: str | None = None
    existing_generator_path: str | None = None

    # Always discover runtime component / stories when we know the slug (IDE parity:
    # check existing before authoring design-spec + Storybook).
    if slug and pascal:
        runtime_candidates = [
            f"storybook/src/components/{pascal}.tsx",
            f"storybook/src/components/{pascal}.ts",
            f"storybook/src/components/{pascal}.module.css",
            f"storybook/src/components/{pascal.lower()}.tsx",  # rare
        ]
        for rel in runtime_candidates:
            text = _read_for_context(
                rel, prefer_accepted=job_kind == "review_revise"
            )
            if text is None:
                continue
            role = "baseline" if job_kind in ("update", "review_revise") else "reference"
            add(
                {
                    "name": rel,
                    "content": text,
                    "role": role,
                    "readOnly": True,
                }
            )
            if file_exists_on_starting_ref(rel):
                existing_paths.append(rel)
            if rel.endswith(".module.css") and existing_runtime_css is None:
                existing_runtime_css = rel
            elif rel.endswith((".tsx", ".ts")) and existing_runtime_component is None:
                existing_runtime_component = rel

        stories_rel = (
            f"storybook-generated/{story_prog}/src/components/{pascal}.stories.tsx"
        )
        stories_text = _read_for_context(
            stories_rel, prefer_accepted=job_kind == "review_revise"
        )
        if stories_text is not None:
            role = "baseline" if job_kind in ("update", "review_revise") else "reference"
            add(
                {
                    "name": stories_rel,
                    "content": stories_text,
                    "role": role,
                    "readOnly": True,
                }
            )
            existing_stories_path = stories_rel
            if file_exists_on_starting_ref(stories_rel):
                existing_paths.append(stories_rel)

        underscored = slug.replace("-", "_")
        gen_rel = (
            f"generation/deterministic_storybook/{story_prog}/{underscored}.py"
        )
        gen_text = _read_for_context(gen_rel, prefer_accepted=False)
        if gen_text is not None:
            add(
                {
                    "name": gen_rel,
                    "content": gen_text,
                    "role": "reference",
                    "readOnly": True,
                }
            )
            existing_generator_path = gen_rel
            if file_exists_on_starting_ref(gen_rel):
                existing_paths.append(gen_rel)

    if job_kind in ("update", "review_revise") and include_storybook and slug and pascal:
        for rel in (
            f"storybook-generated/{story_prog}/src/spec-contracts/{slug}.spec-layer-hash.json",
            "storybook/.storybook/main.ts",
        ):
            text = _read_for_context(rel, prefer_accepted=job_kind == "review_revise")
            if text is not None:
                add(
                    {
                        "name": rel,
                        "content": text,
                        "role": "baseline",
                        "readOnly": True,
                    }
                )

    # Stash for runner / foundation_paths (not an artifact)
    arts.append(
        {
            "name": "__context_pack_meta__",
            "content": json.dumps(
                {
                    "existing_paths": existing_paths,
                    "existing_runtime_component": existing_runtime_component,
                    "existing_runtime_css": existing_runtime_css,
                    "existing_stories_path": existing_stories_path,
                    "existing_generator_path": existing_generator_path,
                }
            ),
            "role": "meta",
            "readOnly": True,
        }
    )
    return arts


def load_baselines_for_update(
    *,
    design_spec_path: str,
    figma_map_path: str,
    programme: str,
    slug: str,
    include_storybook: bool,
) -> list[dict[str, str]]:
    """Backward-compatible wrapper — prefer load_context_pack."""
    preview = {
        "design_spec_path": design_spec_path,
        "figma_map_path": figma_map_path,
        "programme": programme,
        "slug": slug,
        "storybook_examples": include_storybook,
    }
    packed = load_context_pack(preview, job_kind="update")
    return [
        {"name": str(a["name"]), "content": str(a["content"])}
        for a in packed
        if a.get("role") != "meta"
    ]

"""Rule-based (and optional Ollama) review of client artifacts."""

from __future__ import annotations

import logging
import re
from typing import Any

from .config import settings
from .session_models import Artifact, CollabSession, ReviewVerdict

logger = logging.getLogger(__name__)

REQUIRED_HEADINGS = [
    "Metadata",
    "Layout & Measurements",
    "Tokens",
    "States (Light Theme)",
    "States (Dark Theme)",
    "Interactions",
    "Composition & API (runtime)",
    "Codegen Contract (Framework-Agnostic Blueprint)",
    "Source Mapping",
]


def _slug_to_pascal(slug: str) -> str:
    return "".join(part.capitalize() for part in str(slug or "Component").split("-") if part)


def storybook_requested(preview: dict[str, Any] | None) -> bool:
    p = preview or {}
    return bool(p.get("storybook_examples") or p.get("storybookExamples"))


def runtime_component_pascal(preview: dict[str, Any] | None) -> str:
    p = preview or {}
    slug = str(p.get("slug") or "component")
    return _slug_to_pascal(slug)


def expected_runtime_component_paths(preview: dict[str, Any] | None) -> list[str]:
    """IDE-parity runtime module paths (component + CSS module)."""
    p = preview or {}
    if not storybook_requested(p):
        return []
    pascal = runtime_component_pascal(p)
    return [
        f"storybook/src/components/{pascal}.tsx",
        f"storybook/src/components/{pascal}.module.css",
    ]


def expected_storybook_paths(preview: dict[str, Any] | None) -> list[str]:
    """Canonical Storybook deliverables when storybookExamples is enabled.

    Required artifact *contents* (client submits via session API — no local repo):
    - Spec Accurate Design CSF under ``storybook-generated/…``
    - Runtime component + CSS module under ``storybook/src/components/``

    Discovery uses the glob in ``storybook/.storybook/main.ts``; clients do not
    need to submit ``main.ts`` for new programmes. Clients never run the
    deterministic Storybook gate (no monorepo checkout on the client).
    """
    p = preview or {}
    if not storybook_requested(p):
        return []
    programme = str(p.get("programme") or "ids")
    pascal = runtime_component_pascal(p)
    return [
        f"storybook-generated/{programme}/src/components/{pascal}.stories.tsx",
        *expected_runtime_component_paths(p),
    ]


def _existing_path_set(preview: dict[str, Any] | None) -> set[str]:
    p = preview or {}
    return {
        str(x).replace("\\", "/").lstrip("./")
        for x in (p.get("context_pack_existing_paths") or [])
        if x
    }


def _find_artifact_content(artifacts: list[Artifact], path: str) -> str | None:
    norm = path.replace("\\", "/").lstrip("./")
    base = norm.rsplit("/", 1)[-1]
    for a in artifacts:
        name = (a.name or "").replace("\\", "/").lstrip("./")
        if name == norm or name.endswith("/" + base) or name == base:
            return a.content or ""
    return None


def _find_design_spec_artifact(artifacts: list[Artifact]) -> Artifact | None:
    for a in artifacts:
        name = (a.name or "").lower()
        if name.endswith("design-spec.md") or name == "outline.md" or "design-spec" in name:
            return a
    for a in artifacts:
        if (a.name or "").endswith(".md"):
            return a
    return None


def _find_design_spec(artifacts: list[Artifact]) -> str | None:
    art = _find_design_spec_artifact(artifacts)
    return art.content if art else None


def extract_design_spec_payload(session: CollabSession) -> dict[str, Any] | None:
    """Return {path, name, content, turn} for operator preview when client submitted a spec."""
    art = _find_design_spec_artifact(session.artifacts)
    if not art or not (art.content or "").strip():
        return None
    preview = session.preview or {}
    path = preview.get("design_spec_path") or preview.get("designSpecPath") or art.name
    return {
        "path": str(path),
        "name": art.name,
        "content": art.content,
        "turn": session.turn,
        "charCount": len(art.content),
    }


def _missing_sections(content: str) -> list[str]:
    missing = []
    for h in REQUIRED_HEADINGS:
        pattern = rf"^##\s+{re.escape(h)}\s*$"
        if not re.search(pattern, content, flags=re.MULTILINE):
            missing.append(h)
    return missing


def _artifact_names(artifacts: list[Artifact]) -> list[str]:
    return [(a.name or "").replace("\\", "/").lstrip("./") for a in artifacts if a.name]


def _has_storybook_stories(artifacts: list[Artifact], preview: dict[str, Any]) -> bool:
    programme = str(preview.get("programme") or "")
    names = _artifact_names(artifacts)
    for name in names:
        lower = name.lower()
        if not lower.endswith(".stories.tsx") and not lower.endswith(".stories.ts"):
            continue
        if "storybook-generated" in lower:
            if programme and f"storybook-generated/{programme}/" in lower:
                return True
            if not programme:
                return True
        if "/" not in name:
            return True
    return False


def _find_storybook_stories_content(
    artifacts: list[Artifact], preview: dict[str, Any]
) -> str | None:
    programme = str(preview.get("programme") or "")
    for a in artifacts:
        name = (a.name or "").replace("\\", "/").lstrip("./").lower()
        if not name.endswith(".stories.tsx") and not name.endswith(".stories.ts"):
            continue
        if programme and f"storybook-generated/{programme}/" not in name:
            if "storybook-generated/" in name:
                continue
        return a.content or ""
    return None


def _missing_storybook_criteria(
    artifacts: list[Artifact], preview: dict[str, Any]
) -> list[str]:
    if not storybook_requested(preview):
        return []
    missing: list[str] = []
    existing = _existing_path_set(preview)
    pascal = runtime_component_pascal(preview)
    stories_path = expected_storybook_paths(preview)[0]
    comp_tsx = f"storybook/src/components/{pascal}.tsx"
    comp_css = f"storybook/src/components/{pascal}.module.css"

    if not _has_storybook_stories(artifacts, preview):
        missing.append(
            "storybook stories missing — submit "
            f"`{stories_path}`"
        )

    # Runtime component + CSS (IDE parity). Skip create requirement when already
    # on the publish starting ref and packaged as context — unless client submits
    # a stories-only mock that does not import it.
    has_comp = _has_artifact_path(artifacts, comp_tsx) or any(
        n.endswith(f"/{pascal}.tsx") or n.endswith(f"/{pascal}.ts")
        for n in _artifact_names(artifacts)
    )
    has_css = _has_artifact_path(artifacts, comp_css)
    if not has_comp and comp_tsx not in existing:
        # Also accept .ts extension already on base
        ts_alt = f"storybook/src/components/{pascal}.ts"
        if ts_alt not in existing:
            missing.append(
                f"runtime component missing — submit `{comp_tsx}` "
                "(real controls / DS primitives; not a stories-only div mock)"
            )
    if not has_css and comp_css not in existing:
        missing.append(
            f"CSS module missing — submit `{comp_css}` "
            "(tokenized styles; do not put component chrome only in inline style={{}})"
        )

    stories = _find_storybook_stories_content(artifacts, preview)
    if stories is not None:
        programme = str(preview.get("programme") or "ids")
        has_title = bool(re.search(r"title\s*:", stories))
        title_ok = bool(
            re.search(r"Spec Generated", stories, flags=re.IGNORECASE)
        ) or bool(
            re.search(
                rf'title\s*:\s*[\'"][^\'"]*{re.escape(programme)}',
                stories,
                flags=re.IGNORECASE,
            )
        )
        if has_title and not title_ok:
            missing.append(
                "Storybook title should include Spec Generated and/or the programme name"
            )
        theme_ok = (
            "ids-theme" in stories
            or "synapse-theme" in stories
            or "dap-theme" in stories
            or "powerflex-theme" in stories
            or "theme.css" in stories
            or bool(re.search(r"import\s+['\"].*theme", stories, flags=re.IGNORECASE))
        )
        if not theme_ok:
            missing.append(
                "Storybook stories should import programme theme CSS "
                "(e.g. `../../../../components/ids-theme.css` — relative from "
                "storybook-generated/<programme>/src/components/)"
            )
        # Bare `components/foo-theme.css` breaks Vite unless an alias exists.
        if re.search(
            r"""import\s+['"]components/[^'"]+-theme\.css['"]""",
            stories,
        ):
            missing.append(
                "Theme CSS import must be relative "
                "(use `import \"../../../../components/<programme>-theme.css\"`, "
                "not bare `components/…`)"
            )

        imports_runtime = bool(
            re.search(
                rf"""from\s+['"][^'"]*storybook/src/components/{re.escape(pascal)}['"]""",
                stories,
            )
        ) or bool(
            re.search(
                rf"""from\s+['"][^'"]*storybook/src/components/{re.escape(pascal)}\.(tsx?|jsx?)['"]""",
                stories,
            )
        ) or bool(
            re.search(
                rf"""from\s+['"](?:\.\./)+storybook/src/components/{re.escape(pascal)}['"]""",
                stories,
            )
        )
        if not imports_runtime:
            missing.append(
                f"Stories must import the runtime `{pascal}` component from "
                f"`storybook/src/components/{pascal}` — do not redefine the component "
                "inline inside the CSF file"
            )
        # Detect stories-only div/span mocks (common Collab regression).
        inline_mock = bool(
            re.search(
                rf"""function\s+{re.escape(pascal)}\s*\([^)]*\)\s*\{{""",
                stories,
            )
        ) and bool(re.search(r"style=\{\{", stories))
        if inline_mock and not imports_runtime:
            missing.append(
                "Stories define an inline styled mock component — replace with a real "
                f"`storybook/src/components/{pascal}.tsx` + `.module.css` and import it"
            )

        if not re.search(r"SpecAccurateDesign|Spec Accurate Design", stories):
            missing.append(
                "Primary story **Spec Accurate Design** "
                "(`export const SpecAccurateDesign`) is required"
            )

        # Fidelity to submitted design-spec (no invented markup)
        spec = _find_design_spec_content(artifacts, preview) or ""
        if re.search(r"(?i)TextBoxInput|`input`|single-line\s*`?<input>", spec):
            # Prefer check in component module when present
            comp_src = (
                _find_artifact_content(artifacts, comp_tsx)
                or _find_artifact_content(artifacts, f"storybook/src/components/{pascal}.ts")
                or ""
            )
            hay = f"{stories}\n{comp_src}"
            if not re.search(r"<\s*input\b", hay, flags=re.IGNORECASE):
                missing.append(
                    "design-spec documents an input control — runtime component must render "
                    "`<input>` (not a `<div>` stand-in)"
                )
        if re.search(r"(?i)TextBoxTextArea|`textarea`", spec):
            comp_src = (
                _find_artifact_content(artifacts, comp_tsx)
                or _find_artifact_content(artifacts, f"storybook/src/components/{pascal}.ts")
                or ""
            )
            hay = f"{stories}\n{comp_src}"
            if not re.search(r"<\s*textarea\b", hay, flags=re.IGNORECASE):
                missing.append(
                    "design-spec documents a textarea — runtime component must render "
                    "`<textarea>` where that anatomy applies"
                )
        if re.search(r"var\(--", spec):
            css_src = _find_artifact_content(artifacts, comp_css) or ""
            hay = f"{stories}\n{css_src}\n{_find_artifact_content(artifacts, comp_tsx) or ''}"
            if not re.search(r"var\(--", hay):
                missing.append(
                    "design-spec uses `var(--…)` tokens — component CSS / styles should use "
                    "the same semantic tokens from the spec"
                )
    return missing


def _find_design_spec_content(
    artifacts: list[Artifact], preview: dict[str, Any]
) -> str | None:
    expected = str(
        preview.get("design_spec_path") or preview.get("designSpecPath") or ""
    ).replace("\\", "/")
    for a in artifacts:
        name = (a.name or "").replace("\\", "/").lstrip("./")
        if not name:
            continue
        if expected and (
            name == expected or name.endswith(expected.rsplit("/", 1)[-1])
        ):
            return a.content or ""
        if name.endswith("design-spec.md"):
            return a.content or ""
    return None


def _missing_fidelity_criteria(content: str) -> list[str]:
    """Hard gates for collab fidelity (geometry + source mapping + codegen)."""
    missing: list[str] = []
    if not re.search(
        r"^###\s+Slot geometry \(Figma-verified\)\s*$",
        content,
        flags=re.MULTILINE,
    ):
        missing.append(
            "Layout & Measurements must include `### Slot geometry (Figma-verified)`"
        )
    elif "border-radius" not in content.lower() and "borderradius" not in content.lower():
        missing.append(
            "Slot geometry table must include border-radius (with Figma node citation)"
        )

    src = re.search(
        r"^##\s+Source Mapping\s*$([\s\S]*?)(?=^##\s|\Z)",
        content,
        flags=re.MULTILINE,
    )
    src_body = src.group(1) if src else ""
    if not src_body.strip():
        missing.append("Source Mapping section is empty")
    else:
        has_file = bool(
            re.search(r"file\s*key|fileKey|file_key", src_body, flags=re.IGNORECASE)
        ) or bool(re.search(r"[a-zA-Z0-9]{16,}", src_body))
        has_node = bool(
            re.search(r"node[\s_-]?id|nodeId", src_body, flags=re.IGNORECASE)
        ) or bool(re.search(r"\d+:\d+", src_body))
        if not has_file or not has_node:
            missing.append(
                "Source Mapping must cite Figma file key and node id(s) from packaged evidence"
            )
        if not re.search(
            r"Figma REST API|Figma MCP|verification",
            src_body,
            flags=re.IGNORECASE,
        ):
            missing.append(
                "Source Mapping should record verification method (Figma REST API / Figma MCP)"
            )

    codegen = re.search(
        r"^##\s+Codegen Contract \(Framework-Agnostic Blueprint\)\s*$([\s\S]*?)(?=^##\s|\Z)",
        content,
        flags=re.MULTILINE,
    )
    codegen_body = (codegen.group(1) if codegen else "").lower()
    needed = [
        ("slot|anatomy", "slot/anatomy schema"),
        ("variant|option", "variant/option matrix"),
        ("accessib|aria", "accessibility contract"),
        ("fallback|error", "fallback/error rules"),
        ("validation|checklist", "validation checklist"),
    ]
    missing_codegen = [
        label for pattern, label in needed if not re.search(pattern, codegen_body)
    ]
    if len(missing_codegen) >= 3:
        missing.append(
            "Codegen Contract incomplete — need anatomy, variants, a11y, fallbacks, checklist "
            f"(missing: {', '.join(missing_codegen)})"
        )

    light = re.search(
        r"^##\s+States \(Light Theme\)\s*$([\s\S]*?)(?=^##\s|\Z)",
        content,
        flags=re.MULTILINE,
    )
    if light and "|" not in light.group(1):
        missing.append("States (Light Theme) should include a state matrix table")

    return missing


def _truthy(preview: dict[str, Any], *keys: str) -> bool:
    for k in keys:
        if k in preview:
            return bool(preview.get(k))
    return False


def _preview_path(preview: dict[str, Any], *keys: str) -> str | None:
    for k in keys:
        v = preview.get(k)
        if v:
            return str(v)
    return None


def foundation_paths(preview: dict[str, Any]) -> list[str]:
    """Theme / root-spec / programme yaml only when the client must *create* them.

    Files already present on the server (and shipped in context_artifacts) are omitted
    so the client does not rewrite or filesystem-search for them.
    """
    paths: list[str] = []
    programme = preview.get("programme") or "ids"
    packaged = {
        str(p).replace("\\", "/")
        for p in (preview.get("context_pack_existing_paths") or [])
    }

    theme_path = _preview_path(preview, "theme_css_path", "themeCssPath")
    root_path = _preview_path(preview, "root_spec_path", "rootSpecPath")
    yaml_path = f"config/design_systems/{programme}.yaml"

    theme_exists = (
        _truthy(preview, "theme_css_exists", "themeCssExists")
        or (theme_path in packaged if theme_path else False)
    )
    root_exists = (
        _truthy(preview, "root_spec_exists", "rootSpecExists")
        or (root_path in packaged if root_path else False)
    )
    yaml_exists = (
        _truthy(preview, "programme_yaml_exists", "programmeYamlExists")
        or yaml_path in packaged
    )

    if theme_path and not theme_exists:
        paths.append(theme_path)
    if root_path and not root_exists:
        paths.append(root_path)
    if not yaml_exists:
        paths.append(yaml_path)

    seen: set[str] = set()
    out: list[str] = []
    for p in paths:
        if p not in seen:
            seen.add(p)
            out.append(p)
    return out


def registry_paths(preview: dict[str, Any]) -> list[str]:
    """Data-map / registry artifacts expected for create/update intake runs.

    Review revise skips these: forcing a full-file map rewrite on every feedback
    turn destroys continuity on the open PR (and is unrelated to most feedback).

    Catalogue Update never touches programme-inheritance-registry.json; map is
    only required when the operator supplied additional Figma URLs.
    """
    job_kind = str(preview.get("job_kind") or preview.get("jobKind") or "create")
    if job_kind == "review_revise":
        return []

    paths: list[str] = []
    fmap = _preview_path(preview, "figma_map_path", "figmaMapPath")

    if job_kind == "update":
        include_map = bool(
            preview.get("update_include_map")
            or preview.get("updateIncludeMap")
        )
        if include_map and fmap:
            paths.append(fmap)
        return paths

    if fmap:
        paths.append(fmap)
    # Standalone / inheritance registry updates (create only)
    pattern = str(preview.get("spec_pattern") or preview.get("specPattern") or "")
    programme = str(preview.get("programme") or "")
    if programme and programme != "ids":
        paths.append("data/programme-inheritance-registry.json")
    elif pattern in ("standalone", "ids-fork", "programme_inheritance"):
        paths.append("data/programme-inheritance-registry.json")
    return paths


def _has_artifact_path(artifacts: list[Artifact], expected: str) -> bool:
    exp = expected.replace("\\", "/").lstrip("./").lower()
    base = exp.rsplit("/", 1)[-1]
    for name in _artifact_names(artifacts):
        n = name.lower()
        if n == exp or n.endswith("/" + exp) or n == base:
            return True
        # allow basename match for map/registry json
        if base.endswith(".json") and n.endswith(base):
            return True
        if base.endswith(".css") and n.endswith(base):
            return True
        if base.endswith(".yaml") and n.endswith(base):
            return True
        if base.endswith("root-spec.md") and n.endswith("root-spec.md"):
            return True
    return False


def _missing_foundation_criteria(
    artifacts: list[Artifact], preview: dict[str, Any]
) -> list[str]:
    missing: list[str] = []
    for path in foundation_paths(preview):
        if not _has_artifact_path(artifacts, path):
            missing.append(f"missing foundation artifact `{path}`")
    return missing


def _missing_registry_criteria(
    artifacts: list[Artifact], preview: dict[str, Any]
) -> list[str]:
    missing: list[str] = []
    for path in registry_paths(preview):
        if not _has_artifact_path(artifacts, path):
            missing.append(f"missing data/registry artifact `{path}`")
    return missing


def review_session(
    session: CollabSession,
    *,
    artifacts: list[Artifact],
) -> ReviewVerdict:
    preview = session.preview or {}
    content = _find_design_spec(artifacts)
    if not content or not content.strip():
        return ReviewVerdict(
            decision="revise",
            score=0.0,
            feedback="No design-spec markdown artifact found. Produce design-spec.md with required ## sections.",
            missing_criteria=["design-spec.md missing or empty"],
        )

    missing = _missing_sections(content)
    fidelity_missing = _missing_fidelity_criteria(content)
    story_missing = _missing_storybook_criteria(artifacts, preview)
    foundation_missing = _missing_foundation_criteria(artifacts, preview)
    registry_missing = _missing_registry_criteria(artifacts, preview)

    # Update / review_revise jobs: path must match existing design-spec (no new slug)
    update_missing: list[str] = []
    job_kind = getattr(session, "job_kind", None) or preview.get("job_kind") or "create"
    if job_kind in ("update", "review_revise"):
        expected = str(
            preview.get("design_spec_path") or preview.get("designSpecPath") or ""
        ).replace("\\", "/")
        art = _find_design_spec_artifact(artifacts)
        if art and expected:
            name = (art.name or "").replace("\\", "/").lstrip("./")
            if name != expected and not name.endswith(expected.split("/")[-1]):
                # allow basename-only if content is the update target
                if name not in (expected, expected.rsplit("/", 1)[-1], "design-spec.md"):
                    update_missing.append(
                        f"{'Review revise' if job_kind == 'review_revise' else 'Update'} "
                        f"must write `{expected}` (got `{name}`)"
                    )
        if storybook_requested(preview) and not _has_storybook_stories(
            artifacts, preview
        ):
            # already covered by story_missing; keep
            pass

    all_extra = (
        fidelity_missing
        + story_missing
        + foundation_missing
        + registry_missing
        + update_missing
    )
    denom = max(
        len(REQUIRED_HEADINGS)
        + 3  # fidelity gates weight
        + (1 if storybook_requested(preview) else 0)
        + (1 if foundation_paths(preview) else 0)
        + (1 if registry_paths(preview) else 0),
        1,
    )
    score = max(0.0, 1.0 - ((len(missing) + len(all_extra)) / denom))

    if (
        settings.stub_force_revise_once
        and session.revise_count == 0
        and (settings.figma_mode or "stub") == "stub"
    ):
        return ReviewVerdict(
            decision="revise",
            score=score,
            feedback=(
                "Server stub review: please strengthen Slot geometry notes under "
                "Layout & Measurements and ensure Source Mapping cites file key + node ids. "
                "Resubmit an updated design-spec.md."
            ),
            missing_criteria=missing
            + all_extra
            + (["stub_forced_revise"] if not missing and not all_extra else []),
        )

    if missing or all_extra:
        parts = []
        if missing:
            parts.append("Missing required sections: " + ", ".join(missing))
        if fidelity_missing:
            parts.append("Fidelity: " + "; ".join(fidelity_missing))
        if foundation_missing:
            parts.append("Programme foundation: " + "; ".join(foundation_missing))
        if registry_missing:
            parts.append("Data/registry: " + "; ".join(registry_missing))
        if story_missing:
            parts.append("Storybook requirements: " + "; ".join(story_missing))
        if update_missing:
            parts.append("Update path: " + "; ".join(update_missing))
        return ReviewVerdict(
            decision="revise",
            score=score,
            feedback=" ".join(parts),
            missing_criteria=missing + all_extra,
        )

    if settings.server_review_mode == "ollama":
        soft = _ollama_soft_review(content)
        if soft and soft.get("decision") == "revise":
            return ReviewVerdict(
                decision="revise",
                score=float(soft.get("score") or score),
                feedback=str(soft.get("feedback") or "Ollama requested revisions."),
                missing_criteria=list(soft.get("missing_criteria") or []),
            )

    return ReviewVerdict(
        decision="accept",
        score=1.0,
        feedback="All required design-spec, foundation, registry, and Storybook artifacts present.",
        missing_criteria=[],
    )


def _ollama_soft_review(content: str) -> dict[str, Any] | None:
    """Optional soft quality check — never authors the spec."""
    try:
        import json

        import requests

        prompt = (
            "You are a design-spec soft reviewer for Design Spec Collab. "
            "You do NOT write the spec; only accept or revise. Reply JSON only:\n"
            '{"decision":"accept"|"revise","score":0-1,"feedback":"...","missing_criteria":[]}\n'
            "Hard expectations:\n"
            "- Required ## sections including Layout, Tokens, Light/Dark States, "
            "Interactions, Composition & API, Codegen Contract, Source Mapping.\n"
            "- `### Slot geometry (Figma-verified)` with border-radius citations.\n"
            "- Source Mapping cites file key, node id(s), and verification method "
            "(Figma REST API or Figma MCP).\n"
            "- Prefer semantic `var(--…)` tokens over raw hex where possible.\n"
            "- Codegen Contract should mention anatomy/slots, variants, accessibility, "
            "fallbacks, and a validation checklist.\n"
            "If mostly complete, accept. Only revise for clear gaps.\n\n"
            "SPEC:\n"
            + content[:12000]
        )
        r = requests.post(
            f"{settings.ollama_host}/api/generate",
            json={
                "model": settings.ollama_model,
                "prompt": prompt,
                "stream": False,
                "format": "json",
            },
            timeout=60,
        )
        r.raise_for_status()
        raw = r.json().get("response") or "{}"
        return json.loads(raw)
    except Exception as exc:  # noqa: BLE001
        logger.warning("Ollama review skipped: %s", exc)
        return None


def build_initial_requests(preview: dict[str, Any]) -> list[dict[str, str]]:
    """
    Mirror design-spec-intake-wizard run-phase deliverables (not spec-only).
    Client must return artifacts for every expected_artifact path.
    """
    slug = preview.get("slug") or "component"
    programme = preview.get("programme") or "ids"
    display = (
        preview.get("component_display_name")
        or preview.get("componentDisplayName")
        or slug
    )
    theme_css = _preview_path(preview, "theme_css_path", "themeCssPath") or ""
    design_path = (
        _preview_path(preview, "design_spec_path", "designSpecPath") or "design-spec.md"
    )
    skill = preview.get("skill_route") or preview.get("skillRoute") or "design-spec-intake-wizard"
    pascal = runtime_component_pascal(preview)
    existing = _existing_path_set(preview)
    existing_runtime = [
        p
        for p in (
            f"storybook/src/components/{pascal}.tsx",
            f"storybook/src/components/{pascal}.ts",
            f"storybook/src/components/{pascal}.module.css",
            f"storybook-generated/{programme}/src/components/{pascal}.stories.tsx",
        )
        if p in existing
        or preview.get("existing_runtime_component")
        and p.endswith(f"/{pascal}.tsx")
    ]
    # Prefer explicit flags from context pack meta
    if preview.get("existing_runtime_component"):
        existing_runtime.append(str(preview["existing_runtime_component"]))
    if preview.get("existing_runtime_css"):
        existing_runtime.append(str(preview["existing_runtime_css"]))
    if preview.get("existing_stories_path"):
        existing_runtime.append(str(preview["existing_stories_path"]))
    existing_note = ""
    if existing_runtime:
        uniq = sorted({str(p).replace("\\", "/") for p in existing_runtime if p})
        existing_note = (
            " BEFORE authoring: inspect context_artifacts for these **existing** "
            "runtime/story files (IDE parity — do not invent a parallel API): "
            + ", ".join(f"`{p}`" for p in uniq)
            + ". Align **Composition & API (runtime)** with the exported props of the "
            "existing component module; extend only when Figma evidence requires it. "
            "If only a div/span mock story exists, plan to replace it with a real "
            f"`storybook/src/components/{pascal}.tsx` + `.module.css`."
        )
    requests: list[dict[str, str]] = [
        {
            "id": "req-write-spec",
            "kind": "write_design_spec",
            "instruction": (
                f"Follow the `{skill}` run-phase rules (same as design-spec-intake-wizard). "
                f"Using server-packaged figma_evidence only, write production-ready "
                f"`{design_path}` for {programme}/{slug} (`{display}`). Include every "
                f"required ## section + Slot geometry (Figma-verified). Use var(--...). "
                f"Do not connect client Figma MCP. Return artifact name `{design_path}`."
                f"{existing_note}"
            ),
            "expected_artifact": str(design_path),
        }
    ]

    foundations = foundation_paths(preview)
    if foundations:
        donor = _preview_path(preview, "donor_theme_css_path", "donorThemeCssPath") or "components/ids-theme.css"
        donor_root = (
            _preview_path(preview, "donor_root_spec_path", "donorRootSpecPath")
            or "components/ids/root-spec.md"
        )
        paths_txt = ", ".join(f"`{p}`" for p in foundations)
        requests.append(
            {
                "id": "req-programme-foundation",
                "kind": "write_programme_foundation",
                "instruction": (
                    f"Programme foundation files are REQUIRED for this job (they are missing "
                    f"on the server). Submit these artifacts (full paths as names): {paths_txt}. "
                    f"Use packaged context_artifacts named donor:{donor} / "
                    f"donor:{donor_root} (and donor programme yaml if present) as templates — "
                    f"do NOT search the local filesystem. "
                    f"Submit the foundation under the real repo paths above "
                    f"(never as artifact names starting with donor:). "
                    f"If creating theme CSS, prefer a thin wrapper that @imports the donor "
                    f"unless variables-library generation was requested. "
                    f"If creating root-spec.md, inherit/document the donor root-spec. "
                    f"If creating config/design_systems/{programme}.yaml, include "
                    f"components_dir, figma_map_path, theme_css_path, root_spec_path, display_name. "
                    f"Skip inventing paths outside write_path_allowlist."
                ),
                "expected_artifact": foundations[0],
            }
        )

    regs = registry_paths(preview)
    if regs:
        fmap = regs[0]
        requests.append(
            {
                "id": "req-data-registry",
                "kind": "write_data_registry",
                "instruction": (
                    f"Data/map updates are REQUIRED. Submit full-file artifacts for: "
                    + ", ".join(f"`{p}`" for p in regs)
                    + f". For `{fmap}`, upsert an entry for slug `{slug}` using "
                    f"prompt_package.confirmed_payload.mapEntrySketch (designSpecPath, "
                    f"figmaUrl, fileKey, nodeId/mainComponentSetNodeId, specPattern, "
                    f"elements/states node ids). Keep existing unrelated entries. "
                    f"For `data/programme-inheritance-registry.json`, upsert "
                    f"`pattern: standalone` (or inheritance fields if skill is inheritance) "
                    f"for programme `{programme}` / slug `{slug}`."
                ),
                "expected_artifact": fmap,
            }
        )

    if storybook_requested(preview):
        story_paths = expected_storybook_paths(preview)
        stories_path = story_paths[0]
        comp_tsx = f"storybook/src/components/{pascal}.tsx"
        comp_css = f"storybook/src/components/{pascal}.module.css"
        programme_display = (
            preview.get("programme_display_name")
            or preview.get("programmeDisplayName")
            or str(programme).title()
        )
        theme_rule = (
            f"Import theme CSS with a **relative** path from the stories file, e.g. "
            f'`import "../../../../{theme_css}";` '
            f"(do **not** use bare `import \"{theme_css}\"` — Vite cannot resolve it)."
            if theme_css
            else (
                "Import the programme theme CSS with a relative path from "
                "`storybook-generated/<programme>/src/components/`, e.g. "
                '`import "../../../../components/<programme>-theme.css";`.'
            )
        )
        must_write_comp = comp_tsx not in existing and (
            f"storybook/src/components/{pascal}.ts" not in existing
        )
        must_write_css = comp_css not in existing
        reuse_bits: list[str] = []
        if not must_write_comp:
            reuse_bits.append(
                f"`{comp_tsx}` is already packaged in context_artifacts / on the publish "
                "base — update the file content in your submit when Figma/API changes; "
                "otherwise keep it and import it from stories"
            )
        if not must_write_css:
            reuse_bits.append(
                f"`{comp_css}` already exists in context — update tokens/layout when needed"
            )
        reuse_txt = (
            (" Existing modules: " + "; ".join(reuse_bits) + ".") if reuse_bits else ""
        )
        submit_lines = [
            f"1. `{comp_tsx}` — **runtime component** as a full-file session artifact "
            f"(no local repo required). Real controls / DS primitives "
            f"(`<button>`, `<input>`, Base UI, shared Icon, etc.). "
            f"Do **not** fake interactive controls as decorative `<div>` / `<span>`. "
            f"Export the same canonical Runtime API documented in Composition & API.",
            f"2. `{comp_css}` — CSS module artifact with `var(--…)` tokens from the "
            f"design-spec (not stories-only inline `style={{…}}`).",
            f"3. `{stories_path}` — meta.title `Spec Generated/{programme_display}/{display}`; "
            f"primary export **Spec Accurate Design**. Stories **import** "
            f"`{pascal}` from `../../../../storybook/src/components/{pascal}` — "
            f"do **not** redefine the component inside the CSF file. {theme_rule}",
            "4. Do **not** submit `storybook/.storybook/main.ts` unless Storybook config "
            "itself must change — globs already discover "
            "`storybook-generated/*/src/**/*.stories.@(ts|tsx)`.",
            "5. Do **not** run local scripts, gates, or git — the client has no monorepo. "
            "Only return artifact `name` + `content` for the paths above.",
        ]
        requests.append(
            {
                "id": "req-write-storybook",
                "kind": "write_storybook_examples",
                "instruction": (
                    "Storybook Spec Accurate Design is REQUIRED. Submit these artifacts "
                    "via the session API only (LLM-authored file contents — no client "
                    "checkout, no Storybook gate, no deterministic generator run):\n"
                    + "\n".join(submit_lines)
                    + reuse_txt
                    + " Map Anatomy slots to real DOM from the design-spec for this job only; "
                    "do not invent variants or placeholder markup."
                ),
                "expected_artifact": (
                    stories_path if not must_write_comp else comp_tsx
                ),
            }
        )
    return requests


def build_revise_requests(
    session: CollabSession, verdict: ReviewVerdict
) -> list[dict[str, str]]:
    preview = session.preview or {}
    required = (
        [
            _preview_path(preview, "design_spec_path", "designSpecPath")
            or "design-spec.md"
        ]
        + foundation_paths(preview)
        + registry_paths(preview)
        + expected_storybook_paths(preview)
    )
    required = [p for p in required if p]
    return [
        {
            "id": f"req-revise-{session.turn + 1}",
            "kind": "revise_sections",
            "instruction": (
                "Revise ALL required intake artifacts based on server feedback "
                "(design-spec-intake-wizard run-phase parity — not design-spec.md alone). "
                f"Feedback: {verdict.feedback}. "
                f"Missing/criteria: {', '.join(verdict.missing_criteria) or 'n/a'}. "
                "Resubmit full contents for every required path: "
                + ", ".join(f"`{p}`" for p in required)
                + "."
            ),
            "expected_artifact": required[0] if required else "design-spec.md",
        }
    ]

"""Compose canonical components/ids/{slug}/design-spec.mdx (docs-first, LLM-friendly)."""
from __future__ import annotations

from datetime import datetime, timezone
from typing import Dict, List

from ingestion.section_routes import STANDARD_VISION_TARGETS


def _join_bullets(lines: List[str], max_lines: int = 100) -> str:
    if not lines:
        return "- *(No automated extractions for this block.)*"
    out = []
    for ln in lines[:max_lines]:
        ln = ln.strip()
        if not ln:
            continue
        if not ln.startswith("-") and not ln.startswith("|"):
            ln = f"- {ln}"
        out.append(ln)
    return "\n".join(out) if out else "- *(No automated extractions for this block.)*"


def _vision_blocks(vision_by_section: Dict[str, List[str]], section: str) -> str:
    chunks = vision_by_section.get(section) or []
    if not chunks:
        return ""
    parts = []
    for i, ch in enumerate(chunks, 1):
        parts.append(f"### Documentation image {i}\n\n{ch.strip()}\n")
    return "\n".join(parts)


def _section_marker(section_id: str) -> str:
    return f"<!-- ds:section id={section_id} -->"


def _render_docs_block(
    docs_by_section: Dict[str, List[str]] | None,
    section_key: str,
    *,
    max_lines: int = 120,
) -> str:
    docs = (docs_by_section or {}).get(section_key, [])
    if not docs:
        return ""
    # Extracted doc lines are already clean; keep them as bullets only.
    return _join_bullets(docs, max_lines=max_lines)


def _merge_figma_github_vision(
    figma_lines: List[str],
    docs_by_section: Dict[str, List[str]] | None,
    vision_by_section: Dict[str, List[str]],
    section_key: str,
    *,
    max_figma: int,
    docs_max: int = 120,
) -> str:
    """Docs-first merge: docs, then figma, then vision for one section."""
    docs = _render_docs_block(docs_by_section, section_key, max_lines=docs_max)
    fl = figma_lines[:max_figma]
    parts: List[str] = []
    if docs:
        parts.append(docs)
    if fl:
        parts.append("### From Figma extraction\n\n" + _join_bullets(fl))
    vb = _vision_blocks(vision_by_section, section_key)
    if vb.strip():
        parts.append(vb.strip())
    if not parts:
        return "- *(No automated extractions for this block.)*"
    return "\n\n".join(parts)


def _dynamic_github_sections_md(
    vision_by_section: Dict[str, List[str]],
    docs_by_section: Dict[str, List[str]] | None,
) -> str:
    """Extra ## sections for headings not in the fixed template (docs and/or vision)."""
    docs = docs_by_section or {}
    vis = vision_by_section or {}
    extras: set[str] = set()
    for k in set(vis.keys()) | set(docs.keys()):
        if k in STANDARD_VISION_TARGETS or k == "Documentation imagery":
            continue
        if vis.get(k) or docs.get(k):
            extras.add(k)
    if not extras:
        return ""
    parts: List[str] = []
    for title in sorted(extras):
        sub: List[str] = []
        if docs.get(title):
            sub.append(_join_bullets(docs[title]))
        vb = _vision_blocks(vis, title)
        if vb.strip():
            sub.append(vb.strip())
        if sub:
            section_id = "dynamic-" + title.lower().replace(" ", "-")
            parts.append(f"{_section_marker(section_id)}\n## {title}\n\n" + "\n\n".join(sub) + "\n")
    return "\n".join(parts)


def compose_design_spec_mdx(
    *,
    component_name: str,
    category: str,
    figma_url: str,
    node_id_display: str,
    file_key: str,
    figma_anatomy: List[str],
    figma_layout: List[str],
    figma_typography: List[str],
    figma_colors: List[str],
    variable_bullets: List[str],
    vision_by_section: Dict[str, List[str]],
    docs_by_section: Dict[str, List[str]] | None = None,
    local_doc_by_section: Dict[str, List[str]] | None = None,
    conflict_notes_by_section: Dict[str, List[str]] | None = None,
    map_path: str = "data/component-figma-map.json",
) -> str:
    now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    node_hyphen = node_id_display.replace(":", "-")
    docs = docs_by_section or {}
    local_docs = local_doc_by_section or {}
    conflicts = conflict_notes_by_section or {}
    v = vision_by_section

    overview_lines = docs.get("Overview", [])
    overview_full = _render_docs_block(docs, "Overview", max_lines=120)
    if overview_lines:
        summary = _join_bullets(overview_lines[:8], max_lines=8)
    else:
        summary = (
            "- Canonical design-spec generated from available sources. "
            "Regenerate with `--docs-source github` or `both` to ingest `overview.mdx` from ids-content."
        )
    if not overview_full:
        overview_full = (
            "- *(No Overview extracted. Confirm GitHub docs are enabled and `content/<slug>/overview.mdx` "
            "uses markdown headings, e.g. `## Overview`.)*"
        )
    purpose = _render_docs_block(docs, "Purpose & Usage", max_lines=35)
    if not purpose:
        purpose = _render_docs_block(docs, "Usage", max_lines=35) or "- Purpose/usage guidance not extracted."

    anatomy = _merge_figma_github_vision(figma_anatomy, docs, v, "Anatomy", max_figma=40)
    layout = _merge_figma_github_vision(figma_layout, docs, v, "Layout & Measurements", max_figma=60)
    typo = _merge_figma_github_vision(figma_typography, docs, v, "Typography", max_figma=40)

    tok_vars = _join_bullets(variable_bullets[:80])
    tok_colors = _join_bullets(figma_colors[:50])
    docs_tok = docs.get("Tokens", [])
    gh_tok_block = (
        "### Tokens / color guidance (documentation)\n\n" + _join_bullets(docs_tok) if docs_tok else ""
    )
    tokens_body = (
        f"### Variable definitions (Figma file)\n\n{tok_vars}\n\n### Colors from inspected nodes\n\n{tok_colors}\n"
    )
    if gh_tok_block:
        tokens_body += f"\n{gh_tok_block}\n"
    if _vision_blocks(v, "Tokens").strip():
        tokens_body += f"\n### From documentation imagery\n\n{_vision_blocks(v, 'Tokens')}\n"

    gh_sl = docs.get("States (Light Theme)", [])
    v_sl = _vision_blocks(v, "States (Light Theme)")
    if gh_sl or v_sl.strip():
        states_light = ""
        if gh_sl:
            states_light += _join_bullets(gh_sl) + "\n\n"
        if v_sl.strip():
            states_light += "Details from documentation imagery:\n\n" + v_sl.strip()
        states_light = states_light.strip()
    else:
        states_light = (
            "| Area | State | Background | Border | Text/Icon |\n"
            "|---|---|---|---|---|\n"
            "| *See Figma* | *Dev Mode* | — | — | — |\n"
        )

    states_dark = _merge_figma_github_vision([], docs, v, "States (Dark Theme)", max_figma=0)
    if states_dark == "- *(No automated extractions for this block.)*":
        states_dark = (
            "- Dark theme uses the same semantic tokens; verify contrast in Figma Dev Mode.\n"
        )

    interactions = _merge_figma_github_vision([], docs, v, "Interactions", max_figma=0)
    if interactions == "- *(No automated extractions for this block.)*":
        interactions = (
            "- Click / keyboard interaction patterns: implement per platform guidelines.\n"
            "- Map focus rings to `var(--color-focus-primary)` or brand focus token where specified.\n"
        )

    a11y = _merge_figma_github_vision([], docs, v, "Accessibility", max_figma=0)
    if a11y == "- *(No automated extractions for this block.)*":
        a11y = (
            "- Keyboard operable; visible focus; ARIA attributes per component pattern.\n"
            "- Meet WCAG AA for text and interactive contrast.\n"
        )

    variants = _merge_figma_github_vision([], docs, v, "Variants", max_figma=0)
    if variants == "- *(No automated extractions for this block.)*":
        variants = "- Default variant; additional variants per Figma component set.\n"

    behavior = _merge_figma_github_vision([], docs, v, "Behavior & Guidelines", max_figma=0)
    if behavior == "- *(No automated extractions for this block.)*":
        behavior = "- Follow design-system usage guidance for this component family.\n"

    related = _merge_figma_github_vision([], docs, v, "Related Links", max_figma=0)
    if related == "- *(No automated extractions for this block.)*":
        related = "- *(No related links extracted from documentation images.)*\n"

    api_contract = _render_docs_block(docs, "API & Contract", max_lines=50)
    if not api_contract:
        api_contract = "- API/contract details not extracted from docs."

    implementation_notes = _render_docs_block(docs, "Implementation Notes", max_lines=80)
    if not implementation_notes:
        implementation_notes = "- Implementation notes not extracted."

    troubleshooting = _render_docs_block(docs, "Troubleshooting", max_lines=50)
    if not troubleshooting:
        troubleshooting = "- Troubleshooting notes not extracted."

    dynamic_block = _dynamic_github_sections_md(v, docs)
    dynamic_block = f"{dynamic_block}\n" if dynamic_block.strip() else ""

    doc_imagery = _vision_blocks(v, "Documentation imagery")
    doc_block = f"\n## Documentation imagery\n\n{doc_imagery}\n" if doc_imagery.strip() else ""
    conflict_notes = "\n".join(
        f"- {line}" for lines in conflicts.values() for line in lines if line.strip()
    ).strip()
    if not conflict_notes:
        conflict_notes = "- No cross-source conflicts detected."

    local_fallback_count = sum(len(vl) for vl in local_docs.values())
    docs_count = sum(len(vl) for vl in docs.values())

    return f"""<!-- auto:generated:start -->
# {component_name} Design Spec

> Generated {now}. Canonical docs-first artifact for design-system Q&A and code generation.

{_section_marker("metadata")}
## Metadata
- Component: {component_name}
- Category: {category}
- Figma: {figma_url}
- Node ID: {node_hyphen}
- File key: `{file_key}`
- Canonical Priority: GitHub docs > Figma extraction > vision/image inference
- Documentation lines indexed: {docs_count}
- Local-doc fallback lines: {local_fallback_count}

{_section_marker("summary")}
## Executive Summary

{summary}

{_section_marker("overview")}
## Overview

{overview_full}

{_section_marker("purpose-usage")}
## Purpose & Usage

{purpose}

{_section_marker("anatomy")}
## Anatomy

{anatomy}

{_section_marker("layout-measurements")}
## Layout & Measurements

{layout}

{_section_marker("typography")}
## Typography

{typo}

{_section_marker("tokens")}
## Tokens

{tokens_body}

{_section_marker("states-light")}
## States (Light Theme)

{states_light}

{_section_marker("states-dark")}
## States (Dark Theme)

{states_dark}

{_section_marker("interactions")}
## Interactions

{interactions}

{_section_marker("accessibility")}
## Accessibility

{a11y}

{_section_marker("variants")}
## Variants

{variants}

{_section_marker("behavior-guidelines")}
## Behavior & Guidelines

{behavior}

{_section_marker("api-contract")}
## API & Contract

{api_contract}

{_section_marker("implementation-notes")}
## Implementation Notes

{implementation_notes}

{_section_marker("troubleshooting")}
## Troubleshooting

{troubleshooting}

{_section_marker("related-links")}
## Related Links

{related}

{dynamic_block}{_section_marker("source-conflicts")}
## Source Conflict Notes

{conflict_notes}

{_section_marker("token-gaps-notes")}
## Token Gaps / Notes

- Cross-check semantic CSS variables (`var(--...)`) against your theme build.
- Re-run generation after Figma or documentation image updates.

{_section_marker("deliverable-checklist")}
## Deliverable Checklist

- [ ] Implement component API matching framework conventions (Angular / React / Vue / Lit)
- [ ] Wire tokens from CSS variables
- [ ] Cover keyboard + screen reader requirements
- [ ] Verify light and dark themes
- [ ] Match spacing / typography within tolerance of Figma

{_section_marker("source-mapping")}
## Source Mapping

- Figma REST: `GET /v1/files/{file_key}/nodes` and `GET /v1/files/{file_key}/variables`
- Component map: `{map_path}`
- GitHub docs: MDX under `content/<component>/` and shared assets under `content/assets/images/...`
- Local docs fallback: `components/ids/<slug>/` when GitHub docs are absent/incomplete
{doc_block}<!-- auto:generated:end -->
"""

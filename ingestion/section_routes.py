"""Map MDX heading paths to design-spec.mdx section titles."""
from __future__ import annotations

import re
from typing import List, Tuple

# (regex on joined path lowercased, target_section_title)
DEFAULT_ROUTES: List[Tuple[str, str]] = [
    (r"overview|summary|introduction|at a glance", "Overview"),
    (r"purpose|when to use|when not to use|usage", "Purpose & Usage"),
    (r"anatomy", "Anatomy"),
    (r"redline|spacing|layout|measurement|padding|margin|gap", "Layout & Measurements"),
    (r"typography|type|font|text", "Typography"),
    # Before generic "color" (avoids "States and Colors" → Tokens)
    (r"state|interaction|hover|focus|disabled|active", "States (Light Theme)"),
    (r"token|color|palette", "Tokens"),
    (r"dark", "States (Dark Theme)"),
    (r"don'?t|dos?\s+and|guideline|best practice|behavior", "Behavior & Guidelines"),
    (r"accessib|a11y|wcag|aria", "Accessibility"),
    (r"variant|difference|compare|vs\.?", "Variants"),
    (r"props?|api|events?|slots?|contract", "API & Contract"),
    (r"implement|engineering|developer note|code", "Implementation Notes"),
    (r"troubleshoot|known issue|faq|debug", "Troubleshooting"),
    (r"anatomy.*do|do not|don't", "Behavior & Guidelines"),
    (r"related\s*link|references?|resources?|see\s+also|further\s+reading", "Related Links"),
]

# Sections that have a fixed slot in `design_spec_composer` (not rendered as extra dynamic ## blocks).
STANDARD_VISION_TARGETS: frozenset[str] = frozenset(
    {
        "Anatomy",
        "Layout & Measurements",
        "Typography",
        "Tokens",
        "States (Light Theme)",
        "States (Dark Theme)",
        "Interactions",
        "Accessibility",
        "Variants",
        "Behavior & Guidelines",
        "Overview",
        "Purpose & Usage",
        "API & Contract",
        "Implementation Notes",
        "Troubleshooting",
        "Related Links",
        "Documentation imagery",
    }
)


def _clean_heading_title(title: str) -> str:
    return title.strip().rstrip("#").strip()


def route_section(
    section_titles: List[str],
    *,
    dynamic_heading_fallback: bool = True,
) -> str:
    """
    Pick output section from heading path.

    1. Match `DEFAULT_ROUTES` against the full path (e.g. ``Anatomy > Redlines``).
    2. If no match and ``dynamic_heading_fallback`` is True, use the **innermost**
       heading text (last in ``section_titles``) as the section title so GitHub/MDX
       can introduce arbitrary ``##`` sections (e.g. ``## API`` -> section "API").
    3. Otherwise fall back to ``Documentation imagery``.
    """
    blob = " > ".join(section_titles).lower() if section_titles else ""
    for pattern, target in DEFAULT_ROUTES:
        if re.search(pattern, blob, re.I):
            return target
    if dynamic_heading_fallback and section_titles:
        return _clean_heading_title(section_titles[-1])
    return "Documentation imagery"

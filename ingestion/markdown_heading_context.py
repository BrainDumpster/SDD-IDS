"""Track Markdown/MDX headings and associate image refs with section context."""

from __future__ import annotations

import re
from dataclasses import dataclass, field
from typing import List

from ingestion.markdown_image_refs import ImageRef, extract_relative_image_refs

_HEADING = re.compile(r"^(#{1,6})\s+(.+?)\s*$")


@dataclass
class ImageInSection:
    """Image reference with heading path (most recent ## / ### titles)."""

    path: str
    alt: str
    section_titles: List[str] = field(default_factory=list)
    source_mdx: str = ""


def _images_on_line(line: str) -> List[ImageRef]:
    return extract_relative_image_refs(line)


def extract_images_with_heading_context(mdx_text: str, source_mdx_path: str) -> List[ImageInSection]:
    """
    Walk line-by-line: maintain stack of (level, title); on each line after updating headings,
    attach current section path to any relative images on that line.
    """
    lines = mdx_text.splitlines()
    stack: list[tuple[int, str]] = []
    out: list[ImageInSection] = []

    in_frontmatter = False
    fm_started = False

    for line in lines:
        if line.strip() == "---":
            if not fm_started:
                fm_started = True
                in_frontmatter = True
                continue
            if in_frontmatter:
                in_frontmatter = False
                continue

        if in_frontmatter:
            continue

        hm = _HEADING.match(line)
        if hm:
            level = len(hm.group(1))
            title = hm.group(2).strip().rstrip("#").strip()
            stack = [s for s in stack if s[0] < level]
            stack.append((level, title))

        for ref in _images_on_line(line):
            titles = [t for _, t in stack if t]
            out.append(
                ImageInSection(
                    path=ref.path,
                    alt=ref.alt,
                    section_titles=titles,
                    source_mdx=source_mdx_path,
                )
            )

    return out


"""Extract relative image references from MDX / markdown source."""

from __future__ import annotations

import re
from typing import NamedTuple

_MARKDOWN_IMG = re.compile(r"!\[([^\]]*)\]\(\s*([^)]+?)\s*\)")
_HTML_IMG = re.compile(r'<img[^>]+src\s*=\s*["\']([^"\']+)["\']', re.IGNORECASE)
_MDX_IMAGE = re.compile(r"<Image[^>]+src\s*=\s*[\"']([^\"']+)[\"']", re.IGNORECASE)


class ImageRef(NamedTuple):
    alt: str
    path: str


def _strip_md_path(raw: str) -> str:
    return raw.strip().split()[0].split("#")[0].strip()


def is_relative_asset(path: str) -> bool:
    p = path.strip()
    if not p or p.startswith(("http://", "https://", "data:")):
        return False
    return True


def extract_relative_image_refs(mdx_text: str) -> list[ImageRef]:
    seen: set[str] = set()
    out: list[ImageRef] = []

    for m in _MARKDOWN_IMG.finditer(mdx_text):
        path = _strip_md_path(m.group(2))
        if not is_relative_asset(path):
            continue
        if path not in seen:
            seen.add(path)
            out.append(ImageRef(alt=m.group(1).strip(), path=path))

    for rx in (_HTML_IMG, _MDX_IMAGE):
        for m in rx.finditer(mdx_text):
            path = _strip_md_path(m.group(1))
            if not is_relative_asset(path):
                continue
            if path not in seen:
                seen.add(path)
                out.append(ImageRef(alt="", path=path))

    return out


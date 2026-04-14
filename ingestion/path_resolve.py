"""Resolve relative asset paths against an MDX file path in the repo (POSIX)."""
from __future__ import annotations

from pathlib import PurePosixPath


def resolve_relative_to_mdx(mdx_repo_path: str, ref: str) -> str:
    """
    mdx_repo_path: path inside project, e.g. components/ids/accordion/documentation.mdx
    ref: e.g. ./assets/x.svg, ../img/a.png
    Returns normalized path with forward slashes.
    """
    ref = ref.strip().strip('"').strip("'")
    if not ref or ref.startswith(("http://", "https://", "data:")):
        return ""

    mdx_repo_path = mdx_repo_path.strip().lstrip("/")
    parent = str(PurePosixPath(mdx_repo_path).parent)
    if parent == ".":
        parent = ""

    if ref.startswith("/"):
        combined = PurePosixPath(ref.lstrip("/"))
    else:
        base = PurePosixPath(parent) if parent else PurePosixPath(".")
        combined = base / ref

    parts: list[str] = []
    for p in combined.parts:
        if p == "..":
            if parts:
                parts.pop()
        elif p != ".":
            parts.append(p)
    return "/".join(parts)

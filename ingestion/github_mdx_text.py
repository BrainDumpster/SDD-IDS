"""Extract prose from GitHub MDX/HTML into design-spec section keys."""
from __future__ import annotations

import re
from collections import defaultdict
from typing import MutableMapping

from bs4 import BeautifulSoup

from ingestion.section_routes import route_section


def _clean_heading_title(title: str) -> str:
    return title.strip().rstrip("#").strip()


def strip_yaml_frontmatter(text: str) -> str:
    """Remove leading YAML frontmatter so markdown headings parse correctly."""
    t = text.lstrip("\ufeff")
    if not t.startswith("---"):
        return text
    end = t.find("\n---", 3)
    if end == -1:
        return text
    return t[end + 4 :].lstrip("\n")


def strip_mdx_import_export_lines(text: str) -> str:
    """Drop common MDX lines that break or pollute markdown conversion."""
    out_lines: list[str] = []
    for line in text.splitlines():
        s = line.strip()
        if s.startswith("import ") or s.startswith("export "):
            continue
        out_lines.append(line)
    return "\n".join(out_lines)


def _dedupe_doc_lines(lines: list[str]) -> list[str]:
    seen: set[str] = set()
    out: list[str] = []
    for ln in lines:
        key = ln.strip().lower()
        if not key or key in seen:
            continue
        seen.add(key)
        out.append(ln)
    return out


def _body_markdown_blocks_to_doc_lines(
    body: str,
    prefix: str,
    *,
    max_chars_per_line: int,
) -> list[str]:
    """Turn a raw markdown section body into prefixed doc lines (paragraphs + lists)."""
    lines_out: list[str] = []
    body = body.strip()
    if not body:
        return lines_out
    parts = re.split(r"\n\s*\n+", body)
    bullet_re = re.compile(r"^[\s]*[-*+]\s+(.+)$", re.MULTILINE)
    numbered_re = re.compile(r"^\s*\d+\.\s+(.+)$", re.MULTILINE)
    for part in parts:
        part = part.strip()
        if not part:
            continue
        if bullet_re.search(part):
            for m in bullet_re.finditer(part):
                item = m.group(1).strip()[:max_chars_per_line]
                if item:
                    lines_out.append(f"- {item}")
            continue
        if numbered_re.search(part):
            for m in numbered_re.finditer(part):
                item = m.group(1).strip()[:max_chars_per_line]
                if item:
                    lines_out.append(f"- {item}")
            continue
        flat = re.sub(r"\s+", " ", part).strip()[:max_chars_per_line]
        if flat:
            lines_out.append(flat)
    return lines_out


def extract_raw_mdx_by_atx_headings(
    text: str,
    source_name: str,
    *,
    max_chars_per_line: int = 1200,
    max_lines_per_section: int = 120,
) -> dict[str, list[str]]:
    """
    Fallback: split MDX/Markdown by ATX headings (`#` / `##` / …).

    Catches prose that never becomes `<p>` in the HTML pass (JSX wrappers, partial MDX, etc.).
    """
    out: dict[str, list[str]] = defaultdict(list)
    prefix = ""
    heading_re = re.compile(r"^(#{1,6})\s+(.+?)\s*$")
    current_title: str | None = None
    buf: list[str] = []

    def flush() -> None:
        nonlocal current_title, buf
        if current_title is None:
            buf = []
            return
        body = "\n".join(buf).strip()
        buf = []
        if not body:
            return
        key = route_section(
            [_clean_heading_title(current_title)],
            dynamic_heading_fallback=True,
        )
        for doc_line in _body_markdown_blocks_to_doc_lines(
            body, prefix, max_chars_per_line=max_chars_per_line
        ):
            if len(out[key]) >= max_lines_per_section:
                break
            out[key].append(doc_line)

    for line in text.splitlines():
        m = heading_re.match(line)
        if m:
            flush()
            current_title = m.group(2).strip()
        else:
            buf.append(line)
    flush()
    return dict(out)


def mdx_markdown_to_html(text: str) -> str:
    """Turn MDX/Markdown into HTML so BeautifulSoup can walk headings and lists."""
    try:
        import markdown as md

        return md.markdown(
            text,
            extensions=["extra", "sane_lists", "nl2br", "tables"],
        )
    except ImportError:
        return text


def extract_github_mdx_text_by_section(
    html: str,
    source_name: str,
    *,
    max_chars_per_line: int = 1200,
    max_lines_per_section: int = 120,
) -> dict[str, list[str]]:
    """
    Walk HTML-ish MDX (h1-h6 + p/ul/ol). Images are skipped.
    Map each block to a section via route_section(heading stack).
    """
    soup = BeautifulSoup(html, "html.parser")
    for img in soup.find_all("img"):
        img.decompose()

    stack: list[tuple[int, str]] = []
    out: dict[str, list[str]] = defaultdict(list)

    def titles_for_route() -> list[str]:
        return [t for _, t in sorted(stack, key=lambda x: x[0])]

    def append_line(section_key: str, line: str) -> None:
        if len(out[section_key]) >= max_lines_per_section:
            return
        out[section_key].append(line)

    # Caller no longer needs inline provenance; keep extraction lines clean for spec output.
    prefix = ""

    for tag in soup.find_all(
        ["h1", "h2", "h3", "h4", "h5", "h6", "p", "ul", "ol", "table"]
    ):
        if tag.name in ("h1", "h2", "h3", "h4", "h5", "h6"):
            level = int(tag.name[1])
            title = tag.get_text(" ", strip=True)
            if not title:
                continue
            stack = [s for s in stack if s[0] < level]
            stack.append((level, title))
        elif tag.name == "p":
            # Avoid double-counting list item text (HTML often uses <li><p>...</p></li>).
            if tag.find_parent("li"):
                continue
            text = tag.get_text(" ", strip=True)
            if not text:
                continue
            text = text[:max_chars_per_line]
            key = route_section(titles_for_route(), dynamic_heading_fallback=True)
            append_line(key, text)
        elif tag.name in ("ul", "ol"):
            for li in tag.find_all("li", recursive=False):
                text = li.get_text(" ", strip=True)
                if not text:
                    continue
                text = text[:max_chars_per_line]
                key = route_section(titles_for_route(), dynamic_heading_fallback=True)
                append_line(key, f"- {text}")
        elif tag.name == "table":
            key = route_section(titles_for_route(), dynamic_heading_fallback=True)
            for tr in tag.find_all("tr"):
                cells = [c.get_text(" ", strip=True) for c in tr.find_all(["th", "td"])]
                cells = [c for c in cells if c]
                if cells:
                    row = " | ".join(c[:12])[:max_chars_per_line]
                    append_line(key, f"| {row} |")

    return dict(out)


def _looks_like_html_fragment(text: str) -> bool:
    t = text.lstrip()
    if not t.startswith("<"):
        return False
    return bool(
        re.search(r"<\s*(h[1-6]|p|div|ul|ol|table|section|article)\b", t, re.I)
    )


def extract_prose_from_mdx_file(
    mdx_text: str,
    source_label: str,
) -> dict[str, list[str]]:
    """Parse MDX/Markdown file body and bucket lines by `route_section`."""
    cleaned = strip_yaml_frontmatter(mdx_text)
    cleaned = strip_mdx_import_export_lines(cleaned)
    merged: dict[str, list[str]] = defaultdict(list)
    # ids-content often stores pre-rendered HTML in `.mdx` files; avoid running
    # `markdown()` on HTML (duplicates / mangled structure).
    if _looks_like_html_fragment(cleaned):
        for k, v in extract_github_mdx_text_by_section(cleaned, source_label).items():
            merged[k].extend(v)
    else:
        html = mdx_markdown_to_html(cleaned)
        for k, v in extract_github_mdx_text_by_section(html, source_label).items():
            merged[k].extend(v)
        for k, v in extract_raw_mdx_by_atx_headings(cleaned, source_label).items():
            merged[k].extend(v)
    return {k: _dedupe_doc_lines(v) for k, v in merged.items()}


def merge_github_doc_sections(
    target: MutableMapping[str, list[str]],
    extracted: dict[str, list[str]],
) -> None:
    for k, lines in extracted.items():
        target[k].extend(lines)

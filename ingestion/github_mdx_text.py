"""Deprecated compatibility wrapper for GitHub markdown prose extractors."""

from ingestion.github_markdown_text import (
    extract_github_markdown_text_by_section,
    extract_prose_from_markdown_file,
    merge_github_doc_sections,
)

# Legacy aliases
extract_github_mdx_text_by_section = extract_github_markdown_text_by_section
extract_prose_from_mdx_file = extract_prose_from_markdown_file

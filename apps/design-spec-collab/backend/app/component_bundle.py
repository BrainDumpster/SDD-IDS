"""Catalogue component bundle zip (source-of-truth + Storybook + nested deps)."""

from __future__ import annotations

import importlib.util
import logging
import sys
from pathlib import Path
from typing import Any

from .config import settings

logger = logging.getLogger(__name__)


def _ensure_repo_on_path() -> Path:
    root = settings.repo_root.resolve()
    root_str = str(root)
    if root_str not in sys.path:
        sys.path.insert(0, root_str)
    return root


def import_handoff_module() -> Any:
    """Load package_component_handoff from repo scripts/ (local + Docker)."""
    root = _ensure_repo_on_path()
    scripts_dir = root / "scripts"
    scripts_str = str(scripts_dir)
    if scripts_dir.is_dir() and scripts_str not in sys.path:
        sys.path.insert(0, scripts_str)

    try:
        import package_component_handoff as handoff  # type: ignore[import-not-found]

        return handoff
    except ImportError:
        module_path = scripts_dir / "package_component_handoff.py"
        if not module_path.is_file():
            raise ImportError(
                f"package_component_handoff not found at {module_path}"
            ) from None
        spec = importlib.util.spec_from_file_location(
            "package_component_handoff", module_path
        )
        if spec is None or spec.loader is None:
            raise ImportError(f"Could not load {module_path}") from None
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        return module


def build_component_bundle_zip(programme: str, slug: str) -> tuple[bytes, dict[str, Any]]:
    """
    Package design-contract + Storybook examples for a catalogue component.

    Returns (zip_bytes, summary) where summary includes fileCount / nestedSlugs.
    Raises FileNotFoundError if the component cannot be resolved.
    """
    root = _ensure_repo_on_path()
    handoff = import_handoff_module()

    programme = programme.strip().lower()
    slug = slug.strip()

    result = handoff.build_package(
        programme,
        [slug],
        include_reference=True,
        include_reference_deps=True,
        include_icons=True,
        include_tests=True,
        include_agent_contract=True,
        expand_nested=True,
        repo_root=root,
    )
    data = handoff.write_zip_bytes(result, repo_root=root)
    summary: dict[str, Any] = {
        "programme": result.programme,
        "slug": slug,
        "fileCount": len(result.files),
        "components": [
            {
                "slug": c.slug,
                "programme": c.programme or result.programme,
                "role": getattr(c, "role", "primary"),
                "nested": c.nested,
            }
            for c in result.components
        ],
        "baselineSlugs": getattr(result, "_baseline_slugs", []),
        "nestedSlugs": getattr(result, "_nested_slugs", []),
        "missingCount": len(result.missing),
        "warningCount": len(result.warnings),
    }
    return data, summary

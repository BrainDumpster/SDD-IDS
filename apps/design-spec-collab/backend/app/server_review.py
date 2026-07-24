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


def _find_design_spec(artifacts: list[Artifact]) -> str | None:
    for a in artifacts:
        name = (a.name or "").lower()
        if name.endswith("design-spec.md") or name == "outline.md" or "design-spec" in name:
            return a.content
    # fallback: first markdown
    for a in artifacts:
        if (a.name or "").endswith(".md"):
            return a.content
    return None


def _missing_sections(content: str) -> list[str]:
    missing = []
    for h in REQUIRED_HEADINGS:
        # Accept ## Heading
        pattern = rf"^##\s+{re.escape(h)}\s*$"
        if not re.search(pattern, content, flags=re.MULTILINE):
            missing.append(h)
    return missing


def review_session(
    session: CollabSession,
    *,
    artifacts: list[Artifact],
) -> ReviewVerdict:
    content = _find_design_spec(artifacts)
    if not content or not content.strip():
        return ReviewVerdict(
            decision="revise",
            score=0.0,
            feedback="No design-spec markdown artifact found. Produce design-spec.md with required ## sections.",
            missing_criteria=["design-spec.md missing or empty"],
        )

    missing = _missing_sections(content)
    score = max(0.0, 1.0 - (len(missing) / max(len(REQUIRED_HEADINGS), 1)))

    # Stub demo: force one revise even if nearly complete
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
            + (["stub_forced_revise"] if not missing else missing),
        )

    if missing:
        return ReviewVerdict(
            decision="revise",
            score=score,
            feedback="Missing required sections: " + ", ".join(missing),
            missing_criteria=missing,
        )

    # Optional ollama soft check — best effort
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
        feedback="All required sections present.",
        missing_criteria=[],
    )


def _ollama_soft_review(content: str) -> dict[str, Any] | None:
    try:
        import json

        import requests

        prompt = (
            "You are a design-spec reviewer. Reply JSON only: "
            '{"decision":"accept"|"revise","score":0-1,"feedback":"...","missing_criteria":[]} .\n'
            "Require the standard IDS design-spec ## sections.\n\n"
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
    slug = preview.get("slug") or "component"
    programme = preview.get("programme") or "ids"
    return [
        {
            "id": "req-write-spec",
            "kind": "write_design_spec",
            "instruction": (
                f"Using figma_evidence and the prompt_package skill checklist, write a production-ready "
                f"design-spec.md for {programme}/{slug}. Include every required ## section listed in "
                f"figma_evidence.required_sections. Use semantic tokens as var(--...). "
                f"Respect write_path_allowlist and guardrails."
            ),
            "expected_artifact": "design-spec.md",
        }
    ]


def build_revise_requests(
    session: CollabSession, verdict: ReviewVerdict
) -> list[dict[str, str]]:
    return [
        {
            "id": f"req-revise-{session.turn + 1}",
            "kind": "revise_sections",
            "instruction": (
                "Revise design-spec.md based on server feedback. "
                f"Feedback: {verdict.feedback}. "
                f"Missing/criteria: {', '.join(verdict.missing_criteria) or 'n/a'}. "
                "Return the full updated design-spec.md artifact."
            ),
            "expected_artifact": "design-spec.md",
        }
    ]

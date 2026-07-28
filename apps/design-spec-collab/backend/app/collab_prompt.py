"""Collab-only prompt overrides: server-packaged Figma evidence; no client Figma MCP."""

from __future__ import annotations

import re
from typing import Any


_COLLAB_GUARDRAILS = [
    "COLLAB: Figma was already fetched on the server into figma_evidence. "
    "Use only figma_evidence + context_artifacts (+ baseline_artifacts when present). "
    "Never call Figma MCP, mcp_auth, Figma REST, or ask the human to Authenticate Figma.",
    "COLLAB LLM-ONLY: Do NOT read, search, glob, grep, or open files from the local "
    "workspace / repo / random folders. Theme CSS, root-spec, programme yaml, maps, and "
    "authoring excerpts are already in context_artifacts. Do not invent alternate paths.",
    "COLLAB: context_artifacts with readOnly=true are given — use them as reference; "
    "do not re-fetch them from disk. Only write paths listed in client_requests.",
    "COLLAB: Do not open or load .cursor/skills/*/SKILL.md for live Figma steps. "
    "Follow skill structure/section rules from run_phase_checklist and client_requests only.",
    "Write-path allowlist: only create/modify paths listed under writePathAllowlist.",
    "Do not invent UI not present in packaged figma_evidence.",
    "Never echo or request CURSOR_API_KEY / FIGMA_TOKEN / GitHub tokens.",
]


def _rewrite_checklist_item(item: str) -> str | None:
    low = item.lower()
    if "live figma" in low or "mcp preferred" in low or "get_design_context" in low:
        return (
            "Read server-packaged figma_evidence.buckets.*.tools "
            "(get_design_context / get_variable_defs / get_screenshot / get_metadata equivalents). "
            "Do not call live Figma."
        )
    if "full mcp set" in low:
        return (
            "Use packaged programme figma_evidence only (no live MCP). "
            "Derive tokens, geometry, and states from evidence tools keys."
        )
    return item


def apply_collab_figma_overrides(
    prompt_package: dict[str, Any],
    *,
    job_kind: str = "create",
) -> dict[str, Any]:
    """Return a copy of prompt_package safe for collab clients (no live Figma)."""
    pkg = dict(prompt_package or {})
    pkg["job_kind"] = job_kind
    pkg["jobKind"] = job_kind
    pkg["skill_relative_path"] = None  # do not instruct client to open SKILL.md
    pkg["skillRelativePath"] = None
    pkg["collab_figma_mode"] = "server_packaged_only"
    pkg["collab_client_mode"] = "llm_only_no_filesystem"

    checklist = list(
        pkg.get("run_phase_checklist") or pkg.get("runPhaseChecklist") or []
    )
    rewritten: list[str] = []
    for item in checklist:
        out = _rewrite_checklist_item(str(item))
        if out:
            rewritten.append(out)
    rewritten.insert(
        0,
        "COLLAB: Author from figma_evidence + context_artifacts only — "
        "server already performed live Figma fetch and packaged supporting files.",
    )
    rewritten.insert(
        1,
        "COLLAB: Do not read the local filesystem. Supporting files are in context_artifacts.",
    )
    if job_kind == "update":
        rewritten.insert(
            2,
            "UPDATE: Diff figma_evidence against baseline_artifacts / context baselines; "
            "change only what Figma proves changed; preserve stable contracts; refresh "
            "Metadata Updated + Source Mapping; update Storybook when in scope.",
        )
    pkg["run_phase_checklist"] = rewritten
    pkg["runPhaseChecklist"] = rewritten

    guards = list(pkg.get("guardrails") or [])
    # Drop contradictory live-figma sounding lines; keep rest
    guards = [
        g
        for g in guards
        if "live figma" not in str(g).lower() and "figma mcp" not in str(g).lower()
    ]
    pkg["guardrails"] = _COLLAB_GUARDRAILS + guards

    text = str(pkg.get("prompt_text") or pkg.get("promptText") or "")
    if text:
        text = re.sub(
            r"(?im)^.*live figma.*$",
            "- Use packaged figma_evidence only (server-fetched).",
            text,
        )
        text = re.sub(
            r"(?im)^.*get_design_context.*$",
            "- Prefer figma_evidence.buckets.*.tools.get_design_context (packaged).",
            text,
        )
        preamble = (
            "## Collab Figma + context contract\n\n"
            "All Figma data is in `figma_evidence` (server REST). "
            "Supporting files (theme, root-spec, yaml, map, contract excerpt) are in "
            "`context_artifacts`. Do **not** authenticate Figma, use MCP, or read the "
            "local filesystem.\n\n"
        )
        if job_kind == "update":
            preamble += (
                "## Update contract\n\n"
                "Compare evidence to `baseline_artifacts` / context baselines. "
                "Update design-spec.md, map entry, and related Storybook only where needed.\n\n"
            )
        pkg["prompt_text"] = preamble + text
        pkg["promptText"] = pkg["prompt_text"]

    return pkg


def rewrite_client_requests_for_collab(
    requests: list[dict[str, Any]],
    *,
    job_kind: str = "create",
) -> list[dict[str, Any]]:
    out: list[dict[str, Any]] = []
    fs_ban = (
        " Do not read/search the local filesystem; use figma_evidence and "
        "context_artifacts only."
    )
    for req in requests:
        r = dict(req)
        instr = str(r.get("instruction") or "")
        instr = instr.replace(
            "Follow the `design-spec-intake-wizard` run-phase rules",
            "Follow design-spec-intake-wizard **section/structure** rules",
        )
        instr = instr.replace(
            "Follow the `design-spec-programme-inheritance` run-phase rules",
            "Follow design-spec-programme-inheritance **section/structure** rules",
        )
        if "Using server-packaged figma_evidence" not in instr:
            instr += (
                " Use server-packaged figma_evidence only; skip any skill steps that "
                "call live Figma MCP."
            )
        if "local filesystem" not in instr.lower():
            instr += fs_ban
        if r.get("kind") == "write_design_spec":
            instr += (
                " Hard requirements from packaged evidence: "
                "(1) `### Slot geometry (Figma-verified)` with border-radius citing node ids / "
                "boundVariableHints / get_variable_defs; "
                "(2) state matrices Background/Border/Text-Icon using `var(--…)`; "
                "(3) complete Codegen Contract subsections; "
                "(4) Source Mapping with file key, node ids, and verification method "
                f"from figma_evidence.clientGuidance; "
                "(5) you are the authoring LLM — do not ask the human to write the spec; "
                "(6) for theme/token names prefer context_artifacts theme CSS + "
                "docs/design-spec-authoring-contract.md#excerpt."
            )
        if r.get("kind") == "write_data_registry":
            instr += (
                " Start from the packaged map/registry in context_artifacts "
                "(including `#entry` slices); do not open map files from disk."
            )
        if job_kind == "update" and r.get("kind") == "write_design_spec":
            instr = (
                "UPDATE existing design-spec.md in place (same path). "
                + instr
                + " Diff against baseline_artifacts; do not create a new slug."
            )
        r["instruction"] = instr
        out.append(r)
    return out


def build_client_authoring_checklist(*, job_kind: str = "create") -> list[str]:
    """Operator-facing + session markdown checklist for the client LLM."""
    items = [
        "Claim the session, then GET /work — use only packaged figma_evidence + context_artifacts.",
        "Do NOT read/search/glob the local filesystem or random workspace folders.",
        "Never Authenticate Figma / never call Figma MCP from the client.",
        "Author the full design-spec.md yourself from evidence (you are the author).",
        "Include `### Slot geometry (Figma-verified)` with radius rows citing Figma nodes.",
        "Prefer semantic `var(--token)` from tools.get_variable_defs / boundVariableHints.",
        "Fill all required ## sections + Codegen Contract subsections.",
        "Source Mapping: file key + node ids + verification method from evidence.",
        "Submit every client_requests artifact only (skip foundation if not listed — already on server).",
        "On revise: fix prior_feedback exactly; resubmit full artifact set.",
    ]
    if job_kind == "update":
        items.insert(
            4,
            "UPDATE: diff evidence vs baseline_artifacts; change only what Figma proves.",
        )
    return items


def build_change_hints(
    *,
    baseline_spec: str | None,
    figma_evidence: dict[str, Any],
) -> list[str]:
    """Best-effort hints — not a hard gate."""
    hints: list[str] = []
    if not baseline_spec:
        hints.append("No baseline design-spec.md loaded — treat as full rewrite from evidence.")
        return hints

    # Token-like var(--...) in evidence variables vs baseline
    evidence_vars: set[str] = set()
    buckets = figma_evidence.get("buckets") or {}
    for rows in buckets.values() if isinstance(buckets, dict) else []:
        if not isinstance(rows, list):
            continue
        for row in rows:
            if not isinstance(row, dict):
                continue
            tools = row.get("tools") if isinstance(row.get("tools"), dict) else {}
            for key in ("get_variable_defs", "variables"):
                blob = tools.get(key) or row.get("variables")
                if isinstance(blob, dict):
                    for k in blob.keys():
                        evidence_vars.add(str(k))
                elif isinstance(blob, str):
                    evidence_vars.update(re.findall(r"--[\w-]+", blob))

    baseline_vars = set(re.findall(r"var\((--[\w-]+)\)", baseline_spec))
    if evidence_vars and baseline_vars:
        # crude: new names appearing in evidence keys that look like tokens
        novel = {v for v in evidence_vars if v.startswith("--") and v not in baseline_vars}
        if novel:
            sample = ", ".join(sorted(novel)[:8])
            hints.append(f"Possible new token names in evidence vs baseline: {sample}")

    if "### Slot geometry (Figma-verified)" not in baseline_spec:
        hints.append("Baseline missing Slot geometry table — add from packaged evidence.")

    if not hints:
        hints.append(
            "No automatic token delta detected; still verify states/layout against evidence."
        )
    return hints

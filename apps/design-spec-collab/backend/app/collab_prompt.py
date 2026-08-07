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

_REVIEW_REVISE_GUARDRAILS = [
    "REVIEW REVISE CONTINUITY: baseline_artifacts (role=baseline) are the PR-head "
    "source of truth. Start from that exact content. Apply prior_feedback as a "
    "minimal patch. Preserve every section, wording, token, and Storybook export "
    "not implicated by feedback. Do not regenerate the component from scratch.",
    "REVIEW REVISE: figma_evidence is for verifying feedback claims only — not a "
    "license to rewrite Metadata, Layout, Tokens, States, Codegen, or CSF anew.",
    "REVIEW REVISE Storybook: edit the baseline `*.stories.tsx` in place. Keep the "
    "same meta.title, story export names, and structure unless feedback asks "
    "otherwise. Always include `import React from \"react\";` when the file uses JSX "
    "or `React.*`.",
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
    if "main.ts" in low and ("mandatory" in low or "update storybook" in low or "ensure storybook" in low):
        return (
            "If storybookExamples: submit Spec Accurate Design under "
            "storybook-generated/<programme>/src/… only. Do not submit "
            "storybook/.storybook/main.ts — globs already discover storybook-generated/*/."
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
    if job_kind in ("update", "review_revise"):
        rewritten.insert(
            2,
            (
                "REVIEW REVISE: Copy baseline design-spec + Storybook from "
                "baseline_artifacts; apply prior_feedback as a minimal diff; change "
                "only what feedback + Figma prove; preserve stable contracts, section "
                "order, and story export names; refresh Metadata Updated + Source "
                "Mapping only if evidence warrants it. Publish stays on the existing "
                "PR branch — do not invent a new slug. Do NOT full-rewrite."
                if job_kind == "review_revise"
                else (
                    "UPDATE: Start from baseline_artifacts; apply the operator ask "
                    "(minimal vs fuller based on the prompt). Use figma_evidence only when "
                    "mode is not skipped. Preserve stable contracts; refresh Metadata "
                    "Updated + Source Mapping when evidence warrants; update Storybook "
                    "when in scope. Never touch programme-inheritance-registry.json. "
                    "Publish to a new update/{slug}-* branch + new PR."
                )
            ),
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
    base_guards = list(_COLLAB_GUARDRAILS)
    if job_kind == "review_revise":
        base_guards = base_guards + list(_REVIEW_REVISE_GUARDRAILS)
    pkg["guardrails"] = base_guards + guards

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
        if job_kind == "review_revise":
            preamble += (
                "## Review revise contract (continuity — mandatory)\n\n"
                "You are revising an **existing open PR**. The PR-head files in "
                "`baseline_artifacts` (role=`baseline`) are authoritative.\n\n"
                "1. **Start from the baseline text** for design-spec.md and "
                "`*.stories.tsx` — copy it, then patch.\n"
                "2. Address `prior_feedback` only (plus tiny fixes Figma proves are wrong).\n"
                "3. **Do not** regenerate the whole spec/CSF from `figma_evidence`.\n"
                "4. Keep the same slug, paths, meta.title, and story export names.\n"
                "5. Submit full files (API requires full artifacts) but the **diff vs "
                "baseline must be minimal** — reviewers will reject wholesale rewrites.\n"
                "6. Storybook: keep `import React from \"react\";` when using JSX / "
                "`React.*`.\n\n"
            )
        elif job_kind == "update":
            preamble += (
                "## Catalogue Update contract\n\n"
                "You are updating an **existing catalogue component**. Publish creates a "
                "**new** branch `update/{slug}-{session}` and a **new** PR "
                "(never reuse an open Review PR).\n\n"
                "1. Start from `baseline_artifacts` / context baselines for design-spec.md "
                "and Storybook.\n"
                "2. Scope the diff to the operator `additional_prompt` / feedback — "
                "minimal when the ask is small; fuller only when the ask requires it.\n"
                "3. If `figma_evidence.mode` is `skipped`, do **not** invent Figma-driven "
                "visual changes — text/API/docs-only patches from the prompt.\n"
                "4. Do **not** modify `data/programme-inheritance-registry.json`.\n"
                "5. Update the figma map file only when it is listed in client_requests "
                "(extra URLs were provided).\n"
                "6. Do **not** recreate programme theme/root-spec/yaml.\n"
                "7. Storybook: keep `import React from \"react\";` when using JSX.\n\n"
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
            if job_kind == "review_revise":
                instr += (
                    " Hard requirements: start from the baseline design-spec.md in "
                    "baseline_artifacts / context_artifacts (role=baseline). Apply "
                    "prior_feedback as a minimal patch. Keep Slot geometry, state "
                    "matrices, Codegen Contract, and Source Mapping unless feedback "
                    "targets them. Prefer semantic `var(--…)` already in the baseline. "
                    "You are patching an existing PR file — do not ask the human to "
                    "rewrite the spec, and do not regenerate from figma_evidence alone."
                )
            else:
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
        if r.get("kind") == "write_storybook_examples":
            fidelity = (
                " STORYBOOK FIDELITY: Submit full-file artifacts only (no client repo, no "
                "local scripts): `storybook/src/components/<Pascal>.tsx` + "
                "`<Pascal>.module.css` with real controls / DS primitives, plus CSF under "
                "storybook-generated that **imports** that module (Spec Accurate Design). "
                "Never redefine the component as an inline div/span mock with style={{…}} "
                "inside the stories file. Build strictly from the design-spec.md in "
                "baseline_artifacts / context_artifacts (or authored this turn). "
                "Do not invent structure, variants, or placeholder markup."
            )
            if job_kind == "review_revise":
                instr = (
                    "REVISE existing Storybook **component + CSS + CSF** artifacts in place "
                    "on the same PR branch. Copy baselines from baseline_artifacts / "
                    "context_artifacts, then apply prior_feedback. Keep meta.title and story "
                    "export names unless feedback renames them. Always include "
                    '`import React from "react";` when JSX or `React.*` is used. '
                    + instr
                    + fidelity
                    + " Do not invent a brand-new stories-only mock from scratch."
                )
            else:
                instr += fidelity
        if r.get("kind") == "write_design_spec":
            # Ensure create jobs also see the existing-component gate (rewrite may run
            # after build_initial_requests already embedded the note).
            if "BEFORE authoring" not in instr and job_kind == "create":
                instr += (
                    " BEFORE authoring: check context_artifacts for an existing "
                    "`storybook/src/components/<Pascal>.tsx` / `.module.css` / stories "
                    "(packaged by the server) — align Composition & API with that module "
                    "when present. Do not search a local filesystem."
                )
            if job_kind in ("update", "review_revise"):
                prefix = (
                    "REVISE existing design-spec.md in place on the same PR branch. "
                    "Start from baseline_artifacts content; emit a full file whose "
                    "changes vs baseline are minimal. "
                    if job_kind == "review_revise"
                    else "UPDATE existing design-spec.md in place (same path). "
                )
                instr = (
                    prefix
                    + instr
                    + " Diff against baseline_artifacts; do not create a new slug."
                    + (
                        " Apply reviewer feedback from prior_feedback."
                        if job_kind == "review_revise"
                        else ""
                    )
                )
        r["instruction"] = instr
        out.append(r)
    return out


def build_client_authoring_checklist(*, job_kind: str = "create") -> list[str]:
    """Operator-facing + session markdown checklist for the client LLM."""
    if job_kind == "review_revise":
        return [
            "Claim the session, then GET /work — use baseline_artifacts + prior_feedback.",
            "Do NOT read/search/glob the local filesystem or random workspace folders.",
            "Never Authenticate Figma / never call Figma MCP from the client.",
            "REVIEW REVISE: copy PR-head baseline design-spec + Storybook; apply prior_feedback as a minimal patch.",
            "Do NOT full-rewrite from figma_evidence — preserve unchanged sections and story exports.",
            "Same slug/path/PR branch; refresh Metadata Updated only if needed.",
            "Storybook must match design-spec Anatomy/Layout/Tokens/States (no fake div-inputs).",
            "Storybook: submit runtime component + CSS module + CSF that imports it (session artifacts only — no client repo/scripts).",
            "Storybook: keep `import React from \"react\";` when using JSX / React.*.",
            "Submit every client_requests artifact (full files) but keep the diff small.",
            "On revise: fix prior_feedback exactly; do not invent unrelated redesigns.",
        ]
    items = [
        "Claim the session, then GET /work — use only packaged figma_evidence + context_artifacts.",
        "Do NOT read/search/glob the local filesystem or random workspace folders.",
        "Never Authenticate Figma / never call Figma MCP from the client.",
        "BEFORE design-spec: check context_artifacts for existing storybook/src/components/<Pascal>.* and stories (server-packaged); reuse that Runtime API when present.",
        "Author the full design-spec.md yourself from evidence (you are the author).",
        "Include `### Slot geometry (Figma-verified)` with radius rows citing Figma nodes.",
        "Prefer semantic `var(--token)` from tools.get_variable_defs / boundVariableHints.",
        "Fill all required ## sections + Codegen Contract subsections.",
        "Source Mapping: file key + node ids + verification method from evidence.",
        "If storybookExamples: submit runtime .tsx + .module.css + Spec Accurate Design CSF that imports the module (not an inline div mock). No local checkout or Storybook gate.",
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

#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
from pathlib import Path
from typing import List

PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from config.design_system_config import load_design_system


def discover_components(components_dir: Path) -> List[str]:
    out: List[str] = []
    if not components_dir.exists():
        return out
    for child in components_dir.iterdir():
        if child.is_dir() and (child / "design-spec.md").exists():
            out.append(child.name)
    return sorted(out)


def parse_args() -> argparse.Namespace:
    from generation.style_modes import StyleMode

    parser = argparse.ArgumentParser(description="Strict spec->storybook zero-drift gate")
    parser.add_argument("--component", help="Component slug, e.g. button")
    parser.add_argument("--all", action="store_true", help="Process all components")
    parser.add_argument("--framework", default="React", choices=["React", "Angular"])
    parser.add_argument(
        "--spec-only",
        action="store_true",
        help="Deprecated: specs/theme-only is now the default (kept for backward compatibility)",
    )
    parser.add_argument(
        "--deterministic-story",
        action="store_true",
        help="Generate Storybook stories offline from spec contracts (no LLM)",
    )
    parser.add_argument(
        "--style-mode",
        default="css-module",
        choices=[mode.value for mode in StyleMode],
    )
    parser.add_argument(
        "--build-storybook",
        action="store_true",
        help="Run storybook build after validations",
    )
    return parser.parse_args()


def has_component_delta_in_root_spec(root_spec_path: Path, component: str) -> bool:
    if not root_spec_path.exists() or not root_spec_path.is_file():
        return False
    text = root_spec_path.read_text(encoding="utf-8")
    component_key = component.strip().lower().replace("_", "-")
    # Matches headings such as:
    # ### Button (DAP vs IDS baseline)
    # ### Radio Button (...)
    heading_pattern = re.compile(r"^###\s+(.+?)\s*(?:\(|$)", re.IGNORECASE | re.MULTILINE)
    for match in heading_pattern.finditer(text):
        heading = match.group(1).strip().lower().replace("_", "-").replace(" ", "-")
        if heading == component_key:
            return True
    return False


def _extract_spec_tokens(spec_text: str) -> List[str]:
    # Capture semantic CSS vars used in the spec, e.g. var(--color-text-neutral)
    matches = re.findall(r"var\(\s*(--[a-zA-Z0-9\-_]+)", spec_text or "")
    seen = set()
    ordered: List[str] = []
    for token in matches:
        if token not in seen:
            seen.add(token)
            ordered.append(token)
    return ordered


def _extract_token_references(spec_text: str) -> dict[str, List[str]]:
    refs: dict[str, List[str]] = {}
    current_section = "Spec"
    for raw_line in (spec_text or "").splitlines():
        line = raw_line.strip()
        if not line:
            continue
        if line.startswith("## "):
            current_section = line[3:].strip()
            continue
        matches = re.findall(r"var\(\s*(--[a-zA-Z0-9\-_]+)", line)
        if not matches:
            continue
        context = line
        if len(context) > 120:
            context = context[:117] + "..."
        for token in matches:
            refs.setdefault(token, [])
            label = f"{current_section}: {context}"
            if label not in refs[token]:
                refs[token].append(label)
    return refs


def _append_token_inspector_story(storybook_text: str, spec_text: str) -> str:
    if "export const TokenInspector" in storybook_text:
        return storybook_text

    tokens = _extract_spec_tokens(spec_text)
    if not tokens:
        return storybook_text
    token_refs = _extract_token_references(spec_text)

    token_array = ", ".join(json.dumps(token) for token in tokens)
    token_refs_obj = json.dumps(token_refs, ensure_ascii=True)
    inspector_block = f"""

const specTokens = [{token_array}] as const;
const specTokenRefs = {token_refs_obj} as Record<string, string[]>;

export const TokenInspector: Story = {{
  render: () => (
    <div className="sbTokenInspector">
      <style>{{
        `
        .sbTokenInspector {{
          display: grid;
          gap: 8px;
          max-width: 880px;
        }}
        .sbTokenHeader {{
          font-size: 12px;
          opacity: 0.8;
        }}
        .sbTokenRow {{
          display: grid;
          grid-template-columns: minmax(260px, 1fr) 72px 120px minmax(260px, 1fr);
          align-items: start;
          gap: 12px;
          padding: 6px 8px;
          border: 1px solid var(--color-border-neutral-light, #c5c5c5);
          border-radius: 4px;
          background: var(--color-background-component, #ffffff);
        }}
        .sbTokenCode {{
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          font-size: 12px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }}
        .sbTokenSwatch {{
          width: 64px;
          height: 20px;
          border: 1px solid var(--color-border-accessible, #757575);
          border-radius: 2px;
          background: transparent;
        }}
        .sbTokenSample {{
          font-size: 12px;
          white-space: nowrap;
        }}
        .sbTokenRefs {{
          display: grid;
          gap: 2px;
          font-size: 11px;
          line-height: 16px;
          opacity: 0.9;
        }}
        .sbTokenRef {{
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }}
        `
      }}</style>
      <div className="sbTokenHeader">Spec token inspector (name + live preview + where token is referenced in spec)</div>
      {{specTokens.map((token) => (
        <div key={{token}} className="sbTokenRow">
          <span className="sbTokenCode">{{`var(${{token}})`}}</span>
          <span className="sbTokenSwatch" style={{{{ background: `var(${{token}})` }}}} />
          <span className="sbTokenSample" style={{{{ color: `var(${{token}})` }}}}>Sample</span>
          <div className="sbTokenRefs">
            {{(specTokenRefs[token] || []).slice(0, 3).map((ref, idx) => (
              <div key={{`${{token}}-${{idx}}`}} className="sbTokenRef" title={{ref}}>{{ref}}</div>
            ))}}
            {{(specTokenRefs[token] || []).length === 0 ? <div className="sbTokenRef">No direct spec reference found</div> : null}}
            {{(specTokenRefs[token] || []).length > 3 ? (
              <div className="sbTokenRef">+{{(specTokenRefs[token] || []).length - 3}} more</div>
            ) : null}}
          </div>
        </div>
      ))}}
    </div>
  ),
}};
"""
    return storybook_text.rstrip() + inspector_block + "\n"


def main() -> int:
    args = parse_args()
    if not args.component and not args.all:
        print("Provide --component <slug> or --all")
        return 2

    from generation.component_context_compiler import ComponentContextCompiler
    from generation.deterministic_storybook.engine import generate_story_for_component
    from generation.storybook_sync import (
        compute_spec_layer_hash,
        ensure_storybook_theme_import,
        extract_existing_spec_hash,
        get_story_path,
        idempotent_drift,
        prepend_generated_header,
        story_header,
        write_generated_story,
    )
    from generation.style_modes import StyleMode
    from validation.design_validator import DesignValidator
    from generation.deterministic_storybook.models import DeterministicStorybookOptions
    from validation.spec_contract_parser import SpecContractParser

    design_system = os.getenv("DESIGN_SYSTEM", "ids")
    cfg = load_design_system(design_system)
    project_root = cfg.project_root
    generated_root = (project_root / cfg.generated_storybook_dir).resolve()
    legacy_storybook_root = (project_root / "storybook").resolve()
    if generated_root == legacy_storybook_root or legacy_storybook_root in generated_root.parents:
        print("generated_storybook_dir must not be inside legacy storybook/")
        return 2
    generated_root.mkdir(parents=True, exist_ok=True)

    compiler = ComponentContextCompiler(config=cfg)
    generator = None
    if not args.deterministic_story:
        from generation.component_generator import ComponentGenerator
        generator = ComponentGenerator()
    validator = DesignValidator()
    style_mode = StyleMode(args.style_mode)
    spec_parser = SpecContractParser()

    if args.all:
        components = discover_components(project_root / cfg.baseline_components_dir)
    else:
        components = [args.component]

    failures: List[str] = []

    for component in components:
        print(f"🔍 Processing {component}")
        context = compiler.compile(component, f"Generate {component} component + strict Storybook stories")
        generated = {}
        storybook_text = ""

        if args.deterministic_story:
            # Offline story generation: derive from spec contract only.
            contract = spec_parser.parse(context.get("spec", ""))
            story_path = get_story_path(component_slug=component, generated_root=generated_root)

            program_spec = (project_root / cfg.program_components_dir / component / "design-spec.md").resolve()
            program_root_spec = (project_root / cfg.program_root_spec_path).resolve()
            has_program_delta = has_component_delta_in_root_spec(program_root_spec, component)
            is_program_core = design_system.lower() != "ids" and program_spec.exists()
            component_prefix = cfg.display_name if is_program_core else "Ids"
            story_title_system = "IDS" if design_system.lower() == "ids" else cfg.display_name

            spec_body = context.get("spec", "")
            det_options = DeterministicStorybookOptions(
                title_prefix=f"Spec Generated/{story_title_system}",
                include_state_harness=True,
                component_prefix=component_prefix,
                design_system_slug=design_system.lower(),
                apply_program_deltas=has_program_delta,
                spec_text=spec_body,
            )

            # Spec-derived Toast layout CSS: IDS layered spec → shared Toast.module.css (before story emission).
            if (
                design_system.lower() == "ids"
                and component.lower() == "toast"
                and spec_body.strip()
            ):
                from generation.spec_derived.toast import parse_toast_spec, render_toast_module_css

                toast_css_path = (project_root / "storybook" / "src" / "components" / "Toast.module.css").resolve()
                try:
                    model = parse_toast_spec(spec_body)
                    toast_css_path.write_text(render_toast_module_css(model), encoding="utf-8")
                    print("✅ toast: Toast.module.css synced from IDS toast spec")
                except Exception as exc:
                    failures.append(f"{component}: spec-derived Toast.module.css failed ({exc})")

            storybook_text = generate_story_for_component(
                design_system=design_system,
                component=component,
                repo_root=project_root,
                story_path=story_path,
                contract=contract,
                options=det_options,
            ) or ""
            if not storybook_text:
                failures.append(f"{component}: deterministic story generator not implemented yet")
                continue
            if design_system.lower() != "ids" and (has_program_delta or program_spec.exists()) and not context.get("spec", "").strip():
                failures.append(f"{component}: expected layered program spec context but got empty compiled spec")
                continue
        else:
            if generator is None:
                failures.append(f"{component}: LLM generator unavailable")
                continue
            generated = generator.generate(context=context, framework=args.framework, style_mode=style_mode)
            storybook_text = generated.get("storybook", "")

        if not storybook_text.strip():
            failures.append(f"{component}: generator did not return STORYBOOK section")
            continue

        storybook_text = _append_token_inspector_story(
            storybook_text=storybook_text,
            spec_text=context.get("spec", ""),
        )
        storybook_text = ensure_storybook_theme_import(
            storybook_text, design_system.lower()
        )

        spec_hash = compute_spec_layer_hash(context)
        header = story_header(component, spec_hash)
        storybook_text = prepend_generated_header(storybook_text, header)

        # Persist spec-hash contract marker (offline + LLM flows)
        contracts_dir = generated_root / "src/spec-contracts"
        contracts_dir.mkdir(parents=True, exist_ok=True)
        (contracts_dir / f"{component}.spec-layer-hash.json").write_text(
            json.dumps({"component": component, "spec_hash": spec_hash}, indent=2),
            encoding="utf-8",
        )

        # Persist generated component artifacts only in LLM generation mode
        if not args.deterministic_story:
            component_name = "".join(part.capitalize() for part in re.split(r"[^a-zA-Z0-9]+", component) if part)
            component_dir = generated_root / "src/components"
            component_dir.mkdir(parents=True, exist_ok=True)
            (component_dir / f"{component_name}.generated.tsx").write_text(generated.get("component", ""), encoding="utf-8")
            if generated.get("css"):
                (component_dir / f"{component_name}.generated.module.css").write_text(generated.get("css", ""), encoding="utf-8")

        story_path = get_story_path(component_slug=component, generated_root=generated_root)
        old_hash = extract_existing_spec_hash(story_path)

        try:
            story_path = write_generated_story(
                component_slug=component,
                storybook_code=storybook_text,
                generated_root=generated_root,
            )
        except Exception as exc:
            failures.append(f"{component}: failed to write story ({exc})")
            continue

        new_hash = spec_hash
        if old_hash and old_hash != new_hash and cfg.strict_storybook_gate:
            failures.append(f"{component}: stale story hash detected ({old_hash} != {new_hash})")

        css_for_gate = generated.get("css", "") if isinstance(generated, dict) else ""
        if args.deterministic_story and component.lower() == "toast":
            toast_css = (project_root / "storybook" / "src" / "components" / "Toast.module.css").resolve()
            if toast_css.is_file():
                css_for_gate = toast_css.read_text(encoding="utf-8")

        gate = validator.validate_spec_storybook(
            spec_text=context.get("spec", ""),
            css_text=css_for_gate,
            storybook_text=storybook_text,
        )
        if not gate.passed:
            failures.extend(f"{component}: {err}" for err in gate.errors)

        # Idempotency quick check
        re_written = prepend_generated_header(storybook_text, header)
        if idempotent_drift(storybook_text, re_written):
            failures.append(f"{component}: non-idempotent story serialization")

    if args.build_storybook:
        storybook_dir = project_root / "storybook"
        if (storybook_dir / "package.json").exists():
            print("🏗️ Running Storybook build...")
            proc = subprocess.run(
                ["npm", "run", "build"],
                cwd=str(storybook_dir),
                capture_output=True,
                text=True,
            )
            if proc.returncode != 0:
                failures.append("storybook build failed")
                sys.stdout.write(proc.stdout)
                sys.stderr.write(proc.stderr)

    if failures:
        print("\n❌ STRICT GATE FAILED")
        for fail in failures:
            print(f"- {fail}")
        return 1

    print("\n✅ STRICT GATE PASSED")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

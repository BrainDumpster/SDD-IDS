---
name: ids-design-mcp
description: Use the IDS Design Spec MCP server for design-spec, tokens, states, Composition API, and Storybook Docs context when implementing or documenting IDS/programme components.
---

# IDS Design Spec MCP — Agent Skill

> Instruction for AI agents. Developers connecting a client: see [`mcp-server/USER_GUIDE.md`](../../mcp-server/USER_GUIDE.md).

## What this is

The **IDS Design Spec MCP** server exposes design-system context from the SDD-IDS repository (via GitHub / GHES Contents API): `design-spec.md`, `root-spec.md`, theme CSS, and Storybook Docs (`*.developer-usage.*`).

The server returns **documentation text**. It does **not** generate or validate component code — the agent does.

## How to connect

```json
{
  "mcpServers": {
    "sdd-ids-design-spec": {
      "url": "http://localhost:3000/mcp",
      "headers": {
        "Content-Type": "application/json",
        "Accept": "application/json, text/event-stream"
      }
    }
  }
}
```

Use the deployed intranet URL instead of `localhost` when the team hosts the Docker image. Auth to GitHub is **server-side** (`GITHUB_PERSONAL_ACCESS_TOKEN`); clients do not send a GitHub PAT.

## Parameters

| Param | Default | Notes |
|-------|---------|-------|
| `programme` | `ids` | Folder under `components/` — case-sensitive (`ids`, `synapse`, `DAP`, …) |
| `componentName` | — | Slug under `components/<programme>/` |
| `framework` | `react` | `react` \| `angular` (Storybook / usage docs only) |

**Versioning:** content is pinned by server `GITHUB_REF` (e.g. `main` / `master`). There is no per-call semantic version and no `refresh_cache` tool.

## Tools — when to call

| Tool | When |
|------|------|
| `get_lib_generation_context` | **Mandatory** for pixel-perfect `lib/` codegen (React/Angular) |
| `resolve_component_dependencies` | Spec-declared deps only (assets vs peers + lib/spec existence) |
| `discover_design_system` | First exploration; inventory programmes / categories / tools |
| `list_components` | List slugs for a programme |
| `search_registry` | Find a name across programmes + inheritance |
| `get_design_spec` | Full design-spec for Q&A / review (not sole lib input) |
| `get_design_spec_section` | One or more `##` sections (aliases: tokens, states, composition, …) |
| `get_composition_api` | Props, events, anatomy / composition tree |
| `get_component_states` | Light/Dark state matrices |
| `get_component_tokens` | Tokens + Layout & Measurements |
| `get_foundation_tokens` | Global color/spacing/typography/… (+ optional theme CSS) |
| `get_design_principles` | Identity, interaction, a11y, theming, codegen baseline |
| `get_usage_examples` | Storybook Docs / developer-usage (usage only) |
| `get_component_context` | Large exploratory bundle (prefer lib tool for codegen) |

## Preferred call order

**Generate pixel-perfect `lib/` component (e.g. “Implement Button using IDS Design”)**

1. Detect programme + framework (Section 10) or ask if unclear.
2. Call **`get_lib_generation_context`** → `{ programme, componentName, framework }`.
3. If `ok: false` / blockers → **STOP**; do not invent missing theme aliases or geometry.
4. Read **Component dependencies (resolved)** in the pack (or call `resolve_component_dependencies`). If `dependencyAction: ask_user` → **ask the user** before generating peers.
5. Write files under `lib/react/<programme>/<slug>/` or `lib/angular/<programme>/<slug>/` using **only** returned design-spec, root-spec, filtered theme CSS tokens, contracts, and lib path rules.
6. Every visual value must be a `var(--…)` from the pack (or an explicit literal only if the pack documents that literal with no token).

**IDE Q&A / usage (not lib codegen)**

1. `search_registry` / `list_components` if the slug is unknown.
2. `get_composition_api` / `get_design_spec` / section tools as needed.
3. `get_usage_examples` for Storybook Docs patterns.

## Example workflows

### Implement IDS Button into `lib/react` (pixel-perfect)

1. `get_lib_generation_context` → `{ "programme": "ids", "componentName": "button", "framework": "react" }`
2. Confirm meta `ok: true` and review filtered theme CSS (includes `--button-control-radius`, state colors, etc.).
3. Generate `lib/react/ids/button/IdsButton.tsx` + `IdsButton.module.css` + `index.ts` matching Composition & API, Layout, States, and Codegen Contract — **no invented tokens**.

### Implement IdsAccordion Docs usage only

1. `get_composition_api` + `get_usage_examples` (framework react)
2. Do **not** treat this as sufficient for `lib/` visual parity — use `get_lib_generation_context` for lib.

### Synapse component with IDS inheritance (lib)

1. `get_lib_generation_context` → `{ "programme": "synapse", "componentName": "<slug>", "framework": "react" }`
2. Apply programme delta over IDS baseline sections in the pack; use filtered theme (IDS + programme).

### “What components exist?”

1. `discover_design_system` or `list_components`
2. Then `get_lib_generation_context` or `get_design_spec` for a chosen slug

## MCP Resources

Clients that support resources can browse:

- `sdd://programmes`
- `sdd://documentation/{programme}/components`
- `sdd://documentation/{programme}/components/{slug}`
- `sdd://documentation/{programme}/foundations/{category}`

## Agent best practices

- Do not invent props, slots, or token names — quote MCP output.
- On `isError: true`, treat as a documentation miss (wrong slug/programme), not a server crash; use `search_registry` / `list_components` and any **Did you mean** suggestions.
- Prefer section tools over `get_component_context` to save context window.
- Programme names are case-sensitive (`DAP` ≠ `dap` for the folder).

## Cross-component dependencies (spec-declared only)

Follow **only** what Composition & API / Codegen Contract / asset contract declare. No guessing.

| Declared in pack | Agent action |
|------------------|--------------|
| Asset (`iconSlug`, SVG path, mask/img, missing-asset fallback) | Implement inside the requested component. Do **not** require implementing another component unless named. |
| Named peer (`IdsIcon`, `IdsButton`, …) + `lib/` exists | Import / refer. |
| Named peer required + `lib/` missing | Ask user: implement with this component, defer, or slot-only. |
| Not in pack (agent suspicion only) | Ask once; do not add unilaterally. |

MCP: `resolve_component_dependencies` (also embedded in `get_lib_generation_context`) returns resolutions `asset_only` | `use_existing` | `missing_ask_user` | `optional_missing` from **`### Component dependencies (codegen)`** only (asset-resolution fallback for assets when the table is absent). Free prose is ignored.

Example: IDS Button pack declares leading-icon as an **asset** row — not a hard dependency on Icon.

## Limitations

- Documentation-based, not generative or validating.
- Live GitHub fetch — wrong/expired PAT or wrong `GITHUB_REF` yields 401/404.
- No UX-pattern or utility corpus (unlike DDS).
- No visual / screenshot rendering.
- `framework` today is only `react` | `angular` for Storybook Docs paths.

## Programme / framework detection

Run when you need MCP params and the user did not specify programme/framework.

Save and run the script in **Section 10** (or execute inline). Interpret JSON:

- Prefer explicit user overrides.
- Default programme `ids` if nothing matches.
- Use `framework: "angular"` only when Angular Storybook / `@angular/core` dominates; otherwise `react`.

### Section 10 — Detection script

<!-- START NODE SCRIPT -->
```javascript
const fs = require('fs');
const path = require('path');

const IGNORE = new Set(['node_modules', '.git', 'dist', 'build', '.idea', '.vscode', 'mcp-server']);

function detect(rootDir) {
  const programmes = [];
  const componentsDir = path.join(rootDir, 'components');
  if (fs.existsSync(componentsDir)) {
    for (const name of fs.readdirSync(componentsDir).sort()) {
      const full = path.join(componentsDir, name);
      if (fs.statSync(full).isDirectory() && !name.startsWith('.')) {
        programmes.push(name);
      }
    }
  }

  let designSystemEnv = null;
  try {
    const envPath = path.join(rootDir, '.env');
    if (fs.existsSync(envPath)) {
      const m = fs.readFileSync(envPath, 'utf8').match(/^DESIGN_SYSTEM\s*=\s*(.+)$/m);
      if (m) designSystemEnv = m[1].trim().replace(/^["']|["']$/g, '');
    }
  } catch (_) {}

  const projects = [];
  function walk(dir, depth) {
    if (depth > 2) return;
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch (_) {
      return;
    }
    for (const e of entries.sort((a, b) => a.name.localeCompare(b.name))) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (!IGNORE.has(e.name) && !e.name.startsWith('.')) walk(full, depth + 1);
      } else if (e.name === 'package.json') {
        let pkg;
        try {
          pkg = JSON.parse(fs.readFileSync(full, 'utf8'));
        } catch (_) {
          continue;
        }
        const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
        let framework = 'react';
        if (deps['@angular/core'] && !deps['react']) framework = 'angular';
        else if (deps['react'] || deps['react-dom']) framework = 'react';
        const rel = './' + path.relative(rootDir, dir).replace(/\\/g, '/');
        projects.push({
          path: rel === './' ? '.' : rel,
          framework,
          hasAngular: Boolean(deps['@angular/core']),
          hasReact: Boolean(deps['react'] || deps['react-dom']),
        });
      }
    }
  }
  walk(rootDir, 0);

  const programmeGuess =
    designSystemEnv === 'synapse' || designSystemEnv === 'Synapse'
      ? 'synapse'
      : designSystemEnv === 'dap' || designSystemEnv === 'DAP'
        ? 'DAP'
        : designSystemEnv === 'powerflex' || designSystemEnv === 'PowerFlex'
          ? 'powerflex'
          : programmes.includes('ids')
            ? 'ids'
            : programmes[0] || 'ids';

  const frameworkGuess = projects.some((p) => p.path.includes('storybook-angular'))
    ? 'angular'
    : projects.some((p) => p.hasAngular && !p.hasReact)
      ? 'angular'
      : 'react';

  return {
    programmes,
    suggestedProgramme: programmeGuess,
    suggestedFramework: frameworkGuess,
    designSystemEnv,
    projects,
  };
}

console.log(JSON.stringify(detect(process.cwd()), null, 2));
```
<!-- END NODE SCRIPT -->

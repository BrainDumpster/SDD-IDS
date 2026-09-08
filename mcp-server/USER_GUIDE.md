# IDS Design Spec MCP — User Guide

The **IDS Design Spec MCP** server gives AI assistants (Cursor, Windsurf, Claude, and any MCP-compatible client) structured access to IDS / programme design specs, tokens, states, Composition & API, and Storybook Docs — grounded in the SDD-IDS repository, not training-data guesses.

The server returns **documentation text**. It does **not** generate UI code; your AI client does.

For the full engineering playbook (Docker, GHES env, Inspector), see [`README.md`](./README.md).

---

## What you can ask

- Implement or document an IDS / Synapse / DAP component from its design-spec
- Look up colors, spacing, typography, and other foundations
- Get Composition & API / props / anatomy
- List or search components by programme
- Fetch Storybook Docs usage examples

---

## Endpoint

| Environment | URL |
|-------------|-----|
| Local | `http://localhost:3000/mcp` |
| Health | `http://localhost:3000/health` |

Always use the `/mcp` path for MCP client configuration.

---

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

GitHub credentials stay on the **server** (`.env`: `GITHUB_HOST`, `GITHUB_REPO`, `GITHUB_PERSONAL_ACCESS_TOKEN`, `GITHUB_REF`). Clients do not send a PAT.

---

## Quick start (local)

```bash
cd mcp-server
npm ci
set -a && source ../.env && set +a
npm run dev
```

```bash
curl -s 'http://localhost:3000/health?probe=github' | jq .
```

Inspector CLI:

```bash
npx @modelcontextprotocol/inspector --cli http://localhost:3000/mcp --transport http --method tools/list

npx @modelcontextprotocol/inspector --cli http://localhost:3000/mcp --transport http \
  --method tools/call --tool-name list_components --tool-arg programme=ids

npx @modelcontextprotocol/inspector --cli http://localhost:3000/mcp --transport http \
  --method tools/call --tool-name get_design_spec --tool-arg componentName=accordion
```

Transport must be **Streamable HTTP**, not STDIO.

---

## Parameters

| Param | Default | Notes |
|-------|---------|-------|
| `programme` | `ids` | Case-sensitive: `ids`, `synapse`, `DAP`, … |
| `componentName` | required for component tools | Slug under `components/<programme>/` |
| `framework` | `react` | `react` \| `angular` (usage / Storybook) |

Content version is the server’s `GITHUB_REF`. There is no call-level semantic version and no cache-refresh tool (live GitHub fetch).

---

## Tools (overview)

| Tool | Purpose |
|------|---------|
| `discover_design_system` | Programmes, categories, tools, sample components |
| `list_components` | Component slugs for a programme |
| `search_registry` | Search across programmes + inheritance |
| `get_lib_generation_context` | **Lib codegen pack** (spec + filtered CSS tokens + contracts + deps) |
| `resolve_component_dependencies` | Spec-declared assets/peers + existence (`ask_user` if required peer missing) |
| `get_design_spec` | Full design-spec.md |
| `get_design_spec_section` | Named sections |
| `get_composition_api` | Composition & API + Anatomy |
| `get_component_states` | State matrices |
| `get_component_tokens` | Tokens + layout |
| `get_foundation_tokens` | Foundations (+ optional theme CSS) |
| `get_design_principles` | Global design rules |
| `get_usage_examples` | Storybook Docs / developer-usage |
| `get_component_context` | Large exploratory bundle |

---

## Example prompts

```text
Call resolve_component_dependencies for programme ids, componentName button, framework react
```

```text
Call get_lib_generation_context for programme ids, componentName button, framework react
Then generate lib/react/ids/button using only the returned CSS variables and design-spec
```

```text
Call list_components for programme synapse
```

```text
Call get_design_spec for componentName accordion
```

```text
Call get_composition_api for accordion, then get_usage_examples with framework react
```

```text
Call get_foundation_tokens with category color
```

---

## MCP Resources

- `sdd://programmes`
- `sdd://documentation/{programme}/components`
- `sdd://documentation/{programme}/components/{slug}`
- `sdd://documentation/{programme}/foundations/{category}`

---

## Tips

- Prefer `get_design_spec` or section tools over `get_component_context` unless you need theme CSS + Storybook together.
- Programme folder names are case-sensitive (`DAP` not `dap`).
- If a component is missing, try `search_registry` — tools may suggest similar slugs.
- For tokens, use `get_foundation_tokens`; component-level tokens live in `get_component_tokens`.

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| `EADDRINUSE` port 3000 | Old MCP process | `fuser -k 3000/tcp` then restart |
| Health OK but tools 401 | Bad/expired PAT | Update `GITHUB_PERSONAL_ACCESS_TOKEN` |
| 404 on `components/ids` | Wrong repo or ref | Set `GITHUB_REPO` to the repo that has `components/`; set `GITHUB_REF` to the branch that contains specs |
| `github.com/api/v3` errors | Stale server binary | Rebuild/restart after SaaS API base fix (`api.github.com`) |
| Empty agent answers | MCP not connected / agent skipped tools | Check MCP settings; ask agent to call `list_components` |
| Wrong programme | Case or default | Pass explicit `programme` (`synapse`, `DAP`, …) |

---

## Limitations

- Documentation-based only (no codegen, no validation, no screenshots).
- No DDS-style UX pattern / utility / migration tools.
- Storybook usage paths currently target React and Angular companions.

---

## Related

- Agent skill: [`.cursor/skills/ids-design-mcp/SKILL.md`](../.cursor/skills/ids-design-mcp/SKILL.md)
- Cursor rule: [`.cursor/rules/ids-design-mcp.mdc`](../.cursor/rules/ids-design-mcp.mdc)
- Engineering README: [`README.md`](./README.md)
- Model Context Protocol: https://modelcontextprotocol.io/

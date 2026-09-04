# Shared Storybook content (React + Angular)

**Foundations** and **Getting Started** live here once. Each Storybook only
adds a thin CSF wrapper that injects the shared (or framework-specific) HTML.

```
storybook-shared/foundations/       ← tokens + HTML pages (source of truth)
storybook-shared/getting-started/   ← Installation HTML (React + Angular variants)
storybook/src/foundations/          ← React wrappers
storybook/src/getting-started/      ← React wrappers
storybook-angular/src/foundations/  ← Angular wrappers
storybook-angular/src/getting-started/ ← Angular wrappers
```

| Shared module | Sidebar |
|---------------|---------|
| `getting-started/` | **Getting Started** → Installation (framework-specific copy) |
| `foundations/` | **Foundations** → Icons, Design tokens |
| *(future)* | add name to `sidebar.js` + both `preview` `storySort.order` arrays |

## Wiring a new shared section

1. Add content under `storybook-shared/<section>/`.
2. Update `SHARED_SIDEBAR_ROOTS` in `sidebar.js`.
3. Mirror the root name in both `storySort.order` lists (plain literals — no
   function closures over imports, or `index.json` breaks).
4. Add thin CSF:
   - `storybook/src/<section>/*.stories.tsx`
   - `storybook-angular/src/<section>/*.stories.js`

## Regenerate foundation tokens

```bash
python3 scripts/export_ids_foundation_tokens.py
```

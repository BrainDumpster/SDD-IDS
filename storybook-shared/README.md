# Shared Storybook content (React + Angular)

**Foundations** (and future common sections) live here once. Each Storybook only
adds a thin CSF wrapper that injects the shared HTML.

```
storybook-shared/foundations/     ← tokens + HTML pages (source of truth)
storybook/src/foundations/        ← React wrappers
storybook-angular/src/foundations/← Angular wrappers
```

| Shared module | Sidebar |
|---------------|---------|
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

# Programme theme sync from Figma

Keeps global programme CSS in sync with Figma **local variables** (`GET /v1/files/{fileKey}/variables/local`).

## Strategy (collection-first)

Designers own variables in **Figma collections**. The sync script exports **every resolvable variable** in each configured collection — including **newly created** and **renamed** variables — without hand-maintained token lists.

| Rule | Behaviour |
|------|-----------|
| **Collection scope** | Only collections listed in `collection_profiles` for the programme are synced. |
| **Variable types** | `COLOR`, `FLOAT`, `STRING`, and `BOOLEAN` are exported when REST resolves a value. |
| **Token naming** | Figma variable **path** → CSS name (`Border Width/border-default` → `--border-width-border-default`). `codeSyntax.WEB` is used only when path mode is off. |
| **Renames** | Renaming a variable in Figma changes the CSS token on the next sync (no manual mapping). |
| **Light / Dark** | Collections with Light + Dark modes emit theme-specific values; overlay collections (e.g. **Tokens** over **Color Mode**) merge per mode. |
| **Multi-mode** | Collections like **Table density** emit suffixed tokens (`-loose`, `-compact`) per mode. |
| **Duplicates** | When several Figma exports share a collection name (local file vs published library), the profile picks one canonical export (`prefer_local` flag). |
| **Unresolved aliases** | Remote `VARIABLE_ALIAS` rows that REST cannot resolve are skipped (logged in dry-run counts). |
| **Not synced** | Collections in `excluded_collection_names` (legacy M3, demo Semantic, etc.) and programme layout aliases (not Figma globals). |

Configuration lives in `scripts/figma_theme_sync.py`:

- `SYNAPSE_COLLECTION_PROFILES` — Primitive, Color Mode, Tokens, Sizes, Table density
- `IDS_COLLECTION_PROFILES` — Primitive, Color Modes, Sizes

To add a designer collection: append a `CollectionSyncProfile` and re-run sync.

## Prerequisites

```bash
set -a && . ./.env && set +a   # FIGMA_TOKEN required
```

## One command (recommended)

```bash
# Synapse + IDS theme CSS
python3 scripts/sync_programme_themes_from_figma.py

# Also refresh root-spec.md tables
python3 scripts/sync_programme_themes_from_figma.py --with-root-spec

# Inspect counts per collection without writing files
python3 scripts/sync_programme_themes_from_figma.py --programme synapse --dry-run
```

| Programme | Figma file | Output |
|-----------|------------|--------|
| **synapse** | `Td1bnsvRj1PCGs9RVJkIvJ` | `components/synapse-theme.css`, `storybook/src/synapse-theme.css` |
| **ids** | `r0Ex6TumqcR3HINamsfXCV` (IDS Variables Library) | `components/ids-theme.css` (`data-design-system="ids"`) |
| **dap** | *(none — overlays IDS)* | Review `components/dap-theme.css` after IDS sync |

## Programme-specific scripts

```bash
python3 scripts/sync_synapse_theme_from_figma.py
python3 scripts/sync_ids_theme_from_figma.py
python3 scripts/rebuild_specs.py --root-only          # Synapse root-spec from CSS
python3 scripts/sync_ids_root_spec_from_figma.py --write  # IDS root-spec Figma tables only
```

## Shared implementation

`scripts/figma_theme_sync.py`:

- `CollectionSyncProfile` — per-collection mode (`light_dark` / `single` / `multi_mode`) and emit bucket
- `build_theme_maps()` — collection-driven merge
- CSS emit (`:root` vs IDS scoped selectors)
- IDS shadow aliases (`--shadow-shadow-4-drop-shadow-4-*`)
- Synapse legacy border-width numeric aliases (IDS-fork Storybook compat)

## Designer workflow

1. Add, rename, or change variables in the programme Figma file (any configured collection).
2. Run `python3 scripts/sync_programme_themes_from_figma.py --with-root-spec`.
3. Review CSS diff — new tokens appear automatically; removed Figma variables drop out on next sync.
4. For DAP: diff `dap-theme.css` against new `ids-theme.css` and update programme deltas manually.

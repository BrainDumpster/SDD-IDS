# Programme theme sync from Figma

Keeps global programme CSS in sync with Figma **local variables** (`GET /v1/files/{fileKey}/variables/local`).

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
```

| Programme | Figma file | Output |
|-----------|------------|--------|
| **synapse** | `Td1bnsvRj1PCGs9RVJkIvJ` | `components/synapse-theme.css`, `storybook/src/synapse-theme.css` |
| **ids** | `VZJ48bbVYrIynw8DdSukWw` | `components/ids-theme.css` (`data-design-system="ids"`) |
| **dap** | *(none — overlays IDS)* | Review `components/dap-theme.css` after IDS sync |

## Programme-specific scripts

```bash
python3 scripts/sync_synapse_theme_from_figma.py
python3 scripts/sync_ids_theme_from_figma.py
python3 scripts/rebuild_specs.py --root-only          # Synapse root-spec from CSS
python3 scripts/sync_ids_root_spec_from_figma.py --write  # IDS root-spec Figma tables only
```

## Shared implementation

`scripts/figma_theme_sync.py` — collection merge rules, CSS emit (`:root` vs IDS scoped selectors), IDS shadow aliases (`--shadow-shadow-4-drop-shadow-4-*`).

## Designer workflow

1. Update variables in the programme Figma file.
2. Run sync (above).
3. For Synapse: `rebuild_specs.py --root-only` if you did not use `--with-root-spec`.
4. For DAP: diff `dap-theme.css` against new `ids-theme.css` and update programme deltas manually.

# DAP Storybook components

This folder contains DAP-specific IDS components used by demos and **Spec Generated/DAP/** stories (see `storybook/.storybook/main.ts` globs). Inline `DAP/*` root stories were removed to keep the manual Storybook tree slimmer; use generated stories for DAP coverage.

## Included components
- `IdsMastheadDap`
- `IdsLeftNavigation`
- `IdsPagination`
- `IdsDapSidePanel`

## Grouping rules
- Keep DAP components under this folder.
- Generated Storybook titles use **`Spec Generated/DAP/*`** (see `storybook-generated/dap/`).
- Keep design-spec references in contracts pointed to `components/DAP/*/design-spec.md`.

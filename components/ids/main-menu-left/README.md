# IDS Main Menu/Left

Framework-agnostic design contract and React reference implementation for the IDS left navigation rail.

Host apps supply a **user-defined** item tree (`items`, optional `children`), optional `logo`, discriminated **`link`** (or legacy `href` / `routeRef`), **`defaultSelectedItemId`** for initial primary selection, and listen for **`onNavigate`**, **`onSelected`**, and **`onExpandedChange`**. Details: [`design-spec.md`](./design-spec.md) → **Composition & API**.

## Source of truth

| Artifact | Path |
|---|---|
| Design spec (codegen contract) | [`design-spec.md`](./design-spec.md) |
| Figma (IDS Design Library) | Expanded [`11099:56218`](https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=11099-56218&m=dev) · Collapsed [`11099:56206`](https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=11099-56206&m=dev) |
| Global theme | [`components/ids-theme.css`](../../ids-theme.css) |

## Reference implementation (Storybook)

| File | Role |
|---|---|
| `storybook/src/components/MainMenuLeft.tsx` | Nav rail: user `items` + optional `children`, collapse footer, optional `logo` |
| `storybook/src/spec-contracts/ids-main-menu-left.contract.ts` | Design spec path constant for gates / codegen |
| `storybook/src/components/MainMenuLeft.module.css` | **278px** expanded / **64px** collapsed widths, token-driven states |

Generated artifacts (refresh via **strict gate** — see [Regenerate Storybook from spec (strict gate)](#regenerate-storybook-from-spec-strict-gate) below):

- `storybook-generated/ids/src/components/MainMenuLeft.stories.tsx`
- `storybook-generated/ids/src/spec-contracts/main-menu-left.spec-layer-hash.json`

Storybook title: **`Spec Generated/IDS/Main Menu Left`**

### Spec Accurate Design stories

| Story | Purpose |
|---|---|
| **Spec Accurate Design** | Canonical expanded nav from Figma `11099:56218`: Dashboard selected (`defaultSelectedItemId`), Infrastructure with `children` + `childrenMenu: "collapsed"`; `100vh` host + `var(--color-background-surface-1)` canvas |
| **Collapsed** | Initial **64px** icon-only rail |
| **PrimaryStateSnapshotMatrix** | `forceStates` snapshots: `default`, `hover`, `press`, `selected`, `default-focus`, `selected-focus` |
| **TokenInspector** | Live `var(--...)` preview + spec references (appended by strict gate) |

## Regenerate Storybook from spec (strict gate)

After you change **`design-spec.md`**, **`MainMenuLeft.tsx`** (API/types the spec describes), or **`MainMenuLeft.module.css`** in ways that affect the deterministic story contract, re-run the **strict spec Storybook gate** so generated artifacts stay aligned.

### Command (repo root)

```bash
export DESIGN_SYSTEM=ids
python3 scripts/strict_spec_storybook_gate.py --component main-menu-left --spec-only --deterministic-story
```

| Flag | Role |
|------|------|
| `--component main-menu-left` | Target slug (matches `components/ids/main-menu-left/`) |
| `--spec-only` | Disables RAG/retrieval context; gate runs on **layered specs + theme** only (faster, CI-friendly) |
| `--deterministic-story` | Regenerates **`storybook-generated/ids/src/components/MainMenuLeft.stories.tsx`** from `generation/deterministic_storybook/ids/main_menu_left.py` |

### Outputs this updates

- **`storybook-generated/ids/src/components/MainMenuLeft.stories.tsx`** — Spec Generated stories (including **Spec Accurate Design** args: `defaultSelectedItemId`, `children`, etc.)
- **`storybook-generated/ids/src/spec-contracts/main-menu-left.spec-layer-hash.json`** — Spec content hash for the gate (header comment `spec_hash` in the `.stories.tsx` file is derived from this workflow)

If the gate fails, fix the reported spec/story mismatch, then re-run the command.

### Optional build check

```bash
cd storybook && pnpm build
```

### Troubleshooting Storybook

**Missing “Spec Generated” section:** Story globs in `.storybook/main.ts` must use `../../storybook-generated/...` (resolved from `.storybook/`, not `storybook/`). After pulling changes, run `cd storybook && pnpm dev:clean`.

**`importers[path] is not a function`:** Clear cache (`pnpm dev:clean`), run from `storybook/`, use the port Storybook prints. Open **Spec Generated/IDS/Main Menu Left → Spec Accurate Design**.

## States (Light / Dark)

The full state matrix lives under **States (Light Theme)** in the design spec. **States (Dark Theme)** points at `ids-theme.css` and `[data-theme="dark"]` when semantic tokens are shared (see root `README.md` — states dedupe).

## Layout notes (codegen-critical)

- Expanded rail width: **278px**; collapsed: **64px** (Figma-verified 2026-05-19).
- Primary row **40px** min-height; secondary row **32px** with **58px** left padding.
- Selected primary: **4px** brand inset (`selectedInset`); secondary selected + focus uses inset bar per module CSS.
- Icons: shared `Icon` with slugs from `assets/icons/` (for example `home`, `nav-tree`, `reports`, `settings-gear`, `double-chev-left`).

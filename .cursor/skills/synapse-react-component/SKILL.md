---
name: synapse-react-component
description: >-
  Create a Synapse React component and lib-generated Storybook examples
  (`lib/react/synapse/<slug>` +
  `storybook/src/components/lib-generated/Synapse{Root}.stories.tsx`).
  Handles IDS-fork reexports and Synapse-native (standalone) components
  declared in `components/synapse/<slug>/design-spec.md`. Use when the user
  asks to create, port, generate, or Storybook a Synapse React component,
  IDS-fork façade, standalone Synapse UI, `@synapse/react` export, or
  lib-generated Synapse story.
---

# Synapse React component

Ship Synapse React from the **design spec**. IDS-fork components are a façade over `lib/react/ids`. Synapse-native components have **no IDS counterpart** and are implemented only under `lib/react/synapse`.

Read [reference.md](reference.md) for file templates. Do **not** add Angular Synapse stories.

## Classify from the design spec

**Source of truth:** `components/synapse/<slug>/design-spec.md` → **Metadata** → `Spec pattern`.

| Spec pattern | React strategy | IDS lib required? |
|--------------|----------------|-------------------|
| `ids-fork` (or override-only) | `reexport` (default); `wrapper` / `overlay-css` only for documented chrome deltas | Yes — `lib/react/ids/<idsSlug>/` |
| `standalone` | `standalone` | No — do not alias `Ids*` |
| missing / unclear | Infer from `lib/react/synapse/react-strategy.json`, then **write `Spec pattern` into Metadata** before shipping React | — |

Also read `lib/react/synapse/react-strategy.json` and `lib/react/synapse/README.md`. Do not copy IDS source into `lib/react/synapse/<slug>/` for ids-fork.

If the spec is missing entirely: **ids-fork** → **design-spec-programme-inheritance**; **standalone** → **design-spec-intake-wizard** with Inherits IDS = no (`docs/design-spec-authoring-contract.md` → Programme standalone).

### Synapse-native slugs (standalone specs)

These have **no IDS family**. Implement under `lib/react/synapse/<slug>/`. Specs live at `components/synapse/…/design-spec.md` (some folders use a compacted slug).

| slug (`react-strategy.json`) | Spec path |
|------------------------------|-----------|
| `suggested-prompt` | `components/synapse/suggested-prompt/design-spec.md` |
| `thinking` | `components/synapse/thinking/design-spec.md` |
| `chat-area` | `components/synapse/chatarea/design-spec.md` |
| `chat-input-box` | `components/synapse/chatinputbox/design-spec.md` |
| `chat-system-response` | `components/synapse/chatsystemresponse/design-spec.md` |
| `recommendation-feedback` | `components/synapse/recommendation-feedback/design-spec.md` |
| `tracker` | `components/synapse/tracker/design-spec.md` |
| `stepper` | `components/synapse/stepper/design-spec.md` |
| `skeleton-loader` | `components/synapse/skeletonloader/design-spec.md` |
| `empty-state` | `components/synapse/emptystate/design-spec.md` |
| `error-card` | `components/synapse/errorcard/design-spec.md` |
| `topology` | `components/synapse/topology/design-spec.md` (children: `topology/node`, `group`, `element`, `node-tooltip`) |

If Metadata omits `Spec pattern`, add **`standalone`** when implementing. Do not invent a Synapse-native component that has no spec.

## Prerequisites

1. Design spec exists (see classify above).
2. **ids-fork:** IDS React exists at `lib/react/ids/<idsSlug>/`. If it does not, strategy is `deferred` — stop until IDS exists.
3. **standalone:** implement `Synapse{Root}.tsx` + CSS module from the Synapse spec only.

## Naming

- Public JSX, docs, and stories: **`Synapse` + PascalCase anatomy** (`Synapse{Root}`, `Synapse{Root}{Slot}`). No dotted compounds (`{Root}.{Slot}`).
- Internals may keep IDS `data-ids` / CSS module class names — that is sharing, not a second implementation.
- Folder slug is kebab-case (`accordion`, `checkbox`). Story file is `Synapse{Root}.stories.tsx`.
- Import path: `@synapse/react/<slug>` (Vite alias already maps `@synapse/react` → `lib/react/synapse`).

## Workflow

Copy this checklist and complete in order:

```
- [ ] 1. Classify spec pattern; resolve slug / names
- [ ] 2. Façade or standalone implementation
- [ ] 3. Barrel + react-strategy.json
- [ ] 4. Contracts
- [ ] 5. lib-generated Storybook + developer-usage
- [ ] 6. Theme tokens (no NEW→OLD aliases)
- [ ] 7. Verify Storybook sidebar
```

### 1. Resolve inputs

**ids-fork:** from `lib/react/ids/<idsSlug>/index.ts`, list every public `Ids*` export. Synapse names replace `Ids` with `Synapse`. `idsSlug` usually equals `slug`; exceptions live in `react-strategy.json` (`text-input` → `text-box`, `left-nav` → `main-menu-left`).

**standalone:** public names come from the spec **Anatomy** / **Composition & API** (`Synapse` + PascalCase). There is no `Ids*` list.

### 2. Implementation

**ids-fork:** create `lib/react/synapse/<slug>/index.ts` by aliasing IDS exports. Template: [reference.md](reference.md) § Façade.

**standalone:** create `Synapse{Root}.tsx` + `Synapse{Root}.module.css` + `index.ts` from the spec. Template: [reference.md](reference.md) § Standalone. Do not import `lib/react/ids`.

Load **`components/synapse-theme.css` only**. Never `ids-theme.css` in Synapse consumers or stories.

### 3. Barrel + strategy map

- Add `export * from "./<slug>";` to `lib/react/synapse/index.ts` (alphabetical).
- Ensure `react-strategy.json` has `{ "slug", "strategy": "reexport" | "standalone" | "wrapper", "idsSlug"? }`.

### 4. Contracts

If missing, add:

- `component-contracts/synapse/<slug>.contract.ts` — spec path, Figma node ids from the Synapse design spec; ids-fork also records the IDS baseline spec path.
- `storybook/src/spec-contracts/synapse-<slug>.contract.ts` — `export * from "@component-contracts/synapse/<slug>.contract";`

Standalone contracts omit IDS baseline path. Mirror an existing `component-contracts/synapse/<slug>.contract.ts` for the same pattern.

### 5. Storybook (lib-generated only)

Storybook indexes **only** `storybook/src/components/lib-generated/Synapse*.stories.tsx` for Synapse (`storybook/.storybook/main.ts`). Hand ports (`Synapse*.stories.tsx` under `src/components/`, `storybook-generated/synapse/`) stay hidden / `.skip`.

Create:

| File | Role |
|------|------|
| `storybook/src/components/lib-generated/Synapse{Root}.stories.tsx` | Stories |
| `storybook/src/components/lib-generated/synapse-<slug>.developer-usage.ts` | Docs tab + source snippet |

Start from the matching IDS lib-generated story when **ids-fork** (`{Root}.stories.tsx` / `ids-<slug>.developer-usage.ts`). For **standalone**, author stories from the Synapse spec (no IDS remap). Remap for ids-fork:

| IDS | Synapse |
|----|---------|
| `components/ids-theme.css` | `components/synapse-theme.css` |
| `@ids/react/<idsSlug>` | `@synapse/react/<slug>` |
| `Ids*` | `Synapse*` |
| `Components/IDS/{Name}` | `Components/Synapse/{Name}` |
| `ids-*-developer-usage` | `synapse-<slug>.developer-usage` |

Required story shape:

- `tags: ["autodocs"]`
- Primary story **`Spec Accurate Design`** (`SPEC_ACCURATE_DESIGN_STORY`)
- Composition matches the spec (projected slots, not dotted `Root.Slot`)
- Docs: strategy (`reexport` or `standalone`), theme path, `@synapse/react/<slug>` import
- Variants / states from the spec (ids-fork: same coverage as the IDS lib-generated story unless the Synapse spec drops a variant)

Templates: [reference.md](reference.md) § Storybook.

Do **not** unskip `*.stories.tsx.skip` or add `storybook-generated/synapse` to `main.ts`.

### 6. Theme tokens

Semantic `var(--color-…)` in CSS must exist as **canonical hex** in `components/synapse-theme.css`, not as aliases to old Figma names.

**ids-fork:** collect `var(--*)` from `lib/react/ids/<idsSlug>/`.
**standalone:** collect tokens from the spec **Tokens** / **States** sections and the Synapse CSS module.

Then:

1. Confirm each exists as a **canonical hex** in `components/synapse-theme.css` (light + dark as needed).
2. If the spec uses post-`ftoken.md` names and the theme still has the old name only: **rename the hex property** to the new name. Do not add `NEW: var(--OLD)` IDS-compat aliases.
3. Reverse aliases (`OLD: var(--NEW)`) only if other leftover CSS still references the old name.
4. Keep programme layout aliases (`--{component}-control-radius`, `--border-width-border-1`, etc.) — those are not color-token shims.

### 7. Verify

Restart is not required for a new `lib-generated/Synapse*.stories.tsx` if Storybook is already watching `src/`. Confirm:

- Sidebar: **Components → Synapse → {Name}**. No hand-port siblings for this slug.
- Canvas uses Synapse theme (`data-design-system="synapse"` from title).
- Docs import example uses `@synapse/react/<slug>` and `synapse-theme.css`.

```bash
# If the sidebar is stale:
cd storybook && npm run dev:clean
```

## Do not

- Copy `lib/react/ids/<slug>` into `lib/react/synapse/<slug>/` for ids-fork components.
- Re-export `Ids*` for a spec whose **Spec pattern** is `standalone`.
- Mix `ids-theme.css` and `synapse-theme.css` in one story.
- Use `programme="synapse"` on a hand-rolled `storybook/src/components/{Root}.tsx` as the public example.
- Add Synapse stories under `storybook-angular/`.
- Depend on `@base-ui-components/react` for Synapse.
- Add color aliases so IDS CSS names resolve to obsolete Figma names.

## References

- Implementation: `lib/react/synapse/<slug>/`
- Stories: `storybook/src/components/lib-generated/Synapse{Root}.stories.tsx`
- Strategy map: `lib/react/synapse/react-strategy.json`
- Standalone spec contract: `docs/design-spec-authoring-contract.md` → Programme standalone
- Templates: [reference.md](reference.md)

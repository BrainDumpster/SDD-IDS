---
name: ids-lit-component-port
description: >-
  Ports an IDS design-spec component to Lit under lib/lit/ids with storybook-lit
  examples and rollup build. Use when the user asks to create a Lit component
  from an IDS design-spec, references edf-core / packages/core Lit sources,
  storybook-lit, or a repeating IDS Lit port workflow.
---

# IDS Lit component port

## Goal

Create a production Lit web component from an IDS `design-spec.md`, aligning
**props/events/tag names** with the existing edf-core Lit implementation when
provided, without editing the design-spec.

## Inputs (ask if missing — one question per turn when unclear)

1. **Design spec path** — e.g. `components/ids/<slug>/design-spec.md`
2. **edf-core source path or URL** — e.g. `…/packages/core/src/<slug>/`
3. **edf-core demo path or URL** — e.g. `…/demo/core/<slug>.html`
4. Confirm: do **not** update the design-spec; use any **new** props/events from edf-core
5. Outputs: `lib/lit/ids` + `storybook-lit` (+ rollup); draft/update this skill only when asked

## Do not

- Edit `components/ids/<slug>/design-spec.md` unless the user explicitly asks
- Invent props/events that conflict with edf-core when a reference exists
- Hardcode colors/spacing/type — use semantic `var(--…)` from the spec / `ids-theme.css`
- Add Synapse Angular stories or unrelated framework ports

## Workflow

### 1. Read sources

1. Read the design-spec (anatomy, tokens, states, interactions, Composition & API, codegen contract).
2. Read edf-core element(s), `register.ts`, styles, and demo HTML — capture:
   - Custom element tag names
   - `@property` names + deprecated aliases
   - Custom events (`CustomEvent` / `@event`)
   - Slot / light-DOM composition
3. Mirror React/Angular ports under `lib/react/ids/<slug>/` or `lib/angular/ids/<slug>/` for IDS token/layout fidelity when they already exist.
4. Read `component-contracts/ids/<slug>.contract.ts` for demo defaults when present.

### 2. API merge rules

| Priority | Source | Use for |
|----------|--------|---------|
| 1 | edf-core | Tag names, property names, event names, deprecated aliases |
| 2 | design-spec | Visual tokens, states, a11y keyboard contract, layout |
| 3 | design-spec-only props | Add when edf-core lacks them (e.g. `chevronPosition`) — do not remove edf names |

Emit both edf events and a design-spec-friendly event when useful (Accordion:
`onToggleContent` + `value-change`), without dropping edf names.

### 3. File layout

```
lib/lit/ids/                 # package root (@ids/lit) — mirrors lib/react/ids, lib/angular/ids
  package.json
  tsconfig.json
  rollup.config.js
  styles/ids-theme.css       # @import → components/ids-theme.css
  src/
    internal/registration.ts
    theme/                   # applyIdsTheme helpers
    icon/                    # shared when needed
    <slug>/
      *.element.ts
      *.styles.ts            # lit css`` with design tokens
      index.ts
      register.ts            # registerElementSafely + side-effect imports
storybook-lit/
  .storybook/main.ts         # alias @ids/lit → lib/lit/ids/src
  .storybook/preview.ts      # global theme + Light/Dark toolbar
  src/components/<Name>.stories.ts
  src/components/*developer-usage*
```

### 4. Implementation checklist

- [ ] `registerElementSafely` for every tag (idempotent)
- [ ] Styles use only semantic tokens from the spec
- [ ] States (hover / open / focus-visible / disabled) match light matrix
- [ ] Keyboard / ARIA from design-spec Interactions + Accessibility contract
- [ ] Icon via shared `ids-icon` + asset slug from `assets/icons/`
- [ ] Rollup ESM build works: `cd lib/lit/ids && npm run build` (or `make build`)
- [ ] Auto-rebuild on edit: `cd lib/lit/ids && npm run build:watch` / `make watch` — Storybook `npm run dev` starts watch + Storybook together
- [ ] Stories: **Spec Accurate Design** + edf demo scenarios
- [ ] Theme: **global only** — `components/ids-theme.css` / `@ids/lit/ids-theme.css`; never import theme CSS inside a component shadow root
- [ ] Light/dark via `applyIdsTheme({ theme })` → `data-design-system` + `data-theme` on html/body
- [ ] Storybook preview: Theme toolbar (Light/Dark) + `applyIdsTheme` decorator (parity with React/Angular)
- [ ] Assets (icons/fonts/images) only from repo `assets/` via `idsIconUrl` / `idsImageUrl` / `idsFontUrl` / `idsAssetUrl`; Storybook maps `assets` → `/assets`

### 5. Storybook conventions

- Meta title: `Spec Generated/IDS/<Display Name>`
- Primary story name: `Spec Accurate Design`
- Prefer Lit `html` templates matching edf demo markup
- Port: `6008` (React `6006`, Angular typically other)
- Theme toolbar must drive `data-theme` / `data-design-system="ids"`

### Theme / reusability contract

```ts
import "@ids/lit/ids-theme.css";
import { applyIdsTheme } from "@ids/lit/theme";
import { idsIconUrl, idsImageUrl, idsFontUrl } from "@ids/lit/assets";
import "@ids/lit/accordion/register.js";

applyIdsTheme({ theme: "dark" }); // light | dark
idsIconUrl("chev-down-thick"); // → /assets/icons/chev-down-thick.svg
```

Components consume inherited CSS variables only — apps own the global stylesheet + theme attributes.
All media comes from the shared `assets/` folder (`window.__IDS_ASSETS_BASE__` optional override).

### 6. Completion (chat)

Follow `.cursor/rules/compact-task-completion.mdc`: Done / Changed / Verify only.
Do not dump full Figma or edf investigation in chat.

## Accordion reference (first port)

- Spec: `components/ids/accordion/design-spec.md`
- edf-core: `packages/core/src/accordion` — tags `ids-accordion`, `ids-accordion-panel`,
  `ids-accordion-title`, `ids-accordion-content`; props `multiplePanelOpen` /
  `idsMultiplePanelOpen`, `active`, `accordionPanelDisabled` /
  `idsAccordionPanelDisabled`; event `onToggleContent`
- Lib: `lib/lit/ids/src/accordion/`
- Stories: `storybook-lit/src/components/Accordion.stories.ts`

## Verify commands

```bash
cd lib/lit/ids && npm install && make watch   # or: npm run build:watch
cd storybook-lit && npm install && npm run dev  # also starts lit build:watch
# → Spec Generated → IDS → Accordion → Spec Accurate Design
```

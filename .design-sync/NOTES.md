# design-sync notes — IDS (React)

Repo-specific gotchas for future syncs. Scope: **IDS only** (`lib/react/ids/`), 41 components.
DAP and Synapse live in the same repo/Storybook but are deliberately out of scope.

## Shape & scoping

- Shape is `storybook`. The DS package is `storybook/` (`synapse-storybook`), whose
  `.storybook/main.ts` indexes **three** design systems (IDS + DAP + Synapse, 701 stories).
- design-sync derives a component name from the story title's **last segment**, so
  `Components/Synapse/Button` and `Components/IDS/Button` would collide onto one component.
  Fix: `storybook/.storybook-ids/` — an IDS-only Storybook config that spreads the real
  `../.storybook/main.ts` and narrows `stories` to `src/components/lib-generated/*.stories.tsx`.
  `preview.tsx` there just re-exports the real preview, so decorators are identical.
  **`cfg.storybookConfigDir` points at it. Build `sb-reference` with THAT config, not `.storybook/`.**
- `src/components/lib-generated/` (41 stories) are the canonical IDS ports — they import
  `@ids/react/*`, which the Vite alias maps to `lib/react/ids/`. That is exactly what the
  bundle ships, and it maps 1:1 onto the 41 dirs under `lib/react/ids/`.
- IDS titles that are NOT synced (13): About, Breadcrumb, Global Search, Main Menu Top,
  Page Error, Scroll Bar, Skeleton Loader, Modal/Dialog, Wizard Inline, Wizard Modal,
  Alert/Overview, Alert/Global Alert, Alert/Inline Alert. These are Storybook-local demo
  components under `storybook/src/components/`, with **no implementation in `lib/react/ids/`**,
  so there is nothing to ship for them. Not a bug; don't "fix" it by adding titleMap entries.

## Repo changes this sync required (all committed)

- **`package.json` had no `name`.** The converter walks up for a named `package.json`; with
  none it ran past the repo root and crashed on `/package.json`
  (`lib/dts.mjs` `projectFor`). Added `name`/`version`/`private`. Do not remove `name`.
- **`import.meta.glob` is Vite-only.** `IdsIcon`, `IdsProgressBar`, `IdsTextBox` (icons) and
  `IdsGetStarted` (honeycomb image) resolved assets through it. esbuild leaves it EMPTY, so
  every icon fell into IdsIcon's `data-missing` branch in the shipped bundle — invisible in a
  Vite-only workflow, catastrophic for claude.ai/design.
  Fix: `scripts/generate_ids_asset_registry.mjs` generates
  `lib/react/ids/shared/idsAssetRegistry.generated.ts` (1139 icons + 1 image as inlined data
  URIs, ~4.8 MB) and the four components fall back to it **only when the glob is empty**, so
  Vite/Storybook behaviour is byte-identical. Bundle grows 0.9 MB → 5.7 MB (cap is 12 MB).
  **Re-run the generator after adding/removing anything under `assets/icons` or `assets/images`.**

## Environment

- `node_modules` at the repo root lacks `@types/react`; without it every emitted props body is
  EMPTY (`[DTS_REACT]`). Symlinked `node_modules/@types/react{,-dom}` →
  `storybook/node_modules/@types/...`. **`node_modules` is gitignored, so recreate these two
  symlinks on a fresh clone.**
- `storybook/node_modules` is the right `--node-modules` (it has react/react-dom/@types).
  It carries BOTH a `pnpm-lock.yaml` (Jul 24) and a newer `package-lock.json` (Aug 4); the
  installed tree matches `package.json` and is healthy, so this sync used it as-is rather than
  reinstalling. A `pnpm i --frozen-lockfile` against the older pnpm lock risks regressing versions.
- Playwright chromium needs system libs (`libnspr4` et al.) that are absent here and require
  sudo: `sudo npx --prefix .ds-sync playwright install-deps chromium`.

## Config knobs and why

- `entry: lib/react/ids/index.ts` — this library has **no build step and no `dist/`**; esbuild
  compiles the TS source directly. There is no compiled artifact to prefer.
- `extraEntries` includes **`./lib/react/ids/index.ts` itself**. The export gate is normally fed
  from the package's `.d.ts`; with no `.d.ts` it saw 0 exports and dropped all 41 components
  (`[TITLE_UNMAPPED]`). The extraEntries scanner reads TS source and follows relative
  `export *` hops, so listing the barrel there populates the gate. Do not remove it.
- `./lib/react/ids/accordion/index.ts` — Accordion is genuinely absent from the barrel.
- `./lib/react/ids/datagrid/index.ts` — the barrel omits `IdsDatagridNumericFilterState` /
  `defaultIdsDatagridNumericFilterState`, which stories import. This produces a benign
  `[EXPORT_COLLISION]` warning for 24 datagrid names: both entries resolve to the same module,
  so the "collision" is with itself. **Expected — do not chase it.**
- `cssEntry: components/ids-theme.css` — the global token sheet. Component styles are colocated
  CSS Modules and ride the esbuild CSS sidecar into `_ds_bundle.css`.
- `docsMap` — 41 explicit entries. Component names are `IdsButton` while doc dirs are
  `components/ids/button/design-spec.md`, so neither `docsDir` basename- nor dir-slug matching
  can pair them. Specs are large and get truncated to ~8 KB in `.prompt.md`; that is the
  converter's cap, not an error.
- `titleMap` — 41 entries mapping title tails to exports. Non-obvious ones:
  `Tab → IdsTabs`, `Toast → IdsToastViewport`, `Combo Box → IdsDropdownComboBox`,
  `Multi Select → IdsDropdownMultiSelect`, `Single Select → IdsDropdownSingleSelect`.

## Theming — load-bearing

IDS tokens in `components/ids-theme.css` are scoped to
`html[data-design-system="ids"]` / `body[...]` (plus `[data-theme="dark"]`). Nothing is styled
without that attribute. It is set by the **decorator** in `.storybook/preview.tsx`, which
derives the design system from `context.title` and falls through to `"ids"` — correct for this
scope. The converter auto-bundles that decorator as the preview wrapper
(`preview-decorators.js`). If decorator bundling ever fails, previews go completely unstyled and
`cfg.provider` is NOT a substitute (it wraps a component; it cannot set an attribute on `<html>`)
— author an owned preview wrapper that sets the attribute instead.

## Re-sync risks

- Regenerate `idsAssetRegistry.generated.ts` whenever assets change, or new icons silently
  render as missing boxes in every design (the compare loop CAN see this one, but only for
  icons a story actually uses).
- The `@types/react` symlinks and `.design-sync/sb-reference` do not survive a fresh clone.
- `storybook/.storybook-ids/main.ts` spreads `../.storybook/main.ts`. If the main config
  changes how `stories` or aliases are computed, re-check that the IDS-only config still
  resolves `@ids/react` and still yields exactly 41 titles.
- Sync scope was chosen by the user as IDS-only. Adding Synapse/DAP later needs a different
  name-collision strategy than `titleMap` (see Shape & scoping).

## Verification-environment findings (this sync)

- **Playwright chromium needed system libs unavailable without sudo.** Worked around WITHOUT root by
  `apt-get download libnspr4 libnss3 libasound2t64` + `dpkg -x` into `.ds-sync/syslibs/root/`, then
  running every capture with
  `LD_LIBRARY_PATH=$PWD/.ds-sync/syslibs/root/usr/lib/x86_64-linux-gnu`.
  **Every compare/validate command needs that env var on this machine.**
- **Converter bug — `.ds-sync/storybook/http-serve.mjs` has no `.svg` in its MIME map.** SVGs were
  served as `application/octet-stream`, so Chromium refused to paint them as CSS masks. The
  storybook panel photographed with NO icons while the preview (data URIs, correct MIME inline)
  looked right — a false "preview renders more than reference" on every icon-bearing component.
  Patched the MIME map (`.svg`, `.jpg`, `.gif`, `.webp`, `.avif`, `.woff2`, `.woff`, `.ttf`, `.otf`);
  a copy of the patched file is at `.design-sync/http-serve.mime-patch.mjs`.
  **`.ds-sync/` is re-copied from the skill bundle every sync, so RE-APPLY this patch each time**
  (or confirm the upstream skill has fixed it). Worth reporting upstream.
- **`?raw` imports are a THIRD Vite-only asset mechanism** (after `import.meta.glob` and the empty-map
  fallback). `lib/react/ids/icon/idsIconInlineRegistry.ts` and
  `storybook/src/components/iconInlineRegistry.ts` import `*.svg?raw` for icons injected via
  `dangerouslySetInnerHTML`. Outside Vite the import yields a data URI, which rendered as literal
  text (`data:image/svg+xml,%0D%0A…`) inside IdsAlert's warning row. Fixed with `idsRawSvg(imported,
  shape)` from the generated registry, which passes the Vite value through and substitutes generated
  markup elsewhere. The generator SCANS for `?raw` imports, so the list maintains itself.
- `guidelines/` auto-discovery picked up `docs/` — this repo's internal spec-pipeline documentation
  (authoring contracts, Figma integration), which is noise for a design agent building UIs. Excluded
  from the sync; revisit `cfg.guidelinesGlob` if genuine component-usage guidance is ever added.
- `IdsModal` stories are interaction-gated: statically both panels show only the trigger button.
  That is a faithful match, but the product card shows a button rather than a dialog.

## Cross-design-system token leak (repo bug, NOT a sync artifact)

18 CSS custom properties used by IDS component CSS are defined ONLY in `components/synapse-theme.css`
and `components/dap-theme.css` — and those files declare them at **unscoped `:root`**. Storybook's
preview imports all three theme files, so IDS components currently resolve them by accidentally
borrowing Synapse/DAP values. `components/ids-theme.css` defines none of them. Any app that loads
only `ids-theme.css` already renders these wrong today. Examples: `--color-background-overlay-1`,
`--color-background-alerting-info-1`, `--color-icon-alerting-info-1`, `--border-width-border-default`,
`--border-width-border-strong`, `--checkbox-control-radius`, `--dropdown-menu-radius`,
`--color-border-neutral-light`, `--color-background-n-tabs-x-hover`.
**RESOLVED** (user-approved): `components/ids-theme-fallbacks.css` now defines all 19 under
`html[data-design-system="ids"]`, using the exact values IDS inherited by accident, so nothing about
current rendering changes — it just stops depending on load order. That file is HAND-MAINTAINED and
is NOT regenerated by `sync_programme_themes_from_figma.py`; if these tokens ever gain real IDS
values in Figma, move them into the generated `ids-theme.css` and delete them from the fallback file.

Why it mattered more than it looked: `border: var(--border-width-border-default) solid <color>` with
an undefined width is an INVALID SHORTHAND, so the declaration is dropped whole and the border
VANISHES rather than degrading. That one token is consumed by 23 IDS stylesheets. It is what made
Segmented Button lose its shell, the three Dropdown triggers lose their borders and control
background, and App Shell lose its page-panel border.


## Base layer was missing too (fixed)

`components/synapse-theme.css` also carried, UNSCOPED, the things every design system needs:
the Roboto `@font-face` import, the `*{box-sizing:border-box}` reset, and the `html/body` base
typography. `ids-theme.css` had none of them, so IDS-only consumers got no font and no reset, and
every preview rendered in the chromium default serif. Text metrics were wrong roster-wide, which
cascaded into false truncation (`Widget Title` -> `Wid...`, `Observability` -> `Observabil...`).
Fixed in `components/ids-theme-fallbacks.css` (base typography + reset, scoped to the IDS attribute).

**Roboto is now shipped as a local variable font** — `assets/fonts/roboto/roboto-variable-latin.woff2`
(Google Fonts latin subset, Roboto v51, weights 100-900), declared via `@font-face` and wired through
`cfg.extraFonts`. Two reasons it is NOT a Google Fonts `@import`: an `@import` is only honoured at the
TOP of a stylesheet and design-sync APPENDS `cssEntry` into the bundle CSS (so it would be silently
ignored), and a local face keeps designs independent of a font CDN. This also clears `[FONT_MISSING]`,
which the compare oracle cannot see.

## How the theme reaches the bundle

`cfg.cssEntry` is `.design-sync/ids-theme-bundle.css`, a BUILD ARTIFACT produced by
`node scripts/build_ids_sync_theme.mjs`. **Re-run that script after editing either theme file.**
It does two things `cssEntry` cannot do alone:
1. Concatenates `ids-theme.css` + `ids-theme-fallbacks.css` (`cssEntry` takes exactly one file).
2. Rewrites the light-theme selector to `:root, html[data-design-system="ids"], body[...]`.
   **This is load-bearing:** both theme files scope every token to `data-design-system="ids"`.
   Storybook sets that attribute via a decorator, but a design built on claude.ai/design does not
   control its page shell — without the `:root` binding the entire design system renders unstyled.
   The synced bundle contains only IDS, so making IDS the unconditional default is safe. Dark mode
   still requires `[data-theme="dark"]`.

## Wave-1 fan-out learnings (folded)

- [GENERAL] The two global causes above accounted for EVERY non-match verdict in wave 1 across all
  four batches (24 components). No component needed an owned preview `.tsx`; no per-component
  composition or prop bug was found anywhere in the roster.
- IdsLink was the control case: it is immune to the font bug because it declares its own
  `font-family`, which is how batch C isolated the cause.
- IdsAppLauncher: the storybook cell shows only the masthead bar because the story sets
  `defaultOpen: true` and the panel is portalled outside `#storybook-root`, so the reference crop
  excludes it; the preview renders the full open panel. Graded on the preview's own render.
  `cardMode: "single"` is applied.
- `button` elements compute `Arial` on BOTH panels — the UA stylesheet wins because no IDS rule sets
  `font-family: inherit` on buttons. Consistent across panels, so not a sync defect, but it does mean
  IDS buttons do not render in Roboto anywhere. Worth a design-system decision separately.
- `[STORY_CAP]` (6 stories/component) truncated grading for: Accordion 6/7, AppLauncher 6/10,
  AppShell 6/7, Card 6/8, Checkbox 6/7, DatePicker 6/8, DropdownButton 6/7, DropdownComboBox 6/8,
  DualListBox 6/8, Link 6/7, Masthead 6/9, Pagination 6/7, SegmentedButton 6/9, Button 6/9, Modal 6/9,
  GetStarted 6/7. Raise with `--max-stories` if those tail stories carry distinct variants.

## Wave-2 fan-out learnings (folded)

After the token + font fixes landed, all 30 re-graded components came back `match` with **zero**
preview `.tsx` files authored across the entire 41-component roster. No component in this design
system needed an owned preview — every defect found in this sync was global and config-level.

Framing effects that are NOT defects (repeatedly rediscovered — check here first):
- The preview page has ~24px body padding while the storybook canvas is full-bleed, so at the same
  capture viewport the preview's content box is ~20px narrower (852 vs 872 in 900px shots). For
  width-sensitive layouts this crosses real thresholds — e.g. IdsDashboard's tile title truncates to
  `Widget T...` in the preview only. Judge the component, not its surroundings.
- The same offset clips the bottom/right of any 100vh or viewport-filling component (IdsAppShell's
  footer strip, the right column of IdsAppLauncher's Component Detail Matrix). Content is present,
  just outside the frame.
- Stories with `parameters.layout: "fullscreen"` render edge-to-edge in storybook but inside the
  padded preview container, so ellipsis/flex-wrap points differ.
- Preview raws are captured into a fixed 900x700 viewport while the storybook capture grows to the
  story root's full height, so tall components (IdsWizard) lose their footer below the preview fold.
  Compare offsets relative to the component's own top edge, not by equal capture heights.
- Downscaled captures shift thin-stroke hues: a 1px border can read grey on one panel and blue on the
  other purely as a resampling artifact (IdsTooltip Arrow Matrix). Zoom the raw before calling it a defect.
- Overlay components clip on the STORYBOOK side: its canvas is only ~220px tall, so open menus are cut
  off while the preview renders the full portal. A preview that renders MORE than the clipped
  reference is not a delta.
- IdsSpinner is an infinite animation; the arc can sit at a different rotation phase on each panel even
  with animations reset. Phase-only difference is capture jitter.

## IdsWhatsNew — verified off the standard sheet (important)

All 4 stories report `sb-error` ("no storybook root content") and the harness captures nothing on
either panel. **This is NOT a broken story and must NOT be `skip`ped.** IdsWhatsNew renders its entire
UI into a modal overlay portalled to `document.body` (`_ids-modal-overlay` / `_ids-modal-surface` are
direct body children carrying the full component); `#storybook-root` is genuinely empty, and
`compare.mjs` waits for content INSIDE `#storybook-root` before it will screenshot, so it gives up
before reaching its own full-page fallback.

Verified instead with a direct full-page screenshot pair of both panels (same oracle, same rubric,
full-page capture instead of root-element capture): pixel-identical on Spec Accurate Design and
Nested Hierarchy. Grades recorded with that basis in the note.

Two consequences for the next sync: (a) expect the same `sb-error` and re-verify the same way rather
than skipping; (b) the section list renders EMPTY on both panels for these stories — that is the
story's own behaviour, so the product card shows a mostly-empty modal shell.

## Component API types (`.d.ts`)

The library ships no `.d.ts`, so the extractor emitted `[key: string]: unknown` for all 41
components — i.e. the design agent had NO API contract to code against. Fixed by emitting real
declarations:

    ./storybook/node_modules/.bin/tsc -p .design-sync/tsconfig.types.json

writes `.design-sync/types/**` (120 files), and root `package.json` now has
`"types": ".design-sync/types/index.d.ts"`, which is the hook `lib/dts.mjs` `projectFor()` reads.
tsc exits 2 with ~18 non-fatal errors (asset imports, `import.meta.env/glob`, a `rootDir` complaint
about `lib/react/shared`) but **emits correctly** — do not chase them, and do not add
`noEmitOnError`. **Re-run this after changing component props.**

## Re-sync risks — read this first next time

1. **`.ds-sync/` is re-copied from the skill bundle every sync, so the `http-serve.mjs` `.svg` MIME
   patch is LOST each time.** Without it the storybook panel photographs with no icons and you will
   mis-grade every icon-bearing component (it looks like "the preview renders more than the
   reference"). Re-apply from `.design-sync/http-serve.mime-patch.mjs`, or verify the upstream skill
   has fixed it, BEFORE grading anything.
2. **Chromium needs `LD_LIBRARY_PATH=$PWD/.ds-sync/syslibs/root/usr/lib/x86_64-linux-gnu`** on this
   machine. `.ds-sync/` is gitignored, so on a fresh clone re-download the libs (see Environment).
3. **`node_modules/@types/react{,-dom}` symlinks** are gitignored — recreate on a fresh clone or every
   emitted props body silently degrades.
4. **Regenerate both generated artifacts when their inputs change:**
   - `node scripts/generate_ids_asset_registry.mjs` — after ANY change under `assets/icons` or
     `assets/images`, or new `?raw` imports. Otherwise new icons silently render as missing boxes.
   - `node scripts/build_ids_sync_theme.mjs` — after editing `ids-theme.css` OR
     `ids-theme-fallbacks.css`. Otherwise the bundle ships a stale theme.
   - `tsc -p .design-sync/tsconfig.types.json` — after changing component props, or the shipped
     `.d.ts` contracts go stale while still looking valid.
5. **`components/ids-theme-fallbacks.css` values were copied from Synapse/DAP**, i.e. they encode what
   IDS renders *by accident today*. They are a compatibility layer, not designed IDS values. If the
   IDS Figma collection ever defines them properly, move them into the generated `ids-theme.css` and
   delete the fallback file — do not let the two drift.
6. **`IdsWhatsNew` will report `sb-error` on all stories again** — it portals outside
   `#storybook-root`. Verify it with a direct full-page screenshot pair; do NOT `skip` it.
7. **Verified only partially:** `[STORY_CAP]` caps grading at 6 stories/component, so tail stories on
   ~16 components are captured-but-ungraded (list in the wave-1 section). Raise with
   `--max-stories` if those tails carry distinct variants.
8. **The `:root` binding in `build_ids_sync_theme.mjs` is load-bearing** and is only safe because this
   project ships IDS alone. If DAP or Synapse is ever added to the SAME Claude Design project, that
   binding must be removed or the systems will fight over `:root`.
9. Storybook scoping depends on `storybook/.storybook-ids/main.ts` spreading `../.storybook/main.ts`.
   If the main config changes how `stories`/aliases are computed, re-check it still yields exactly
   41 titles and still resolves `@ids/react`.

---

# Re-sync #2 (master @ e3579c61)

## THE BIG ONE: uncommitted source fixes were lost to a branch change

The first sync left every library fix **uncommitted**. The repo then moved from
`usr/muthu/mcp-server` to `master` (picking up PRs #116/#117/#123/#124/#125) and the checkout
discarded ALL of them: `package.json` (`name`/`version`/`private`/`types`), the four
`import.meta.glob` try/catch guards, the `?raw` -> `idsRawSvg()` fix in both inline registries, the
three storybook-local icon guards, and the `.gitignore` entries. Untracked files survived
(`.design-sync/`, `components/ids-theme-fallbacks.css`, `assets/fonts/`, the generated asset
registry, `scripts/*.mjs`, `storybook/.storybook-ids/`), which is the only reason recovery was cheap.

All of it was re-applied this run from the descriptions in this file — **which is exactly what this
file is for.** The lesson stands until the work is committed: **COMMIT THE SOURCE FIXES.** Until
then every branch change silently reverts the design system to a state where the shipped bundle
throws on load outside Vite.

## What this re-sync cost (the anchor working as intended)

- Anchor healthy (`anchorUsed: true`, `anchorReason: ok`, `keyedBy: sourceKeys`).
- 39 of 41 components **carried forward untouched**; only `IdsMainMenuLeft` and `IdsTooltip` had
  grades cleared (their story sources genuinely changed).
- Uploaded 6 components (`IdsAppLauncher`, `IdsBadge`, `IdsMainMenuLeft`, `IdsMasthead`,
  `IdsTextBox`, `IdsTooltip`) + bundle + styling. `deletePaths: []`.
- Final verdict `ok: true`, `pendingGrade: []`, `learningsUnmerged: []`, `removed: []`.
- Both changed components re-graded `match` on every story; all 5 reference-drift `[SPOT_CHECK]`
  picks confirmed against their recorded grades with zero divergence.

Confirmed again this run: the `http-serve.mjs` `.svg` MIME patch **was** wiped by re-staging
`.ds-sync/`, exactly as predicted above. Re-applied from `.design-sync/http-serve.mime-patch.mjs`
before any grading. Keep that step first, forever.

## New finding: IdsMainMenuLeft card-only pageerror

`[RENDER_ERRORS] TypeError: ctx.getPrimaryState is not a function` on
`components/ids/IdsMainMenuLeft/IdsMainMenuLeft.html`. Non-blocking (validate exits 0), but here is
the full diagnosis so nobody re-derives it:

- Every story renders **clean in isolation** (`?story=<Export>`, all six checked) and the reference
  storybook throws **nothing** — so it is not a repo bug and not a component defect.
- It fires only on the **combined card**, which renders more stories than compare's 6-story cap.
  The card still renders every section with visible menus (8 sections, 281 menu nodes, nothing blank).
- The context default is `null` and `useMainMenuLeftContext()` throws a *different*, explicit error
  when unset, so this is NOT a missing provider and NOT a dual-module-instance split (that would
  yield `null`). `ctx` is a real object lacking the method, i.e. a provider/consumer version skew
  between a tail story and `MainMenuLeft.compose.tsx`.
- **Tried and reverted:** `cfg.storyImports.bundle: ["storybook/src/components/MainMenuLeft"]` to
  force single-instance resolution. It did not change the error, so it was removed rather than left
  in config as unexplained cargo. Do not re-try it blind.
- To pursue it: raise `--max-stories` past 6 for this component to capture and grade the tail story
  that actually throws.

---

# Re-sync #3 (2026-09-24, master @ a215a379 -> branch usr/muthu/ids-design-sync)

## The sync state was lost from master AGAIN — this time committed, but on the wrong branch

`.design-sync/{config,conventions,NOTES}.*` and every library fix were committed on
`usr/muthu/synapse-react-components` (a476a127), which was never merged to master. On master the
config was absent (looked like a first sync) and the bundle would have thrown outside Vite again.
Recovered by porting ONLY the IDS-relevant files from that branch onto a fresh branch off master
(the Synapse `main.ts` changes were deliberately left behind). **Merge the sync state into master**, or
every future `/design-sync` run from master starts from nothing.

- `.design-sync/.cache/remote-sync.json` on this machine held the SYNAPSE anchor (55 components),
  because both syncs share `.design-sync/.cache/`. Always re-fetch `_ds_sync.json` from the IDS project
  (3e6c53e3…) before running the driver; never trust the cached copy. (Synapse's copy was moved to
  `.cache/remote-sync.synapse.json`.)

## New this run

- **Storybook-local `import.meta.glob` guards were never committed** (re-sync #2 re-applied them but
  they didn't make it into a476a127). Re-applied and now tracked: `storybook/src/components/{Icon,
  IdsTextBox,Button}.tsx` fall back to `IDS_ICON_URL_BY_SHAPE` when the glob is unavailable. Symptom
  without them: `IdsMainMenuLeft` card `root empty` / `TypeError: import_meta.glob is not a function`
  (its story imports the storybook-local `../MainMenuLeft`, which renders `Icon`).
- **`IdsFormLabel` added (42 components now).** It was missing from the `lib/react/ids/index.ts`
  barrel -> `[TITLE_UNMAPPED] FormLabel`. Fixed by exporting it from the barrel (+ `titleMap`
  `FormLabel`, `docsMap`). **Do NOT fix barrel omissions via `extraEntries`**: `extraEntries` is part
  of every component's grade contract, so adding one cleared all 41 grades; the barrel export is
  grade-neutral.
- **`IdsMainMenuLeft` `ctx.getPrimaryState is not a function` — root-caused.** The storybook-local
  `storybook/src/components/MainMenuLeft.tsx:429` provides a STUB context
  (`{ railExpanded, forceStates } as unknown as MainMenuLeftContextValue`), so any composed
  `MainMenuLeftItem` throws. Only story `SecondaryStateSnapshotMatrix` uses the composition API, and it
  shows Storybook's error display in the reference too. Skipped via
  `overrides.IdsMainMenuLeft.skip`. Repo bug for the storybook demo, not the shipped library; un-skip
  once `MainMenuLeft.tsx` provides a real context value.
- `tsc -p .design-sync/tsconfig.types.json` now exits 0 (the old ~18 errors are gone on master).
- Framing (fold from this run's grading): stories with `parameters.layout: "centered"` (IdsBadge
  Background Showcase, IdsLink Dark Background / State Matrix) shrink-wrap in storybook but stretch
  full width in the preview. Sibling of the `fullscreen` note above — not a defect.
- IdsTooltip stories are all hover/click-gated: neither panel shows a bubble, so the compare only
  verifies the triggers. The bubble itself is unverified by the oracle.
- Grading result this run: 18 components (9 changed/added + 9 reference-drift spot-checks) all `match`,
  zero owned previews authored — still true for the whole roster.
- `_preview/IdsMainMenuLeft.js` is ~5.6 MB: the guarded storybook-local `Icon` now falls back to the
  generated icon registry, which inlines into that one preview. Under the 12 MB cap; if it ever trips
  `[FILE_TOO_LARGE]`, slim via an owned preview rather than removing the guard.

## Re-sync risks — additions from #3

10. **Sync state must live on master.** If `.design-sync/config.json` is missing, check other branches
    (`git log --all -- .design-sync/config.json`) before treating the run as a first sync.
11. **Shared `.design-sync/.cache/` with the Synapse sync** — always re-fetch the IDS anchor.
12. `IdsTooltip` bubbles are never verified by the oracle (all stories hover-gated).
13. `IdsMainMenuLeft` `SecondaryStateSnapshotMatrix` is skipped — un-skip when the storybook-local
    `MainMenuLeft.tsx` provides a real context value.

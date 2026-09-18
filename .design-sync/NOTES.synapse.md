# design-sync notes — Synapse (React)

Repo-specific gotchas for future **Synapse** syncs. Scope: `lib/react/synapse/` (55 components),
Claude Design project `37675bab-666a-4259-85ce-6f0facfde4c3` ("Synapse Design System (React)").

**IDS is a SEPARATE sync in this same repo** — `.design-sync/config.json`, project `3e6c53e3…`,
notes in `.design-sync/NOTES.md`. Read that file too: the IDS sync discovered the asset-registry,
font and MIME issues that this sync inherits wholesale. DAP is not synced.

---

## The two-syncs-in-one-repo layout (read this first)

design-sync resolves `.design-sync/` relative to **cwd**, and every path in both configs is
repo-root relative, so **all commands for both design systems run from the repo root**. The two
syncs therefore SHARE one `.design-sync/` directory and are kept apart by filename:

| | IDS | Synapse |
|---|---|---|
| config | `.design-sync/config.json` | `.design-sync/config.synapse.json` |
| notes | `.design-sync/NOTES.md` | `.design-sync/NOTES.synapse.md` |
| conventions | `.design-sync/conventions.md` | `.design-sync/conventions.synapse.md` |
| storybook config | `storybook/.storybook-ids/` | `storybook/.storybook-synapse/` |
| reference storybook | `.design-sync/sb-reference/` | `.design-sync/sb-reference-synapse/` |
| theme build artifact | `.design-sync/ids-theme-bundle.css` | `.design-sync/synapse-theme-bundle.css` |
| output dir | `ds-bundle/` | `ds-bundle-synapse/` |

`lib/react/synapse/.design-sync/README.md` is a signpost only — it holds no config.

**What is safely shared and what is not.** Component names never collide (`Ids*` vs `Synapse*`),
so `.design-sync/previews/` (owned, durable) and `.design-sync/.cache/compare/*.grade.json` coexist
fine, and **scoped** `compare.mjs --components` runs leave the other system's grades untouched
(verified this sync: 41 IDS grade files survived every Synapse run).
**BUT a full `package-build.mjs` prunes `.design-sync/.cache/previews/` to the roster it just
built** — the first Synapse build removed all 41 `Ids*.tsx` generated previews. That cache is
gitignored and regenerated on the next IDS build, and IDS authored **zero** owned previews, so
nothing durable was lost. Still: **do not interleave the two syncs.** Finish one, then run the
other; the second one's first build will re-generate its own preview cache.

## Shape & scoping

- Shape is `storybook`. The DS package is `storybook/` (`synapse-storybook`), whose
  `.storybook/main.ts` indexes IDS + DAP + Synapse.
- design-sync derives a component name from the story title's **last segment**, so
  `Components/Synapse/Button` and `Components/IDS/Button` collide onto one component.
  Fix: `storybook/.storybook-synapse/` — a Synapse-only config that spreads the real
  `../.storybook/main.ts` and narrows `stories` to `src/components/lib-generated/Synapse*.stories.tsx`.
  `preview.tsx` re-exports the real preview so decorators are identical.
  **`cfg.storybookConfigDir` points at it. Build `sb-reference-synapse` with THAT config.**
- `src/components/lib-generated/` holds **96** story files: 41 UNPREFIXED IDS ones
  (`Button.stories.tsx` → `Components/IDS/Button`) and 55 `Synapse*` ones. The prefix is the only
  thing separating them.
- **Repo fix made this sync:** `storybook/.storybook-ids/main.ts` read *every* `.stories.tsx` in
  `lib-generated/`, which since the Synapse work means it also indexed the 55 Synapse stories —
  exactly the collision that config exists to prevent. Added `&& !/^Synapse/.test(f)` to its
  filter. **Without it the next IDS re-sync would have mis-mapped components.**
- 55 titles → 55 components, 356 story entries, 301/301 stories paired. No `[TITLE_UNMAPPED]`.

## Config knobs and why

- `entry: lib/react/synapse/index.ts` — no build step and no `dist/`; esbuild compiles TS source
  directly. There is no compiled artifact to prefer.
- `extraEntries: ["./lib/react/synapse/index.ts"]` — the export gate is normally fed from the
  package's `.d.ts`; listing the barrel there populates it. Same reason as the IDS config. Do not remove.
- **`titleMap` keys are SPACE-STRIPPED.** design-sync derives the component name from the title tail
  with spaces removed, so the key for `Components/Synapse/Anchor Menu` is `AnchorMenu`, **not**
  `Anchor Menu`. Getting this wrong silently drops components: the first build shipped only 27 of 55
  with `[TITLE_UNMAPPED]` naming the 28 space-containing tails. Non-obvious values:
  `Tab → SynapseTabs`, `Toast → SynapseToastItem`, `RadioButton → SynapseRadioGroup`,
  `ComboBox/MultiSelect/SingleSelect → SynapseDropdown*` (their titles nest under `Dropdown/`).
- `docsMap` — 48 explicit entries → `components/synapse/<slug>/design-spec.md`. Names are
  `SynapseButton` while doc dirs are `button`, so neither basename nor dir-slug matching can pair
  them. **Several slugs exist twice** (`tab`/`tabs`, `progress-bar`/`progressbar`,
  `radio-button`/`radiobutton`, `text-input`/`textinput`, `left-nav`/`leftnav`,
  `app-launcher`/`applauncher`, `recommendation-feedback`/`recommendationfeedback`): the
  **hyphenated** one is always the larger, newer, canonical spec — the unhyphenated twin is a
  2026-06-12 auto-generated stub. The map points at the hyphenated ones.
  Specs are truncated to ~8 KB in `.prompt.md`; that is the converter's cap, not an error.
- `[DOCS_UNMAPPED]` for 7 components with **no Synapse design-spec at all** — `SynapseDashboard`,
  `SynapseDualListBox`, `SynapseError`, `SynapseGetStarted`, `SynapseHelper`, `SynapseStatusBar`,
  `SynapseWhatsNew`. Their `.prompt.md` is synthesized from the `.d.ts` + previews. Expected, not a bug.
- `cssEntry: .design-sync/synapse-theme-bundle.css` — a BUILD ARTIFACT, see below.
- `extraFonts` — the bare `.woff2`. The converter warns
  `add a matching @font-face ... to use it`; the actual `@font-face` arrives through `cssEntry`
  (see below), and the build then reports `fonts: 2 @font-face rule(s) → fonts/`. The warning is
  cosmetic once that line appears.

## Theming — load-bearing

`components/synapse-theme.css` is the **mirror image of IDS**: the bulk of its tokens are already
declared at a bare `:root`, so Synapse mostly works with no attribute. Two things are not:

1. **~25 programme layout aliases** — every control radius (`--button-control-radius`,
   `--card-control-radius`, `--modal-control-radius`, …), `--button-focus-ring-*`, and the
   chat-input shell metrics — live under
   `html[data-design-system="synapse"], body[data-design-system="synapse"]`.
   Storybook sets that attribute from the `.storybook/preview.tsx` decorator (it derives the design
   system from `context.title`); a design built on claude.ai/design does NOT control its page shell.
   Without a `:root` binding every `border-radius: var(--button-control-radius)` drops and the whole
   system renders square-cornered with no focus rings.
2. **The font.** `synapse-theme.css` pulls Roboto via a remote Google Fonts `@import`. A CSS
   `@import` is only honoured at the TOP of a stylesheet and design-sync **appends** `cssEntry` into
   the bundle CSS, so the rule is silently ignored → chromium-default serif in every design, and
   **the compare oracle cannot see it** (both panels would differ, but `[FONT_MISSING]` is the only
   signal). Roboto ships as a local variable font instead.

Both are handled by `node scripts/build_synapse_sync_theme.mjs`, which writes
`.design-sync/synapse-theme-bundle.css`. **Re-run it after editing either theme file.** It:
- hoists the programme-alias selector to `:root, html[...], body[...]` (safe because the synced
  bundle contains only Synapse; dark mode still requires `[data-theme="dark"]`);
- drops remote `@import`s;
- concatenates `components/synapse-theme-fallbacks.css` (hand-maintained; currently only the Roboto
  `@font-face` pointing at `assets/fonts/roboto/roboto-variable-latin.woff2`, the same file IDS ships).

The `:root` hoist is **verified visually**: SynapseButton's rounded corners are identical to the
storybook render, which they could not be if `--button-control-radius` were unresolved.

## Vite-only asset mechanisms (inherited from IDS — all four re-applied this sync)

`lib/react/synapse` itself is clean, but it re-exports IDS components, so every IDS asset issue is a
Synapse issue. `import.meta.glob` and `?raw` are Vite-only; esbuild yields empty/non-string, so icons
render as missing boxes and raw SVGs render as literal `data:image/svg+xml,…` text.
Fixed by `lib/react/ids/shared/idsAssetRegistry.generated.ts` (1139 icons + 1 image as inlined data
URIs, ~5 MB) with `try/catch` + empty-map fallbacks in `IdsIcon`, `IdsProgressBar`, `IdsTextBox`,
`IdsGetStarted`, and `idsRawSvg(imported, shape)` in both inline registries
(`lib/react/ids/icon/idsIconInlineRegistry.ts`, `storybook/src/components/iconInlineRegistry.ts`).
Vite behaviour stays byte-identical. Bundle is 5.9 MB (cap 12 MB).
**Re-run `node scripts/generate_ids_asset_registry.mjs` after changing `assets/icons`/`assets/images`
or adding `?raw` imports.**

Confirmed working this sync: SynapseIcon's gear glyph renders on BOTH panels.

## Environment

- All design-sync commands run from the **repo root**.
- `--node-modules storybook/node_modules` (it has react/react-dom/@types).
- `node_modules/@types/react{,-dom}` are symlinks into `storybook/node_modules/@types/`.
  **`node_modules` is gitignored — recreate them on a fresh clone** or every emitted props body is empty.
- **Chromium needs `LD_LIBRARY_PATH=$PWD/.ds-sync/syslibs/root/usr/lib/x86_64-linux-gnu`** on this
  machine (system libs downloaded without root via `apt-get download` + `dpkg -x`). `.ds-sync/` is
  gitignored, so re-download on a fresh clone. **Every compare/validate command needs it.**
- **`.ds-sync/storybook/http-serve.mjs` has no `.svg` in its MIME map** (still true upstream as of
  skill 2.1.265 — diffed this sync). SVGs served as `application/octet-stream` are refused as CSS
  masks, so the storybook panel photographs with NO icons and every icon-bearing component
  mis-grades as "the preview renders more than the reference". `.ds-sync/` is re-copied from the
  skill bundle every sync, so **RE-APPLY `cp .design-sync/http-serve.mime-patch.mjs
  .ds-sync/storybook/http-serve.mjs` after every `cp -r`, before grading anything.**

## Component API types (`.d.ts`)

The library ships no `.d.ts`. `.design-sync/tsconfig.types.json` now covers **both** `lib/react/ids`
and `lib/react/synapse` (plus `lib/react/shared`) in one project, emitting `.design-sync/types/**`,
because root `package.json` has a single `"types"` pointer that both syncs read:

    ./storybook/node_modules/.bin/tsc -p .design-sync/tsconfig.types.json

tsc exits 2 with ~18 non-fatal errors (asset imports, `import.meta.env/glob`) but **emits correctly**
— do not chase them, do not add `noEmitOnError`. 198 `.d.ts` parsed (120 ids + 69 synapse + shared).
**Re-run after changing component props.**

## Known render warns (triaged — a warn NOT in this list is new)

- `[TOKENS_MISSING]` 10 properties. These are referenced by IDS component CSS that Synapse
  re-exports but defined in `components/ids-theme.css` **only** under `html[data-design-system="ids"]`:
  `--color-background-alerting-info-base`, `--color-icon-alerting-info-base`,
  `--color-icon-alerting-minor-base`, `--color-background-alerting-success-base`,
  `--color-background-disabled`, `--color-border-alerting-minor-strong-transparent`,
  `--color-icon-alerting-success-base`, `--color-background-surface-overlay`, and 2 more.
  **This is a pre-existing repo bug, not a sync artifact:** under a Synapse story the attribute is
  `"synapse"`, so these do not resolve in the repo's own Storybook either — the reference and the
  preview are in the SAME token state, which is why the compare sheets agree. Graded SynapseAlert
  exhaustively for this reason: all severity fills, icons and tints render correctly on both panels,
  so nothing visible is currently driven by these 10. Deliberately NOT patched into
  `synapse-theme-fallbacks.css`, because doing so would make previews diverge from the reference and
  would silently invent Synapse values from IDS. **Decide upstream whether Synapse should define
  them in Figma.**
- `[GRID_OVERFLOW]` on 25 components — presentation only, all resolved via `cfg.overrides`
  (`cardMode: "column"` ×15 for stories wider than a grid cell, `cardMode: "single"` ×10 for
  portal/fixed content, each with a `primaryStory`). Applied in one batch + one targeted rebuild.
- `[RENDER_ERRORS] SynapseAppLauncher`: `IdsAppLauncherSurface must be used within IdsAppLauncher`
  (4). Card-only, non-blocking (validate exits 0).
- `[RENDER_THIN] SynapseChatInputBox`, `SynapseWhatsNew`: "variants render identically".

## Wave learnings

### Solo phase (5 components, all `match`, zero `[GENERAL]` issues)

`SynapseButton` (simple), `SynapseDropdownComboBox` (portal/overlay), `SynapseIcon` (asset canary),
`SynapseCard` (text-heavy), `SynapseAlert` (token canary). Every story graded `match`.
**No global issue surfaced** — the theme `:root` hoist, the local font, the asset registry and the
MIME patch were all applied from the IDS notes BEFORE the first compare, which is exactly why.

Framing effects that are NOT defects (check here first):
- **Overlay components clip on the STORYBOOK side.** Its canvas is only ~220px tall, so open
  portalled menus are cut off there while the preview renders the full portal. A preview that renders
  MORE than the clipped reference is not a delta (all four ComboBox menu stories).
- The preview page has ~24px body padding while the storybook canvas is full-bleed, and preview raws
  are captured into a fixed 900×700 viewport while the storybook capture grows to the story root's
  height. Judge the component, not its surroundings; compare from the component's own top edge.
- Downscaled sheet images shift thin-stroke hues and apparent font weight — zoom the raw
  (`_screenshots/compare/raw/…__sb.png` / `…__ds.png`) before calling it a defect.
- Unlike the IDS roster, Synapse `<button>` text DOES render in Roboto:
  `lib/react/ids/button/IdsButton.module.css` sets
  `font-family: var(--typography-font-style-primary, "Roboto", sans-serif)`.

- `[STORY_CAP]` (6 stories/component) truncated grading for: Button 6/9, Card 6/8,
  DropdownComboBox 6/8. Raise with `--max-stories` if those tail stories carry distinct variants.

### Wave 1 fan-out (28 components, all `match`, zero preview `.tsx` authored)

Batches: A dropdowns/inputs, B overlays/nav, C date+data, D chat/AI. **Every story graded `match`
on the first compare pass in all four batches**, with no owned previews and (except SynapseWhatsNew
below) no config edits. The generated previews reproduced every story faithfully. Combined with the
solo phase that is **33/55 verified with zero `[GENERAL]` defects** — the theming/font/asset work
done before the first compare is what bought that.

Framing effects confirmed NOT to be defects (check here before chasing anything):
- [GENERAL] **Storybook uses subpixel/LCD text antialiasing, the preview uses greyscale.** Small
  text (placeholders, helper text) shows tan/blue colour fringing on the storybook raw at 1x and
  none on the preview raw. Zoom 3x pixelated before calling any small-text colour difference a
  defect — at 3x both panels are the same greys.
- [GENERAL] **Preview = fixed 900x700 viewport + ~24px body padding; storybook = full-bleed, grows
  to the story root's height.** e.g. AnchorMenu "Sticky With Page Content" is sb 872x1728 vs
  ds 900x700. Content missing ONLY because it fell below 700px, or shifted right by 24px, is
  framing. Compare from the component's own top-left edge.
- **Downscaled sheets are unreliable for SIZE judgments.** An apparent SynapseDropdownButton size
  delta vanished when the trigger bbox was measured in both raws: exactly 161x32 on each.
- Portal clip on the STORYBOOK side re-confirmed (SynapseDropdownSingleSelect/MultiSelect,
  SynapseTimePicker "24 Hour — No Seconds"). SynapseDatePicker's Calendar Open stories are NOT
  clipped — that canvas is tall enough. SynapsePagination's portalled listbox renders complete on both.
- SynapseModal / SynapseTooltip stories are all **trigger-only** (closed until click/hover), so both
  panels photograph just the trigger. That is faithful; the `[PORTAL?]` risk for those two is
  card-layout only.

**No image tooling on this machine** (no PIL, ImageMagick or sharp). To zoom a raw: drive
`.ds-sync/node_modules/playwright` chromium at a data-URI `<img>` with
`transform: scale(n); image-rendering: pixelated` and screenshot it. `file://` srcs do NOT load
under `page.setContent` — base64 the PNG instead.

**SynapseWhatsNew — verified off the standard sheet (same as IDS's equivalent).** All 4 stories
report `sb-error: no storybook root content` and compare captures nothing on EITHER panel, because
the component portals its dialog to `document.body`, leaving `#storybook-root` empty; compare waits
for content inside that root and gives up before photographing. **The stories are NOT broken — do
NOT `skip` them.** Verified with an out-of-band 900x700 capture of both the storybook iframe and
`SynapseWhatsNew.html?story=<Export>`: all four pixel-identical. Expect the same next sync and
re-verify the same way. `cardMode: "single"` + `primaryStory: "ConvenienceDataSections"` applied —
that is the only story with populated sections.

### Upstream component findings (NOT sync defects — both panels agree; worth a separate look)

- **`SynapseChatInputBox`**: `"withButtons"` is a member of the `SynapseChatInputLayout` union but
  **no branch in `lib/react/synapse/chat-input-box/SynapseChatInputBox.tsx` reads it** — the prop is
  a no-op, which is the real cause of `[RENDER_THIN] variants render identically`. Separately, the
  default story passes `suggestedPrompts`, but `promptsAboveInput` requires
  `layout === "withSuggestedPromptsV"|"withSuggestedPromptsH"` (or `sessionMode === "newChat"`), so
  they are silently dropped. Fix belongs in the component/stories; the preview is correct.
- **`SynapseWhatsNew`**: 3 of 4 stories (SpecAccurateDesign, NestedHierarchy, BookmarkedSections)
  render an EMPTY sections area on both panels — the real content behind its `[RENDER_THIN]` warning.
- **`SynapseSuggestedPrompt`**: `aiGradient` chips render flat (plain bordered chip, no gradient) on
  both panels — component-level gap.
- **`SynapseToggleSwitch`**: the "Without Visible Label" story renders a visible "Enable alerts"
  label on both panels.

### Wave 2 fan-out (22 components) + the one real global defect

Batches: E status/feedback (8), F layout/shell (7), G content/misc (7). E and G graded **match** on
the first pass with no preview edits and no config changes. F found the sync's only `[GENERAL]` defect:

#### THE ds-shim module-split bug (fixed via `cfg.storyImports.shim`) — read before touching storyImports

**Symptom:** `SynapseAppLauncher` stories that compose compound children explicitly
(`DeterministicAnatomy`, both `NestedHierarchy*`, `NestedTriggerAndSurface`) rendered **blank** in the
preview and threw `IdsAppLauncherSurface must be used within IdsAppLauncher.` The reference storybook
rendered all of them with zero page errors, so it was a sync defect, not a repo bug.

**Root cause:** the story imports the SUBPATH `@synapse/react/app-launcher`. In
`lib/story-imports.mjs` rule 1, a subpath whose tail isn't itself a bundle export
(`exported.has("app-launcher")` is false) **bundles from source** rather than shimming. esbuild then
inlines `lib/react/synapse/app-launcher/index.ts`, and inside it:
- `./SynapseAppLauncher` DOES match a bundle export, so rule 2 shims it to `window.SynapseReact` —
  the ROOT comes from the prebuilt bundle;
- `../../ids/app-launcher` (which the barrel re-exports as `SynapseAppLauncher*`) matches nothing, so
  it is **inlined as a SECOND copy**.

Two copies of the IDS module ⇒ two `createContext()` objects ⇒ the Provider rendered by the bundle
copy is invisible to consumers from the inlined copy. Confirmed single React and a single
`Symbol.for("ids.app-launcher.slot")`, so it is module duplication, not React duplication.

**Fix applied:**
```json
"storyImports": { "shim": ["lib/react/synapse/app-launcher/index", "lib/react/synapse/left-nav/index"] }
```
Rule 2 matches the resolved BARREL path; `exportedComponentFor()` returns null for an `index` file
whose directory isn't an export name, so it yields the **whole-namespace** shim
(`shimResult(null)` → `export * from "__ds_raw__"`). Root and all 16 compound parts then come from
`window.SynapseReact` — one copy, context intact. Verified: the preview's shim marker changed from
`ds-shim:ds:SynapseAppLauncher` to `ds-shim:ds`, the inlined copy is gone
(`grep -c "must be used within IdsAppLauncher" _preview/SynapseAppLauncher.js` → 0), and all three
previously-blank stories now render and grade `match`.

**Do NOT instead shim `lib/react/ids/app-launcher`:** the Synapse barrel imports the ORIGINAL
`IdsAppLauncher*` names from it, and the global only exports `Synapse*` names, so that shim resolves
to undefined.

**Blast radius / trigger shape** — a façade is affected when ALL THREE hold:
1. `strategy: wrapper` (it has its own `Synapse<X>.tsx` matching a bundle export, so the root shims), AND
2. its `index.ts` re-exports compound children straight from `../../ids/<x>`, AND
3. a story composes those children explicitly.

Exactly two façades match (1)+(2): **`app-launcher`** and **`left-nav`**
(`grep -n "ds-shim" ds-bundle-synapse/_preview/*.js` showed shims only for those two roots).
`SynapseAppShell` embeds both shims but its stories never compose their children, so it escaped.
Pure `strategy: reexport` façades get no shim and are immune.
**When a new `wrapper`-strategy façade is added to `react-strategy.json`, add its barrel to
`cfg.storyImports.shim`** — or expect blank compound stories.

Changing `storyImports` cleared grades for exactly the 3 components that embed those shims
(AppLauncher, LeftNav, AppShell); the other 52 carried forward. All 3 re-graded `match`.

#### Framing effects added this wave
- [GENERAL] Stories with `layout: "centered"` render a shrink-to-fit root in storybook but a
  full-width block in the preview, so showcase wrappers with a background stretch edge-to-edge in the
  preview (SynapseBadge "Background Showcase"). Components inside are pixel-identical — framing.
- [GENERAL] Block-level content inside a story wrapper (`display:grid`, padded decorator div,
  stretch grid column) renders content-width in storybook and full 900px in the preview. Hit
  SynapseLink, SynapseEmptyState, SynapseSegmentedButton.
- Downscaled sheets also distort small ICONS, not just text: SynapseFooter's copy-to-clipboard glyph
  reads as an external-link arrow until you open the raw.
- SynapseSkeletonLoader card bbox measured 316x277 (sb) vs 318x279 (ds) — same, offset by padding.

### Upstream component findings from wave 2 (both panels agree — NOT sync defects)

- **`SynapseTag`** (accessibility): the green (success) and blue (info) read-only alerting tones
  render **white label text on a white fill** — invisible. Worth fixing upstream.
- **`SynapseSkeletonLoader`** "Variants": the shimmer placeholder fill is effectively the same value
  as the page background, so the story photographs as an empty surface on both panels.
- **`SynapseErrorCard`**: the leading icon renders as a plain red square.
- **`SynapseSegmentedButton`** "State Matrix Text Dark" does not actually go dark — the story sets
  `parameters.globals.theme`, which `.storybook/preview.tsx`'s decorator does not read (it reads
  `context.globals.theme`). It duplicates the light matrix in storybook too.

## COST LESSON — `storyImports` is a ROSTER-WIDE grade-contract key

The `cfg.storyImports.shim` fix above was discovered in wave 2, after 48 components had already been
graded. Adding the key **cleared 51 of 55 grades** and forced a second full grading pass.

A scoped `compare.mjs --components A,B,C` right after the edit reported only 3 cleared — but that is
just the scoped view. The next FULL driver run cleared everything, because `storyImports` (like
`provider`, `extraEntries`, `overrides` and `titleMap`) is part of every component's stamped grade key,
not just the components whose previews actually embed the affected shims.

**Next sync: settle `storyImports` / `provider` / `extraEntries` BEFORE the first compare run.**
The cheap way to find shim splits up front, before grading anything:

    grep -o "ds-shim:[a-zA-Z:]*" ds-bundle-synapse/_preview/*.js | sort -u

Any preview whose marker is `ds-shim:ds:<ComponentName>` (a NAMED shim, not the whole-namespace
`ds-shim:ds`) and whose façade re-exports compound children from `../../ids/<x>` is a candidate for
the module-split bug. Cross-check against `strategy: wrapper` entries in
`lib/react/synapse/react-strategy.json`. Fix them all in one config edit, then grade.

**Outcome of the forced re-grade (verified, not assumed):** all 51 re-captured components graded
`match` again, with **zero regressions** attributable to the bundle change. The fix's target cases —
SynapseAppLauncher's compound stories, SynapseWizard's `Compound Anatomy`, SynapseTabs' Tab context,
SynapseDropdownButton's trigger slot — all render with intact context, and the three asset canaries
(GetStarted honeycomb hero, Icon gear glyph, Masthead glyph set) still render on the preview side.
So the fix was safe; the ordering merely cost a full re-grade, which is what this section exists to
prevent next time.

Also: the playwright zoom trick needs the SAME `LD_LIBRARY_PATH` prefix as every other chromium call
on this machine, or it dies with `libnspr4.so: cannot open shared object file`. Reading the full-res
raws directly is the cheaper fallback and was sufficient in every borderline case this sync.
